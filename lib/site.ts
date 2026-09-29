import { company } from '@/lib/content';
import { ASSET_PREFIX } from '@/lib/asset';

/**
 * Адресация сайта.
 *
 * На GitHub Pages сайт живёт в подпапке репозитория, поэтому корень сайта —
 * это origin + basePath: https://<владелец>.github.io/<репозиторий>.
 * Маршруты и ассеты Next префиксует сам, а canonical, sitemap.xml, robots.txt
 * и микроразметку мы собираем руками — здесь подпапку нужно добавить
 * самостоятельно, иначе поисковики получат ссылки на чужой адрес.
 *
 * NEXT_PUBLIC_SITE_URL задаёт workflow (.github/workflows/deploy.yml) —
 * это либо <владелец>.github.io/<репозиторий>, либо свой домен.
 *
 * SITE_URL (origin + подпапка) идёт в metadataBase. Next сам добавляет путь
 * metadataBase к относительным адресам метаданных, поэтому в metadata пути
 * пишутся БЕЗ подпапки: url: '/photos/hero.jpg' превратится в
 * https://<владелец>.github.io/roseco48/photos/hero.jpg. А canonical —
 * абсолютный адрес, его собирает canonicalUrl().
 */
export const BASE_PATH = ASSET_PREFIX;

const rawSiteOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ros-eco.ru').replace(/\/+$/, '');

// Если в NEXT_PUBLIC_SITE_URL случайно передали адрес вместе с подпапкой
// (https://<владелец>.github.io/roseco48), убираем её — иначе путь удвоится.
export const SITE_ORIGIN =
  BASE_PATH && rawSiteOrigin.endsWith(BASE_PATH) ? rawSiteOrigin.slice(0, -BASE_PATH.length) : rawSiteOrigin;

export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

/** Абсолютный адрес страницы: canonicalUrl('/ceny') → …/roseco48/ceny */
export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path === '/' ? '' : path}`;
}

export const siteName = `${company.name} — лаборатория в Липецке`;

export const defaultDescription =
  'Аккредитованная экологическая лаборатория в Липецке: анализы воды, почвы, воздуха, отходов и промышленных выбросов. 150 000 исследований с 2010 года. Протоколы принимают надзорные органы, работаем по 44-ФЗ и 223-ФЗ.';
