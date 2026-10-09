"use client";

import Link from "next/link";
import { CompanyMark } from "@/components/brand/CompanyMark";
import { motion } from "motion/react";
import { ArrowUpRight, FileDown } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { formatDate, formatFcfaCompact, formatNumber } from "@/lib/format";
import { PriceChange } from "@/components/ui/PriceChange";
import { CountUp } from "@/components/motion/CountUp";
import type { Point } from "@/data/series";

type Row = { slug: string; shortName: string; sector: string; closePrice: number; change: number };

const L = {
  fr: { cap: "Capitalisation boursière", session: "Séance du", traded: "Valeur échangée", bonds: "Encours obligataire", listed: "Lignes cotées", securities: "Valeurs du jour", boc: "Bulletin officiel", all: "Tous les cours" },
  en: { cap: "Market capitalisation", session: "Session of", traded: "Value traded", bonds: "Bonds outstanding", listed: "Listed lines", securities: "Today’s securities", boc: "Official bulletin", all: "All prices" },
  es: { cap: "Capitalización bursátil", session: "Sesión del", traded: "Valor negociado", bonds: "Saldo obligacionista", listed: "Líneas cotizadas", securities: "Valores del día", boc: "Boletín oficial", all: "Todas las cotizaciones" },
};

// Glass market card in the hero: capitalisation with an animated chart,
// key figures and a short list of securities.
export function HeroMarketCard({
  history,
  capitalisation,
  traded,
  bonds,
  lines,
  rows,
  date,
  bocUrl,
}: {
  history: Point[];
  capitalisation: number;
  traded: number;
  bonds: number;
  lines: number;
  rows: Row[];
  date: string;
  bocUrl: string;
}) {
  const { locale } = useI18n();
  const t = L[locale];
  const values = history.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 400, 110 - ((v - min) / span) * 90] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L400,120 L0,120 Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      className="glass-dark relative overflow-hidden rounded-[var(--radius-panel)] p-6 text-brand-sand shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)] md:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-brand-sand/60">{t.cap}</p>
          <p className="mt-2 font-serif-display text-[2.6rem] leading-none text-brand-ivory">
            <CountUp value={capitalisation} kind="billions" />
            <span className="ml-2 font-sans text-base text-brand-sand/70">{locale === "en" ? "bn" : locale === "es" ? "mil M" : "Md"} FCFA</span>
          </p>
          <p className="mt-2 text-xs text-brand-sand/60">
            {t.session} {formatDate(date, locale)}
          </p>
        </div>
        <a href={bocUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs text-brand-ivory transition-colors hover:border-brand-gold hover:text-brand-gold-light">
          <FileDown className="size-3.5" aria-hidden="true" />
          {t.boc}
        </a>
      </div>

      <svg viewBox="0 0 400 120" className="mt-5 h-28 w-full" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a23a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c9a23a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={area} fill="url(#hero-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }} />
        <motion.path
          d={line}
          fill="none"
          stroke="#ead18a"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.6 }}
        />
      </svg>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-white/10 py-4">
        {[
          [t.traded, formatFcfaCompact(traded, locale)],
          [t.bonds, formatFcfaCompact(bonds, locale)],
          [t.listed, formatNumber(lines, locale)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] text-brand-sand/55">{label}</dt>
            <dd className="figure mt-1 text-sm text-brand-ivory">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-brand-sand/55">{t.securities}</p>
      <ul className="mt-2 divide-y divide-white/8">
        {rows.map((r, i) => (
          <motion.li key={r.slug} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.08, duration: 0.6 }}>
            <Link href={localePath(locale, `/marches/actions/${r.slug}`)} className="group flex items-center justify-between gap-3 py-2.5">
              <span className="flex items-center gap-3">
                <CompanyMark slug={r.slug} name={r.shortName} size="sm" />
                <span>
                <span className="block text-sm font-medium text-brand-ivory group-hover:text-brand-gold-light">{r.shortName}</span>
                <span className="block text-xs text-brand-sand/50">{r.sector}</span>
                </span>
              </span>
              <span className="text-right">
                <span className="figure block text-sm text-brand-ivory">{formatNumber(r.closePrice, locale)}</span>
                <PriceChange value={r.change} locale={locale} tone="onDark" className="text-[11px]" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
      <Link href={localePath(locale, "/marches/actions")} className="mt-3 inline-flex items-center gap-1 text-sm text-brand-gold-light hover:underline">
        {t.all} <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}
