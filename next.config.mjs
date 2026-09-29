/**
 * Настройки Next.js.
 *
 * Одно приложение собирается двумя способами:
 *   npm run dev / npm run build — обычный сервер Next (сайт в корне, basePath пустой);
 *   npm run build:static        — статическая выгрузка в out/ для GitHub Pages.
 *
 * GitHub Pages отдаёт сайт из подпапки репозитория
 * (https://<владелец>.github.io/<репозиторий>/), поэтому префикс пути приходит
 * в сборку через NEXT_PUBLIC_BASE_PATH. Тот же префикс читает lib/asset.ts —
 * иначе next/image и ссылки на PDF теряют подпапку и на Pages всё отдаёт 404.
 *
 * Значение по умолчанию — пустая строка: локальная разработка и проверки
 * работают без подпапки, а деплой всегда передаёт реальный префикс
 * (см. .github/workflows/deploy.yml).
 */

/** basePath без завершающего слэша: '/roseco48', а не '/roseco48/'. */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');

/**
 * Статическая выгрузка включается только явно (npm run build:static →
 * STATIC_EXPORT=1). Без неё собирается обычный серверный билд, и `npm start`
 * продолжает работать для локальных проверок.
 */
const staticExport = process.env.STATIC_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Дев-сервер открывается по прокси-хосту, а не с localhost
  allowedDevOrigins: ['*.e2b.app', '*.arena.ai', 'localhost', '127.0.0.1'],
  // Сайт на Pages живёт в подпапке репозитория — все маршруты и ассеты с префиксом
  basePath,
  // Обычный HTML/CSS/JS в папке out/ — его и забирает GitHub Pages
  output: staticExport ? 'export' : undefined,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Ширины под реальные экраны: от 360 до 1920. Источники ≥1500 px,
    // выше не поднимаем, чтобы не апскейлить и не жечь трафик.
    // В статической сборке оптимизатор выключен (unoptimized), список нужен
    // только серверному режиму.
    deviceSizes: [360, 390, 480, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 88, 96, 128, 256, 384],
    // Статический хостинг не умеет сжимать картинки на лету
    unoptimized: staticExport,
  },
};

// Заголовки не поддерживаются статическим экспортом — только для сервера
if (!staticExport) {
  nextConfig.headers = async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/photos/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ];
}

export default nextConfig;
