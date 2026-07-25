import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/siteConfig';
import { LOCALES } from '@/lib/sitemap';

export const dynamic = 'force-static';

export async function GET() {
  const body = `# Auto Fix Data

> Professional workshop repair database — OEM procedures, wiring diagrams, DTC codes and TSBs for 150M+ vehicles.

## Primary URL
${SITE_URL}

## Languages
${LOCALES.join(', ')}

## Key pages
- ${SITE_URL}/en — Home
- ${SITE_URL}/en/pricing — Pricing
- ${SITE_URL}/en/free-trial — Free trial
- ${SITE_URL}/en/dtc — DTC fault code directory
- ${SITE_URL}/en/repair-manuals — Repair manuals by make
- ${SITE_URL}/en/wiring-diagrams — Wiring diagrams
- ${SITE_URL}/en/blog — Technical blog
- ${SITE_URL}/en/products — Product overview

## Sitemap
${SITE_URL}/sitemap.xml

## RSS
${SITE_URL}/feed.xml

## Contact
${SITE_URL}/en/contact
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
