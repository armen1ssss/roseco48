#!/usr/bin/env python3
"""
Собирает офлайн-версию сайта: один HTML со всеми страницами.

Зачем: предпросмотр с сервером живёт только пока активна сессия песочницы.
Этот файл открывается сам по себе — без сервера, без сети, без срока годности.

Что внутри:
  * стили и шрифты вшиты один раз;
  * все фотографии — как data URI, каждая по одному разу;
  * страницы лежат в JSON и подставляются по хешу: #/ceny, #/uslugi/analiz-vody;
  * ссылки, мобильное меню и лайтбокс галереи работают на встроенном скрипте.

Запуск (нужен работающий сервер на 3000):
    npm start &  →  python3 scripts/build-offline.py
Результат: preview-main.html в корне проекта.
"""
import base64
import json
import mimetypes
import pathlib
import re
import urllib.parse
import urllib.request

BASE = 'http://127.0.0.1:3000'
OUT = pathlib.Path('preview-main.html')

ROUTES = [
    '/',
    '/uslugi',
    '/uslugi/analiz-vody',
    '/uslugi/analiz-pochvy',
    '/uslugi/analiz-vozduha',
    '/uslugi/othody',
    '/uslugi/fizfaktory',
    '/uslugi/proekty',
    '/ceny',
    '/otrasli',
    '/dokumenty',
    '/o-kompanii',
    '/kontakty',
    '/politika',
]

MEDIA_FILES = [
    '/photos/hero.jpg',
    '/photos/pole.jpg',
    '/photos/lab-instruments.jpg',
    '/photos/lab-spectrometer.jpg',
    '/photos/lab-prep.jpg',
    '/photos/sampling-site.jpg',
    '/photos/lab-chromatograph.jpg',
    '/photos/lab-balance.jpg',
    '/docs/preview-blank.svg',
]


def fetch(path: str) -> str:
    with urllib.request.urlopen(BASE + path) as response:
        return response.read().decode('utf-8')


def clean_page(html: str) -> dict:
    """Достаёт из страницы то, что нужно для офлайна: тело без скриптов и ссылок на CDN."""
    html_class = re.search(r'<html[^>]*class="([^"]*)"', html)
    body_open = re.search(r'<body([^>]*)>', html)
    body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1)

    body = re.sub(r'<script\b[^>]*>.*?</script>', '', body, flags=re.S)
    body = re.sub(r'<script\b[^>]*>', '', body)
    body = re.sub(r'<link\b[^>]*>', '', body)
    # Карта — внешний виджет: без сети он покажет серое поле, а под ним адрес.
    # Убираем iframe, чтобы адрес был просто виден в блоке карты.
    body = re.sub(r'<iframe\b[^>]*>\s*</iframe>', '', body, flags=re.S)
    body = re.sub(r'<iframe\b[^>]*/?>', '', body)
    # srcset/sizes указывают на внутренний оптимизатор Next — в офлайне он не нужен
    body = re.sub(r'\s[\w-]*srcset="[^"]*"', '', body, flags=re.I)
    body = re.sub(r'\s[\w-]*sizes="[^"]*"', '', body, flags=re.I)
    return {
        'body': body.strip(),
        'htmlClass': html_class.group(1) if html_class else '',
        'bodyAttrs': body_open.group(1).strip() if body_open else '',
    }


