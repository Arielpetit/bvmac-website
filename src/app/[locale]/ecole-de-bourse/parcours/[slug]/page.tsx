import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/lib/i18n-server";
import { PATHS, schoolContent } from "@/data/school";
import { locales } from "@/i18n/config";
import { ContentPage } from "@/components/content/ContentPage";
import { PathDetail } from "@/components/school/PathDetail";


export function generateStaticParams() {
  return locales.flatMap((locale) => PATHS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/ecole-de-bourse/parcours/[slug]">): Promise<Metadata> {
  const { slug, locale } = await params;
  const { paths } = schoolContent(locale === "en" || locale === "es" ? locale : "fr");
  return { title: paths.find((p) => p.slug === slug)?.title };
}

export default async function PathPage({ params }: PageProps<"/[locale]/ecole-de-bourse/parcours/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const content = schoolContent(locale);
  const path = content.paths.find((p) => p.slug === slug);
  if (!path) notFound();
  const lessons = content.lessons.filter((l) => l.path === slug);
  const label = { fr: ["Parcours", "leçons"], en: ["Path", "lessons"], es: ["Recorrido", "lecciones"] }[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={path.title} overline={`${label[0]} · ${lessons.length} ${label[1]} · ${lessons.reduce((s, l) => s + l.minutes, 0)} min`} intro={path.text}>
      <PathDetail path={path} lessons={lessons} />
    </ContentPage>
  );
}
