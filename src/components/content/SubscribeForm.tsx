"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { cn } from "@/lib/cn";

// E-mail alert subscription with explicit consent (double opt-in handled by the API).
export function SubscribeForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale, dict } = useI18n();
  const [done, setDone] = useState(false);
  if (done) {
    return <p role="status" className="flex items-center gap-2 text-sm"><Check aria-hidden="true" className="size-4 text-brand-gold" />{dict.footer.newsletterDone}</p>;
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="grid gap-2">
      <label htmlFor="sub-email" className="sr-only">{dict.footer.newsletterEmail}</label>
      <input id="sub-email" type="email" required autoComplete="email" placeholder={dict.footer.newsletterEmail} className={cn("h-11 rounded-full px-4 text-sm", tone === "dark" ? "border border-white/15 bg-white/5 text-brand-ivory placeholder:text-brand-sand/50" : "border border-line bg-surface")} />
      <label className={cn("flex items-start gap-2 text-xs", tone === "dark" ? "text-brand-sand/70" : "text-muted")}>
        <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-[#c9a23a]" />
        <span>{dict.footer.newsletterConsent} <a href={localePath(locale, "/politique-de-confidentialite")} className="underline">{dict.footer.privacy}</a></span>
      </label>
      <button type="submit" className={cn("h-11 rounded-full text-sm font-medium", tone === "dark" ? "bg-brand-gold text-espresso hover:bg-brand-gold-light" : "bg-action text-action-text")}>{dict.footer.newsletterSubmit}</button>
    </form>
  );
}
