import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { company } from '@/lib/content';
import { SITE_URL, defaultDescription, siteName, canonicalUrl } from '@/lib/site';

/**
 * Один гротеск на весь сайт: вариативный Inter (latin + cyrillic), self-hosted.
 *
 * Файлы лежат в app/fonts — те же подмножества, что отдаёт Google Fonts API
 * (@fontsource-variable/inter 5.3.0). Сборка не обращается к fonts.googleapis.com:
 * раньше шрифт тянул next/font/google, и если Google недоступен, сборка падала
 * целиком — `Failed to fetch Inter from Google Fonts`. Теперь у сборки нет
 * внешних зависимостей, и она одинаково проходит локально и в CI.
 *
 * display: swap — текст виден сразу; пока шрифт грузится, работает 'Inter
 * Fallback' из globals.css (Arial с метриками Inter, вёрстка не прыгает).
 * adjustFontFallback выключен, потому что запасной шрифт задан в CSS явно.
 * preload включён: Next сам подставит <link rel="preload"> с правильным basePath.
 * Вес 100–900 — вариативный файл перекрывает и обычный, и полужирный текст.
 */
const inter = localFont({
  src: [
    { path: './fonts/inter-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: './fonts/inter-cyrillic-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Экологические анализы воды, почвы и воздуха в Липецке — ГК «РОСЭКО»',
    template: '%s — ГК «РОСЭКО»',
  },
  description: defaultDescription,
  applicationName: siteName,
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: company.name,
    url: SITE_URL,
    title: 'Лабораторная точность — анализы воды, почвы и воздуха',
    description: defaultDescription,
    // Путь — без подпапки репозитория: metadataBase (см. lib/site.ts) уже
    // содержит её, и Next склеивает адрес сам. Добавим /roseco48 руками —
    // подпапка удвоится.
    images: [
      {
        url: '/photos/hero.jpg',
        width: 1672,
        height: 941,
        alt: 'Специалист лаборатории отбирает пробу воды',
      },
    ],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: canonicalUrl('/') },
};

/** theme-color совпадает с фоном первого экрана: адресная строка не «светит» белым. */
export const viewport: Viewport = {
  themeColor: '#2E2718',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <a className="skip-link" href="#main">
          Перейти к содержимому
        </a>
        {children}
      </body>
    </html>
  );
}
