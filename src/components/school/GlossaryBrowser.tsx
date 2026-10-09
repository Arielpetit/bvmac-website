"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { useUrlParam } from "@/lib/client-store";
import { SEE_ALSO, TERM_TRANSLATIONS, termId } from "@/data/glossary-extra";
import { EmptyState } from "@/components/ui/States";

type Term = { term: string; def: string };
const letterOf = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "")[0].toUpperCase();
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function GlossaryBrowser({ terms }: { terms: Term[] }) {
  const initial = useUrlParam("q");
  const [typed, setTyped] = useState<string | null>(null);
  const q = typed ?? initial;
  const filtered = useMemo(() => {
    const n = norm(q);
    return [...terms]
      .sort((a, b) => a.term.localeCompare(b.term, "fr"))
      .filter((t) => !n || norm(`${t.term} ${t.def} ${(TERM_TRANSLATIONS[t.term] ?? []).join(" ")}`).includes(n));
  }, [terms, q]);
  const groups = new Map<string, Term[]>();
  filtered.forEach((g) => groups.set(letterOf(g.term), [...(groups.get(letterOf(g.term)) ?? []), g]));
  const letters = [...new Set(terms.map((t) => letterOf(t.term)))].sort();

  return (
    <div>
      <div className="glass sticky top-[129px] z-20 -mx-5 mb-10 border-b border-line px-5 py-4 md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full max-w-sm">
            <label htmlFor="g-q" className="sr-only">Rechercher un terme</label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input id="g-q" type="search" value={q} onChange={(e) => setTyped(e.target.value)} placeholder="Rechercher un terme (FR, EN, ES)" className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
          </div>
          <nav aria-label="Index alphabétique">
            <ul className="flex flex-wrap gap-1">
              {letters.map((l) => (
                <li key={l}>
                  {groups.has(l) ? (
                    <a href={`#lettre-${l}`} className="inline-flex size-9 items-center justify-center rounded-full text-sm font-medium text-heading transition-colors hover:bg-action hover:text-action-text">{l}</a>
                  ) : (
                    <span className="inline-flex size-9 items-center justify-center text-sm text-muted/40">{l}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <p role="status" className="sr-only">{filtered.length} termes</p>
      {filtered.length === 0 ? (
        <EmptyState message="Aucun terme ne correspond à votre recherche." />
      ) : (
        <div className="grid gap-14">
          {[...groups.keys()].map((l) => (
            <section key={l} id={`lettre-${l}`} aria-labelledby={`h-${l}`} className="grid gap-6 md:grid-cols-[120px_1fr]">
              <h2 id={`h-${l}`} className="font-serif-display text-6xl leading-none text-accent-text md:sticky md:top-64 md:h-fit">{l}</h2>
              <dl className="grid gap-3 md:grid-cols-2">
                <AnimatePresence initial={false}>
                  {groups.get(l)!.map((g) => {
                    const tr = TERM_TRANSLATIONS[g.term];
                    const see = SEE_ALSO[g.term];
                    return (
                      <motion.div layout key={g.term} id={termId(g.term)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="scroll-mt-64 rounded-[var(--radius-card)] border border-line bg-surface p-5 target:border-brand-gold target:shadow-soft">
                        <dt className="text-lg font-medium text-heading">{g.term}</dt>
                        {tr && (
                          <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
                            <span><abbr title="English" className="no-underline">EN</abbr> <span lang="en" className="text-heading/80">{tr[0]}</span></span>
                            <span><abbr title="Español" className="no-underline">ES</abbr> <span lang="es" className="text-heading/80">{tr[1]}</span></span>
                          </p>
                        )}
                        <dd className="mt-3 text-sm leading-relaxed text-muted">{g.def}</dd>
                        {see && (
                          <dd className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-muted">Voir aussi :</span>
                            {see.map((s) => <a key={s} href={`#${termId(s)}`} onClick={() => setTyped("")} className="rounded-full border border-line px-2.5 py-0.5 hover:border-brand-gold hover:text-link">{s}</a>)}
                          </dd>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
