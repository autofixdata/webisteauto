/** Open Graph locale identifiers (subset of BCP‑47 regions). */
export const OPEN_GRAPH_LOCALE: Record<string, string> = {
  en: 'en_GB',
  fr: 'fr_FR',
  es: 'es_ES',
  de: 'de_DE',
  it: 'it_IT',
  ar: 'ar_SA',
  he: 'he_IL',
};

export function openGraphLocaleForLang(lang: string): string {
  return OPEN_GRAPH_LOCALE[lang] ?? 'en_GB';
}
