import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import Link from '@/components/LocalizedLink';
import { CheckCircle2, Database, FileText, Zap, Settings, Calendar, ArrowRight } from "lucide-react";
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.autodata?.meta?.title ?? 'AutoData Workshop Database via Auto Fix Data | Authorised Reseller'),
    description: dict.autodata?.meta?.description ?? "Access AutoData's technical specifications, service intervals, wiring diagrams and DTC codes through Auto Fix Data. Trusted by European workshops. Free trial available.",
    alternates: await buildAlternates(lang, `/autodata`),
  };
}

// Icons map for features since JSON doesn't store components
const featureIcons = [Settings, Calendar, Zap, Database, FileText, Settings];

export default async function AutodataProductPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.autodata as any;

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${d?.hero?.heading || "AutoData Workshop Database"} — via Auto Fix Data`,
    "image": "https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png",
    "description": d?.meta?.description || "Access AutoData's technical specifications.",
    "url": pageUrl(lang, `/autodata`),
    "brand": {
      "@type": "Brand",
      "name": "AutoData"
    },
    "sku": "AFD-AUTODATA",
    "offers": {
      "@type": "Offer",
      "name": dict.common?.freeTrial || "Free 7-Day Trial",
      "price": "0.00",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "url": pageUrl(lang, `/free-trial`)
    }
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      <section className="bg-afd-navy pt-24 pb-20 dark-section">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 text-afd-yellow text-sm font-bold px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-afd-yellow rounded-full"></span>
            {d?.hero?.badge ?? 'Authorised AutoData Reseller'}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 max-w-3xl">
            {d?.hero?.heading ?? 'AutoData \u2014 Technical Workshop Data by Solera'}
          </h1>
          <p className="text-xl text-afd-slate max-w-2xl mb-10">
            {d?.hero?.subheading ?? "Europe's most trusted source of automotive technical data."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/free-trial">
              <button className="bg-afd-yellow text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-afd-yellow-hover transition-colors">
                Start Free 7-Day Trial
              </button>
            </Link>
            <Link href="/pricing">
              <button className="border border-white/30 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/10 transition-colors">
                View Pricing Plans
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-4 bg-afd-dark">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap gap-8 text-sm text-afd-slate">
          {(d?.statsBar || []).map((stat: any, i: number) => (
            <span key={i}><strong className="text-white">{stat.value}</strong> {stat.label}</span>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-4">
              {d?.featuresHeading ?? 'What AutoData Includes in Your Subscription'}
            </h2>
            <p className="text-lg text-afd-text max-w-2xl mx-auto">
              {d?.featuresSubheading ?? 'AutoData has been the benchmark for European workshop technical data for over 35 years. From oil capacities to timing belt replacement intervals, AutoData delivers the precise technical specifications professionals rely on.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(d?.features || []).map((feature: any, i: number) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <div key={feature.title} className="p-8 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-afd-light rounded-xl flex items-center justify-center mb-6 group-hover:bg-afd-yellow/20 transition-colors">
                    <Icon className="w-7 h-7 text-afd-blue group-hover:text-afd-yellow transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-afd-navy mb-3">{feature.title}</h3>
                  <p className="text-afd-text leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-afd-light">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-afd-navy mb-6">{d?.whyHeading ?? 'The European Workshop Standard'}</h2>
              <p className="text-lg text-afd-text mb-8 leading-relaxed">
                {d?.whyBody ?? 'AutoData is particularly strong for independent workshops handling European marques. Its technical specifications database covers Vauxhall, Renault, Peugeot, Citroen, Fiat, Alfa Romeo, SEAT, Skoda and all major European manufacturers at OEM depth. The platform is also widely used by UK MOT stations, service centres and independent technicians as a daily reference tool.'}
              </p>
              <ul className="space-y-4">
                {(d?.whyList || []).map((item: string) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-afd-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-afd-navy rounded-2xl p-10 text-white">
              <h3 className="text-2xl font-bold mb-6">{d?.keyStatsHeading ?? 'AutoData Key Statistics'}</h3>
              <div className="space-y-6">
                {(d?.keyStats || []).map(({ label, value }: any) => (
                  <div key={label} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-afd-slate">{label}</span>
                    <span className="text-2xl font-extrabold text-afd-yellow">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-afd-light border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-afd-navy mb-8 text-center">
            {d?.latestGuidesHeading ?? 'Latest AutoData & AI Guides'}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <li>
              <Link href="/blog/autodata-ai-diagnostic-tools-2026" className="block p-5 bg-white rounded-xl border border-gray-100 hover:border-afd-yellow hover:shadow-md transition-all text-afd-navy font-semibold text-sm">
                AutoData AI Diagnostic Tools →
              </Link>
            </li>
            <li>
              <Link href="/blog/autodata-ai-labour-times-pricing-2026" className="block p-5 bg-white rounded-xl border border-gray-100 hover:border-afd-yellow hover:shadow-md transition-all text-afd-navy font-semibold text-sm">
                AI Labour Times & Pricing →
              </Link>
            </li>
            <li>
              <Link href="/blog/autodata-ev-ai-service-data" className="block p-5 bg-white rounded-xl border border-gray-100 hover:border-afd-yellow hover:shadow-md transition-all text-afd-navy font-semibold text-sm">
                EV & AI Service Data →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-6">
            {d?.ctaHeading ?? 'Access AutoData Through Auto Fix Data'}
          </h2>
          <p className="text-lg text-afd-text mb-10">
            {d?.ctaBody ?? 'Auto Fix Data is an authorised AutoData reseller. Your subscription gives you full access to AutoData alongside ALLDATA, Haynes Pro, Mitchell1 and Identifix. One subscription, five premium databases.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-trial">
              <button className="bg-afd-yellow text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-afd-yellow-hover transition-colors">
                {dict.common.startFreeTrial}
              </button>
            </Link>
            <Link href="/autodata-alternative">
              <button className="border border-afd-blue text-afd-blue font-semibold px-8 py-4 rounded-lg text-lg hover:bg-afd-blue/5 transition-colors flex items-center gap-2">
                {d?.ctaCompare ?? 'Compare with alternatives'} <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
