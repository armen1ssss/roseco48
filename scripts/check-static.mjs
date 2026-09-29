#!/usr/bin/env node
/**
 * Проверка статической сборки out/ перед публикацией на GitHub Pages.
 *
 * Pages отдаёт сайт из подпапки репозитория (/roseco48) и ничего не умеет
 * достраивать: ни маршруты, ни префикс пути. Ссылка, забывшая подпапку,
 * работает в dev и превращается в 404 на живом сайте — как раз тот случай,
 * который не видно до публикации. Скрипт проходит по собранным файлам и
 * проверяет:
 *
 *   1) обязательные файлы сборки на месте (.nojekyll, 404.html, sitemap.xml,
 *      robots.txt, фото и документы);
 *   2) все внутренние ссылки, картинки и url() в CSS начинаются с base path
 *      и ведут на существующий файл в out/;
 *   3) canonical, og:image, og:url, sitemap.xml и robots.txt указывают на
 *      реальный адрес сайта вместе с подпапкой;
 *   4) шрифты из @font-face лежат в сборке.
 *
 * Запуск (после npm run build:static):
 *   NEXT_PUBLIC_BASE_PATH=/roseco48 \
 *   NEXT_PUBLIC_SITE_URL=https://armen1ssss.github.io \
 *   npm run check:static
 *
 * Код возврата 1 — публиковать нельзя: на сайте будут битые адреса.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');
const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/+$/, '');
const SITE = origin ? origin + BASE : '';

const problems = [];
const notes = [];
let linksChecked = 0;

/** Все файлы сборки (относительные пути от out/). */
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full.slice(OUT.length + 1));
  }
  return acc;
}

if (!existsSync(OUT)) {
  console.error(`Нет папки ${OUT}/ — сначала соберите статику: npm run build:static`);
  process.exit(1);
}

const files = walk(OUT);
const has = (rel) => existsSync(join(OUT, rel));

/* ---------- 1. Обязательные файлы ---------- */
for (const required of [
  'index.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  '.nojekyll',
  'photos/hero.jpg',
  'docs/attestat.pdf',
]) {
  if (!has(required)) problems.push(`нет обязательного файла: ${required}`);
}

/* ---------- Разрешение внутреннего адреса в файл сборки ---------- */
/**
 * /roseco48/uslugi → uslugi.html или uslugi/index.html.
 * Pages отдаёт страницы без расширения, поэтому проверяем оба варианта.
 */
