// BVMAC AI — content index.
//
// Collects every searchable piece of the site (pages, securities, bonds,
// notices, news, documents, brokers, glossary, agenda, lessons) into a flat
// list of entries. Each entry carries a short `description` for the UI link,
// `keywords` for retrieval and a longer `content` snippet that is sent to the
// LLM as grounding context. Built server-side from the static data layer.

import { NAV } from "@/lib/navigation";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { EQUITIES, AGENDA } from "@/data/market";
import { NOTICES, NEWS, DOCUMENTS, BROKERS, NOTICE_TYPES } from "@/data/content";
import { BONDS } from "@/data/real";
import { GLOSSARY, LESSONS, PATHS } from "@/data/school";
import { COUNTRIES } from "@/lib/navigation";

export type AiEntryType =
  | "page"
  | "security"
  | "bond"
  | "notice"
  | "news"
  | "document"
  | "broker"
  | "glossary"
  | "agenda"
  | "lesson";

export type AiEntry = {
  id: string;
  type: AiEntryType;
  title: string;
  description: string;
  href: string;
  keywords: string;
  content: string;
};

const countryName = (code: string, locale: Locale) => COUNTRIES.find((c) => c.code === code)?.[locale] ?? code;

export function buildAiIndex(locale: Locale, dict: Dictionary): AiEntry[] {
  const entries: AiEntry[] = [];

  // Static pages from the navigation tree.
  for (const group of NAV) {
    for (const item of group.items) {
      entries.push({
        id: `page-${item.href}`,
        type: "page",
        title: dict.nav.items[item.key],
        description: dict.nav[group.key],
        href: item.href,
        keywords: `${dict.nav[group.key]} ${dict.nav.items[item.key]}`,
        content: `${dict.nav.items[item.key]} — ${dict.nav[group.key]}. ${group.feature.text[locale]}`,
      });
    }
  }

  // Listed equities.
  for (const e of EQUITIES) {
    entries.push({
      id: `security-${e.slug}`,
      type: "security",
      title: `${e.shortName} (${e.ticker})`,
      description: `${e.sector} · ${countryName(e.country, locale)} · ${e.closePrice.toLocaleString("fr-FR")} FCFA`,
      href: `/marches/actions/${e.slug}`,
      keywords: `${e.ticker} ${e.name} ${e.shortName} ${e.isin} ${e.sector} ${countryName(e.country, locale)}`,
      content: `${e.name} (${e.ticker}, ISIN ${e.isin}). Secteur : ${e.sector}. Pays : ${countryName(e.country, locale)}. Dernier cours : ${e.closePrice.toLocaleString("fr-FR")} FCFA. Dernier dividende : ${e.lastDividend.amount.toLocaleString("fr-FR")} FCFA (${e.lastDividend.date}). ${e.bio}`,
    });
  }

  // Bonds.
  for (const b of BONDS) {
    entries.push({
      id: `bond-${b.isin}`,
      type: "bond",
      title: b.name,
      description: `${b.issuer} · ${countryName(b.country, locale)}${b.maturity ? ` · échéance ${b.maturity}` : ""}`,
      href: "/marches/obligations",
      keywords: `${b.name} ${b.issuer} ${b.isin} ${countryName(b.country, locale)}`,
      content: `Obligation « ${b.name} » émise par ${b.issuer} (${countryName(b.country, locale)}). Cours : ${b.close} % du nominal. Coupon couru : ${b.accrued}.${b.maturity ? ` Échéance : ${b.maturity}.` : ""}`,
    });
  }

  // Notices and communiqués.
  for (const n of NOTICES) {
    entries.push({
      id: `notice-${n.id}`,
      type: "notice",
      title: n.title,
      description: `${NOTICE_TYPES[n.type].fr}${n.number ? ` N°${n.number}` : ""} · ${n.date}${n.issuer ? ` · ${n.issuer}` : ""}`,
      href: `/avis-et-communiques/${n.id}`,
      keywords: `${n.issuer ?? ""} ${n.original} ${n.title}`,
      content: `${n.original}${n.issuer ? ` — ${n.issuer}` : ""}. Date : ${n.date}.`,
    });
  }

  // News.
  for (const a of NEWS) {
    entries.push({
      id: `news-${a.slug}`,
      type: "news",
      title: a.title,
      description: `${a.category} · ${a.date}`,
      href: `/actualites/${a.slug}`,
      keywords: `${a.category} ${a.title} ${a.excerpt}`,
      content: `${a.title}. ${a.excerpt}`,
    });
  }

  // Documents / regulation.
  for (const d of DOCUMENTS) {
    entries.push({
      id: `document-${d.id}`,
      type: "document",
      title: d.title,
      description: `${d.body} · ${d.year}`,
      href: d.category === "regulation" ? "/documentation" : d.category === "tariff" ? "/documentation/tarifs" : d.category === "report" ? "/documentation/rapports" : "/documentation/donnees-economiques",
      keywords: `${d.title} ${d.ref ?? ""} ${d.body}`,
      content: `${d.title}${d.ref ? ` (${d.ref})` : ""}. ${d.body}, ${d.year}.`,
    });
  }

  // Brokers.
  for (const b of BROKERS) {
    entries.push({
      id: `broker-${b.name}`,
      type: "broker",
      title: b.name,
      description: `${b.city}, ${countryName(b.country, locale)}`,
      href: "/participants/societes-de-bourse",
      keywords: `${b.name} ${b.city} ${countryName(b.country, locale)} ${b.approval}`,
      content: `${b.name} — société de bourse à ${b.city} (${countryName(b.country, locale)}). Agrément ${b.approval}. ${b.address}`,
    });
  }

  // Glossary.
  for (const g of GLOSSARY) {
    entries.push({
      id: `glossary-${g.term}`,
      type: "glossary",
      title: g.term,
      description: g.def,
      href: "/ecole-de-bourse/glossaire",
      keywords: `${g.term} ${g.def}`,
      content: `${g.term} : ${g.def}`,
    });
  }

  // Corporate actions / agenda.
  for (const a of AGENDA) {
    entries.push({
      id: `agenda-${a.id}`,
      type: "agenda",
      title: a.detail,
      description: `${a.type} · ${a.date}${a.issuer ? ` · ${a.issuer}` : ""}`,
      href: "/marches/agenda",
      keywords: `${a.issuer} ${a.detail} ${a.type}`,
      content: `${a.detail} (${a.type}). ${a.issuer ?? ""}. Date : ${a.date}.`,
    });
  }

  // School paths and lessons.
  for (const p of PATHS) {
    entries.push({
      id: `path-${p.slug}`,
      type: "lesson",
      title: p.title,
      description: p.text,
      href: `/ecole-de-bourse/parcours/${p.slug}`,
      keywords: `${p.title} ${p.text}`,
      content: `${p.title} : ${p.text}`,
    });
  }
  for (const l of LESSONS) {
    entries.push({
      id: `lesson-${l.slug}`,
      type: "lesson",
      title: l.title,
      description: `${l.minutes} min`,
      href: `/ecole-de-bourse/lecon/${l.slug}`,
      keywords: `${l.title} ${l.sections.map((s) => s.h).join(" ")}`,
      content: `${l.title}. ${l.sections.map((s) => `${s.h} : ${s.p}`).join(" ")}`,
    });
  }

  return entries;
}
