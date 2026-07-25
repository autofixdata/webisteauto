import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';
import { Shield, Cookie, Eye, Trash2, Download, Lock } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-afd-navy mb-4">{title}</h2>
    <div className="text-afd-text leading-relaxed space-y-3">{children}</div>
  </div>
);

const rights = [
  { icon: Eye, title: "Right of Access", desc: "Request a copy of all personal data we hold about you. We will respond within 30 days." },
  { icon: Shield, title: "Right to Rectification", desc: "Ask us to correct inaccurate or incomplete personal data we hold about you." },
  { icon: Trash2, title: "Right to Erasure", desc: "Request deletion of your personal data where we no longer have a lawful reason to retain it." },
  { icon: Lock, title: "Right to Restrict Processing", desc: "Ask us to pause processing your data in specific circumstances." },
  { icon: Download, title: "Right to Portability", desc: "Receive your data in a structured, machine-readable format (e.g. JSON or CSV)." },
  { icon: Cookie, title: "Right to Object", desc: "Object to processing of your data for direct marketing or on the basis of legitimate interests." },
];

const cookieTypes = [
  { name: "Strictly Necessary", desc: "Essential for the website to function. These cannot be disabled.", examples: "Session token, CSRF protection, cookie consent state", canDisable: false },
  { name: "Performance & Analytics", desc: "Help us understand how visitors interact with the website so we can improve it.", examples: "Page views, session duration, error rates (IP anonymised)", canDisable: true },
  { name: "Functional", desc: "Remember your preferences to enhance your experience.", examples: "Language preference, remembered username", canDisable: true },
  { name: "Marketing", desc: "Used to serve relevant advertising and track campaign effectiveness.", examples: "Ad click tracking, conversion pixels", canDisable: true },
];

import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  const m = dict.legal || {};
  return {
    title: metadataTitle(m.gdprTitle || 'GDPR & Cookie Policy | Auto Fix Data'),
    description: m.gdprDesc || 'Information regarding Auto Fix Data GDPR compliance.',
    alternates: await buildAlternates(lang, `/gdpr`)
  };
}

export default async function GDPRPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  return (
    <>
      <section className="bg-afd-navy py-16 px-6 dark-section">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-10 h-10 text-afd-yellow" />
            <h1 className="text-4xl font-extrabold text-white">GDPR & Cookie Policy</h1>
          </div>
          <p className="text-afd-slate text-lg max-w-2xl">Our commitment to data protection, your rights, and how we use cookies on workshopdata.us.</p>
          <p className="text-afd-slate/60 text-sm mt-2">Last updated: 1 January 2025</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">

          <Section title="Our GDPR Commitment">
            <p>Auto Fix Data Ltd is committed to protecting your privacy and handling personal data in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. We take a "privacy by design" approach, collecting only what we need and keeping it secure.</p>
            <p>Our Data Protection Officer can be reached at <a href="mailto:privacy@workshopdata.us" className="text-afd-blue underline">privacy@workshopdata.us</a>.</p>
          </Section>

          <Section title="Legal Bases for Processing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
              {[
                { basis: "Contract", desc: "Processing your subscription, billing, and account management." },
                { basis: "Legitimate Interest", desc: "Platform security, fraud prevention, and product improvement." },
                { basis: "Consent", desc: "Marketing emails and optional analytics cookies." },
                { basis: "Legal Obligation", desc: "Tax records, regulatory compliance, and legal proceedings." },
              ].map(({ basis, desc }) => (
                <div key={basis} className="bg-afd-light p-5 rounded-xl border border-gray-200">
                  <div className="font-bold text-afd-navy mb-1">{basis}</div>
                  <div className="text-sm text-afd-text">{desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Your Rights Under UK GDPR">
            <p className="mb-6">You have the following rights regarding your personal data. To exercise any of these rights, email us at <a href="mailto:privacy@workshopdata.us" className="text-afd-blue underline">privacy@workshopdata.us</a>. We will respond within 30 calendar days.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
              {rights.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-afd-light p-5 rounded-xl border border-gray-200">
                  <Icon className="w-6 h-6 text-afd-blue mb-3" />
                  <h3 className="font-bold text-afd-navy mb-1 text-sm">{title}</h3>
                  <p className="text-sm text-afd-text">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">If you are unhappy with how we handle your request, you have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at <a href="https://ico.org.uk/make-a-complaint" className="text-afd-blue underline" target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint</a>.</p>
          </Section>

          <Section title="Cookie Policy">
            <p>We use cookies and similar tracking technologies on workshopdata.us. A cookie is a small text file stored on your device by your browser. We use cookies to make our website function correctly, to understand how it is used, and to personalise your experience.</p>
            <p>When you first visit our site, you will be asked to consent to non-essential cookies. You can change your preferences at any time.</p>
          </Section>

          <Section title="Types of Cookies We Use">
            <div className="not-prose overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-afd-navy text-white">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Cookie Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Purpose</th>
                    <th className="text-left py-3 px-4 font-semibold">Examples</th>
                    <th className="text-center py-3 px-4 font-semibold">Can Disable?</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTypes.map((c, i) => (
                    <tr key={c.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-4 font-semibold text-afd-navy">{c.name}</td>
                      <td className="py-3 px-4 text-afd-text">{c.desc}</td>
                      <td className="py-3 px-4 text-afd-slate text-xs">{c.examples}</td>
                      <td className="py-3 px-4 text-center">
                        {c.canDisable
                          ? <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">Yes</span>
                          : <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">No</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="How to Manage Cookies">
            <p>You can manage cookies through:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Our cookie banner:</strong> When you first visit, accept or reject optional cookies. You can revisit your preferences at any time.</li>
              <li><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies. Note that disabling necessary cookies may affect site functionality.</li>
              <li><strong>Third-party opt-outs:</strong> For analytics providers, you can use tools such as Google Analytics Opt-out (<a href="https://tools.google.com/dlpage/gaoptout" className="text-afd-blue underline" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a>).</li>
            </ul>
          </Section>

          <Section title="International Data Transfers">
            <p>Some of our service providers process data outside the UK or EEA. Where such transfers occur, we ensure appropriate safeguards are in place in accordance with UK GDPR, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>UK International Data Transfer Agreements (IDTAs)</li>
              <li>Standard Contractual Clauses (SCCs) approved by the ICO</li>
              <li>Transfers to countries with UK adequacy decisions</li>
            </ul>
          </Section>

          <Section title="Data Retention">
            <p>We retain personal data only for as long as necessary for the purposes it was collected, or as required by law. Detailed retention periods are set out in our <a href="/privacy-policy" className="text-afd-blue underline">Privacy Policy</a>.</p>
          </Section>

          <Section title="Contact & Complaints">
            <div className="bg-afd-light p-6 rounded-xl border border-gray-200 not-prose">
              <p className="font-bold text-afd-navy mb-2">Data Protection Contact</p>
              <p className="text-afd-text text-sm">Auto Fix Data Ltd</p>
              <p className="text-afd-text text-sm">Email: <a href="mailto:privacy@workshopdata.us" className="text-afd-blue underline">privacy@workshopdata.us</a></p>
              <p className="text-afd-text text-sm mt-3 pt-3 border-t border-gray-200">If you are not satisfied with our response, you may contact the ICO:</p>
              <p className="text-afd-text text-sm">Information Commissioner's Office: <a href="https://ico.org.uk" className="text-afd-blue underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a> | Helpline: 0303 123 1113</p>
            </div>
          </Section>
        </div>
      </section>
    </>
  );
}
