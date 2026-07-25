import { NextResponse } from 'next/server';
import { TOP_DTC_CODES } from '@/lib/dtcData';
import carDb from '@/lib/largeCarDatabase.json';
import { slugify } from '@/lib/carData';
import { getAllPostsMeta } from '@/lib/blog';

const PRODUCT_PAGES = [
  { title: 'Pricing & Plans', url: '/pricing', keywords: ['price', 'plan', 'subscription', 'cost'] },
  { title: 'ALLDATA Repair Data', url: '/alldata', keywords: ['alldata', 'oem'] },
  { title: 'AutoData Technical Specs', url: '/autodata', keywords: ['autodata', 'specs', 'labour'] },
  { title: 'Haynes Pro Workshop Manuals', url: '/haynes-pro', keywords: ['haynes', 'haynespro', 'manual'] },
  { title: 'Mitchell1 ProDemand', url: '/mitchell1', keywords: ['mitchell', 'prodemand', 'suretrack'] },
  { title: 'Identifix Direct-Hit', url: '/identifix', keywords: ['identifix', 'direct-hit', 'confirmed'] },
  { title: 'Wiring Diagrams', url: '/wiring-diagrams', keywords: ['wiring', 'diagram', 'schematic', 'pinout'] },
  { title: 'DTC Fault Code Directory', url: '/dtc', keywords: ['dtc', 'obd', 'fault', 'code', 'p0'] },
  { title: 'Free 7-Day Trial', url: '/free-trial', keywords: ['trial', 'free', 'demo'] },
  { title: 'Repair Manuals', url: '/repair-manuals', keywords: ['manual', 'repair', 'workshop'] },
  { title: 'Diagnostics Tools', url: '/diagnostics', keywords: ['diagnostic', 'scan', 'obd2'] },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: { type: string; title: string; url: string }[] = [];

  const dtcHits = TOP_DTC_CODES
    .filter(dtc => dtc.code.toLowerCase().includes(q) || dtc.description.toLowerCase().includes(q))
    .slice(0, 4)
    .map(dtc => ({
      type: 'dtc',
      title: `${dtc.code} - ${dtc.description}`,
      url: `/dtc/${dtc.code}`,
    }));

  results.push(...dtcHits);

  const carHits: { type: string; title: string; url: string }[] = [];
  let carCount = 0;

  for (const make of Object.keys(carDb)) {
    if (carCount >= 4) break;

    if (make.toLowerCase().includes(q)) {
      carHits.push({
        type: 'manual',
        title: `${make} Repair Manuals`,
        url: `/manuals/${slugify(make)}`,
      });
      carCount++;
      continue;
    }

    const models = Object.keys((carDb as Record<string, Record<string, number[]>>)[make]);
    for (const model of models) {
      const makeModelStr = `${make} ${model}`.toLowerCase();
      if (makeModelStr.includes(q)) {
        carHits.push({
          type: 'manual',
          title: `${make} ${model}`,
          url: `/manuals/${slugify(make)}/${slugify(model)}`,
        });
        carCount++;
        if (carCount >= 4) break;
      }
    }
  }

  results.push(...carHits);

  const blogHits = getAllPostsMeta('en')
    .filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
    )
    .slice(0, 4)
    .map((post) => ({
      type: 'blog',
      title: post.title,
      url: `/blog/${post.slug}`,
    }));

  results.push(...blogHits);

  const productHits = PRODUCT_PAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.keywords.some((k) => k.includes(q) || q.includes(k))
  )
    .slice(0, 4)
    .map((p) => ({
      type: 'product',
      title: p.title,
      url: p.url,
    }));

  results.push(...productHits);

  return NextResponse.json({ results: results.slice(0, 12) });
}
