import { notFound } from 'next/navigation';

/**
 * Catches unknown paths under /[lang]/… (e.g. /en/rvev) so Next renders
 * [lang]/not-found.tsx inside the site layout instead of the root 404.
 */
export default function UnknownLangRoute() {
  notFound();
}