function resolveInternal(url) {
  // Путь может быть закодирован (%5Bslug%5D — папка динамического маршрута)
  let path = url.split(/[?#]/)[0];
  try {
    path = decodeURIComponent(path);
  } catch {}
  if (BASE && path !== BASE && !path.startsWith(`${BASE}/`)) return { prefixed: false };
  const rel = path.slice(BASE.length).replace(/^\//, '');
  const candidates = rel === ''
    ? ['index.html']
    : [rel, `${rel}.html`, `${rel}/index.html`, `${rel}/`];
  for (const candidate of candidates) {
    if (candidate.endsWith('/')) {
      if (has(`${candidate}index.html`)) return { prefixed: true, file: `${candidate}index.html` };
    } else if (has(candidate)) {
      return { prefixed: true, file: candidate };
    }
  }
  return { prefixed: true, file: null, path };
}

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

function checkUrl(url, where) {
  if (!url || EXTERNAL.test(url)) return;
  if (!url.startsWith('/')) return;
  linksChecked += 1;
  const resolved = resolveInternal(url);
  if (!resolved.prefixed) {
    problems.push(`${where}: адрес без подпапки ${BASE} — ${url}`);
  } else if (!resolved.file) {
    problems.push(`${where}: адрес ведёт в никуда — ${url}`);
  }
}

/* ---------- 2. HTML: ссылки, картинки, метаданные ---------- */
const pages = files.filter((f) => f.endsWith('.html'));

for (const page of pages) {
  const html = readFileSync(join(OUT, page), 'utf8');

  for (const match of html.matchAll(/\s(?:href|src|action|poster)="([^"]*)"/g)) {
    checkUrl(match[1], page);
  }

  // srcset="a.jpg 1x, b.jpg 2x"
  for (const match of html.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const part of match[1].split(',')) {
      checkUrl(part.trim().split(/\s+/)[0], page);
    }
  }

  if (SITE) {
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    if (!canonical) problems.push(`${page}: нет canonical`);
    else if (!canonical.startsWith(SITE)) problems.push(`${page}: canonical указывает не на сайт — ${canonical}`);

    for (const property of ['og:image', 'og:url']) {
      const value = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`))?.[1];
      if (value && !value.startsWith(SITE)) {
        problems.push(`${page}: ${property} без подпапки или чужого домена — ${value}`);
      }
    }
  }
}

/* ---------- 3. CSS: url() и шрифты ---------- */
const cssFiles = files.filter((f) => f.endsWith('.css'));
const fontUrls = [];

for (const css of cssFiles) {
  const source = readFileSync(join(OUT, css), 'utf8');
  for (const match of source.matchAll(/url\((?:"|')?([^"')]+)(?:"|')?\)/g)) {
    const url = match[1].trim();
    if (url.startsWith('data:')) continue;
    if (url.endsWith('.woff2') || url.endsWith('.woff')) fontUrls.push(url);
    checkUrl(url, css);
  }
}

if (fontUrls.length === 0) problems.push('в CSS нет ни одного шрифта (@font-face)');
for (const url of new Set(fontUrls)) {
  const rel = url.slice(BASE.length).replace(/^\//, '');
  if (!has(rel)) problems.push(`шрифт из CSS не попал в сборку — ${url}`);
}

/* ---------- 4. Клиентский бандл знает подпапку ----------
   Клиентские компоненты собирают адреса через asset(), то есть из
   process.env.NEXT_PUBLIC_BASE_PATH — значение подставляется в бандл при сборке.
   Если префикса нет ни в одном чанке, навигация после загрузки страницы
   начнёт запрашивать адреса без подпапки. */
if (BASE) {
  const chunks = files.filter((f) => f.endsWith('.js'));
  const knowsPrefix = chunks.some((file) => readFileSync(join(OUT, file), 'utf8').includes(BASE));
  if (!knowsPrefix) problems.push(`подпапка ${BASE} не попала в клиентский бандл — проверьте NEXT_PUBLIC_BASE_PATH`);
}

/* ---------- 5. sitemap.xml и robots.txt ---------- */
if (SITE) {
  const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) problems.push('sitemap.xml пуст');
  for (const loc of locs) {
    if (!loc.startsWith(SITE)) problems.push(`sitemap.xml: адрес без подпапки или чужого домена — ${loc}`);
  }

  const robots = readFileSync(join(OUT, 'robots.txt'), 'utf8');
  const sitemapLine = robots.match(/^Sitemap: (.+)$/m)?.[1];
  if (!sitemapLine?.startsWith(SITE)) {
    problems.push(`robots.txt: неверный адрес карты сайта — ${sitemapLine ?? 'нет строки Sitemap'}`);
  }
  if (BASE) {
    for (const match of robots.matchAll(/^Disallow: (.+)$/gm)) {
      if (!match[1].startsWith(BASE)) problems.push(`robots.txt: запрет без подпапки — ${match[1]}`);
    }
  }
} else {
  notes.push('NEXT_PUBLIC_SITE_URL не задан — canonical и sitemap не проверялись');
}

/* ---------- Итог ---------- */
console.log(`Проверка статики: ${OUT}/`);
console.log(`  страниц: ${pages.length}, CSS: ${cssFiles.length}, файлов всего: ${files.length}`);
console.log(`  подпапка: ${BASE || '(корень)'}${SITE ? `, адрес сайта: ${SITE}` : ''}`);
console.log(`  внутренних адресов проверено: ${linksChecked}`);

for (const note of notes) console.log(`! ${note}`);

if (problems.length > 0) {
  console.error(`\nНарушений: ${problems.length}`);
  for (const problem of problems.slice(0, 40)) console.error(`  ✗ ${problem}`);
  if (problems.length > 40) console.error(`  … и ещё ${problems.length - 40}`);
  console.error('\nПубликовать нельзя: на GitHub Pages эти адреса дадут 404.');
  process.exit(1);
}

console.log('\nНарушений не найдено — статику можно публиковать.');
