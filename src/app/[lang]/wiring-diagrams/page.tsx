import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import Link from '@/components/LocalizedLink';
import { Zap, ZoomIn, MapPin, Search, Layers, Monitor } from "lucide-react";
import { FAQItem } from "@/components/FAQItem";
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

const systems = [
  { name: "Engine Management", desc: "ECU wiring, fuel injectors, ignition coils, MAF, MAP, O2 sensors and throttle body connections.", icon: "⚙️" },
  { name: "ABS & Braking", desc: "ABS pump, wheel speed sensors, hydraulic unit and ESC system wiring for every axle configuration.", icon: "🛑" },
  { name: "Airbag & SRS", desc: "Airbag control module, crash sensors, seatbelt pre-tensioners and clock spring wiring.", icon: "🛡️" },
  { name: "HVAC & Climate", desc: "Heater matrix, evaporator, blower motor, compressor clutch and dual-zone climate control circuits.", icon: "🌡️" },
  { name: "Body & Lighting", desc: "Body control module, exterior/interior lighting, power windows, central locking and keyless entry.", icon: "💡" },
  { name: "CAN Bus & Networking", desc: "Full network topology diagrams showing all modules, gateway locations and bus termination points.", icon: "🔌" },
  { name: "ADAS & Safety", desc: "Adaptive cruise, lane departure, autonomous emergency braking, camera and radar system wiring.", icon: "📡" },
  { name: "EV & Hybrid HV", desc: "High-voltage battery management, inverter, DC-DC converter and charging circuit diagrams with safety warnings.", icon: "⚡" },
];



export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.wiring.meta.title),
    description: dict.wiring.meta.description,
    alternates: await buildAlternates(lang, `/wiring-diagrams`),
  };
}

