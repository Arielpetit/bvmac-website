import { ArrowUpRight, FileText } from "lucide-react";
import { Callout } from "@/components/ui/Callout";
import { DOCUMENTS } from "@/data/content";

// Fee and tax tables: structure ready, values supplied by BVMAC through the CMS.
export function FeeTable({ caption, rows, note, effective }: { caption: string; rows: { item: string; basis: string; value?: string }[]; note?: string; effective?: string }) {
  return (
    <div>
      <div className="relative overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface" data-lenis-prevent>
        <table className="w-full min-w-[560px] text-sm">
          <caption className="px-6 pt-5 text-left">
            <span className="text-h3 block">{caption}</span>
            {effective && <span className="mt-1 block text-xs text-muted">En vigueur depuis : {effective}</span>}
          </caption>
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
              <th scope="col" className="px-6 py-3 text-left font-medium">Prestation</th>
              <th scope="col" className="px-6 py-3 text-left font-medium">Assiette</th>
              <th scope="col" className="px-6 py-3 text-right font-medium">Taux / montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.item} className="transition-colors hover:bg-surface-alt">
                <th scope="row" className="px-6 py-4 text-left font-normal text-heading">{r.item}</th>
                <td className="px-6 py-4 text-muted">{r.basis}</td>
                <td className="figure px-6 py-4 text-right text-muted">{r.value ?? "Voir la grille officielle"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout tone="warning" className="mt-4">
        {note ?? "Montants à saisir par la BVMAC dans l’outil de gestion de contenu, avec leur date d’entrée en vigueur. Les textes officiels ci-dessous font foi."}
      </Callout>
    </div>
  );
}

// Links to official PDF texts from the document library.
export function OfficialDocs({ ids, title = "Textes de référence" }: { ids: string[]; title?: string }) {
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
