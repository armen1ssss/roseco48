import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Статическая выгрузка (output: 'export') требует явного force-static
export const dynamic = 'force-static';
import { services } from '@/lib/services';

/** Карта сайта: только страницы, которые должны быть в поиске. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: '', priority: 1 },
    { url: '/uslugi', priority: 0.9 },
    { url: '/ceny', priority: 0.8 },
    { url: '/otrasli', priority: 0.7 },
    { url: '/o-kompanii', priority: 0.6 },
    { url: '/dokumenty', priority: 0.8 },
    { url: '/kontakty', priority: 0.7 },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${SITE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: page.priority,
    })),
    ...services.map((service) => ({
      url: `${SITE_URL}/uslugi/${service.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
