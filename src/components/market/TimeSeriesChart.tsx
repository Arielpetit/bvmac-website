"use client";

import { useId, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "@/i18n/provider";
import { formatDate, formatFcfa, formatNumber } from "@/lib/format";
import type { Point } from "@/data/series";
import { cn } from "@/lib/cn";

const RANGES = [
  { key: "1M", days: 22 },
  { key: "3M", days: 66 },
  { key: "6M", days: 130 },
  { key: "1A", days: 260 },
  { key: "Tout", days: Infinity },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

// Line (area) or bar chart with range chips, a text summary and a data-table alternative.
export function TimeSeriesChart({
  data,
  title,
  unit = "price",
  height = 320,
  type = "area",
  defaultRange = "6M",
  note,
}: {
  data: Point[];
  title: string;
  unit?: "price" | "fcfa";
  height?: number;
  type?: "area" | "bar";
  defaultRange?: RangeKey;
  note?: string;
}) {
  const { locale, dict } = useI18n();
  const [range, setRange] = useState<RangeKey>(defaultRange);
  const [showTable, setShowTable] = useState(false);
  const gid = useId().replace(/:/g, "");

  const points = useMemo(() => {
    const days = RANGES.find((r) => r.key === range)?.days ?? Infinity;
    return Number.isFinite(days) ? data.slice(-days) : data;
  }, [data, range]);

  const first = points[0]?.value ?? 0;
  const last = points[points.length - 1]?.value ?? 0;
  const delta = first ? ((last - first) / first) * 100 : 0;
  const fmtAxis = (v: number) => (unit === "fcfa" ? (v >= 1e9 ? formatNumber(v / 1e9, locale, 0) : formatNumber(v / 1e6, locale, 1)) : formatNumber(v, locale));
  const fmtFull = (v: number) => (unit === "fcfa" ? formatFcfa(v, locale) : `${formatNumber(v, locale)} FCFA`);
  const rangeLabel = { fr: "Période", en: "Period", es: "Periodo" }[locale];
  const allLabel = { fr: "Tout", en: "All", es: "Todo" }[locale];
  const axisNote = unit === "fcfa" ? (data.some((p) => p.value >= 1e9) ? { fr: "Milliards de FCFA", en: "FCFA billions", es: "Miles de millones de FCFA" }[locale] : { fr: "Millions de FCFA", en: "FCFA millions", es: "Millones de FCFA" }[locale]) : "FCFA";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label={rangeLabel} className="inline-flex rounded-full border border-line bg-surface p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              aria-pressed={range === r.key}
              onClick={() => setRange(r.key)}
              className={cn("h-8 min-w-11 rounded-full px-3 text-xs font-medium transition-colors", range === r.key ? "bg-action text-action-text" : "text-muted hover:text-heading")}
            >
              {r.key === "Tout" ? allLabel : r.key}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">
          {fmtFull(first)} → <span className="text-heading">{fmtFull(last)}</span>{" "}
          <span className={cn("figure", delta > 0 ? "text-rise" : delta < 0 ? "text-fall" : "")}>
            ({delta > 0 ? "▲ +" : delta < 0 ? "▼ −" : "■ "}
            {formatNumber(Math.abs(delta), locale, 2)} %)
          </span>
        </p>
      </div>
      <figure aria-label={title} className="rounded-[var(--radius-card)] border border-line bg-surface p-4 md:p-5">
        <div style={{ height }} aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={points} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="date" tickFormatter={(d: string) => formatDate(d, locale, "short").replace(/ \d{4}$/, "")} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "var(--line)" }} minTickGap={40} />
                <YAxis tickFormatter={fmtAxis} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} width={52} />
                <Tooltip cursor={{ fill: "var(--surface-alt)" }} contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, color: "var(--text)", fontSize: 12 }} labelFormatter={(d) => formatDate(String(d), locale, "short")} formatter={(v) => [fmtFull(Number(v)), title]} />
                <Bar dataKey="value" fill="var(--chart-fill)" radius={[4, 4, 0, 0]} isAnimationActive />
              </BarChart>
            ) : (
              <AreaChart data={points} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-fill)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--chart-fill)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="date" tickFormatter={(d: string) => formatDate(d, locale, "short").replace(/ \d{4}$/, "")} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "var(--line)" }} minTickGap={48} />
                <YAxis domain={["auto", "auto"]} tickFormatter={fmtAxis} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} width={unit === "fcfa" ? 52 : 64} />
                <Tooltip cursor={{ stroke: "var(--text-muted)", strokeDasharray: "3 3" }} contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, color: "var(--text)", fontSize: 12 }} labelFormatter={(d) => formatDate(String(d), locale, "short")} formatter={(v) => [fmtFull(Number(v)), title]} />
                <Area type="monotone" dataKey="value" stroke="var(--chart-price)" strokeWidth={2} fill={`url(#${gid})`} isAnimationActive animationDuration={900} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        <figcaption className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted">
          <span>{axisNote}</span>
          {note && <span>{note}</span>}
        </figcaption>
      </figure>
      <button type="button" aria-expanded={showTable} onClick={() => setShowTable((s) => !s)} className="link mt-3 text-sm">
        {showTable ? dict.market.hideTable : dict.market.viewTable}
      </button>
      {showTable && (
        <div className="mt-3 max-h-80 overflow-auto rounded-[var(--radius-card)] border border-line" data-lenis-prevent>
          <table className="w-full text-sm">
            <caption className="sr-only">{title}</caption>
            <thead className="sticky top-0 bg-surface-alt">
              <tr className="text-xs uppercase tracking-[0.1em] text-muted">
                <th scope="col" className="px-4 py-2.5 text-left font-medium">Date</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">{title}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {points.slice().reverse().map((p) => (
                <tr key={p.date}>
                  <td className="px-4 py-2">{formatDate(p.date, locale, "numeric")}</td>
                  <td className="figure px-4 py-2 text-right">{fmtFull(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
