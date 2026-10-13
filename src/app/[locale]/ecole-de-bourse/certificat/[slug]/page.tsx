import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/lib/i18n-server";
import { LESSONS, PATHS } from "@/data/school";
import { locales } from "@/i18n/config";
import { ContentPage } from "@/components/content/ContentPage";
import { Certificate } from "@/components/school/Certificate";


export function generateStaticParams() {
  return locales.flatMap((locale) => PATHS.map((p) => ({ locale, slug: p.slug })));
}

export const metadata: Metadata = { title: "Certificat", robots: { index: false } };

export default async function CertificatePage({ params }: PageProps<"/[locale]/ecole-de-bourse/certificat/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const path = PATHS.find((p) => p.slug === slug);
  if (!path) notFound();
  return (
    <ContentPage locale={locale} dict={dict} group="learn" title="Certificat de parcours" intro="Imprimez ou enregistrez en PDF votre certificat. Il est généré sur votre appareil.">
      <Certificate path={path} lessons={LESSONS.filter((l) => l.path === slug).map((l) => l.slug)} />
    </ContentPage>
  );
}
