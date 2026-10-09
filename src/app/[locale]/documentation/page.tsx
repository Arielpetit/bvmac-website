import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { DOCUMENTS } from "@/data/content";
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
  return (
    <ContentPage locale={locale} dict={dict} group="news" isGroupRoot title={dict.nav.items.regulation} frenchBody={false} intro={INTRO[locale]}>
      <DocumentLibrary docs={DOCUMENTS.filter((d) => d.category === "regulation")} />
    </ContentPage>
  );
}
