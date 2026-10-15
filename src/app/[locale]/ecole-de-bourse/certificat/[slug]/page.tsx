import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/lib/i18n-server";
import { PATHS, schoolContent } from "@/data/school";
import { locales } from "@/i18n/config";
import { ContentPage } from "@/components/content/ContentPage";
import { Certificate } from "@/components/school/Certificate";


export function generateStaticParams() {
  return locales.flatMap((locale) => PATHS.map((p) => ({ locale, slug: p.slug })));
}

export const metadata: Metadata = { title: "Certificat", robots: { index: false } };

const T = {
  fr: { title: "Certificat de parcours", intro: "Imprimez ou enregistrez en PDF votre certificat. Il est généré sur votre appareil." },
  en: { title: "Path certificate", intro: "Print your certificate or save it as a PDF. It is generated on your device." },
  es: { title: "Certificado de recorrido", intro: "Imprima o guarde en PDF su certificado. Se genera en su dispositivo." },
};

export default async function CertificatePage({ params }: PageProps<"/[locale]/ecole-de-bourse/certificat/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const content = schoolContent(locale);
  const path = content.paths.find((p) => p.slug === slug);
  if (!path) notFound();
  return (
    <ContentPage locale={locale} dict={dict} title={T[locale].title} intro={T[locale].intro}>
      <Certificate path={path} lessons={content.lessons.filter((l) => l.path === slug).map((l) => l.slug)} />
    </ContentPage>
  );
}
