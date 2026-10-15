import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { FeeTable, OfficialDocs } from "@/components/content/FeeTable";
import { Faq } from "@/components/ui/Accordion";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/commissions">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.fees);
}

const T = {
  fr: {
    title: "Commissions de transactions",
    intro: "Frais perçus sur les transactions boursières : marché, dépositaire et société de bourse.",
    caption: "Commissions sur les transactions",
    rows: [
      { item: "Commission de la BVMAC", basis: "Montant de la transaction" },
      { item: "Commission du dépositaire central", basis: "Montant de la transaction" },
      { item: "Commission COSUMAF", basis: "Montant de la transaction" },
      { item: "Courtage de la société de bourse", basis: "Libre, publié par chaque société" },
      { item: "Droits de garde", basis: "Valeur du portefeuille" },
    ],
    faq: [
      { q: "Qui fixe le courtage ?", a: "Chaque société de bourse fixe librement son courtage et doit le publier. Comparez avant d’ouvrir un compte." },
      { q: "Les commissions de marché sont-elles les mêmes partout ?", a: "Oui : les commissions de la BVMAC, du dépositaire et de la COSUMAF sont identiques pour tous les investisseurs." },
      { q: "Paie-t-on des frais si l’on ne fait aucune opération ?", a: "Des droits de garde peuvent être prélevés sur la valeur du portefeuille, selon les conditions de votre société de bourse." },
    ],
  },
  en: {
    title: "Transaction fees",
    intro: "Fees charged on stock market transactions: market, depository and broker.",
    caption: "Fees on transactions",
    rows: [
      { item: "BVMAC fee", basis: "Transaction amount" },
      { item: "Central depository fee", basis: "Transaction amount" },
      { item: "COSUMAF fee", basis: "Transaction amount" },
      { item: "Broker commission", basis: "Set freely and published by each broker" },
      { item: "Custody fees", basis: "Portfolio value" },
    ],
    faq: [
      { q: "Who sets the brokerage commission?", a: "Each broker sets its commission freely and must publish it. Compare before opening an account." },
      { q: "Are market fees the same everywhere?", a: "Yes: the BVMAC, depository and COSUMAF fees are the same for all investors." },
      { q: "Do I pay fees if I make no transactions?", a: "Custody fees may be charged on the value of your portfolio, depending on your broker’s terms." },
    ],
  },
  es: {
    title: "Comisiones de transacción",
    intro: "Gastos cobrados sobre las operaciones bursátiles: mercado, depositario y sociedad de bolsa.",
    caption: "Comisiones sobre las operaciones",
    rows: [
      { item: "Comisión de la BVMAC", basis: "Importe de la operación" },
      { item: "Comisión del depositario central", basis: "Importe de la operación" },
      { item: "Comisión de la COSUMAF", basis: "Importe de la operación" },
      { item: "Corretaje de la sociedad de bolsa", basis: "Libre, publicado por cada sociedad" },
      { item: "Derechos de custodia", basis: "Valor de la cartera" },
    ],
    faq: [
      { q: "¿Quién fija el corretaje?", a: "Cada sociedad de bolsa fija libremente su corretaje y debe publicarlo. Compare antes de abrir una cuenta." },
      { q: "¿Las comisiones de mercado son iguales en todas partes?", a: "Sí: las comisiones de la BVMAC, del depositario y de la COSUMAF son idénticas para todos los inversores." },
      { q: "¿Se pagan gastos si no se realiza ninguna operación?", a: "Pueden cobrarse derechos de custodia sobre el valor de la cartera, según las condiciones de su sociedad de bolsa." },
    ],
  },
};

export default async function InvestorFeesPage({ params }: PageProps<"/[locale]/investisseurs/commissions">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={t.title} intro={t.intro}>
      <div className="grid gap-16">
        <FeeTable locale={locale} caption={t.caption} rows={t.rows} />
        <OfficialDocs locale={locale} ids={["t1", "t2"]} />
        <Faq items={t.faq} />
      </div>
    </ContentPage>
  );
}
