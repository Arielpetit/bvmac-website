import type { Metadata } from "next";
import { Database, Landmark, Network, ScrollText, Server, Wallet } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { Card } from "@/components/ui/Card";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/produits-et-services">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.services);
}

const PRODUCT_ICONS = [Wallet, Landmark, ScrollText];
const SERVICE_ICONS = [Network, Server, Database];

const T = {
  fr: {
    intro: "Les produits d’investissement négociés à la BVMAC et les services offerts aux acteurs du marché.",
    productsTitle: "Les produits de la BVMAC",
    servicesTitle: "Les services de la BVMAC",
    products: [
      { title: "Titres de capital et de créance", text: "Actions et obligations émises par des sociétés anonymes." },
      { title: "Titres publics", text: "Bons du Trésor, obligations et autres effets émis par la BEAC, un État membre de la CEMAC ou un démembrement de cet État." },
      { title: "OPCVM et autres produits agréés", text: "Actions de SICAV agréées par la COSUMAF et tout autre titre ou produit d’épargne agréé." },
    ],
    services: [
      { title: "Gestion des sociétés de bourse", text: "Admission, suivi et contrôle de l’activité de négociation des intermédiaires." },
      { title: "Plateforme de cotation", text: "Gestion des négociations et des séances sur la plateforme de cotation." },
      { title: "Données de marché", text: "Diffusion des données en temps réel et des données historiques du marché." },
    ],
  },
  en: {
    intro: "The investment products traded on the BVMAC and the services offered to market participants.",
    productsTitle: "BVMAC products",
    servicesTitle: "BVMAC services",
    products: [
      { title: "Equity and debt securities", text: "Shares and bonds issued by public limited companies." },
      { title: "Public securities", text: "Treasury bills, bonds and other instruments issued by the BEAC, a CEMAC member state or one of its agencies." },
      { title: "Investment funds and other approved products", text: "Shares in SICAVs approved by COSUMAF and any other approved security or savings product." },
    ],
    services: [
      { title: "Broker management", text: "Admission, monitoring and oversight of intermediaries’ trading activity." },
      { title: "Trading platform", text: "Management of trades and sessions on the trading platform." },
      { title: "Market data", text: "Real-time and historical market data." },
    ],
  },
  es: {
    intro: "Los productos de inversión negociados en la BVMAC y los servicios ofrecidos a los participantes del mercado.",
    productsTitle: "Los productos de la BVMAC",
    servicesTitle: "Los servicios de la BVMAC",
    products: [
      { title: "Títulos de capital y de deuda", text: "Acciones y obligaciones emitidas por sociedades anónimas." },
      { title: "Títulos públicos", text: "Letras del Tesoro, obligaciones y otros efectos emitidos por la BEAC, un Estado miembro de la CEMAC o un organismo de ese Estado." },
      { title: "Fondos de inversión y otros productos autorizados", text: "Acciones de SICAV autorizadas por la COSUMAF y cualquier otro título o producto de ahorro autorizado." },
    ],
    services: [
      { title: "Gestión de las sociedades de bolsa", text: "Admisión, seguimiento y control de la actividad de negociación de los intermediarios." },
      { title: "Plataforma de cotización", text: "Gestión de las negociaciones y de las sesiones en la plataforma de cotización." },
      { title: "Datos de mercado", text: "Difusión de datos en tiempo real y de datos históricos del mercado." },
    ],
  },
};

export default async function ServicesPage({ params }: PageProps<"/[locale]/la-bvmac/produits-et-services">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.services} intro={t.intro}>
      {[
        { title: t.productsTitle, list: t.products.map((x, i) => ({ ...x, Icon: PRODUCT_ICONS[i] })) },
        { title: t.servicesTitle, list: t.services.map((x, i) => ({ ...x, Icon: SERVICE_ICONS[i] })) },
      ].map((block) => (
        <section key={block.title} aria-label={block.title} className="mb-12 last:mb-0">
          <h2 className="text-h2">{block.title}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {block.list.map(({ Icon, title, text }) => (
              <li key={title}>
                <Card className="h-full p-6">
                  <Icon aria-hidden="true" className="size-7 text-accent-text" strokeWidth={1.8} />
                  <h3 className="text-h3 mt-4">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </ContentPage>
  );
}
