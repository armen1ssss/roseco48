import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Статическая выгрузка (output: 'export') требует явного force-static
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Служебные страницы и политику не индексируем
        disallow: ['/api/', '/politika'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
