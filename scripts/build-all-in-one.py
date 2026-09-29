#!/usr/bin/env python3
"""
Собирает вторую версию офлайн-файла: preview-all.html — ВСЕ страницы подряд.

Отличие от preview-main.html:
  * ничего не надо нажимать: 14 страниц идут одна за другой, листайте вниз;
  * ни одного скрипта — только HTML и CSS, поэтому откроется где угодно;
  * ссылки внутри текста превращены в переходы к нужной странице того же файла;
  * идентификаторы страниц разведены по префиксам, чтобы переходы не путались.

Источник — preview-main.html (в нём лежат все страницы и изображения),
поэтому сервер для сборки не нужен: python3 scripts/build-all-in-one.py
"""
import json
import pathlib
import re
import urllib.parse

SRC = pathlib.Path('preview-main.html')
OUT = pathlib.Path('preview-all.html')

TITLES = {
    '/': 'Главная',
    '/uslugi': 'Услуги',
    '/uslugi/analiz-vody': 'Анализ воды',
    '/uslugi/analiz-pochvy': 'Почва и грунты',
    '/uslugi/analiz-vozduha': 'Воздух и выбросы',
    '/uslugi/othody': 'Отходы',
    '/uslugi/fizfaktory': 'Шум и излучения',
    '/uslugi/proekty': 'Проекты и документы',
    '/ceny': 'Цены',
    '/otrasli': 'Отрасли',
    '/dokumenty': 'Документы',
    '/o-kompanii': 'О компании',
    '/kontakty': 'Контакты',
    '/politika': 'Политика обработки данных',
}


def slug(route: str) -> str:
    return 'home' if route == '/' else route.strip('/').replace('/', '-')


def read_blocks():
    html = SRC.read_text(encoding='utf-8')
    pages = json.loads(re.search(r'<script type="application/json" id="offline-pages">(.*?)</script>', html, re.S).group(1))
    media = json.loads(re.search(r'<script type="application/json" id="offline-media">(.*?)</script>', html, re.S).group(1))
    css = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
    return pages, media, css


def prepare(body: str, page_slug: str) -> str:
    """Разводит идентификаторы по странице и переводит ссылки в переходы внутри файла."""
    prefixes = [page_slug]

    # id → уникальный внутри файла
    body = re.sub(r'\bid="([^"]+)"', lambda m: f'id="{page_slug}--{m.group(1)}"', body)

    # ссылки на эти id внутри страницы
    def fix_ref(match):
        attr, value = match.group(1), match.group(2)
        ids = ' '.join(f'{page_slug}--{token}' for token in value.split())
        return f'{attr}="{ids}"'

    body = re.sub(r'\b(for|aria-labelledby|aria-controls|aria-describedby)="([^"]+)"', fix_ref, body)

    # внутренние ссылки вида href="#zayavka"
    body = re.sub(r'href="#([^"]+)"', lambda m: f'href="#{page_slug}--{m.group(1)}"', body)

    # ссылки на другие страницы сайта → на раздел этого файла
    def fix_route(match):
        route = match.group(1).split('#')[0]
        return f'href="#page-{slug(route)}"'

    body = re.sub(r'href="(/[^"#]*)(#[^"]*)?"', fix_route, body)

    # изображения уже как data URI — ничего не меняем
    return body


def main() -> None:
    pages, media, css = read_blocks()
    print(f'страниц: {len(pages)}, изображений в наборе: {len(media)}')

    # в теле страниц остались ссылки на исходные файлы фото — подставляем data URI
    index = []
    parts = []

    for route, body in pages.items():
        page_slug = slug(route)
        prepared = prepare(body, page_slug)

        def fix_img(match):
            value = match.group(2)
            inner = re.match(r'/_next/image\?url=([^&]+)', value)
            if inner:
                # путь внутри оптимизатора закодирован: %2Fphotos%2Fhero.jpg
                value = urllib.parse.unquote(inner.group(1))
            else:
                value = urllib.parse.unquote(value)
            return f'{match.group(1)}="{media.get(value, value)}"'

        prepared = re.sub(r'\b(src|href)="(/(?:photos|docs)/[^"]*)"', fix_img, prepared)
        prepared = re.sub(r'\b(src|href)="(/_next/image\?[^"]*)"', fix_img, prepared)

        title = TITLES.get(route, route)
        index.append(f'<li><a href="#page-{page_slug}">{title}</a> <span>— {route}</span></li>')
        parts.append(
            f'<section class="offline-page" id="page-{page_slug}" aria-label="{title}">\n'
            f'  <p class="offline-tag">Страница {route} · {title}</p>\n'
            f'  {prepared}\n'
            f'</section>'
        )
        print(f'  {route:<24} → #{page_slug}')

    html = f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ГК «РОСЭКО» — весь сайт одним файлом</title>
<style>{css}</style>
<style>
  /* Служебная обвязка офлайн-файла: к дизайну сайта отношения не имеет */
  .offline-intro {{
    padding: 32px 20px 40px; background: #2E2718; color: #E7DFCE;
    font: 15px/1.55 Inter, system-ui, -apple-system, Segoe UI, sans-serif;
  }}
  .offline-intro h1 {{ margin: 0 0 10px; font-size: 24px; color: #fff; }}
  .offline-intro p {{ margin: 0 0 18px; max-width: 78ch; }}
  .offline-intro ol {{ margin: 0; padding-left: 22px; columns: 2; column-gap: 40px; }}
  .offline-intro li {{ margin-bottom: 6px; break-inside: avoid; }}
  .offline-intro a {{ color: #fff; }}
  .offline-intro span {{ color: #D8C39B; font-size: 13px; }}
  .offline-tag {{
    margin: 0; padding: 10px 20px; background: #F1E0C5; color: #65542F;
    font: 13px/1.4 Inter, system-ui, sans-serif; letter-spacing: .02em;
    border-top: 1px solid #CFC9B8;
    max-width: none;   /* в CSS сайта у всех p стоит max-width: 78ch — полоска обрезалась */
  }}
  /* В файле 55 000 px: плавная прокрутка на такие расстояния тянется секундами,
     поэтому переходы делаем мгновенными */
  html {{ scroll-behavior: auto !important; }}
  .offline-page {{ position: relative; }}
  @media (min-width: 700px) {{ .offline-intro ol {{ columns: 3; }} }}
</style>
</head>
<body>
<div class="offline-intro">
  <h1>Весь сайт в одном файле</h1>
  <p>Ниже подряд идут все {len(pages)} страниц сайта — листайте вниз, ничего нажимать не нужно.
     Ссылки в меню и текстах ведут на нужную страницу этого же файла.
     Карта и звонок требуют интернета: без сети в блоке карты показан адрес.</p>
  <ol>{''.join(index)}</ol>
</div>
{''.join(parts)}
</body>
</html>
"""
    OUT.write_text(html, encoding='utf-8')
    print(f'\nГотово: {OUT} — {OUT.stat().st_size / 1024 / 1024:.2f} МБ, разделов: {len(parts)}, скриптов: {html.count("<script")}')


if __name__ == '__main__':
    main()
