import type { Metadata } from 'next';
import { buildAlternates, metadataTitle } from '@/lib/metadata';
import Link from '@/components/LocalizedLink';
import { BookOpen, ChevronRight, Zap, Activity, Search } from 'lucide-react';
import { getDictionary } from '@/dictionaries/getDictionary';

const LANGS = ['en', 'fr', 'es', 'de', 'it', 'ar', 'he'];

const ACRONYMS = [
  { term: 'ABS', full: 'Anti-lock Braking System' },
  { term: 'ACC', full: 'Adaptive Cruise Control' },
  { term: 'AFC', full: 'Air Flow Control' },
  { term: 'ALDL', full: 'Assembly Line Diagnostic Link — Former name for GM Data Link Connector' },
  { term: 'A/T', full: 'Automatic Transmission' },
  { term: 'AVM', full: 'Around View Monitoring' },
  { term: 'BCM', full: 'Body Control Module' },
  { term: 'BSD', full: 'Blind Spot Detection' },
  { term: 'CAN', full: 'Controller Area Network' },
  { term: 'CARB', full: 'California Air Resources Board' },
  { term: 'CFI', full: 'Central Fuel Injection / Continuous Fuel Injection' },
  { term: 'CO', full: 'Carbon Monoxide' },
  { term: 'CVN', full: 'Calibration Verification Number' },
  { term: 'DLC', full: 'Data Link Connector' },
  { term: 'DME', full: 'Digital Motor Electronics' },
  { term: 'DPF', full: 'Diesel Particulate Filter' },
  { term: 'DTC', full: 'Diagnostic Trouble Code' },
  { term: 'ECM', full: 'Engine Control Module' },
  { term: 'ECT', full: 'Engine Coolant Temperature' },
  { term: 'ECU', full: 'Engine Control Unit' },
  { term: 'EEC', full: 'Electronic Engine Control' },
  { term: 'EEPROM', full: 'Electrically Erasable Programmable Read Only Memory' },
  { term: 'EFI', full: 'Electronic Fuel Injection' },
  { term: 'EGR', full: 'Exhaust Gas Recirculation' },
  { term: 'EMR', full: 'Electronic Module Retard' },
  { term: 'EPA', full: 'Environmental Protection Agency' },
  { term: 'EPB', full: 'Electronic Parking Brake' },
  { term: 'ESC', full: 'Electronic Spark Control' },
  { term: 'EST', full: 'Electronic Spark Timing' },
  { term: 'DPFE', full: 'Differential Pressure Feedback EGR Sensor (Ford OBD2)' },
  { term: 'FLI', full: 'Fuel Level Indicator' },
  { term: 'HC', full: 'Hydrocarbons' },
  { term: 'HEI', full: 'High Energy Ignition' },
  { term: 'HO2S', full: 'Heated Oxygen Sensor' },
  { term: 'IAT', full: 'Intake Air Temperature' },
  { term: 'IMMO', full: 'Immobiliser' },
  { term: 'ISO 9141', full: 'International Standards Organization OBDII Communication Mode' },
  { term: 'J1850PWM', full: 'Pulse Width Modulated — Ford OBD2 Communication Standard' },
  { term: 'J1850VPW', full: 'Variable Pulse Width Modulated — GM OBD2 Communication Standard' },
  { term: 'J1962', full: 'SAE Standard for OBD2 Scan Tool Connector (16-pin)' },
  { term: 'J1978', full: 'SAE Standard for OBD2 Scan Tools' },
  { term: 'J1979', full: 'SAE Standard for Diagnostic Test Modes' },
  { term: 'K-line', full: 'Single Line Communication Between Diagnostic Machine and ECU' },
  { term: 'KOEO', full: 'Key On Engine Off' },
  { term: 'KOER', full: 'Key On Engine Running' },
  { term: 'LDW', full: 'Lane Departure Warning' },
  { term: 'MAF', full: 'Mass Air Flow' },
  { term: 'MAP', full: 'Manifold Absolute Pressure' },
  { term: 'MAT', full: 'Manifold Air Temperature' },
  { term: 'MFG', full: 'Manufacturer' },
  { term: 'MIL', full: 'Malfunction Indicator Light — the Check Engine Light' },
  { term: 'NOx', full: 'Oxides of Nitrogen' },
  { term: 'NV', full: 'Night Vision' },
  { term: 'OBD', full: 'On-Board Diagnostics' },
  { term: 'OBD I', full: 'First Generation On-Board Diagnostics — Manufacturer-specific plugs' },
  { term: 'OBD II', full: 'Updated OBD Standard — All US cars after January 1, 1996' },
  { term: 'PAS', full: 'Parking Assist System' },
  { term: 'PCM', full: 'Powertrain Control Module' },
  { term: 'PCV', full: 'Positive Crankcase Ventilation' },
  { term: 'PID', full: 'Parameter ID' },
  { term: 'PTC', full: 'Pending Trouble Code' },
  { term: 'RCW', full: 'Rear Collision Warning' },
  { term: 'RPM', full: 'Revolutions Per Minute' },
  { term: 'SA', full: 'Reference Code for Functions' },
  { term: 'SAE', full: 'Society of Automotive Engineers' },
  { term: 'SCN', full: 'Software Calibration Number' },
  { term: 'SES', full: 'Service Engine Soon — now referred to as MIL' },
  { term: 'SFI', full: 'Sequential Fuel Injection' },
  { term: 'SRS', full: 'Supplemental Restraint System (Airbags)' },
  { term: 'TBI', full: 'Throttle Body Injection' },
  { term: 'TPI', full: 'Tuned Port Injection' },
  { term: 'TPS', full: 'Throttle Position Sensor / Tyre Pressure Sensor' },
  { term: 'VAC', full: 'Vacuum' },
  { term: 'VCI', full: 'Vehicle Control Interface' },
  { term: 'VCM', full: 'Vehicle Control Module' },
  { term: 'VIN', full: 'Vehicle Identification Number' },
  { term: 'VSS', full: 'Vehicle Speed Sensor' },
  { term: 'WOT', full: 'Wide Open Throttle' },
];

