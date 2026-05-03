'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, AlertCircle, FileText, Settings, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function GlobalSearch({
  lang,
  placeholder,
  viewAllResultsLabel,
}: {
  lang: string;
  placeholder: string;
  viewAllResultsLabel: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Close search when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search on navigation
  useEffect(() => {
    setIsOpen(false);
    setQuery('');
  }, [pathname]);

  // Debounced Search API call
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const getIcon = (type: string) => {
    if (type === 'dtc') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (type === 'manual') return <Settings className="w-4 h-4 text-afd-blue" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="relative w-full max-w-[320px] lg:max-w-[400px]" ref={wrapperRef}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-afd-slate">
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-afd-yellow" /> : <Search className="w-4 h-4" />}
        </div>
        <input
          type="text"
          className="w-full bg-[#182845]/50 border border-[#2a3f65] text-white text-sm rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-afd-yellow/50 focus:border-afd-yellow/50 transition-all placeholder:text-afd-slate"
          placeholder={placeholder || 'Search cars, fault codes...'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => { if (query.length >= 2) setIsOpen(true) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim().length >= 2) {
              e.preventDefault();
              router.push(`/${lang}/search?q=${encodeURIComponent(query.trim())}`);
              setIsOpen(false);
            }
          }}
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 text-afd-slate hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] max-h-[400px] overflow-y-auto">
          {loading && results.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500 font-medium">
              Searching databases...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, idx) => (
                <Link
                  key={idx}
                  href={`/${lang}${result.url}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-gray-500 capitalize tracking-wide">
                      {result.type}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-afd-blue transform group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
              <div className="border-t border-gray-100 px-4 py-2 bg-gray-50/80">
                <Link
                  href={`/${lang}/search?q=${encodeURIComponent(query.trim())}`}
                  className="text-xs font-bold text-afd-blue hover:text-afd-navy"
                >
                  {viewAllResultsLabel}
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-500 font-medium">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
