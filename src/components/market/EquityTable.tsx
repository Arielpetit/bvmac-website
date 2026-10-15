"use client";

import Link from "next/link";
import { CompanyMark } from "@/components/brand/CompanyMark";
import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3, Download, Search } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { formatDate, formatNumber } from "@/lib/format";
import { COUNTRIES } from "@/lib/navigation";
import { COLUMN_HINTS, STATUS_LABEL, sectorLabel } from "@/lib/market-labels";
import type { EquityQuote } from "@/lib/api";
import { PriceChange } from "@/components/ui/PriceChange";
import { Hint } from "@/components/ui/Hint";
import { EmptyState } from "@/components/ui/States";
import { Sparkline } from "./Sparkline";
import type { Point } from "@/data/series";
import { cn } from "@/lib/cn";

type ColKey = "isin" | "dividend" | "nominal" | "ref" | "close" | "change" | "demanded" | "offered" | "traded" | "status" | "trend";

const L = {
  fr: { search: "Rechercher une valeur", country: "Pays", sector: "Secteur", allSectors: "Tous les secteurs", columns: "Colonnes", security: "Valeur", isin: "ISIN", dividend: "Dernier dividende", nominal: "Nominal", ref: "Cours de réf.", close: "Clôture", change: "Variation", demanded: "Qté demandée", offered: "Qté offerte", traded: "Qté transigée", status: "Statut", trend: "Tendance", count: "valeurs", details: "Détails" },
  en: { search: "Search a security", country: "Country", sector: "Sector", allSectors: "All sectors", columns: "Columns", security: "Security", isin: "ISIN", dividend: "Last dividend", nominal: "Nominal", ref: "Ref. price", close: "Close", change: "Change", demanded: "Qty bid", offered: "Qty offered", traded: "Qty traded", status: "Status", trend: "Trend", count: "securities", details: "Details" },
  es: { search: "Buscar un valor", country: "País", sector: "Sector", allSectors: "Todos los sectores", columns: "Columnas", security: "Valor", isin: "ISIN", dividend: "Último dividendo", nominal: "Nominal", ref: "Precio ref.", close: "Cierre", change: "Variación", demanded: "Cant. demandada", offered: "Cant. ofrecida", traded: "Cant. negociada", status: "Estado", trend: "Tendencia", count: "valores", details: "Detalles" },
};

const DEFAULT_COLS: ColKey[] = ["isin", "dividend", "ref", "close", "change", "demanded", "offered", "traded", "status", "trend"];
const ALL_COLS: ColKey[] = ["isin", "dividend", "nominal", "ref", "close", "change", "demanded", "offered", "traded", "status", "trend"];
const NUMERIC: ColKey[] = ["dividend", "nominal", "ref", "close", "change", "demanded", "offered", "traded"];

