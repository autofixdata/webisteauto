import type { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import { getDictionary } from '@/dictionaries/getDictionary';
import { unslugify, getTopModelsToPrerender } from '@/lib/carData';
import { Lock, ChevronRight, Settings, Zap, BookOpen, Shield, Clock, Search, AlertTriangle, ArrowRight, CheckCircle2, Wrench } from 'lucide-react';

export const dynamicParams = true; // Enables On-Demand ISR for the 9,900+ pages we don't prerender
export const revalidate = 604800; // Cache at the edge for 1 week

export async function generateStaticParams() {
  // Pre-generate only the top ~100 pages to save massive Vercel build time
  return getTopModelsToPrerender();
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; make: string; model: string; year: string }> }): Promise<Metadata> {
  const { lang, make, model, year } = await params;
  const dict = await getDictionary(lang as any);

  const makeName = unslugify(make);
  const modelName = unslugify(model);
  const title = dict.manuals?.yearTemplateTitle
    ? dict.manuals.yearTemplateTitle.replace('{Y}', year).replace('{Ma}', makeName).replace('{Mo}', modelName)
    : `${year} ${makeName} ${modelName} Repair Manual & Wiring Diagrams`;

  const description = dict.manuals?.yearTemplateDesc
    ? dict.manuals.yearTemplateDesc.replace('{Y}', year).replace('{Ma}', makeName).replace('{Mo}', modelName)
    : `Access complete OEM repair data, service manuals, and interactive wiring diagrams for the ${year} ${makeName} ${modelName}.`;

  return {
    title,
    description,
    alternates: { canonical: `https://workshopdata.us/${lang}/manuals/${make}/${model}/${year}` },
    openGraph: { title, description },
  };
}

const techCategories = [
  { id: "service", label: "SERVICE", icon: "⚙️", items: ["Service brakes", "Engine oil", "Service transmission", "Service air conditioning"] },
  { id: "powertrain", label: "POWERTRAIN", icon: "🔧", items: ["Timing belt/chain", "Engine overhaul", "Clutch replacement"] },
  { id: "chassis", label: "CHASSIS", icon: "🛞", items: ["Wheel alignment", "Suspension geometry", "Brake calipers"] },
  { id: "electrical", label: "ELECTRICAL", icon: "⚡", items: ["Wiring diagrams", "ECU coding", "Sensor data"] },
];

