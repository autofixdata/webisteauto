import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 bg-gray-50 text-center">
      <div className="w-16 h-16 bg-afd-navy rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        <Wrench className="w-8 h-8 text-afd-yellow" aria-hidden />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-afd-navy mb-3">Page not found</h1>
      <p className="text-afd-slate max-w-md mb-8 text-lg">
        This URL is not in our repair database. Try the home page or search for a make, model, or fault code.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/en"
          className="px-6 py-3 rounded-xl bg-afd-yellow text-black font-bold hover:bg-afd-yellow-hover transition-colors"
        >
          English home
        </Link>
        <Link
          href="/en/dtc"
          className="px-6 py-3 rounded-xl border-2 border-afd-navy text-afd-navy font-bold hover:bg-afd-navy hover:text-white transition-colors"
        >
          DTC directory
        </Link>
      </div>
    </div>
  );
}
