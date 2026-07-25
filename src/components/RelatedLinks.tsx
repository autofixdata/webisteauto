import Link from '@/components/LocalizedLink';
import { TOP_DTC_CODES } from '@/lib/dtcData';
import { getTopFaultMakesForCode } from '@/lib/faultPages';
import { getMakeDisplayName } from '@/lib/faultPages';

interface RelatedLinksProps {
  lang: string;
  dtcCode?: string;
  makeSlug?: string;
  makeName?: string;
  className?: string;
}

export default function RelatedLinks({
  lang,
  dtcCode,
  makeSlug,
  makeName,
  className = '',
}: RelatedLinksProps) {
  const relatedDtcs = dtcCode
    ? TOP_DTC_CODES.filter((c) => c.code !== dtcCode).slice(0, 6)
    : TOP_DTC_CODES.slice(0, 6);

  const faultMakes = dtcCode ? getTopFaultMakesForCode(dtcCode, 6) : [];

  return (
    <div className={`space-y-8 ${className}`}>
      {dtcCode && faultMakes.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-afd-navy mb-4">
            {dtcCode} common on these makes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {faultMakes.map((make) => (
              <Link
                key={make}
                href={`/${lang}/faults/${make}/${dtcCode}`}
                className="bg-white border border-gray-200 rounded-xl p-3 text-center hover:border-afd-yellow hover:shadow-md transition-all text-sm font-bold text-afd-navy"
              >
                {getMakeDisplayName(make)}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-afd-navy mb-4">Related DTC codes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {relatedDtcs.map((related) => (
            <Link
              key={related.code}
              href={`/${lang}/dtc/${related.code}`}
              className="bg-white border border-gray-200 rounded-xl p-3 text-center hover:border-afd-yellow transition-all group"
            >
              <div className="font-black text-afd-navy group-hover:text-afd-yellow">{related.code}</div>
              <div className="text-[10px] text-gray-500 line-clamp-2 mt-1">{related.description}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {makeSlug && makeName && (
          <Link
            href={`/${lang}/manuals/${makeSlug}`}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-afd-navy hover:border-afd-blue"
          >
            {makeName} manuals
          </Link>
        )}
        <Link
          href={`/${lang}/wiring-diagrams`}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-afd-navy hover:border-afd-blue"
        >
          Wiring diagrams
        </Link>
        <Link
          href={`/${lang}/free-trial`}
          className="px-4 py-2 rounded-lg bg-afd-yellow text-sm font-bold text-black hover:bg-afd-yellow-hover"
        >
          Free trial
        </Link>
      </div>
    </div>
  );
}
