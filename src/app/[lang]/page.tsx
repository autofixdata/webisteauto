import type { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import { TrustBadges, FeatureTile, ProductCard, TestimonialCard } from '@/components/SharedSections';
import { FAQItem } from '@/components/FAQItem';
import { Wrench, ShieldAlert, Cpu, Activity, BookOpen, Clock } from 'lucide-react';
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: dict.home.meta.title,
    description: dict.home.meta.description,
    alternates: {
      canonical: `https://workshopdata.us/${lang}`,
      languages: Object.fromEntries(LANGS.map(l => [l, `https://workshopdata.us/${l}`])),
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.home;

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative bg-afd-navy pt-20 pb-32 overflow-hidden dark-section">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-afd-navy/80 via-afd-navy/60 to-afd-navy z-0" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="max-w-[800px]">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                {d.hero.headline1} <br />
                <span className="text-afd-yellow">{d.hero.headline2}</span>
              </h1>
              <p className="text-xl md:text-2xl text-afd-slate mb-10 leading-relaxed font-medium">
                {d.hero.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/free-trial" className="px-8 py-4 bg-afd-yellow text-black font-bold rounded-xl text-lg hover:bg-afd-yellow-hover hover:scale-[1.02] transition-all text-center shadow-lg shadow-afd-yellow/20">
                  {d.hero.cta1}
                </Link>
                <Link href="/products" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl text-lg border border-white/20 hover:bg-white/20 transition-all text-center backdrop-blur-sm">
                  {d.hero.cta2}
                </Link>
              </div>
              <TrustBadges />
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-afd-dark py-12 border-y border-afd-border relative z-20 -mt-10 mx-6 md:mx-auto max-w-[1100px] rounded-2xl shadow-2xl shadow-black/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 divide-x divide-white/10">
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">150M+</div>
            <div className="text-sm font-semibold text-afd-slate uppercase tracking-wider">{d.stats.vehicles}</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-extrabold text-afd-yellow mb-1">10k+</div>
            <div className="text-sm font-semibold text-afd-slate uppercase tracking-wider">{d.stats.workshops}</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">5</div>
            <div className="text-sm font-semibold text-afd-slate uppercase tracking-wider">{d.stats.databases}</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">7</div>
            <div className="text-sm font-semibold text-afd-slate uppercase tracking-wider">{d.stats.markets}</div>
          </div>
        </div>
      </section>

      {/* PRODUCTS OVERVIEW */}
      <section className="py-24 bg-afd-light">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-afd-navy mb-4">
              {d.products.heading} <span className="text-afd-blue">{d.products.headingHighlight}</span>
            </h2>
            <p className="text-xl text-afd-text max-w-2xl mx-auto">{d.products.subheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard brand="ALLDATA" color="bg-orange-500 text-white" tagline={d.products.alldata.tagline} description={d.products.alldata.desc} link="/alldata" />
            <ProductCard brand="AutoData" color="bg-blue-600 text-white" tagline={d.products.autodata.tagline} description={d.products.autodata.desc} link="/autodata" />
            <ProductCard brand="Haynes Pro" color="bg-red-600 text-white" tagline={d.products.haynesPro.tagline} description={d.products.haynesPro.desc} link="/haynes-pro" />
            <ProductCard brand="Mitchell1" color="bg-blue-800 text-white" tagline={d.products.mitchell1.tagline} description={d.products.mitchell1.desc} link="/mitchell1" />
            <ProductCard brand="Identifix" color="bg-purple-600 text-white" tagline={d.products.identifix.tagline} description={d.products.identifix.desc} link="/identifix" />
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold text-afd-navy mb-4">{d.features.heading}</h2>
            <p className="text-xl text-afd-text max-w-2xl">{d.features.subheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureTile icon={Wrench} title={d.features.oem.title} desc={d.features.oem.desc} />
            <FeatureTile icon={Activity} title={d.features.wiring.title} desc={d.features.wiring.desc} />
            <FeatureTile icon={ShieldAlert} title={d.features.dtc.title} desc={d.features.dtc.desc} />
            <FeatureTile icon={BookOpen} title={d.features.tsb.title} desc={d.features.tsb.desc} />
            <FeatureTile icon={Clock} title={d.features.maintenance.title} desc={d.features.maintenance.desc} />
            <FeatureTile icon={Cpu} title={d.features.diagnostic.title} desc={d.features.diagnostic.desc} />
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
      {/* TESTIMONIALS */}
      <section className="py-24 bg-afd-light">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-afd-navy mb-16">{d.testimonials.heading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard quote={d.testimonials.t1.quote} name={d.testimonials.t1.name} role={d.testimonials.t1.role} garage={d.testimonials.t1.garage} />
            <TestimonialCard quote={d.testimonials.t2.quote} name={d.testimonials.t2.name} role={d.testimonials.t2.role} garage={d.testimonials.t2.garage} />
            <TestimonialCard quote={d.testimonials.t3.quote} name={d.testimonials.t3.name} role={d.testimonials.t3.role} garage={d.testimonials.t3.garage} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-afd-navy mb-12">{dict.common.faqTitle}</h2>
          <div className="space-y-2">
            <FAQItem q={d.faq.q1} a={d.faq.a1} />
            <FAQItem q={d.faq.q2} a={d.faq.a2} />
            <FAQItem q={d.faq.q3} a={d.faq.a3} />
            <FAQItem q={d.faq.q4} a={d.faq.a4} />
            <FAQItem q={d.faq.q5} a={d.faq.a5} />
          </div>
        </div>
      </section>
    </>
  );
}
