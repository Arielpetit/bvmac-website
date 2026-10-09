// Equities as published by BVMAC for the session of 8 October 2026
// (www.bvm-ac.org, "Marché des actions"). Histories are illustrative (see series.ts).

import type { CountryCode } from "@/lib/navigation";

/** Market status codes published by BVMAC: NC = no trade in the session; PEq = price at equilibrium (to confirm with BVMAC). */
export type MarketStatus = "NC" | "PEq" | "Suspendu";

export type Equity = {
  ticker: string;
  slug: string;
  name: string;
  shortName: string;
  isin: string;
  country: CountryCode;
  sector: string;
  compartment?: string;
  nominal: number | null;
  /** ISO date, "YYYY-MM" or "YYYY" when only partly known; null when not published. */
  listedOn: string | null;
  lastDividend: { amount: number; date: string };
  referencePrice: number;
  closePrice: number;
  qtyDemanded: number;
  qtyOffered: number;
  qtyTraded: number;
  status: MarketStatus;
  bio: string;
  founded?: string;
  headquarters: string;
};

export const LAST_SESSION = "2026-10-08";

export const EQUITIES: Equity[] = [
  {
    ticker: "BGFI",
    slug: "bgfi-holding",
    name: "BGFI Holding Corporation",
    shortName: "BGFI HC",
    isin: "GA0000010074",
    country: "GA",
    sector: "Banque",
    compartment: "A-Premium",
    nominal: null,
    listedOn: "2026-05-07",
    lastDividend: { amount: 2500, date: "2026-05-18" },
    referencePrice: 89000,
    closePrice: 89000,
    qtyDemanded: 0,
    qtyOffered: 42,
    qtyTraded: 0,
    status: "NC",
    founded: "1971",
    headquarters: "Libreville, Gabon",
    bio: "Née à Libreville en 1971, BGFI Holding Corporation est la société tête du Groupe BGFIBank, premier groupe financier d’Afrique centrale. D’une banque gabonaise, elle est devenue en cinq décennies un groupe international présent dans 12 pays, autour de quatre métiers : banque commerciale, banque de financement des entreprises, banque privée et gestion d’actifs, services financiers spécialisés et assurance. Ses actions sont cotées sur le compartiment A-Premium depuis le 7 mai 2026.",
  },
  {
    ticker: "BANGE",
    slug: "bange",
    name: "Banque Nationale de Guinée Équatoriale",
    shortName: "BANGE",
    isin: "GQ0000010050",
    country: "GQ",
    sector: "Banque",
    nominal: 206220,
    listedOn: null,
    lastDividend: { amount: 4830, date: "2026-07-31" },
    referencePrice: 228085,
    closePrice: 228085,
    qtyDemanded: 0,
    qtyOffered: 40,
    qtyTraded: 0,
    status: "NC",
    founded: "2006",
    headquarters: "Malabo, Guinée équatoriale",
    bio: "La Banque Nationale de Guinée Équatoriale (BANGE) débute ses activités en 2006 avec un capital de 2 milliards FCFA, aux côtés de l’État équato-guinéen, de partenaires techniques et de petits investisseurs privés. Elle a depuis renforcé ses fonds propres à plusieurs reprises et s’est imposée comme une banque de référence du pays.",
  },
  {
    ticker: "SEMC",
    slug: "semc",
    name: "Société des Eaux Minérales du Cameroun",
    shortName: "SEMC",
    isin: "CM0000010009",
    country: "CM",
    sector: "Boissons",
    nominal: 10000,
    listedOn: "2006",
    lastDividend: { amount: 800, date: "2026-06-25" },
    referencePrice: 53000,
    closePrice: 53000,
    qtyDemanded: 25,
    qtyOffered: 0,
    qtyTraded: 0,
    status: "NC",
    founded: "1979",
    headquarters: "Douala, Cameroun",
    bio: "Créée le 16 janvier 1979, filiale des Brasseries du Cameroun, la SEMC produit et distribue depuis 1983 l’eau minérale « Tangui ». Elle fait son entrée en bourse en 2006 dans le cadre d’une offre publique de vente partielle des actions détenues par la Société Nationale d’Investissement du Cameroun.",
  },
  {
    ticker: "SOCAPALM",
    slug: "socapalm",
    name: "Société Camerounaise de Palmeraies",
    shortName: "SOCAPALM",
    isin: "CM0000010025",
    country: "CM",
    sector: "Agro-industrie",
    nominal: 10000,
    listedOn: "2009-04",
    lastDividend: { amount: 2325, date: "2026-07-20" },
    referencePrice: 49500,
    closePrice: 49500,
    qtyDemanded: 150,
    qtyOffered: 1986,
    qtyTraded: 144,
    status: "PEq",
    founded: "1968",
    headquarters: "Douala, Cameroun",
    bio: "Société agro-industrielle créée en 1968, la SOCAPALM est le premier producteur d’huile de palme brute du Cameroun, avec environ 42 % du marché. Elle exploite des plantations dans le Littoral, la Sanaga-Maritime, le Nyong-et-Kéllé, le Moungo et l’Océan, et a intégré la cote en avril 2009 par une augmentation de capital par appel public à l’épargne.",
  },
  {
    ticker: "SAFACAM",
    slug: "safacam",
    name: "Société Africaine Forestière et Agricole du Cameroun",
    shortName: "SAFACAM",
    isin: "CM0000010017",
    country: "CM",
    sector: "Agro-industrie",
    nominal: 5000,
    listedOn: "2008",
    lastDividend: { amount: 2200, date: "2026-07-20" },
    referencePrice: 38500,
    closePrice: 38500,
    qtyDemanded: 423,
    qtyOffered: 6,
    qtyTraded: 6,
    status: "PEq",
    founded: "1962",
    headquarters: "Dizangué, Cameroun",
    bio: "L’origine de SAFACAM remonte à 1897 sur la rive droite de la Sanaga, à Dizangué. La société voit le jour sous ce nom en 1962 et produit du caoutchouc naturel et de l’huile de palme. Elle entre en bourse en 2008 par une offre publique de vente de la Société Nationale d’Investissement.",
  },
  {
    ticker: "REGIONALE",
    slug: "la-regionale",
    name: "La Régionale d’Épargne et de Crédit",
    shortName: "La Régionale",
    isin: "CM0000010041",
    country: "CM",
    sector: "Microfinance",
    nominal: 10000,
    listedOn: null,
    lastDividend: { amount: 894, date: "2024-09-18" },
    referencePrice: 38000,
    closePrice: 38000,
    qtyDemanded: 0,
    qtyOffered: 170,
    qtyTraded: 0,
    status: "NC",
    founded: "1993",
    headquarters: "Yaoundé, Cameroun",
    bio: "Établissement de microfinance de deuxième catégorie créé en 1993, La Régionale est un acteur majeur de la microfinance au Cameroun : collecte de l’épargne, crédit à la consommation, à l’habitat et au monde rural, financement des PME, transferts et micro-assurance, avec un réseau de plus de 40 agences.",
  },
  {
    ticker: "SCG-RE",
    slug: "scg-re",
    name: "Société Commerciale Gabonaise de Réassurance",
    shortName: "SCG-Ré",
    isin: "GA0000010066",
    country: "GA",
    sector: "Réassurance",
    nominal: 10000,
    listedOn: null,
    lastDividend: { amount: 433, date: "2025-10-22" },
    referencePrice: 20000,
    closePrice: 20000,
    qtyDemanded: 19,
    qtyOffered: 104,
    qtyTraded: 4,
    status: "PEq",
    founded: "2012",
    headquarters: "Libreville, Gabon",
    bio: "Créée en 2012 à l’initiative de l’État gabonais et des compagnies d’assurance du pays, SCG-Ré illustre le partenariat public-privé. Elle gère pour le compte de l’État la cession légale sur les primes des assureurs agréés au Gabon et souscrit de la réassurance commerciale au Gabon et en Afrique.",
  },
];

