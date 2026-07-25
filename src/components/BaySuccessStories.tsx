import { Clock, Wrench, Zap, MapPin, Shield } from 'lucide-react';

interface CaseStudy {
  title: string;
  garage: string;
  location: string;
  vehicle: string;
  dtc: string;
  dbUsed: string;
  estTime: string;
  actTime: string;
  summary: string;
}

interface CaseStudiesData {
  title: string;
  subtitle: string;
  cases: CaseStudy[];
}

const DB_COLORS: Record<string, string> = {
  'Mitchell1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Mitchell1 Topology': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Topologie Mitchell1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Topología Mitchell1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Topologia Mitchell1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'טופולוגיית Mitchell1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'تخطيط Mitchell1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'ALLDATA': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'ALLDATA TSB': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'TSB ALLDATA': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'TSB di ALLDATA': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'نشرات ALLDATA': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'ALLDATA TSB - נשרה': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Haynes Pro': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Haynes Pro VESA': 'bg-red-500/20 text-red-400 border-red-500/30',
  'VESA Haynes Pro': 'bg-red-500/20 text-red-400 border-red-500/30',
};

function getDbColor(db: string): string {
  if (DB_COLORS[db]) return DB_COLORS[db];
  if (db.toLowerCase().includes('alldata')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  if (db.toLowerCase().includes('haynes') || db.toLowerCase().includes('vesa')) return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (db.toLowerCase().includes('mitchell')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
}

const CASE_ICONS = [
  <svg key="can" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
  </svg>,
  <svg key="wrench" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>,
  <svg key="bolt" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>,
];

export default function BaySuccessStories({ data }: { data: CaseStudiesData }) {
  if (!data?.cases?.length) return null;

  return (
    <>
      <section className="py-28 bg-afd-dark relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-afd-yellow/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-afd-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-afd-yellow/10 text-afd-yellow rounded-full text-sm font-bold tracking-wider mb-6 border border-afd-yellow/20">
              <Shield className="w-4 h-4" />
              REAL WORKSHOP RESULTS
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
              {data.title}
            </h2>
            <p className="text-xl text-afd-slate max-w-2xl mx-auto leading-relaxed">
              {data.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {data.cases.map((c, i) => (
              <article
                key={i}
                className="relative bg-afd-navy border border-afd-border rounded-2xl overflow-hidden group hover:border-afd-yellow/40 hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-black/40 flex flex-col"
              >
                {/* Card top accent bar */}
                <div className={`h-1 w-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-orange-500' : 'bg-red-500'}`} />

                {/* Card header */}
                <div className="p-6 pb-4 border-b border-white/5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-blue-500/15 text-blue-400' : i === 1 ? 'bg-orange-500/15 text-orange-400' : 'bg-red-500/15 text-red-400'}`}
                    >
                      {CASE_ICONS[i % CASE_ICONS.length]}
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getDbColor(c.dbUsed)}`}
                    >
                      {c.dbUsed}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-afd-yellow transition-colors">
                    {c.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-afd-slate">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-medium">{c.garage}</span>
                    <span className="text-white/20">•</span>
                    <span>{c.location}</span>
                  </div>
                </div>

                {/* Vehicle + DTC info */}
                <div className="px-6 py-4 bg-black/20 border-b border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-afd-slate flex-shrink-0" />
                    <span className="text-sm text-white font-semibold">{c.vehicle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold">{c.dtc}</span>
                    <span className="text-xs text-afd-slate">Fault Code</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="px-6 py-4 text-sm text-afd-slate leading-relaxed flex-1">
                  {c.summary}
                </p>

                {/* Time Saved Metrics */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Without</span>
                      </div>
                      <div className="text-xl font-extrabold text-red-400 line-through decoration-red-500">{c.estTime}</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">With AFD</span>
                      </div>
                      <div className="text-xl font-extrabold text-green-400">{c.actTime}</div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <div className="mt-16 text-center">
            <p className="text-afd-slate text-sm mb-1">
              Join <span className="text-white font-bold">10,000+</span> professional workshops already using Auto Fix Data
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {['BMW', 'Ford', 'Toyota', 'VW', 'Mercedes', 'Renault'].map(make => (
                <span key={make} className="text-xs text-white/30 font-bold uppercase tracking-widest">{make}</span>
              ))}
              <span className="text-xs text-afd-yellow font-bold">+ 144 more</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
