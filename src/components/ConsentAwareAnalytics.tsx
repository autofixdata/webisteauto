'use client';

import { Analytics } from '@vercel/analytics/next';
import { useEffect, useState } from 'react';
import { COOKIE_CHOICE_KEY, CONSENT_UPDATED_EVENT } from '@/lib/cookieConsent';

/** Only mounts Vercel Web Analytics after optional cookies are accepted */
export default function ConsentAwareAnalytics() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function sync() {
      try {
        setShow(localStorage.getItem(COOKIE_CHOICE_KEY) === 'all');
      } catch {
        setShow(false);
      }
    }
    sync();
    window.addEventListener(CONSENT_UPDATED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, sync);
  }, []);

  if (!show) return null;
  return <Analytics />;
}