export function EquityTable({ rows, sparks, asOf }: { rows: EquityQuote[]; sparks: Record<string, Point[]>; asOf: string }) {
  const { locale, dict } = useI18n();
  const t = L[locale];
  const hints = COLUMN_HINTS[locale];
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [sector, setSector] = useState("");
  const [cols, setCols] = useState<ColKey[]>(DEFAULT_COLS);
  const [colsOpen, setColsOpen] = useState(false);
  const [sort, setSort] = useState<{ key: ColKey | "name"; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });
  const colsRef = useRef<HTMLDivElement>(null);
  const sectors = useMemo(() => [...new Set(rows.map((r) => r.sector))].sort(), [rows]);

  const value = (r: EquityQuote, key: ColKey | "name"): number | string => {
    switch (key) {
      case "name": return r.shortName;
      case "dividend": return r.lastDividend.amount;
      case "nominal": return r.nominal ?? -1;
      case "ref": return r.referencePrice;
      case "close": return r.closePrice;
      case "change": return r.change;
      case "demanded": return r.qtyDemanded;
      case "offered": return r.qtyOffered;
      case "traded": return r.qtyTraded;
      case "isin": return r.isin;
      case "status": return r.status;
      default: return 0;
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter(
      (r) => (!country || r.country === country) && (!sector || r.sector === sector) && (!q || `${r.ticker} ${r.name} ${r.isin} ${r.sector}`.toLowerCase().includes(q)),
    );
    return list.sort((a, b) => {
      const va = value(a, sort.key);
      const vb = value(b, sort.key);
      const cmp = typeof va === "string" ? va.localeCompare(String(vb)) : va - Number(vb);
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, query, country, sector, sort]);

  const toggleSort = (key: ColKey | "name") =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "name" || key === "isin" ? "asc" : "desc" }));

  function exportCsv() {
    const header = ["Ticker", "Valeur", "ISIN", "Dernier dividende", "Date dividende", "Nominal", "Cours de référence", "Cours de clôture", "Variation %", "Qté demandée", "Qté offerte", "Qté transigée", "Statut"];
    const lines = filtered.map((r) =>
      [r.ticker, r.name, r.isin, r.lastDividend.amount, r.lastDividend.date, r.nominal ?? "", r.referencePrice, r.closePrice, r.change.toFixed(2), r.qtyDemanded, r.qtyOffered, r.qtyTraded, r.status]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(";"),
    );
    const url = URL.createObjectURL(new Blob([`﻿${header.join(";")}\n${lines.join("\n")}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `bvmac-actions-${asOf}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const cell = (r: EquityQuote, key: ColKey) => {
    switch (key) {
      case "isin": return <span className="code text-muted">{r.isin}</span>;
      case "dividend": return <span className="figure">{formatNumber(r.lastDividend.amount, locale)}<span className="block text-[11px] text-muted">{formatDate(r.lastDividend.date, locale, "numeric")}</span></span>;
      case "nominal": return <span className="figure">{r.nominal ? formatNumber(r.nominal, locale) : "—"}</span>;
      case "ref": return <span className="figure">{formatNumber(r.referencePrice, locale)}</span>;
      case "close": return <span className="figure font-medium text-heading">{formatNumber(r.closePrice, locale)}</span>;
      case "change": return <PriceChange value={r.change} locale={locale} />;
      case "demanded": return <span className="figure">{formatNumber(r.qtyDemanded, locale)}</span>;
      case "offered": return <span className="figure">{formatNumber(r.qtyOffered, locale)}</span>;
      case "traded": return <span className="figure">{formatNumber(r.qtyTraded, locale)}</span>;
      case "status": return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", r.status === "PEq" ? "bg-rise-bg text-rise" : "bg-surface-alt text-muted")}>{r.status}</span>;
      case "trend": return <Sparkline points={sparks[r.slug] ?? []} className="h-8 w-24 text-[color:var(--chart-price)]" />;
    }
  };

  const select = "h-11 rounded-full border border-line bg-surface px-4 text-sm";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="min-w-60 flex-1">
          <label htmlFor="eq-search" className="sr-only">{t.search}</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={1.6} />
            <input id="eq-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`${t.search} — SEMC, BGFI, CM00…`} className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
          </div>
        </div>
        <label className="sr-only" htmlFor="eq-country">{t.country}</label>
        <select id="eq-country" value={country} onChange={(e) => setCountry(e.target.value)} className={select}>
          <option value="">{dict.common.allCountries}</option>
          {COUNTRIES.filter((c) => rows.some((r) => r.country === c.code)).map((c) => (
            <option key={c.code} value={c.code}>{c[locale]}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="eq-sector">{t.sector}</label>
        <select id="eq-sector" value={sector} onChange={(e) => setSector(e.target.value)} className={select}>
          <option value="">{t.allSectors}</option>
          {sectors.map((s) => <option key={s} value={s}>{sectorLabel(s, locale)}</option>)}
        </select>
        <div ref={colsRef} className="relative hidden md:block">
          <button type="button" aria-expanded={colsOpen} onClick={() => setColsOpen((o) => !o)} className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm hover:border-line-strong">
            <Columns3 aria-hidden="true" className="size-4" strokeWidth={1.6} /> {t.columns}
          </button>
          {colsOpen && (
            <fieldset className="absolute right-0 top-13 z-30 mt-2 w-56 rounded-2xl border border-line bg-surface p-3 shadow-soft">
              <legend className="sr-only">{t.columns}</legend>
              {ALL_COLS.map((c) => (
                <label key={c} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-alt">
                  <input type="checkbox" checked={cols.includes(c)} onChange={(e) => setCols((prev) => (e.target.checked ? ALL_COLS.filter((x) => prev.includes(x) || x === c) : prev.filter((x) => x !== c)))} className="size-4 accent-[#1c130b]" />
                  {t[c]}
                </label>
              ))}
            </fieldset>
          )}
        </div>
        <button type="button" onClick={exportCsv} className="inline-flex h-11 items-center gap-2 rounded-full bg-action px-5 text-sm font-medium text-action-text hover:bg-action-hover">
          <Download aria-hidden="true" className="size-4" strokeWidth={1.6} /> CSV
        </button>
      </div>

      <p role="status" className="mb-3 text-sm text-muted">
        {filtered.length} {t.count} · {dict.session.closingOf} {formatDate(asOf, locale)} · {dict.session.delayed}
      </p>

      {filtered.length === 0 ? (
        <EmptyState message={dict.common.noResults} action={<button type="button" className="link text-sm" onClick={() => { setQuery(""); setCountry(""); setSector(""); }}>{dict.common.clearFilters}</button>} />
      ) : (
        <>
          <div className="relative hidden overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface md:block" data-lenis-prevent>
            <table className="w-full min-w-[960px] text-sm">
              <caption className="sr-only">{dict.nav.items.equities}</caption>
              <thead className="bg-surface-alt">
                <tr className="text-xs uppercase tracking-[0.08em] text-muted">
                  <th scope="col" aria-sort={sort.key === "name" ? (sort.dir === "asc" ? "ascending" : "descending") : undefined} className="sticky left-0 z-10 bg-surface-alt px-4 py-3.5 text-left font-medium">
                    <SortButton label={t.security} active={sort.key === "name"} dir={sort.dir} onClick={() => toggleSort("name")} />
                  </th>
                  {cols.map((c) => (
                    <th key={c} scope="col" aria-sort={sort.key === c ? (sort.dir === "asc" ? "ascending" : "descending") : undefined} className={cn("whitespace-nowrap px-4 py-3.5 font-medium", NUMERIC.includes(c) ? "text-right" : "text-left")}>
                      {c === "trend" ? t.trend : (
                        <span className={cn("inline-flex items-center gap-1", NUMERIC.includes(c) && "justify-end")}>
                          {hints[c] ? <Hint text={hints[c]}>{t[c]}</Hint> : t[c]}
                          <SortButton label="" active={sort.key === c} dir={sort.dir} onClick={() => toggleSort(c)} srLabel={t[c]} />
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((r) => (
                  <tr key={r.slug} className="group transition-colors hover:bg-surface-alt/50">
                    <th scope="row" className="sticky left-0 z-10 bg-surface px-4 py-4 text-left font-normal group-hover:bg-surface-alt/50">
                      <Link href={localePath(locale, `/marches/actions/${r.slug}`)} className="flex items-center gap-3">
                        <CompanyMark slug={r.slug} name={r.shortName} />
                        <span>
                          <span className="block font-medium text-heading group-hover:text-link">{r.shortName}</span>
                          <span className="block max-w-52 truncate text-xs text-muted">{r.name}</span>
                        </span>
                      </Link>
                    </th>
                    {cols.map((c) => (
                      <td key={c} className={cn("px-4 py-4", NUMERIC.includes(c) && "text-right")}>{cell(r, c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="grid gap-3 md:hidden">
            {filtered.map((r) => (
              <li key={r.slug} className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={localePath(locale, `/marches/actions/${r.slug}`)} className="flex items-center gap-2.5">
                    <CompanyMark slug={r.slug} name={r.shortName} />
                    <span>
                      <span className="block font-medium text-heading">{r.shortName}</span>
                      <span className="block text-xs text-muted">{sectorLabel(r.sector, locale)}</span>
                    </span>
                  </Link>
                  <div className="text-right">
                    <span className="figure block font-medium">{formatNumber(r.closePrice, locale)}</span>
                    <PriceChange value={r.change} locale={locale} className="text-sm" />
                  </div>
                </div>
                <details className="mt-3 text-sm">
                  <summary className="cursor-pointer text-link">{t.details}</summary>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <dt className="text-muted">ISIN</dt><dd className="code text-right">{r.isin}</dd>
                    <dt className="text-muted">{t.ref}</dt><dd className="figure text-right">{formatNumber(r.referencePrice, locale)}</dd>
                    <dt className="text-muted">{t.traded}</dt><dd className="figure text-right">{formatNumber(r.qtyTraded, locale)}</dd>
                    <dt className="text-muted">{t.dividend}</dt><dd className="figure text-right">{formatNumber(r.lastDividend.amount, locale)}</dd>
                    <dt className="text-muted">{t.status}</dt><dd className="text-right">{STATUS_LABEL[locale][r.status]}</dd>
                  </dl>
                </details>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-4 text-xs text-muted">NC : {STATUS_LABEL[locale].NC} · PEq : {STATUS_LABEL[locale].PEq}</p>
    </div>
  );
}

function SortButton({ label, active, dir, onClick, srLabel }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void; srLabel?: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("inline-flex items-center gap-1 rounded uppercase hover:text-heading", active && "text-heading")}>
      {label}
      {srLabel && <span className="sr-only">{srLabel}</span>}
      {active ? dir === "asc" ? <ArrowUp aria-hidden="true" className="size-3" /> : <ArrowDown aria-hidden="true" className="size-3" /> : <ArrowUpDown aria-hidden="true" className="size-3 opacity-40" />}
    </button>
  );
}
