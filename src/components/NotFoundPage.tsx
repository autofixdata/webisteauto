'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Home, Wrench, BookOpen } from 'lucide-react';
import GlobalSearch from '@/components/GlobalSearch';
import { NOT_FOUND_LABELS } from '@/lib/notFoundLabels';

const LOCALES = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'] as const;

type NotFoundPageProps = {
  /** Used by root not-found when there is no [lang] segment in the URL */
  forcedLang?: string;
};

export default function NotFoundPage({ forcedLang }: NotFoundPageProps) {
  const params = useParams();
  const paramLang = typeof params?.lang === 'string' ? params.lang : undefined;
  const lang =
    forcedLang && (LOCALES as readonly string[]).includes(forcedLang)
      ? forcedLang
      : paramLang && (LOCALES as readonly string[]).includes(paramLang)
        ? paramLang
        : 'en';
  const t = NOT_FOUND_LABELS[lang] ?? NOT_FOUND_LABELS.en;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center">
      <div className="w-16 h-16 bg-afd-navy rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <Wrench className="w-8 h-8 text-afd-yellow" aria-hidden />
      </div>
      <p className="text-sm font-bold uppercase tracking-widest text-afd-slate mb-2">404</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-3">{t.title}</h1>
      <p className="text-afd-slate max-w-lg mb-8 text-lg leading-relaxed">{t.description}</p>

      <div className="w-full max-w-xl mb-10">
        <GlobalSearch
          lang={lang}
          placeholder={t.searchPlaceholder}
          viewAllResultsLabel={t.viewAllResults}
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-afd-yellow text-black font-bold hover:bg-afd-yellow-hover transition-colors"
        >
          <Home className="w-4 h-4" aria-hidden />
          {t.home}
        </Link>
        <Link
          href={`/${lang}/dtc`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-afd-navy text-afd-navy font-bold hover:bg-afd-navy hover:text-white transition-colors"
        >
          <BookOpen className="w-4 h-4" aria-hidden />
          {t.dtc}
        </Link>
        <Link
          href={`/${lang}/search`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-afd-navy font-bold hover:bg-gray-50 transition-colors"
        >
          {t.search}
        </Link>
      </div>
    </div>
  );
}
