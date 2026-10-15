import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getEquities } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { ListedCompanies } from "@/components/market/ListedCompanies";

const INTRO = {
  fr: "Les sociétés dont les actions sont admises à la cote de la BVMAC. Chaque fiche réunit cours, chiffres clés, états financiers et avis.",
  en: "Companies whose shares are listed on the BVMAC. Each page brings together prices, key figures, financial statements and notices.",
  es: "Sociedades cuyas acciones están admitidas a cotización en la BVMAC. Cada ficha reúne cotizaciones, cifras clave, estados financieros y avisos.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/societes-cotees">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.listed);
}

export default async function ListedPage({ params }: PageProps<"/[locale]/emetteurs/societes-cotees">) {
  const { locale, dict } = await resolveLocale(params);
  const equities = await getEquities();
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.listed} intro={INTRO[locale]}>
      <ListedCompanies equities={equities} />
      <p className="mt-6 text-xs text-muted">{dict.market.demo}.</p>
    </ContentPage>
  );
}
