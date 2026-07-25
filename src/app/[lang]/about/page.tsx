import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.about.meta.title),
    description: dict.about.meta.description,
    alternates: await buildAlternates(lang, `/about`),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.about;

  return (
    <>
      <section className="bg-afd-navy py-24 px-6 text-center dark-section border-b border-afd-border">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{d.hero.heading}</h1>
        <p className="text-xl text-afd-slate max-w-2xl mx-auto">
          {d.hero.subheading}
        </p>
      </section>

      <section className="py-20 bg-white px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-2xl font-bold text-afd-navy mb-4">{d.mission.heading}</h2>
          <p className="text-afd-text text-lg mb-12">{d.mission.body}</p>

          <h2 className="text-2xl font-bold text-afd-navy mb-6">{d.values.heading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: d.values.v1.title, desc: d.values.v1.desc },
              { title: d.values.v2.title, desc: d.values.v2.desc },
              { title: d.values.v3.title, desc: d.values.v3.desc },
              { title: d.values.v4.title, desc: d.values.v4.desc },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-afd-light p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-afd-navy mb-2">{title}</h3>
                <p className="text-afd-text text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
