import type { Metadata } from 'next';
import './[lang]/globals.css';
import NotFoundPage from '@/components/NotFoundPage';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

/** Fallback when no [lang] segment matches (rare; middleware usually adds a locale). */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <NotFoundPage forcedLang="en" />
      </body>
    </html>
  );
}
