'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Wrench } from 'lucide-react';


const CAR_MAKES = [
  { name: "BMW", slug: "bmw" }, { name: "Ford", slug: "ford" },
  { name: "VW", slug: "volkswagen" }, { name: "Toyota", slug: "toyota" },
  { name: "Mercedes", slug: "mercedes-benz" }, { name: "Vauxhall", slug: "vauxhall" },
  { name: "Renault", slug: "renault" }, { name: "Peugeot", slug: "peugeot" },
  { name: "Audi", slug: "audi" }, { name: "Honda", slug: "honda" },
  { name: "Nissan", slug: "nissan" }, { name: "Hyundai", slug: "hyundai" },
  { name: "Kia", slug: "kia" }, { name: "Volvo", slug: "volvo" },
  { name: "Skoda", slug: "skoda" }, { name: "Land Rover", slug: "land-rover" },
  { name: "Fiat", slug: "fiat" }, { name: "Mazda", slug: "mazda" },
  { name: "MINI", slug: "mini" }, { name: "SEAT", slug: "seat" },
  { name: "Alfa Romeo", slug: "alfa-romeo" }, { name: "Citroën", slug: "citroen" },
  { name: "Porsche", slug: "porsche" }, { name: "Subaru", slug: "subaru" },
];

const LANGUAGES = [
  { code: 'en', flagCode: 'gb', name: 'English' },
  { code: 'fr', flagCode: 'fr', name: 'Français' },
  { code: 'es', flagCode: 'es', name: 'Español' },
  { code: 'de', flagCode: 'de', name: 'Deutsch' },
  { code: 'it', flagCode: 'it', name: 'Italiano' },
  { code: 'ar', flagCode: 'sa', name: 'العربية' },
  { code: 'he', flagCode: 'il', name: 'עברית' },
];

