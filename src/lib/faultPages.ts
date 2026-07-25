import { TOP_DTC_CODES } from './dtcData';
import { POPULAR_MAKES } from './carData';

/** Top makes for programmatic fault pages (make + DTC combos). */
export const FAULT_MAKE_SLUGS = [
  'bmw', 'ford', 'volkswagen', 'toyota', 'mercedes-benz', 'audi', 'honda',
  'nissan', 'hyundai', 'kia', 'volvo', 'renault', 'peugeot', 'vauxhall',
  'chevrolet', 'jeep', 'mazda', 'subaru', 'fiat', 'skoda',
] as const;

/** Shared high-volume DTC codes for fault landing pages. */
export const FAULT_DTC_CODES = TOP_DTC_CODES.slice(0, 30).map((d) => d.code);

export interface FaultCombo {
  make: string;
  code: string;
}

export function getAllFaultCombos(): FaultCombo[] {
  const combos: FaultCombo[] = [];
  for (const make of FAULT_MAKE_SLUGS) {
    for (const code of FAULT_DTC_CODES) {
      combos.push({ make, code });
    }
  }
  return combos;
}

export function getFaultSitemapPaths(): string[] {
  return getAllFaultCombos().map(({ make, code }) => `/faults/${make}/${code}`);
}

export function getCommonCodesForMake(makeSlug: string, limit = 8): string[] {
  if (!FAULT_MAKE_SLUGS.includes(makeSlug as (typeof FAULT_MAKE_SLUGS)[number])) {
    return FAULT_DTC_CODES.slice(0, limit);
  }
  return FAULT_DTC_CODES.slice(0, limit);
}

export function getTopFaultMakesForCode(code: string, limit = 6): string[] {
  const normalized = code.toUpperCase();
  if (!FAULT_DTC_CODES.includes(normalized)) return FAULT_MAKE_SLUGS.slice(0, limit);
  return FAULT_MAKE_SLUGS.slice(0, limit);
}

export function getMakeDisplayName(makeSlug: string): string {
  return POPULAR_MAKES.find((m) => m.slug === makeSlug)?.name ?? makeSlug;
}

export function buildFaultIntro(makeName: string, code: string, description: string, popularModels: string[]): string {
  const models = popularModels.slice(0, 4).join(', ');
  return `${code} on ${makeName} vehicles (${models}) typically indicates: ${description}. Use OEM wiring diagrams and step-by-step diagnostic procedures to isolate the fault before replacing parts.`;
}

export function buildFaultFaqs(makeName: string, code: string, description: string) {
  return [
    {
      q: `What does ${code} mean on a ${makeName}?`,
      a: `${code} on ${makeName} models means: ${description}. Confirm with a live scan and check manufacturer TSBs before repair.`,
    },
    {
      q: `Is it safe to drive with ${code} on a ${makeName}?`,
      a: `Driving with ${code} depends on severity and symptoms. If the check engine light is flashing or you notice power loss, stop driving and diagnose using OEM procedures.`,
    },
    {
      q: `How do I fix ${code} on ${makeName}?`,
      a: `Start with a full system scan, inspect related wiring and connectors, then follow ${makeName}-specific OEM test steps. Auto Fix Data includes factory procedures and wiring diagrams for ${makeName} models.`,
    },
  ];
}
