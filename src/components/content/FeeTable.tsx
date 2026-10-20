import { ArrowUpRight, FileText } from "lucide-react";
import { DOCUMENTS } from "@/data/content";
import type { Locale } from "@/i18n/config";

const L = {
  fr: { since: "En vigueur depuis", item: "Prestation", basis: "Assiette", rate: "Taux / montant", grid: "Voir la grille officielle", refs: "Textes de référence" },
  en: { since: "In force since", item: "Item", basis: "Basis", rate: "Rate / amount", grid: "See the official schedule", refs: "Reference texts" },
  es: { since: "En vigor desde", item: "Concepto", basis: "Base", rate: "Tipo / importe", grid: "Ver la tarifa oficial", refs: "Textos de referencia" },
};

// Fee and tax tables: structure ready, values supplied by BVMAC through the CMS.
export function FeeTable({ locale, caption, rows, effective }: { locale: Locale; caption: string; rows: { item: string; basis: string; value?: string }[]; effective?: string }) {
  const l = L[locale];
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <div className="px-5 pt-5 sm:px-6">
        <p className="text-h3">{caption}</p>
        {effective && <p className="mt-1 text-xs text-muted">{l.since} : {effective}</p>}
      </div>
      {/* Phones: one block per line, label above value, so nothing is cut or scrolled. */}
      <ul className="mt-4 divide-y divide-line border-t border-line sm:hidden">
        {rows.map((r) => (
          <li key={r.item} className="px-5 py-4">
            <p className="font-medium text-heading">{r.item}</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-xs uppercase tracking-[0.08em] text-muted">{l.basis}</dt>
              <dd className="text-right text-muted">{r.basis}</dd>
              <dt className="text-xs uppercase tracking-[0.08em] text-muted">{l.rate}</dt>
              <dd className="figure text-right text-heading">{r.value ?? l.grid}</dd>
            </dl>
          </li>
        ))}
      </ul>
      <div className="relative hidden overflow-x-auto sm:block" data-lenis-prevent>
        <table className="w-full min-w-[560px] text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
              <th scope="col" className="px-6 py-3 text-left font-medium">{l.item}</th>
              <th scope="col" className="px-6 py-3 text-left font-medium">{l.basis}</th>
              <th scope="col" className="px-6 py-3 text-right font-medium">{l.rate}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.item} className="transition-colors hover:bg-surface-alt">
                <th scope="row" className="px-6 py-4 text-left font-normal text-heading">{r.item}</th>
                <td className="px-6 py-4 text-muted">{r.basis}</td>
                <td className="figure px-6 py-4 text-right text-muted">{r.value ?? l.grid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Links to official PDF texts from the document library.
export function OfficialDocs({ locale, ids, title }: { locale: Locale; ids: string[]; title?: string }) {
  title ??= L[locale].refs;
  const docs = DOCUMENTS.filter((d) => ids.includes(d.id));
  return (
    <section aria-label={title}>
      <h2 className="text-h3">{title}</h2>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {docs.map((d) => (
          <li key={d.id}>
            <a href={d.url} target="_blank" rel="noopener noreferrer" className="card-lift group flex h-full items-start gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text"><FileText aria-hidden="true" className="size-5" strokeWidth={1.5} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-muted">{d.body} · {d.year} · PDF</span>
                <span lang="fr" className="mt-1 block font-medium text-heading group-hover:text-link">{d.title}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-muted group-hover:text-link" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
