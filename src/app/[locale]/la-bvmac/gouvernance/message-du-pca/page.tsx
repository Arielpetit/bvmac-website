import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { LeaderMessage } from "@/components/about/LeaderMessage";

export const metadata: Metadata = { title: "Mot du Président du Conseil d’Administration" };

export default async function PcaMessagePage({ params }: PageProps<"/[locale]/la-bvmac/gouvernance/message-du-pca">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="about" title="Mot du Président du Conseil d’Administration">
      <LeaderMessage
        role="Président du Conseil d’Administration"
        photo="/photos/governance-officials.webp"
        backHref={localePath(locale, "/la-bvmac/gouvernance")}
        backLabel={dict.nav.items.governance}
        quote="Une bourse régionale forte est un bien commun : elle relie l’épargne de nos six pays aux projets qui feront leur croissance."
        paragraphs={[
          "Depuis l’unification du marché financier de l’Afrique centrale, la BVMAC a franchi des étapes décisives : un cadre réglementaire unique, un siège à Douala et des plateformes de négociation communes aux six États de la CEMAC.",
          "Le Conseil d’Administration veille à ce que la Bourse remplisse sa mission de service public avec rigueur, transparence et équité. Nos priorités sont claires : accroître le nombre d’émetteurs, élargir la base d’investisseurs et moderniser nos infrastructures.",
          "L’arrivée de nouvelles sociétés à la cote, comme BGFI Holding Corporation en 2026, montre que les entreprises de la sous-région trouvent à la BVMAC un moyen crédible de lever des capitaux et de gagner en visibilité.",
          "Je remercie les États, les actionnaires, la COSUMAF, les sociétés de bourse et l’ensemble des collaborateurs de la BVMAC pour leur engagement au service du développement du marché.",
        ]}
      />
    </ContentPage>
  );
}
