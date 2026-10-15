"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Search, X } from "lucide-react";
import { setUrlParam, useUrlParam } from "@/lib/client-store";
import { useI18n } from "@/i18n/provider";
import { COUNTRIES, type CountryCode } from "@/lib/navigation";
import { formatDate } from "@/lib/format";
import type { Broker } from "@/data/content";
import { Flag } from "@/components/ui/Flag";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { RealMap } from "@/components/ui/RealMap";

// City positions for the broker map (lon, lat).
const CITIES: Record<string, [number, number]> = {
  Douala: [9.7, 4.05],
  "Yaoundé": [11.5, 3.87],
  Libreville: [9.45, 0.39],
  Brazzaville: [15.28, -4.27],
  "N'Djamena": [15.04, 12.13],
  Malabo: [8.78, 3.75],
  Bangui: [18.56, 4.36],
};
const SERVICES = ["Négociation", "Placement", "Tenue de compte", "Conseil"];

export function BrokerDirectory({ brokers, totals }: { brokers: Broker[]; totals: Record<CountryCode, number> }) {
  const { locale, dict } = useI18n();
  const urlCountry = useUrlParam("pays").toUpperCase();
  const [chosen, setChosen] = useState<string | null>(null);
  const country = chosen ?? (COUNTRIES.some((c) => c.code === urlCountry) ? urlCountry : "");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  function pick(code: string) {
    setChosen(code);
    setCity("");
    setUrlParam("pays", code);
  }

  const filtered = useMemo(
    () => brokers.filter((b) => (!country || b.country === country) && (!city || b.city === city) && (!query || `${b.name} ${b.city} ${b.approval}`.toLowerCase().includes(query.toLowerCase()))),
    [brokers, country, city, query],
  );
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  const hoveredCity = brokers.find((b) => b.name === hovered)?.city;
  const L = {
    fr: { search: "Rechercher une société de bourse", approval: "Agrément", since: "du", shown: "sur", total: "sociétés de bourse agréées par la COSUMAF", map: "Cliquez sur une ville pour filtrer", note: "Source : liste publiée sur le site de la BVMAC. Coordonnées à vérifier auprès de chaque société." },
    en: { search: "Search a broker", approval: "Licence", since: "of", shown: "of", total: "brokers licensed by COSUMAF", map: "Select a city to filter", note: "Source: list published on the BVMAC website. Contact details to be checked with each firm." },
    es: { search: "Buscar una sociedad de bolsa", approval: "Autorización", since: "del", shown: "de", total: "sociedades de bolsa autorizadas por la COSUMAF", map: "Seleccione una ciudad para filtrar", note: "Fuente: lista publicada en el sitio de la BVMAC. Datos de contacto por verificar con cada sociedad." },
  }[locale];

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <p className="flex items-baseline gap-3">
          <span className="font-serif-display text-6xl text-heading">{total}</span>
          <span className="max-w-48 text-sm text-muted">{L.total}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!country} onClick={() => pick("")} className={cn("h-10 rounded-full border px-4 text-sm transition-colors", !country ? "border-transparent bg-action text-action-text" : "border-line bg-surface hover:border-line-strong")}>
            {dict.common.allCountries}
          </button>
          {COUNTRIES.map((c) => (
            <button key={c.code} type="button" aria-pressed={country === c.code} onClick={() => pick(c.code)} className={cn("inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors", country === c.code ? "border-transparent bg-action text-action-text" : "border-line bg-surface hover:border-line-strong")}>
              <Flag code={c.code} />
              {c[locale]} <span className="figure opacity-60">{totals[c.code]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <aside className="h-fit lg:sticky lg:top-40">
          <RealMap
            label={L.map}
            center={[3, 13]}
            zoom={5}
            className="aspect-[4/5] w-full rounded-[var(--radius-panel)] border border-line"
            onSelect={(name) => setCity(city === name ? "" : name)}
            markers={Object.entries(CITIES).map(([name, [lon, lat]]) => ({
              id: name,
              lat,
              lon,
              ...(() => {
                const count = brokers.filter((b) => b.city === name && (!country || b.country === country)).length;
                return { count, label: `${name} · ${count}` };
              })(),
              active: city === name || hoveredCity === name,
            }))}
          />
          <p className="mt-3 text-xs text-muted">{L.map}.</p>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-56 flex-1">
              <label htmlFor="sdb-search" className="sr-only">{L.search}</label>
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input id="sdb-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={L.search} className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
            </div>
            {city && (
              <button type="button" onClick={() => setCity("")} className="inline-flex h-11 items-center gap-2 rounded-full bg-accent-soft px-4 text-sm text-accent-text">
                <MapPin aria-hidden="true" className="size-4" />{city}<X aria-label={dict.common.clearFilters} className="size-4" />
              </button>
            )}
          </div>
          <p role="status" className="mb-4 text-sm text-muted">{filtered.length} {L.shown} {total}</p>
          {filtered.length === 0 ? (
            <EmptyState message={dict.common.noResults} action={<button type="button" className="link text-sm" onClick={() => { pick(""); setQuery(""); }}>{dict.common.clearFilters}</button>} />
          ) : (
            <motion.ul layout className="grid gap-4 md:grid-cols-2">
              <AnimatePresence initial={false}>
                {filtered.map((b) => (
                  <motion.li key={b.name} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <article
                      onMouseEnter={() => setHovered(b.name)}
                      onMouseLeave={() => setHovered(null)}
                      className={cn("flex h-full flex-col rounded-[var(--radius-card)] border bg-surface p-5 transition-all duration-300", city === b.city || hovered === b.name ? "border-brand-gold shadow-soft" : "border-line")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-medium text-heading">{b.name}</h2>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs">
                          <Flag code={b.country} />{b.city}
                        </span>
                      </div>
                      <p className="mt-3 flex gap-2 text-sm text-muted">
                        <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} />{b.address}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Services">
                        {SERVICES.map((s) => <li key={s} className="rounded-full bg-surface-alt px-2.5 py-0.5 text-[0.7rem] text-muted">{s}</li>)}
                      </ul>
                      <p className="mt-auto border-t border-line pt-3 text-xs text-muted">
                        {L.approval} <span className="code">{b.approval}</span> {L.since} {formatDate(b.approvedOn, locale, "short")}
                      </p>
                    </article>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
          <p className="mt-6 text-xs text-muted">{L.note}</p>
        </div>
      </div>
    </div>
  );
}
