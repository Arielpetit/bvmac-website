"use client";

import { useMemo, useState } from "react";
import { ChevronDown, FileDown, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/provider";
import { formatDate, ucfirst } from "@/lib/format";
import { intlLocale } from "@/i18n/config";
import type { BocEntry } from "@/data/content";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";

// Archive of official BOC PDFs (links to www.bvm-ac.org), grouped by month.
export function BocArchive({ entries }: { entries: BocEntry[] }) {
  const { locale, dict } = useI18n();
  const years = useMemo(() => [...new Set(entries.map((e) => e.date.slice(0, 4)))], [entries]);
  const [year, setYear] = useState(years[0]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(entries[0]?.date.slice(0, 7) ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => e.date.startsWith(year) && (!q || e.number.toLowerCase().includes(q) || formatDate(e.date, locale, "numeric").includes(q) || e.date.includes(q)));
  }, [entries, year, query, locale]);

  const months = useMemo(() => {
    const map = new Map<string, BocEntry[]>();
    filtered.forEach((e) => map.set(e.date.slice(0, 7), [...(map.get(e.date.slice(0, 7)) ?? []), e]));
    return [...map.entries()];
  }, [filtered]);

  const monthName = (key: string) => new Intl.DateTimeFormat(intlLocale[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${key}-15T00:00:00Z`));
  const L = { fr: { search: "Date ou numéro (ex. 08/10/2026)", count: "bulletins" }, en: { search: "Date or number (e.g. 08/10/2026)", count: "bulletins" }, es: { search: "Fecha o número (p. ej. 08/10/2026)", count: "boletines" } }[locale];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div role="group" aria-label="Année" className="inline-flex rounded-full border border-line bg-surface p-1">
          {years.map((y) => (
            <button key={y} type="button" aria-pressed={year === y} onClick={() => setYear(y)} className={cn("h-9 rounded-full px-4 text-sm", year === y ? "bg-action text-action-text" : "text-muted hover:text-heading")}>{y}</button>
          ))}
        </div>
        <div className="min-w-60 flex-1">
          <label htmlFor="boc-search" className="sr-only">{L.search}</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={1.6} />
            <input id="boc-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={L.search} className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
          </div>
        </div>
      </div>
      <p role="status" className="mb-3 text-sm text-muted">{filtered.length} {L.count}</p>
      {months.length === 0 ? (
        <EmptyState message={dict.common.noResults} action={<button type="button" className="link text-sm" onClick={() => setQuery("")}>{dict.common.clearFilters}</button>} />
      ) : (
        <ul className="grid gap-3">
          {months.map(([key, list]) => {
            const isOpen = open === key || query.trim() !== "";
            return (
              <li key={key} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(open === key ? null : key)} className="flex min-h-14 w-full items-center justify-between px-5 text-left hover:bg-surface-alt/60">
                  <span className="font-serif-display text-xl capitalize text-heading">
                    {monthName(key)} <span className="ml-2 font-sans text-sm text-muted">{list.length}</span>
                  </span>
                  <ChevronDown aria-hidden="true" className={cn("size-5 text-muted transition-transform", isOpen && "rotate-180")} strokeWidth={1.6} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="divide-y divide-line overflow-hidden border-t border-line">
                      {list.map((e) => (
                        <li key={e.number} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                          <span>
                            <span className="code block text-heading">{e.number}</span>
                            <span className="block text-sm text-muted">{ucfirst(formatDate(e.date, locale))}</span>
                          </span>
                          <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm text-heading hover:border-line-strong">
                            <FileDown aria-hidden="true" className="size-4" strokeWidth={1.6} /> PDF
                            <span className="sr-only">{e.number} {dict.a11y.external}</span>
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
