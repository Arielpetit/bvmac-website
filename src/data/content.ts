// Content layer: real items from www.bvm-ac.org (see real.ts) plus a few
// structured lists that the CMS will manage.

import type { CountryCode } from "@/lib/navigation";
import { BROKERS as REAL_BROKERS, NOTICES as REAL_NOTICES, NEWS as REAL_NEWS, BOC_ARCHIVE as REAL_BOC } from "./real";

export type { Notice, NoticeType, NewsItem, BocEntry, Broker } from "./real";

export const NOTICES = REAL_NOTICES;
export const NEWS = REAL_NEWS;
export const BOC_ARCHIVE = REAL_BOC;
export const BROKERS = REAL_BROKERS;

export const NOTICE_TYPES: Record<import("./real").NoticeType, { fr: string; en: string; es: string }> = {
  avis: { fr: "Avis", en: "Notice", es: "Aviso" },
  communique: { fr: "Communiqué", en: "Release", es: "Comunicado" },
  decision: { fr: "Décision", en: "Decision", es: "Decisión" },
  convocation: { fr: "Convocation", en: "Meeting notice", es: "Convocatoria" },
  ost: { fr: "Opération sur titres", en: "Corporate action", es: "Operación sobre valores" },
};

export const BROKER_TOTALS = REAL_BROKERS.reduce(
  (acc, b) => ({ ...acc, [b.country]: (acc[b.country] ?? 0) + 1 }),
  { CM: 0, CF: 0, CG: 0, GA: 0, GQ: 0, TD: 0 } as Record<CountryCode, number>,
);

export const KEY_FIGURES = {
  listedEquities: 7,
  listedBonds: 31,
  brokers: REAL_BROKERS.length,
  countries: 6,
  capital: 9_073_000_000,
};

export type DocItem = {
  id: string;
  title: string;
  ref?: string;
  body: "CEMAC" | "UMAC" | "COSUMAF" | "BVMAC" | "UEAC";
  category: "regulation" | "report" | "tariff" | "economic";
  year: string;
  url: string;
  language: "FR";
};

const U = "https://www.bvm-ac.org/wp-content/uploads";

// Official texts listed on www.bvm-ac.org ("Textes réglementaires").
export const DOCUMENTS: DocItem[] = [
  { id: "r1", title: "Règlement portant organisation et fonctionnement du marché financier de l’Afrique centrale", ref: "Règlement N°01/22/CEMAC/UMAC/CM/COSUMAF", body: "CEMAC", category: "regulation", year: "2022", url: `${U}/2022/09/Reglment-n%C2%B001-Portant-Organisation-et-Fonctionnement-du-Marche-Financier-de-lAfrique-Centrale.pdf`, language: "FR" },
  { id: "r2", title: "Règlement portant organisation et fonctionnement du marché financier de l’Afrique centrale (23 mai 2023)", ref: "Règlement COSUMAF", body: "COSUMAF", category: "regulation", year: "2023", url: `${U}/2023/10/Reglement-COSUMAF-du-23-mai-2023.pdf`, language: "FR" },
  { id: "r3", title: "Règlement général de la Bourse des Valeurs Mobilières de l’Afrique Centrale", body: "BVMAC", category: "regulation", year: "2025", url: `${U}/2025/04/LE-REGLEMENT-GENERAL-DE-LA-BVMAC.pdf`, language: "FR" },
  { id: "r4", title: "Réglementation des changes dans la CEMAC", ref: "Règlement N°02/18/CEMAC/UMAC/CM", body: "UMAC", category: "regulation", year: "2018", url: `${U}/2019/11/BVMAC-reglement-n02-18-cemac-umac-cm-portant-reglementation-des-changes-dans-la-cemac.pdf`, language: "FR" },
  { id: "r5", title: "Régime d’inscription en compte des valeurs mobilières et autres instruments financiers dans la CEMAC", ref: "Règlement N°01/14/CEMAC-UMAC-CM", body: "UMAC", category: "regulation", year: "2014", url: `${U}/2019/11/BVMAC-reglement-n01-14-cemac-umac-cm-portant-institution-dun-regime-dinscription-en-compte-des-valeurs-mobiles-et-autres-instruments-financiers-dans-la-cemac.pdf`, language: "FR" },
  { id: "r6", title: "Régime fiscal spécifique applicable aux opérations cotées à la BVMAC", ref: "Règlement N°14/07-UEAC-175-CM-15", body: "UEAC", category: "regulation", year: "2007", url: `${U}/2019/11/Reglement-UEAC-Regime-fiscal-BVMAC.pdf`, language: "FR" },
  { id: "r7", title: "Règlement portant organisation, fonctionnement et surveillance du marché financier de l’Afrique centrale (14 mars 2002)", body: "CEMAC", category: "regulation", year: "2002", url: `${U}/2019/11/BVMAC-reglement-portant-organisation-fonctionnement-et-surveillance-du-marche-financier-de-lafrique-centrale.pdf`, language: "FR" },
  { id: "r8", title: "Instruction BVMAC N°1 : conditions d’admission à la BVMAC", body: "BVMAC", category: "regulation", year: "2019", url: `${U}/2019/11/BVMAC-instruction-n1-relative-aux-conditions-dadmission-a-la-bvmac.pdf`, language: "FR" },
  { id: "r9", title: "Instruction BVMAC N°2 : règles de marché", body: "BVMAC", category: "regulation", year: "2019", url: `${U}/2019/11/BVMAC-instruction-n2-relative-aux-regles-de-marche-de-bvmac.pdf`, language: "FR" },
  { id: "t1", title: "Instruction BVMAC N°3 : grille tarifaire de l’entreprise de marché", body: "BVMAC", category: "tariff", year: "2019", url: `${U}/2019/11/BVMAC-instruction-n3-relative-a-la-grille-tarifaire-de-lentreprise-de-marche.pdf`, language: "FR" },
  { id: "t2", title: "Communiqué COSUMAF 01/08 relatif à la tarification du marché financier de l’Afrique centrale", body: "COSUMAF", category: "tariff", year: "2008", url: `${U}/2019/11/BVMAC-communique-cosumaf-o1-08-relatif-a-la-tarification-du-marche-financier-de-lafrique-centrale.pdf`, language: "FR" },
  { id: "e1", title: "Rapport intérimaire de surveillance multilatérale 2017 et perspectives pour 2018", body: "CEMAC", category: "economic", year: "2018", url: "https://www.bvm-ac.org/donnees-economiques/", language: "FR" },
  { id: "e2", title: "Rapport intérimaire de surveillance multilatérale 2015 et perspectives pour 2016", body: "CEMAC", category: "economic", year: "2016", url: "https://www.bvm-ac.org/donnees-economiques/", language: "FR" },
  { id: "p1", title: "Synthèse trimestrielle du Bulletin Officiel de la Cote (avis N°051/2026)", body: "BVMAC", category: "report", year: "2026", url: "https://www.bvm-ac.org/echos-du-marche/avis-n051-2026-bvmac-dg-relatif-a-la-diffusion-dune-synthese-trimestrielle-du-boc/", language: "FR" },
  { id: "p2", title: "Rapports boursiers de la BVMAC", body: "BVMAC", category: "report", year: "2026", url: "https://www.bvm-ac.org/documentations-rapports-boursiers/", language: "FR" },
];
