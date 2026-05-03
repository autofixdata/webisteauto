'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { COOKIE_CHOICE_KEY, CONSENT_UPDATED_EVENT } from '@/lib/cookieConsent';

/**
 * Loads the chat widget only after marketing/analytics consent and when the browser is idle
 * or the user scrolls past ~400px (reduces third-party contention on initial load).
 */
export default function DeferredLeadConnector() {
  const [inject, setInject] = useState(false);

  useEffect(() => {
    let done = false;
    const activate = () => {
      if (done) return;
      try {
        if (localStorage.getItem(COOKIE_CHOICE_KEY) !== 'all') return;
      } catch {
        return;
      }
      done = true;
      setInject(true);
    };

    activate();

    const onConsent = () => activate();
    window.addEventListener(CONSENT_UPDATED_EVENT, onConsent);

    const onScroll = () => {
      if (window.scrollY > 400) activate();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let canceled = false;
    let idleCallbackId = -1;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleIdle = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleCallbackId = window.requestIdleCallback(
          () => {
            if (!canceled) activate();
          },
          { timeout: 8000 },
        );
      } else {
        fallbackTimer = setTimeout(() => {
          if (!canceled) activate();
        }, 4000);
      }
    };
    scheduleIdle();

    return () => {
      canceled = true;
      window.removeEventListener(CONSENT_UPDATED_EVENT, onConsent);
      window.removeEventListener('scroll', onScroll);
      if (idleCallbackId !== -1 && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleCallbackId);
      }
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  if (!inject) return null;

  return (
    <Script
      id="leadconnector-widget"
      src="https://widgets.leadconnectorhq.com/loader.js"
      strategy="lazyOnload"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="696d618100a5f01fbad814c4"
    />
  );
}
