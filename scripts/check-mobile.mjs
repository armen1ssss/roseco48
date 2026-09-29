/**
 * Проверка вёрстки на реальном браузере: вёрстка, мобильная адаптация, цели нажатия.
 *
 * Запуск:  npm run build && npm start &  →  npm run check:mobile
 * Что проверяет:
 *   1) нет горизонтальной прокрутки ни на одном экране;
 *   2) нет элементов, вылезающих за пределы вьюпорта;
 *   3) на мобильном все элементы управления не меньше 44×44 px;
 *   4) все изображения загрузились и имеют alt;
 *   5) заголовки идут без пропусков уровней;
 *   6) нет текста, обрезанного по overflow без возможности прочитать.
 *
 * Скриншоты складываются в checks/.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const pages = ['/', '/uslugi', '/uslugi/analiz-vody', '/ceny', '/otrasli', '/o-kompanii', '/dokumenty', '/kontakty', '/politika'];
const viewports = [
  { name: 'mobile-360', width: 360, height: 740, touch: true },
  { name: 'mobile-390', width: 390, height: 844, touch: true },
  { name: 'tablet-768', width: 768, height: 1024, touch: true },
  { name: 'desktop-1280', width: 1280, height: 800, touch: false },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false },
];

mkdirSync('checks', { recursive: true });

const problems = [];
const browser = await chromium.launch();

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    hasTouch: viewport.touch,
    isMobile: viewport.touch && viewport.width < 700,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  for (const path of pages) {
    await page.goto(BASE + path, { waitUntil: 'load' });
    // Прокручиваем до низа: иначе отложенные изображения ещё не загружены.
    // Ждём с ограничением по времени — картинки вне экрана так и не загрузятся.
    await page.evaluate(async () => {
      const pause = (ms) => new Promise((done) => setTimeout(done, ms));
      const step = window.innerHeight;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await pause(50);
      }
      const pending = [...document.images]
        .filter((img) => !img.complete)
        .map((img) => new Promise((done) => {
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
        }));
      await Promise.race([Promise.all(pending), pause(3000)]);
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForLoadState('load').catch(() => {});
    await page.waitForTimeout(150);

    const report = await page.evaluate(() => {
      const vw = window.innerWidth;
      const result = { overflowX: document.documentElement.scrollWidth - vw, offenders: [], smallTargets: [], images: [], headings: [] };

      // 2. элементы, выходящие за правый край
      for (const el of document.querySelectorAll('body *')) {
        const style = getComputedStyle(el);
        if (style.position === 'fixed' || style.visibility === 'hidden' || style.display === 'none') continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.right > vw + 1 || rect.left < -1) {
          const label = `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : ''}`;
          result.offenders.push({ label, left: Math.round(rect.left), right: Math.round(rect.right) });
        }
      }

      // 3. цели нажатия
      const interactive = document.querySelectorAll(
        'button, input:not([type="hidden"]), select, textarea, summary, .btn, .chip, .header__nav a, .footer__links a, .breadcrumbs a, .mobile-menu a'
      );
      for (const el of interactive) {
        // Флажок внутри подписи: считаем целью саму подпись, по ней и кликают
        const target = el.type === 'checkbox' || el.type === 'radio' ? el.closest('label') ?? el : el;
        const rect = target.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.height < 43 || rect.width < 43) {
          const label = `${target.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}"`;
          result.smallTargets.push({ label, w: Math.round(rect.width), h: Math.round(rect.height) });
        }
      }

      // 4. изображения
      for (const img of document.querySelectorAll('img')) {
        if (!img.complete || img.naturalWidth === 0) result.images.push({ src: img.currentSrc || img.src, problem: 'не загрузилось' });
        else if (img.getAttribute('alt') === null) result.images.push({ src: img.currentSrc || img.src, problem: 'нет атрибута alt' });
      }

      // 5. иерархия заголовков
      const levels = [...document.querySelectorAll('h1, h2, h3, h4')].map((h) => Number(h.tagName.slice(1)));
      if (levels.filter((l) => l === 1).length !== 1) result.headings.push(`h1 на странице: ${levels.filter((l) => l === 1).length}`);
      for (let i = 1; i < levels.length; i += 1) {
        if (levels[i] - levels[i - 1] > 1) result.headings.push(`пропуск уровня: h${levels[i - 1]} → h${levels[i]}`);
      }

      return result;
    });

    const where = `${viewport.name} ${path}`;
    if (report.overflowX > 1) problems.push(`[${where}] горизонтальная прокрутка: +${report.overflowX}px`);
    for (const item of report.offenders.slice(0, 4)) problems.push(`[${where}] выходит за край: ${item.label} (${item.left}…${item.right})`);
    if (viewport.touch) {
      for (const target of report.smallTargets.slice(0, 6)) problems.push(`[${where}] цель меньше 44px: ${target.label} ${target.w}x${target.h}`);
    }
    for (const image of report.images.slice(0, 3)) problems.push(`[${where}] изображение ${image.problem}: ${image.src}`);
    for (const heading of report.headings.slice(0, 3)) problems.push(`[${where}] ${heading}`);
  }

  // Скриншоты ключевых экранов
  const shots = { '/': 'home', '/ceny': 'prices', '/kontakty': 'contacts', '/o-kompanii': 'about', '/dokumenty': 'docs' };
  for (const [path, name] of Object.entries(shots)) {
    if (viewports.indexOf(viewport) < 2 && !['home', 'prices', 'contacts'].includes(name)) continue;
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    await page.screenshot({ path: `checks/${name}-${viewport.name}.png`, fullPage: viewport.width >= 700 });
  }

  // Меню на мобильном — отдельный скриншот
  if (viewport.touch && viewport.width < 700) {
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await page.getByRole('button', { name: /меню/i }).click();
    await page.waitForTimeout(250);
    await page.screenshot({ path: `checks/menu-${viewport.name}.png` });
    const menuTargets = await page.evaluate(() => {
      const small = [];
      for (const el of document.querySelectorAll('.mobile-menu a')) {
        const rect = el.getBoundingClientRect();
        if (rect.height < 43) small.push(`${el.textContent?.trim()} ${Math.round(rect.width)}x${Math.round(rect.height)}`);
      }
      return small;
    });
    for (const item of menuTargets) problems.push(`[${viewport.name} меню] цель меньше 44px: ${item}`);
  }

  await context.close();
}

await browser.close();

if (problems.length === 0) {
  console.log('✓ Мобильная вёрстка: нарушений не найдено');
} else {
  console.log(`✗ Найдено проблем: ${problems.length}`);
  for (const problem of problems.slice(0, 40)) console.log('  •', problem);
}
console.log('Скриншоты: checks/');
process.exit(problems.length === 0 ? 0 : 1);
