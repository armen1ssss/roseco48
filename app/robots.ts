import type { MetadataRoute } from 'next';
import { BASE_PATH, SITE_ORIGIN, SITE_URL } from '@/lib/site';

// Статическая выгрузка (output: 'export') требует явного force-static
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Служебные страницы и политику не индексируем.
        // Пути в robots.txt всегда от корня домена, поэтому подпапку Pages
        // (/roseco48) добавляем сами — иначе правило указывает в пустоту.
        disallow: [`${BASE_PATH}/api/`, `${BASE_PATH}/politika`],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
