"use client";

import { motion, useScroll, useSpring } from "motion/react";

// Sticky bar under the header: lesson position in its path, plus reading progress.
export function LessonProgressBar({ label, index, total }: { label: string; index: number; total: number }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <div className="glass sticky top-[141px] z-20 mx-auto max-w-3xl overflow-hidden rounded-full border border-line shadow-soft">
      <div className="flex h-11 items-center justify-between gap-4 px-5 text-sm">
        <span className="truncate text-muted">{label}</span>
        <span className="flex shrink-0 items-center gap-1.5" aria-label={`Leçon ${index + 1} sur ${total}`}>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={i <= index ? "h-1.5 w-6 rounded-full bg-brand-gold" : "h-1.5 w-6 rounded-full bg-line"} />
          ))}
        </span>
      </div>
      <motion.div aria-hidden="true" style={{ scaleX }} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand-gold" />
    </div>
  );
}
