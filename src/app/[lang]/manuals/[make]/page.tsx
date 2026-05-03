import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from '@/components/LocalizedLink';
import { POPULAR_MAKES, unslugify, getModelsForMake } from '@/lib/carData';
import { Car, ArrowRight } from 'lucide-react';
import { getDictionary } from '@/dictionaries/getDictionary';

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
    title,
    description: `Access complete factory repair manuals, torque specifications, and wiring diagrams for all ${makeName} models. Download professional ${makeName} workshop manuals.`,
    alternates: { canonical: `https://workshopdata.us/${lang}/manuals/${make}` },
  };
}

export default async function MakeDirectoryPage({ params }: { params: Promise<{ lang: string; make: string }> }) {
  const { lang, make } = await params;
  const dict = await getDictionary(lang as any);

  // Validate make exists in our config
  const makeData = POPULAR_MAKES.find(m => m.slug === make.toLowerCase());
  if (!makeData) notFound();

  const makeName = makeData.name;

  // Read models precisely from our massive JSON database
  const models = getModelsForMake(make.toLowerCase());
  if (models.length === 0) notFound();

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://workshopdata.us/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Repair Manuals', item: `https://workshopdata.us/${lang}/repair-manuals` },
      { '@type': 'ListItem', position: 3, name: makeName, item: `https://workshopdata.us/${lang}/manuals/${make}` },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      <div className="bg-afd-navy py-16 px-6 relative overflow-hidden border-b border-white/5">
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <Image src={`/images/logos/${make}.png`} alt={makeName} width={192} height={48} className="h-12 w-auto object-contain filter brightness-0 invert mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{makeName} Repair Manuals</h1>
          <p className="text-xl text-afd-slate max-w-2xl mx-auto">
            Access OEM repair data, wiring diagrams, torque specs, and technical service bulletins for all {makeName} models.
          </p>
        </div>
      </div>

      <section className="py-16 bg-gray-50 px-6 min-h-[500px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-afd-navy mb-8 flex items-center gap-3">
              <Car className="w-6 h-6 text-afd-blue" /> Select your {makeName} Model
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {models.map(modelSlug => {
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
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-[900px] mx-auto prose prose-lg prose-headings:text-afd-navy text-gray-600">
          <h2>About {makeName} OEM Service Data</h2>
          <p>Auto Fix Data provides independent mechanics with the same factory repair documentation that authorised {makeName} dealerships use. Our database covers torque specifications, fluid capacities, timing belt replacement intervals, wiring diagrams, and diagnostic trouble code procedures.</p>
          <h3>Most Common {makeName} Repairs</h3>
          <p>Whether you are performing scheduled maintenance or diagnosing an electrical fault, our interactive wiring schematics make it simple to trace circuits and resolve issues on the first visit — eliminating costly repeat appointments and unnecessary parts replacement.</p>
        </div>
      </section>
    </>
  );
}
