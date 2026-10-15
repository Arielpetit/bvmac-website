"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, BellRing, Rss, Search } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { tc } from "@/i18n/content";
import { COUNTRIES } from "@/lib/navigation";
import type { Notice, NoticeType } from "@/data/content";
import { NOTICE_TYPES } from "@/data/content";
import { EmptyState } from "@/components/ui/States";
import { NoticeRow } from "./NoticeRow";
import { SubscribeForm } from "./SubscribeForm";
import { cn } from "@/lib/cn";

const PAGE = 12;

export function NoticeLibrary({ notices }: { notices: Notice[] }) {
  const { locale, dict } = useI18n();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<NoticeType | "">("");
  const [issuer, setIssuer] = useState("");
  const [country, setCountry] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [desc, setDesc] = useState(true);
  const [limit, setLimit] = useState(PAGE);
  const issuers = useMemo(() => [...new Set(notices.map((n) => n.issuer).filter(Boolean))].sort() as string[], [notices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notices
      .filter(
        (n) =>
          (!type || n.type === type) &&
          (!issuer || n.issuer === issuer) &&
          (!country || n.country === country) &&
          (!from || n.date >= from) &&
          (!to || n.date <= to) &&
          (!q || `${n.title} ${tc(n.title, locale)} ${n.original} ${n.number ?? ""} ${n.issuer ?? ""}`.toLowerCase().includes(q)),
      )
      .sort((a, b) => (desc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [notices, query, type, issuer, country, from, to, desc, locale]);

  const reset = () => {
    setQuery(""); setType(""); setIssuer(""); setCountry(""); setFrom(""); setTo(""); setLimit(PAGE);
  };
  const L = {
    fr: { search: "Titre, numéro, émetteur…", type: "Type", issuer: "Émetteur", country: "Pays", from: "Du", to: "Au", all: "Tous", sort: "Trier", newest: "Plus récents", oldest: "Plus anciens", more: "Afficher plus", subscribe: "Recevoir les avis", subscribeText: "Un e-mail à chaque nouvel avis (double confirmation), ou des alertes dans l’application BVMAC.", rss: "Flux RSS" },
    en: { search: "Title, number, issuer…", type: "Type", issuer: "Issuer", country: "Country", from: "From", to: "To", all: "All", sort: "Sort", newest: "Newest", oldest: "Oldest", more: "Show more", subscribe: "Get notices", subscribeText: "An email for every new notice (double opt-in), or alerts in the BVMAC app.", rss: "RSS feed" },
    es: { search: "Título, número, emisor…", type: "Tipo", issuer: "Emisor", country: "País", from: "Desde", to: "Hasta", all: "Todos", sort: "Ordenar", newest: "Más recientes", oldest: "Más antiguos", more: "Mostrar más", subscribe: "Recibir los avisos", subscribeText: "Un correo por cada nuevo aviso (doble confirmación), o alertas en la aplicación BVMAC.", rss: "Canal RSS" },
  }[locale];
  const field = "h-11 w-full rounded-full border border-line bg-surface px-4 text-sm";

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
      <aside className="grid h-fit gap-5 lg:sticky lg:top-40">
        <div className="grid gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
          <div>
            <label htmlFor="n-q" className="sr-only">{dict.common.search}</label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={1.6} />
              <input id="n-q" type="search" value={query} onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }} placeholder={L.search} className={cn(field, "pl-11")} />
            </div>
          </div>
          <fieldset>
            <legend className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-muted">{L.type}</legend>
            <div className="flex flex-wrap gap-1.5">
              {(["", ...Object.keys(NOTICE_TYPES)] as (NoticeType | "")[]).map((k) => (
                <button key={k || "all"} type="button" aria-pressed={type === k} onClick={() => { setType(k); setLimit(PAGE); }} className={cn("h-8 rounded-full border px-3 text-xs transition-colors", type === k ? "border-transparent bg-action text-action-text" : "border-line hover:border-line-strong")}>
                  {k ? NOTICE_TYPES[k][locale] : L.all}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="n-issuer" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-muted">{L.issuer}</label>
            <select id="n-issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} className={field}>
              <option value="">{L.all}</option>
              {issuers.map((i) => <option key={i} value={i}>{tc(i, locale)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="n-country" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-muted">{L.country}</label>
            <select id="n-country" value={country} onChange={(e) => setCountry(e.target.value)} className={field}>
              <option value="">{dict.common.allCountries}</option>
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c[locale]}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="n-from" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-muted">{L.from}</label>
              <input id="n-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm" />
            </div>
            <div>
              <label htmlFor="n-to" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-muted">{L.to}</label>
              <input id="n-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm" />
            </div>
          </div>
          <button type="button" onClick={reset} className="link w-fit text-sm">{dict.common.clearFilters}</button>
        </div>
        <div className="rounded-[var(--radius-card)] bg-espresso p-5 text-brand-sand">
          <BellRing aria-hidden="true" className="size-6 text-brand-gold-light" strokeWidth={1.5} />
          <p className="mt-3 font-serif-display text-xl text-brand-ivory">{L.subscribe}</p>
          <p className="mt-1 text-sm text-brand-sand/75">{L.subscribeText}</p>
          <div className="mt-4"><SubscribeForm tone="dark" /></div>
          <a href="#" className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-gold-light hover:underline"><Rss aria-hidden="true" className="size-4" /> {L.rss}</a>
        </div>
      </aside>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p role="status" className="text-sm text-muted">{filtered.length} {dict.common.results}</p>
          <button type="button" onClick={() => setDesc((d) => !d)} className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-4 text-sm hover:border-line-strong">
            <ArrowDownUp aria-hidden="true" className="size-4" strokeWidth={1.6} />
            {desc ? L.newest : L.oldest}
          </button>
        </div>
        {filtered.length === 0 ? (
          <EmptyState message={dict.common.noResults} action={<button type="button" className="link text-sm" onClick={reset}>{dict.common.clearFilters}</button>} />
        ) : (
          <>
            <div className="divide-y divide-line border-y border-line">
              {filtered.slice(0, limit).map((n) => <NoticeRow key={n.id} notice={n} locale={locale} />)}
            </div>
            {filtered.length > limit && (
              <div className="mt-8 flex justify-center">
                <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm font-medium hover:border-heading/40">{L.more}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
