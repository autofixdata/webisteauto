import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import Link from '@/components/LocalizedLink';
import { CheckCircle2, Database, FileText, Zap, Settings, BookOpen, ArrowRight } from "lucide-react";
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.alldata?.meta?.title ?? 'ALLDATA Repair Data via Auto Fix Data | OEM Service Manuals & TSBs'),
    description: dict.alldata?.meta?.description ?? "Access ALLDATA's complete library of unedited OEM repair procedures, Technical Service Bulletins, wiring diagrams and diagnostic data through Auto Fix Data. Free 7-day trial.",
    alternates: await buildAlternates(lang, `/alldata`),
  };
}

// Icons map for features since JSON doesn't store components
const featureIcons = [Database, FileText, Zap, BookOpen, Settings, Database];

export default async function AlldataProductPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.alldata as any;

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${d?.hero?.heading || "ALLDATA Repair Data"} — via Auto Fix Data`,
    "image": "https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png",
    "description": d?.meta?.description || "Access ALLDATA's complete OEM repair procedures.",
    "url": pageUrl(lang, `/alldata`),
    "brand": {
      "@type": "Brand",
      "name": "ALLDATA"
    },
    "sku": "AFD-ALLDATA",
    "offers": {
      "@type": "Offer",
      "name": dict.common?.freeTrial || "Free 7-Day Trial",
      "price": "0.00",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "url": pageUrl(lang, `/free-trial`)
    }
  });

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (d?.faqs || []).map((faq: any) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />

      {/* Hero */}
      <section className="bg-afd-navy pt-24 pb-20 dark-section">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 text-afd-yellow text-sm font-bold px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-afd-yellow rounded-full"></span>
            {d?.hero?.badge ?? 'Authorised ALLDATA Reseller'}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 max-w-3xl">
            {d?.hero?.heading ?? 'ALLDATA — Unedited OEM Repair Data by AutoZone'}
          </h1>
          <p className="text-xl text-afd-slate max-w-2xl mb-10">
            {d?.hero?.subheading ?? "The automotive industry's most trusted source of factory-direct repair information."}
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

      {/* Stats bar */}
      <section className="py-4 bg-afd-dark">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap gap-8 text-sm text-afd-slate">
          {(d?.statsBar || []).map((stat: any, i: number) => (
            <span key={i}><strong className="text-white">{stat.value}</strong> {stat.label}</span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-4">
              {d?.featuresHeading ?? 'What ALLDATA Includes in Your Subscription'}
            </h2>
            <p className="text-lg text-afd-text max-w-2xl mx-auto">
              {d?.featuresSubheading ?? 'ALLDATA is the gold standard for OEM repair data — used by professional technicians and authorised dealerships worldwide. Every piece of data is sourced directly from vehicle manufacturers, unedited and unabridged.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(d?.features || []).map((feature: any, i: number) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <div key={feature.title} className="p-8 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-afd-light rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-50 transition-colors">
                    <Icon className="w-7 h-7 text-afd-blue group-hover:text-orange-500 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-afd-navy mb-3">{feature.title}</h3>
                  <p className="text-afd-text leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why ALLDATA section */}
      <section className="py-20 bg-afd-light">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-6">
                {d?.whyHeading ?? 'The Industry Standard for OEM Data'}
              </h2>
              <p className="text-lg text-afd-text mb-8 leading-relaxed">
                {d?.whyBody ?? 'ALLDATA is trusted by over 400,000 professional technicians worldwide and covers more than 44,000 vehicle applications.'}
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
              <h3 className="text-2xl font-bold mb-6">{d?.keyStatsHeading ?? 'ALLDATA Key Statistics'}</h3>
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

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-afd-navy mb-10 text-center">{d?.faqHeading ?? 'Frequently Asked Questions'}</h2>
          <div className="space-y-4">
            {(d?.faqs || []).map(({ q, a }: any) => (
              <details key={q} className="group bg-afd-light rounded-2xl border border-gray-100 overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-bold text-afd-navy">
                  {q}
                  <ArrowRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <p className="px-6 pb-5 text-sm text-afd-text leading-relaxed border-t border-gray-100 pt-4">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-afd-light border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-afd-navy mb-8 text-center">
            {d?.latestGuidesHeading ?? 'Latest ALLDATA & AI Guides'}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <li>
              <Link href="/blog/alldata-ai-repair-assistant-2026" className="block p-5 bg-white rounded-xl border border-gray-100 hover:border-afd-yellow hover:shadow-md transition-all text-afd-navy font-semibold text-sm">
                ALLDATA AI Repair Assistant →
              </Link>
            </li>
            <li>
              <Link href="/blog/alldata-ai-tsb-diagnostics-guide" className="block p-5 bg-white rounded-xl border border-gray-100 hover:border-afd-yellow hover:shadow-md transition-all text-afd-navy font-semibold text-sm">
                AI TSB & Diagnostics Guide →
              </Link>
            </li>
            <li>
              <Link href="/blog/alldata-pricing-vs-ai-bundles-2026" className="block p-5 bg-white rounded-xl border border-gray-100 hover:border-afd-yellow hover:shadow-md transition-all text-afd-navy font-semibold text-sm">
                ALLDATA Pricing vs AI Bundles →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-6">
            {d?.ctaHeading ?? 'Access ALLDATA Through Auto Fix Data'}
          </h2>
          <p className="text-lg text-afd-text mb-10">
            {d?.ctaBody ?? 'Auto Fix Data is an authorised ALLDATA reseller.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-trial">
              <button className="bg-afd-yellow text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-afd-yellow-hover transition-colors">
                {dict.common.startFreeTrial}
              </button>
            </Link>
            <Link href="/alldata-alternative">
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