export default async function WiringDiagramsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.wiring;

  // Localized FAQs from dictionary (all 7 languages)
  const faqs = (d.faq as Array<{ q: string; a: string }> || []).filter(f => f.q && f.a);

  const productSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${d.hero.heading1 || "Wiring Diagrams"} — Auto Fix Data`,
    "image": "https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png",
    "description": d.meta.description || "Full-colour interactive wiring diagrams, ECU pinouts and component locators.",
    "url": pageUrl(lang, `/wiring-diagrams`),
    "brand": {
      "@type": "Brand",
      "name": "Auto Fix Data"
    },
    "sku": "AFD-WIRING",
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
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  });

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: productSchema }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: faqSchema }} />

      {/* HERO */}
      <section className="bg-afd-dark py-24 px-6 border-b border-afd-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-afd-dark via-afd-dark/90 to-afd-dark z-0"></div>
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-yellow-500/10 text-afd-yellow rounded-full text-sm font-bold tracking-wider mb-6 border border-afd-yellow/20">
            <Zap className="w-4 h-4" /> {d.hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            {d.hero.heading1}<br /><span className="text-afd-yellow">{d.hero.heading2}</span>
          </h1>
          <p className="text-xl text-afd-slate max-w-3xl mx-auto mb-10 leading-relaxed">
            {d.hero.subheading}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="inline-block px-8 py-4 bg-afd-yellow text-black font-bold rounded-xl hover:bg-afd-yellow-hover transition-all text-lg shadow-lg shadow-afd-yellow/20">
              {d.hero.cta1 ?? 'Explore Wiring Database'}
            </Link>
            <Link href="/pricing" className="inline-block px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-lg border border-white/20">
              {d.hero.cta2 ?? 'Compare Plans'}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-afd-light px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-afd-navy mb-4">{d.features.heading}</h2>
            <p className="text-afd-text text-lg max-w-2xl mx-auto">{d.features.subheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: d.features.f1.title, desc: d.features.f1.desc },
              { icon: MapPin, title: d.features.f2.title, desc: d.features.f2.desc },
              { icon: Search, title: d.features.f3.title, desc: d.features.f3.desc },
              { icon: Monitor, title: d.features.f4.title, desc: d.features.f4.desc },
              { icon: Zap, title: d.features.f5.title, desc: d.features.f5.desc },
              { icon: ZoomIn, title: d.features.f6.title, desc: d.features.f6.desc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-afd-blue/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-afd-blue" />
                </div>
                <h3 className="font-bold text-afd-navy mb-2">{title}</h3>
                <p className="text-sm text-afd-text leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEMS GRID */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-afd-navy mb-4">Every Electrical System Covered</h2>
            <p className="text-afd-text text-lg max-w-2xl mx-auto">From basic lighting to high-voltage EV systems — our wiring database covers every circuit on every major vehicle.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {systems.map(({ name, desc, icon }) => (
              <div key={name} className="p-6 bg-afd-light rounded-2xl border border-gray-100 hover:border-afd-yellow/30 hover:shadow-lg transition-all group">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-afd-navy mb-2">{name}</h3>
                <p className="text-sm text-afd-text leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAKES GRID */}
      <section className="py-20 bg-afd-dark">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">{dict.common.coverageHeading}</h2>
            <p className="text-afd-slate">{dict.common.coverageSub}</p>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {[
              { name: "BMW", slug: "bmw" },
              { name: "Ford", slug: "ford" },
              { name: "VW", slug: "volkswagen" },
              { name: "Toyota", slug: "toyota" },
              { name: "Mercedes", slug: "mercedes-benz" },
              { name: "Vauxhall", slug: "vauxhall" },
              { name: "Renault", slug: "renault" },
              { name: "Peugeot", slug: "peugeot" },
              { name: "Audi", slug: "audi" },
              { name: "Honda", slug: "honda" },
              { name: "Nissan", slug: "nissan" },
              { name: "Hyundai", slug: "hyundai" },
              { name: "Kia", slug: "kia" },
              { name: "Volvo", slug: "volvo" },
              { name: "Skoda", slug: "skoda" },
              { name: "Land Rover", slug: "land-rover" },
              { name: "Fiat", slug: "fiat" },
              { name: "Mazda", slug: "mazda" },
              { name: "Mini", slug: "mini" },
              { name: "SEAT", slug: "seat" },
              { name: "Alfa Romeo", slug: "alfa-romeo" },
              { name: "Citroën", slug: "citroen" },
              { name: "Porsche", slug: "porsche" },
              { name: "Subaru", slug: "subaru" },
              { name: "Mitsubishi", slug: "mitsubishi" },
              { name: "Ferrari", slug: "ferrari" },
              { name: "Lamborghini", slug: "lamborghini" },
              { name: "Jaguar", slug: "jaguar" },
              { name: "Jeep", slug: "jeep" },
              { name: "+ 120 more", slug: null },
            ].map((make, i) => (
              make.slug ? (
                <Link key={i} href={`/${lang}/manuals/${make.slug}`} className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-afd-yellow/30 transition-all cursor-pointer">
                  <img
                    src={`/images/logos/${make.slug}.png`}
                    alt={make.name}
                    className="h-8 w-auto object-contain filter brightness-0 invert opacity-50 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0 transition-all"
                  />
                  <span className="text-[10px] text-afd-slate group-hover:text-white font-medium text-center leading-tight">{make.name}</span>
                </Link>
              ) : (
                <Link href={`/${lang}/repair-manuals`} key={i} className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-afd-yellow/10 hover:bg-afd-yellow/20 border border-afd-yellow/20 hover:border-afd-yellow transition-all cursor-pointer">
                  <span className="text-afd-yellow font-extrabold text-lg">+120</span>
                  <span className="text-[10px] text-afd-yellow font-bold text-center leading-tight">All Makes →</span>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-afd-light border-t border-gray-100 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-3xl font-extrabold text-afd-navy mb-10 text-center">{(d as { faqHeading?: string }).faqHeading ?? dict.common.faqTitle}</h2>
          <div className="space-y-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            {faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-afd-navy dark-section text-center px-6">
        <h2 className="text-3xl font-extrabold text-white mb-4">Start Tracing Circuits the Right Way</h2>
        <p className="text-afd-slate text-lg max-w-xl mx-auto mb-8">Full-colour interactive wiring diagrams included in every Auto Fix Data plan. Try free for 7 days.</p>
        <Link href="/free-trial" className="inline-block px-8 py-4 bg-afd-yellow text-black font-bold rounded-xl text-lg hover:bg-afd-yellow-hover transition-all shadow-lg shadow-afd-yellow/20">
          {dict.common.startFreeTrial}
        </Link>
      </section>
    </>
  );
}
