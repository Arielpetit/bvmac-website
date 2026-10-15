import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { formatDate, formatFcfa } from "@/lib/format";
import { getBonds, getMarketSummary } from "@/lib/api";
import { LAST_SESSION } from "@/data/market";
import { PageHeader } from "@/components/ui/PageHeader";
import { SessionChip } from "@/components/layout/SessionChip";
import { BondTable } from "@/components/market/BondTable";
import { Reveal } from "@/components/motion/Reveal";

const T = {
  fr: (n: number, o: string) => `${n} lignes d’obligations d’États, d’institutions et d’entreprises sont cotées. Encours total : ${o}.`,
  en: (n: number, o: string) => `${n} government, institutional and corporate bond lines are listed. Total outstanding: ${o}.`,
  es: (n: number, o: string) => `${n} líneas de obligaciones de Estados, instituciones y empresas cotizan. Saldo total: ${o}.`,
};

export async function generateMetadata({ params }: PageProps<"/[locale]/marches/obligations">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.bonds);
}

export default async function BondsPage({ params }: PageProps<"/[locale]/marches/obligations">) {
  const { locale, dict } = await resolveLocale(params);
  const [bonds, summary] = await Promise.all([getBonds(), getMarketSummary()]);
  return (
    <>
      <PageHeader
        title={dict.nav.items.bonds}
        intro={T[locale](bonds.length, formatFcfa(summary.bondOutstanding, locale))}
        meta={<><SessionChip /><span className="text-sm text-muted">{dict.session.lastUpdate} : {formatDate(LAST_SESSION, locale)}</span></>}
      />
      <Reveal className="container-site pt-10 pb-14 md:pt-12 md:pb-20">
        <BondTable bonds={bonds} asOf={LAST_SESSION} />
      </Reveal>
    </>
  );
}
