import site from '../../site.config.js';

/** Live site URL — edit site.config.js at project root when changing domain. */
export const SITE_URL: string = site.SITE_URL.replace(/\/$/, '');

/** Full page URL for SEO: https://domain/en/pricing */
export function pageUrl(lang: string, path: string = ''): string {
  const suffix = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${SITE_URL}/${lang}${suffix}`;
}
