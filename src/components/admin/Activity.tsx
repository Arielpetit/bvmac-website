"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { usePrefs, type B } from "./prefs";
import { RESOURCES } from "./resources";
import { PageTitle, cardCls, fmtDateTime } from "./ui";
import { cn } from "@/lib/cn";

export type LogRow = { id: number; at: string; actor: string | null; actor_email: string | null; table_name: string; action: string; label: string | null };

const INFO: B[] = [
  ["Chaque création, modification ou suppression est enregistrée automatiquement, avec son auteur et l’heure.", "Every creation, change or deletion is recorded automatically, with its author and time."],
  ["Le journal ne peut être ni modifié ni effacé depuis cet espace.", "The log can be neither edited nor erased from this area."],
  ["Utilisez-le pour retrouver qui a publié quoi, ou pour vérifier une erreur.", "Use it to find who published what, or to check a mistake."],
];
const EXTRA: Record<string, B> = { site_settings: ["Réglages", "Settings"], team: ["Équipe", "Team"] };

export function tableLabel(name: string): B {
  return RESOURCES.find((r) => r.table === name)?.label ?? EXTRA[name] ?? [name, name];
}
export const ACTIONS: Record<string, { icon: typeof Plus; label: B; cls: string }> = {
  insert: { icon: Plus, label: ["a ajouté", "added"], cls: "bg-rise-bg text-rise" },
  update: { icon: Pencil, label: ["a modifié", "edited"], cls: "bg-accent-soft text-accent-text" },
  delete: { icon: Trash2, label: ["a supprimé", "deleted"], cls: "bg-fall-bg text-fall" },
};

export function ActivityList({ rows, compact = false }: { rows: LogRow[]; compact?: boolean }) {
  const { tr, lang } = usePrefs();
  if (rows.length === 0) return <p className="p-6 text-sm text-muted">{tr(["Aucune activité pour l’instant.", "No activity yet."])}</p>;
  return (
    <ul className="divide-y divide-line">
      {rows.map((r) => {
        const a = ACTIONS[r.action] ?? ACTIONS.update;
        return (
          <li key={r.id} className={cn("flex items-center gap-3", compact ? "px-5 py-3" : "px-5 py-3.5")}>
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", a.cls)}><a.icon className="size-3.5" aria-hidden="true" /></span>
            <span className="min-w-0 flex-1 text-sm">
              <span className="font-medium text-heading">{r.actor_email?.split("@")[0] ?? tr(["Système", "System"])}</span> <span className="text-muted">{tr(a.label)}</span> <span className="text-heading">{r.label || "—"}</span>
              <span className="block text-xs text-muted">{tr(tableLabel(r.table_name))}</span>
            </span>
            <time className="shrink-0 text-xs text-muted">{fmtDateTime(r.at, lang)}</time>
          </li>
        );
      })}
    </ul>
  );
}

export function Activity() {
  const { tr } = usePrefs();
  const [rows, setRows] = useState<LogRow[] | null>(null);
  useEffect(() => {
    let live = true;
    getBrowserClient().from("audit_log").select("*").order("at", { ascending: false }).limit(200).then(({ data }) => live && setRows((data ?? []) as LogRow[]));
    return () => {
      live = false;
    };
  }, []);
  return (
    <div>
      <PageTitle title={tr(["Journal d’activité", "Activity log"])} hint={tr(["Les 200 dernières modifications.", "The last 200 changes."])} info={INFO} />
      <div className={cn(cardCls, "overflow-hidden")}>{rows === null ? <p className="flex items-center gap-2 p-6 text-sm text-muted"><Loader2 className="size-4 animate-spin" aria-hidden="true" /></p> : <ActivityList rows={rows} />}</div>
    </div>
  );
}
