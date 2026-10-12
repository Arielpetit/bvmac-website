"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info, X } from "lucide-react";
import { usePrefs, type B } from "./prefs";
import { cn } from "@/lib/cn";

export const inputCls = "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-text outline-none transition-shadow placeholder:text-muted focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30";
export const cardCls = "rounded-[var(--radius-card)] border border-line bg-surface";
export const btnPrimary = "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-action px-5 text-sm font-medium text-action-text transition-colors hover:bg-action-hover disabled:opacity-50";
export const btnGold = "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-gold px-6 text-sm font-semibold text-espresso transition-colors hover:bg-brand-gold-light disabled:opacity-50";
export const btnGhost = "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-medium transition-colors hover:border-line-strong disabled:opacity-50";

// Page title with an (i) button that opens a short guide for the page.
export function PageTitle({ title, hint, info, action }: { title: string; hint?: string; info: B[]; action?: React.ReactNode }) {
  const { tr } = usePrefs();
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif-display text-[2rem] leading-tight text-heading">{title}</h1>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              title={tr(["À quoi sert cette page ?", "What is this page for?"])}
              className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors", open ? "border-transparent bg-brand-gold text-espresso" : "border-line text-muted hover:border-brand-gold hover:text-heading")}
            >
              <Info className="size-4" aria-hidden="true" />
              <span className="sr-only">{tr(["À quoi sert cette page ?", "What is this page for?"])}</span>
            </button>
          </div>
          {hint && <p className="mt-1 max-w-2xl text-sm text-muted">{hint}</p>}
        </div>
        {action}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <div className="mt-4 flex gap-3 rounded-2xl border border-brand-gold/40 bg-accent-soft/60 p-4 pr-3">
              <Info className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden="true" />
              <ul className="flex-1 space-y-1.5 text-sm text-text">
                {info.map((b) => <li key={b[0]} className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent-text" />{tr(b)}</li>)}
              </ul>
              <button type="button" onClick={() => setOpen(false)} aria-label={tr(["Fermer", "Close"])} className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface"><X className="size-4" aria-hidden="true" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Notice({ tone, children }: { tone: "error" | "ok" | "warn"; children: React.ReactNode }) {
  return (
    <p role={tone === "error" ? "alert" : "status"} className={cn("rounded-xl px-4 py-3 text-sm", tone === "error" && "bg-fall-bg text-fall", tone === "ok" && "bg-rise-bg text-rise", tone === "warn" && "bg-accent-soft text-accent-text")}>
      {children}
    </p>
  );
}

export function fmtDate(v: unknown, lang: "fr" | "en") {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(v)) return String(v ?? "");
  return new Date(v.length === 10 ? v + "T00:00:00" : v).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtDateTime(v: string, lang: "fr" | "en") {
  return new Date(v).toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
