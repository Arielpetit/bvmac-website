import type { Metadata } from "next";
import { Database, Landmark, Network, ScrollText, Server, Wallet } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { Card } from "@/components/ui/Card";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/produits-et-services">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.services);
}

const PRODUCTS = [
  { Icon: Wallet, title: "Titres de capital et de créance", text: "Actions et obligations émises par des sociétés anonymes." },
  { Icon: Landmark, title: "Titres publics", text: "Bons du Trésor, obligations et autres effets émis par la BEAC, un État membre de la CEMAC ou un démembrement de cet État." },
  { Icon: ScrollText, title: "OPCVM et autres produits agréés", text: "Actions de SICAV agréées par la COSUMAF et tout autre titre ou produit d'épargne agréé." },
];
const SERVICES = [
  { Icon: Network, title: "Gestion des sociétés de bourse", text: "Admission, suivi et contrôle de l'activité de négociation des intermédiaires." },
  { Icon: Server, title: "Plateforme de cotation", text: "Gestion des négociations et des séances sur la plateforme de cotation." },
  { Icon: Database, title: "Données de marché", text: "Diffusion des données en temps réel et des données historiques du marché." },
];

export default async function ServicesPage({ params }: PageProps<"/[locale]/la-bvmac/produits-et-services">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="about" title={dict.nav.items.services} intro="Les produits d'investissement négociés à la BVMAC et les services offerts aux acteurs du marché.">
      {[
        { title: "Les produits de la BVMAC", list: PRODUCTS },
        { title: "Les services de la BVMAC", list: SERVICES },
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
