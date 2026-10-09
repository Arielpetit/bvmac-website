import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { DOCUMENTS } from "@/data/content";
import { ContentPage } from "@/components/content/ContentPage";
import { DocumentLibrary } from "@/components/content/DocumentLibrary";

const INTRO = {
  fr: "Rapports et données économiques de la sous-région.",
  en: "Economic reports and data for the sub-region.",
  es: "Informes y datos económicos de la subregión.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/documentation/donnees-economiques">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.economic);
}

export default async function DocsPage({ params }: PageProps<"/[locale]/documentation/donnees-economiques">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="news" title={dict.nav.items.economic} frenchBody={false} intro={INTRO[locale]}>
      <DocumentLibrary docs={DOCUMENTS.filter((d) => d.category === "economic")} />
    </ContentPage>
  );
}