def main() -> None:
    print('Читаю страницы…')
    pages = {}
    html_class = ''
    body_attrs = ''
    css_parts = []

    for route in ROUTES:
        page = clean_page(fetch(route))
        pages[route] = page['body']
        html_class = html_class or page['htmlClass']
        body_attrs = body_attrs or page['bodyAttrs']
        print(f'  {route:<28} {len(page["body"]) // 1024} КБ')

    print('Вшиваю стили и шрифты…')
    css_paths = set(re.findall(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"', fetch('/')))
    for path in css_paths:
        css = fetch(path)
        for url in set(re.findall(r'url\((/_next/static/media/[^)]+)\)', css)):
            blob = urllib.request.urlopen(BASE + url).read()
            mime = 'font/woff2' if url.endswith('.woff2') else 'application/octet-stream'
            css = css.replace(url, f'data:{mime};base64,{base64.b64encode(blob).decode()}')
        css_parts.append(css)
    print(f'  стилей: {len(css_parts)}')

    print('Вшиваю изображения…')
    media = {}
    for path in MEDIA_FILES:
        local = pathlib.Path('public' + path)
        mime = mimetypes.guess_type(local.name)[0] or 'application/octet-stream'
        media[path] = f'data:{mime};base64,{base64.b64encode(local.read_bytes()).decode()}'
        print(f'  {path:<34} {local.stat().st_size // 1024} КБ')

    def json_for(data) -> str:
        """JSON без «<» — иначе строка с </script> разорвала бы тег."""
        return json.dumps(data, ensure_ascii=False).replace('<', '\\u003c')

    bootstrap = """
(function () {
  var pages = JSON.parse(document.getElementById('offline-pages').textContent);
  var media = JSON.parse(document.getElementById('offline-media').textContent);
  var app = document.getElementById('offline-app');
  var nav = ['Услуги', 'Цены', 'Отрасли', 'О компании', 'Документы', 'Контакты'];
  var navHref = ['/uslugi', '/ceny', '/otrasli', '/o-kompanii', '/dokumenty', '/kontakty'];

  // Мобильное меню: в собранном сайте его рисует React, здесь — вручную
  function buildMenu() {
    var items = nav.map(function (label, i) {
      return '<li><a href="' + navHref[i] + '">' + label + '</a></li>';
    }).join('');
    return '<div class="mobile-menu" id="offline-menu" hidden>' +
      '<nav aria-label="Мобильная навигация"><ul class="mobile-menu__list">' + items + '</ul></nav>' +
      '<div class="mobile-menu__foot">' +
      '<a class="mobile-menu__phone" href="tel:+78002505168">8 800 250-51-68</a>' +
      '<p class="mobile-menu__hours">звонок бесплатный · пн–пт 8:00–17:00, обед 12:00–13:00<br>eco-1@mail.ru</p>' +
      '<a class="btn btn--primary" href="/kontakty">Контакты и карта</a>' +
      '</div></div>';
  }

  // Изображения: подставляем data URI вместо путей к серверу
  function fixImages(root) {
    root.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      var match = src.match(/url=([^&]+)/);
      if (match) src = decodeURIComponent(match[1]);
      if (media[src]) img.setAttribute('src', media[src]);
    });
  }

  function render() {
    var raw = location.hash.replace(/^#/, '') || '/';
    var anchor = '';
    if (raw.indexOf('#') > -1) { var parts = raw.split('#'); raw = parts[0]; anchor = parts[1]; }
    if (!pages[raw]) raw = '/';

    app.innerHTML = pages[raw];

    var header = app.querySelector('.header');
    if (header) {
      header.insertAdjacentHTML('beforeend', buildMenu());
      var burger = header.querySelector('.header__burger');
      var menu = header.querySelector('.mobile-menu');
      if (burger && menu) {
        burger.addEventListener('click', function () {
          var open = menu.hidden;
          menu.hidden = !open;
          burger.setAttribute('aria-expanded', String(open));
          burger.textContent = open ? 'Закрыть' : 'Меню';
        });
      }
    }

    fixImages(app);

    var banner = document.getElementById('offline-banner');
    if (banner) {
      banner.querySelector('[data-route]').textContent = raw === '/' ? 'Главная' : raw;
    }

    if (anchor) {
      requestAnimationFrame(function () {
        var el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ block: 'start' });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  // Лайтбокс галереи оборудования: в собранном сайте это React, здесь — обработчик
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (link) {
      var href = link.getAttribute('href') || '';
      if (href.indexOf('http') === 0 || href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0) return;
      if (href.charAt(0) === '/' || href.charAt(0) === '#') {
        event.preventDefault();
        location.hash = '#' + href;
        return;
      }
    }
    var shot = event.target.closest('.gallery button');
    if (shot) {
      event.preventDefault();
      var image = shot.querySelector('img');
      if (!image) return;
      var label = shot.closest('figure').querySelector('figcaption');
      var box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.innerHTML = '<div class="lightbox__panel"><img class="lightbox__img" alt="" src="' + image.src + '">' +
        '<div class="lightbox__row"><p class="muted" style="margin:0">' + (label ? label.textContent : '') + '</p>' +
        '<button class="btn btn--ghost btn--sm" type="button">Закрыть</button></div></div>';
      function close() { box.remove(); document.removeEventListener('keydown', onKey); }
      function onKey(e) { if (e.key === 'Escape') close(); }
      box.addEventListener('click', close);
      box.querySelector('.lightbox__panel').addEventListener('click', function (e) { e.stopPropagation(); });
      box.querySelector('button').addEventListener('click', close);
      document.addEventListener('keydown', onKey);
      document.body.appendChild(box);
      box.querySelector('button').focus();
    }
  });

  window.addEventListener('hashchange', render);
  render();
})();
"""

    banner = """
<div id="offline-banner" style="position:sticky;top:0;z-index:60;display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:space-between;padding:10px 20px;background:#2E2718;color:#E7DFCE;font:13px/1.4 Inter, system-ui, sans-serif">
  <span>Офлайн-версия сайта: все страницы в одном файле. Открыта: <b data-route style="color:#fff">Главная</b></span>
  <span style="color:#D8C39B">Ссылки, меню и галерея работают · карта и внешние переходы требуют интернета</span>
</div>
"""

    html = f"""<!doctype html>
<html lang="ru" class="{html_class}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ГК «РОСЭКО» — офлайн-версия сайта (все страницы)</title>
<style>{''.join(css_parts)}</style>
</head>
<body{(' ' + body_attrs) if body_attrs else ''}>
{banner}
<div id="offline-app"></div>
<script type="application/json" id="offline-pages">{json_for(pages)}</script>
<script type="application/json" id="offline-media">{json_for(media)}</script>
<script>{bootstrap}</script>
</body>
</html>
"""
    OUT.write_text(html, encoding='utf-8')
    print(f'\nГотово: {OUT} — {OUT.stat().st_size / 1024 / 1024:.2f} МБ, страниц: {len(pages)}')


if __name__ == '__main__':
    main()
