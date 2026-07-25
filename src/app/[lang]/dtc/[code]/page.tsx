import type { Metadata } from 'next';
import { buildAlternates, openGraphForPath } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import { notFound } from 'next/navigation';
import Link from '@/components/LocalizedLink';
import { TOP_DTC_CODES, getDtcByCode } from '@/lib/dtcData';
import { AlertTriangle, Settings, Zap, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';
import { getDictionary } from '@/dictionaries/getDictionary';
import RelatedLinks from '@/components/RelatedLinks';

export const dynamicParams = true;
export const revalidate = 86400;

const PREBUILD_DTC_COUNT = 300;

export async function generateStaticParams() {
  return TOP_DTC_CODES.slice(0, PREBUILD_DTC_COUNT).map((dtc) => ({ code: dtc.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, code: string }> }): Promise<Metadata> {
  const { lang, code } = await params;
  const dict = await getDictionary(lang as any);
  const dtc = getDtcByCode(code.toUpperCase());

  const title = dict.dtc.metaTitle.replace('{code}', code.toUpperCase()).replace('{title}', dtc?.description || "Diagnostic Trouble Code");
  const description = dict.dtc.metaDescription.replace('{code}', code.toUpperCase());

  const dtcPath = `/dtc/${code.toUpperCase()}`;

  return {
    title,
    description,
    alternates: buildAlternates(lang, dtcPath),
    openGraph: openGraphForPath(lang, dtcPath, { title, description }),
  };
}

export default async function DtcDetailPage({ params }: { params: Promise<{ lang: string, code: string }> }) {
  const { lang, code } = await params;
  const codeParam = code.toUpperCase();
  const dict = await getDictionary(lang as any);
  const d = dict.dtc as any;

  const dtc = getDtcByCode(codeParam) || {
    code: codeParam,
    description: "The Engine Control Module (ECM) has detected a malfunction related to this generic OBD-II fault code.",
    symptoms: ["Check Engine Light ON", "Possible decrease in fuel economy", "Engine performance issues"],
    causes: ["Defective sensor or switch", "Wiring or connector issue", "Mechanical failure in associated system"],
    severity: "Medium" as "High" | "Medium" | "Low",
    fixNow: "Perform a diagnostic scan to retrieve freeze-frame data."
  };

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: d.metaTitle.replace('{code}', dtc.code).replace('{title}', dtc.description || dtc.code),
    description: d.metaDescription.replace('{code}', dtc.code),
    image: "https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png",
    author: { '@type': 'Organization', name: 'Auto Fix Data' },
    publisher: {
      '@type': 'Organization',
      name: 'Auto Fix Data',
      logo: {
        '@type': 'ImageObject',
        url: 'https://assets.cdn.filesafe.space/Ojp9CgccP9bDnBtQ25kU/media/670c1a958a10046187933a85.png'
      }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: pageUrl(lang, '') },
        { '@type': 'ListItem', position: 2, name: 'DTC Codes', item: pageUrl(lang, `/dtc`) },
        { '@type': 'ListItem', position: 3, name: dtc.code, item: pageUrl(lang, `/dtc/${dtc.code}`) },
      ],
    },
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      {/* Hero */}
      <div className="bg-afd-navy py-12 px-6 border-b border-black/20">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start gap-6">
          <div className="hidden md:flex w-20 h-20 bg-afd-yellow/10 rounded-2xl items-center justify-center shrink-0">
            <AlertTriangle className="w-10 h-10 text-afd-yellow" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-afd-yellow text-black font-black px-3 py-1.5 rounded-md text-sm tracking-widest">{dtc.code}</span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${dtc.severity === "Critical" ? "bg-red-500/20 text-red-200" :
                  dtc.severity === "High" ? "bg-orange-500/20 text-orange-200" :
                    "bg-yellow-500/20 text-yellow-200"
                }`}>{dtc.severity} {d.severityLevel}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{dtc.description || dtc.code}</h1>
            <p className="text-lg text-afd-slate max-w-3xl leading-relaxed">This diagnostic trouble code indicates a malfunction in the associated component circuit.</p>
          </div>
        </div>
      </div>

      <section className="py-12 bg-gray-50 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Symptoms */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-afd-navy mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-afd-blue" /> {d.commonSymptoms.replace('{code}', dtc.code)}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dtc.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Causes */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-afd-navy mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-afd-yellow" /> {d.whatCauses.replace('{code}', dtc.code)}
              </h2>
              <ul className="space-y-4">
                {dtc.causes.map((cause, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <ShieldAlert className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-800 font-medium">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 prose prose-blue max-w-none text-gray-600 prose-headings:text-afd-navy">
              <h3>{d.howSerious.replace('{code}', dtc.code)}</h3>
              <p>{d.howSeriousDesc.replace('{severity}', dtc.severity.toLowerCase()).replace('{code}', dtc.code)}</p>
              <h3>{d.howToFix.replace('{code}', dtc.code)}</h3>
              <p>{d.howToFixDesc.replace('{code}', dtc.code)}</p>
            </div>
          </div>
          {/* Right Sidebar CTA */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border-2 border-afd-yellow shadow-2xl overflow-hidden">
              <div className="bg-afd-navy p-6 text-center border-b-4 border-afd-yellow">
                <FileText className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">{d.fixNow.replace('{code}', dtc.code)}</h3>
                <p className="text-afd-slate text-sm font-medium">{d.fixNowSub}</p>
              </div>
              <div className="p-6 bg-gray-50/50">
                <ul className="space-y-3 mb-6">
                  {d.benefits.map((benefit: string) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-gray-800 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> {benefit}
                    </li>
                  ))}
                </ul>
                <iframe src="https://link.autodatalogin.com/widget/form/4tQbweI60VyYW02nlcVf"
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: "12px" }}
                  className="min-h-[600px]" title="Start Free Trial Form" />
              </div>
            </div>
          </div>
        </div>

        <RelatedLinks lang={lang} dtcCode={dtc.code} className="max-w-[1200px] mx-auto mt-12" />
      </section>
    </>
  );
}
