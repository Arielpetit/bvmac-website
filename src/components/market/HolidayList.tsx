"use client";

import { useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/provider";
import { formatDate, formatDayMonth, ucfirst } from "@/lib/format";
import { tc } from "@/i18n/content";
import { cn } from "@/lib/cn";

const L = {
  fr: { next: "Prochain", past: "Passé" },
  en: { next: "Next", past: "Passed" },
  es: { next: "Próximo", past: "Pasado" },
};

// Holidays of the year; the next one is highlighted and past ones are dimmed (computed in the browser,
// so a page built earlier still shows the right state today).
export function HolidayList({ holidays }: { holidays: { date: string; fr: string }[] }) {
  const { locale } = useI18n();
  const l = L[locale];
  const today = useSyncExternalStore(noop, todayIso, () => null);
  const next = today ? holidays.find((h) => h.date >= today)?.date : undefined;

  return (
    <ul className="grid gap-x-8 sm:grid-cols-2">
      {holidays.map((h) => {
        const dm = formatDayMonth(h.date, locale);
        const past = !!today && h.date < today;
        const isNext = h.date === next;
        return (
          <li key={h.date} className={cn("flex items-center gap-4 border-b border-line py-3.5", past && "opacity-55")}>
            <time dateTime={h.date} className={cn("flex size-12 shrink-0 flex-col items-center justify-center rounded-xl", isNext ? "bg-espresso text-brand-gold-light" : "bg-accent-soft text-accent-text")}>
              <span className="font-serif-display text-lg leading-none">{dm.day}</span>
              <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider">{dm.month}</span>
            </time>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-heading">{tc(h.fr, locale)}</span>
              <span className="block text-xs text-muted">{ucfirst(formatDate(h.date, locale))}</span>
            </span>
            {isNext && <span className="rounded-full bg-brand-gold px-2.5 py-0.5 text-[11px] font-semibold text-espresso">{l.next}</span>}
            {past && <span className="text-[11px] text-muted">{l.past}</span>}
          </li>
        );
      })}
    </ul>
  );
}

const noop = () => () => {};
const todayIso = () => new Date().toISOString().slice(0, 10);
