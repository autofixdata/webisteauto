/** localStorage key for analytics + marketing consent (LeadConnector chat, Vercel Analytics, full GTM). */
export const COOKIE_CHOICE_KEY = 'afd-cookie-choice';

export type CookieConsentChoice = 'essential' | 'all';

export const CONSENT_UPDATED_EVENT = 'afd-consent-update';

/**
 * Runs before GTM: Consent Mode v2 defaults, then hydrate from storage if user previously accepted all.
 */
export function getConsentBootstrapInlineScript(): string {
  const key = COOKIE_CHOICE_KEY;
  const defaultConsent = JSON.stringify({
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  });
  const updateAll = JSON.stringify({
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
    personalization_storage: 'granted',
  });

  return `(function(){
  window.dataLayer=window.dataLayer||[];
  window.gtag=function gtag(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',${defaultConsent});
  try{
    if(typeof localStorage!=='undefined'&&localStorage.getItem(${JSON.stringify(key)})==='all'){
      window.gtag('consent','update',${updateAll});
    }
  }catch(e){}
})();`;
}

export function notifyConsentListeners(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CONSENT_UPDATED_EVENT));
}

export function applyGtagConsentAll(): void {
  window.gtag?.('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
    personalization_storage: 'granted',
  });
}
