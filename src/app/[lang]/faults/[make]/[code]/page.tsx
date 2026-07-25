import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from '@/components/LocalizedLink';
import { buildAlternates, metadataTitle, openGraphForPath } from '@/lib/metadata';
import { pageUrl } from '@/lib/siteConfig';
import { getDtcByCode } from '@/lib/dtcData';
import { POPULAR_MAKES } from '@/lib/carData';
import {
  getAllFaultCombos,
  FAULT_MAKE_SLUGS,
  FAULT_DTC_CODES,
  getMakeDisplayName,
  buildFaultIntro,
  buildFaultFaqs,
} from '@/lib/faultPages';
import { getDictionary } from '@/dictionaries/getDictionary';
import RelatedLinks from '@/components/RelatedLinks';
import { AlertTriangle, Wrench } from 'lucide-react';

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllFaultCombos().map(({ make, code }) => ({ make, code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; make: string; code: string }>;
}): Promise<Metadata> {
  const { lang, make, code } = await params;
  const makeName = getMakeDisplayName(make);
  const codeUpper = code.toUpperCase();
  const dtc = getDtcByCode(codeUpper);
  const title = `${codeUpper} on ${makeName} — Symptoms, Causes & OEM Fix | Auto Fix Data`;
  const description = dtc
    ? `${codeUpper} on ${makeName}: ${dtc.description}. OEM diagnostic steps, wiring diagrams and repair procedures.`
    : `${codeUpper} diagnostic guide for ${makeName} vehicles. Factory repair data and wiring diagrams.`;

  const faultPath = `/faults/${make}/${codeUpper}`;

  return {
    title: metadataTitle(title),
    description,
    alternates: buildAlternates(lang, faultPath),
    openGraph: openGraphForPath(lang, faultPath, { title, description }),
  };
}

export default async function FaultMakeCodePage({
  params,
}: {
  params: Promise<{ lang: string; make: string; code: string }>;
}) {
  const { lang, make, code } = await params;
  const codeUpper = code.toUpperCase();

  if (
    !FAULT_MAKE_SLUGS.includes(make as (typeof FAULT_MAKE_SLUGS)[number]) ||
    !FAULT_DTC_CODES.includes(codeUpper)
  ) {
    notFound();
  }

  const makeData = POPULAR_MAKES.find((m) => m.slug === make);
  if (!makeData) notFound();

  const makeName = makeData.name;
  const dict = await getDictionary(lang as any);
  const d = dict.dtc as any;

  const dtc = getDtcByCode(codeUpper) || {
    code: codeUpper,
    description: 'A diagnostic trouble code detected by the engine or vehicle control module.',
    symptoms: ['Check Engine Light ON', 'Possible performance or emissions issues'],
    causes: ['Sensor or actuator fault', 'Wiring or connector issue', 'Component wear or failure'],
    severity: 'Medium' as const,
    fixNow: 'Scan and follow OEM test procedures.',
  };

  const intro = buildFaultIntro(makeName, codeUpper, dtc.description, makeData.popularModels);
  const faqs = buildFaultFaqs(makeName, codeUpper, dtc.description);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: pageUrl(lang, '') },
      { '@type': 'ListItem', position: 2, name: 'DTC Codes', item: pageUrl(lang, '/dtc') },
      { '@type': 'ListItem', position: 3, name: makeName, item: pageUrl(lang, `/manuals/${make}`) },
      { '@type': 'ListItem', position: 4, name: codeUpper, item: pageUrl(lang, `/faults/${make}/${codeUpper}`) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="bg-afd-navy py-12 px-6 border-b border-black/20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-afd-yellow text-black font-black px-3 py-1.5 rounded-md text-sm tracking-widest">
              {codeUpper}
            </span>
            <span className="text-afd-slate font-semibold">{makeName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            {codeUpper} on {makeName} — Symptoms, Causes &amp; OEM Fix
          </h1>
          <p className="text-lg text-afd-slate max-w-3xl leading-relaxed">{intro}</p>
        </div>
      </div>

      <section className="py-12 bg-gray-50 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-afd-navy mb-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                {d.commonSymptoms?.replace('{code}', codeUpper) || `Common symptoms (${codeUpper})`}
              </h2>
              <ul className="space-y-2">
                {dtc.symptoms.map((s, i) => (
                  <li key={i} className="text-gray-700 font-medium">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-afd-navy mb-4">
                {d.whatCauses?.replace('{code}', codeUpper) || `What causes ${codeUpper}?`}
              </h2>
              <ul className="space-y-2">
                {dtc.causes.map((c, i) => (
                  <li key={i} className="text-gray-700 font-medium">
                    • {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 prose prose-blue max-w-none">
              <h3>Popular {makeName} models affected</h3>
              <p>
                Workshops frequently report {codeUpper} on {makeData.popularModels.slice(0, 6).join(', ')}.
                Always verify the fault on the exact vehicle using OEM data for the correct model year and engine code.
              </p>
              <p>
                <Link href={`/manuals/${make}`} className="text-afd-blue font-semibold no-underline hover:underline">
                  Browse {makeName} repair manuals →
                </Link>
                {' · '}
                <Link href={`/dtc/${codeUpper}`} className="text-afd-blue font-semibold no-underline hover:underline">
                  Generic {codeUpper} guide →
                </Link>
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border-2 border-afd-yellow shadow-xl p-6">
              <Wrench className="w-10 h-10 text-afd-navy mb-4" />
              <h3 className="text-xl font-black text-afd-navy mb-2">
                Fix {codeUpper} on {makeName}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Access OEM procedures, wiring diagrams and TSBs for {makeName} in one subscription.
              </p>
              <Link
                href={`/${lang}/free-trial`}
                className="block w-full text-center bg-afd-yellow text-black font-bold py-3 rounded-xl hover:bg-afd-yellow-hover transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>

        <RelatedLinks
          lang={lang}
          dtcCode={codeUpper}
          makeSlug={make}
          makeName={makeName}
          className="max-w-[1200px] mx-auto mt-12"
        />
      </section>
    </>
  );
}
