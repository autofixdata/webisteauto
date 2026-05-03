import type { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import { unslugify, slugify, getModelsForMake, getYearsForModel } from '@/lib/carData';
import { Lock, ChevronRight, Settings, Zap, BookOpen, Search, ArrowRight, CalendarDays, Key } from 'lucide-react';
import { getDictionary } from '@/dictionaries/getDictionary';

export const dynamicParams = true;
export const revalidate = 604800; // 1 week cache

export async function generateStaticParams() {
  // Pre-generate top 20 models across 5 makes to save build time
  const topMakes = ['ford', 'bmw', 'volkswagen', 'toyota', 'chevrolet'];
  const params = [];
  for (const make of topMakes) {
    const models = getModelsForMake(make).slice(0, 4);
    for (const model of models) params.push({ make, model });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; make: string; model: string }> }): Promise<Metadata> {
  const { lang, make, model } = await params;
  const dict = await getDictionary(lang as any);

  const makeName = unslugify(make);
  const modelName = unslugify(model);

  const title = dict.manuals?.modelTitle
    ? dict.manuals.modelTitle.replace('{Ma}', makeName).replace('{Mo}', modelName)
    : `${makeName} ${modelName} Repair Manual & Wiring Diagrams`;

  return {
    title,
    description: `Complete list of ${makeName} ${modelName} repair manuals by year. Select your vehicle's exact year to view OEM wiring diagrams, specifications, and service procedures.`,
    alternates: { canonical: `https://workshopdata.us/${lang}/manuals/${make}/${model}` },
  };
}

export default async function ModelDetailPage({ params }: { params: Promise<{ lang: string; make: string; model: string }> }) {
  const { lang, make, model } = await params;
  const dict = await getDictionary(lang as any);

  const makeName = unslugify(make);
  const modelName = unslugify(model);
  const years = getYearsForModel(make, model);

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://workshopdata.us/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Repair Manuals', item: `https://workshopdata.us/${lang}/repair-manuals` },
      { '@type': 'ListItem', position: 3, name: makeName, item: `https://workshopdata.us/${lang}/manuals/${make}` },
      { '@type': 'ListItem', position: 4, name: modelName, item: `https://workshopdata.us/${lang}/manuals/${make}/${model}` },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      {/* Breadcrumb Bar */}
      <div className="bg-[#2d2d2d] text-white text-sm border-b border-black/20">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 text-gray-300">
            <Link href="/repair-manuals" className="hover:text-white transition-colors">Manuals</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href={`/manuals/${make}`} className="hover:text-white transition-colors font-medium">{makeName}</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="text-white font-medium">{modelName}</span>
          </div>
          <Link href="/pricing" className="hidden sm:flex items-center gap-2 text-xs bg-afd-yellow/20 border border-afd-yellow/40 text-afd-yellow px-3 py-1.5 rounded-lg hover:bg-afd-yellow/30 font-bold">
            <Lock className="w-3.5 h-3.5" /> Access Data
          </Link>
        </div>
      </div>

      <div className="min-h-[calc(100vh-100px)] bg-gray-50 py-12 px-6">
        <div className="max-w-[1200px] mx-auto">

          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src={`/images/logos/${make}.png`} alt={makeName} width={160} height={40} className="h-10 object-contain" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{makeName} {modelName}</h1>
              <p className="text-xl text-gray-500">Select your production year to view specific OEM repair data.</p>
            </div>

            <div className="shrink-0 bg-afd-navy rounded-2xl p-5 text-white flex gap-4 items-center shadow-lg border border-black/10">
              <div className="w-12 h-12 bg-afd-yellow/20 rounded-full flex items-center justify-center">
                <Key className="w-6 h-6 text-afd-yellow drop-shadow-sm" />
              </div>
              <div>
                <div className="text-sm text-afd-slate font-medium">Auto Fix Data Coverage</div>
                <div className="font-extrabold text-xl">{years?.length || 'Multiple'} Years Available</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-12">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
              <CalendarDays className="w-8 h-8 text-afd-yellow" />
              <h2 className="text-2xl font-bold text-afd-navy">Select Production Year</h2>
            </div>

            {years && years.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {years.map(yr => (
                  <Link
                    key={yr}
                    href={`/manuals/${make}/${model}/${yr}`}
                    className="group flex flex-col items-center justify-center py-5 px-4 rounded-2xl border-2 border-gray-100 hover:border-afd-yellow hover:bg-gray-50 transition-all shadow-sm hover:shadow"
                  >
                    <span className="text-2xl font-black text-afd-navy group-hover:scale-110 transition-transform">{yr}</span>
                    <span className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest flex items-center gap-1 group-hover:text-afd-blue">
                      View Data <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No specific years indexed yet.</h3>
                <p className="text-gray-500 mt-2">Data for the {modelName} is available in the main platform.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-afd-navy text-white rounded-3xl p-8 lg:p-10 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold mb-4">Instant {makeName} Wiring Diagrams</h3>
                <p className="text-afd-slate text-lg mb-8">Stop guessing where wires go. Our interactive, full-colour schematics let you trace circuits across modules in seconds.</p>
                <Link href="/free-trial" className="inline-block px-8 py-3 bg-afd-yellow text-black font-extrabold rounded-xl hover:bg-afd-yellow-hover">Start 7-Day Trial</Link>
              </div>
              <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
            </div>

            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-200 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4">OEM Service Procedures</h3>
                <p className="text-gray-500 text-lg mb-8">Access the exact factory test steps, labor times, component locators, and torque specifications required for professional repairs.</p>
                <Link href="/pricing" className="inline-flex items-center gap-2 text-afd-blue font-extrabold hover:text-afd-navy">View Pricing Options <ArrowRight className="w-5 h-5" /></Link>
              </div>
              <Settings className="absolute -top-10 -right-10 w-64 h-64 text-gray-50" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
