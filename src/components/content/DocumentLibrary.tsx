"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, FileText, Search } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import type { DocItem } from "@/data/content";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";

export function DocumentLibrary({ docs }: { docs: DocItem[] }) {
  const { locale, dict } = useI18n();
  const [query, setQuery] = useState("");
  const [body, setBody] = useState("");
  const [year, setYear] = useState("");
  const bodies = useMemo(() => [...new Set(docs.map((d) => d.body))], [docs]);
  const years = useMemo(() => [...new Set(docs.map((d) => d.year))].sort().reverse(), [docs]);
  const filtered = useMemo(
    () => docs.filter((d) => (!body || d.body === body) && (!year || d.year === year) && (!query || `${d.title} ${d.ref ?? ""}`.toLowerCase().includes(query.toLowerCase()))).sort((a, b) => b.year.localeCompare(a.year)),
    [docs, body, year, query],
  );
  const L = { fr: { body: "Organisme", year: "Année", all: "Tous", open: "Ouvrir", lang: "Langue" }, en: { body: "Body", year: "Year", all: "All", open: "Open", lang: "Language" }, es: { body: "Organismo", year: "Año", all: "Todos", open: "Abrir", lang: "Idioma" } }[locale];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="grid h-fit gap-6 rounded-[var(--radius-card)] border border-line bg-surface p-5 lg:sticky lg:top-40">
        <div className="relative">
          <label htmlFor="doc-q" className="sr-only">{dict.common.search}</label>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={1.6} />
          <input id="doc-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={dict.common.search} className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
        </div>
        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-muted">{L.body}</legend>
          <div className="flex flex-wrap gap-1.5">
            {["", ...bodies].map((b) => (
              <button key={b || "all"} type="button" aria-pressed={body === b} onClick={() => setBody(b)} className={cn("h-8 rounded-full border px-3 text-xs", body === b ? "border-transparent bg-action text-action-text" : "border-line hover:border-line-strong")}>{b || L.all}</button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="doc-year" className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-muted">{L.year}</label>
          <select id="doc-year" value={year} onChange={(e) => setYear(e.target.value)} className="h-11 w-full rounded-full border border-line bg-surface px-4 text-sm">
            <option value="">{L.all}</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </aside>
      <div>
        <p role="status" className="mb-3 text-sm text-muted">{filtered.length} {dict.common.results}</p>
        {filtered.length === 0 ? (
          <EmptyState message={dict.common.noResults} />
        ) : (
          <ul className="grid gap-3">
            {filtered.map((d) => (
              <li key={d.id}>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-line-strong">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text"><FileText aria-hidden="true" className="size-5" strokeWidth={1.5} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="rounded-full border border-line px-2 py-0.5 font-medium text-heading">{d.body}</span>
                      <span className="figure">{d.year}</span>
                      <span>· {L.lang} : {d.language}</span>
                    </span>
                    <span lang="fr" className="mt-1.5 block font-medium text-heading group-hover:text-link">{d.title}</span>
                    {d.ref && <span lang="fr" className="block break-words text-sm text-muted">{d.ref}</span>}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm text-muted group-hover:text-link">{L.open}<ArrowUpRight aria-hidden="true" className="size-4" /><span className="sr-only">{dict.a11y.external}</span></span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
