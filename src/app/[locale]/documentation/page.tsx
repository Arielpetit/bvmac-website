import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getDocuments } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { DocumentLibrary } from "@/components/content/DocumentLibrary";

const INTRO = {
  fr: "Textes législatifs et réglementaires du marché financier régional : CEMAC, UMAC, COSUMAF et BVMAC.",
  en: "Laws and regulations of the regional financial market: CEMAC, UMAC, COSUMAF and BVMAC.",
  es: "Textos legislativos y reglamentarios del mercado financiero regional: CEMAC, UMAC, COSUMAF y BVMAC.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/documentation">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.regulation);
}

export default async function DocsPage({ params }: PageProps<"/[locale]/documentation">) {
  const { locale, dict } = await resolveLocale(params);
  const documents = await getDocuments();
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.regulation} intro={INTRO[locale]}>
      <DocumentLibrary docs={documents.filter((d) => d.category === "regulation")} />
    </ContentPage>
  );
}
