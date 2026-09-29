/**
 * Пути к файлам из public/.
 *
 * На GitHub Pages сайт открывается не в корне домена, а в подпапке репозитория:
 * https://<владелец>.github.io/<репозиторий>/ — этот префикс передаётся сборке
 * в NEXT_PUBLIC_BASE_PATH (см. .github/workflows/deploy.yml).
 *
 * Обычные ссылки и CSS Next префиксует сам, а вот next/image в режиме
 * unoptimized (он нужен статическому хостингу) — нет, поэтому пути к фото
 * и документам собираем через asset().
 */
// Без завершающего слэша — так же считает префикс next.config.mjs
export const ASSET_PREFIX = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');

export function asset(path: string): string {
  return `${ASSET_PREFIX}${path}`;
}
