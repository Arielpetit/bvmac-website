"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Award, Check, Clock } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import type { Lesson, Path } from "@/data/school";
import { useProgress } from "./progress";
import { ProgressRing } from "./ProgressRing";
import { cn } from "@/lib/cn";

const L = {
  fr: { done: "Terminée", questions: "questions", score: "Score", badge: "Badge", cont: "Continuer", start: "Commencer", cert: "Obtenir mon certificat", all: "Tous les parcours" },
  en: { done: "Completed", questions: "questions", score: "Score", badge: "Badge", cont: "Continue", start: "Start", cert: "Get my certificate", all: "All paths" },
  es: { done: "Completada", questions: "preguntas", score: "Puntuación", badge: "Insignia", cont: "Continuar", start: "Empezar", cert: "Obtener mi certificado", all: "Todos los recorridos" },
};

export function PathDetail({ path, lessons }: { path: Path; lessons: Lesson[] }) {
  const { locale } = useI18n();
  const { progress, ready } = useProgress();
  const isDone = (slug: string) => ready && progress.done[slug] !== undefined;
  const done = lessons.filter((l) => isDone(l.slug)).length;
  const next = lessons.find((l) => !isDone(l.slug));
  const p = (s: string) => localePath(locale, s);
  const t = L[locale];

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
      <ol className="relative grid gap-4">
        <span aria-hidden="true" className="absolute bottom-8 left-[27px] top-8 w-px bg-line" />
        {lessons.map((l, i) => (
          <motion.li key={l.slug} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
            <Link href={p(`/ecole-de-bourse/lecon/${l.slug}`)} className="card-lift group relative flex items-center gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <span className={cn("relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium", isDone(l.slug) ? "border-rise bg-rise-bg text-rise" : next?.slug === l.slug ? "border-brand-gold bg-accent-soft text-accent-text" : "border-line bg-surface text-muted")}>
                {isDone(l.slug) ? <Check aria-label={t.done} className="size-5" /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-heading group-hover:text-link">{l.title}</span>
                <span className="mt-1 flex items-center gap-3 text-xs text-muted">
                  <span className="inline-flex items-center gap-1"><Clock aria-hidden="true" className="size-3.5" />{l.minutes} min</span>
                  <span>{l.quiz.length} {t.questions}</span>
                  {isDone(l.slug) && <span className="text-rise">{t.score} {progress.done[l.slug]}/{l.quiz.length}</span>}
                </span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-muted transition-transform group-hover:rotate-45 group-hover:text-link" />
            </Link>
          </motion.li>
        ))}
      </ol>
      <aside className="h-fit rounded-[var(--radius-panel)] bg-espresso p-7 text-brand-sand lg:sticky lg:top-40">
        <div className="flex items-center gap-5">
          <ProgressRing value={done / lessons.length} size={88} stroke={7} tone="dark" label={`${done}/${lessons.length}`} />
          <div>
            <p className="eyebrow text-brand-gold-light!">{t.badge}</p>
            <p className="font-serif-display mt-1 text-2xl text-brand-ivory">{path.badge}</p>
          </div>
        </div>
        {next ? (
          <Link href={p(`/ecole-de-bourse/lecon/${next.slug}`)} className="mt-8 flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gold font-medium text-espresso hover:bg-brand-gold-light">
            {done ? t.cont : t.start}<ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        ) : (
          <Link href={p(`/ecole-de-bourse/certificat/${path.slug}`)} className="mt-8 flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gold font-medium text-espresso hover:bg-brand-gold-light">
            <Award aria-hidden="true" className="size-4" />{t.cert}
          </Link>
        )}
        <Link href={p("/ecole-de-bourse")} className="mt-4 block text-center text-sm text-brand-sand/70 hover:text-brand-ivory">{t.all}</Link>
      </aside>
    </div>
  );
}
