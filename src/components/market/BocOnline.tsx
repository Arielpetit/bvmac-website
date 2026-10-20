"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { formatDate, formatNumber } from "@/lib/format";
import { Sheet } from "@/components/ui/Sheet";
import { PriceChange } from "@/components/ui/PriceChange";

type Row = { shortName: string; isin: string; referencePrice: number; closePrice: number; change: number; qtyTraded: number; status: string };

// HTML rendering of the session's equity table (same figures as the PDF).
export function BocOnline({ rows, date, number, valueTraded }: { rows: Row[]; date: string; number: string; valueTraded: number }) {
  const { locale, dict } = useI18n();
  const [open, setOpen] = useState(false);
  const L = { fr: ["Voir en ligne", "Valeur", "Réf.", "Clôture", "Var.", "Qté", "Valeur des transactions"], en: ["View online", "Security", "Ref.", "Close", "Chg.", "Qty", "Value traded"], es: ["Ver en línea", "Valor", "Ref.", "Cierre", "Var.", "Cant.", "Valor negociado"] }[locale];
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 font-medium text-brand-ivory hover:border-white/60">
        <Eye aria-hidden="true" className="size-4" /> {L[0]}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={`BOC · ${number}`} closeLabel={dict.common.close}>
        <p className="mb-4 text-sm text-muted">{dict.session.sessionOf} {formatDate(date, locale)}</p>
        <table className="w-full text-sm">
          <caption className="sr-only">BOC {number}</caption>
          <thead className="border-b border-line text-xs uppercase tracking-[0.08em] text-muted">
            <tr>
              <th scope="col" className="py-2 text-left font-medium">{L[1]}</th>
              <th scope="col" className="py-2 text-right font-medium">{L[2]}</th>
              <th scope="col" className="py-2 text-right font-medium">{L[3]}</th>
              <th scope="col" className="py-2 text-right font-medium">{L[4]}</th>
              <th scope="col" className="py-2 text-right font-medium">{L[5]}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.isin}>
                <th scope="row" className="py-2.5 text-left font-medium text-heading">{r.shortName}<span className="code block font-normal text-muted">{r.isin} · {r.status}</span></th>
                <td className="figure py-2.5 text-right">{formatNumber(r.referencePrice, locale)}</td>
                <td className="figure py-2.5 text-right">{formatNumber(r.closePrice, locale)}</td>
                <td className="py-2.5 text-right"><PriceChange value={r.change} locale={locale} className="text-xs" /></td>
                <td className="figure py-2.5 text-right">{formatNumber(r.qtyTraded, locale)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-line">
            <tr>
              <th scope="row" colSpan={4} className="py-3 text-left">{L[6]}</th>
              <td className="figure py-3 text-right">{formatNumber(valueTraded, locale)}</td>
            </tr>
          </tfoot>
        </table>
      </Sheet>
    </>
  );
}
