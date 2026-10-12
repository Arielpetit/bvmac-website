"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { scrollToTop } from "./SmoothScroll";

export function BackToTop() {
  const { dict } = useI18n();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 900));
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-7 z-40 inline-flex size-12 items-center justify-center rounded-full border border-line bg-surface/90 text-heading shadow-soft backdrop-blur hover:border-line-strong"
        >
          <ArrowUp className="size-5" strokeWidth={1.75} aria-hidden="true" />
          <span className="sr-only">{dict.a11y.backToTop}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
