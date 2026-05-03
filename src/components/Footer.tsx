import Link from 'next/link';
import { Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Footer({ dict, lang }: { dict: any, lang: string }) {
  return (
    <>
      {/* Pre-Footer CTA */}
      <section className="bg-afd-yellow py-16 md:py-20 relative overflow-hidden">
        <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4">{dict.footer.ctaHeading || `${dict.nav.freeTrial} Today`}</h2>
          <p className="text-xl text-black/80 font-medium mb-8">{dict.footer.ctaSubheading || 'Full platform access. No credit card. No commitment.'}</p>
          <Link href={`/${lang}/free-trial`} className="inline-block bg-afd-navy text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-afd-dark hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            {dict.footer.ctaButton || `${dict.nav.freeTrial} Now`}
          </Link>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-black/70 font-medium text-sm">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {dict.footer.noCard || 'No credit card'}</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {dict.footer.noContract || 'No contract'}</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {dict.footer.cancelAnytime || 'Cancel anytime'}</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> {dict.footer.workshops || '10,000+ workshops'}</span>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-afd-navy pt-20 pb-10 border-t-4 border-afd-dark">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-16 flex flex-col gap-10 md:grid md:grid-cols-4 md:gap-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-afd-yellow rounded flex items-center justify-center">
                  <Wrench className="w-3 h-3 text-black" />
                </div>
                <span className="text-lg font-bold text-white">Auto Fix Data</span>
              </div>
              <p className="text-afd-slate text-sm mb-6 leading-relaxed">
                The professional workshop database. Providing independent garages with OEM repair data, wiring diagrams, and DTC codes.
              </p>
              
              <div className="flex gap-3 mb-6">
                <a href="https://facebook.com/autofixdata" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-afd-slate hover:text-white hover:border-white/30 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://x.com/autofixdata" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-afd-slate hover:text-white hover:border-white/30 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </a>
                <a href="https://linkedin.com/company/autofixdata" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-afd-slate hover:text-white hover:border-white/30 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://instagram.com/autofixdata" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-afd-slate hover:text-white hover:border-white/30 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://api.whatsapp.com/send/?phone=447367064215" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-afd-slate hover:text-white hover:border-white/30 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>
              </div>
              
              <a href="https://api.whatsapp.com/send/?phone=447367064215" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#1ebd59] hover:shadow-lg hover:shadow-[#25D366]/20 transition-all duration-300">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp Us
              </a>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">{dict.nav.products}</h4>
              <ul className="space-y-3">
                {[['alldata', 'ALLDATA'], ['autodata', 'AutoData'], ['haynes-pro', 'Haynes Pro'], ['mitchell1', 'Mitchell1'], ['identifix', 'Identifix']].map(([slug, name]) => (
                  <li key={slug}><Link href={`/${lang}/${slug}`} className="text-afd-slate hover:text-afd-yellow transition-colors text-sm font-medium">{name}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Resources</h4>
              <ul className="space-y-3">
                {[[`/${lang}/repair-manuals`, dict.nav.repairData], [`/${lang}/diagnostics`, dict.nav.diagnostics], [`/${lang}/wiring-diagrams`, dict.nav.wiring], [`/${lang}/dtc`, 'Fault Code Directory'], [`/${lang}/glossary`, 'Terminology Glossary'], [`/${lang}/blog`, 'Workshop Blog'], [`/${lang}/pricing`, dict.nav.pricing]].map(([href, label]) => (
                  <li key={href}><Link href={href} className="text-afd-slate hover:text-afd-yellow transition-colors text-sm font-medium">{label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
              <ul className="space-y-3">
                {[[`/${lang}/about`, dict.nav.about], [`/${lang}/contact`, dict.nav.contact], [`/${lang}/login`, dict.nav.login]].map(([href, label]) => (
                  <li key={href}><Link href={href} className="text-afd-slate hover:text-afd-yellow transition-colors text-sm font-medium">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {dict.footer.schemaTrust && (
            <p className="text-afd-slate/80 text-xs max-w-3xl mx-auto text-center mb-8 leading-relaxed border border-white/5 rounded-xl px-4 py-3 bg-white/[0.03]">
              {dict.footer.schemaTrust}
            </p>
          )}

          <div className="pt-8 border-t border-afd-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-afd-slate text-sm">
              © {new Date().getFullYear()} Auto Fix Data Ltd. {dict.footer.rights}.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-afd-slate">
              <Link href={`/${lang}/privacy-policy`} className="hover:text-white transition-colors">{dict.footer.privacy}</Link>
              <Link href={`/${lang}/terms-of-service`} className="hover:text-white transition-colors">{dict.footer.terms}</Link>
              <Link href={`/${lang}/gdpr`} className="hover:text-white transition-colors">{dict.footer.gdpr}</Link>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
