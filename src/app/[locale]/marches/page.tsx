import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileDown } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { crumbs, pageTitle } from "@/lib/page-helpers";
import { formatDate, formatFcfa, formatNumber } from "@/lib/format";
import { getBocArchive, getCapitalisationHistory, getMarketSummary, getMovers } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";
import { PriceChange } from "@/components/ui/PriceChange";
import { SessionChip } from "@/components/layout/SessionChip";
import { TimeSeriesChart } from "@/components/market/LazyCharts";
import { SessionTimeline } from "@/components/market/SessionTimeline";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { ButtonLink } from "@/components/ui/Button";

const T = {
  fr: { intro: "La situation du marché à l’issue de la dernière séance de cotation : capitalisation, échanges et valeurs les plus actives.", cards: ["Capitalisation actions", "Valeur échangée", "Encours obligataire", "Lignes cotées", "Valeurs échangées"], chart: "Capitalisation boursière (actions)", note: "Historique illustratif, dernier point officiel.", active: "Valeurs les plus actives", flat: "Séance stable : aucune variation de cours le 8 octobre 2026. Classement par quantité échangée.", phases: "Déroulement d’une séance", phasesNote: "Heure de Douala (UTC+1). Horaires publiés par la BVMAC, à confirmer.", boc: "Télécharger le BOC du jour", indices: "Indices", indicesText: "La BVMAC publiera ici ses indices de marché lorsqu’ils seront définis. La capitalisation et la valeur échangée servent aujourd’hui d’indicateurs." },
  en: { intro: "The market after the last trading session: capitalisation, trading and most active securities.", cards: ["Equity capitalisation", "Value traded", "Bonds outstanding", "Listed lines", "Securities traded"], chart: "Market capitalisation (equities)", note: "Illustrative history, last point official.", active: "Most active securities", flat: "Flat session: no price change on 8 October 2026. Ranked by quantity traded.", phases: "A trading session", phasesNote: "Douala time (UTC+1). Hours published by BVMAC, to be confirmed.", boc: "Download today’s BOC", indices: "Indices", indicesText: "BVMAC will publish its market indices here once defined. Capitalisation and value traded act as indicators today." },
  es: { intro: "El mercado tras la última sesión: capitalización, negociación y valores más activos.", cards: ["Capitalización acciones", "Valor negociado", "Saldo obligacionista", "Líneas cotizadas", "Valores negociados"], chart: "Capitalización bursátil (acciones)", note: "Histórico ilustrativo, último punto oficial.", active: "Valores más activos", flat: "Sesión estable: sin variación de precios el 8 de octubre de 2026. Clasificados por cantidad negociada.", phases: "Desarrollo de una sesión", phasesNote: "Hora de Duala (UTC+1). Horarios publicados por la BVMAC, por confirmar.", boc: "Descargar el BOC del día", indices: "Índices", indicesText: "La BVMAC publicará aquí sus índices cuando estén definidos. La capitalización y el valor negociado sirven hoy de indicadores." },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/marches">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.session);
}

export default async function MarketsPage({ params }: PageProps<"/[locale]/marches">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const [summary, history, movers, boc] = await Promise.all([getMarketSummary(), getCapitalisationHistory(400), getMovers(5), getBocArchive()]);
  const cards = [
    { value: summary.equityCapitalisation, kind: "fcfa-compact" as const },
    { value: summary.valueTraded, kind: "fcfa-compact" as const },
    { value: summary.bondOutstanding, kind: "fcfa-compact" as const },
    { value: summary.listedEquities + summary.listedBonds, kind: "number" as const },
    { value: summary.securitiesTraded, kind: "number" as const },
  ];

  return (
    <>
      <PageHeader
        group="markets"
        title={dict.nav.items.session}
        intro={t.intro}
        breadcrumbLabel={dict.a11y.breadcrumb}
        breadcrumb={crumbs(locale, dict, "markets")}
        meta={
          <>
            <SessionChip />
            <span className="text-sm text-muted">{dict.session.lastUpdate} : {formatDate(summary.date, locale)}</span>
            <ButtonLink href={boc[0].url} size="sm" variant="secondary" external><FileDown aria-hidden="true" className="size-4" />{t.boc}</ButtonLink>
          </>
        }
      />
      <div className="container-site grid gap-16 py-14 md:py-20">
        <Stagger as="dl" className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {cards.map((c, i) => (
            <StaggerItem key={i} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <dt className="text-sm text-muted">{t.cards[i]}</dt>
              <dd className="mt-3 font-serif-display text-2xl text-heading md:text-[1.65rem]"><CountUp value={c.value} kind={c.kind} /></dd>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <Reveal as="section">
            <h2 className="text-h2 mb-6">{t.chart}</h2>
            <TimeSeriesChart data={history} title={t.chart} unit="fcfa" note={t.note} defaultRange="1A" />
          </Reveal>
          <Reveal as="section" delay={0.1} className="grid content-start gap-5">
            <h2 className="text-h2">{t.active}</h2>
            {movers.flat && <p className="text-sm text-muted">{t.flat}</p>}
            <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
              {(movers.flat ? movers.active : [...movers.gainers, ...movers.losers]).map((e) => (
                <li key={e.slug}>
                  <Link href={localePath(locale, `/marches/actions/${e.slug}`)} className="group flex items-center justify-between gap-3 px-5 py-4 hover:bg-surface-alt/50">
                    <span>
                      <span className="block font-medium text-heading group-hover:text-link">{e.shortName}</span>
                      <span className="block text-xs text-muted">{formatNumber(e.qtyTraded, locale)} · {e.sector}</span>
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="text-right">
                        <span className="figure block">{formatNumber(e.closePrice, locale)}</span>
                        <PriceChange value={e.change} locale={locale} className="text-xs" />
                      </span>
                      <ArrowUpRight aria-hidden="true" className="size-4 text-muted" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Callout title={t.indices}>{t.indicesText}</Callout>
          </Reveal>
        </div>

        <Reveal as="section">
          <h2 className="text-h2">{t.phases}</h2>
          <p className="mb-6 mt-2 text-sm text-muted">{t.phasesNote}</p>
          <SessionTimeline />
        </Reveal>
        <p className="text-xs text-muted">{dict.common.disclaimer} {formatFcfa(summary.equityCapitalisation, locale)} · {formatDate(summary.date, locale)}.</p>
      </div>
    </>
  );
}
