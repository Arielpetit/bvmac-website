import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { FeeTable, OfficialDocs } from "@/components/content/FeeTable";
import { Faq } from "@/components/ui/Accordion";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/commissions">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.fees);
}

export default async function InvestorFeesPage({ params }: PageProps<"/[locale]/investisseurs/commissions">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="invest" title="Commissions de transactions" intro="Frais perçus sur les transactions boursières : marché, dépositaire et société de bourse.">
      <div className="grid gap-16">
      <FeeTable
        caption="Commissions sur les transactions"
        rows={[
          { item: "Commission de la BVMAC", basis: "Montant de la transaction" },
          { item: "Commission du dépositaire central", basis: "Montant de la transaction" },
          { item: "Commission COSUMAF", basis: "Montant de la transaction" },
          { item: "Courtage de la société de bourse", basis: "Libre, publié par chaque société" },
          { item: "Droits de garde", basis: "Valeur du portefeuille" },
        ]}
      />
        <OfficialDocs ids={["t1", "t2"]} />
        <Faq items={[
          { q: "Qui fixe le courtage ?", a: "Chaque société de bourse fixe librement son courtage et doit le publier. Comparez avant d’ouvrir un compte." },
          { q: "Les commissions de marché sont-elles les mêmes partout ?", a: "Oui : les commissions de la BVMAC, du dépositaire et de la COSUMAF sont identiques pour tous les investisseurs." },
          { q: "Paie-t-on des frais si l’on ne fait aucune opération ?", a: "Des droits de garde peuvent être prélevés sur la valeur du portefeuille, selon les conditions de votre société de bourse." },
        ]} />
      </div>
    </ContentPage>
  );
}
