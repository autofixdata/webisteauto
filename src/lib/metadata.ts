import type { Metadata } from 'next';
import { pageUrl } from '@/lib/siteConfig';
import { LOCALES } from '@/lib/sitemap';
import { getPost } from '@/lib/blog';

const SITE_TITLE_SUFFIX = ' | Auto Fix Data';

/** Canonical + hreflang alternates for all 7 languages + x-default (en). */
export function buildAlternates(
  lang: string,
  path: string = ''
): NonNullable<Metadata['alternates']> {
  return {
    canonical: pageUrl(lang, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, pageUrl(l, path)])),
      'x-default': pageUrl('en', path),
    },
  };
}

/** Hreflang only for locales where the blog post resolves (locale file or EN fallback). */
export function buildBlogAlternates(
  lang: string,
  slug: string
): NonNullable<Metadata['alternates']> {
  const path = `/blog/${slug}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    if (getPost(l, slug)) {
      languages[l] = pageUrl(l, path);
    }
  }
  languages['x-default'] = languages.en ?? languages[lang] ?? pageUrl(lang, path);
  return {
    canonical: pageUrl(lang, path),
    languages,
  };
}

/**
 * Avoid duplicated "| Auto Fix Data" when layout title template also appends the brand.
 */
export function metadataTitle(title: string): Metadata['title'] {
  const t = title.trim();
  if (t.endsWith(SITE_TITLE_SUFFIX)) {
    return { absolute: t };
  }
  return t;
}

/** Open Graph url aligned with canonical for the same path. */
export function openGraphForPath(
  lang: string,
  path: string,
  fields: NonNullable<Metadata['openGraph']>
): NonNullable<Metadata['openGraph']> {
  return {
    ...fields,
    url: pageUrl(lang, path),
  };
}
