import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getAlbums } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { PhotoGallery } from "@/components/content/PhotoGallery";

const INTRO = {
  fr: "Les grands moments de la BVMAC en images. Cliquez sur une photo pour l’agrandir ; utilisez les flèches du clavier pour naviguer.",
  en: "BVMAC’s key moments in pictures. Select a photo to enlarge it; use the arrow keys to navigate.",
  es: "Los grandes momentos de la BVMAC en imágenes. Seleccione una foto para ampliarla; use las flechas del teclado.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/actualites/phototheque">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.photos);
}

export default async function PhotosPage({ params }: PageProps<"/[locale]/actualites/phototheque">) {
  const { locale, dict } = await resolveLocale(params);
  const albums = await getAlbums();
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.photos} intro={INTRO[locale]}>
      <PhotoGallery albums={albums} />
    </ContentPage>
  );
}
