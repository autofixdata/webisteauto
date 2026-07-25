import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import Link from '@/components/LocalizedLink';
import { ProductCard } from '@/components/SharedSections';
import { CheckCircle2 } from 'lucide-react';
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.products.meta.title),
    description: dict.products.meta.description,
    alternates: await buildAlternates(lang, `/products`),
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.products;
  const h = dict.home.products;

  return (
    <>
      <section className="bg-afd-navy pt-20 pb-16 px-6 text-center dark-section">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
          {d.hero.heading1}<br /><span className="text-afd-yellow">{d.hero.heading2}</span>
        </h1>
        <p className="text-xl text-afd-slate max-w-3xl mx-auto mb-10">
          {d.hero.subheading}
        </p>
      </section>

      <section className="py-20 bg-afd-light px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <ProductCard
              brand="ALLDATA" color="bg-orange-500 text-white"
              tagline={h.alldata.tagline}
              description={h.alldata.desc}
              link="/alldata"
            />
            <ProductCard
              brand="AutoData" color="bg-blue-600 text-white"
              tagline={h.autodata.tagline}
              description={h.autodata.desc}
              link="/autodata"
            />
            <ProductCard
              brand="Haynes Pro" color="bg-red-600 text-white"
              tagline={h.haynesPro.tagline}
              description={h.haynesPro.desc}
              link="/haynes-pro"
            />
            <ProductCard
              brand="Mitchell1" color="bg-blue-800 text-white"
              tagline={h.mitchell1.tagline}
              description={h.mitchell1.desc}
              link="/mitchell1"
            />
            <ProductCard
              brand="Identifix" color="bg-purple-600 text-white"
              tagline={h.identifix.tagline}
              description={h.identifix.desc}
              link="/identifix"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-afd-navy text-white">
              <h2 className="text-2xl font-bold">{d.comparison.heading}</h2>
              <p className="text-afd-slate">{d.comparison.subheading}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-afd-light border-b border-gray-200">
                    <th className="p-4 font-bold text-afd-navy">{d.comparison.col1}</th>
                    <th className="p-4 font-bold text-afd-navy text-center">{d.comparison.col2}</th>
                    <th className="p-4 font-bold text-afd-navy text-center">{d.comparison.col3}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { feature: "Unedited OEM Repair Procedures", provider: "ALLDATA / Mitchell1" },
                    { feature: "Interactive Colour Wiring Diagrams", provider: "Haynes Pro / Mitchell1" },
                    { feature: "Diagnostic Trouble Codes (DTCs)", provider: "All Providers" },
                    { feature: "Confirmed Real-World Fixes", provider: "Identifix / Mitchell1" },
                    { feature: "Technical Service Bulletins (TSBs)", provider: "ALLDATA" },
                    { feature: "Service & Maintenance Schedules", provider: "AutoData" },
                    { feature: "Component Locations & Pinouts", provider: "AutoData / Haynes Pro" },
                    { feature: "Torque Specifications", provider: "All Providers" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-4 text-afd-text font-medium">{row.feature}</td>
                      <td className="p-4 text-afd-slate text-center text-sm">{row.provider}</td>
                      <td className="p-4 text-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-gray-50 flex justify-center border-t border-gray-100">
              <Link href="/pricing" className="bg-afd-yellow text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-afd-yellow-hover transition-colors">
                {dict.common.viewPlans}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
