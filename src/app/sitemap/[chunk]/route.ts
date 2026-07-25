import { NextRequest, NextResponse } from 'next/server';
import { getAllSitemapEntries, CHUNK_SIZE, BASE_URL, LOCALES } from '@/lib/sitemap';

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function fullEncodeUrl(url: string) {
  return escapeXml(encodeURI(url));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chunk: string }> }
) {
  const { chunk: chunkSlug } = await params;
  const chunkId = parseInt(chunkSlug.replace('.xml', ''), 10);
  const now = new Date().toISOString();

  const allEntries = getAllSitemapEntries();

  const start = chunkId * CHUNK_SIZE;
  const end = start + CHUNK_SIZE;
  const targetEntries = allEntries.slice(start, end);

  if (targetEntries.length === 0) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const xmlContent = targetEntries.map(({ path, lang }) => {
    const loc = fullEncodeUrl(`${BASE_URL}/${lang}${path}`);
    const alternateLines = LOCALES.map((alternateLang) => {
      const altHref = fullEncodeUrl(`${BASE_URL}/${alternateLang}${path}`);
      return `    <xhtml:link rel="alternate" hreflang="${alternateLang}" href="${altHref}" />`;
    });
    const xDefaultHref = fullEncodeUrl(`${BASE_URL}/en${path}`);
    alternateLines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultHref}" />`);
    const alternates = alternateLines.join('\n');

    return `  <url>
    <loc>${loc}</loc>
${alternates}
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlContent}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
