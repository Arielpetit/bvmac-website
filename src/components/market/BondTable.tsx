"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Download, Search } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { formatNumber } from "@/lib/format";
import { COUNTRIES } from "@/lib/navigation";
import type { Bond } from "@/data/real";
import { NOTICES } from "@/data/content";
import { Flag } from "@/components/ui/Flag";
import { Sheet } from "@/components/ui/Sheet";
import { EmptyState } from "@/components/ui/States";
import { PriceChange } from "@/components/ui/PriceChange";
import { cn } from "@/lib/cn";
import { tc } from "@/i18n/content";

const L = {
  fr: { search: "Rechercher une ligne, un émetteur, un ISIN", issuer: "Émetteur", allIssuers: "Tous les émetteurs", line: "Ligne", country: "Pays", ref: "Cours de réf. (%)", close: "Clôture (%)", accrued: "Coupon couru", maturity: "Échéance", status: "Statut", count: "lignes", nominal: "Nominal", period: "Période", demanded: "Qté demandée", offered: "Qté offerte", traded: "Qté transigée", notices: "Avis liés", none: "Aucun avis récent lié à cette ligne.", priceNote: "Le cours d’une obligation s’exprime en pourcentage de sa valeur nominale.", open: "Détails" },
  en: { search: "Search a line, an issuer, an ISIN", issuer: "Issuer", allIssuers: "All issuers", line: "Line", country: "Country", ref: "Ref. price (%)", close: "Close (%)", accrued: "Accrued coupon", maturity: "Maturity", status: "Status", count: "lines", nominal: "Nominal", period: "Period", demanded: "Qty bid", offered: "Qty offered", traded: "Qty traded", notices: "Related notices", none: "No recent notice for this line.", priceNote: "A bond price is expressed as a percentage of its nominal value.", open: "Details" },
  es: { search: "Buscar una línea, un emisor, un ISIN", issuer: "Emisor", allIssuers: "Todos los emisores", line: "Línea", country: "País", ref: "Precio ref. (%)", close: "Cierre (%)", accrued: "Cupón corrido", maturity: "Vencimiento", status: "Estado", count: "líneas", nominal: "Nominal", period: "Periodo", demanded: "Cant. demandada", offered: "Cant. ofrecida", traded: "Cant. negociada", notices: "Avisos relacionados", none: "Ningún aviso reciente para esta línea.", priceNote: "El precio de una obligación se expresa en porcentaje de su valor nominal.", open: "Detalles" },
};

type SortKey = "name" | "issuer" | "close" | "accrued" | "maturity";

