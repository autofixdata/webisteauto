import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'] as const;
export type Lang = typeof LANGS[number];

export interface PostMeta {
  slug: string;
  lang: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  tags: string[];
  youtubeId?: string;
}

export interface Post extends PostMeta {
  content: string;
}

function getPostDir(lang: string) {
  return path.join(CONTENT_DIR, lang);
}

export function getAllSlugs(lang?: string): string[] {
  let slugs = new Set<string>();

  if (lang) {
    const langDir = getPostDir(lang);
    if (fs.existsSync(langDir)) {
      fs.readdirSync(langDir)
        .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
        .forEach(f => slugs.add(f.replace(/\.mdx?$/, '')));
    }
    const enDir = getPostDir('en');
    if (fs.existsSync(enDir)) {
      fs.readdirSync(enDir)
        .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
        .forEach(f => slugs.add(f.replace(/\.mdx?$/, '')));
    }
  } else {
    LANGS.forEach(l => {
      const d = getPostDir(l);
      if (fs.existsSync(d)) {
        fs.readdirSync(d)
          .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
          .forEach(f => slugs.add(f.replace(/\.mdx?$/, '')));
      }
    });
  }

  return Array.from(slugs);
}

export function getPostMeta(lang: string, slug: string): PostMeta | null {
  const filePath = path.join(getPostDir(lang), `${slug}.mdx`);
  const fallback = path.join(getPostDir('en'), `${slug}.mdx`);
  const target = fs.existsSync(filePath) ? filePath : fs.existsSync(fallback) ? fallback : null;
  if (!target) return null;
  const { data } = matter(fs.readFileSync(target, 'utf8'));
  return { slug, lang, ...data } as PostMeta;
}

export function getPost(lang: string, slug: string): Post | null {
  const filePath = path.join(getPostDir(lang), `${slug}.mdx`);
  const fallback = path.join(getPostDir('en'), `${slug}.mdx`);
  const target = fs.existsSync(filePath) ? filePath : fs.existsSync(fallback) ? fallback : null;
  if (!target) return null;
  const { data, content } = matter(fs.readFileSync(target, 'utf8'));
  return { slug, lang, content, ...data } as Post;
}

export function getAllPostsMeta(lang: string): PostMeta[] {
  return getAllSlugs(lang)
    .map(slug => getPostMeta(lang, slug))
    .filter(Boolean) as PostMeta[];
}

/** Lang + slug pairs that render (locale MDX or English fallback) — for sitemap and static generation. */
export function getResolvableBlogParams(): { lang: string; slug: string }[] {
  const seen = new Set<string>();
  const result: { lang: string; slug: string }[] = [];
  for (const lang of LANGS) {
    for (const slug of getAllSlugs(lang)) {
      const key = `${lang}:${slug}`;
      if (seen.has(key)) continue;
      if (getPost(lang, slug)) {
        seen.add(key);
        result.push({ lang, slug });
      }
    }
  }
  return result;
}
