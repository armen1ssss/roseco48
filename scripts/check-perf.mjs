/**
 * Замер Core Web Vitals в реальном браузере: CLS и LCP.
 * Смотрит мобильный профиль (медленный процессор, 4G) и десктоп.
 * Запуск: npm start & → node scripts/check-perf.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const pages = ['/', '/uslugi/analiz-vody', '/ceny', '/otrasli', '/dokumenty', '/o-kompanii', '/kontakty'];
const profiles = [
  { name: 'мобильный', width: 390, height: 844, dpr: 3, cpu: 4 },
  { name: 'десктоп  ', width: 1440, height: 900, dpr: 1, cpu: 1 },
];

const browser = await chromium.launch();
const rows = [];
let fail = 0;

for (const profile of profiles) {
  for (const path of pages) {
    const context = await browser.newContext({
      viewport: { width: profile.width, height: profile.height },
      deviceScaleFactor: profile.dpr,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    if (profile.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });

    await page.addInitScript(() => {
      window.__cls = 0;
      window.__lcp = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__lcp = Math.max(window.__lcp, entry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });

    await page.goto(BASE + path, { waitUntil: 'load' });
    // прокрутка «как человек»: догружает отложенные блоки, копит сдвиги
    await page.evaluate(async () => {
      const pause = (ms) => new Promise((d) => setTimeout(d, ms));
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await pause(70);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(700);

    const metrics = await page.evaluate(() => ({ cls: window.__cls, lcp: Math.round(window.__lcp) }));
    const bad = metrics.cls > 0.1;
    if (bad) fail += 1;
    rows.push({ profile: profile.name, path, ...metrics, bad });
    await context.close();
  }
}

await browser.close();

console.log('профиль     страница                 CLS      LCP      оценка');
for (const row of rows) {
  const cls = row.cls.toFixed(3);
  const verdict = row.cls === 0 ? 'ok' : row.bad ? 'ПРОВЕРИТЬ' : `ok (порог 0.1)`;
  console.log(`${row.profile}  ${row.path.padEnd(24)} ${cls.padStart(6)}   ${String(row.lcp).padStart(5)} мс  ${verdict}`);
}
console.log('');
console.log(fail === 0 ? '✓ Смещений макета выше порога нет (CLS ≤ 0.1 на всех страницах)' : `✗ Страниц с CLS выше порога: ${fail}`);
process.exit(fail === 0 ? 0 : 1);
