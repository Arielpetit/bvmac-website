"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

// Accessible tabs (WAI-ARIA pattern) with an animated pill indicator.
export function Tabs({ tabs, className }: { tabs: { id: string; label: string; content: React.ReactNode }[]; className?: string }) {
  const uid = useId();
  const [active, setActive] = useState(tabs[0]?.id);

  function onKey(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    document.getElementById(`${uid}-tab-${tabs[next].id}`)?.focus();
  }

  return (
    <div className={className}>
      <div role="tablist" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 [scrollbar-width:none]">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            id={`${uid}-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            aria-controls={`${uid}-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn("relative h-10 shrink-0 rounded-full px-5 text-sm transition-colors", active === t.id ? "font-medium text-action-text" : "text-muted hover:text-heading")}
          >
            <span className="relative z-10">{t.label}</span>
            {active === t.id && <motion.span layoutId={`${uid}-pill`} className="absolute inset-0 rounded-full bg-action" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} id={`${uid}-panel-${t.id}`} role="tabpanel" aria-labelledby={`${uid}-tab-${t.id}`} hidden={active !== t.id} tabIndex={0} className="mt-8 focus-visible:outline-none">
          {active === t.id && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              {t.content}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
