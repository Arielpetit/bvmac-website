"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Award, Check, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import type { Question } from "@/data/school";
import { isCorrect, useProgress } from "./progress";
import { cn } from "@/lib/cn";

const L = {
  fr: { eyebrow: "Vérifiez vos acquis", right: "Bonne réponse", choice: "Votre choix", validate: "Valider", score: "Score", saved: "Leçon enregistrée dans votre progression sur cet appareil.", again: "Recommencer", next: "Leçon suivante →", path: "Voir le parcours", badge: "Badge obtenu", cert: "Voir mon certificat" },
  en: { eyebrow: "Check what you learned", right: "Correct answer", choice: "Your choice", validate: "Submit", score: "Score", saved: "Lesson saved in your progress on this device.", again: "Try again", next: "Next lesson →", path: "See the path", badge: "Badge earned", cert: "See my certificate" },
  es: { eyebrow: "Compruebe lo aprendido", right: "Respuesta correcta", choice: "Su elección", validate: "Validar", score: "Puntuación", saved: "Lección guardada en su progreso en este dispositivo.", again: "Volver a empezar", next: "Siguiente lección →", path: "Ver el recorrido", badge: "Insignia obtenida", cert: "Ver mi certificado" },
};

// Right and wrong answers always show an icon and a word, plus one sentence of explanation.
// Questions with several correct answers use checkboxes and a "Valider" button.
export function LessonQuiz({ slug, quiz, nextSlug, pathLessons, badge, pathSlug }: { slug: string; quiz: Question[]; nextSlug?: string; pathLessons: string[]; badge: string; pathSlug: string }) {
  const { locale } = useI18n();
  const t = L[locale];
  const { progress, complete } = useProgress();
  const [picked, setPicked] = useState<number[][]>(quiz.map(() => []));
  const [locked, setLocked] = useState<boolean[]>(quiz.map(() => false));
  const [toast, setToast] = useState(false);
  const answered = locked.every(Boolean);
  const score = quiz.filter((q, i) => isCorrect(q.answer, picked[i])).length;

  function lock(qi: number, choice: number[]) {
    const nextPicked = picked.map((p, i) => (i === qi ? choice : p));
    const nextLocked = locked.map((l, i) => (i === qi ? true : l));
    setPicked(nextPicked);
    setLocked(nextLocked);
    if (nextLocked.every(Boolean)) {
      const wasComplete = pathLessons.every((l) => progress.done[l]);
      complete(slug, quiz.filter((q, i) => isCorrect(q.answer, nextPicked[i])).length);
      const nowComplete = pathLessons.every((l) => l === slug || progress.done[l]);
      if (!wasComplete && nowComplete) {
        setToast(true);
        window.setTimeout(() => setToast(false), 6000);
      }
    }
  }

  function toggle(qi: number, oi: number) {
    setPicked((p) => p.map((arr, i) => (i === qi ? (arr.includes(oi) ? arr.filter((x) => x !== oi) : [...arr, oi]) : arr)));
  }

  function reset() {
    setPicked(quiz.map(() => []));
    setLocked(quiz.map(() => false));
  }

  return (
    <section aria-labelledby="quiz" className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 md:p-10">
      <p className="eyebrow">{t.eyebrow}</p>
      <h2 id="quiz" className="text-h2 mt-2">Quiz</h2>
      <ol className="mt-8 grid gap-10">
        {quiz.map((q, qi) => {
          const multi = Array.isArray(q.answer);
          const expected = Array.isArray(q.answer) ? q.answer : [q.answer];
          const show = locked[qi];
          return (
            <li key={q.q}>
              <fieldset>
                <legend className="text-[1.0625rem] font-medium text-heading">
                  <span className="figure mr-2 text-accent-text">{String(qi + 1).padStart(2, "0")}</span>
                  {q.q}
                </legend>
                <div className="mt-4 grid gap-2">
                  {q.options.map((opt, oi) => {
                    const isAnswer = expected.includes(oi);
                    const isChosen = picked[qi].includes(oi);
                    return (
                      <button
                        key={opt}
                        type="button"
                        role={multi ? "checkbox" : undefined}
                        aria-checked={multi ? isChosen : undefined}
                        aria-pressed={multi ? undefined : isChosen}
                        onClick={() => (multi ? toggle(qi, oi) : lock(qi, [oi]))}
                        disabled={show}
                        className={cn(
                          "flex min-h-13 items-center justify-between gap-3 rounded-2xl border px-5 py-3 text-left transition-all disabled:cursor-default",
                          !show && !isChosen && "border-line hover:border-line-strong hover:bg-surface-alt",
                          !show && isChosen && "border-brand-gold bg-accent-soft",
                          show && isAnswer && "border-rise bg-rise-bg",
                          show && isChosen && !isAnswer && "border-fall bg-fall-bg",
                          show && !isAnswer && !isChosen && "border-line opacity-60",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {multi && <span aria-hidden="true" className={cn("flex size-5 items-center justify-center rounded-md border", isChosen ? "border-transparent bg-action text-action-text" : "border-line-strong")}>{isChosen && <Check className="size-3.5" />}</span>}
                          {opt}
                        </span>
                        {show && isAnswer && <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-rise"><Check aria-hidden="true" className="size-4" /> {t.right}</span>}
                        {show && isChosen && !isAnswer && <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-fall"><X aria-hidden="true" className="size-4" /> {t.choice}</span>}
                      </button>
                    );
                  })}
                </div>
                {multi && !show && (
                  <button type="button" disabled={!picked[qi].length} onClick={() => lock(qi, picked[qi])} className="mt-3 inline-flex h-10 items-center rounded-full bg-action px-5 text-sm font-medium text-action-text disabled:opacity-40">
                    {t.validate}
                  </button>
                )}
                {show && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="status" className="mt-3 text-sm text-muted">{q.explain}</motion.p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} role="status" className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-[var(--radius-card)] bg-espresso p-6 text-brand-sand">
          <div>
            <p className="font-serif-display text-3xl text-brand-ivory">{t.score} : <span className="figure">{score} / {quiz.length}</span></p>
            <p className="mt-1 text-sm text-brand-sand/70">{t.saved}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={reset} className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 text-sm hover:border-white/50">{t.again}</button>
            <Link href={localePath(locale, nextSlug ? `/ecole-de-bourse/lecon/${nextSlug}` : `/ecole-de-bourse/parcours/${pathSlug}`)} className="inline-flex h-11 items-center rounded-full bg-brand-gold px-5 text-sm font-medium text-espresso hover:bg-brand-gold-light">
              {nextSlug ? t.next : t.path}
            </Link>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-6 left-1/2 z-50 flex w-[min(92vw,420px)] -translate-x-1/2 items-center gap-4 rounded-[var(--radius-card)] bg-espresso p-4 pr-6 text-brand-sand shadow-2xl"
          >
            <motion.span initial={{ rotate: -30 }} animate={{ rotate: 0 }} className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-gold bg-espresso text-brand-gold-light"><Award aria-hidden="true" className="size-7" /></motion.span>
            <span>
              <span className="block text-xs uppercase tracking-[0.14em] text-brand-gold-light">{t.badge}</span>
              <span className="block font-medium text-brand-ivory">{badge}</span>
              <Link href={localePath(locale, `/ecole-de-bourse/certificat/${pathSlug}`)} className="text-xs text-brand-gold-light underline">{t.cert}</Link>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
