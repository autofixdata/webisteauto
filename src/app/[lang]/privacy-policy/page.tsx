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
    title: metadataTitle(m.privacyTitle || 'Privacy Policy | Auto Fix Data'),
    description: m.privacyDesc || 'Auto Fix Data privacy policy.',
    alternates: await buildAlternates(lang, `/privacy-policy`)
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  return (
    <>
      <section className="bg-afd-navy py-16 px-6 dark-section">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-3">Privacy Policy</h1>
          <p className="text-afd-slate">Last updated: 1 January 2025</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-[800px] mx-auto">
          <Section title="1. Who We Are">
            <p>Auto Fix Data Ltd ("Auto Fix Data", "we", "us", "our") is a professional automotive repair database platform headquartered in the United Kingdom. We are the data controller for all personal data collected through this website (workshopdata.us) and our subscription services.</p>
            <p>If you have any questions about this Privacy Policy or how we handle your personal data, please contact us at: <a href="mailto:privacy@workshopdata.us" className="text-afd-blue underline">privacy@workshopdata.us</a></p>
          </Section>

          <Section title="2. Data We Collect">
            <p>We collect the following categories of personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> name, email address, business name, phone number, and billing address when you register for a subscription or free trial.</li>
              <li><strong>Usage data:</strong> IP address, browser type, pages visited, time spent on pages, and referring URLs collected automatically via cookies and server logs.</li>
              <li><strong>Payment data:</strong> billing information processed by our payment provider. We do not store full card numbers ourselves.</li>
              <li><strong>Communication data:</strong> messages sent via our contact form, live chat, or support tickets.</li>
              <li><strong>Marketing data:</strong> email marketing preferences and interaction with our campaigns.</li>
            </ul>
          </Section>

          <Section title="3. Legal Basis for Processing">
            <p>Under UK GDPR, we process your personal data on the following lawful bases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contract performance:</strong> to fulfil your subscription or trial agreement.</li>
              <li><strong>Legitimate interests:</strong> to improve our services, prevent fraud, and send service-related communications.</li>
              <li><strong>Consent:</strong> for marketing emails and optional cookies. You may withdraw consent at any time.</li>
              <li><strong>Legal obligation:</strong> to comply with tax, accounting and regulatory requirements.</li>
            </ul>
          </Section>

          <Section title="4. How We Use Your Data">
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate and improve the Auto Fix Data platform and subscription services.</li>
              <li>Process payments and manage your account.</li>
              <li>Send transactional emails (receipts, renewal reminders, password resets).</li>
              <li>Send marketing communications where you have opted in.</li>
              <li>Respond to support and enquiry requests.</li>
              <li>Comply with legal obligations and resolve disputes.</li>
              <li>Conduct analytics to understand how our services are used and to improve them.</li>
            </ul>
          </Section>

          <Section title="5. Data Sharing">
            <p>We do not sell your personal data. We may share your data with the following categories of third parties:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Payment processors:</strong> to handle billing and prevent fraud.</li>
              <li><strong>Cloud infrastructure providers:</strong> to host our platform securely.</li>
              <li><strong>Email service providers:</strong> to deliver transactional and marketing emails.</li>
              <li><strong>Analytics providers:</strong> to help us understand website usage (with IP anonymisation enabled).</li>
              <li><strong>Database licensors:</strong> ALLDATA, AutoData, Haynes Group, Mitchell1 and Identifix (Solera) as required to verify and fulfil your subscription.</li>
              <li><strong>Legal authorities:</strong> where required by law or to protect our rights.</li>
            </ul>
            <p>All third-party processors are contractually bound to protect your data in accordance with applicable data protection law.</p>
          </Section>

          <Section title="6. International Data Transfers">
            <p>Some of our service providers are based outside the UK/EEA. Where data is transferred internationally, we ensure appropriate safeguards are in place — including Standard Contractual Clauses (SCCs) approved by the UK Information Commissioner's Office (ICO) — to protect your personal data.</p>
          </Section>

          <Section title="7. Data Retention">
            <p>We retain personal data for as long as necessary to provide our services and comply with our legal obligations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Active account data: retained for the duration of the subscription plus 7 years for tax purposes.</li>
              <li>Marketing data: retained until you unsubscribe or withdraw consent.</li>
              <li>Support communications: retained for 3 years after the last interaction.</li>
              <li>Usage/analytics data: retained in aggregated form for up to 26 months.</li>
            </ul>
          </Section>

          <Section title="8. Your Rights">
            <p>Under UK GDPR, you have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right of access:</strong> request a copy of the personal data we hold about you.</li>
              <li><strong>Right to rectification:</strong> request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to erasure ("right to be forgotten"):</strong> request deletion of your data in certain circumstances.</li>
              <li><strong>Right to restrict processing:</strong> request that we limit how we use your data.</li>
              <li><strong>Right to data portability:</strong> receive your data in a structured, machine-readable format.</li>
              <li><strong>Right to object:</strong> object to processing based on legitimate interests or for direct marketing.</li>
              <li><strong>Rights related to automated decision-making:</strong> we do not make solely automated decisions that significantly affect you.</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:privacy@workshopdata.us" className="text-afd-blue underline">privacy@workshopdata.us</a>. We will respond within 30 days. If you are not satisfied with our response, you have the right to lodge a complaint with the ICO at <a href="https://ico.org.uk" className="text-afd-blue underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.</p>
          </Section>

          <Section title="9. Cookies">
            <p>We use cookies and similar tracking technologies to improve your experience. You can control cookie preferences through our cookie consent banner or your browser settings. For full details, see our <a href="/gdpr" className="text-afd-blue underline">Cookie & GDPR Policy</a>.</p>
          </Section>

          <Section title="10. Security">
            <p>We implement appropriate technical and organisational security measures to protect your personal data against unauthorised access, loss, or destruction. These include encryption in transit (TLS), access controls, regular security assessments, and staff training. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section title="11. Children's Privacy">
            <p>Our services are intended for professional use by adults aged 18 and over. We do not knowingly collect personal data from children under 16. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.</p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by displaying a notice on our website. The "Last updated" date at the top of this page indicates when the policy was last revised.</p>
          </Section>

          <Section title="13. Contact Us">
            <p>For any questions, concerns or requests relating to this Privacy Policy or your personal data:</p>
            <div className="bg-afd-light p-6 rounded-xl border border-gray-200 not-prose">
              <p className="font-bold text-afd-navy">Auto Fix Data Ltd</p>
              <p>Email: <a href="mailto:privacy@workshopdata.us" className="text-afd-blue underline">privacy@workshopdata.us</a></p>
              <p>Website: <a href="/contact" className="text-afd-blue underline">workshopdata.us/contact</a></p>
            </div>
          </Section>
        </div>
      </section>
    </>
  );
}
