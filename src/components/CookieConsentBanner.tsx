'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  COOKIE_CHOICE_KEY,
  CookieConsentChoice,
  applyGtagConsentAll,
  notifyConsentListeners,
} from '@/lib/cookieConsent';

export type CookieBannerLabels = {
  title: string;
  body: string;
  acceptAll: string;
  essentialOnly: string;
  privacyLink: string;
};

export default function CookieConsentBanner({
  lang,
  labels,
}: {
  lang: string;
  labels: CookieBannerLabels;
}) {
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(COOKIE_CHOICE_KEY);
      setVisible(!existing);
    } catch {
      setVisible(true);
    }
  }, []);

  function persist(choice: CookieConsentChoice) {
    try {
      localStorage.setItem(COOKIE_CHOICE_KEY, choice);
    } catch {
      /* ignore */
    }
    if (choice === 'all') {
      applyGtagConsentAll();
    }
    notifyConsentListeners();
    setVisible(false);
  }

  if (visible !== true) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] border-t border-white/10 bg-afd-navy text-white shadow-2xl px-4 py-4 md:px-8 md:py-5"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-2 text-sm md:text-[15px] leading-relaxed text-afd-slate">
          <p id="cookie-consent-title" className="font-bold text-white text-base md:text-lg">
            {labels.title}
          </p>
          <p>{labels.body}</p>
          <p>
            <Link href={`/${lang}/gdpr`} className="text-afd-yellow underline underline-offset-2 font-semibold hover:text-white transition-colors">
              {labels.privacyLink}
            </Link>
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-3 md:justify-end">
          <button
            type="button"
            onClick={() => persist('essential')}
            className="px-5 py-2.5 rounded-lg border border-white/25 text-white text-sm font-bold hover:bg-white/10 transition-colors"
          >
            {labels.essentialOnly}
          </button>
          <button
            type="button"
            onClick={() => persist('all')}
            className="px-5 py-2.5 rounded-lg bg-afd-yellow text-black text-sm font-bold hover:bg-afd-yellow-hover transition-colors shadow-lg shadow-black/30"
          >
            {labels.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
