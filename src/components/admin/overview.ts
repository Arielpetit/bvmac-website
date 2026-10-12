"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase/browser";
import { RESOURCES } from "./resources";
import type { LogRow } from "./Activity";
import type { B } from "./prefs";

export type Alert = { id: string; tone: "warn" | "info"; text: B; view: string };
export type Overview = {
  counts: Record<string, { total: number; drafts: number }>;
  latestBulletin: string | null;
  marketDate: string | null;
  recent: LogRow[];
  hasMfa: boolean;
  alerts: Alert[];
};

// Last weekday on which a session should already be published (after 16:00, today counts).
function expectedSession(now: Date) {
  const d = new Date(now);
  if (d.getHours() < 16) d.setDate(d.getDate() - 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function loadOverview(session: Session): Promise<Overview> {
  const db = getBrowserClient();
  const [tables, bulletin, market, recent, factors] = await Promise.all([
    Promise.all(RESOURCES.map(async (r) => {
      const { data } = await db.from(r.table).select("published").limit(2000);
      const rows = (data ?? []) as { published: boolean }[];
      return [r.key, { total: rows.length, drafts: rows.filter((x) => !x.published).length }] as const;
    })),
    db.from("bulletins").select("session_date").eq("published", true).order("session_date", { ascending: false }).limit(1).maybeSingle(),
    db.from("site_settings").select("value").eq("key", "market").maybeSingle(),
    db.from("audit_log").select("*").order("at", { ascending: false }).limit(12),
    db.auth.mfa.listFactors(),
  ]);
  const counts = Object.fromEntries(tables);
  const latestBulletin = (bulletin.data?.session_date as string | undefined) ?? null;
  const marketDate = ((market.data?.value as { date?: string } | undefined)?.date as string | undefined) ?? null;
  const hasMfa = (factors.data?.totp ?? []).some((f) => f.status === "verified");
  const rows = (recent.data ?? []) as LogRow[];

  const alerts: Alert[] = [];
  const expected = expectedSession(new Date());
  if (!latestBulletin || latestBulletin < expected) alerts.push({ id: "boc", tone: "warn", text: [`Le bulletin de la séance du ${expected.split("-").reverse().join("/")} n’est pas publié.`, `The bulletin for the ${expected.split("-").reverse().join("/")} session is not published.`], view: "bulletins" });
  if (latestBulletin && marketDate && marketDate < latestBulletin) alerts.push({ id: "market", tone: "warn", text: ["La synthèse de séance est plus ancienne que le dernier bulletin.", "The session summary is older than the latest bulletin."], view: "market" });
  if (!hasMfa) alerts.push({ id: "mfa", tone: "warn", text: ["Activez la double authentification sur votre compte.", "Turn on two-factor sign-in for your account."], view: "account" });
  for (const r of RESOURCES) {
    const n = counts[r.key]?.drafts ?? 0;
    if (n > 0) alerts.push({ id: `draft-${r.key}`, tone: "info", text: [`${n} brouillon(s) en attente : ${r.label[0]}.`, `${n} draft(s) waiting: ${r.label[1]}.`], view: r.key });
  }
  let seen = "";
  try {
    seen = localStorage.getItem("bvmac-admin-seen") ?? "";
  } catch {}
  const others = rows.filter((x) => x.actor !== session.user.id && x.at > seen).length;
  if (others > 0) alerts.push({ id: "activity", tone: "info", text: [`${others} modification(s) récente(s) par d’autres membres.`, `${others} recent change(s) by other members.`], view: "activity" });

  return { counts, latestBulletin, marketDate, recent: rows, hasMfa, alerts };
}

export function useOverview(session: Session) {
  const [data, setData] = useState<Overview | null>(null);
  const reload = useCallback(() => loadOverview(session).then(setData), [session]);
  useEffect(() => {
    let live = true;
    loadOverview(session).then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, [session]);
  return { data, reload };
}

export function markActivitySeen() {
  try {
    localStorage.setItem("bvmac-admin-seen", new Date().toISOString());
  } catch {}
}
