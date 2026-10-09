import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { Callout } from "@/components/ui/Callout";
import { OfficialDocs } from "@/components/content/FeeTable";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/conditions-d-admission">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.admission);
}

const TBC = "À confirmer";
const COLS = ["Actions · A-Premium", "Actions · autres compartiments", "Obligations"];
const ROWS: [string, string, string, string][] = [
  ["Forme juridique", "Société anonyme", "Société anonyme", "État, collectivité, société ou institution"],
  ["Capital social minimum", "100 000 000 FCFA libéré", TBC, "—"],
  ["Capitalisation à l’introduction", "≥ 10 milliards FCFA", TBC, "—"],
  ["Diffusion dans le public", "10 à 20 % selon la capitalisation", TBC, "Offre au public ou placement privé"],
  ["Historique des comptes", "Comptes certifiés", TBC, "Comptes certifiés ou notation"],
  ["Visa COSUMAF", "Obligatoire", "Obligatoire", "Obligatoire"],
];

export default async function AdmissionPage({ params }: PageProps<"/[locale]/emetteurs/conditions-d-admission">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="issuers" title={dict.nav.items.admission} intro="Critères d’accès au marché par type de titre et compartiment de la cote.">
      <div className="grid gap-16">
        <Reveal>
          <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface" data-lenis-prevent>
            <table className="w-full min-w-[720px] text-sm">
              <caption className="px-6 pt-5 text-left"><span className="text-h3">Comparatif des conditions d’admission</span></caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-1/4 px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.1em] text-muted">Critère</th>
                  {COLS.map((c, i) => (
                    <th key={c} scope="col" className={i === 0 ? "bg-accent-soft/60 px-6 py-4 text-left font-medium text-heading" : "px-6 py-4 text-left font-medium text-heading"}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ROWS.map(([label, ...vals]) => (
                  <tr key={label}>
                    <th scope="row" className="px-6 py-4 text-left font-normal text-muted">{label}</th>
                    {vals.map((v, i) => <td key={i} className={i === 0 ? "bg-accent-soft/30 px-6 py-4 text-heading" : v === TBC ? "px-6 py-4 italic text-muted" : "px-6 py-4"}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout tone="warning" className="mt-4">Seuls les critères du compartiment A-Premium sont repris du site actuel. Les autres valeurs sont à compléter à partir du Règlement Général de la BVMAC.</Callout>
        </Reveal>

        <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <h2 className="text-h3">Part minimale du capital diffusée dans le public (A-Premium)</h2>
            <dl className="mt-5 grid gap-3">
              {[["Moins de 50 milliards FCFA", 20], ["De 50 à 100 milliards FCFA", 15], ["Plus de 100 milliards FCFA", 10]].map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm"><dt>{k}</dt><dd className="figure text-heading">{v} %</dd></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt"><div className="h-full rounded-full bg-brand-gold" style={{ width: `${Number(v) * 4}%` }} /></div>
                </div>
              ))}
            </dl>
          </div>
          <Link href={localePath(locale, "/emetteurs/test-d-eligibilite")} className="card-lift group flex flex-col justify-between rounded-[var(--radius-card)] bg-espresso p-7 text-brand-ivory">
            <span className="eyebrow text-brand-gold-light!">Outil</span>
            <span>
              <span className="font-serif-display block text-3xl">Testez votre éligibilité</span>
              <span className="mt-2 block text-sm text-brand-sand/70">Quelques questions pour situer votre entreprise.</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="mt-6 size-6 text-brand-gold transition-transform group-hover:rotate-45" />
          </Link>
        </Reveal>

        <OfficialDocs ids={["r1", "r6"]} />
      </div>
    </ContentPage>
  );
}
