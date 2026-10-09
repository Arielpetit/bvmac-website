"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useHydrated, useStoredJSON } from "@/lib/client-store";

// Learning progress stays on the device (no account, no personal data sent).
export type Progress = { done: Record<string, number>; streak: { last: string; count: number }; name?: string; weekly?: Record<string, number> };

const KEY = "bvmac-school";
const empty: Progress = { done: {}, streak: { last: "", count: 0 } };
const DAY = 86_400_000;
/** Missing one day does not break the streak (one grace day). */
export const GRACE_DAYS = 1;

const noop = () => () => {};

/** Today's ISO date on the client; empty during prerender. */
export function useToday() {
  return useSyncExternalStore(noop, isoDay, () => "");
}

export function isoDay(offset = 0) {
  return new Date(Date.now() - offset * DAY).toISOString().slice(0, 10);
}

export function useProgress() {
  const [stored, setProgress] = useStoredJSON<Progress>(KEY, empty);
  const ready = useHydrated();
  const progress = { ...empty, ...stored };
  // A streak older than the grace period is shown as broken.
  const today = useToday();
  const alive = today && progress.streak.last && (new Date(today).getTime() - new Date(progress.streak.last).getTime()) / DAY <= GRACE_DAYS + 1;
  const streak = alive ? progress.streak.count : 0;

  const complete = useCallback(
    (slug: string, score: number) => {
      setProgress((prev) => {
        const day = isoDay();
        const gap = prev.streak.last ? Math.round((new Date(day).getTime() - new Date(prev.streak.last).getTime()) / DAY) : Infinity;
        const streak = gap === 0 ? prev.streak : { last: day, count: gap <= GRACE_DAYS + 1 ? prev.streak.count + 1 : 1 };
        return { ...prev, done: { ...prev.done, [slug]: Math.max(score, prev.done[slug] ?? 0) }, streak };
      });
    },
    [setProgress],
  );

  const setName = useCallback((name: string) => setProgress((prev) => ({ ...prev, name })), [setProgress]);
  const answerWeekly = useCallback((week: string, choice: number) => setProgress((prev) => ({ ...prev, weekly: { ...prev.weekly, [week]: choice } })), [setProgress]);
  const reset = useCallback(() => setProgress(empty), [setProgress]);

  return { progress, streak, ready, complete, setName, answerWeekly, reset };
}

export function isCorrect(answer: number | number[], chosen: number[]) {
  const expected = Array.isArray(answer) ? answer : [answer];
  return expected.length === chosen.length && expected.every((a) => chosen.includes(a));
}
