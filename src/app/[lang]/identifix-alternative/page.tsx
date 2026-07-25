import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { AlternativePageTemplate } from "@/components/AlternativePage";

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  const tpl = dict.alternatives?.template || {};
  const cName = "Identifix Direct-Hit";

  return {
    title: metadataTitle(tpl.metaTitle ? tpl.metaTitle.replace(/\{C\}/g, cName) : `Best ${cName} Alternative | Auto Fix Data`),
    description: tpl.metaDesc ? tpl.metaDesc.replace(/\{C\}/g, cName) : `Searching for a better ${cName} alternative? Stop overpaying.`,
    alternates: await buildAlternates(lang, `/identifix-alternative`),
  };
}

import { getDictionary } from '@/dictionaries/getDictionary';

export default async function IdentifixAlternativePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  return (
    <AlternativePageTemplate
      dict={dict}
      lang={lang}
      competitorId="identifix"
      competitorName="Identifix Direct-Hit"
      competitorPrice="$179+"
    />
  );
}
