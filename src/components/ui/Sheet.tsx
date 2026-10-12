"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

// Side sheet (modal dialog) used for details such as a bond line or favourites.
export function Sheet({ open, onClose, title, children, closeLabel = "Fermer" }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; closeLabel?: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // Portal to <body>: a transformed ancestor (e.g. a Reveal wrapper) would otherwise trap `fixed` positioning.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      previous?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[75]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-espresso/50 backdrop-blur-sm" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="absolute inset-y-0 right-0 flex w-[min(520px,100vw)] flex-col bg-surface shadow-2xl"
            data-lenis-prevent
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
              <h2 className="font-serif-display text-2xl text-heading">{title}</h2>
              <button ref={closeRef} type="button" onClick={onClose} className="inline-flex size-10 items-center justify-center rounded-full hover:bg-surface-alt">
                <X className="size-5" strokeWidth={1.6} aria-hidden="true" />
                <span className="sr-only">{closeLabel}</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
