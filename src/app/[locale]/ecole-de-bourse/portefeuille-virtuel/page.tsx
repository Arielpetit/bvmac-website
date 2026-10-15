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
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.portfolio} intro={{ fr: "Entraînez-vous à composer un portefeuille avec 5 000 000 FCFA virtuels, sur les cours réels différés des valeurs cotées. Aucun ordre réel n’est transmis.", en: "Practise building a portfolio with 5,000,000 virtual FCFA, using real delayed prices of listed securities. No real order is sent.", es: "Practique la composición de una cartera con 5 000 000 de FCFA virtuales, con las cotizaciones reales diferidas de los valores cotizados. No se transmite ninguna orden real." }[locale]}>
      <Simulator quotes={quotes} />
    </ContentPage>
  );
}
