"use client";

import { AlertTriangle, ArrowUpRight, CalendarCheck, CheckCircle2, FileText, Info, LineChart, Loader2, Newspaper } from "lucide-react";
import { usePrefs, type B } from "./prefs";
import { RESOURCES } from "./resources";
import type { Overview } from "./overview";
import { ActivityList } from "./Activity";
import { PageTitle, cardCls, fmtDate } from "./ui";
import { cn } from "@/lib/cn";

const INFO: B[] = [
  ["Vue d’ensemble : ce qui reste à faire aujourd’hui, l’état du site et les dernières modifications.", "Overview: what is left to do today, the state of the site and the latest changes."],
  ["Routine après chaque séance : 1) déposer le bulletin, 2) mettre à jour les cours, 3) mettre à jour la synthèse de séance.", "Routine after each session: 1) upload the bulletin, 2) update prices, 3) update the session summary."],
  ["Cliquez sur une alerte ou une carte pour ouvrir la page concernée.", "Click an alert or a card to open the related page."],
];
const QUICK: { view: string; icon: typeof FileText; label: B; text: B }[] = [
  { view: "bulletins", icon: CalendarCheck, label: ["Déposer le bulletin du jour", "Upload today’s bulletin"], text: ["PDF du BOC de la séance", "Session BOC PDF"] },
  { view: "equities", icon: LineChart, label: ["Mettre à jour les cours", "Update prices"], text: ["Actions cotées", "Listed equities"] },
  { view: "notices", icon: FileText, label: ["Publier un avis", "Publish a notice"], text: ["Avis, communiqué, décision", "Notice, release, decision"] },
  { view: "news", icon: Newspaper, label: ["Publier une actualité", "Publish news"], text: ["Marché, institution, événement", "Market, institution, event"] },
];

export function Dashboard({ data, name, go }: { data: Overview | null; name: string; go: (view: string) => void }) {
  const { tr, lang } = usePrefs();
  return (
    <div>
      <PageTitle title={`${tr(["Bonjour", "Hello"])}${name ? `, ${name}` : ""}`} hint={tr(["Voici l’état du site aujourd’hui.", "Here is the state of the site today."])} info={INFO} />
      {data === null ? (
        <p className="flex items-center gap-2 text-sm text-muted"><Loader2 className="size-4 animate-spin" aria-hidden="true" />{tr(["Chargement…", "Loading…"])}</p>
      ) : (
        <div className="grid gap-6">
          <section aria-label={tr(["À faire", "To do"])} className={cn(cardCls, "overflow-hidden")}>
            <h2 className="border-b border-line px-5 py-3.5 text-sm font-semibold text-heading">{tr(["À faire", "To do"])}</h2>
            {data.alerts.length === 0 ? (
              <p className="flex items-center gap-3 p-5 text-sm text-rise"><CheckCircle2 className="size-5" aria-hidden="true" />{tr(["Tout est à jour.", "Everything is up to date."])}</p>
            ) : (
              <ul className="divide-y divide-line">
                {data.alerts.map((a) => (
                  <li key={a.id}>
                    <button type="button" onClick={() => go(a.view)} className="group flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm transition-colors hover:bg-surface-alt/60">
                      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", a.tone === "warn" ? "bg-accent-soft text-accent-text" : "bg-surface-alt text-muted")}>{a.tone === "warn" ? <AlertTriangle className="size-4" aria-hidden="true" /> : <Info className="size-4" aria-hidden="true" />}</span>
                      <span className="flex-1 text-heading">{tr(a.text)}</span>
                      <ArrowUpRight className="size-4 text-muted transition-transform group-hover:rotate-45 group-hover:text-heading" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label={tr(["Actions rapides", "Quick actions"])} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK.map((q) => (
              <button key={q.view} type="button" onClick={() => go(q.view)} className="card-lift group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 text-left">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent-text transition-colors group-hover:bg-action group-hover:text-action-text"><q.icon className="size-5" aria-hidden="true" /></span>
                <span className="mt-5 font-medium text-heading">{tr(q.label)}</span>
                <span className="mt-0.5 text-xs text-muted">{tr(q.text)}</span>
              </button>
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <section className={cn(cardCls, "overflow-hidden")}>
              <h2 className="border-b border-line px-5 py-3.5 text-sm font-semibold text-heading">{tr(["Contenus du site", "Site content"])}</h2>
              <ul className="grid sm:grid-cols-2">
                {RESOURCES.map((r) => {
                  const c = data.counts[r.key] ?? { total: 0, drafts: 0 };
                  return (
                    <li key={r.key} className="border-b border-line sm:odd:border-r">
                      <button type="button" onClick={() => go(r.key)} className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-surface-alt/60">
                        <span className="truncate text-heading">{tr(r.label)}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          {c.drafts > 0 && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-text">{c.drafts} {tr(["brouillon(s)", "draft(s)"])}</span>}
                          <span className="figure text-base text-heading">{c.total}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <dl className="grid grid-cols-2 gap-px bg-line text-sm">
                <div className="bg-surface px-5 py-4"><dt className="text-xs uppercase tracking-[0.1em] text-muted">{tr(["Dernier bulletin", "Latest bulletin"])}</dt><dd className="figure mt-1 text-heading">{data.latestBulletin ? fmtDate(data.latestBulletin, lang) : "—"}</dd></div>
                <div className="bg-surface px-5 py-4"><dt className="text-xs uppercase tracking-[0.1em] text-muted">{tr(["Synthèse de séance", "Session summary"])}</dt><dd className="figure mt-1 text-heading">{data.marketDate ? fmtDate(data.marketDate, lang) : "—"}</dd></div>
              </dl>
            </section>
            <section className={cn(cardCls, "overflow-hidden")}>
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <h2 className="text-sm font-semibold text-heading">{tr(["Activité récente", "Recent activity"])}</h2>
                <button type="button" onClick={() => go("activity")} className="text-xs text-link hover:underline">{tr(["Tout voir", "See all"])}</button>
              </div>
              <ActivityList rows={data.recent.slice(0, 7)} compact />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
