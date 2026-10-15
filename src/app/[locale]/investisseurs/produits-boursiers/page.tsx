import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/produits-boursiers">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.products);
}

const LESSONS = ["comprendre-la-bourse", "investir-dans-une-obligation", "comprendre-la-bourse"];

const T = {
  fr: {
    intro: "Comprendre les produits négociés à la BVMAC avant d’investir.",
    labels: ["Pour qui ?", "Revenus", "Risques"],
    lesson: "Leçon associée →",
    products: [
      { title: "Actions", who: "Investisseurs acceptant les variations de cours, horizon long.", income: "Dividendes et plus-value éventuelle.", risk: "Le cours peut baisser ; le dividende n’est pas garanti." },
      { title: "Obligations", who: "Épargnants recherchant des revenus réguliers.", income: "Coupons à date fixe et remboursement du capital.", risk: "Risque de défaut de l’émetteur ; prix variable avant l’échéance." },
      { title: "OPCVM", who: "Investisseurs souhaitant une gestion collective et diversifiée.", income: "Selon la performance du portefeuille du fonds.", risk: "Variable selon la politique de placement du fonds." },
    ],
    othersEyebrow: "Autres produits agréés",
    othersTitle: "Au-delà des actions et obligations",
    others: [
      { title: "Titres de créances négociables", text: "Bons et billets émis par les entreprises ou les États, à court et moyen terme." },
      { title: "Emprunts obligataires des États", text: "Obligations du Trésor émises par les États de la CEMAC et cotées à la BVMAC." },
      { title: "Sukuk et produits islamiques", text: "Titres conformes à la finance islamique, lorsqu’ils sont agréés par la COSUMAF." },
      { title: "Droits de souscription", text: "Droits détachés lors des augmentations de capital, négociables pendant la période de souscription." },
    ],
  },
  en: {
    intro: "Understand the products traded on the BVMAC before you invest.",
    labels: ["For whom?", "Income", "Risks"],
    lesson: "Related lesson →",
    products: [
      { title: "Shares", who: "Investors who accept price swings, with a long horizon.", income: "Dividends and possible capital gains.", risk: "The price can fall; dividends are not guaranteed." },
      { title: "Bonds", who: "Savers looking for regular income.", income: "Coupons on fixed dates and repayment of capital.", risk: "Issuer default risk; price varies before maturity." },
      { title: "Investment funds", who: "Investors who want collective, diversified management.", income: "Depends on the performance of the fund’s portfolio.", risk: "Varies with the fund’s investment policy." },
    ],
    othersEyebrow: "Other approved products",
    othersTitle: "Beyond shares and bonds",
    others: [
      { title: "Negotiable debt securities", text: "Short- and medium-term notes issued by companies or states." },
      { title: "Government bonds", text: "Treasury bonds issued by CEMAC states and listed on the BVMAC." },
      { title: "Sukuk and Islamic products", text: "Securities compliant with Islamic finance, when approved by COSUMAF." },
      { title: "Subscription rights", text: "Rights detached in capital increases, tradable during the subscription period." },
    ],
  },
  es: {
    intro: "Comprender los productos negociados en la BVMAC antes de invertir.",
    labels: ["¿Para quién?", "Rendimientos", "Riesgos"],
    lesson: "Lección relacionada →",
    products: [
      { title: "Acciones", who: "Inversores que aceptan las variaciones de precio, con horizonte largo.", income: "Dividendos y posible plusvalía.", risk: "El precio puede bajar; el dividendo no está garantizado." },
      { title: "Obligaciones", who: "Ahorradores que buscan ingresos regulares.", income: "Cupones en fechas fijas y reembolso del capital.", risk: "Riesgo de impago del emisor; precio variable antes del vencimiento." },
      { title: "Fondos de inversión", who: "Inversores que desean una gestión colectiva y diversificada.", income: "Según la rentabilidad de la cartera del fondo.", risk: "Variable según la política de inversión del fondo." },
    ],
    othersEyebrow: "Otros productos autorizados",
    othersTitle: "Más allá de las acciones y obligaciones",
    others: [
      { title: "Títulos de deuda negociables", text: "Bonos y pagarés emitidos por empresas o Estados, a corto y medio plazo." },
      { title: "Empréstitos de los Estados", text: "Obligaciones del Tesoro emitidas por los Estados de la CEMAC y cotizadas en la BVMAC." },
      { title: "Sukuk y productos islámicos", text: "Títulos conformes a las finanzas islámicas, cuando los autoriza la COSUMAF." },
      { title: "Derechos de suscripción", text: "Derechos separados en las ampliaciones de capital, negociables durante el período de suscripción." },
    ],
  },
};

export default async function ProductsPage({ params }: PageProps<"/[locale]/investisseurs/produits-boursiers">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.products} intro={t.intro}>
      <div className="grid gap-20">
        <Stagger as="ul" className="grid gap-4 md:grid-cols-3">
          {t.products.map((p, i) => (
            <StaggerItem as="li" key={p.title} className={i === 0 ? "card-lift flex flex-col rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand" : "card-lift flex flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-8"}>
              <h2 className={i === 0 ? "font-serif-display text-4xl text-brand-ivory" : "font-serif-display text-4xl text-heading"}>{p.title}</h2>
              <dl className="mt-8 grid gap-5 text-sm">
                {([[t.labels[0], p.who], [t.labels[1], p.income], [t.labels[2], p.risk]] as const).map(([k, v]) => (
                  <div key={k}><dt className={i === 0 ? "eyebrow text-brand-gold-light!" : "eyebrow"}>{k}</dt><dd className={i === 0 ? "mt-1.5 text-brand-sand/80" : "mt-1.5 text-muted"}>{v}</dd></div>
                ))}
              </dl>
              <Link href={localePath(locale, `/ecole-de-bourse/lecon/${LESSONS[i]}`)} className={i === 0 ? "mt-auto pt-8 text-sm text-brand-gold-light hover:underline" : "link mt-auto pt-8 text-sm"}>{t.lesson}</Link>
            </StaggerItem>
          ))}
        </Stagger>
        <section aria-labelledby="others">
          <p className="eyebrow">{t.othersEyebrow}</p>
          <h2 id="others" className="text-h2 mt-3">{t.othersTitle}</h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
            {t.others.map((o) => (
              <li key={o.title} className="bg-surface p-6">
                <h3 className="text-h3">{o.title}</h3>
                <p className="mt-2 text-sm text-muted">{o.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPage>
  );
}
