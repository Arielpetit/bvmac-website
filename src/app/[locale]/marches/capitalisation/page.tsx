import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { formatDate } from "@/lib/format";
import { getCapitalisationHistory, getMarketSummary, getValueTradedHistory } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { TimeSeriesChart } from "@/components/market/LazyCharts";
import { MonthlyTable } from "@/components/market/MonthlyTable";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";

const T = {
  fr: { intro: "Évolution de la capitalisation du marché des actions et de la valeur échangée en séance.", cap: "Capitalisation boursière (actions)", traded: "Valeur échangée par séance", monthly: "Synthèse mensuelle", cards: ["Capitalisation actions", "Encours obligataire", "Valeur échangée (8 oct.)"], note: "Historique illustratif ; valeurs du 8 octobre 2026 officielles." },
  en: { intro: "Equity market capitalisation and value traded over time.", cap: "Market capitalisation (equities)", traded: "Value traded per session", monthly: "Monthly summary", cards: ["Equity capitalisation", "Bonds outstanding", "Value traded (8 Oct)"], note: "Illustrative history; 8 October 2026 figures are official." },
  es: { intro: "Evolución de la capitalización del mercado de acciones y del valor negociado.", cap: "Capitalización bursátil (acciones)", traded: "Valor negociado por sesión", monthly: "Síntesis mensual", cards: ["Capitalización acciones", "Saldo obligacionista", "Valor negociado (8 oct.)"], note: "Histórico ilustrativo; cifras del 8 de octubre de 2026 oficiales." },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/marches/capitalisation">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.capitalisation);
}

export default async function CapitalisationPage({ params }: PageProps<"/[locale]/marches/capitalisation">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const [summary, cap, traded] = await Promise.all([getMarketSummary(), getCapitalisationHistory(400), getValueTradedHistory(260)]);
  return (
    <>
      <PageHeader title={dict.nav.items.capitalisation} intro={t.intro} meta={<span className="text-sm text-muted">{dict.session.lastUpdate} : {formatDate(summary.date, locale)}</span>} />
      <div className="container-site grid gap-16 pt-10 pb-14 md:pt-12 md:pb-20">
        <Stagger as="dl" className="grid gap-4 md:grid-cols-3">
          {[summary.equityCapitalisation, summary.bondOutstanding, summary.valueTraded].map((v, i) => (
            <StaggerItem key={i} className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
              <dt className="text-sm text-muted">{t.cards[i]}</dt>
              <dd className="mt-3 font-serif-display text-3xl text-heading"><CountUp value={v} kind="fcfa-compact" /></dd>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal as="section"><h2 className="text-h2 mb-6">{t.cap}</h2><TimeSeriesChart data={cap} title={t.cap} unit="fcfa" defaultRange="1A" note={t.note} /></Reveal>
        <Reveal as="section"><h2 className="text-h2 mb-6">{t.traded}</h2><TimeSeriesChart data={traded} title={t.traded} unit="fcfa" type="bar" height={260} defaultRange="3M" note={t.note} /></Reveal>
        <Reveal as="section"><h2 className="text-h2 mb-6">{t.monthly}</h2><MonthlyTable cap={cap} traded={traded} /></Reveal>
      </div>
    </>
  );
}
