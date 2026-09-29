/**
 * Доступность: axe-core в реальном браузере, десктоп и мобильный.
 *
 * Запуск:  npm start &  →  npm run check:a11y
 * Проверяются правила WCAG 2.1/2.2 AA: контрасты, подписи полей,
 * альтернативный текст, landmarks, порядок заголовков, размер целей.
 */
import { chromium } from 'playwright';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const pages = ['/', '/uslugi', '/uslugi/analiz-vody', '/ceny', '/otrasli', '/o-kompanii', '/dokumenty', '/kontakty', '/politika'];
const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const violations = [];
const browser = await chromium.launch();

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();

  for (const path of pages) {
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.addScriptTag({ path: axePath });
    const result = await page.evaluate(async () => {
      // @ts-expect-error axe подключается скриптом
      return await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      });
    });

    for (const violation of result.violations) {
      const nodes = violation.nodes.slice(0, 2).map((node) => node.target.join(' ')).join(' | ');
      violations.push(`[${viewport.name} ${path}] ${violation.id} (${violation.impact}): ${violation.help}\n      ${nodes}`);
    }
  }

  await context.close();
}

await browser.close();

if (violations.length === 0) {
  console.log('✓ Доступность: нарушений WCAG AA не найдено');
} else {
  console.log(`✗ Нарушений: ${violations.length}`);
  for (const violation of violations) console.log('  •', violation);
}
process.exit(violations.length === 0 ? 0 : 1);
