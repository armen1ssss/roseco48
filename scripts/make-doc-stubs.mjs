/**
 * Заглушки документов для /docs/*.pdf — вместо настоящих сканов.
 *
 * Рендерит HTML через Chromium, поэтому в PDF корректно попадает кириллица.
 * Запуск: node scripts/make-doc-stubs.mjs
 *
 * Перед публикацией заменить файлы в public/docs на отсканированные документы
 * (те же имена — правки в lib/content.ts не нужны).
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const docs = [
  {
    file: 'public/docs/attestat.pdf',
    label: 'Приложение',
    title: 'Аттестат аккредитации испытательной лаборатории',
    note: 'Действует до … · RA.RU.…  ·  выдан Федеральной службой по аккредитации',
  },
  {
    file: 'public/docs/oblast-akkreditacii.pdf',
    label: 'Область аккредитации',
    title: 'Область аккредитации: перечень показателей и методик',
    note: 'Вода, почва, воздух, отходы, физические факторы · методы ПНД Ф, ГОСТ, ГОСТ Р',
  },
  {
    file: 'public/docs/licenziya.pdf',
    label: 'Лицензия',
    title: 'Лицензия на деятельность по обращению с отходами I–IV классов опасности',
    note: 'Номер и срок действия — по реестру лицензий Росприроднадзора',
  },
];

const page = (doc) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><title>${doc.title}</title>
<style>
  @page { size: A4; margin: 20mm 18mm; }
  body { font: 14px/1.55 Arial, Helvetica, sans-serif; color: #2E2718; }
  .frame { border: 1.5px dashed #9E4622; border-radius: 10px; padding: 22mm 16mm; min-height: 225mm; box-sizing: border-box; text-align: center; }
  .label { display: inline-block; padding: 4px 12px; border-radius: 999px; background: #F9E1D2; color: #9E4622; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
  h1 { font-size: 21px; line-height: 1.25; margin: 18px 0 8px; }
  .note { color: #55606C; font-size: 13px; margin: 0 0 26px; }
  .stub { color: #55606C; font-size: 13px; }
  .stub b { display: block; color: #2E2718; font-size: 15px; margin-bottom: 6px; }
  .sign { margin-top: 40mm; color: #8C866F; font-size: 12px; }
</style></head>
<body><div class="frame">
  <p class="label">${doc.label}</p>
  <h1>${doc.title}</h1>
  <p class="note">${doc.note}</p>
  <p class="stub"><b>Это заглушка, а не документ.</b>
  Файл лежит на месте, чтобы ссылки на сайте работали. Перед публикацией замените его сканом:<br>
  public/docs/${doc.file.split('/').pop()} — имя оставьте прежним.</p>
  <p class="sign">ГК «РОСЭКО» · Липецк, ул. М.И. Неделина, д. 1В, офис 201/202</p>
</div></body></html>`;

mkdirSync('public/docs', { recursive: true });
const browser = await chromium.launch();

for (const doc of docs) {
  const context = await browser.newContext();
  const tab = await context.newPage();
  await tab.setContent(page(doc), { waitUntil: 'load' });
  await tab.pdf({ path: doc.file, format: 'A4', printBackground: true });
  await context.close();
  console.log('✓', doc.file);
}

await browser.close();