export default async function YearDetailPage({ params }: { params: Promise<{ lang: string; make: string; model: string; year: string }> }) {
  const { lang, make, model, year } = await params;
  const dict = await getDictionary(lang as any);
  const makeName = unslugify(make);
  const modelName = unslugify(model);

  const title = `${year} ${makeName} ${modelName}`;

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    "name": `${title} Repair Manual Data`,
    "description": `OEM diagnostic and repair database for ${title}.`,
    "image": "https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png",
    "url": `https://workshopdata.us/${lang}/manuals/${make}/${model}/${year}`,
    "brand": { "@type": "Brand", "name": makeName },
    "sku": `AFD-${make}-${model}-${year}`,
    "offers": {
      "@type": "Offer",
      "name": "Auto Fix Data Subscriptions",
      "price": "99.00",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "url": `https://workshopdata.us/${lang}/pricing`
    }
  });

  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://workshopdata.us/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Repair Manuals', item: `https://workshopdata.us/${lang}/repair-manuals` },
      { '@type': 'ListItem', position: 3, name: makeName, item: `https://workshopdata.us/${lang}/manuals/${make}` },
      { '@type': 'ListItem', position: 4, name: modelName, item: `https://workshopdata.us/${lang}/manuals/${make}/${model}` },
      { '@type': 'ListItem', position: 5, name: year, item: `https://workshopdata.us/${lang}/manuals/${make}/${model}/${year}` },
    ],
  });

  // Calculate internal "Spider-Web" links for SEO crawling
  const db = require('@/lib/largeCarDatabase.json');
  const availableYears = db[make]?.[model] || [];
  const sortedYears = [...availableYears].sort((a, b) => Number(a) - Number(b));
  const currentIndex = sortedYears.findIndex(y => String(y) === String(year));

  const relatedLinks = [];
  if (currentIndex > 0) {
    const prev = sortedYears[currentIndex - 1];
    relatedLinks.push({ label: `${prev} ${makeName} ${modelName}`, url: `/${lang}/manuals/${make}/${model}/${prev}` });
  }
  if (currentIndex < sortedYears.length - 1) {
    const next = sortedYears[currentIndex + 1];
    relatedLinks.push({ label: `${next} ${makeName} ${modelName}`, url: `/${lang}/manuals/${make}/${model}/${next}` });
  }

  const otherModels = Object.keys(db[make] || {}).filter(m => m !== model).slice(0, 4);
  otherModels.forEach(otherModel => {
    const otherYears = db[make][otherModel];
    if (otherYears && otherYears.length > 0) {
      const latestYear = Math.max(...otherYears.map(Number));
      relatedLinks.push({
        label: `${latestYear} ${makeName} ${unslugify(otherModel)}`,
        url: `/${lang}/manuals/${make}/${otherModel}/${latestYear}`
      });
    }
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />

      {/* Top Breadcrumb & Subscribe Bar */}
      <div className="bg-[#2d2d2d] text-white text-sm border-b border-black/20 sticky top-0 z-40">
        <div className="w-full px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300">
            <Link href={`/manuals/${make}`} className="hover:text-white transition-colors">{makeName}</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href={`/manuals/${make}/${model}`} className="hover:text-white transition-colors">{modelName}</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="text-white font-medium">{year}</span>
          </div>
          <Link href="/pricing" className="flex items-center gap-2 text-xs bg-afd-yellow/10 border border-afd-yellow/30 text-afd-yellow px-4 py-2 rounded-lg hover:bg-afd-yellow/20 font-bold transition-colors shadow-sm">
            <Lock className="w-3.5 h-3.5" /> Subscribe to access data
          </Link>
        </div>
      </div>

      <div className="flex min-h-screen bg-white">
        {/* Left Sidebar Menu */}
        <aside className="hidden md:flex flex-col w-[260px] bg-[#2d2d2d] border-r border-[#1a1a1a] shadow-xl relative z-10 shrink-0">
          <div className="p-6 border-b border-[#1f1f1f] flex flex-col items-center justify-center text-center">
            <Image
              src={`/images/logos/${make}.png`}
              alt={makeName}
              width={160}
              height={40}
              className="h-10 w-auto object-contain filter brightness-0 invert opacity-70 mb-3"
            />
            <h3 className="text-white font-bold text-sm tracking-wide">{modelName}</h3>
            <p className="text-gray-400 text-xs mt-1">{year} - Present</p>
          </div>
          <nav className="flex-1 py-4 flex flex-col gap-1">
            <div className="px-4 py-3 bg-afd-yellow text-black font-bold text-sm flex items-center justify-between cursor-pointer border-l-4 border-yellow-300">
              Overview
            </div>
            {["Maintenance", "Repair Data", "Electrical"].map(item => (
              <div key={item} className="px-4 py-3 text-gray-300 font-medium text-sm flex items-center hover:bg-[#3d3d3d] hover:text-white transition-colors cursor-pointer border-l-4 border-transparent">
                {item}
              </div>
            ))}
            <div className="px-4 py-3 text-gray-300 font-medium text-sm flex items-center justify-between hover:bg-[#3d3d3d] hover:text-white transition-colors cursor-pointer border-l-4 border-transparent">
              SmartPACK™
              <span className="bg-afd-yellow text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">7</span>
            </div>
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 flex flex-col bg-gray-50 overflow-x-hidden relative min-h-screen">
          {/* Header Area */}
          <div className="bg-white border-b border-gray-200 px-6 lg:px-10 py-6 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-2 shrink-0">
              <Image src={`/images/logos/${make}.png`} alt={makeName} width={120} height={120} className="w-full h-full object-contain opacity-80" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#1f2937] leading-tight">
                {makeName} {modelName} — <span className="font-semibold">{year} Standard</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1 font-medium">{year} - ...</p>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 p-4 lg:p-8">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">

              {/* Left Column (Wider) */}
              <div className="flex flex-col gap-6">
                {/* Maintenance Programs */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-sm tracking-wide">Maintenance Programs</h2>
                  </div>
                  <div className="p-4">
                    <Link href="/pricing" className="w-full flex items-center justify-between px-5 py-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-afd-yellow/50 hover:shadow-sm transition-all group">
                      <span className="font-medium text-gray-600 group-hover:text-black transition-colors">Select Service System (Europe / US)</span>
                      <div className="flex items-center gap-3">
                        <Lock className="w-3.5 h-3.5 text-gray-400 group-hover:text-afd-yellow transition-colors" />
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Frequently Used */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-sm tracking-wide">Frequently Used</h2>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <Link href="/pricing" className="w-full flex items-center justify-between px-5 py-3.5 bg-red-50/50 border border-red-100 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group">
                      <span className="text-sm text-red-700 font-semibold flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Important! Read before working on this vehicle — Electrical Safety
                      </span>
                      <Lock className="w-3.5 h-3.5 text-red-400/70 shrink-0 group-hover:text-red-500 transition-colors" />
                    </Link>

                    {[
                      { label: "Flat-rate labour times", icon: Clock },
                      { label: "Adjustment & settings data", icon: Settings },
                      { label: "Torque specifications", icon: Wrench }
                    ].map(({ label, icon: Icon }) => (
                      <Link key={label} href="/pricing" className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-lg text-sm text-gray-700 hover:border-afd-yellow/50 hover:bg-white hover:shadow-sm transition-all group">
                        <span className="font-medium flex items-center gap-3 text-gray-600 group-hover:text-black transition-colors">
                          <Icon className="w-4 h-4 text-gray-400" />
                          {label}
                        </span>
                        <div className="flex items-center gap-3">
                          <Lock className="w-3.5 h-3.5 text-gray-300 group-hover:text-afd-yellow transition-colors" />
                          <ChevronRight className="w-4 h-4 text-gray-200" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-2">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Quick Links</h2>
                  </div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <Link href="/pricing" className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-afd-blue transition-colors group">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-50 text-blue-500">🛢️</div>
                      Engine oil service
                      <Lock className="w-3 h-3 text-gray-300 ml-auto group-hover:text-afd-blue" />
                    </Link>
                    <Link href="/pricing" className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors group">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-red-50 text-red-500">🔴</div>
                      Service brakes
                      <Lock className="w-3 h-3 text-gray-300 ml-auto group-hover:text-red-500" />
                    </Link>
                    <Link href="/pricing" className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors group">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-cyan-50 text-cyan-500">❄️</div>
                      Service air conditioning
                      <Lock className="w-3 h-3 text-gray-300 ml-auto group-hover:text-cyan-500" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column (Narrower) */}
              <div className="flex flex-col gap-6">

                {/* Fault Code Search */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-sm tracking-wide">Fault Code / DTC Search</h2>
                  </div>
                  <div className="p-5">
                    <div className="relative mb-3">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        disabled
                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none cursor-not-allowed"
                        placeholder="Search one or more fault codes (e.g. P0300, P0420)"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-300" />
                      </div>
                    </div>
                    <p className="text-center text-[11px] text-gray-400 font-medium">Full DTC library available with subscription</p>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Vehicle Details</h2>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1">ENGINE CODE</span>
                      <span className="block text-sm font-bold text-gray-800">STANDARD</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1">ENGINE SPEC</span>
                      <span className="block text-sm font-bold text-gray-800">N/A</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1">YEAR RANGE</span>
                      <span className="block text-sm font-bold text-gray-800">{year}-{parseInt(year) + 3}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1">MAKE</span>
                      <span className="block text-sm font-bold text-gray-800">{makeName}</span>
                    </div>
                  </div>
                </div>

                {/* SmartPACK */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-sm tracking-wide flex items-center gap-1.5">
                      SmartPACK™
                    </h2>
                    <span className="text-[10px] font-medium text-gray-400">Powered by ALLDATA + Identifix</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    <Link href="/pricing" className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                      <span className="text-sm font-medium text-gray-600 group-hover:text-black">Technical Service Bulletins (TSB)</span>
                      <div className="flex items-center gap-3">
                        <span className="bg-afd-yellow text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">5</span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </Link>
                    <Link href="/pricing" className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                      <span className="text-sm font-medium text-gray-600 group-hover:text-black">Safety Recalls</span>
                      <div className="flex items-center gap-3">
                        <span className="bg-afd-yellow text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">2</span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </Link>
                    <Link href="/pricing" className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                      <span className="text-sm font-medium text-gray-600 group-hover:text-black">Confirmed Fixes (Identifix)</span>
                      <div className="flex items-center gap-3">
                        <Lock className="w-3.5 h-3.5 text-gray-300 group-hover:text-afd-yellow" />
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* Start Free Trial CTA directly integrated to push conversion */}
            <div className="max-w-[1400px] mx-auto mt-8 mb-8 bg-afd-navy rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border-l-4 border-afd-yellow">
              <div>
                <h3 className="text-white font-extrabold text-xl md:text-2xl mb-2">Ready to view {year} {makeName} {modelName} data?</h3>
                <p className="text-afd-slate text-sm font-medium">Start your completely free 7-day trial. Instant access. No credit card required.</p>
              </div>
              <Link href="/free-trial" className="px-8 py-4 bg-afd-yellow text-black text-sm font-extrabold rounded-xl hover:bg-afd-yellow-hover hover:-translate-y-0.5 transition-all shadow-lg shrink-0 whitespace-nowrap uppercase tracking-wide">
                Unlock Repair Manual
              </Link>
            </div>

            {/* Spider-Web Internal Links (SEO) */}
            {relatedLinks.length > 0 && (
              <div className="max-w-[1400px] mx-auto mb-12">
                <h3 className="text-gray-900 font-bold mb-4 px-1">Related {makeName} Manuals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {relatedLinks.map(link => (
                    <Link key={link.url} href={link.url} className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 hover:border-afd-yellow hover:shadow-sm hover:text-afd-navy transition-all font-medium flex items-center justify-between group">
                      <span className="truncate pr-2">{link.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-afd-yellow shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
