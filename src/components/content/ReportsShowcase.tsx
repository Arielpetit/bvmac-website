import { ArrowUpRight, Download, FileText } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { DocItem } from "@/data/content";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const L = {
  fr: { latest: "Dernier rapport annuel", annual: (y: string) => `Rapport annuel ${y}`, annualSub: (y: string) => `Rapport annuel d’activités de la BVMAC pour l’exercice ${y}.`, download: "Télécharger le PDF", archive: "Rapports annuels précédents", others: "Autres publications", pdf: "PDF", year: "Exercice", ext: "(ouvre un nouvel onglet)" },
  en: { latest: "Latest annual report", annual: (y: string) => `Annual report ${y}`, annualSub: (y: string) => `BVMAC annual activity report for the ${y} financial year (in French).`, download: "Download the PDF", archive: "Previous annual reports", others: "Other publications", pdf: "PDF", year: "Financial year", ext: "(opens in a new tab)" },
  es: { latest: "Último informe anual", annual: (y: string) => `Informe anual ${y}`, annualSub: (y: string) => `Informe anual de actividades de la BVMAC del ejercicio ${y} (en francés).`, download: "Descargar el PDF", archive: "Informes anuales anteriores", others: "Otras publicaciones", pdf: "PDF", year: "Ejercicio", ext: "(se abre en una pestaña nueva)" },
};

const ANNUAL = /rapport annuel.*exercice\s+(\d{4})/i;

// A small printed-report cover, drawn in CSS so every year gets a consistent visual.
function Cover({ year, large = false }: { year: string; large?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex flex-col justify-between overflow-hidden rounded-lg bg-brand-ivory text-espresso shadow-[0_24px_48px_-20px_rgb(0_0_0/0.45)] ring-1 ring-black/5 ${large ? "aspect-[3/4] w-44 p-5 sm:w-52" : "aspect-[3/4] w-full p-3 sm:p-4"}`}
    >
      <span className="absolute inset-y-0 left-0 w-2 bg-brand-gold" />
      <span className="pl-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold-dark">BVMAC</span>
      <span className="pl-2">
        <span className={`block font-serif-display leading-none whitespace-nowrap ${large ? "text-5xl" : "text-[1.6rem] sm:text-3xl"}`}>{year}</span>
        <span className="mt-2 block h-px w-10 bg-brand-gold" />
        <span className={`mt-2 block text-[11px] leading-snug text-espresso/70 ${large ? "" : "max-sm:hidden"}`}>Rapport annuel d’activités</span>
      </span>
    </div>
  );
}

export function ReportsShowcase({ docs, locale }: { docs: DocItem[]; locale: Locale }) {
  const t = L[locale];
  const annual = docs
    .map((d) => ({ d, year: d.title.match(ANNUAL)?.[1] }))
    .filter((x): x is { d: DocItem; year: string } => !!x.year)
    .sort((a, b) => b.year.localeCompare(a.year));
  const others = docs.filter((d) => !ANNUAL.test(d.title)).sort((a, b) => b.year.localeCompare(a.year));
  const [latest, ...previous] = annual;

  return (
    <div className="grid gap-16">
      {latest && (
        <Reveal>
          <section aria-labelledby="latest-report" className="relative overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-6 text-brand-sand sm:p-10 lg:p-12">
            <span aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full bg-brand-gold/20 blur-[90px]" />
            <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
              <div>
                <p className="eyebrow text-brand-gold-light!">{t.latest}</p>
                <h2 id="latest-report" className="text-h1 mt-4 text-brand-ivory!">{t.annual(latest.year)}</h2>
                <p className="mt-4 max-w-lg text-brand-sand/75">{t.annualSub(latest.year)}</p>
                <a href={latest.d.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-brand-gold px-6 font-medium text-espresso transition-colors hover:bg-brand-gold-light">
                  <Download aria-hidden="true" className="size-4" />
                  {t.download}
                  <span className="sr-only">{t.ext}</span>
                </a>
              </div>
              <div className="hidden justify-self-center md:block md:rotate-[4deg]">
                <Cover year={latest.year} large />
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {previous.length > 0 && (
        <section aria-labelledby="previous-reports">
          <h2 id="previous-reports" className="text-h2 mb-6">{t.archive}</h2>
          <Stagger as="ul" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {previous.map(({ d, year }) => (
              <StaggerItem as="li" key={d.id}>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="group block rounded-[var(--radius-card)] border border-line bg-surface p-3 transition-colors hover:border-line-strong sm:p-4">
                  <div className="rounded-xl bg-surface-alt px-5 py-4 transition-transform duration-500 group-hover:-translate-y-1 sm:p-6">
                    <Cover year={year} />
                  </div>
                  <span className="mt-4 flex items-center justify-between gap-2 px-1">
                    <span>
                      <span className="block font-medium text-heading group-hover:text-link">{t.annual(year)}</span>
                      <span className="block text-xs text-muted">{t.year} {year} · {t.pdf}</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-muted group-hover:text-link" />
                  </span>
                  <span className="sr-only">{t.ext}</span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="other-reports">
          <h2 id="other-reports" className="text-h2 mb-6">{t.others}</h2>
          <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
            {others.map((d) => (
              <li key={d.id}>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-alt/60 sm:px-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text"><FileText aria-hidden="true" className="size-5" strokeWidth={1.5} /></span>
                  <span className="min-w-0 flex-1">
                    <span lang="fr" className="block font-medium text-heading group-hover:text-link">{d.title}</span>
                    <span className="block text-xs text-muted">{d.body} · {d.year}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-muted group-hover:text-link" />
                  <span className="sr-only">{t.ext}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
