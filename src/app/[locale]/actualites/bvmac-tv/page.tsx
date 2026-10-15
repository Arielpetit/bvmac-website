import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getVideos } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { VideoGrid } from "@/components/content/VideoGrid";

const INTRO = {
  fr: "Cérémonies, reportages et pédagogie en vidéo. Les vidéos YouTube ne se chargent qu’avec votre accord.",
  en: "Ceremonies, reports and education on video. YouTube videos load only with your consent.",
  es: "Ceremonias, reportajes y pedagogía en vídeo. Los vídeos de YouTube solo se cargan con su consentimiento.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/actualites/bvmac-tv">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.tv);
}

export default async function TvPage({ params }: PageProps<"/[locale]/actualites/bvmac-tv">) {
  const { locale, dict } = await resolveLocale(params);
  const videos = await getVideos();
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.tv} intro={INTRO[locale]}>
      <VideoGrid videos={videos} />
    </ContentPage>
  );
}
