"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Star } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useStoredJSON } from "@/lib/client-store";
import { cn } from "@/lib/cn";

// Watchlist kept on the device only (no account, no personal data sent).
export function FollowButton({ slug, name }: { slug: string; name: string }) {
  const { dict, locale } = useI18n();
  const [list, setList] = useStoredJSON<string[]>("bvmac-favourites", []);
  const on = list.includes(slug);
  const [toast, setToast] = useState("");

  function toggle() {
    setList((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
    setToast(
      {
        fr: on ? `${name} retiré de vos favoris.` : `${name} ajouté à vos favoris.`,
        en: on ? `${name} removed from your watchlist.` : `${name} added to your watchlist.`,
        es: on ? `${name} eliminado de sus favoritos.` : `${name} añadido a sus favoritos.`,
      }[locale],
    );
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <>
      <button
        type="button"
        aria-pressed={on}
        onClick={toggle}
        className={cn("inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors", on ? "bg-brand-gold text-espresso" : "border border-line-strong bg-surface text-heading hover:border-heading/40")}
      >
        <Star aria-hidden="true" className={cn("size-4", on && "fill-current")} strokeWidth={1.6} />
        {on ? dict.market.following : dict.market.follow}
      </button>
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="pointer-events-auto flex items-center gap-2 rounded-full bg-espresso px-5 py-3 text-sm text-brand-ivory shadow-2xl">
              <Check aria-hidden="true" className="size-4 text-brand-gold" />
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
