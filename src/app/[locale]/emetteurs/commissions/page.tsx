import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { FeeTable, OfficialDocs } from "@/components/content/FeeTable";
import { Faq } from "@/components/ui/Accordion";

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/commissions">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.fees);
}

export default async function IssuerFeesPage({ params }: PageProps<"/[locale]/emetteurs/commissions">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="issuers" title="Commissions d’admission et de cotation" intro="Frais dus par les émetteurs pour l’admission et le maintien de leurs titres à la cote.">
      <div className="grid gap-16">
        <FeeTable
          caption="Commissions applicables aux émetteurs"
          effective="Instruction BVMAC N°3 (2019)"
          rows={[
            { item: "Commission d’admission – actions", basis: "Capitalisation à l’introduction" },
            { item: "Commission d’admission – obligations", basis: "Montant de l’emprunt" },
            { item: "Frais annuels de cotation", basis: "Capitalisation ou encours" },
            { item: "Opérations sur titres", basis: "Par opération" },
          ]}
        />
        <OfficialDocs ids={["t1", "t2"]} />
        <Faq items={[
          { q: "Quand les commissions d’admission sont-elles dues ?", a: "Elles sont exigibles lors de l’admission des titres à la cote, selon la grille tarifaire de l’entreprise de marché." },
          { q: "Les frais annuels varient-ils ?", a: "Oui : ils dépendent de la capitalisation boursière pour les actions ou de l’encours pour les obligations." },
          { q: "Où trouver la grille officielle ?", a: "Dans l’Instruction BVMAC N°3 et le communiqué COSUMAF relatif à la tarification, disponibles ci-dessus en PDF." },
        ]} />
      </div>
    </ContentPage>
  );
}
