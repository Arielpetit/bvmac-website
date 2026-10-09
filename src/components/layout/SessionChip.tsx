"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { sessionState, doualaTime, type SessionState } from "@/lib/session";
import { StatusDot } from "@/components/ui/Chip";

// Session state depends on the clock, so it is computed in the browser
// (Africa/Douala time) and refreshed every minute.
export function SessionChip({ className, withTime = true }: { className?: string; withTime?: boolean }) {
  const { dict } = useI18n();
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
      label={withTime && state !== "closed" ? `${label} · ${doualaTime(now)}` : label}
      className={className}
    />
  );
}
