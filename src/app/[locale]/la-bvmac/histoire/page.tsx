import type { Metadata } from "next";
import { tc } from "@/i18n/content";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getTimeline } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { ScrollTimeline } from "@/components/about/ScrollTimeline";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/histoire">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.history);
}

const INTRO = {
  fr: "Trente ans de construction d’une place boursière commune aux six pays de la CEMAC.",
  en: "Thirty years building a stock exchange shared by the six CEMAC countries.",
  es: "Treinta años construyendo una plaza bursátil común a los seis países de la CEMAC.",
};

export default async function HistoryPage({ params }: PageProps<"/[locale]/la-bvmac/histoire">) {
  const { locale, dict } = await resolveLocale(params);
  const timeline = await getTimeline();
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.history} intro={INTRO[locale]}>
      <ScrollTimeline items={timeline.map((i) => ({ date: tc(i.date, locale), title: tc(i.title, locale), text: tc(i.text, locale) }))} />
    </ContentPage>
  );
}
