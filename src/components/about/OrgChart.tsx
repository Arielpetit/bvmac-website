"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Building2, ChevronRight } from "lucide-react";
import type { OrgUnit } from "@/data/institution";
import { cn } from "@/lib/cn";

// HTML organisation chart: every unit is a button; the selected unit's
// details appear in a side panel. Collapses to a stacked tree on phones.
export function OrgChart({ root }: { root: OrgUnit }) {
  const [selected, setSelected] = useState<OrgUnit>(root);
  const node = (u: OrgUnit, level: number) => (
    <button
      type="button"
      aria-pressed={selected.title === u.title}
      onClick={() => setSelected(u)}
      className={cn(
        "w-full text-left transition-all duration-300 hover:-translate-y-0.5",
        level === 0 && "rounded-[var(--radius-card)] bg-espresso px-6 py-5 text-center text-brand-ivory",
        level === 1 && "rounded-[var(--radius-card)] border bg-surface px-4 py-4",
        level === 2 && "rounded-xl border bg-surface-alt px-3 py-2.5 text-sm",
        level > 0 && (selected.title === u.title ? "border-brand-gold shadow-soft" : "border-line hover:border-line-strong"),
        level === 0 && selected.title === u.title && "ring-2 ring-brand-gold ring-offset-2 ring-offset-background",
      )}
    >
      <span className={cn("block", level === 0 ? "font-serif-display text-xl" : level === 1 ? "font-medium text-heading" : "")}>{u.title}</span>
      {u.text && level < 2 && <span className={cn("mt-1 block text-xs", level === 0 ? "text-brand-sand/70" : "text-muted")}>{u.text}</span>}
    </button>
  );

  return (
    <div className="grid gap-10 xl:grid-cols-[1fr_300px]">
      <figure aria-label="Organigramme de la BVMAC">
        <div className="mx-auto max-w-sm">{node(root, 0)}</div>
        <div aria-hidden="true" className="mx-auto hidden h-8 w-px bg-brand-gold md:block" />
        <ul className="relative grid gap-4 md:grid-cols-5 md:pt-8">
          <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-0 hidden h-px bg-brand-gold md:block" />
          {root.children?.map((child) => (
            <li key={child.title} className="relative border-l border-brand-gold/50 pl-4 md:border-l-0 md:pl-0">
              <span aria-hidden="true" className="absolute -top-8 left-1/2 hidden h-8 w-px bg-brand-gold md:block" />
              {node(child, 1)}
              {child.children && (
                <ul className="mt-3 grid gap-2 pl-3 md:pl-0">
                  {child.children.map((leaf) => <li key={leaf.title}>{node(leaf, 2)}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </figure>
      <aside aria-live="polite" className="h-fit rounded-[var(--radius-card)] border border-line bg-surface p-6 xl:sticky xl:top-40">
        <AnimatePresence mode="wait">
          <motion.div key={selected.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent-text"><Building2 aria-hidden="true" className="size-5" strokeWidth={1.5} /></span>
            <h2 className="text-h3 mt-4">{selected.title}</h2>
            <p className="mt-2 text-sm text-muted">{selected.text ?? "Unité rattachée. Missions détaillées à fournir par la BVMAC."}</p>
            {selected.children && (
              <ul className="mt-4 grid gap-1.5">
                {selected.children.map((c) => (
                  <li key={c.title}>
                    <button type="button" onClick={() => setSelected(c)} className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-surface-alt">
                      {c.title}<ChevronRight aria-hidden="true" className="size-4 text-muted" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  );
}