export default function Navigation({ dict, lang }: { dict: any, lang: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  
  const pathname = usePathname();

  const getLangUrl = (targetLang: string) => {
    if (!pathname) return `/${targetLang}`;
    const segments = pathname.split('/');
    if (LANGUAGES.some(l => l.code === segments[1])) {
      segments[1] = targetLang;
      return segments.join('/') || '/';
    }
    return `/${targetLang}${pathname}`;
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {/* Makes Secondary Bar */}
      <div className="hidden md:flex bg-afd-dark h-9 items-center border-b border-white/5 overflow-hidden">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0 px-4 flex items-center gap-2 border-r border-white/10 h-9">
            <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">MAKES</span>
          </div>
          <div className="marquee-container flex-1 overflow-hidden">
            <div className="marquee-content flex items-center gap-6">
              {[...CAR_MAKES, ...CAR_MAKES].map((make, i) => (
                <Link key={i} href={`/${lang}/manuals/${make.slug}`} className="flex items-center gap-1.5 cursor-pointer group whitespace-nowrap">
                  <img src={`/images/logos/${make.slug}.png`} alt={make.name}
                    className="h-4 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                    decoding="async"
                    width={32}
                    height={16}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="text-[11px] text-afd-slate group-hover:text-afd-yellow transition-colors font-medium">{make.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 px-4 border-l border-white/10 h-9 flex items-center">
            <Link href={`/${lang}/repair-manuals`} className="text-[10px] text-afd-yellow font-bold tracking-wider hover:underline whitespace-nowrap">+ All 150 makes →</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
        <div className="w-full px-4 lg:px-8 h-full flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 bg-afd-navy rounded-lg overflow-hidden group-hover:bg-afd-blue transition-colors">
              <Wrench className="w-4 h-4 text-afd-yellow" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-afd-navy">
              Auto<span className="text-afd-yellow">Fix</span>Data
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href={`/${lang}/repair-manuals`} className="text-sm font-semibold text-afd-text hover:text-afd-blue transition-colors relative group py-2">
              {dict.nav.repairData}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-afd-yellow transition-all duration-300 group-hover:w-full" />
            </Link>

            <div className="relative py-2"
              onMouseEnter={() => setIsProductsDropdownOpen(true)}
              onMouseLeave={() => setIsProductsDropdownOpen(false)}>
              <button className="flex items-center gap-1 text-sm font-semibold text-afd-text hover:text-afd-blue transition-colors">
                {dict.nav.products} <ChevronDown className="w-4 h-4" />
              </button>
              {isProductsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-2 mt-2 z-50">
                  <Link href={`/${lang}/products`} className="block px-4 py-2 text-sm font-bold text-afd-navy hover:bg-afd-light hover:text-afd-blue">{dict.nav.viewAll}</Link>
                  <div className="h-px bg-gray-100 my-1" />
                  {[['alldata-alternative', 'ALLDATA'], ['autodata', 'AutoData'], ['haynes-pro', 'Haynes Pro'], ['mitchell1', 'Mitchell1'], ['identifix', 'Identifix']].map(([slug, name]) => (
                    <Link key={slug} href={`/${lang}/${slug}`} className="block px-4 py-2 text-sm text-afd-text hover:bg-afd-light hover:text-afd-blue">{name}</Link>
                  ))}
                </div>
              )}
            </div>

            {[
              { href: `/${lang}/diagnostics`, label: dict.nav.diagnostics },
              { href: `/${lang}/blog`, label: dict.nav.blog },
              { href: `/${lang}/wiring-diagrams`, label: dict.nav.wiring },
              { href: `/${lang}/pricing`, label: dict.nav.pricing },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm font-semibold text-afd-text hover:text-afd-blue transition-colors relative group py-2 whitespace-nowrap">
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-afd-yellow transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">

            
            <div className="relative py-2"
              onMouseEnter={() => setIsLangDropdownOpen(true)}
              onMouseLeave={() => setIsLangDropdownOpen(false)}>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-afd-slate hover:text-afd-navy transition-colors uppercase tracking-wider">
                <Image src={`https://flagcdn.com/w20/${currentLang.flagCode}.png`} alt="" width={20} height={15} sizes="20px" className="w-5 h-auto shadow-sm rounded-[1px]" />
                {currentLang.code}
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
              
              {isLangDropdownOpen && (
                <div className="absolute top-full right-0 w-36 bg-white border border-gray-100 shadow-xl rounded-xl py-2 mt-0 z-50">
                  {LANGUAGES.map((l) => (
                    <Link
                      key={l.code}
                      href={getLangUrl(l.code)}
                      className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors hover:bg-afd-light ${l.code === lang ? 'text-afd-blue bg-afd-light/50' : 'text-afd-text hover:text-afd-blue'}`}
                    >
                      <Image src={`https://flagcdn.com/w20/${l.flagCode}.png`} alt="" width={20} height={15} sizes="20px" className="w-5 h-auto shadow-sm rounded-[1px]" />
                      {l.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="w-px h-6 bg-gray-200" />
            <Link href={`/${lang}/login`} className="text-sm font-semibold text-afd-navy hover:text-afd-blue transition-colors px-2 whitespace-nowrap flex-shrink-0">{dict.nav.signIn}</Link>
            <Link href={`/${lang}/free-trial`} className="bg-afd-yellow text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-afd-yellow-hover hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap flex-shrink-0">{dict.nav.freeTrial}</Link>
          </div>

          <button className="lg:hidden p-2 text-afd-navy" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-afd-navy/60 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-[300px] bg-white z-[101] shadow-2xl flex flex-col lg:hidden">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <Link href={`/${lang}`} className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="relative flex items-center justify-center w-8 h-8 bg-[#0a1628] rounded-lg overflow-hidden">
                  <span className="text-[#f4b400] font-black text-xs tracking-tighter">AFD</span>
                </div>
                <span className="text-lg font-extrabold tracking-tight text-afd-navy">
                  Auto<span className="text-afd-yellow">Fix</span>Data
                </span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-afd-slate hover:text-afd-navy"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
              <Link href={`/${lang}`} className="text-lg font-bold text-afd-navy">{dict.nav.home}</Link>
              <Link href={`/${lang}/repair-manuals`} className="text-lg font-bold text-afd-navy">{dict.nav.repairData}</Link>
              
              <div className="flex flex-col gap-4 py-2 border-y border-gray-100">
                <span className="text-lg font-bold text-afd-navy">{dict.nav.products || 'Products'}</span>
                <div className="flex flex-col gap-4 pl-4 border-l-2 border-gray-100">
                  <Link href={`/${lang}/products`} className="text-[17px] font-medium text-afd-slate hover:text-afd-blue">{dict.nav.viewAll || 'All Products'}</Link>
                  <Link href={`/${lang}/alldata-alternative`} className="text-[17px] font-medium text-afd-slate hover:text-afd-blue">ALLDATA</Link>
                  <Link href={`/${lang}/autodata`} className="text-[17px] font-medium text-afd-slate hover:text-afd-blue">AutoData</Link>
                  <Link href={`/${lang}/haynes-pro`} className="text-[17px] font-medium text-afd-slate hover:text-afd-blue">Haynes Pro</Link>
                  <Link href={`/${lang}/mitchell1`} className="text-[17px] font-medium text-afd-slate hover:text-afd-blue">Mitchell1</Link>
                  <Link href={`/${lang}/identifix`} className="text-[17px] font-medium text-afd-slate hover:text-afd-blue">Identifix</Link>
                </div>
              </div>

              <Link href={`/${lang}/diagnostics`} className="text-lg font-bold text-afd-navy">{dict.nav.diagnostics}</Link>
              <Link href={`/${lang}/blog`} className="text-lg font-bold text-afd-navy">{dict.nav.blog}</Link>
              <Link href={`/${lang}/wiring-diagrams`} className="text-lg font-bold text-afd-navy">{dict.nav.wiring}</Link>
              <Link href={`/${lang}/pricing`} className="text-lg font-bold text-afd-navy">{dict.nav.pricing}</Link>
              <Link href={`/${lang}/about`} className="text-lg font-bold text-afd-navy">{dict.nav.about}</Link>
              <Link href={`/${lang}/contact`} className="text-lg font-bold text-afd-navy">{dict.nav.contact}</Link>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <span className="text-xs font-bold text-afd-slate uppercase tracking-wider mb-3 block">Language</span>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <Link
                    key={l.code}
                    href={getLangUrl(l.code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded border ${l.code === lang ? 'border-afd-blue bg-afd-blue/5 text-afd-blue' : 'border-gray-200 bg-white text-afd-slate'}`}
                  >
                    <Image src={`https://flagcdn.com/w20/${l.flagCode}.png`} alt="" width={20} height={15} sizes="20px" className="w-4 h-auto shadow-sm" />
                    <span className="text-sm font-semibold uppercase">{l.code}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-6 bg-afd-light border-t border-gray-200 space-y-4">
              <Link href={`/${lang}/login`} className="w-full block py-3 border-2 border-afd-navy text-afd-navy font-bold rounded-lg text-center">{dict.nav.signIn}</Link>
              <Link href={`/${lang}/free-trial`} className="w-full block py-3 bg-afd-yellow text-black font-bold rounded-lg text-center">{dict.nav.freeTrial}</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
