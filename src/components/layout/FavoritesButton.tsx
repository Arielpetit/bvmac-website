"use client";

import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useStoredJSON } from "@/lib/client-store";
import { localePath } from "@/lib/paths";
import { formatNumber } from "@/lib/format";
import { Sheet } from "@/components/ui/Sheet";
import { PriceChange } from "@/components/ui/PriceChange";
import { cn } from "@/lib/cn";

export type QuoteLite = { slug: string; shortName: string; name: string; closePrice: number; change: number };

// Watchlist stored on this device only; opens a side sheet with live-ish quotes.
export function FavoritesButton({ quotes = [], tone = "default" }: { quotes?: QuoteLite[]; tone?: "default" | "onDark" }) {
  const { locale, dict } = useI18n();
  const [list, setList] = useStoredJSON<string[]>("bvmac-favourites", []);
  const [open, setOpen] = useState(false);
  const items = quotes.filter((q) => list.includes(q.slug));
  const L = {
    fr: { title: "Mes favoris", empty: "Aucune valeur suivie. Utilisez le bouton « Suivre » sur une fiche valeur.", remove: "Retirer", note: "Enregistrés sur cet appareil uniquement." },
    en: { title: "My watchlist", empty: "No security followed yet. Use the “Follow” button on a security page.", remove: "Remove", note: "Saved on this device only." },
    es: { title: "Mis favoritos", empty: "Ningún valor seguido. Use el botón «Seguir» en una ficha.", remove: "Quitar", note: "Guardados solo en este dispositivo." },
  }[locale];

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn("relative inline-flex size-10 items-center justify-center rounded-full transition-colors", tone === "onDark" ? "text-brand-ivory/85 hover:bg-white/10" : "text-muted hover:bg-surface-alt hover:text-heading")}>
        <Star className="size-[18px]" strokeWidth={1.6} aria-hidden="true" />
        {items.length > 0 && <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-brand-gold text-[10px] font-semibold text-espresso">{items.length}</span>}
        <span className="sr-only">{L.title}</span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={L.title} closeLabel={dict.common.close}>
        {items.length === 0 ? (
          <p className="text-muted">{L.empty}</p>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((q) => (
              <li key={q.slug} className="flex items-center justify-between gap-3 py-4">
                <Link href={localePath(locale, `/marches/actions/${q.slug}`)} onClick={() => setOpen(false)} className="min-w-0">
                  <span className="block font-medium text-heading hover:text-link">{q.shortName}</span>
                  <span className="block truncate text-xs text-muted">{q.name}</span>
                </Link>
                <span className="flex items-center gap-4">
                  <span className="text-right">
                    <span className="figure block">{formatNumber(q.closePrice, locale)}</span>
                    <PriceChange value={q.change} locale={locale} className="text-xs" />
                  </span>
                  <button type="button" onClick={() => setList((prev) => prev.filter((s) => s !== q.slug))} className="text-xs text-muted underline hover:text-fall">{L.remove}</button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-xs text-muted">{L.note}</p>
      </Sheet>
    </>
  );
}
