import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl } from '@/lib/siteConfig';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from '@/components/LocalizedLink';
import { POPULAR_MAKES, unslugify, getModelsForMake } from '@/lib/carData';
import { getCommonCodesForMake } from '@/lib/faultPages';
import { getDtcByCode } from '@/lib/dtcData';
import { Car, ArrowRight, AlertTriangle } from 'lucide-react';
import { getDictionary } from '@/dictionaries/getDictionary';
import RelatedLinks from '@/components/RelatedLinks';

export const dynamicParams = true;
export const revalidate = 604800; // 1 week cache

export async function generateStaticParams() {
  return POPULAR_MAKES.map((make) => ({ make: make.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; make: string }> }): Promise<Metadata> {
  const { lang, make } = await params;
  const dict = await getDictionary(lang as any);
  const makeName = unslugify(make);

  const title = dict.manuals?.makeTitle
    ? dict.manuals.makeTitle.replace('{Ma}', makeName)
    : `${makeName} OEM Repair Manuals & Wiring Diagrams | Auto Fix Data`;

  return {
    title: title.endsWith(' | Auto Fix Data') ? metadataTitle(title) : title,
    description: `Access complete factory repair manuals, torque specifications, and wiring diagrams for all ${makeName} models. Download professional ${makeName} workshop manuals.`,
    alternates: buildAlternates(lang, `/manuals/${make}`),
  };
}

function buildMakeFaqs(makeName: string, popularModels: string[]) {
  const models = popularModels.slice(0, 4).join(', ');
  return [
    {
      q: `Where can I find ${makeName} OEM repair manuals?`,
      a: `Auto Fix Data provides factory ${makeName} repair procedures, wiring diagrams and torque specs for models including ${models}. Access the same data authorised dealers use.`,
    },
    {
      q: `Which ${makeName} models are covered?`,
      a: `Our database covers ${makeName} models from 1990 to present, including ${models} and many more. Select your model above to view year-specific manuals.`,
    },
    {
      q: `Does Auto Fix Data include ${makeName} wiring diagrams?`,
      a: `Yes. Full-colour interactive wiring schematics, connector pinouts and ECU locations are included for ${makeName} vehicles alongside DTC diagnostic procedures.`,
    },
  ];
}

export default async function MakeDirectoryPage({ params }: { params: Promise<{ lang: string; make: string }> }) {
  const { lang, make } = await params;
  const dict = await getDictionary(lang as any);

  const makeData = POPULAR_MAKES.find(m => m.slug === make.toLowerCase());
  if (!makeData) notFound();

  const makeName = makeData.name;
  const models = getModelsForMake(make.toLowerCase());
  if (models.length === 0) notFound();

  const featuredModels = models.slice(0, 6);
  const restModels = models.slice(6);
  const commonCodes = getCommonCodesForMake(make, 8);
  const faqs = buildMakeFaqs(makeName, makeData.popularModels);
  const popularList = makeData.popularModels.slice(0, 6).join(', ');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: pageUrl(lang, '') },
      { '@type': 'ListItem', position: 2, name: 'Repair Manuals', item: pageUrl(lang, `/repair-manuals`) },
      { '@type': 'ListItem', position: 3, name: makeName, item: pageUrl(lang, `/manuals/${make}`) },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="bg-afd-navy py-16 px-6 relative overflow-hidden border-b border-white/5">
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <Image src={`/images/logos/${make}.png`} alt={makeName} width={192} height={48} className="h-12 w-auto object-contain filter brightness-0 invert mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{makeName} Repair Manuals</h1>
          <p className="text-xl text-afd-slate max-w-2xl mx-auto">
            Access OEM repair data, wiring diagrams, torque specs, and technical service bulletins for all {makeName} models.
          </p>
        </div>
      </div>

      {featuredModels.length > 0 && (
        <section className="py-10 px-6 bg-white border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-lg font-bold text-afd-navy mb-4">Popular {makeName} models</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredModels.map((modelSlug) => (
                <Link
                  key={modelSlug}
                  href={`/manuals/${make}/${modelSlug}`}
                  className="p-4 rounded-xl border-2 border-afd-yellow/30 bg-afd-yellow/5 hover:border-afd-yellow hover:shadow-md transition-all text-center font-bold text-afd-navy"
                >
                  {unslugify(modelSlug)}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-afd-navy mb-8 flex items-center gap-3">
              <Car className="w-6 h-6 text-afd-blue" /> All {makeName} models
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(restModels.length > 0 ? restModels : models).map(modelSlug => {
                const modelName = unslugify(modelSlug);
                return (
                  <Link key={modelSlug} href={`/manuals/${make}/${modelSlug}`}
                    className="p-4 rounded-xl border border-gray-200 hover:border-afd-blue hover:shadow-md transition-all group flex items-center justify-between bg-white text-afd-navy font-semibold">
                    <span>{modelName}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-afd-blue transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-afd-navy mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" /> Common {makeName} fault codes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {commonCodes.map((code) => {
                const dtc = getDtcByCode(code);
                return (
                  <Link
                    key={code}
                    href={`/faults/${make}/${code}`}
                    className="p-4 rounded-xl border border-gray-200 hover:border-afd-yellow transition-all group text-center"
                  >
                    <div className="font-black text-afd-navy group-hover:text-afd-yellow">{code}</div>
                    <div className="text-[10px] text-gray-500 line-clamp-2 mt-1">{dtc?.description}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-[900px] mx-auto prose prose-lg prose-headings:text-afd-navy text-gray-600">
          <h2>About {makeName} OEM Service Data</h2>
          <p>
            Auto Fix Data provides independent mechanics with the same factory repair documentation that authorised {makeName} dealerships use.
            Our database covers torque specifications, fluid capacities, timing belt replacement intervals, wiring diagrams, and diagnostic trouble code procedures for {popularList} and hundreds of other {makeName} variants.
          </p>
          <h3>Most Common {makeName} Repairs</h3>
          <p>
            Whether you are servicing a {makeData.popularModels[0] || makeName} for scheduled maintenance or tracing an intermittent electrical fault on a {makeData.popularModels[1] || 'popular model'},
            our interactive wiring schematics and OEM test steps help you diagnose accurately on the first visit — reducing comebacks and unnecessary parts replacement.
          </p>
          <h3>{makeName} Diagnostic Coverage</h3>
          <p>
            From engine management and emissions faults to body control and ADAS systems, {makeName} vehicles share many common DTC patterns.
            Use our fault-code guides linked above for make-specific context, then open the full OEM procedure for your exact model year and engine code.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50">
        <RelatedLinks lang={lang} makeSlug={make} makeName={makeName} className="max-w-[1200px] mx-auto" />
      </section>
    </>
  );
}