export function BondTable({ bonds, asOf }: { bonds: Bond[]; asOf: string }) {
  const { locale, dict } = useI18n();
  const t = L[locale];
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [issuer, setIssuer] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "maturity", dir: "asc" });
  const [selected, setSelected] = useState<Bond | null>(null);
  const issuers = useMemo(() => [...new Set(bonds.map((b) => b.issuer))].sort(), [bonds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = bonds.filter((b) => (!country || b.country === country) && (!issuer || b.issuer === issuer) && (!q || `${b.name} ${b.issuer} ${b.isin}`.toLowerCase().includes(q)));
    const v = (b: Bond) => (sort.key === "name" ? b.name : sort.key === "issuer" ? b.issuer : sort.key === "maturity" ? b.maturity ?? "9999" : b[sort.key]);
    return list.sort((a, b) => {
      const va = v(a), vb = v(b);
      const cmp = typeof va === "string" ? va.localeCompare(String(vb)) : va - Number(vb);
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [bonds, query, country, issuer, sort]);

  const toggle = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  const head = (key: SortKey, label: string, right = false) => (
    <th scope="col" aria-sort={sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined} className={cn("whitespace-nowrap px-4 py-3.5 font-medium", right ? "text-right" : "text-left")}>
      <button type="button" onClick={() => toggle(key)} className={cn("inline-flex items-center gap-1 uppercase hover:text-heading", sort.key === key && "text-heading")}>
        {label}
        {sort.key === key ? sort.dir === "asc" ? <ArrowUp aria-hidden="true" className="size-3" /> : <ArrowDown aria-hidden="true" className="size-3" /> : <ArrowUpDown aria-hidden="true" className="size-3 opacity-40" />}
      </button>
    </th>
  );

  function exportCsv() {
    const header = ["ISIN", "Ligne", "Émetteur", "Pays", "Nominal", "Cours de référence", "Cours de clôture", "Coupon couru", "Échéance", "Statut"];
    const lines = filtered.map((b) => [b.isin, b.name, b.issuer, b.country, b.nominal, b.reference, b.close, b.accrued, b.maturity ?? "", b.status].map((v) => `"${v}"`).join(";"));
    const url = URL.createObjectURL(new Blob([`﻿${header.join(";")}\n${lines.join("\n")}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `bvmac-obligations-${asOf}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const related = selected
    ? NOTICES.filter((n) => {
        const key = selected.name.split(/[ .]/)[0].replace(/\d+$/, "").toUpperCase();
        return n.original.toUpperCase().includes(key.slice(0, 4));
      }).slice(0, 4)
    : [];

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
        <div className="col-span-2 sm:min-w-60 sm:flex-1">
          <label htmlFor="b-search" className="sr-only">{t.search}</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={1.6} />
            <input id="b-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
          </div>
        </div>
        <label className="sr-only" htmlFor="b-country">{t.country}</label>
        <select id="b-country" value={country} onChange={(e) => setCountry(e.target.value)} className="h-11 w-full min-w-0 rounded-full border border-line bg-surface px-4 text-sm sm:w-auto">
          <option value="">{dict.common.allCountries}</option>
          {COUNTRIES.filter((c) => bonds.some((b) => b.country === c.code)).map((c) => <option key={c.code} value={c.code}>{c[locale]}</option>)}
        </select>
        <label className="sr-only" htmlFor="b-issuer">{t.issuer}</label>
        <select id="b-issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} className="h-11 w-full min-w-0 rounded-full border border-line bg-surface px-4 text-sm sm:w-auto">
          <option value="">{t.allIssuers}</option>
          {issuers.map((i) => <option key={i} value={i}>{tc(i, locale)}</option>)}
        </select>
        <button type="button" onClick={exportCsv} className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-action px-5 text-sm font-medium text-action-text hover:bg-action-hover sm:col-span-1">
          <Download aria-hidden="true" className="size-4" strokeWidth={1.6} /> CSV
        </button>
      </div>
      <p role="status" className="mb-3 text-sm text-muted">{filtered.length} {t.count} · {t.priceNote}</p>
      {filtered.length === 0 ? (
        <EmptyState message={dict.common.noResults} />
      ) : (
        <>
        <ul className="grid gap-3 md:grid-cols-2 lg:hidden">
          {filtered.map((b) => (
            <li key={b.isin}>
              <button type="button" onClick={() => setSelected(b)} className="w-full rounded-[var(--radius-card)] border border-line bg-surface p-4 text-left transition-colors hover:bg-surface-alt/50">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-medium text-heading">{b.name}</span>
                    <span className="code block truncate text-muted">{b.isin}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="figure block text-heading">{formatNumber(b.close, locale, 2)} %</span>
                    <span className="block text-xs text-muted">{t.close}</span>
                  </span>
                </span>
                <span className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2"><Flag code={b.country} className="h-3 w-[18px] shrink-0" /><span className="truncate">{tc(b.issuer, locale)}</span></span>
                  <span className="figure shrink-0 text-muted">{t.maturity} {b.maturity ?? "—"}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="relative hidden overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface lg:block" data-lenis-prevent>
          <table className="w-full min-w-[820px] text-sm">
            <caption className="sr-only">{dict.nav.items.bonds}</caption>
            <thead className="bg-surface-alt">
              <tr className="text-xs uppercase tracking-[0.08em] text-muted">
                {head("name", t.line)}
                {head("issuer", t.issuer)}
                {head("close", t.close, true)}
                {head("accrued", t.accrued, true)}
                {head("maturity", t.maturity, true)}
                <th scope="col" className="px-4 py-3.5 text-left font-medium">{t.status}</th>
                <th scope="col" className="px-4 py-3.5"><span className="sr-only">{t.open}</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((b) => (
                <tr key={b.isin} className="group cursor-pointer transition-colors hover:bg-surface-alt/50" onClick={() => setSelected(b)}>
                  <th scope="row" className="px-4 py-3.5 text-left font-normal">
                    <span className="block font-medium text-heading">{b.name}</span>
                    <span className="code text-muted">{b.isin}</span>
                  </th>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-2"><Flag code={b.country} className="h-3 w-[18px]" />{tc(b.issuer, locale)}</span>
                  </td>
                  <td className="figure px-4 py-3.5 text-right text-heading">{formatNumber(b.close, locale, 2)}</td>
                  <td className="figure px-4 py-3.5 text-right">{formatNumber(b.accrued, locale, 2)}</td>
                  <td className="figure px-4 py-3.5 text-right">{b.maturity ?? "—"}</td>
                  <td className="px-4 py-3.5"><span className="rounded-full bg-surface-alt px-2.5 py-0.5 text-xs text-muted">{b.status}</span></td>
                  <td className="px-4 py-3.5 text-right">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setSelected(b); }} className="inline-flex size-8 items-center justify-center rounded-full text-muted group-hover:bg-surface group-hover:text-heading">
                      <ChevronRight aria-hidden="true" className="size-4" />
                      <span className="sr-only">{t.open} {b.name}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}

      <Sheet open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} closeLabel={dict.common.close}>
        {selected && (
          <div className="grid gap-6">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Flag code={selected.country} className="h-3 w-[18px]" /> {tc(selected.issuer, locale)} · <span className="code">{selected.isin}</span>
            </div>
            <div className="rounded-2xl bg-surface-alt p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">{t.close}</p>
              <p className="mt-1 font-serif-display text-4xl text-heading">{formatNumber(selected.close, locale, 2)} %</p>
              <PriceChange value={selected.change} locale={locale} className="mt-1 text-sm" />
            </div>
            <dl className="divide-y divide-line text-sm">
              {[
                [t.nominal, `${formatNumber(selected.nominal, locale)} FCFA`],
                [t.ref, `${formatNumber(selected.reference, locale, 2)} %`],
                [t.accrued, formatNumber(selected.accrued, locale, 2)],
                [t.period, selected.start && selected.maturity ? `${selected.start} – ${selected.maturity}` : "—"],
                [t.demanded, formatNumber(selected.qtyDemanded, locale)],
                [t.offered, formatNumber(selected.qtyOffered, locale)],
                [t.traded, formatNumber(selected.qtyTraded, locale)],
                [t.status, selected.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="figure text-right text-heading">{v}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="text-h3">{t.notices}</h3>
              {related.length ? (
                <ul className="mt-3 grid gap-2 text-sm">
                  {related.map((n) => (
                    <li key={n.id}><a className="link" href={`/${locale}/avis-et-communiques/${n.id}`}>{tc(n.title, locale)}</a></li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">{t.none}</p>
              )}
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
