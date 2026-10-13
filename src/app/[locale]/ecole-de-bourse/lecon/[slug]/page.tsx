import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Lightbulb } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { LESSONS, PATHS } from "@/data/school";
import { locales } from "@/i18n/config";
import { ContentPage } from "@/components/content/ContentPage";
import { LessonQuiz } from "@/components/school/LessonQuiz";
import { LessonDiagram } from "@/components/school/LessonDiagram";
import { LessonProgressBar } from "@/components/school/LessonProgressBar";
import { GlossaryText } from "@/components/school/GlossaryText";
import { Reveal } from "@/components/motion/Reveal";


export function generateStaticParams() {
  return locales.flatMap((locale) => LESSONS.map((l) => ({ locale, slug: l.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/ecole-de-bourse/lecon/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: LESSONS.find((l) => l.slug === slug)?.title };
}

export default async function LessonPage({ params }: PageProps<"/[locale]/ecole-de-bourse/lecon/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const lesson = LESSONS.find((l) => l.slug === slug);
  if (!lesson) notFound();
  const path = PATHS.find((p) => p.slug === lesson.path)!;
  const inPath = LESSONS.filter((l) => l.path === lesson.path);
  const index = inPath.findIndex((l) => l.slug === slug);
  const prev = inPath[index - 1];
  const next = inPath[index + 1];
  const p = (s: string) => localePath(locale, s);

  return (
    <>
      <ContentPage
        locale={locale}
        dict={dict}
        group="learn"
        title={lesson.title}
        overline={`${path.title} · Leçon ${index + 1} sur ${inPath.length}`}
        meta={<span className="inline-flex items-center gap-1.5 text-sm text-muted"><Clock aria-hidden="true" className="size-4" strokeWidth={1.6} />{lesson.minutes} min de lecture</span>}
      >
        <LessonProgressBar label={path.title} index={index} total={inPath.length} />
        <div className="mx-auto mt-12 grid max-w-3xl gap-14">
          <article className="grid gap-12">
            {lesson.sections.map((s, i) => (
              <Reveal as="section" key={s.h}>
                <h2 className="text-h2">{s.h}</h2>
                <p className="mt-4 text-lg leading-[1.8]"><GlossaryText text={s.p} /></p>
                {i === 0 && <div className="mt-8"><LessonDiagram slug={lesson.slug} /></div>}
              </Reveal>
            ))}
            <Reveal as="section" className="flex gap-4 rounded-[var(--radius-card)] border border-brand-gold/40 bg-accent-soft/50 p-6">
              <Lightbulb aria-hidden="true" className="size-6 shrink-0 text-accent-text" strokeWidth={1.6} />
              <div>
                <p className="eyebrow">À retenir</p>
                <p className="mt-2 text-lg text-heading">{lesson.keep}</p>
              </div>
            </Reveal>
          </article>
          <LessonQuiz slug={lesson.slug} quiz={lesson.quiz} nextSlug={next?.slug} pathLessons={inPath.map((l) => l.slug)} badge={path.badge} pathSlug={path.slug} />
          <nav aria-label="Leçons du parcours" className="grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={p(`/ecole-de-bourse/lecon/${prev.slug}`)} className="group rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-line-strong">
                <span className="flex items-center gap-1 text-xs text-muted"><ArrowLeft aria-hidden="true" className="size-3.5" />Précédente</span>
                <span className="mt-1 block font-medium text-heading group-hover:text-link">{prev.title}</span>
              </Link>
            ) : (
              <Link href={p(`/ecole-de-bourse/parcours/${path.slug}`)} className="rounded-[var(--radius-card)] border border-line bg-surface p-5 text-sm text-muted hover:border-line-strong">← Présentation du parcours</Link>
            )}
            {next && (
              <Link href={p(`/ecole-de-bourse/lecon/${next.slug}`)} className="group rounded-[var(--radius-card)] border border-line bg-surface p-5 text-right hover:border-line-strong">
                <span className="flex items-center justify-end gap-1 text-xs text-muted">Suivante<ArrowRight aria-hidden="true" className="size-3.5" /></span>
                <span className="mt-1 block font-medium text-heading group-hover:text-link">{next.title}</span>
              </Link>
            )}
          </nav>
        </div>
      </ContentPage>
    </>
  );
}
