import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import Link from '@/components/LocalizedLink';
import { ExternalLink, Lock, ArrowRight } from "lucide-react";

import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  const m = dict.auth || {};
  return {
    title: metadataTitle(m.loginTitle || 'Database Login | Auto Fix Data'),
    description: m.loginDesc || 'Sign in to your automotive workshop database.',
    alternates: await buildAlternates(lang, `/login`)
  };
}

const DATABASES = [
  {
    name: "ALLDATA",
    tagline: "Automotive Intelligence",
    description: "OEM repair procedures, TSBs, wiring diagrams and DTC codes from AutoZone's flagship database.",
    url: "https://my.alldata.com/",
    logo: "/images/alldata-logo.png",
    bg: "bg-[#003A75]",
    accent: "#003A75",
    textColor: "text-white",
    btnClass: "bg-white text-[#003A75] hover:bg-gray-100",
  },
  {
    name: "AutoData",
    tagline: "by Solera",
    description: "European-leading database for service intervals, timing data, ADAS calibration and wiring diagrams.",
    url: "https://workshop.autodata-group.com/login?destination=node",
    logo: null,
    initials: "AD",
    bg: "bg-[#E63329]",
    accent: "#E63329",
    textColor: "text-white",
    btnClass: "bg-white text-[#E63329] hover:bg-gray-100",
  },
  {
    name: "Haynes Pro",
    tagline: "Workshop Data",
    description: "Comprehensive step-by-step vehicle repair guides with professional technical data for workshops.",
    url: "https://www.workshopdata.com/touch/site/layout/wsdLogin",
    logo: null,
    initials: "HP",
    bg: "bg-[#1E3A5F]",
    accent: "#1E3A5F",
    textColor: "text-white",
    btnClass: "bg-white text-[#1E3A5F] hover:bg-gray-100",
  },
  {
    name: "ProDemand",
    tagline: "by Mitchell1",
    description: "Mitchell1's ProDemand gives technicians repair procedures, diagnostic flowcharts and confirmed fixes.",
    url: "https://www1.prodemand.com/status",
    logo: null,
    initials: "M1",
    bg: "bg-[#0072BC]",
    accent: "#0072BC",
    textColor: "text-white",
    btnClass: "bg-white text-[#0072BC] hover:bg-gray-100",
  },
  {
    name: "Identifix",
    tagline: "by Solera",
    description: "Real-world confirmed fixes from a network of 70,000+ professional technicians. Direct-Hit™ included.",
    url: "https://dh.identifix.com/Default/LogOnIdentifix",
    logo: null,
    initials: "IX",
    bg: "bg-[#FF6600]",
    accent: "#FF6600",
    textColor: "text-white",
    btnClass: "bg-white text-[#FF6600] hover:bg-gray-100",
  },
];

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  const l = dict.login || {};

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": l.title || "Database Login | Auto Fix Data",
    "description": l.subtitle || "Access your automotive workshop database.",
    "url": pageUrl(lang, `/login`)
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      {/* Hero */}
      <section className="bg-afd-navy py-16 px-6 text-center dark-section border-b border-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-afd-yellow/10 border border-afd-yellow/20 rounded-full text-afd-yellow text-xs font-bold tracking-wider mb-6">
          <Lock className="w-3.5 h-3.5" /> {l.secureAccess}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          {l.title}
        </h1>
        <p className="text-xl text-afd-slate max-w-2xl mx-auto">
          {l.subtitle}
        </p>
      </section>

      {/* Database Cards */}
      <section className="py-16 px-6 bg-afd-light">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DATABASES.map((db) => {
              const dbKey = db.name === 'ALLDATA' ? 'alldata'
                : db.name === 'AutoData' ? 'autodata'
                  : db.name === 'Haynes Pro' ? 'haynes'
                    : db.name === 'ProDemand' ? 'mitchell'
                      : 'identifix';
              const localizedDb = l.dbs?.[dbKey] || { tagline: db.tagline, desc: db.description };

              return (
                <a
                  key={db.name}
                  href={db.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className={`${db.bg} px-6 py-8 flex flex-col items-center text-center gap-3`}>
                    {db.logo ? (
                      <img
                        src={db.logo}
                        alt={db.name}
                        className="h-14 max-w-[180px] object-contain filter brightness-0 invert"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-extrabold text-2xl tracking-tight">{db.initials}</span>
                      </div>
                    )}
                    <div>
                      <div className={`text-xl font-extrabold ${db.textColor}`}>{db.name}</div>
                      <div className="text-white/60 text-sm">{localizedDb.tagline}</div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 py-5">
                    <p className="text-afd-text text-sm leading-relaxed mb-5">{localizedDb.desc}</p>
                    <div className={`${db.btnClass} border w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all group-hover:shadow-md`}
                      style={{ borderColor: db.accent + '30' }}>
                      {l.signInTo.replace('{db}', db.name)}
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              )
            })}

            {/* Not subscribed card */}
            <div className="bg-afd-navy rounded-2xl shadow-md border border-afd-yellow/20 p-6 flex flex-col items-center text-center justify-center gap-4 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-afd-yellow/10 border border-afd-yellow/30 rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-afd-yellow" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg mb-1">{l.notSubscribed}</h3>
                <p className="text-afd-slate text-sm leading-relaxed">
                  {l.notSubscribedDesc}
                </p>
              </div>
              <Link href={`/${lang}/pricing`} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-afd-yellow text-black font-bold rounded-xl hover:bg-afd-yellow-hover transition-all text-sm shadow-lg shadow-afd-yellow/20">
                {l.viewPlans} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/${lang}/contact`} className="text-afd-slate text-xs hover:text-afd-yellow transition-colors">
                {l.contactSales}
              </Link>
            </div>
          </div>

          {/* Help note */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 bg-afd-yellow/10 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-xl">💬</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-afd-navy mb-1">{l.helpTitle}</h4>
              <p className="text-afd-text text-sm">
                {l.helpDesc}
              </p>
            </div>
            <Link href={`/${lang}/contact`} className="shrink-0 px-5 py-2.5 bg-afd-navy text-white font-bold rounded-xl text-sm hover:bg-afd-blue transition-colors">
              {l.getHelp}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
