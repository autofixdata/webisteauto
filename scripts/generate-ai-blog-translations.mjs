#!/usr/bin/env node
/**
 * Generates FR/DE MDX from EN AI blog posts.
 * Run: node scripts/generate-ai-blog-translations.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const EN_DIR = path.join(ROOT, 'src/content/blog/en');

const SLUGS = [
  'haynespro-ai-features-2026',
  'haynespro-ai-wiring-diagram-search',
  'haynespro-pricing-ai-premium-2026',
  'haynespro-vs-alldata-ai-era',
  'haynespro-ai-european-workshops',
  'haynespro-workshopdata-ai-login-guide',
  'alldata-ai-repair-assistant-2026',
  'alldata-manage-ai-features-explained',
  'alldata-ai-tsb-diagnostics-guide',
  'alldata-pricing-vs-ai-bundles-2026',
  'alldata-ai-us-workshops-guide',
  'autodata-ai-diagnostic-tools-2026',
  'autodata-ai-labour-times-pricing-2026',
  'autodata-ev-ai-service-data',
  'autodata-ai-mot-preparation-2026',
  'best-ai-workshop-software-2026',
  'ai-ready-workshop-data-bundle-guide',
];

const META = {
  fr: {
    author: 'Auto Fix Data Editorial',
    cta: 'Essai gratuit 7 jours →',
    ctaTitle: 'Essayez AutoFixData gratuitement',
    quickSummary: '⚡ Résumé Rapide',
    related: '📚 Articles connexes',
    readTime: (n) => `${n} min de lecture`,
  },
  de: {
    author: 'Auto Fix Data Editorial',
    cta: '7-Tage-Test starten →',
    ctaTitle: 'AutoFixData kostenlos testen',
    quickSummary: '⚡ Kurzfassung',
    related: '📚 Verwandte Artikel',
    readTime: (n) => `${n} Min. Lesezeit`,
  },
};

// Per-slug translations: title, excerpt, h1, summaryHtml, bodyHtml (main sections as HTML)
const T = {
  'best-ai-workshop-software-2026': {
    fr: {
      title: 'Meilleur logiciel atelier IA 2026 : HaynesPro vs ALLDATA vs AutoData',
      excerpt: 'Comparatif 2026 des meilleurs logiciels atelier IA — HaynesPro, ALLDATA, AutoData, Mitchell1 et bundles. Fonctions, prix et choix pour votre garage.',
      h1: 'Meilleur logiciel atelier IA 2026 : HaynesPro vs ALLDATA vs AutoData',
      summary: 'Aucune plateforme IA ne couvre tous les cas. HaynesPro = câblage EU ; ALLDATA = OEM/TSB US ; AutoData = main-d\'œuvre/MOT/VE. Meilleur rapport : les 5 plateformes sur <a href="/fr/free-trial">AutoFixData</a> (99–140 €/mois).',
      mins: 12,
    },
    de: {
      title: 'Beste KI-Werkstattsoftware 2026: HaynesPro vs ALLDATA vs AutoData',
      excerpt: 'Vergleich 2026: HaynesPro, ALLDATA, AutoData, Mitchell1 und Bundles. Funktionen, Preise und die besten KI-Tools für Ihre Werkstatt.',
      h1: 'Beste KI-Werkstattsoftware 2026: HaynesPro vs ALLDATA vs AutoData',
      summary: 'Keine einzelne KI-Plattform deckt alles ab. HaynesPro = EU-Verkabelung; ALLDATA = US-OEM/TSB; AutoData = Arbeit/MOT/EV. Bestes Preis-Leistungs: fünf Plattformen über <a href="/de/free-trial">AutoFixData</a> (99–140 £/Monat).',
      mins: 12,
    },
  },
  'ai-ready-workshop-data-bundle-guide': {
    fr: {
      title: 'Données atelier IA : ALLDATA, HaynesPro et AutoData en un seul bundle',
      excerpt: 'Bundle de données atelier IA — ALLDATA, HaynesPro, AutoData, Mitchell1, Identifix en une connexion. Comparatif des coûts et essai gratuit.',
      h1: 'Données atelier IA : ALLDATA, HaynesPro et AutoData en un bundle',
      summary: 'AutoFixData = 5 plateformes, 1 login, 99–140 €/mois, essai 7 jours. Remplace 250 €+/mois en abonnements séparés.',
      mins: 11,
    },
    de: {
      title: 'KI-bereite Werkstattdaten: ALLDATA, HaynesPro & AutoData im Bundle',
      excerpt: 'KI-Werkstattdaten-Bundle — ALLDATA, HaynesPro, AutoData, Mitchell1, Identifix in einem Login. Kostenvergleich und Gratis-Test.',
      h1: 'KI-bereite Werkstattdaten: ALLDATA, HaynesPro & AutoData im Bundle',
      summary: 'AutoFixData = 5 Plattformen, 1 Login, 99–140 £/Monat, 7-Tage-Test. Ersetzt 250+ £/Monat bei Einzelabos.',
      mins: 11,
    },
  },
  'haynespro-ai-features-2026': {
    fr: {
      title: 'Fonctions IA HaynesPro 2026 : nouveautés WorkshopData',
      excerpt: 'Fonctions IA HaynesPro 2026 — recherche intelligente, câblage et temps de main-d\'œuvre. Roadmap WorkshopData et préparation des ateliers.',
      h1: 'Fonctions IA HaynesPro 2026 : nouveautés WorkshopData',
      summary: 'La roadmap IA HaynesPro 2026 cible la recherche en langage naturel et la navigation schémas — pas un diagnostic autonome. Combinez HaynesPro avec ALLDATA et AutoData via <a href="/fr/free-trial">AutoFixData</a>.',
      mins: 10,
    },
    de: {
      title: 'HaynesPro KI-Funktionen 2026: Was kommt bei WorkshopData?',
      excerpt: 'HaynesPro KI 2026 — intelligente Suche, Verkabelung und Arbeitshinweise. Roadmap und Vorbereitung für Werkstätten.',
      h1: 'HaynesPro KI-Funktionen 2026: Was kommt bei WorkshopData?',
      summary: 'HaynesPro KI 2026 fokussiert natürliche Suche und Schaltplan-Navigation — kein autonomer Diagnostiker. Kombinieren Sie HaynesPro mit ALLDATA und AutoData über <a href="/de/free-trial">AutoFixData</a>.',
      mins: 10,
    },
  },
  'alldata-ai-repair-assistant-2026': {
    fr: {
      title: 'Assistant IA ALLDATA 2026 : fonctions, limites et roadmap',
      excerpt: 'Assistant réparation IA ALLDATA 2026 — recherche intelligente, TSB et intégration atelier. Fonctions et limites pour garages US.',
      h1: 'Assistant IA ALLDATA 2026 : fonctions, limites et roadmap',
      summary: 'ALLDATA IA = découverte OEM et TSB. Idéal véhicules US/JP. Accédez à ALLDATA + HaynesPro + AutoData sur <a href="/fr/free-trial">AutoFixData</a>.',
      mins: 10,
    },
    de: {
      title: 'ALLDATA KI-Reparaturassistent 2026: Funktionen, Grenzen & Roadmap',
      excerpt: 'ALLDATA KI-Assistent 2026 — intelligente Suche, TSB und Werkstatt-Workflow. Funktionen und Grenzen für US-Werkstätten.',
      h1: 'ALLDATA KI-Reparaturassistent 2026: Funktionen, Grenzen & Roadmap',
      summary: 'ALLDATA KI = OEM- und TSB-Suche. Ideal für US/JP-Fahrzeuge. ALLDATA + HaynesPro + AutoData über <a href="/de/free-trial">AutoFixData</a>.',
      mins: 10,
    },
  },
  'autodata-ai-diagnostic-tools-2026': {
    fr: {
      title: 'Outils diagnostic IA AutoData 2026 : main-d\'œuvre, MOT et pannes',
      excerpt: 'Outils diagnostic IA AutoData 2026 — temps de main-d\'œuvre, préparation MOT et prédiction de pannes pour ateliers UK/UE.',
      h1: 'Outils diagnostic IA AutoData 2026 : main-d\'œuvre, MOT et pannes',
      summary: 'AutoData IA excelle en données service UE, main-d\'œuvre et MOT. Câblage : HaynesPro ; TSB US : ALLDATA. Tout sur <a href="/fr/free-trial">AutoFixData</a>.',
      mins: 10,
    },
    de: {
      title: 'AutoData KI-Diagnose-Tools 2026: Arbeit, MOT & Fehler',
      excerpt: 'AutoData KI-Diagnose 2026 — Arbeitszeiten, MOT-Vorbereitung und Fehlerhilfe für UK/EU-Werkstätten.',
      h1: 'AutoData KI-Diagnose-Tools 2026: Arbeit, MOT & Fehler',
      summary: 'AutoData KI führt bei EU-Service, Arbeit und MOT. Verkabelung: HaynesPro; US-TSB: ALLDATA. Alles über <a href="/de/free-trial">AutoFixData</a>.',
      mins: 10,
    },
  },
  'haynespro-pricing-ai-premium-2026': {
    fr: {
      title: 'Prix HaynesPro 2026 : l\'IA augmentera-t-elle votre facture ?',
      excerpt: 'Tarifs HaynesPro 2026 avec IA — coûts WorkshopData, niveaux premium et comparaison avec un bundle ALLDATA + HaynesPro.',
      h1: 'Prix HaynesPro 2026 : l\'IA augmentera-t-elle votre facture ?',
      summary: 'L\'IA HaynesPro peut ajouter 10–20 €/mois. AutoFixData (99–140 €/mois) coûte souvent moins que HaynesPro + ALLDATA séparés.',
      mins: 9,
    },
    de: {
      title: 'HaynesPro Preise 2026: Erhöhen KI-Funktionen Ihre Rechnung?',
      excerpt: 'HaynesPro Preise 2026 mit KI — WorkshopData-Kosten, Premium-Tiers und Vergleich mit ALLDATA + HaynesPro Bundle.',
      h1: 'HaynesPro Preise 2026: Erhöhen KI-Funktionen Ihre Rechnung?',
      summary: 'HaynesPro KI kann 10–20 £/Monat extra kosten. AutoFixData (99–140 £/Monat) ist oft günstiger als HaynesPro + ALLDATA einzeln.',
      mins: 9,
    },
  },
  'alldata-pricing-vs-ai-bundles-2026': {
    fr: {
      title: 'Prix ALLDATA vs bundles IA : comparatif coûts 2026',
      excerpt: 'Prix ALLDATA vs bundles IA 2026 — Repair, Manage, tiers IA et quand AutoFixData coûte moins cher qu\'ALLDATA + HaynesPro + AutoData.',
      h1: 'Prix ALLDATA vs bundles IA : comparatif coûts 2026',
      summary: 'ALLDATA Repair ~99–110 €/mois. Empiler ALLDATA + HaynesPro + AutoData = 200 €+/mois. Bundle AutoFixData : 99–140 €/mois pour 5 plateformes.',
      mins: 9,
    },
    de: {
      title: 'ALLDATA Preise vs KI-Bundles: Kostenvergleich 2026',
      excerpt: 'ALLDATA Preise vs KI-Bundles 2026 — Repair, Manage, KI-Tiers und wann AutoFixData günstiger ist als Einzelabos.',
      h1: 'ALLDATA Preise vs KI-Bundles: Kostenvergleich 2026',
      summary: 'ALLDATA Repair ~99–110 £/Monat. ALLDATA + HaynesPro + AutoData einzeln = 200+ £/Monat. AutoFixData-Bundle: 99–140 £/Monat für 5 Plattformen.',
      mins: 9,
    },
  },
  'autodata-ai-labour-times-pricing-2026': {
    fr: {
      title: 'Temps de main-d\'œuvre IA AutoData et tarification : devis précis',
      excerpt: 'Temps de main-d\'œuvre IA AutoData 2026 — devis précis, opérations liées et éviter la sous-facturation en réparation européenne.',
      h1: 'Temps de main-d\'œuvre IA AutoData et tarification : devis précis',
      summary: 'Utilisez AutoData IA pour la vitesse ; appliquez votre taux horaire. Accès AutoData + HaynesPro + ALLDATA sur <a href="/fr/pricing">AutoFixData</a>.',
      mins: 9,
    },
    de: {
      title: 'AutoData KI-Arbeitszeiten & Preise: Jobs genau kalkulieren',
      excerpt: 'AutoData KI-Arbeitszeiten 2026 — präzise Angebote, verknüpfte Operationen und keine Unterpreisung bei EU-Reparaturen.',
      h1: 'AutoData KI-Arbeitszeiten & Preise: Jobs genau kalkulieren',
      summary: 'AutoData KI für Geschwindigkeit; Ihr Stundensatz für Marge. AutoData + HaynesPro + ALLDATA über <a href="/de/pricing">AutoFixData</a>.',
      mins: 9,
    },
  },
};

function buildMdx(slug, lang, data) {
  const m = META[lang];
  const prefix = `/${lang}`;
  const tags = lang === 'fr'
    ? ['HaynesPro', 'IA', 'Logiciel Atelier']
    : ['HaynesPro', 'KI', 'Werkstattsoftware'];

  return `---
title: "${data.title.replace(/"/g, '\\"')}"
excerpt: "${data.excerpt.replace(/"/g, '\\"')}"
date: "2026-07-05"
author: "${m.author}"
readTime: "${m.readTime(data.mins)}"
image: "/images/diagnostics-abstract.png"
tags: ${JSON.stringify(tags)}
---

<h1>${data.h1}</h1>

<p>${data.excerpt}</p>

<div style={{background:"#fff8e1", borderLeft:"4px solid #f4b400", padding:"16px 20px", borderRadius:"6px", margin:"24px 0"}}>
<strong>${m.quickSummary}</strong><br/>
${data.summary}
</div>

<h2>${lang === 'fr' ? 'Pourquoi l\'IA compte en 2026' : 'Warum KI 2026 zählt'}</h2>

<p>${lang === 'fr'
    ? 'Les ateliers indépendants cherchent des gains de temps sans sacrifier la fiabilité OEM. L\'IA accélère la recherche — elle ne remplace ni l\'outil de diagnostic ni le jugement du technicien.'
    : 'Unabhängige Werkstätten wollen Zeit sparen ohne OEM-Qualität zu opfern. KI beschleunigt die Suche — ersetzt weder Scan-Tool noch Techniker-Urteil.'}</p>

<h2>${lang === 'fr' ? 'HaynesPro, ALLDATA et AutoData' : 'HaynesPro, ALLDATA und AutoData'}</h2>

<ul>
<li><strong>HaynesPro</strong> — ${lang === 'fr' ? 'schémas couleur et véhicules européens' : 'Farb-Schaltpläne und EU-Fahrzeuge'}</li>
<li><strong>ALLDATA</strong> — ${lang === 'fr' ? 'données OEM et TSB pour marché US' : 'OEM-Daten und TSB für US-Markt'}</li>
<li><strong>AutoData</strong> — ${lang === 'fr' ? 'main-d\'œuvre, MOT et service VE' : 'Arbeit, MOT und EV-Service'}</li>
</ul>

<p>${lang === 'fr'
    ? `Consultez le <a href="${prefix}/blog/best-ai-workshop-software-2026">guide comparatif IA</a> et le <a href="${prefix}/blog/ai-ready-workshop-data-bundle-guide">guide bundle</a>.`
    : `Siehe <a href="${prefix}/blog/best-ai-workshop-software-2026">KI-Vergleich</a> und <a href="${prefix}/blog/ai-ready-workshop-data-bundle-guide">Bundle-Guide</a>.`}</p>

<h2>${lang === 'fr' ? 'Questions fréquentes' : 'Häufige Fragen'}</h2>

<h3>${lang === 'fr' ? 'Une seule plateforme IA suffit-elle ?' : 'Reicht eine KI-Plattform?'}</h3>
<p>${lang === 'fr'
    ? 'Non pour un parc mixte. HaynesPro, ALLDATA et AutoData couvrent des domaines différents — un bundle les réunit.'
    : 'Nein bei gemischter Flotte. HaynesPro, ALLDATA und AutoData decken unterschiedliche Bereiche ab — ein Bundle vereint sie.'}</p>

<h3>${lang === 'fr' ? 'Comment tester gratuitement ?' : 'Wie kostenlos testen?'}</h3>
<p>${lang === 'fr'
    ? `<a href="${prefix}/free-trial">Essai gratuit 7 jours AutoFixData</a> — HaynesPro, ALLDATA, AutoData, Mitchell1 et Identifix inclus.`
    : `<a href="${prefix}/free-trial">7-Tage AutoFixData-Test</a> — HaynesPro, ALLDATA, AutoData, Mitchell1 und Identifix inklusive.`}</p>

<h3>${lang === 'fr' ? 'L\'IA remplace-t-elle les données OEM ?' : 'Ersetzt KI OEM-Daten?'}</h3>
<p>${lang === 'fr'
    ? 'Non. L\'IA indexe des données sous licence — la qualité dépend du bon véhicule sélectionné et des tests réels.'
    : 'Nein. KI durchsucht lizenzierte Daten — Qualität hängt von korrekter Fahrzeugauswahl und echten Tests ab.'}</p>

<h2>${lang === 'fr' ? 'Conclusion' : 'Fazit'}</h2>

<p>${lang === 'fr'
    ? 'Préparez votre atelier avec un stack IA-ready : plusieurs sources, une facture, un essai gratuit.'
    : 'Bereiten Sie Ihre Werkstatt mit KI-ready Stack vor: mehrere Quellen, eine Rechnung, ein Gratis-Test.'}</p>

<div style={{background:"#0a1628", color:"#fff", padding:"28px", borderRadius:"12px", textAlign:"center", margin:"32px 0"}}>
<h3 style={{color:"#f4b400", marginBottom:"12px"}}>${m.ctaTitle}</h3>
<a href="${prefix}/free-trial" style={{background:"#f4b400", color:"#000", padding:"14px 32px", borderRadius:"8px", fontWeight:"800", textDecoration:"none", display:"inline-block"}}>${m.cta}</a>
</div>

<div style={{background:"#f8fafc", border:"1px solid #e2e8f0", padding:"20px", borderRadius:"10px", margin:"32px 0"}}>
<strong>${m.related}</strong>
<ul>
<li><a href="${prefix}/blog/best-ai-workshop-software-2026">${lang === 'fr' ? 'Meilleur logiciel IA 2026' : 'Beste KI-Software 2026'}</a></li>
<li><a href="${prefix}/blog/ai-ready-workshop-data-bundle-guide">${lang === 'fr' ? 'Guide bundle IA' : 'KI-Bundle-Guide'}</a></li>
<li><a href="${prefix}/haynes-pro">HaynesPro</a> · <a href="${prefix}/alldata">ALLDATA</a> · <a href="${prefix}/autodata">AutoData</a></li>
<li><a href="${prefix}/pricing">${lang === 'fr' ? 'Tarifs' : 'Preise'}</a></li>
</ul>
</div>
`;
}

// Fill missing slug translations from EN excerpt pattern
for (const slug of SLUGS) {
  if (!T[slug]) {
    const en = fs.readFileSync(path.join(EN_DIR, `${slug}.mdx`), 'utf8');
    const titleM = en.match(/^title: "(.+)"$/m);
    const excerptM = en.match(/^excerpt: "(.+)"$/m);
    const title = titleM?.[1] ?? slug;
    const excerpt = excerptM?.[1] ?? '';
    T[slug] = {
      fr: {
        title: title.replace(/2026/g, '2026').replace(/AI/g, 'IA').replace(/Workshop/g, 'Atelier'),
        excerpt: excerpt.slice(0, 160),
        h1: title.replace(/AI/g, 'IA'),
        summary: `Combinez HaynesPro, ALLDATA et AutoData sur <a href="/fr/free-trial">AutoFixData</a> — essai 7 jours.`,
        mins: 9,
      },
      de: {
        title: title.replace(/AI/g, 'KI'),
        excerpt: excerpt.slice(0, 160),
        h1: title.replace(/AI/g, 'KI'),
        summary: `HaynesPro, ALLDATA und AutoData über <a href="/de/free-trial">AutoFixData</a> — 7-Tage-Test.`,
        mins: 9,
      },
    };
  }
}

let count = 0;
for (const slug of SLUGS) {
  for (const lang of ['fr', 'de']) {
    const outDir = path.join(ROOT, `src/content/blog/${lang}`);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${slug}.mdx`);
    fs.writeFileSync(outPath, buildMdx(slug, lang, T[slug][lang]));
    count++;
  }
}
console.log(`✓ Generated ${count} FR/DE translation files`);
