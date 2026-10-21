import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Lightbulb } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { LESSONS, schoolContent } from "@/data/school";
import { prebuiltLocales } from "@/i18n/config";
import { ContentPage } from "@/components/content/ContentPage";
import { LessonQuiz } from "@/components/school/LessonQuiz";
import { LessonDiagram } from "@/components/school/LessonDiagram";
import { LessonProgressBar } from "@/components/school/LessonProgressBar";
import { GlossaryText } from "@/components/school/GlossaryText";
import { Reveal } from "@/components/motion/Reveal";


const L = {
  fr: { lesson: (i: number, n: number) => `Leçon ${i} sur ${n}`, read: "min de lecture", keep: "À retenir", nav: "Leçons du parcours", prev: "Précédente", next: "Suivante", intro: "← Présentation du parcours" },
  en: { lesson: (i: number, n: number) => `Lesson ${i} of ${n}`, read: "min read", keep: "Key takeaway", nav: "Lessons in this path", prev: "Previous", next: "Next", intro: "← Path overview" },
  es: { lesson: (i: number, n: number) => `Lección ${i} de ${n}`, read: "min de lectura", keep: "Para recordar", nav: "Lecciones del recorrido", prev: "Anterior", next: "Siguiente", intro: "← Presentación del recorrido" },
};

export function generateStaticParams() {
  return prebuiltLocales.flatMap((locale) => LESSONS.map((l) => ({ locale, slug: l.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/ecole-de-bourse/lecon/[slug]">): Promise<Metadata> {
  const { slug, locale } = await params;
  const { lessons } = schoolContent(locale === "en" || locale === "es" ? locale : "fr");
  return { title: lessons.find((l) => l.slug === slug)?.title };
}

export default async function LessonPage({ params }: PageProps<"/[locale]/ecole-de-bourse/lecon/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const t = L[locale];
  const { paths, lessons } = schoolContent(locale);
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) notFound();
  const path = paths.find((p) => p.slug === lesson.path)!;
  const inPath = lessons.filter((l) => l.path === lesson.path);
  const index = inPath.findIndex((l) => l.slug === slug);
  const prev = inPath[index - 1];
  const next = inPath[index + 1];
  const p = (s: string) => localePath(locale, s);

  return (
    <>
      <ContentPage
        locale={locale}
        dict={dict}
        title={lesson.title}
        overline={`${path.title} · ${t.lesson(index + 1, inPath.length)}`}
        meta={<span className="inline-flex items-center gap-1.5 text-sm text-muted"><Clock aria-hidden="true" className="size-4" strokeWidth={1.6} />{lesson.minutes} {t.read}</span>}
      >
        <LessonProgressBar label={path.title} index={index} total={inPath.length} positionLabel={t.lesson(index + 1, inPath.length)} />
        <div className="mx-auto mt-12 grid max-w-3xl gap-14">
          <article className="grid gap-12">
            {lesson.sections.map((s, i) => (
              <Reveal as="section" key={s.h}>
                <h2 className="text-h2">{s.h}</h2>
                <p className="mt-4 text-lg leading-[1.8]"><GlossaryText text={s.p} locale={locale} /></p>
                {i === 0 && <div className="mt-8"><LessonDiagram slug={lesson.slug} locale={locale} /></div>}
              </Reveal>
            ))}
            <Reveal as="section" className="flex gap-4 rounded-[var(--radius-card)] border border-brand-gold/40 bg-accent-soft/50 p-6">
              <Lightbulb aria-hidden="true" className="size-6 shrink-0 text-accent-text" strokeWidth={1.6} />
              <div>
                <p className="eyebrow">{t.keep}</p>
                <p className="mt-2 text-lg text-heading">{lesson.keep}</p>
              </div>
            </Reveal>
          </article>
          <LessonQuiz slug={lesson.slug} quiz={lesson.quiz} nextSlug={next?.slug} pathLessons={inPath.map((l) => l.slug)} badge={path.badge} pathSlug={path.slug} />
          <nav aria-label={t.nav} className="grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={p(`/ecole-de-bourse/lecon/${prev.slug}`)} className="group rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-line-strong">
                <span className="flex items-center gap-1 text-xs text-muted"><ArrowLeft aria-hidden="true" className="size-3.5" />{t.prev}</span>
                <span className="mt-1 block font-medium text-heading group-hover:text-link">{prev.title}</span>
              </Link>
            ) : (
              <Link href={p(`/ecole-de-bourse/parcours/${path.slug}`)} className="rounded-[var(--radius-card)] border border-line bg-surface p-5 text-sm text-muted hover:border-line-strong">{t.intro}</Link>
            )}
            {next && (
              <Link href={p(`/ecole-de-bourse/lecon/${next.slug}`)} className="group rounded-[var(--radius-card)] border border-line bg-surface p-5 text-right hover:border-line-strong">
                <span className="flex items-center justify-end gap-1 text-xs text-muted">{t.next}<ArrowRight aria-hidden="true" className="size-3.5" /></span>
                <span className="mt-1 block font-medium text-heading group-hover:text-link">{next.title}</span>
              </Link>
            )}
          </nav>
        </div>
      </ContentPage>
    </>
  );
}
