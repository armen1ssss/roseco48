import { company } from '@/lib/content';

/** Абсолютный адрес сайта: нужен для canonical, sitemap и OG-тегов. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ros-eco.ru';

export const siteName = `${company.name} — лаборатория в Липецке`;

export const defaultDescription =
  'Аккредитованная экологическая лаборатория в Липецке: анализы воды, почвы, воздуха, отходов и промышленных выбросов. 150 000 исследований с 2010 года. Протоколы принимают надзорные органы, работаем по 44-ФЗ и 223-ФЗ.';