export function changePct(e: Pick<Equity, "referencePrice" | "closePrice">): number {
  return ((e.closePrice - e.referencePrice) / e.referencePrice) * 100;
}

export const MARKET_SUMMARY = {
  date: LAST_SESSION,
  valueTraded: 7_517_000,
  equityCapitalisation: 1_795_850_543_600,
  bondOutstanding: 1_226_606_149_540,
  listedEquities: 7,
  listedBonds: 31,
  securitiesTraded: 3,
};

export type CorporateAction = {
  id: string;
  date: string;
  endDate?: string;
  type: "dividende" | "coupon" | "remboursement" | "ag" | "introduction" | "souscription";
  issuer: string;
  detail: string;
  notice?: string;
};

// Operations announced in BVMAC notices and news (2025-2026).
export const AGENDA: CorporateAction[] = [
  { id: "a1", date: "2026-10-22", type: "ag", issuer: "SCG-Ré", detail: "Assemblée générale ordinaire (convocation par l’avis N°057/2026)", notice: "057-2026" },
  { id: "a2", date: "2026-11-02", type: "introduction", issuer: "RENAPROV Finance S.A.", detail: "Introduction en bourse autorisée par la décision CAD/05-08-2026/04 (date de cotation à confirmer)", notice: "059-2026" },
  { id: "a3", date: "2026-08-05", type: "remboursement", issuer: "AFCMR", detail: "Amortissement du principal et paiement des intérêts « AFCMR à tranches multiples 2023-2028 »", notice: "055-2026" },
  { id: "a4", date: "2026-07-31", type: "dividende", issuer: "BANGE", detail: "Paiement du dividende de l’exercice 2025 : 4 830 FCFA par action", notice: "053-2026" },
  { id: "a5", date: "2026-07-20", type: "dividende", issuer: "SOCAPALM", detail: "Paiement du dividende de l’exercice 2025 : 2 325 FCFA par action", notice: "049-2026" },
  { id: "a6", date: "2026-07-20", type: "dividende", issuer: "SAFACAM", detail: "Paiement du dividende de l’exercice 2025 : 2 200 FCFA par action", notice: "048-2026" },
  { id: "a7", date: "2026-07-06", type: "coupon", issuer: "État du Gabon", detail: "Amortissement et intérêts « EOG multi-tranches 2024-2030 »", notice: "047-2026" },
  { id: "a8", date: "2026-06-25", type: "dividende", issuer: "SEMC", detail: "Paiement du dividende de l’exercice 2025 : 800 FCFA par action", notice: "043-2026" },
  { id: "a9", date: "2026-06-24", type: "coupon", issuer: "ACEP Cameroun", detail: "Amortissement et intérêts « ACEP 7 % brut 2024-2027 »", notice: "041-2026" },
  { id: "a10", date: "2026-06-05", type: "remboursement", issuer: "État du Cameroun", detail: "Amortissement et intérêts « ECMR 2023 à tranches multiples »", notice: "039-2026" },
  { id: "a11", date: "2026-05-07", type: "introduction", issuer: "BGFI Holding Corporation", detail: "Première cotation sur le compartiment A-Premium" },
  { id: "a12", date: "2026-02-25", endDate: "2026-05-25", type: "souscription", issuer: "État du Gabon", detail: "Souscription à l’emprunt « EOG 2026 à tranches multiples » (85 milliards FCFA)" },
  { id: "a13", date: "2025-12-15", endDate: "2026-03-15", type: "souscription", issuer: "RENAPROV", detail: "Souscription à l’introduction en bourse : 400 000 actions à 21 000 FCFA" },
];
