import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import Script from 'next/script';
import { CheckCircle2, Shield } from "lucide-react";
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.freeTrial.meta.title),
    description: dict.freeTrial.meta.description,
    alternates: await buildAlternates(lang, `/free-trial`),
  };
}

export default async function FreeTrialPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.freeTrial;

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${d.hero.heading} — Auto Fix Data`,
    "image": "https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png",
    "description": d.meta.description,
    "url": pageUrl(lang, `/free-trial`),
    "brand": {
      "@type": "Brand",
      "name": "Auto Fix Data"
    },
    "sku": "AFD-TRIAL",
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
      <Script src="https://link.autodatalogin.com/js/form_embed.js" strategy="lazyOnload" />

      <div className="bg-afd-light min-h-[calc(100vh-200px)] py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Value Prop */}
          <div>
            <span className="text-afd-blue font-bold tracking-wider uppercase text-sm mb-4 block">Professional Access</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-afd-navy mb-6 leading-tight">
              {d.hero.heading}
            </h1>
            <p className="text-xl text-afd-text mb-8">
              {d.hero.subheadingHighlight}
            </p>

            <div className="space-y-4 mb-10">
              {[d.benefits.b1, d.benefits.b2, d.benefits.b3, d.benefits.b4, d.benefits.b5].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-afd-yellow shrink-0 mt-0.5" />
                  <span className="text-afd-navy font-medium text-lg">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Shield className="w-8 h-8 text-green-500 shrink-0" />
              <p className="text-sm text-afd-text">
                <strong className="text-afd-navy block">Data Security Guarantee</strong>
                Your information is securely encrypted and never sold to third parties. We only verify you are a professional workshop.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full lg:w-[121%] max-w-[664px] mx-auto overflow-hidden">
            <iframe
              src="https://link.autodatalogin.com/widget/form/4tQbweI60VyYW02nlcVf"
              style={{ width: "100%", height: "100%", border: "none", borderRadius: "12px" }}
              id="inline-4tQbweI60VyYW02nlcVf"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Start Your Free 7-Day Trial"
              data-height="671"
              data-layout-iframe-id="inline-4tQbweI60VyYW02nlcVf"
              data-form-id="4tQbweI60VyYW02nlcVf"
              title={d.hero.heading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
