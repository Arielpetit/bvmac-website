"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Megaphone, X } from "lucide-react";
import { useHydrated } from "@/lib/client-store";
import { useI18n } from "@/i18n/provider";

// Site-wide message set in the admin (Paramètres > Bandeau d’annonce). Dismissible per visit.
export function AnnouncementBar({ text, link }: { text: string; link: string }) {
  const { locale } = useI18n();
  const hydrated = useHydrated();
  const [closed, setClosed] = useState(false);
  const seen = hydrated && (() => { try { return sessionStorage.getItem("bvmac-announce") === text; } catch { return false; } })();
  const close = () => {
    setClosed(true);
    try { sessionStorage.setItem("bvmac-announce", text); } catch {}
  };
  const external = /^https?:/.test(link);
  return (
    <AnimatePresence>
      {hydrated && !closed && !seen && (
        <motion.div role="status" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="fixed bottom-5 left-1/2 z-[60] flex w-[min(92vw,640px)] -translate-x-1/2 items-center gap-3 rounded-full bg-espresso py-2.5 pl-4 pr-2 text-sm text-brand-ivory shadow-2xl ring-1 ring-brand-gold/40">
          <Megaphone className="size-4 shrink-0 text-brand-gold-light" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">{text}</span>
          {link && (external ? <a href={link} target="_blank" rel="noopener noreferrer" className="shrink-0 font-medium text-brand-gold-light hover:underline">En savoir plus</a> : <Link href={link} className="shrink-0 font-medium text-brand-gold-light hover:underline">En savoir plus</Link>)}
          <button type="button" onClick={close} aria-label={{ fr: "Fermer", en: "Close", es: "Cerrar" }[locale]} className="inline-flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-white/10"><X className="size-4" aria-hidden="true" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
