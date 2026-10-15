import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ORG_CHART, type OrgUnit } from "@/data/institution";
import type { Locale } from "@/i18n/config";
import { tc } from "@/i18n/content";
import { ContentPage } from "@/components/content/ContentPage";
import { OrgChart } from "@/components/about/OrgChart";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/organigramme">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.orgchart);
}

const INTRO = {
  fr: "Directions et services de la BVMAC. Sélectionnez une unité pour voir ses missions.",
  en: "BVMAC departments and units. Select a unit to see its responsibilities.",
  es: "Direcciones y servicios de la BVMAC. Seleccione una unidad para ver sus funciones.",
};

function translate(u: OrgUnit, locale: Locale): OrgUnit {
  return { title: tc(u.title, locale), text: u.text && tc(u.text, locale), children: u.children?.map((c) => translate(c, locale)) };
}

export default async function OrgChartPage({ params }: PageProps<"/[locale]/la-bvmac/organigramme">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.orgchart} intro={INTRO[locale]}>
      <OrgChart root={translate(ORG_CHART, locale)} />
    </ContentPage>
  );
}
