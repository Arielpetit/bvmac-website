import { NAV } from "@/lib/navigation";
import type { Dictionary } from "@/i18n";
import type { SearchEntry } from "@/components/layout/SearchDialog";
import { EQUITIES } from "@/data/market";
import { DOCUMENTS, NOTICES, NOTICE_TYPES } from "@/data/content";

export function buildSearchIndex(dict: Dictionary): SearchEntry[] {
  const pages: SearchEntry[] = NAV.flatMap((group) =>
    group.items.map((item) => ({ type: "page" as const, title: dict.nav.items[item.key], subtitle: dict.nav[group.key], href: item.href })),
  );
  const securities: SearchEntry[] = EQUITIES.map((e) => ({
    type: "security",
    title: `${e.shortName} – ${e.name}`,
    subtitle: `${e.ticker} · ${e.isin}`,
    href: `/marches/actions/${e.slug}`,
    keywords: e.sector,
  }));
  const notices: SearchEntry[] = NOTICES.map((n) => ({
    type: "notice",
    title: n.title,
    subtitle: `${NOTICE_TYPES[n.type].fr}${n.number ? ` N°${n.number}` : ""} · ${n.date}`,
    href: `/avis-et-communiques/${n.id}`,
    keywords: `${n.issuer ?? ""} ${n.original}`,
  }));
  const documents: SearchEntry[] = DOCUMENTS.map((d) => ({
    type: "document",
    title: d.title,
    subtitle: `${d.body}${d.ref ? ` · ${d.ref}` : ""} · ${d.year}`,
    href: d.category === "regulation" ? "/documentation" : d.category === "tariff" ? "/documentation/tarifs" : d.category === "report" ? "/documentation/rapports" : "/documentation/donnees-economiques",
  }));
  return [...pages, ...securities, ...notices, ...documents];
}