const TECHNICAL_TERMS = [
  { term: 'ADAS — Advanced Driver Assistance Systems', desc: 'Term used to describe the many systems and emerging technologies in modern vehicles, existing in some as early as 2006. Includes Lidar, Radar, sonar, object detection, lane keep assist, blind spot detection, thermal imaging (night vision), brake assist, active cruise control, and active lighting. All systems use sensors and cameras that require calibrations.' },
  { term: 'Aftermarket Scan Tool', desc: 'A scan tool developed and marketed outside of OEM dealer sources. Capabilities can range from basic to highly specialized, depending on the software packages purchased for the tool.' },
  { term: 'Application Based Scan Tool', desc: 'A laptop, PC, or tablet based software package that uses the device\'s computing resources and connects to a vehicle via USB, Bluetooth, or Wi-Fi (VCI). Both OEM and aftermarket versions are available.' },
  { term: 'Battery Support', desc: 'A suitable battery charger, voltage maintainer, or fully charged jump box connected during KOEO mode — especially critical during programming. Prevents vehicle voltage falling below normal levels.' },
  { term: 'CAN (Controller Area Network)', desc: 'A vehicle communication protocol replacing older protocols since 2003. Primarily a 2-wire network connecting modules to the diagnostic (DLC) connector. As of 2008, all US vehicles must implement CAN.' },
  { term: 'Calibrate / Initialization', desc: 'Not programming — the process of putting a module into "learn mode" with predetermined standard set points. Like setting your bathroom scale to "0" before weighing. Must be done with a compatible scan tool.' },
  { term: 'Coding', desc: 'Similar to calibration but not as detailed as programming. Coding must be entered into modules using a scan tool when a component has been replaced or the system reset.' },
  { term: 'Conditional Monitoring', desc: 'A DTC type requiring a road test. Specific conditions must be met before the module runs a system function self-check. Some DTCs of this type require multiple drive cycles before a fault can detect and trigger.' },
  { term: 'Continuous Monitoring', desc: 'A DTC self-check type where circuits and conditions are monitored at all times the key is on or engine is running. A code sets whenever a fault is present.' },
  { term: 'Cyber Fingerprint', desc: 'Diagnostic Trouble Codes created during the normal course of performing required repair operations. Disconnecting sensors, lights, modules, wiring, and the battery during repairs triggers multiple fault codes.' },
  { term: 'Data Link Connector (DLC) — OBD2 Connector', desc: 'The 16-pin, D-shaped connector used to connect scan tools to vehicle data networks. Located within a mandated distance from the driver\'s steering wheel, usually beneath the knee bolster.' },
  { term: 'Diagnostic Trouble Code (DTC)', desc: 'Codes obtained during a vehicle scan, specific to module functions and outputs. A DTC does not indicate a specific component has failed, but that there is trouble within the component or its circuit.' },
  { term: 'Drive Cycle', desc: 'A specific vehicle operating sequence reproducing all driving scenarios: starting, driving through all gears, full warm-up to operating temperature, steering both directions, stop, idle, and shut off.' },
  { term: 'Dynamic Calibration', desc: 'A calibration procedure requiring the vehicle to be put into a learn state and then operated under specified conditions until calibration is complete.' },
  { term: 'Fault', desc: 'Something not working on the vehicle as designed. Faults monitored by a module result in a DTC being stored if the fault is outside expected parameters.' },
  { term: 'Freeze Frame Data (Failure Records)', desc: 'A snapshot of sensor data captured at the exact moment a DTC was set. Required for all OBD2 emissions codes. Used by technicians to determine operating conditions of the fault.' },
  { term: 'Hard Fault', desc: 'A fault that is continuously monitored and is present at the time of scan — the code will not clear. The fault must be located and repaired before any code can be cleared.' },
  { term: 'History Code', desc: 'A fault code that is not currently active. The code was set at some point but has since passed the module\'s subsequent self-check.' },
  { term: 'Intermittent Fault', desc: 'A fault that is conditionally or intermittently present, possibly creating symptoms only under specific circumstances. Intermittent faults are often the most difficult to locate and correct.' },
  { term: 'Key On Engine Off (KOEO)', desc: 'Vehicle electrical systems powered without the engine running. Battery support is required for extended procedures as the battery drains quickly.' },
  { term: 'Key On Engine Running (KOER)', desc: 'The vehicle is on with the engine running, or in "ready mode" for hybrid vehicles.' },
  { term: 'Live Data', desc: 'Real-time sensor input values, circuit resistance values, and module output states displayed on a scan tool during an active vehicle connection.' },
  { term: 'Malfunction Indicator Lamp (MIL)', desc: 'Any warning lamp on the instrument cluster — Check Engine, ABS, Airbag/SRS, Traction Control, Oil Pressure, Coolant Temperature, Tyre Pressure, and others.' },
  { term: 'OBD2 Scan Tool', desc: 'A scan tool equipped only with basic OBD2 emission-control capabilities. Body controls, airbags, ABS, theft deterrent, seat belt data — are not included and require an Enhanced or OEM-level scan tool.' },
  { term: 'Output Test (Bi-Directional Control)', desc: 'A scan tool function activating individual vehicle components for diagnostic verification — commanding headlamps, cooling fans, A/C compressors, wipers, door locks, and more.' },
  { term: 'Pending Code', desc: 'A code that has failed or marginally passed the vehicle\'s built-in test routines. If it passes 2 or more consecutive self-tests, the pending code self-clears.' },
  { term: 'Programming / Flashing', desc: 'A procedure required for most replacement modules. New modules ship with generic base software that cannot operate in any specific vehicle until the correct program file is downloaded from the manufacturer.' },
  { term: 'Pre-Scan (Pre-Repair Scan)', desc: 'Performed before repairs begin. Identifies areas of concern within the vehicle\'s computer networks, components, and safety systems.' },
  { term: 'Post-Scan (Post-Repair Scan)', desc: 'Performed when the vehicle is completely reassembled before final QC. Verifies all required calibrations and programming are completed.' },
  { term: 'Service Information', desc: 'Sources for vehicle repair information, schematics, wiring diagrams, calibration procedures, and diagnostic test procedures from ALLDATA, Mitchell1, Identifix, Haynes Pro, and others.' },
  { term: 'Zero-Point Calibration', desc: 'A type of static calibration used for occupant detection systems, steering angle sensors, brake pedal position sensors, and idle air control "idle learn" procedures.' },
];

const glossarySchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Automotive Diagnostic and Workshop Glossary',
  description: 'Complete definitions for automotive diagnostic, OBD2, and repair terminology used by professional mechanics.',
  hasDefinedTerm: [
    ...ACRONYMS.map(t => ({ '@type': 'DefinedTerm', name: t.term, description: t.full })),
    ...TECHNICAL_TERMS.map(t => ({ '@type': 'DefinedTerm', name: t.term, description: t.desc })),
  ]
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  return {
    title: metadataTitle(dict.glossary.meta.title),
    description: dict.glossary.meta.description,
    alternates: await buildAlternates(lang, `/glossary`),
    keywords: ['automotive diagnostics glossary', 'OBD2 terminology', 'DTC definition', 'scan tool terms', 'automotive acronyms', 'CAN bus explained', 'ECU diagnostic terms'],
  };
}

export default async function GlossaryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const d = dict.glossary;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: glossarySchema }} />

      {/* HERO */}
      <section className="bg-afd-dark py-20 px-6 border-b border-afd-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-afd-blue to-transparent pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-afd-blue/20 text-afd-blue rounded-full text-xs font-bold tracking-widest mb-5 border border-afd-blue/30">
            <BookOpen className="w-3.5 h-3.5" /> {d.hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight max-w-4xl">
            {d.hero.heading1}<br />
            <span className="text-afd-yellow">{d.hero.heading2}</span>
          </h1>
          <p className="text-afd-slate text-lg max-w-3xl mb-8 leading-relaxed">
            {d.hero.subheading}
          </p>
          <div className="flex flex-wrap gap-6 text-sm mb-8">
            {[
              { label: d.hero.stat1, icon: BookOpen },
              { label: d.hero.stat2, icon: Zap },
              { label: d.hero.stat3, icon: Activity },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 text-afd-slate">
                <Icon className="w-4 h-4 text-afd-yellow" />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dtc" className="inline-flex items-center gap-2 px-5 py-2.5 bg-afd-navy text-white font-bold rounded-xl hover:bg-afd-blue transition-all text-sm border border-white/10">
              <Search className="w-4 h-4" /> {d.cta.button1}
            </Link>
            <Link href="/free-trial" className="inline-flex items-center gap-2 px-5 py-2.5 bg-afd-yellow text-black font-bold rounded-xl hover:bg-afd-yellow-hover transition-all text-sm">
              {d.cta.button2} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ACRONYMS SECTION */}
      <section id="acronyms" className="py-20 px-6 bg-afd-light border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-bold tracking-widest mb-3 border border-red-500/20">
              A–Z REFERENCE
            </div>
            <h2 className="text-3xl font-extrabold text-afd-navy mb-2">{d.acronymsHeading}</h2>
            <p className="text-afd-text max-w-2xl">{d.acronymsSubheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {ACRONYMS.map(({ term, full }) => (
              <div key={term} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-afd-blue/30 transition-all group">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 inline-flex items-center justify-center bg-afd-navy text-afd-yellow text-xs font-extrabold px-2 py-1 rounded-lg min-w-[52px] text-center leading-tight mt-0.5">
                    {term}
                  </span>
                  <span className="text-sm text-afd-text group-hover:text-afd-navy transition-colors leading-snug">
                    {full}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNICAL TERMINOLOGY */}
      <section id="technical-terms" className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-xs font-bold tracking-widest mb-3 border border-purple-500/20">
              ADVANCED CONCEPTS
            </div>
            <h2 className="text-3xl font-extrabold text-afd-navy mb-2">{d.technicalHeading}</h2>
            <p className="text-afd-text max-w-2xl">{d.technicalSubheading}</p>
          </div>
          <div className="space-y-3">
            {TECHNICAL_TERMS.map(({ term, desc }) => (
              <details key={term} className="group bg-afd-light rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <h3 className="font-bold text-afd-navy text-base pr-4">{term}</h3>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-6 pb-5 text-sm text-afd-text leading-relaxed border-t border-gray-100 pt-4">
                  {desc}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-afd-navy text-center px-6">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">{d.cta.heading}</h2>
          <p className="text-afd-slate text-lg mb-8">{d.cta.subheading}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/dtc" className="inline-block px-8 py-4 bg-afd-yellow text-black font-bold rounded-xl text-lg hover:bg-afd-yellow-hover transition-all shadow-lg shadow-afd-yellow/20">
              {d.cta.button1}
            </Link>
            <Link href="/free-trial" className="inline-block px-8 py-4 bg-white/10 text-white font-bold rounded-xl text-lg hover:bg-white/20 transition-all border border-white/20">
              {d.cta.button2}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
