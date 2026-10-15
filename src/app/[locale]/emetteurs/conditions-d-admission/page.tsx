import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { OfficialDocs } from "@/components/content/FeeTable";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/conditions-d-admission">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.admission);
}

const T = {
  fr: {
    intro: "Critères d’accès au marché par type de titre et compartiment de la cote.",
    caption: "Comparatif des conditions d’admission",
    criterion: "Critère",
    cols: ["Actions · A-Premium", "Actions · autres compartiments", "Obligations"],
    rg: "Selon le Règlement général",
    rows: [
      ["Forme juridique", "Société anonyme", "Société anonyme", "État, collectivité, société ou institution"],
      ["Capital social minimum", "100 000 000 FCFA libéré", "RG", "—"],
      ["Capitalisation à l’introduction", "≥ 10 milliards FCFA", "RG", "—"],
      ["Diffusion dans le public", "10 à 20 % selon la capitalisation", "RG", "Offre au public ou placement privé"],
      ["Historique des comptes", "Comptes certifiés", "RG", "Comptes certifiés ou notation"],
      ["Visa COSUMAF", "Obligatoire", "Obligatoire", "Obligatoire"],
    ],
    floatTitle: "Part minimale du capital diffusée dans le public (A-Premium)",
    float: [["Moins de 50 milliards FCFA", 20], ["De 50 à 100 milliards FCFA", 15], ["Plus de 100 milliards FCFA", 10]],
    tool: "Outil",
    toolTitle: "Testez votre éligibilité",
    toolText: "Quelques questions pour situer votre entreprise.",
  },
  en: {
    intro: "Market access criteria by type of security and listing segment.",
    caption: "Admission requirements compared",
    criterion: "Criterion",
    cols: ["Shares · A-Premium", "Shares · other segments", "Bonds"],
    rg: "Per the General Regulation",
    rows: [
      ["Legal form", "Public limited company", "Public limited company", "State, local authority, company or institution"],
      ["Minimum share capital", "FCFA 100,000,000 paid up", "RG", "—"],
      ["Capitalisation at listing", "≥ FCFA 10 billion", "RG", "—"],
      ["Free float", "10 to 20% depending on capitalisation", "RG", "Public offering or private placement"],
      ["Accounts history", "Audited accounts", "RG", "Audited accounts or rating"],
      ["COSUMAF approval", "Required", "Required", "Required"],
    ],
    floatTitle: "Minimum free float (A-Premium)",
    float: [["Under FCFA 50 billion", 20], ["FCFA 50 to 100 billion", 15], ["Over FCFA 100 billion", 10]],
    tool: "Tool",
    toolTitle: "Check your eligibility",
    toolText: "A few questions to see where your company stands.",
  },
  es: {
    intro: "Criterios de acceso al mercado por tipo de valor y segmento de cotización.",
    caption: "Comparativa de las condiciones de admisión",
    criterion: "Criterio",
    cols: ["Acciones · A-Premium", "Acciones · otros segmentos", "Obligaciones"],
    rg: "Según el Reglamento General",
    rows: [
      ["Forma jurídica", "Sociedad anónima", "Sociedad anónima", "Estado, entidad local, empresa o institución"],
      ["Capital social mínimo", "100 000 000 FCFA desembolsado", "RG", "—"],
      ["Capitalización en la salida a bolsa", "≥ 10 000 millones de FCFA", "RG", "—"],
      ["Difusión entre el público", "Del 10 al 20 % según la capitalización", "RG", "Oferta pública o colocación privada"],
      ["Historial de cuentas", "Cuentas auditadas", "RG", "Cuentas auditadas o calificación"],
      ["Visado de la COSUMAF", "Obligatorio", "Obligatorio", "Obligatorio"],
    ],
    floatTitle: "Porcentaje mínimo del capital difundido entre el público (A-Premium)",
    float: [["Menos de 50 000 millones de FCFA", 20], ["De 50 000 a 100 000 millones de FCFA", 15], ["Más de 100 000 millones de FCFA", 10]],
    tool: "Herramienta",
    toolTitle: "Compruebe su elegibilidad",
    toolText: "Unas pocas preguntas para situar su empresa.",
  },
};

export default async function AdmissionPage({ params }: PageProps<"/[locale]/emetteurs/conditions-d-admission">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.admission} intro={t.intro}>
      <div className="grid gap-16">
        <Reveal>
          <div className="relative overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface" data-lenis-prevent>
            <table className="w-full min-w-[720px] text-sm">
              <caption className="px-6 pt-5 text-left"><span className="text-h3">{t.caption}</span></caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-1/4 px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.1em] text-muted">{t.criterion}</th>
                  {t.cols.map((c, i) => (
                    <th key={c} scope="col" className={i === 0 ? "bg-accent-soft/60 px-6 py-4 text-left font-medium text-heading" : "px-6 py-4 text-left font-medium text-heading"}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {t.rows.map(([label, ...vals]) => (
                  <tr key={label}>
                    <th scope="row" className="px-6 py-4 text-left font-normal text-muted">{label}</th>
                    {vals.map((v, i) => <td key={i} className={i === 0 ? "bg-accent-soft/30 px-6 py-4 text-heading" : v === "RG" ? "px-6 py-4 text-muted" : "px-6 py-4"}>{v === "RG" ? t.rg : v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <h2 className="text-h3">{t.floatTitle}</h2>
            <dl className="mt-5 grid gap-3">
              {t.float.map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm"><dt>{k}</dt><dd className="figure text-heading">{v} %</dd></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt"><div className="h-full rounded-full bg-brand-gold" style={{ width: `${Number(v) * 4}%` }} /></div>
                </div>
              ))}
            </dl>
          </div>
          <Link href={localePath(locale, "/emetteurs/test-d-eligibilite")} className="card-lift group flex flex-col justify-between rounded-[var(--radius-card)] bg-espresso p-7 text-brand-ivory">
            <span className="eyebrow text-brand-gold-light!">{t.tool}</span>
            <span>
              <span className="font-serif-display block text-3xl">{t.toolTitle}</span>
              <span className="mt-2 block text-sm text-brand-sand/70">{t.toolText}</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="mt-6 size-6 text-brand-gold transition-transform group-hover:rotate-45" />
          </Link>
        </Reveal>

        <OfficialDocs locale={locale} ids={["r1", "r6"]} />
      </div>
    </ContentPage>
  );
}
