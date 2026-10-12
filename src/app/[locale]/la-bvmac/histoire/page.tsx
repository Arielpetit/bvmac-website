import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getTimeline } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { ScrollTimeline } from "@/components/about/ScrollTimeline";
import { Callout } from "@/components/ui/Callout";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/histoire">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.history);
}

export default async function HistoryPage({ params }: PageProps<"/[locale]/la-bvmac/histoire">) {
  const { locale, dict } = await resolveLocale(params);
  const timeline = await getTimeline();
  return (
    <ContentPage locale={locale} dict={dict} group="about" title={dict.nav.items.history} intro="Trente ans de construction d’une place boursière commune aux six pays de la CEMAC." image="/photos/ceremony-trading-floor-2.webp">
      <ScrollTimeline items={timeline} />
      <Callout tone="warning" className="mx-auto mt-16 max-w-3xl">Dates et intitulés à valider par la BVMAC avant publication.</Callout>
    </ContentPage>
  );
}
