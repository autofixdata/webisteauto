import type { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/getDictionary';
import SearchPageClient from './SearchPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar' | 'he');
  const s = dict.common.searchPage;
  return {
    title: s.title,
    description: s.description,
    robots: { index: false, follow: true },
  };
}

export default async function SiteSearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar' | 'he');

  return <SearchPageClient lang={lang} copy={dict.common.searchPage} />;
}
