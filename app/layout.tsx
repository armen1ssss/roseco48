import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { company } from '@/lib/content';
import { SITE_URL, defaultDescription, siteName } from '@/lib/site';

/**
 * Один гротеск на весь сайт: вариативный Inter, self-hosted через next/font,
 * подмножество cyrillic — вес шрифта для русского текста минимальный.
 * display: swap — текст виден сразу, шрифт подставляется по загрузке.
 */
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
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
    images: [{ url: '/photos/hero.jpg', width: 1672, height: 941, alt: 'Специалист лаборатории отбирает пробу воды' }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
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
