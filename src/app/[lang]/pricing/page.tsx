import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import PricingContent from './PricingContent';
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.pricing.meta.title),
    description: dict.pricing.meta.description,
    alternates: await buildAlternates(lang, `/pricing`),
  };
}

export default async function PricingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${dict.pricing.hero.heading} — Auto Fix Data`,
    "description": dict.pricing.meta.description,
    "image": "https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png",
    "url": pageUrl(lang, `/pricing`),
    "brand": {
      "@type": "Brand",
      "name": "Auto Fix Data"
    },
    "sku": "AFD-PRO",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "99.00",
      "highPrice": "199.00",
      "priceCurrency": "GBP",
      "offerCount": "2",
      "availability": "https://schema.org/InStock",
      "url": pageUrl(lang, `/pricing`)
    }
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <PricingContent dict={dict} lang={lang} />
    </>
  );
}
