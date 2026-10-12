import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getDocuments } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { DocumentLibrary } from "@/components/content/DocumentLibrary";

const INTRO = {
  fr: "Rapports annuels et bilans boursiers de la BVMAC.",
  en: "BVMAC annual reports and market reviews.",
  es: "Informes anuales y balances bursátiles de la BVMAC.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/documentation/rapports">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.reports);
}

export default async function DocsPage({ params }: PageProps<"/[locale]/documentation/rapports">) {
  const { locale, dict } = await resolveLocale(params);
  const documents = await getDocuments();
  return (
    <ContentPage locale={locale} dict={dict} group="news" title={dict.nav.items.reports} frenchBody={false} intro={INTRO[locale]}>
      <DocumentLibrary docs={documents.filter((d) => d.category === "report")} />
    </ContentPage>
  );
}
