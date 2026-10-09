"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { formatFcfa, formatFcfaCompact, formatNumber } from "@/lib/format";

type Kind = "number" | "fcfa" | "fcfa-compact" | "billions";

// Animates a number once when it scrolls into view. The final value is
// rendered on the server so the figure is always readable.
export function CountUp({ value, kind = "number", duration = 1.8, digits = 0 }: { value: number; kind?: Kind; duration?: number; digits?: number }) {
  const { locale } = useI18n();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState<number | null>(null);

  const format = (n: number) =>
    kind === "fcfa"
      ? formatFcfa(n, locale)
      : kind === "fcfa-compact"
        ? formatFcfaCompact(n, locale)
        : kind === "billions"
          ? formatNumber(n / 1e9, locale, 1)
          : formatNumber(n, locale, digits);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(value * 0.35, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCurrent(v),
      onComplete: () => setCurrent(null),
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className="figure">
      <span className="sr-only">{format(value)}</span>
      <span aria-hidden="true">{format(current ?? value)}</span>
    </span>
  );
}
