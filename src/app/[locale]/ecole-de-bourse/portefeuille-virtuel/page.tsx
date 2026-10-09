import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getEquities } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { Simulator } from "@/components/market/LazyCharts";

export async function generateMetadata({ params }: PageProps<"/[locale]/ecole-de-bourse/portefeuille-virtuel">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.portfolio);
}

export default async function PortfolioPage({ params }: PageProps<"/[locale]/ecole-de-bourse/portefeuille-virtuel">) {
  const { locale, dict } = await resolveLocale(params);
  const quotes = (await getEquities()).map((e) => ({ slug: e.slug, shortName: e.shortName, closePrice: e.closePrice, change: e.change, sector: e.sector }));
  return (
    <ContentPage locale={locale} dict={dict} group="learn" title={dict.nav.items.portfolio} intro="Entraînez-vous à composer un portefeuille avec 5 000 000 FCFA virtuels, sur les cours réels différés des valeurs cotées. Aucun ordre réel n'est transmis.">
      <Simulator quotes={quotes} />
    </ContentPage>
  );
}
