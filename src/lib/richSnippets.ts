/**
 * Shared JSON-LD rich snippet helpers for workshopdata.us
 * Used across product pages, feature pages, pricing, and SEO alternative pages.
 */

export const SITE_URL = "https://workshopdata.us";

/**
 * Standard Offer for the main subscription (£99–£199/mo)
 * Includes: price range, In Stock, 7-day return policy, free trial note
 */
export const MAIN_OFFER = {
  "@type": "AggregateOffer",
  lowPrice: "99",
  highPrice: "199",
  priceCurrency: "GBP",
  offerCount: "2",
  availability: "https://schema.org/InStock",
  priceValidUntil: "2026-12-31",
  url: `${SITE_URL}/pricing`,
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "GB",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  },
};

/**
 * Free Trial Offer (zero price, 7 days)
 */
export const FREE_TRIAL_OFFER = {
  "@type": "Offer",
  name: "Free 7-Day Trial",
  price: "0",
  priceCurrency: "GBP",
  availability: "https://schema.org/InStock",
  url: `${SITE_URL}/free-trial`,
  description: "Start a free 7-day trial — no credit card required.",
};

/**
 * Product schema aligned with visible offer content only (no review markup unless on-page verified).
 */
export function buildProductSchema({
  name,
  description,
  url,
  image,
  offers = [MAIN_OFFER, FREE_TRIAL_OFFER],
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  offers?: object[];
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    description,
    brand: { "@type": "Brand", name: "Auto Fix Data" },
    url,
    ...(image ? { image } : {}),
    offers,
  };
}

/**
 * Build a FAQPage schema from an array of {q, a} question/answer pairs.
 */
export function buildFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
