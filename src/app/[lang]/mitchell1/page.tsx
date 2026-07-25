import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import Link from '@/components/LocalizedLink';
import { CheckCircle2, Database, FileText, Zap, Activity, Clock, ArrowRight } from "lucide-react";
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.mitchell1?.meta?.title ?? 'Mitchell1 ProDemand Repair Data | Auto Fix Data Reseller'),
    description: dict.mitchell1?.meta?.description ?? 'Access Mitchell1 ProDemand repair data, wiring diagrams and TSBs through Auto Fix Data. Authorised Mitchell1 reseller. Full OEM data. Start free today.',
    alternates: await buildAlternates(lang, `/mitchell1`),
  };
}

// Icons map for features since JSON doesn't store components
const featureIcons = [Database, Activity, Zap, FileText, Clock, Database];

export default async function Mitchell1ProductPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.mitchell1 as any;

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${d?.hero?.heading || "Mitchell1 ProDemand Repair Data"} — via Auto Fix Data`,
    "image": "https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png",
    "description": d?.meta?.description || "Access Mitchell1 ProDemand repair data.",
    "url": pageUrl(lang, `/mitchell1`),
    "brand": {
      "@type": "Brand",
      "name": "Mitchell1"
    },
    "sku": "AFD-MITCHELL",
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
            {d?.hero?.badge ?? 'Authorised Mitchell1 Reseller'}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 max-w-3xl">
            {d?.hero?.heading ?? 'Mitchell1 ProDemand — Advanced Diagnostic Data'}
          </h1>
          <p className="text-xl text-afd-slate max-w-2xl mb-10">
            {d?.hero?.subheading ?? 'Mitchell1 ProDemand is the professional technician’s choice for real-world repair data.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/free-trial">
              <button className="bg-afd-yellow text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-afd-yellow-hover transition-colors">
                {dict.common.startFreeTrial}
              </button>
            </Link>
            <Link href="/pricing">
              <button className="border border-white/30 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/10 transition-colors">
                {dict.common.viewPlans}
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
              {d?.featuresHeading ?? 'Mitchell1 ProDemand — What\'s Included'}
            </h2>
            <p className="text-lg text-afd-text max-w-2xl mx-auto">
              {d?.featuresSubheading ?? 'ProDemand combines OEM-sourced repair data with Mitchell1\'s exclusive SureTrack feature, which draws on millions of real-world repair records from professional technicians. This combination of official and practical data makes ProDemand unique in the market.'}
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
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-afd-navy mb-6">{d?.whyHeading ?? 'SureTrack: The Advantage No Other Platform Has'}</h2>
            <p className="text-lg text-afd-text mb-8 leading-relaxed">
              {d?.whyBody ?? 'Mitchell1\'s SureTrack feature aggregates real repair data from millions of professional technician submissions, identifying common pattern failures, most-likely parts and proven fixes for specific vehicle/symptom combinations. This dramatically reduces diagnostic time, particularly for intermittent faults and elusive ECU-related issues.'}
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
            <h3 className="text-2xl font-bold mb-6">{d?.keyStatsHeading ?? 'Mitchell1 Key Statistics'}</h3>
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
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-6">
            {d?.ctaHeading ?? 'Access Mitchell1 Through Auto Fix Data'}
          </h2>
          <p className="text-lg text-afd-text mb-10">
            {d?.ctaBody ?? 'Auto Fix Data is an authorised Mitchell1 reseller.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-trial">
              <button className="bg-afd-yellow text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-afd-yellow-hover transition-colors">
                {dict.common.startFreeTrial}
              </button>
            </Link>
            <Link href="/mitchell1-alternative">
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
