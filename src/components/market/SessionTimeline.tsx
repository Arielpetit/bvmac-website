"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { PHASES, currentPhase } from "@/lib/session";
import { cn } from "@/lib/cn";

const labels = {
  fr: { consult: "Consultation", preopen: "Préouverture", fixing: "Fixing", surveillance: "Intervention et surveillance", consultEnd: "Consultation de fin", post: "Post-séance", now: "En cours" },
  en: { consult: "Consultation", preopen: "Pre-opening", fixing: "Fixing", surveillance: "Intervention and surveillance", consultEnd: "End consultation", post: "Post-session", now: "Now" },
  es: { consult: "Consulta", preopen: "Preapertura", fixing: "Fixing", surveillance: "Intervención y vigilancia", consultEnd: "Consulta final", post: "Post-sesión", now: "Ahora" },
};

// Trading-day phases (Africa/Douala time) with the current phase highlighted.
export function SessionTimeline({ vertical = false }: { vertical?: boolean }) {
  const { locale } = useI18n();
  const t = labels[locale];
  const [phase, setPhase] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setPhase(currentPhase(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (vertical) {
    return (
      <ol className="relative grid gap-1 before:absolute before:bottom-6 before:left-[4.375rem] before:top-6 before:w-px before:bg-line sm:before:left-[5.75rem]">
        {PHASES.map((p) => {
          const active = phase === p.id;
          return (
            <li key={p.id} aria-current={active ? "step" : undefined} className={cn("relative grid grid-cols-[3.75rem_1.25rem_1fr] items-center gap-0 rounded-[var(--radius-control)] py-3 pr-3 sm:grid-cols-[5rem_1.5rem_1fr]", active && "bg-brand-gold-light/30 dark:bg-brand-gold/10")}>
              <span className="figure pl-3 text-sm text-heading">{p.start}</span>
              <span className={cn("relative z-10 mx-auto size-3 rounded-full border-2", active ? "border-brand-gold bg-brand-gold" : "border-line-strong bg-surface")} />
              <span className="flex items-center justify-between gap-3 pl-3">
                <span>
                  <span className="block font-medium text-heading">{t[p.id]}</span>
                  {p.end !== p.start && p.id !== "post" && <span className="figure text-xs text-muted">{p.start} – {p.end}</span>}
                </span>
                {active && <span className="shrink-0 whitespace-nowrap rounded-full bg-action px-2 py-0.5 text-[11px] font-semibold text-action-text">{t.now}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className="grid gap-2 md:grid-cols-6 md:gap-0">
      {PHASES.map((p, i) => {
        const active = phase === p.id;
        return (
          <li
            key={p.id}
            aria-current={active ? "step" : undefined}
            className={cn(
              "relative grid grid-cols-[6.25rem_1fr_auto] items-center gap-3 rounded-[var(--radius-control)] border p-3 md:flex md:flex-col md:items-start md:gap-2 md:rounded-none md:border-y md:border-l-0 md:border-r-0",
              active ? "border-brand-gold bg-brand-gold-light/30 dark:bg-brand-gold/10" : "border-line bg-surface",
              i === 0 && "md:rounded-l-[var(--radius-control)] md:border-l",
              i === PHASES.length - 1 && "md:rounded-r-[var(--radius-control)] md:border-r",
            )}
          >
            <span className="figure whitespace-nowrap text-sm text-heading">
              {p.start}
              {p.end !== p.start && p.id !== "post" ? `–${p.end}` : ""}
            </span>
            <span className="text-sm">{t[p.id]}</span>
            {active && (
              <span className="whitespace-nowrap rounded-full bg-action px-2 py-0.5 text-[11px] font-semibold text-action-text">{t.now}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
