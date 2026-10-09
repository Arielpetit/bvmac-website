import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/lib/i18n-server";
import { LESSONS, PATHS } from "@/data/school";
import { locales } from "@/i18n/config";
import { ContentPage } from "@/components/content/ContentPage";
import { PathDetail } from "@/components/school/PathDetail";

export const instant = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => PATHS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/ecole-de-bourse/parcours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: PATHS.find((p) => p.slug === slug)?.title };
}

export default async function PathPage({ params }: PageProps<"/[locale]/ecole-de-bourse/parcours/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const path = PATHS.find((p) => p.slug === slug);
  if (!path) notFound();
  const lessons = LESSONS.filter((l) => l.path === slug);
  return (
    <ContentPage locale={locale} dict={dict} group="learn" title={path.title} overline={`Parcours · ${lessons.length} leçons · ${lessons.reduce((s, l) => s + l.minutes, 0)} min`} intro={path.text}>
      <PathDetail path={path} lessons={lessons} />
    </ContentPage>
  );
}
