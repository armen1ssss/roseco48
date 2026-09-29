#!/usr/bin/env python3
"""
Локальная проверка статической сборки — так, как её будет отдавать GitHub Pages.

Pages открывает сайт в подпапке репозитория (https://<владелец>.github.io/<репозиторий>/),
страницы отдаёт без расширения .html, а для несуществующих адресов показывает 404.html.
Этот скрипт повторяет такое поведение, чтобы поймать битые пути до публикации.

    npm run build:static                 # соберёт папку out/
    python3 scripts/serve-static.py      # http://localhost:8000/<папка>/

Имя папки берётся из NEXT_PUBLIC_BASE_PATH (по умолчанию /site), порт — из
второго аргумента или 8000, адрес — из HOST (по умолчанию 127.0.0.1).
"""
import http.server
import os
import socketserver
import sys
import urllib.parse

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'out')
PREFIX = (os.environ.get('NEXT_PUBLIC_BASE_PATH') or '/site').rstrip('/')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
HOST = os.environ.get('HOST', '127.0.0.1')


class PagesHandler(http.server.SimpleHTTPRequestHandler):
    """Отдаёт out/ так же, как GitHub Pages."""

    def _resolve(self, path):
        rel = path[len(PREFIX):].lstrip('/')
        base = os.path.join(ROOT, rel)
        for candidate in (base, base + '.html', os.path.join(base, 'index.html')):
            if os.path.isfile(candidate):
                return candidate
        return None

    def translate_path(self, path):
        path = urllib.parse.urlparse(path).path
        if not path.startswith(PREFIX):
            return os.path.join(ROOT, '__not_here__')
        return self._resolve(path) or os.path.join(ROOT, '404.html')

    def send_head(self):
        path = urllib.parse.urlparse(self.path).path
        if path in ('', '/'):
            self.send_response(302)
            self.send_header('Location', PREFIX + '/')
            self.end_headers()
            return None
        if not path.startswith(PREFIX):
            self.send_error(404, 'Сайт лежит в подпапке ' + PREFIX)
            return None
        if self._resolve(path) is None:
            page = os.path.join(ROOT, '404.html')
            handle = open(page, 'rb')
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(os.path.getsize(page)))
            self.end_headers()
            return handle
        return super().send_head()

    def log_message(self, fmt, *args):
        print(f'  {self.address_string()} {fmt % args}')


if __name__ == '__main__':
    if not os.path.isdir(ROOT):
        sys.exit('Нет папки out/ — сначала выполните: npm run build:static')
    if PREFIX in ('', '/'):
        sys.exit('NEXT_PUBLIC_BASE_PATH пуст: укажите папку, например /roseco48')
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((HOST, PORT), PagesHandler) as httpd:
        print(f'Статика из out/ отдаётся как на GitHub Pages: http://{HOST}:{PORT}{PREFIX}/')
        httpd.serve_forever()
