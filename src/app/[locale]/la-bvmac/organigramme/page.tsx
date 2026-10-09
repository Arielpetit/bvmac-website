import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ORG_CHART } from "@/data/institution";
import { ContentPage } from "@/components/content/ContentPage";
import { OrgChart } from "@/components/about/OrgChart";
import { Callout } from "@/components/ui/Callout";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/organigramme">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.orgchart);
}

export default async function OrgChartPage({ params }: PageProps<"/[locale]/la-bvmac/organigramme">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="about" title={dict.nav.items.orgchart} intro="Directions et services de la BVMAC. Sélectionnez une unité pour voir ses missions.">
      <OrgChart root={ORG_CHART} />
      <Callout tone="warning" className="mt-12">Structure indicative à remplacer par l’organigramme officiel de la BVMAC.</Callout>
    </ContentPage>
  );
}
