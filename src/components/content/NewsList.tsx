"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useI18n } from "@/i18n/provider";
import type { NewsItem } from "@/data/content";
import { EmptyState } from "@/components/ui/States";
import { NewsCard } from "./NewsCard";
import { cn } from "@/lib/cn";

const PAGE = 6;

export function NewsList({ items }: { items: NewsItem[] }) {
  const { locale, dict } = useI18n();
  const [cat, setCat] = useState("");
  const [year, setYear] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const cats = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const years = useMemo(() => [...new Set(items.map((i) => i.date.slice(0, 4)))], [items]);
  const filtered = items.filter((i) => (!cat || i.category === cat) && (!year || i.date.startsWith(year)) && (!query || `${i.title} ${i.excerpt}`.toLowerCase().includes(query.toLowerCase())));
  const L = { fr: { all: "Toutes", allYears: "Toutes les années", more: "Charger plus", search: "Rechercher une actualité" }, en: { all: "All", allYears: "All years", more: "Load more", search: "Search news" }, es: { all: "Todas", allYears: "Todos los años", more: "Cargar más", search: "Buscar una noticia" } }[locale];

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Catégorie" className="flex flex-wrap gap-2">
          {["", ...cats].map((c) => (
            <button key={c || "all"} type="button" aria-pressed={cat === c} onClick={() => { setCat(c); setLimit(PAGE); }} className={cn("h-10 rounded-full border px-4 text-sm transition-colors", cat === c ? "border-transparent bg-action text-action-text" : "border-line bg-surface hover:border-line-strong")}>
              {c || L.all}
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="news-year">{L.allYears}</label>
        <select id="news-year" value={year} onChange={(e) => setYear(e.target.value)} className="h-10 rounded-full border border-line bg-surface px-4 text-sm">
          <option value="">{L.allYears}</option>
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>
        <div className="relative ml-auto min-w-60">
          <label htmlFor="news-q" className="sr-only">{L.search}</label>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={1.6} />
          <input id="news-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={L.search} className="h-10 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
        </div>
      </div>
      <p role="status" className="sr-only">{filtered.length} {dict.common.results}</p>
      {filtered.length === 0 ? (
        <EmptyState message={dict.common.noResults} />
      ) : (
        <motion.ul layout className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {filtered.slice(0, limit).map((item) => (
              <motion.li key={item.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <NewsCard item={item} locale={locale} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
      {filtered.length > limit && (
        <div className="mt-14 flex justify-center">
          <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm font-medium hover:border-heading/40">{L.more}</button>
        </div>
      )}
    </div>
  );
}
