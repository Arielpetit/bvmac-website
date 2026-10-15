import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { FeeTable, OfficialDocs } from "@/components/content/FeeTable";
import { Faq } from "@/components/ui/Accordion";

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/commissions">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.fees);
}

const T = {
  fr: {
    title: "Commissions d’admission et de cotation",
    intro: "Frais dus par les émetteurs pour l’admission et le maintien de leurs titres à la cote.",
    caption: "Commissions applicables aux émetteurs",
    rows: [
      { item: "Commission d’admission – actions", basis: "Capitalisation à l’introduction" },
      { item: "Commission d’admission – obligations", basis: "Montant de l’emprunt" },
      { item: "Frais annuels de cotation", basis: "Capitalisation ou encours" },
      { item: "Opérations sur titres", basis: "Par opération" },
    ],
    faq: [
      { q: "Quand les commissions d’admission sont-elles dues ?", a: "Elles sont exigibles lors de l’admission des titres à la cote, selon la grille tarifaire de l’entreprise de marché." },
      { q: "Les frais annuels varient-ils ?", a: "Oui : ils dépendent de la capitalisation boursière pour les actions ou de l’encours pour les obligations." },
      { q: "Où trouver la grille officielle ?", a: "Dans l’Instruction BVMAC N°3 et le communiqué COSUMAF relatif à la tarification, disponibles ci-dessus en PDF." },
    ],
  },
  en: {
    title: "Admission and listing fees",
    intro: "Fees paid by issuers to admit their securities to listing and keep them listed.",
    caption: "Fees applicable to issuers",
    rows: [
      { item: "Admission fee – shares", basis: "Market capitalisation at listing" },
      { item: "Admission fee – bonds", basis: "Amount of the issue" },
      { item: "Annual listing fees", basis: "Capitalisation or outstanding amount" },
      { item: "Corporate actions", basis: "Per operation" },
    ],
    faq: [
      { q: "When are admission fees due?", a: "They are payable when the securities are admitted to listing, under the market operator’s fee schedule." },
      { q: "Do annual fees vary?", a: "Yes: they depend on market capitalisation for shares, or on the outstanding amount for bonds." },
      { q: "Where can I find the official schedule?", a: "In BVMAC Instruction No. 3 and the COSUMAF communiqué on pricing, available above as PDFs." },
    ],
  },
  es: {
    title: "Comisiones de admisión y cotización",
    intro: "Gastos que pagan los emisores por la admisión y el mantenimiento de sus valores en la cotización.",
    caption: "Comisiones aplicables a los emisores",
    rows: [
      { item: "Comisión de admisión – acciones", basis: "Capitalización en la salida a bolsa" },
      { item: "Comisión de admisión – obligaciones", basis: "Importe de la emisión" },
      { item: "Gastos anuales de cotización", basis: "Capitalización o saldo vivo" },
      { item: "Operaciones sobre valores", basis: "Por operación" },
    ],
    faq: [
      { q: "¿Cuándo se pagan las comisiones de admisión?", a: "Son exigibles en la admisión de los valores a cotización, según la tarifa de la empresa de mercado." },
      { q: "¿Varían los gastos anuales?", a: "Sí: dependen de la capitalización bursátil para las acciones o del saldo vivo para las obligaciones." },
      { q: "¿Dónde encontrar la tarifa oficial?", a: "En la Instrucción BVMAC n.º 3 y en el comunicado de la COSUMAF sobre tarifas, disponibles arriba en PDF." },
    ],
  },
};

export default async function IssuerFeesPage({ params }: PageProps<"/[locale]/emetteurs/commissions">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={t.title} intro={t.intro}>
      <div className="grid gap-16">
        <FeeTable locale={locale} caption={t.caption} effective="Instruction BVMAC N°3 (2019)" rows={t.rows} />
        <OfficialDocs locale={locale} ids={["t1", "t2"]} />
        <Faq items={t.faq} />
      </div>
    </ContentPage>
  );
}
