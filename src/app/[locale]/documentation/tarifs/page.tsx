import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { DOCUMENTS } from "@/data/content";
import { ContentPage } from "@/components/content/ContentPage";
import { DocumentLibrary } from "@/components/content/DocumentLibrary";

const INTRO = {
  fr: "Textes relatifs à la tarification du marché financier.",
  en: "Documents on financial market tariffs.",
  es: "Textos relativos a las tarifas del mercado financiero.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/documentation/tarifs">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.tariffs);
}

export default async function DocsPage({ params }: PageProps<"/[locale]/documentation/tarifs">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="news" title={dict.nav.items.tariffs} frenchBody={false} intro={INTRO[locale]}>
      <DocumentLibrary docs={DOCUMENTS.filter((d) => d.category === "tariff")} />
    </ContentPage>
  );
}
