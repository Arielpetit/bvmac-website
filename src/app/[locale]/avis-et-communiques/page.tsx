import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getNotices } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { NoticeLibrary } from "@/components/content/NoticeLibrary";
import { Reveal } from "@/components/motion/Reveal";

const INTRO = {
  fr: "Avis de la BVMAC, communiqués, décisions du Comité d’Admission et de Développement, convocations d’assemblées et opérations sur titres. Chaque publication a une adresse permanente.",
  en: "BVMAC notices, releases, decisions of the Admission and Development Committee, meeting notices and corporate actions. Each publication has a permanent address.",
  es: "Avisos de la BVMAC, comunicados, decisiones del Comité de Admisión y Desarrollo, convocatorias y operaciones sobre valores. Cada publicación tiene una dirección permanente.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/avis-et-communiques">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.notices);
}

export default async function NoticesPage({ params }: PageProps<"/[locale]/avis-et-communiques">) {
  const { locale, dict } = await resolveLocale(params);
  const notices = await getNotices();
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.notices} intro={INTRO[locale]}>
      <Reveal><NoticeLibrary notices={notices} /></Reveal>
    </ContentPage>
  );
}
