'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Search, AlertCircle, Settings, FileText, ChevronRight } from 'lucide-react';

type SearchCopy = {
  title: string;
  description: string;
  resultsFor: string;
  noQuery: string;
  noResults: string;
  ctaSearchBar: string;
};

function SearchPageInner({ lang, copy }: { lang: string; copy: SearchCopy }) {
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();
  const [results, setResults] = useState<Array<{ type: string; title: string; url: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setResults(data.results || []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q]);

  const getIcon = (type: string) => {
    if (type === 'dtc') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (type === 'manual') return <Settings className="w-4 h-4 text-afd-blue" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="max-w-[800px] mx-auto px-6 py-16 pt-28">
      <h1 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-2">{copy.title}</h1>
      <p className="text-afd-slate mb-10">{copy.description}</p>

      {q.length >= 2 ? (
        <>
          <p className="text-sm font-bold text-afd-slate uppercase tracking-wider mb-6">
            {copy.resultsFor}: <span className="text-afd-navy">{q}</span>
          </p>
          {loading ? (
            <p className="text-afd-slate">...</p>
          ) : results.length > 0 ? (
            <ul className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden divide-y divide-gray-50">
              {results.map((result, idx) => (
                <li key={idx}>
                  <Link
                    href={`/${lang}${result.url}`}
                    className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{result.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{result.type}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-afd-blue" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-afd-slate">{copy.noResults}</p>
          )}
        </>
      ) : (
        <div className="flex items-start gap-3 p-6 rounded-2xl bg-afd-light border border-gray-100 text-afd-slate">
          <Search className="w-5 h-5 text-afd-yellow flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-afd-navy mb-1">{copy.noQuery}</p>
            <p className="text-sm">{copy.ctaSearchBar}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPageClient({ lang, copy }: { lang: string; copy: SearchCopy }) {
  return (
    <Suspense fallback={<div className="max-w-[800px] mx-auto px-6 py-16 pt-28 text-afd-slate">…</div>}>
      <SearchPageInner lang={lang} copy={copy} />
    </Suspense>
  );
}
