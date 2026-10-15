import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getEquities, getPriceHistory } from "@/lib/api";
import { LAST_SESSION } from "@/data/market";
import { PageHeader } from "@/components/ui/PageHeader";
import { SessionChip } from "@/components/layout/SessionChip";
import { EquityTable } from "@/components/market/EquityTable";
import { Reveal } from "@/components/motion/Reveal";

const T = {
  fr: "Les cours de clôture, quantités et statut de chaque action cotée, tels que publiés par la BVMAC. Sélectionnez une valeur pour sa fiche complète.",
  en: "Closing prices, quantities and status of every listed share, as published by BVMAC. Select a security for its full page.",
  es: "Cotizaciones de cierre, cantidades y estado de cada acción cotizada, publicados por la BVMAC. Seleccione un valor para ver su ficha.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/marches/actions">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.equities);
}

export default async function EquitiesPage({ params }: PageProps<"/[locale]/marches/actions">) {
  const { locale, dict } = await resolveLocale(params);
  const rows = await getEquities();
  const sparks = Object.fromEntries(await Promise.all(rows.map(async (r) => [r.slug, await getPriceHistory(r.slug, 60)] as const)));
  return (
    <>
      <PageHeader title={dict.nav.items.equities} intro={T[locale]} meta={<SessionChip />} />
      <Reveal className="container-site pt-10 pb-14 md:pt-12 md:pb-20">
        <EquityTable rows={rows} sparks={sparks} asOf={LAST_SESSION} />
      </Reveal>
    </>
  );
}
