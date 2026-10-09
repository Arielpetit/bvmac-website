"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CompanyMark } from "@/components/brand/CompanyMark";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, LayoutGrid, List, Search } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { formatNumber } from "@/lib/format";
import { formatListedOn } from "@/lib/market-labels";
import { COUNTRIES } from "@/lib/navigation";
import type { Equity } from "@/data/market";
import { Flag } from "@/components/ui/Flag";
import { PriceChange } from "@/components/ui/PriceChange";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";


export function ListedCompanies({ equities }: { equities: (Equity & { change: number })[] }) {
  const { locale, dict } = useI18n();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const sectors = useMemo(() => [...new Set(equities.map((e) => e.sector))].sort(), [equities]);
  const rows = equities.filter((e) => (!sector || e.sector === sector) && (!q || `${e.name} ${e.shortName} ${e.ticker}`.toLowerCase().includes(q.toLowerCase())));
  const href = (slug: string) => localePath(locale, `/emetteurs/societes-cotees/${slug}`);
  const country = (code: Equity["country"]) => COUNTRIES.find((c) => c.code === code)?.[locale] ?? code;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <label htmlFor="lc-q" className="sr-only">{dict.common.search}</label>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input id="lc-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={dict.common.search} className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["", ...sectors].map((s) => (
            <button key={s || "all"} type="button" aria-pressed={sector === s} onClick={() => setSector(s)} className={cn("h-9 rounded-full border px-4 text-sm transition-colors", sector === s ? "border-transparent bg-action text-action-text" : "border-line hover:border-line-strong")}>{s || "Tous les secteurs"}</button>
          ))}
        </div>
        <div role="group" aria-label="Affichage" className="ml-auto inline-flex rounded-full border border-line bg-surface p-1">
          {([["grid", LayoutGrid, "Grille"], ["list", List, "Liste"]] as const).map(([v, Icon, label]) => (
            <button key={v} type="button" aria-pressed={view === v} aria-label={label} onClick={() => setView(v)} className={cn("flex size-9 items-center justify-center rounded-full transition-colors", view === v ? "bg-action text-action-text" : "text-muted hover:text-heading")}>
              <Icon aria-hidden="true" className="size-4" />
            </button>
          ))}
        </div>
      </div>
      <p role="status" className="sr-only">{rows.length} {dict.common.results}</p>
      {rows.length === 0 ? (
        <EmptyState message={dict.common.noResults} />
      ) : view === "grid" ? (
        <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {rows.map((e) => (
              <motion.li key={e.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                <Link href={href(e.slug)} className="card-lift group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
                  <div className="relative flex h-40 items-end justify-between overflow-hidden border-b border-line bg-surface-alt p-5">
                    <span aria-hidden="true" className="dots absolute inset-0" />
                    <span className="relative">
                      <CompanyMark slug={e.slug} name={e.shortName} size="lg" className="transition-transform duration-700 group-hover:-rotate-3 group-hover:scale-105" />
                      <span className="font-serif-display mt-3 block text-2xl text-heading">{e.shortName}</span>
                    </span>
                    <span className="relative rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">{e.sector}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm text-muted">{e.name}</p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="figure text-2xl text-heading">{formatNumber(e.closePrice, locale)} <span className="text-sm text-muted">FCFA</span></p>
                        <PriceChange value={e.change} locale={locale} className="text-sm" />
                      </div>
                      <span className="flex size-10 items-center justify-center rounded-full border border-line transition-all group-hover:rotate-45 group-hover:border-transparent group-hover:bg-action group-hover:text-action-text"><ArrowUpRight aria-hidden="true" className="size-4" /></span>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-4 text-xs text-muted">
                      <span className="inline-flex items-center gap-2"><Flag code={e.country} />{country(e.country)}</span>
                      <span>{formatListedOn(e.listedOn, locale)}</span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
          {rows.map((e) => (
            <li key={e.slug}>
              <Link href={href(e.slug)} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-alt md:grid-cols-[auto_2fr_1fr_1fr_auto]">
                <CompanyMark slug={e.slug} name={e.shortName} />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-heading group-hover:text-link">{e.shortName}</span>
                  <span className="block truncate text-xs text-muted">{e.name}</span>
                </span>
                <span className="hidden text-sm text-muted md:inline-flex md:items-center md:gap-2"><Flag code={e.country} />{country(e.country)}</span>
                <span className="hidden text-sm text-muted md:block">{e.sector}</span>
                <span className="text-right">
                  <span className="figure block text-heading">{formatNumber(e.closePrice, locale)}</span>
                  <PriceChange value={e.change} locale={locale} className="text-xs" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
