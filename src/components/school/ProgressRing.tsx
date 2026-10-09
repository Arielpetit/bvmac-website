"use client";

import { motion } from "motion/react";

export function ProgressRing({ value, size = 64, stroke = 5, label, tone = "light" }: { value: number; size?: number; stroke?: number; label?: string; tone?: "light" | "dark" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={tone === "dark" ? "stroke-white/10" : "stroke-line"} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="#c9a23a"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - Math.min(1, Math.max(0, value))) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {label && <span className="figure absolute text-xs font-medium">{label}</span>}
    </span>
  );
}
