import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { LeaderMessage } from "@/components/about/LeaderMessage";

export const metadata: Metadata = { title: "Mot du Directeur Général" };

export default async function DgMessagePage({ params }: PageProps<"/[locale]/la-bvmac/gouvernance/message-du-dg">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="about" title="Mot du Directeur Général">
      <LeaderMessage
        role="Directeur Général"
        photo="/photos/ceremony-speech.webp"
        backHref={localePath(locale, "/la-bvmac/gouvernance")}
        backLabel={dict.nav.items.governance}
        quote="Notre ambition : faire de la BVMAC la première source de financement des économies de la CEMAC, et une bourse accessible à chaque épargnant."
        paragraphs={[
          "La Bourse des Valeurs Mobilières de l’Afrique Centrale est au service des entreprises, des États et des épargnants de six pays. Chaque séance de cotation contribue à orienter l’épargne vers l’investissement productif.",
          "Nous avons engagé la modernisation de nos outils : diffusion des cours en temps réel, publication systématique des avis et communiqués, nouveau site et application mobile. L’objectif est simple : une information de marché fiable, rapide et accessible à tous.",
          "L’éducation financière est au cœur de notre action. L’École de la Bourse, les journées portes ouvertes et nos partenariats avec les universités permettent à de nouveaux investisseurs de découvrir le marché en toute confiance.",
          "Aux dirigeants d’entreprise, je dis : la bourse n’est pas réservée aux grands groupes. Nos équipes vous accompagnent à chaque étape de l’introduction en bourse ou de l’émission obligataire.",
        ]}
      />
    </ContentPage>
  );
}
