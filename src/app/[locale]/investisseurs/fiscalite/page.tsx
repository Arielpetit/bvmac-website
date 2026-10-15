import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { FeeTable, OfficialDocs } from "@/components/content/FeeTable";
import { Faq } from "@/components/ui/Accordion";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/fiscalite">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.tax);
}

const T = {
  fr: {
    title: "Bourse et fiscalité pour les investisseurs",
    intro: "Imposition des revenus et plus-values de valeurs mobilières dans les pays de la CEMAC.",
    caption: "Fiscalité des revenus de valeurs mobilières",
    rows: [
      { item: "Dividendes d’actions cotées", basis: "Montant brut du dividende" },
      { item: "Intérêts d’obligations cotées", basis: "Montant du coupon" },
      { item: "Plus-values de cession", basis: "Gain réalisé" },
    ],
    faq: [
      { q: "Les dividendes sont-ils imposés ?", a: "Oui, selon le régime de chaque pays. Le régime fiscal communautaire prévoit des conditions favorables pour les titres cotés à la BVMAC." },
      { q: "Qui prélève l’impôt ?", a: "En général l’impôt sur les revenus de valeurs mobilières est retenu à la source lors du paiement du dividende ou du coupon." },
      { q: "Où obtenir un conseil personnalisé ?", a: "Auprès de votre société de bourse ou d’un conseiller fiscal. La BVMAC ne donne pas de conseil fiscal individuel." },
    ],
  },
  en: {
    title: "Stock market taxation for investors",
    intro: "Taxation of investment income and capital gains on securities in the CEMAC countries.",
    caption: "Taxation of income from securities",
    rows: [
      { item: "Dividends on listed shares", basis: "Gross dividend amount" },
      { item: "Interest on listed bonds", basis: "Coupon amount" },
      { item: "Capital gains on disposal", basis: "Realised gain" },
    ],
    faq: [
      { q: "Are dividends taxed?", a: "Yes, under each country’s rules. The regional tax regime provides favourable terms for securities listed on the BVMAC." },
      { q: "Who collects the tax?", a: "Tax on investment income is usually withheld at source when the dividend or coupon is paid." },
      { q: "Where can I get personal advice?", a: "From your broker or a tax adviser. The BVMAC does not give individual tax advice." },
    ],
  },
  es: {
    title: "Bolsa y fiscalidad para los inversores",
    intro: "Tributación de los rendimientos y plusvalías de valores mobiliarios en los países de la CEMAC.",
    caption: "Fiscalidad de los rendimientos de valores mobiliarios",
    rows: [
      { item: "Dividendos de acciones cotizadas", basis: "Importe bruto del dividendo" },
      { item: "Intereses de obligaciones cotizadas", basis: "Importe del cupón" },
      { item: "Plusvalías de venta", basis: "Ganancia obtenida" },
    ],
    faq: [
      { q: "¿Tributan los dividendos?", a: "Sí, según el régimen de cada país. El régimen fiscal comunitario prevé condiciones favorables para los valores que cotizan en la BVMAC." },
      { q: "¿Quién retiene el impuesto?", a: "Por lo general, el impuesto sobre los rendimientos de valores se retiene en la fuente al pagar el dividendo o el cupón." },
      { q: "¿Dónde obtener asesoramiento personalizado?", a: "En su sociedad de bolsa o con un asesor fiscal. La BVMAC no ofrece asesoramiento fiscal individual." },
    ],
  },
};

export default async function InvestorTaxPage({ params }: PageProps<"/[locale]/investisseurs/fiscalite">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={t.title} intro={t.intro}>
      <div className="grid gap-16">
        <FeeTable locale={locale} caption={t.caption} rows={t.rows} />
        <OfficialDocs locale={locale} ids={["r6"]} />
        <Faq items={t.faq} />
      </div>
    </ContentPage>
  );
}
