import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import Link from '@/components/LocalizedLink';
import { ShieldAlert, Activity, Search, Database, Zap, BookOpen, CheckCircle2 } from "lucide-react";
import { FAQItem } from "@/components/FAQItem";
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

const codeTypes = [
  { code: "P-Codes", range: "P0000–P3999", name: "Powertrain", desc: "Engine, transmission, fuel system and emissions. The most commonly retrieved codes in workshop use.", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { code: "B-Codes", range: "B0000–B3999", name: "Body", desc: "Body control modules, airbag, seat control, climate, windows and security systems.", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { code: "C-Codes", range: "C0000–C3999", name: "Chassis", desc: "ABS, traction control, ESC, ride height, steering and suspension control codes.", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { code: "U-Codes", range: "U0000–U3999", name: "Network/CAN Bus", desc: "Controller Area Network faults, module communication failures and gateway errors.", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.diagnostics.meta.title),
    description: dict.diagnostics.meta.description,
    alternates: await buildAlternates(lang, `/diagnostics`),
  };
}

export default async function DiagnosticsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.diagnostics as any;

  const faqs = [
    { q: d.faq.q1, a: d.faq.a1 },
    { q: d.faq.q2, a: d.faq.a2 },
    { q: d.faq.q3, a: d.faq.a3 },
    { q: d.faq.q4, a: d.faq.a4 },
    { q: d.faq.q5, a: d.faq.a5 },
  ].filter(f => f.q && f.a);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${d.hero.heading1} ${d.hero.heading2} — Auto Fix Data`,
    "description": d.meta.description || "Access the complete OBD2 and OEM-specific DTC library.",
    "url": pageUrl(lang, `/diagnostics`),
    "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": lang === 'en' ? "GBP" : "EUR" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="bg-afd-dark py-24 px-6 border-b border-afd-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-afd-dark via-afd-dark/90 to-transparent z-0"></div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold tracking-wider mb-6 border border-red-500/30">
              <ShieldAlert className="w-4 h-4" /> {d.hero.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              {d.hero.heading1}<br />{d.hero.heading2}
            </h1>
            <p className="text-xl text-afd-slate mb-8 leading-relaxed">
              {d.hero.subheading}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-block px-8 py-4 bg-afd-yellow text-black font-bold rounded-xl hover:bg-afd-yellow-hover transition-all text-lg shadow-lg shadow-afd-yellow/20">
                {d.hero.cta1}
              </Link>
              <Link href="/pricing" className="inline-block px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-lg border border-white/20">
                {d.hero.cta2}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-afd-slate">
              <span><strong className="text-white">50M+</strong> {d.hero.stat1}</span>
              <span><strong className="text-white">150+</strong> {d.hero.stat2}</span>
              <span><strong className="text-white">Daily</strong> {d.hero.stat3}</span>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="bg-afd-navy rounded-2xl border border-afd-border p-6 shadow-2xl shadow-black/50 font-mono">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                <Search className="w-5 h-5 text-afd-slate" />
                <span className="text-white text-sm">P0420 — Toyota Camry 2020</span>
              </div>
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                  <div className="text-red-400 font-bold text-xl mb-1">P0420</div>
                  <div className="text-white text-sm">Catalyst System Efficiency Below Threshold (Bank 1)</div>
                </div>
                <div className="bg-afd-dark p-4 rounded-lg border border-white/5">
                  <div className="text-afd-slate text-xs mb-2 tracking-wider">COMMON CAUSES</div>
                  <ul className="text-white/80 text-sm space-y-1.5">
                    <li>• Faulty Catalytic Converter (Bank 1)</li>
                    <li>• Exhaust Leak before Catalyst</li>
                    <li>• Faulty O2 Sensor (B1, S2)</li>
                    <li>• Engine Misfire / Running Rich</li>
                  </ul>
                </div>
                <div className="bg-afd-blue/20 border border-afd-blue/30 p-4 rounded-lg">
                  <div className="text-afd-blue font-bold text-xs mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> IDENTIFIX: 847 CONFIRMED FIXES</div>
                  <div className="text-white text-sm">Most common: Replace CAT — 62% of cases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DTC TYPES */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-afd-navy mb-4">{d.codeTypes.heading}</h2>
            <p className="text-afd-text text-lg max-w-2xl mx-auto">{d.codeTypes.subheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { code: "P-Codes", range: "P0000–P3999", name: d.codeTypes.powertrain.name, desc: d.codeTypes.powertrain.desc, color: "bg-red-500/20 text-red-400 border-red-500/30" },
              { code: "B-Codes", range: "B0000–B3999", name: d.codeTypes.body.name, desc: d.codeTypes.body.desc, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
              { code: "C-Codes", range: "C0000–C3999", name: d.codeTypes.chassis.name, desc: d.codeTypes.chassis.desc, color: "bg-green-500/20 text-green-400 border-green-500/30" },
              { code: "U-Codes", range: "U0000–U3999", name: d.codeTypes.network.name, desc: d.codeTypes.network.desc, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
            ].map(({ code, range, name, desc, color }) => (
              <div key={code} className="p-6 rounded-2xl bg-afd-light border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-4 ${color}`}>{code}</div>
                <div className="text-xs text-afd-slate mb-1 font-mono">{range}</div>
                <h3 className="text-lg font-bold text-afd-navy mb-2">{name}</h3>
                <p className="text-sm text-afd-text leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-afd-light border-y border-gray-100 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-afd-navy mb-4">{d.features.heading}</h2>
            <p className="text-afd-text text-lg max-w-2xl mx-auto">{d.features.subheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Database, title: d.features.f1.title, desc: d.features.f1.desc },
              { icon: Activity, title: d.features.f2.title, desc: d.features.f2.desc },
              { icon: ShieldAlert, title: d.features.f3.title, desc: d.features.f3.desc },
              { icon: BookOpen, title: d.features.f4.title, desc: d.features.f4.desc },
              { icon: Zap, title: d.features.f5.title, desc: d.features.f5.desc },
              { icon: Search, title: d.features.f6.title, desc: d.features.f6.desc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <Icon className="w-10 h-10 text-afd-blue mb-5" />
                <h3 className="text-lg font-bold text-afd-navy mb-3">{title}</h3>
                <p className="text-afd-text text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATABASE SOURCES */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-afd-navy mb-6">{d.coverage.heading}</h2>
              <p className="text-afd-text mb-6 leading-relaxed">{d.coverage.body}</p>
              <ul className="space-y-4">
                {[d.coverage.s1, d.coverage.s2, d.coverage.s3, d.coverage.s4, d.coverage.s5].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-afd-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-afd-dark rounded-2xl p-8 border border-afd-border">
              <h3 className="text-white font-bold text-xl mb-6">Diagnostic Data Coverage</h3>
              <div className="space-y-5">
                {[
                  { label: d.coverage.stat1label, value: d.coverage.stat1value },
                  { label: d.coverage.stat2label, value: d.coverage.stat2value },
                  { label: d.coverage.stat3label, value: d.coverage.stat3value },
                  { label: d.coverage.stat4label, value: d.coverage.stat4value },
                  { label: d.coverage.stat5label, value: d.coverage.stat5value },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-afd-slate text-sm">{label}</span>
                    <span className="text-afd-yellow font-extrabold text-xl">{value}</span>
                  </div>
                ))}
              </div>
            </div>
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
          <h2 className="text-3xl font-extrabold text-afd-navy mb-10 text-center">{dict.common.faqTitle}</h2>
          <div className="space-y-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            {faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-afd-navy dark-section text-center px-6">
        <h2 className="text-3xl font-extrabold text-white mb-4">{d.cta.heading}</h2>
        <p className="text-afd-slate text-lg max-w-xl mx-auto mb-8">{d.cta.subheading}</p>
        <Link href="/free-trial" className="inline-block px-8 py-4 bg-afd-yellow text-black font-bold rounded-xl text-lg hover:bg-afd-yellow-hover transition-all shadow-lg shadow-afd-yellow/20">
          {d.cta.button}
        </Link>
      </section>
    </>
  );
}
