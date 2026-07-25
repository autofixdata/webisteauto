import { NextResponse } from 'next/server';
import { getAllPostsMeta } from '@/lib/blog';
import { SITE_URL } from '@/lib/siteConfig';

export const dynamic = 'force-static';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = getAllPostsMeta('en').slice(0, 50);
  const now = new Date().toUTCString();

  const items = posts
    .map(
      (post) => `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${SITE_URL}/en/blog/${post.slug}</link>
    <guid isPermaLink="true">${SITE_URL}/en/blog/${post.slug}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.excerpt)}</description>
  </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Auto Fix Data Technical Blog</title>
    <link>${SITE_URL}/en/blog</link>
    <description>OEM repair guides, wiring diagrams, DTC diagnostics and workshop software comparisons.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  });
}
