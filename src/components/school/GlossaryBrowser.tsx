"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { useUrlParam } from "@/lib/client-store";
import { SEE_ALSO, TERM_TRANSLATIONS, termId } from "@/data/glossary-extra";
import { EmptyState } from "@/components/ui/States";
import { useI18n } from "@/i18n/provider";
import { glossaryDef } from "@/data/school";
import type { Locale } from "@/i18n/config";

type Term = { term: string; def: string };
type Shown = { key: string; term: string; def: string; others: [string, string, string][] };

const L = {
  fr: { search: "Rechercher un terme", ph: "Rechercher un terme (FR, EN, ES)", index: "Index alphabétique", count: "termes", empty: "Aucun terme ne correspond à votre recherche.", see: "Voir aussi :" },
  en: { search: "Search a term", ph: "Search a term (EN, FR, ES)", index: "Alphabetical index", count: "terms", empty: "No term matches your search.", see: "See also:" },
  es: { search: "Buscar un término", ph: "Buscar un término (ES, FR, EN)", index: "Índice alfabético", count: "términos", empty: "Ningún término coincide con su búsqueda.", see: "Véase también:" },
};

// Term in a given language: the French source, or its English or Spanish equivalent.
function termIn(term: string, lang: Locale) {
  if (lang === "fr") return term;
  return TERM_TRANSLATIONS[term]?.[lang === "en" ? 0 : 1] ?? term;
}
const letterOf = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "")[0].toUpperCase();
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function GlossaryBrowser({ terms: raw }: { terms: Term[] }) {
  const { locale } = useI18n();
  const t = L[locale];
  const terms: Shown[] = useMemo(
    () =>
      raw.map((g) => ({
        key: g.term,
        term: termIn(g.term, locale),
        def: glossaryDef(g.term, g.def, locale),
        others: (["fr", "en", "es"] as const).filter((l) => l !== locale).map((l) => [l.toUpperCase(), l, termIn(g.term, l)] as [string, string, string]),
      })),
    [raw, locale],
  );
  const initial = useUrlParam("q");
  const [typed, setTyped] = useState<string | null>(null);
  const q = typed ?? initial;
  const filtered = useMemo(() => {
    const n = norm(q);
    return [...terms]
      .sort((a, b) => a.term.localeCompare(b.term, locale))
      .filter((g) => !n || norm(`${g.term} ${g.def} ${g.others.map((o) => o[2]).join(" ")}`).includes(n));
  }, [terms, q, locale]);
  const groups = new Map<string, Shown[]>();
  filtered.forEach((g) => groups.set(letterOf(g.term), [...(groups.get(letterOf(g.term)) ?? []), g]));
  const letters = [...new Set(terms.map((g) => letterOf(g.term)))].sort();

  return (
    <div>
      <div className="glass sticky top-[76px] z-20 -mx-5 mb-10 border-b border-line px-5 py-4 md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full max-w-sm">
            <label htmlFor="g-q" className="sr-only">{t.search}</label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input id="g-q" type="search" value={q} onChange={(e) => setTyped(e.target.value)} placeholder={t.ph} className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
          </div>
          <nav aria-label={t.index} className="-mx-5 w-[calc(100%+2.5rem)] overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:w-auto md:overflow-visible md:px-0">
            <ul className="flex w-max gap-1 md:w-auto md:flex-wrap">
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
      <p role="status" className="sr-only">{filtered.length} {t.count}</p>
      {filtered.length === 0 ? (
        <EmptyState message={t.empty} />
      ) : (
        <div className="grid gap-14">
          {[...groups.keys()].map((l) => (
            <section key={l} id={`lettre-${l}`} aria-labelledby={`h-${l}`} className="grid gap-6 md:grid-cols-[120px_1fr]">
              <h2 id={`h-${l}`} className="font-serif-display text-6xl leading-none text-accent-text md:sticky md:top-64 md:h-fit">{l}</h2>
              <dl className="grid gap-3 md:grid-cols-2">
                <AnimatePresence initial={false}>
                  {groups.get(l)!.map((g) => {
                    const see = SEE_ALSO[g.key];
                    return (
                      <motion.div layout key={g.key} id={termId(g.key)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="scroll-mt-64 rounded-[var(--radius-card)] border border-line bg-surface p-5 target:border-brand-gold target:shadow-soft">
                        <dt className="text-lg font-medium text-heading">{g.term}</dt>
                        <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
                          {g.others.map(([code, lang, label]) => (
                            <span key={code}>{code} <span lang={lang} className="text-heading/80">{label}</span></span>
                          ))}
                        </p>
                        <dd className="mt-3 text-sm leading-relaxed text-muted">{g.def}</dd>
                        {see && (
                          <dd className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-muted">{t.see}</span>
                            {see.map((s) => <a key={s} href={`#${termId(s)}`} onClick={() => setTyped("")} className="rounded-full border border-line px-2.5 py-0.5 hover:border-brand-gold hover:text-link">{termIn(s, locale)}</a>)}
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
