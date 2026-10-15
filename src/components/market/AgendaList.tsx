"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarPlus, LayoutGrid, List } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { formatDate, formatDayMonth } from "@/lib/format";
import { intlLocale } from "@/i18n/config";
import type { CorporateAction } from "@/data/market";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { tc } from "@/i18n/content";

const TYPES = {
  fr: { dividende: "Dividende", coupon: "Coupon", remboursement: "Remboursement", ag: "Assemblée générale", introduction: "Introduction", souscription: "Souscription", all: "Tous", allIssuers: "Tous les émetteurs", list: "Liste", grid: "Mois", export: "Exporter (.ics)", add: "Ajouter", notice: "Avis", upcoming: "À venir", past: "Passées" },
  en: { dividende: "Dividend", coupon: "Coupon", remboursement: "Redemption", ag: "General meeting", introduction: "Listing", souscription: "Subscription", all: "All", allIssuers: "All issuers", list: "List", grid: "Month", export: "Export (.ics)", add: "Add", notice: "Notice", upcoming: "Upcoming", past: "Past" },
  es: { dividende: "Dividendo", coupon: "Cupón", remboursement: "Amortización", ag: "Junta general", introduction: "Salida a bolsa", souscription: "Suscripción", all: "Todos", allIssuers: "Todos los emisores", list: "Lista", grid: "Mes", export: "Exportar (.ics)", add: "Añadir", notice: "Aviso", upcoming: "Próximas", past: "Pasadas" },
};
const KEYS = ["dividende", "coupon", "remboursement", "ag", "introduction", "souscription"] as const;

