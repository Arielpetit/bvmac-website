import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getNews } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { NewsList } from "@/components/content/NewsList";

const INTRO = {
  fr: "Introductions en bourse, emprunts obligataires, cérémonies et vie de l’institution. Les appels d’offres sont publiés dans une rubrique dédiée.",
  en: "Listings, bond issues, ceremonies and life of the institution. Tenders are published in a dedicated section.",
  es: "Salidas a bolsa, empréstitos, ceremonias y vida de la institución. Las licitaciones se publican en una sección propia.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/actualites">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.newsList);
}

export default async function NewsPage({ params }: PageProps<"/[locale]/actualites">) {
  const { locale, dict } = await resolveLocale(params);
  const news = await getNews();
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.newsList} intro={INTRO[locale]}>
      <NewsList items={news} />
    </ContentPage>
  );
}
