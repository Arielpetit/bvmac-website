"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, FileDown } from "lucide-react";
import { CompanyMark } from "@/components/brand/CompanyMark";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { formatDate, formatFcfaCompact, formatNumber } from "@/lib/format";
import { CountUp } from "@/components/motion/CountUp";
import type { Point } from "@/data/series";

type Row = { slug: string; shortName: string; sector: string; closePrice: number; dividend: number };

const L = {
  fr: { cap: "Capitalisation boursière", session: "Séance du", traded: "Valeur échangée", bonds: "Encours obligataire", listed: "Titres cotés", listedValue: (e: number, b: number) => `${e} actions · ${b} obl.`, yields: "Rendement du dernier dividende", boc: "Bulletin officiel", all: "Tous les cours", trend: "Tendance 120 séances" },
  en: { cap: "Market capitalisation", session: "Session of", traded: "Value traded", bonds: "Bonds outstanding", listed: "Listed securities", listedValue: (e: number, b: number) => `${e} shares · ${b} bonds`, yields: "Last dividend yield", boc: "Official bulletin", all: "All prices", trend: "120-session trend" },
  es: { cap: "Capitalización bursátil", session: "Sesión del", traded: "Valor negociado", bonds: "Saldo obligacionista", listed: "Valores cotizados", listedValue: (e: number, b: number) => `${e} acciones · ${b} oblig.`, yields: "Rentabilidad del último dividendo", boc: "Boletín oficial", all: "Todas las cotizaciones", trend: "Tendencia 120 sesiones" },
};

// Downsample lightly + minimal smoothing: shows realistic market fluctuation.
function smoothPath(values: number[], w: number, h: number, pad: number) {
  const step = Math.max(1, Math.floor(values.length / 60));
  const sampled: number[] = [];
  for (let i = 0; i < values.length; i += step) {
    const win = values.slice(Math.max(0, i - 1), i + 2);
    sampled.push(win.reduce((a, b) => a + b, 0) / win.length);
  }
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const pts = sampled.map((v, i) => [(i / (sampled.length - 1)) * w, h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)] as const);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return { d, last: pts[pts.length - 1] };
}

export function HeroMarketCard({
  history,
  capitalisation,
  traded,
  bonds,
  equitiesCount,
  bondsCount,
  rows,
  date,
  bocUrl,
}: {
  history: Point[];
  capitalisation: number;
  traded: number;
  bonds: number;
  equitiesCount: number;
  bondsCount: number;
  rows: Row[];
  date: string;
  bocUrl: string;
}) {
  const { locale } = useI18n();
  const t = L[locale];
  const W = 400;
  const H = 120;
  const { d, last } = smoothPath(history.map((p) => p.value), W, H, 14);
  const maxYield = Math.max(...rows.map((r) => r.dividend / r.closePrice));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      className="relative overflow-hidden rounded-[var(--radius-panel)] bg-gradient-to-b from-white/[0.09] to-white/[0.03] p-6 text-brand-sand shadow-[0_50px_120px_-40px_rgb(0_0_0/0.9)] ring-1 ring-white/12 backdrop-blur-xl md:p-7"
    >
      <span aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
      <span aria-hidden="true" className="absolute -right-24 -top-24 size-64 rounded-full bg-brand-gold/15 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-brand-gold-light/80">{t.cap}</p>
          <p className="mt-2.5 flex items-baseline gap-2">
            <span className="font-serif-display text-[2.75rem] leading-none text-brand-ivory"><CountUp value={capitalisation} kind="billions" /></span>
            <span className="text-sm text-brand-sand/70">{locale === "en" ? "FCFA bn" : locale === "es" ? "mil M FCFA" : "Md FCFA"}</span>
          </p>
          <p className="mt-2 text-xs text-brand-sand/55">{t.session} {formatDate(date, locale, "short")}</p>
        </div>
        <a href={bocUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 text-xs text-brand-ivory ring-1 ring-white/15 transition-colors hover:bg-brand-gold hover:text-espresso hover:ring-transparent">
          <FileDown className="size-3.5" aria-hidden="true" />
          {t.boc}
        </a>
      </div>

      <div className="relative mt-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a23a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#c9a23a" stopOpacity="0" />
            </linearGradient>
            <filter id="hero-glow" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#fff" strokeOpacity="0.05" strokeDasharray="2 6" />)}
          <motion.path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#hero-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} />
          <motion.path d={d} fill="none" stroke="#c9a23a" strokeWidth="6" strokeOpacity="0.45" filter="url(#hero-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.6 }} />
          <motion.path d={d} fill="none" stroke="#ead18a" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.6 }} />
          <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.7, type: "spring" }} style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}>
            <circle cx={last[0]} cy={last[1]} r="9" fill="#ead18a" opacity="0.18" />
            <circle cx={last[0]} cy={last[1]} r="4" fill="#ead18a" stroke="#1c130b" strokeWidth="2" />
          </motion.g>
        </svg>
        <p className="mt-1 text-right text-[10px] uppercase tracking-[0.14em] text-brand-sand/40">{t.trend}</p>
      </div>

      <dl className="relative mt-4 grid divide-y divide-white/10 rounded-2xl bg-black/20 py-1.5 ring-1 ring-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-3.5">
        {[
          [t.traded, formatFcfaCompact(traded, locale)],
          [t.bonds, formatFcfaCompact(bonds, locale)],
          [t.listed, t.listedValue(equitiesCount, bondsCount)],
        ].map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 px-3.5 py-2 sm:block sm:py-0">
            <dt className="text-[10.5px] leading-tight text-brand-sand/55">{label}</dt>
            <dd className="figure text-[13px] font-medium text-brand-ivory sm:mt-1.5">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="relative mt-5 text-[11px] uppercase tracking-[0.14em] text-brand-sand/55">{t.yields}</p>
      <ul className="relative mt-2">
        {rows.map((r, i) => {
          const y = r.dividend / r.closePrice;
          return (
            <motion.li key={r.slug} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.08, duration: 0.6 }}>
              <Link href={localePath(locale, `/marches/actions/${r.slug}`)} className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.05]">
                <CompanyMark slug={r.slug} name={r.shortName} size="sm" />
                <span className="min-w-0">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-brand-ivory group-hover:text-brand-gold-light">{r.shortName}</span>
                    <span className="figure shrink-0 whitespace-nowrap text-xs text-brand-sand/60">{formatNumber(r.closePrice, locale)} FCFA</span>
                  </span>
                  <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.span className="block h-full rounded-full bg-gradient-to-r from-brand-gold-dark to-brand-gold-light" initial={{ width: 0 }} animate={{ width: `${(y / maxYield) * 100}%` }} transition={{ delay: 1.3 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }} />
                  </span>
                </span>
                <span className="figure w-14 text-right text-sm font-medium text-brand-gold-light">{formatNumber(y * 100, locale, 1)} %</span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
      <Link href={localePath(locale, "/marches/actions")} className="relative mt-3 inline-flex items-center gap-1 px-2 text-sm text-brand-gold-light hover:underline">
        {t.all} <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}