function ics(events: CorporateAction[]) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BVMAC//Agenda//FR"];
  events.forEach((e) => lines.push("BEGIN:VEVENT", `UID:${e.id}@bvmac.cm`, `DTSTART;VALUE=DATE:${e.date.replace(/-/g, "")}`, `SUMMARY:${e.issuer} – ${e.detail}`, "END:VEVENT"));
  lines.push("END:VCALENDAR");
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "bvmac-agenda.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function AgendaList({ events, today }: { events: CorporateAction[]; today: string }) {
  const { locale } = useI18n();
  const t = TYPES[locale];
  const [type, setType] = useState("");
  const [issuer, setIssuer] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const issuers = useMemo(() => [...new Set(events.map((e) => e.issuer))].sort(), [events]);
  const filtered = useMemo(() => events.filter((e) => (!type || e.type === type) && (!issuer || e.issuer === issuer)), [events, type, issuer]);
  const upcoming = filtered.filter((e) => (e.endDate ?? e.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = filtered.filter((e) => (e.endDate ?? e.date) < today);
  const months = useMemo(() => [...new Set(filtered.map((e) => e.date.slice(0, 7)))].sort().reverse(), [filtered]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Type" className="flex flex-wrap gap-2">
          {[["", t.all] as const, ...KEYS.map((k) => [k, t[k]] as const)].map(([key, label]) => (
            <button key={key || "all"} type="button" aria-pressed={type === key} onClick={() => setType(key)} className={cn("h-9 rounded-full border px-4 text-sm transition-colors", type === key ? "border-transparent bg-action text-action-text" : "border-line bg-surface hover:border-line-strong")}>
              {label}
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="ag-issuer">{t.allIssuers}</label>
        <select id="ag-issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} className="h-9 rounded-full border border-line bg-surface px-4 text-sm">
          <option value="">{t.allIssuers}</option>
          {issuers.map((i) => <option key={i} value={i}>{tc(i, locale)}</option>)}
        </select>
        <div className="ml-auto flex gap-2">
          <div role="group" aria-label="Vue" className="inline-flex rounded-full border border-line bg-surface p-1">
            {([["list", t.list, List], ["grid", t.grid, LayoutGrid]] as const).map(([key, label, Icon]) => (
              <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)} className={cn("inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm", view === key ? "bg-action text-action-text" : "text-muted")}>
                <Icon aria-hidden="true" className="size-4" strokeWidth={1.6} /> {label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => ics(filtered)} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm hover:border-line-strong">
            <CalendarPlus aria-hidden="true" className="size-4" strokeWidth={1.6} /> {t.export}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="—" />
      ) : view === "list" ? (
        <div className="grid gap-12">
          {[[t.upcoming, upcoming], [t.past, past]].map(([label, list]) =>
            (list as CorporateAction[]).length ? (
              <section key={label as string}>
                <h2 className="mb-4 font-serif-display text-2xl text-heading">{label as string}</h2>
                <ol className="grid gap-3">
                  {(list as CorporateAction[]).map((e) => <EventRow key={e.id} e={e} />)}
                </ol>
              </section>
            ) : null,
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {months.map((m) => (
            <MonthGrid key={m} month={m} events={filtered.filter((e) => e.date.startsWith(m))} />
          ))}
        </div>
      )}
    </div>
  );

  function EventRow({ e }: { e: CorporateAction }) {
    const dm = formatDayMonth(e.date, locale);
    return (
      <li className="flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4 transition-colors hover:border-line-strong">
        <time dateTime={e.date} className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-accent-soft text-accent-text">
          <span className="font-serif-display text-2xl leading-none">{dm.day}</span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider">{dm.month}</span>
        </time>
        <div className="min-w-0 flex-1 basis-48">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">{t[e.type]}</p>
          <p className="font-medium text-heading">{tc(e.issuer, locale)}</p>
          <p className="text-sm text-muted">
            {tc(e.detail, locale)}
            {e.endDate && ` · ${formatDate(e.date, locale, "short")} → ${formatDate(e.endDate, locale, "short")}`}
          </p>
        </div>
        <div className="flex w-full gap-2 pl-20 sm:w-auto sm:pl-0">
          {e.notice && <Link href={`/${locale}/avis-et-communiques/${e.notice}`} className="inline-flex h-9 items-center rounded-full border border-line px-3 text-sm hover:border-line-strong">{t.notice}</Link>}
          <button type="button" onClick={() => ics([e])} className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm text-link hover:bg-surface-alt">
            <CalendarPlus aria-hidden="true" className="size-4" strokeWidth={1.6} /> {t.add}
          </button>
        </div>
      </li>
    );
  }

  function MonthGrid({ month, events: evs }: { month: string; events: CorporateAction[] }) {
    const first = new Date(`${month}-01T12:00:00Z`);
    const offset = (first.getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    const title = new Intl.DateTimeFormat(intlLocale[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
    const byDay = new Map<number, CorporateAction[]>();
    evs.forEach((e) => byDay.set(Number(e.date.slice(8)), [...(byDay.get(Number(e.date.slice(8))) ?? []), e]));
    const dow = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(intlLocale[locale], { weekday: "narrow", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + i))));
    return (
      <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
        <h3 className="font-serif-display text-xl capitalize text-heading">{title}</h3>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
          {dow.map((d, i) => <span key={i} className="pb-1 text-muted">{d}</span>)}
          {Array.from({ length: offset }).map((_, i) => <span key={`o${i}`} />)}
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
            const list = byDay.get(d);
            return (
              <span key={d} title={list?.map((e) => `${e.issuer} – ${t[e.type]}`).join("\n")} className={cn("flex aspect-square items-center justify-center rounded-lg", list ? "bg-brand-gold font-medium text-espresso" : "text-muted")}>
                {d}
                {list && <span className="sr-only">: {list.map((e) => `${e.issuer}, ${t[e.type]}`).join("; ")}</span>}
              </span>
            );
          })}
        </div>
        <ul className="mt-4 grid gap-1.5 text-sm">
          {evs.map((e) => (
            <li key={e.id} className="flex gap-2"><span className="figure text-muted">{e.date.slice(8)}</span><span className="text-heading">{e.issuer}</span><span className="text-muted">· {t[e.type]}</span></li>
          ))}
        </ul>
      </section>
    );
  }
}
