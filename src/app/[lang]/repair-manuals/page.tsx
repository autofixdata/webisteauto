import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import Link from '@/components/LocalizedLink';
import { BookOpen, CheckCircle2 } from "lucide-react";
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.repairManuals.meta.title),
    description: dict.repairManuals.meta.description,
    alternates: await buildAlternates(lang, `/repair-manuals`),
  };
}

export default async function RepairManualsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.repairManuals;

  const productSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${d.hero?.heading1 || "OEM Repair Manuals"} — Auto Fix Data`,
    "image": "https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png",
    "description": d.meta?.description || "Access OEM-level repair manuals for 150M+ vehicles.",
    "url": pageUrl(lang, `/repair-manuals`),
    "brand": {
      "@type": "Brand",
      "name": "Auto Fix Data"
    },
    "sku": "AFD-MANUALS",
    "offers": {
      "@type": "Offer",
      "name": dict.common?.freeTrial || "Free 7-Day Trial",
      "price": "0.00",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "url": pageUrl(lang, `/free-trial`)
    }
  });

  const brands = [
    { name: "BMW", slug: "bmw" }, { name: "Ford", slug: "ford" },
    { name: "VW", slug: "volkswagen" }, { name: "Toyota", slug: "toyota" },
    { name: "Audi", slug: "audi" }, { name: "Mercedes", slug: "mercedes-benz" },
    { name: "Renault", slug: "renault" }, { name: "Peugeot", slug: "peugeot" },
    { name: "Honda", slug: "honda" }, { name: "Nissan", slug: "nissan" },
    { name: "Vauxhall", slug: "vauxhall" }, { name: "Kia", slug: "kia" },
    { name: "Hyundai", slug: "hyundai" }, { name: "Volvo", slug: "volvo" },
    { name: "Skoda", slug: "skoda" }, { name: "Fiat", slug: "fiat" },
    { name: "Mazda", slug: "mazda" }, { name: "Mini", slug: "mini" },
    { name: "SEAT", slug: "seat" }, { name: "Alfa Romeo", slug: "alfa-romeo" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productSchema }} />

      <section className="bg-afd-navy py-20 px-6 dark-section">
        <div className="max-w-[1000px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-afd-yellow text-sm font-bold px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-afd-yellow rounded-full"></span>
            {d.hero.badge}
          </div>
          <BookOpen className="w-12 h-12 text-afd-yellow mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            {d.hero.heading1} <span className="text-afd-yellow">{d.hero.heading2}</span>
          </h1>
          <p className="text-xl text-afd-slate">{d.hero.subheading}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/free-trial" className="bg-afd-yellow text-black font-bold px-8 py-4 rounded-lg text-lg hover:bg-afd-yellow-hover transition-colors">
              {d.hero.cta1}
            </Link>
            <Link href="/manuals" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/10 transition-colors">
              {d.hero.cta2}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-afd-navy mb-4">{d.features.heading}</h2>
            <p className="text-lg text-afd-text max-w-2xl mx-auto">{d.features.subheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: d.features.f1.title, desc: d.features.f1.desc },
              { title: d.features.f2.title, desc: d.features.f2.desc },
              { title: d.features.f3.title, desc: d.features.f3.desc },
              { title: d.features.f4.title, desc: d.features.f4.desc },
              { title: d.features.f5.title, desc: d.features.f5.desc },
              { title: d.features.f6.title, desc: d.features.f6.desc },
            ].map(({ title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <CheckCircle2 className="w-6 h-6 text-afd-yellow mb-3" />
                <h3 className="font-bold text-afd-navy mb-2">{title}</h3>
                <p className="text-afd-text text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-afd-light px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold text-afd-navy mb-8 text-center">{d.browseMakes}</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {brands.map(brand => (
              <Link href={`/manuals/${brand.slug}`} key={brand.slug} className="group bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center gap-1.5 hover:border-afd-yellow/50 hover:shadow-md transition-all cursor-pointer">
                <img
                  src={`/images/logos/${brand.slug}.png`}
                  alt={brand.name}
                  className="h-7 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-[10px] font-semibold text-afd-slate group-hover:text-afd-navy text-center leading-tight">{brand.name}</span>
              </Link>
            ))}
          </div>
          <p className="text-center text-sm text-afd-slate mt-6 font-medium">
            <Link href="/manuals" className="hover:text-afd-blue">{d.allMakes}</Link>
          </p>
        </div>
      </section>
    </>
  );
}
