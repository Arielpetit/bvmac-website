"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";

// Inertia scrolling on pointer devices; native scrolling on touch screens
// and for users who prefer reduced motion.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: { offset: -96 } });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function scrollToTop() {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
