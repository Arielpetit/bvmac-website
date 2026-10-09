"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import type { Locale } from "@/i18n/config";
import { sessionState, doualaTime, type SessionState } from "@/lib/session";
import { StatusDot } from "@/components/ui/Chip";

// Session state depends on the clock, so it is computed in the browser
// (Africa/Douala time) and refreshed every minute.
// Next weekday session at 11:00 (Douala), as a short label.
function nextSession(now: Date, locale: Locale) {
  const d = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Douala" }));
  const minutes = d.getHours() * 60 + d.getMinutes();
  if (d.getDay() === 0 || d.getDay() === 6 || minutes >= 15 * 60 + 30) {
    do d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6);
  }
  const day = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d);
  return { fr: `prochaine séance ${day} 11:00`, en: `next session ${day} 11:00`, es: `próxima sesión ${day} 11:00` }[locale];
}

export function SessionChip({ className, withTime = true, withNext = false }: { className?: string; withTime?: boolean; withNext?: boolean }) {
  const { dict, locale } = useI18n();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <StatusDot state="closed" label={dict.session.closed} className={className} />;
  const state: SessionState = sessionState(now);
  const label = { open: dict.session.open, preopen: dict.session.preopen, closed: dict.session.closed }[state];
  return (
    <StatusDot
      state={state}
      label={state === "closed" ? (withNext ? `${label} · ${nextSession(now, locale)}` : label) : withTime ? `${label} · ${doualaTime(now)}` : label}
      className={className}
    />
  );
}
