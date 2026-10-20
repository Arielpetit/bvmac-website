"use client";

import { Download } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { formatFcfa, formatFcfaCompact } from "@/lib/format";
import { intlLocale } from "@/i18n/config";
import type { Point } from "@/data/series";

// Month-end capitalisation and monthly value traded, with CSV export.
export function MonthlyTable({ cap, traded }: { cap: Point[]; traded: Point[] }) {
  const { locale } = useI18n();
  const months = [...new Set(cap.map((p) => p.date.slice(0, 7)))].reverse();
  const rows = months.map((m) => ({
    month: m,
    cap: cap.filter((p) => p.date.startsWith(m)).at(-1)?.value ?? 0,
    traded: traded.filter((p) => p.date.startsWith(m)).reduce((s, p) => s + p.value, 0),
  }));
  const L = { fr: ["Mois", "Capitalisation fin de mois", "Valeur échangée du mois"], en: ["Month", "Month-end capitalisation", "Monthly value traded"], es: ["Mes", "Capitalización a fin de mes", "Valor negociado del mes"] }[locale];
  const name = (m: string) => new Intl.DateTimeFormat(intlLocale[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${m}-15T00:00:00Z`));

  function csv() {
    const body = rows.map((r) => `${r.month};${Math.round(r.cap)};${Math.round(r.traded)}`).join("\n");
    const url = URL.createObjectURL(new Blob([`﻿${L.join(";")}\n${body}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "bvmac-capitalisation-mensuelle.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={csv} className="inline-flex h-10 items-center gap-2 rounded-full bg-action px-4 text-sm font-medium text-action-text hover:bg-action-hover">
          <Download aria-hidden="true" className="size-4" strokeWidth={1.6} /> CSV
        </button>
      </div>
      <div className="relative overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface" data-lenis-prevent>
        <table className="w-full text-sm sm:min-w-[520px]">
          <caption className="sr-only">{L[1]}</caption>
          <thead className="bg-surface-alt">
            <tr className="text-xs uppercase tracking-[0.08em] text-muted">
              {L.map((h, i) => <th key={h} scope="col" className={`px-3 py-3.5 font-medium sm:px-5 ${i ? "text-right" : "text-left"}`}>{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.month}>
                <th scope="row" className="px-3 py-3 text-left font-normal capitalize sm:px-5">{name(r.month)}</th>
                <td className="figure whitespace-nowrap px-2 py-3 text-right text-[13px] sm:px-5 sm:text-sm"><span className="sm:hidden">{formatFcfaCompact(r.cap, locale)}</span><span className="hidden sm:inline">{formatFcfa(r.cap, locale)}</span></td>
                <td className="figure whitespace-nowrap px-2 py-3 text-right text-[13px] sm:px-5 sm:text-sm"><span className="sm:hidden">{formatFcfaCompact(r.traded, locale)}</span><span className="hidden sm:inline">{formatFcfa(r.traded, locale)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
