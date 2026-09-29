/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
// STATIC_EXPORT=1 — сборка статики для GitHub Pages (см. README, раздел «Публикация»)
const staticExport = process.env.STATIC_EXPORT === '1';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Дев-сервер открывается по прокси-хосту, а не с localhost
  allowedDevOrigins: ['*.e2b.app', '*.arena.ai', 'localhost', '127.0.0.1'],
  // Для Pages сайт живёт в подпапке репозитория: /имя-репозитория
  basePath,
  // Статическая выгрузка: обычный HTML/CSS/JS в папке out/
  output: staticExport ? 'export' : undefined,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Ширины под реальные экраны: от 360 до 1920. Источники ≥1500 px,
    // выше не поднимаем, чтобы не апскейлить и не жечь трафик.
    deviceSizes: [360, 420, 480, 640, 768, 960, 1200, 1440, 1672],
    imageSizes: [96, 128, 200, 256, 320, 384],
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
