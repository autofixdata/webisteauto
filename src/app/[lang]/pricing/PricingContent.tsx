'use client';

import { CheckCircle2, Check, X, ChevronDown } from "lucide-react";
import Link from '@/components/LocalizedLink';
import { useState } from "react";
import { FAQItem } from "@/components/FAQItem";

type Currency = "GBP" | "EUR" | "USD";
type Billing = "monthly" | "yearly";

const PRICES: Record<Currency, { individual: number; garage: number; symbol: string }> = {
  GBP: { individual: 99, garage: 199, symbol: "£" },
  EUR: { individual: 119, garage: 239, symbol: "€" },
  USD: { individual: 129, garage: 259, symbol: "$" },
};

const CURRENCY_LABELS: Record<Currency, string> = { GBP: "GBP £", EUR: "EUR €", USD: "USD $" };
const CHECK = <Check className="w-5 h-5 text-green-500 mx-auto" />;
const PARTIAL = <span className="text-afd-blue font-bold text-lg mx-auto block text-center">◑</span>;
const NONE = <X className="w-4 h-4 text-gray-300 mx-auto" />;

const comparisonRows = [
  { feature: "OEM Repair Procedures", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: PARTIAL },
  { feature: "Full-Colour Wiring Diagrams", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
  { feature: "DTC Code Library", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: CHECK },
  { feature: "TSBs & Safety Recalls", alldata: CHECK, autodata: PARTIAL, haynes: PARTIAL, mitchell: CHECK, identifix: CHECK },
  { feature: "Maintenance Schedules", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
  { feature: "Labour / Flat-Rate Times", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
  { feature: "Parts Catalogue Integration", alldata: CHECK, autodata: PARTIAL, haynes: PARTIAL, mitchell: CHECK, identifix: NONE },
  { feature: "Real-World Confirmed Fixes", alldata: NONE, autodata: NONE, haynes: NONE, mitchell: PARTIAL, identifix: CHECK },
  { feature: "Diagnostic Flowcharts", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: CHECK },
  { feature: "Component Locators", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
  { feature: "Torque Specifications", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
  { feature: "Fluid Specifications", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
  { feature: "ADAS / Calibration Data", alldata: CHECK, autodata: CHECK, haynes: PARTIAL, mitchell: CHECK, identifix: NONE },
  { feature: "EV & Hybrid Coverage", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: PARTIAL },
  { feature: "ECU Connector Pinouts", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
  { feature: "Timing Belt / Chain Kits", alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
  { feature: "API / DMS Integration", alldata: CHECK, autodata: NONE, haynes: NONE, mitchell: CHECK, identifix: PARTIAL },
  { feature: "Light Commercial Coverage", alldata: CHECK, autodata: CHECK, haynes: PARTIAL, mitchell: CHECK, identifix: NONE },
];

const faqs = [
  { q: "Do all plans include all 5 databases?", a: "Yes. Every Auto Fix Data subscription — including the free trial — includes full access to ALLDATA, AutoData, Haynes Pro, Mitchell1, and Identifix. You pay one price for all five." },
  { q: "Is the free trial really free?", a: "Yes. No credit card is required to start your 7-day trial. Access simply expires at the end of the trial period. We do not charge you automatically." },
  { q: "Can I switch plans after I subscribe?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle. Contact our team and we'll process the change the same day." },
  { q: "Do you offer annual billing discounts?", a: "Yes — annual subscriptions receive a 20% discount on all plans. The discount is applied automatically when you switch to annual billing." },
  { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards, SEPA direct debit (EUR), BACS bank transfers (GBP) and ACH (USD). Invoicing is available for multi-seat annual accounts." },
];

function CurrencySelector({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm hover:border-afd-blue">
        <span>{CURRENCY_LABELS[value]}</span><ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-white border shadow-lg overflow-hidden z-50 min-w-[120px]">
          {(["GBP", "EUR", "USD"] as Currency[]).map(c => (
            <button key={c} onClick={() => { onChange(c); setOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-afd-light">{CURRENCY_LABELS[c]}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PricingContent({ dict, lang }: { dict: any, lang: string }) {
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [billing, setBilling] = useState<Billing>("monthly");

  const prices = PRICES[currency];
  const discount = 0.8;
  const indPrice = billing === "monthly" ? prices.individual : Math.round(prices.individual * discount);
  const garPrice = billing === "monthly" ? prices.garage : Math.round(prices.garage * discount);
  const indAnnual = Math.round(prices.individual * discount * 12);
  const garAnnual = Math.round(prices.garage * discount * 12);

  const pData = dict.pricingProps || {
    hero: { promo: "7-day free trial — no credit card required", heading1: "Simple, Transparent", heading2: "Workshop Pricing", subheading: "One subscription. Five professional databases. Choose the plan that fits your workshop size." },
    billing: { monthly: "Monthly", yearly: "Yearly", save20: "Save 20%", billedAnnually: "billed annually", mo: "/mo", yr: "/yr", custom: "Custom", contactSales: "Volume pricing available — contact sales" },
    plansData: { starter: { name: "Individual Tech", tagline: "For solo mechanics and mobile technicians.", features: ["1 User License", "All 5 Databases Included", "OEM Repair Procedures & TSBs", "Wiring Diagrams & DTC Library", "Standard Email Support", "Cloud Access"], cta: "Get Started" }, pro: { name: "Independent Garage", tagline: "For workshops with up to 5 bays/technicians.", badge: "Most Popular", features: ["Up to 2 User Licenses", "All 5 Databases Included", "Full Interactive Wiring Diagrams", "Estimating & Quoting Tools", "Advanced Diagnostics (Identifix)", "Priority Support", "ADAS Calibration Data"], cta: "Get Started" }, enterprise: { name: "Fleet & Dealership", tagline: "For large operations and dealership groups.", features: ["Unlimited User Licenses", "All 5 Databases Included", "API Integration Access", "DMS Export Capability", "Dedicated Account Manager", "SLA-backed Support", "Custom Onboarding"], cta: "Contact Sales" } },
    table: { heading: "What's Included in Each Database", subheading: "All five databases are available in every plan.", featureCol: "Feature", rows: [ "OEM Repair Procedures", "Full-Colour Wiring Diagrams", "DTC Code Library", "TSBs & Safety Recalls", "Maintenance Schedules", "Labour / Flat-Rate Times", "Parts Catalogue Integration", "Real-World Confirmed Fixes", "Diagnostic Flowcharts", "Component Locators", "Torque Specifications", "Fluid Specifications", "ADAS / Calibration Data", "EV & Hybrid Coverage", "ECU Connector Pinouts", "Timing Belt / Chain Kits", "API / DMS Integration", "Light Commercial Coverage" ] },
    faqHeading: "Pricing FAQs"
  };

  const pricingFaqs = [1, 2, 3, 4]
    .map(i => ({ q: (dict.pricing?.faq as any)?.[`q${i}`], a: (dict.pricing?.faq as any)?.[`a${i}`] }))
    .filter(f => f.q && f.a);

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pricingFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  });

  const compRows = [
    { feature: pData.table.rows[0], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: PARTIAL },
    { feature: pData.table.rows[1], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[2], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: CHECK },
    { feature: pData.table.rows[3], alldata: CHECK, autodata: PARTIAL, haynes: PARTIAL, mitchell: CHECK, identifix: CHECK },
    { feature: pData.table.rows[4], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[5], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[6], alldata: CHECK, autodata: PARTIAL, haynes: PARTIAL, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[7], alldata: NONE, autodata: NONE, haynes: NONE, mitchell: PARTIAL, identifix: CHECK },
    { feature: pData.table.rows[8], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: CHECK },
    { feature: pData.table.rows[9], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[10], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[11], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[12], alldata: CHECK, autodata: CHECK, haynes: PARTIAL, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[13], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: PARTIAL },
    { feature: pData.table.rows[14], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[15], alldata: CHECK, autodata: CHECK, haynes: CHECK, mitchell: CHECK, identifix: NONE },
    { feature: pData.table.rows[16], alldata: CHECK, autodata: NONE, haynes: NONE, mitchell: CHECK, identifix: PARTIAL },
    { feature: pData.table.rows[17], alldata: CHECK, autodata: CHECK, haynes: PARTIAL, mitchell: CHECK, identifix: NONE },
  ];

  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <section className="bg-afd-navy pt-20 pb-32 px-6 text-center dark-section relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-afd-dark z-0"></div>
        <div className="relative z-10">
          <div className="inline-flex px-4 py-1.5 bg-afd-yellow/10 text-afd-yellow text-sm font-bold tracking-wider mb-6 border border-afd-yellow/20">
            {pData.hero.promo}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">{pData.hero.heading1}<br /><span className="text-afd-yellow">{pData.hero.heading2}</span></h1>
          <p className="text-xl text-afd-slate max-w-3xl mx-auto">{pData.hero.subheading}</p>
        </div>
      </section>

      <section className="pb-16 px-6 relative z-20 -mt-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button onClick={() => setBilling("monthly")} className={`px-5 py-2 rounded-lg text-sm font-bold ${billing === "monthly" ? "bg-afd-navy text-white shadow" : "text-afd-slate"}`}>{pData.billing.monthly}</button>
              <button onClick={() => setBilling("yearly")} className={`px-5 py-2 rounded-lg text-sm font-bold flex gap-2 ${billing === "yearly" ? "bg-afd-navy text-white shadow" : "text-afd-slate"}`}>{pData.billing.yearly} <span className="bg-green-500 text-white text-[10px] px-2 rounded-full">-{pData.billing.save20}</span></button>
            </div>
            <CurrencySelector value={currency} onChange={setCurrency} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl border p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-afd-navy mb-2">{pData.plansData.starter.name}</h3>
              <p className="text-afd-slate text-sm mb-6 h-10">{pData.plansData.starter.tagline}</p>
              <div className="mb-2"><span className="text-5xl font-extrabold text-afd-navy">{prices.symbol}{indPrice}</span><span className="text-afd-slate">{pData.billing.mo}</span></div>
              {billing === "yearly" && <div className="mb-4 text-xs text-afd-slate"><span className="line-through">{prices.symbol}{prices.individual}{pData.billing.mo}</span> <span className="bg-green-100 text-green-700 px-2 rounded">{pData.billing.save20}</span> ({prices.symbol}{indAnnual}{pData.billing.yr})</div>}
              {billing === "monthly" && <div className="mb-4 text-xs text-afd-slate">{prices.symbol}{Math.round(prices.individual * discount * 12)}{pData.billing.yr} {pData.billing.billedAnnually}</div>}
              <ul className="space-y-3 mb-8 flex-1">
                {pData.plansData.starter.features.map((i: string) => (
                  <li key={i} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /><span className="text-sm font-medium">{i}</span></li>
                ))}
              </ul>
              <Link href={`/${lang}/contact`} className="w-full block text-center py-4 rounded-xl font-bold border-2 text-afd-navy hover:bg-afd-navy hover:text-white">{pData.plansData.starter.cta}</Link>
            </div>

            <div className="bg-afd-navy rounded-2xl shadow-2xl border border-afd-yellow p-8 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-afd-yellow text-black text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">{pData.plansData.pro.badge}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{pData.plansData.pro.name}</h3>
              <p className="text-afd-slate text-sm mb-6 h-10">{pData.plansData.pro.tagline}</p>
              <div className="mb-2"><span className="text-5xl font-extrabold text-white">{prices.symbol}{garPrice}</span><span className="text-afd-slate">{pData.billing.mo}</span></div>
              {billing === "yearly" && <div className="mb-4 text-xs text-afd-slate"><span className="line-through">{prices.symbol}{prices.garage}{pData.billing.mo}</span> <span className="bg-green-500 text-white px-2 rounded">{pData.billing.save20}</span> ({prices.symbol}{garAnnual}{pData.billing.yr})</div>}
              {billing === "monthly" && <div className="mb-4 text-xs text-afd-slate">{prices.symbol}{Math.round(prices.garage * discount * 12)}{pData.billing.yr} {pData.billing.billedAnnually}</div>}
              <ul className="space-y-3 mb-8 flex-1">
                {pData.plansData.pro.features.map((i: string) => (
                  <li key={i} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-afd-yellow" /><span className="text-sm text-white font-medium">{i}</span></li>
                ))}
              </ul>
              <Link href={`/${lang}/contact`} className="w-full block text-center py-4 rounded-xl font-bold bg-afd-yellow text-black hover:bg-afd-yellow-hover">{pData.plansData.pro.cta}</Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-afd-navy mb-2">{pData.plansData.enterprise.name}</h3>
              <p className="text-afd-slate text-sm mb-6 h-10">{pData.plansData.enterprise.tagline}</p>
              <div className="mb-2"><span className="text-4xl font-extrabold text-afd-navy">{pData.billing.custom}</span></div>
              <div className="mb-6 text-xs text-afd-slate">{pData.billing.contactSales}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {pData.plansData.enterprise.features.map((i: string) => (
                  <li key={i} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /><span className="text-sm font-medium">{i}</span></li>
                ))}
              </ul>
              <Link href={`/${lang}/contact`} className="w-full block text-center py-4 rounded-xl font-bold bg-gray-100 text-afd-navy hover:bg-gray-200">{pData.plansData.enterprise.cta}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-afd-light border-y border-gray-200 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-4">{pData.table.heading}</h2>
            <p className="text-lg text-afd-text max-w-2xl mx-auto">{pData.table.subheading}</p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-xl border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-afd-navy text-white">
                <tr>
                  <th className="text-left py-5 px-6">{pData.table.featureCol}</th>
                  {["ALLDATA", "AutoData", "Haynes Pro", "Mitchell1", "Identifix"].map((name, i) => (
                    <th key={name} className={`py-5 px-4 text-center ${i === 1 ? 'bg-afd-yellow/10 border-x border-afd-yellow/20' : ''}`}>{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compRows.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                    <td className="py-4 px-6 font-semibold">{row.feature}</td>
                    <td className="py-4 text-center">{row.alldata}</td>
                    <td className="py-4 text-center bg-afd-yellow/5 border-x border-afd-yellow/10">{row.autodata}</td>
                    <td className="py-4 text-center">{row.haynes}</td>
                    <td className="py-4 text-center">{row.mitchell}</td>
                    <td className="py-4 text-center">{row.identifix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-3xl font-extrabold text-afd-navy mb-12 text-center">{pData.faqHeading}</h2>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((idx) => {
              const qk = `q${idx}`;
              const ak = `a${idx}`;
              if (!dict.pricing.faq[qk]) return null;
              return <FAQItem key={qk} q={dict.pricing.faq[qk]} a={dict.pricing.faq[ak]} />;
            })}
          </div>
        </div>
      </section>
    </>
  );
}
