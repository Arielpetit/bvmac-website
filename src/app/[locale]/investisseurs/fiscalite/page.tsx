import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { FeeTable, OfficialDocs } from "@/components/content/FeeTable";
import { Faq } from "@/components/ui/Accordion";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/fiscalite">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.tax);
}

export default async function InvestorTaxPage({ params }: PageProps<"/[locale]/investisseurs/fiscalite">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="invest" title="Bourse et fiscalité pour les investisseurs" intro="Imposition des revenus et plus-values de valeurs mobilières dans les pays de la CEMAC.">
      <div className="grid gap-16">
      <FeeTable
        caption="Fiscalité des revenus de valeurs mobilières"
        rows={[
          { item: "Dividendes d'actions cotées", basis: "Montant brut du dividende" },
          { item: "Intérêts d'obligations cotées", basis: "Montant du coupon" },
          { item: "Plus-values de cession", basis: "Gain réalisé" },
        ]}
        note="Taux à renseigner par pays à partir des codes fiscaux nationaux en vigueur, avec leur date. Contenu à valider par la BVMAC."
      />
        <OfficialDocs ids={["r6"]} />
        <Faq items={[
          { q: "Les dividendes sont-ils imposés ?", a: "Oui, selon le régime de chaque pays. Le régime fiscal communautaire prévoit des conditions favorables pour les titres cotés à la BVMAC." },
          { q: "Qui prélève l’impôt ?", a: "En général l’impôt sur les revenus de valeurs mobilières est retenu à la source lors du paiement du dividende ou du coupon." },
          { q: "Où obtenir un conseil personnalisé ?", a: "Auprès de votre société de bourse ou d’un conseiller fiscal. La BVMAC ne donne pas de conseil fiscal individuel." },
        ]} />
      </div>
    </ContentPage>
  );
}
