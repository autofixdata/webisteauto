import { getResolvableBlogParams } from './blog';
import { TOP_DTC_CODES } from './dtcData';
import { getFaultSitemapPaths } from './faultPages';

import { SITE_URL } from './siteConfig';

export const LOCALES = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];
export const BASE_URL = SITE_URL;
export const CHUNK_SIZE = 5000;

export const STATIC_PATHS = [
  '', '/pricing', '/products', '/repair-manuals', '/diagnostics', 
  '/wiring-diagrams', '/dtc', '/blog', '/about', '/contact', 
  '/free-trial', '/glossary', '/alldata', '/autodata', '/haynes-pro', 
  '/mitchell1', '/identifix', '/alldata-alternative', '/autodata-alternative', 
  '/haynespro-alternative', '/mitchell1-alternative', '/identifix-alternative', 
  '/privacy-policy', '/terms-of-service', '/gdpr'
];

export function getAllSitemapPaths() {
  const allPaths: string[] = [];

  // 1. Static Paths
  STATIC_PATHS.forEach(p => allPaths.push(p));

  // 2. Blog paths are added per-locale in getAllSitemapEntries()

  // 3. DTC Paths
  try {
    TOP_DTC_CODES.forEach(dtc => allPaths.push(`/dtc/${dtc.code}`));
  } catch (e) {
    console.error('Error getting DTC codes for sitemap:', e);
  }

  // 3b. Fault make+code paths
  try {
    getFaultSitemapPaths().forEach(p => allPaths.push(p));
  } catch (e) {
    console.error('Error getting fault paths for sitemap:', e);
  }

  // 4. Car Manual Paths
  try {
    const db = require('./largeCarDatabase.json');
    Object.keys(db).forEach(make => {
      allPaths.push(`/manuals/${make}`);
      Object.keys(db[make]).forEach(model => {
        allPaths.push(`/manuals/${make}/${model}`);
        db[make][model].forEach((year: any) => {
          allPaths.push(`/manuals/${make}/${model}/${year}`);
        });
      });
    });
  } catch (e) {
    console.error('Error getting car database for sitemap:', e);
  }

  return allPaths;
}

/** Flat sitemap rows: non-blog paths × all locales, plus resolvable blog posts only. */
export function getAllSitemapEntries(): { path: string; lang: string }[] {
  const entries: { path: string; lang: string }[] = [];

  for (const path of getAllSitemapPaths()) {
    for (const lang of LOCALES) {
      entries.push({ path, lang });
    }
  }

  try {
    getResolvableBlogParams().forEach(({ lang, slug }) => {
      entries.push({ path: `/blog/${slug}`, lang });
    });
  } catch (e) {
    console.error('Error getting blog entries for sitemap:', e);
  }

  return entries;
}
