"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";

// Double opt-in: the API sends a confirmation e-mail; nothing is stored until confirmed.
export function NewsletterForm() {
  const { locale, dict } = useI18n();
  const t = dict.footer;
  const [done, setDone] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.p key="done" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-2xl border border-brand-gold/40 p-5 text-brand-sand">
          <Check className="size-5 text-brand-gold" aria-hidden="true" />
          {t.newsletterDone}
        </motion.p>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
            <label className="sr-only" htmlFor="nl-name">{t.newsletterName}</label>
            <input id="nl-name" name="name" autoComplete="name" required placeholder={t.newsletterName} className="h-12 rounded-full border border-white/15 bg-white/5 px-5 text-brand-ivory placeholder:text-brand-sand/50 focus:border-brand-gold focus:outline-none" />
            <label className="sr-only" htmlFor="nl-email">{t.newsletterEmail}</label>
            <input id="nl-email" name="email" type="email" autoComplete="email" required placeholder={t.newsletterEmail} className="h-12 rounded-full border border-white/15 bg-white/5 px-5 text-brand-ivory placeholder:text-brand-sand/50 focus:border-brand-gold focus:outline-none" />
            <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gold px-6 font-medium text-espresso transition-colors hover:bg-brand-gold-light">
              {t.newsletterSubmit} <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          <label className="flex items-start gap-2.5 text-xs text-brand-sand/70">
            <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-[#c9a23a]" />
            <span>
              {t.newsletterConsent}{" "}
              <a href={localePath(locale, "/politique-de-confidentialite")} className="underline underline-offset-2 hover:text-brand-ivory">{t.privacy}</a>
            </span>
          </label>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
