"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Award, BookOpen, Check, FileText, Flame, Landmark, Search, Sparkles, Trophy, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import type { Lesson, Path } from "@/data/school";
import { GRACE_DAYS, useProgress, useToday } from "./progress";
import { ProgressRing } from "./ProgressRing";
import { Badge } from "./Badge";
import { cn } from "@/lib/cn";

const BADGE_ICONS = [BookOpen, Award, FileText, Landmark, Trophy];

// ISO week key, e.g. "2026-W41"; the weekly question rotates on it.
function weekKey(d: Date) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const year = t.getUTCFullYear();
  const week = Math.ceil(((t.getTime() - Date.UTC(year, 0, 1)) / 86_400_000 + 1) / 7);
  return { key: `${year}-W${week}`, n: year * 53 + week };
}

export function SchoolHub({ paths, lessons }: { paths: Path[]; lessons: Lesson[] }) {
  const { locale } = useI18n();
  const router = useRouter();
  const { progress, streak, ready, answerWeekly } = useProgress();
  const [q, setQ] = useState("");
  const doneCount = Object.keys(progress.done).length;
  const next = lessons.find((l) => !progress.done[l.slug]) ?? lessons[0];
  const p = (s: string) => localePath(locale, s);

  const singles = lessons.flatMap((l) => l.quiz.filter((x) => !Array.isArray(x.answer)).map((x) => ({ ...x, lesson: l })));
  const today = useToday();
  const week = weekKey(new Date(today || "2026-01-05"));
  const weekly = singles[week.n % singles.length];
  const weeklyChoice = ready ? progress.weekly?.[week.key] : undefined;

  return (
    <div className="grid gap-20">
      <section aria-labelledby="my-progress" className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand md:p-10">
          <div className="animate-orb absolute -right-20 -top-20 size-72 rounded-full bg-brand-gold/20 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-wrap items-center gap-8">
            <ProgressRing value={ready ? doneCount / lessons.length : 0} size={120} stroke={8} tone="dark" label={ready ? `${Math.round((doneCount / lessons.length) * 100)} %` : "–"} />
            <div className="min-w-0 flex-1">
              <h2 id="my-progress" className="font-serif-display text-3xl text-brand-ivory">Ma progression</h2>
              <p className="mt-1 text-sm text-brand-sand/70">Enregistrée sur cet appareil uniquement, sans compte.</p>
              <dl className="mt-5 flex flex-wrap gap-8">
                <div><dt className="text-xs uppercase tracking-[0.12em] text-brand-sand/60">Leçons</dt><dd className="figure mt-1 text-2xl text-brand-ivory">{ready ? doneCount : "–"} / {lessons.length}</dd></div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-brand-sand/60">Série</dt>
                  <dd className="figure mt-1 flex items-center gap-1.5 text-2xl text-brand-ivory"><Flame aria-hidden="true" className="size-5 text-brand-gold-light" />{ready ? streak : "–"} j</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-brand-sand/50">Un jour de répit : manquer {GRACE_DAYS} jour ne casse pas votre série.</p>
            </div>
          </div>
          <Link href={p(`/ecole-de-bourse/lecon/${next.slug}`)} className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-brand-gold px-6 font-medium text-espresso transition-colors hover:bg-brand-gold-light">
            {doneCount ? "Reprendre" : "Commencer"} : {next.title}<ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="flex flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-7">
          <p className="eyebrow flex items-center gap-1.5"><Sparkles aria-hidden="true" className="size-3.5" />Question de la semaine</p>
          <p className="mt-3 text-lg font-medium text-heading">{weekly.q}</p>
          <div className="mt-4 grid gap-2">
            {weekly.options.map((o, i) => {
              const shown = weeklyChoice !== undefined;
              const right = i === weekly.answer;
              return (
                <button
                  key={o}
                  type="button"
                  disabled={shown}
                  onClick={() => answerWeekly(week.key, i)}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default",
                    !shown && "border-line hover:border-line-strong hover:bg-surface-alt",
                    shown && right && "border-rise bg-rise-bg",
                    shown && !right && weeklyChoice === i && "border-fall bg-fall-bg",
                    shown && !right && weeklyChoice !== i && "border-line opacity-50",
                  )}
                >
                  {o}
                  {shown && right && <Check aria-label="Bonne réponse" className="size-4 text-rise" />}
                  {shown && !right && weeklyChoice === i && <X aria-label="Votre choix" className="size-4 text-fall" />}
                </button>
              );
            })}
          </div>
          {weeklyChoice !== undefined && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status" className="mt-3 text-sm text-muted">
              {weekly.explain} <Link href={p(`/ecole-de-bourse/lecon/${weekly.lesson.slug}`)} className="link">Revoir la leçon</Link>
            </motion.p>
          )}
        </div>
      </section>

      <section aria-labelledby="paths">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Parcours</p>
            <h2 id="paths" className="text-h2 mt-3">Cinq parcours, à votre rythme</h2>
          </div>
          <form
            role="search"
            onSubmit={(e) => { e.preventDefault(); router.push(p(`/ecole-de-bourse/glossaire${q ? `?q=${encodeURIComponent(q)}` : ""}`)); }}
            className="relative w-full max-w-xs"
          >
            <label htmlFor="hub-g" className="sr-only">Chercher dans le glossaire</label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input id="hub-g" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher un mot du glossaire" className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm" />
          </form>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paths.map((path, i) => {
            const list = lessons.filter((l) => l.path === path.slug);
            const done = ready ? list.filter((l) => progress.done[l.slug]).length : 0;
            const minutes = list.filter((l) => !(ready && progress.done[l.slug])).reduce((s, l) => s + l.minutes, 0);
            return (
              <motion.li key={path.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                <Link href={p(`/ecole-de-bourse/parcours/${path.slug}`)} className="card-lift group flex h-full flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-7">
                  <div className="flex items-start justify-between gap-4">
                    <ProgressRing value={list.length ? done / list.length : 0} label={`${done}/${list.length}`} />
                    <span className="flex size-10 items-center justify-center rounded-full border border-line transition-all group-hover:rotate-45 group-hover:border-transparent group-hover:bg-action group-hover:text-action-text"><ArrowUpRight aria-hidden="true" className="size-4" /></span>
                  </div>
                  <h3 className="font-serif-display mt-8 text-2xl text-heading">{path.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{path.text}</p>
                  <p className="mt-6 border-t border-line pt-4 text-xs text-muted">{list.length} leçons · {minutes} min restantes · Badge « {path.badge} »</p>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="badges">
        <p className="eyebrow">Récompenses</p>
        <h2 id="badges" className="text-h2 mt-3">Badges</h2>
        <p className="mt-2 text-sm text-muted">Ils récompensent l’apprentissage, jamais les transactions. Chaque parcours terminé donne droit à un certificat.</p>
        <div className="mt-8 flex flex-wrap gap-6">
          {paths.map((path, i) => {
            const list = lessons.filter((l) => l.path === path.slug);
            const remaining = list.filter((l) => !progress.done[l.slug]).length;
            const Icon = BADGE_ICONS[i];
            const earned = ready && remaining === 0;
            const badge = <Badge label={path.badge} earned={earned} detail={remaining === 0 ? "Voir le certificat" : `${remaining} leçon${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`} icon={<Icon aria-hidden="true" className="size-8" strokeWidth={1.6} />} />;
            return earned ? <Link key={path.slug} href={p(`/ecole-de-bourse/certificat/${path.slug}`)} className="transition-transform hover:-translate-y-1">{badge}</Link> : <div key={path.slug}>{badge}</div>;
          })}
          <Badge label="Série de 7 jours" earned={ready && streak >= 7} detail="Une leçon par jour" icon={<Flame aria-hidden="true" className="size-8" strokeWidth={1.6} />} />
        </div>
      </section>
    </div>
  );
}
