import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-afd-navy mb-4">{title}</h2>
    <div className="text-afd-text leading-relaxed space-y-3">{children}</div>
  </div>
);

import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  const m = dict.legal || {};
  return {
    title: metadataTitle(m.termsTitle || 'Terms of Service | Auto Fix Data'),
    description: m.termsDesc || 'Auto Fix Data terms of service.',
    alternates: await buildAlternates(lang, `/terms-of-service`)
  };
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  return (
    <>
      <section className="bg-afd-navy py-16 px-6 dark-section">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-3">Terms of Service</h1>
          <p className="text-afd-slate">Last updated: 1 January 2025</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-[800px] mx-auto">
          <Section title="1. Agreement to Terms">
            <p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you", "your") and Auto Fix Data Ltd ("Auto Fix Data", "we", "us", "our"). By accessing or using our website (workshopdata.us) or subscribing to our services, you agree to be bound by these Terms.</p>
            <p>If you are accessing the service on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.</p>
          </Section>

          <Section title="2. Description of Services">
            <p>Auto Fix Data provides professional automotive workshop repair data through authorised reseller agreements with ALLDATA (AutoZone), AutoData (Solera), Haynes Pro (Haynes Group), Mitchell1 (Snap-on), and Identifix (Solera). Our platform aggregates access to these databases under a single subscription.</p>
            <p>All repair data, wiring diagrams, TSBs, DTC codes and related content are provided by the respective database owners and are subject to their own licencing terms in addition to these Terms.</p>
          </Section>

          <Section title="3. Eligibility & Account Registration">
            <p>You must be at least 18 years old and a professional in the automotive repair industry to use our services. By registering, you confirm that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The information you provide is accurate and complete.</li>
              <li>You will maintain the security of your account credentials.</li>
              <li>You will promptly notify us of any unauthorised use of your account.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
            </ul>
          </Section>

          <Section title="4. Subscription Plans & Billing">
            <p><strong>Trial Period:</strong> The free 7-day trial requires no credit card. At the end of the trial, access expires automatically unless you choose a paid plan.</p>
            <p><strong>Paid Subscriptions:</strong> Plans are billed monthly or annually in advance. Prices are displayed on our Pricing page and exclude VAT where applicable.</p>
            <p><strong>Renewals:</strong> Subscriptions auto-renew at the end of each billing period. You may cancel at any time before the next renewal date.</p>
            <p><strong>Refunds:</strong> We do not offer refunds for partial billing periods. If you cancel, you retain access until the end of the current paid period.</p>
            <p><strong>Price Changes:</strong> We reserve the right to modify pricing with 30 days' written notice. Continued use after the effective date constitutes acceptance of the new price.</p>
          </Section>

          <Section title="5. Authorised Use">
            <p>You may use Auto Fix Data services solely for legitimate professional automotive repair and maintenance purposes. You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Share, resell, sublicence, or redistribute access credentials or database content.</li>
              <li>Use automated tools, scrapers, bots or crawlers to extract data.</li>
              <li>Reproduce or distribute database content outside of your legitimate repair work.</li>
              <li>Circumvent any access controls, DRM or geographical restrictions.</li>
              <li>Use the service for any unlawful purpose or in violation of applicable law.</li>
              <li>Attempt to reverse-engineer, decompile or disassemble any part of the platform.</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            <p>All repair data, wiring diagrams, TSBs, and related content accessed through our platform remain the intellectual property of the respective database owners (ALLDATA/AutoZone, AutoData/Solera, Haynes Group, Mitchell1/Snap-on, Identifix/Solera). Your subscription grants you a limited, non-exclusive, non-transferable licence to access and use this data for internal professional workshop purposes only.</p>
            <p>The Auto Fix Data brand, website design, software, and platform architecture are the intellectual property of Auto Fix Data Ltd. You may not reproduce or use them without our written permission.</p>
          </Section>

          <Section title="7. Disclaimers">
            <p>Auto Fix Data provides access to third-party databases as a reseller. While we take reasonable steps to ensure data quality:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We make no warranty as to the accuracy, completeness or fitness for a particular purpose of any repair data.</li>
              <li>Repair data is provided for guidance and professional reference only — the qualified technician remains responsible for all repair decisions.</li>
              <li>We are not liable for any damage to vehicles, property, or persons arising from reliance on database content.</li>
              <li>Service availability is provided "as is" without guarantee of uninterrupted access.</li>
            </ul>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>To the maximum extent permitted by law, Auto Fix Data's total liability to you for any claim arising from use of our services is limited to the amount you paid in subscription fees in the 3 months preceding the claim. We are not liable for indirect, incidental, special, consequential, or punitive damages.</p>
          </Section>

          <Section title="9. Termination">
            <p>We reserve the right to suspend or terminate your account immediately if you breach these Terms, engage in fraudulent activity, or misuse the platform. You may terminate your account at any time by contacting us or through your account settings.</p>
            <p>Upon termination, your right to access the platform ceases immediately. Data retention following termination is governed by our Privacy Policy.</p>
          </Section>

          <Section title="10. Governing Law & Disputes">
            <p>These Terms are governed by the laws of England and Wales. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales, unless you are a consumer in another jurisdiction with mandatory consumer protection rights that apply.</p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>We may modify these Terms at any time. We will provide 14 days' notice of material changes via email or website notice. Continued use of the service after the effective date of changes constitutes acceptance of the updated Terms.</p>
          </Section>

          <Section title="12. Contact">
            <p>For questions regarding these Terms, contact us at <a href="mailto:legal@workshopdata.us" className="text-afd-blue underline">legal@workshopdata.us</a> or via our <a href="/contact" className="text-afd-blue underline">contact page</a>.</p>
          </Section>
        </div>
      </section>
    </>
  );
}
