import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { LegalPage } from "@/components/content/LegalPage";

export const metadata: Metadata = { title: "Accessibilité" };

export default async function AccessibilityPage({ params }: PageProps<"/[locale]/accessibilite">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <LegalPage locale={locale} dict={dict} title={dict.footer.accessibility} updated="à définir">
      <p>La BVMAC s’engage à rendre son site accessible au plus grand nombre. L’objectif est la conformité au niveau AA des Règles pour l’accessibilité des contenus Web (WCAG 2.1).</p>
      <h2 className="text-h3">Mesures prises</h2>
      <ul>
        <li>Navigation complète au clavier, lien d’évitement et focus visible.</li>
        <li>Contrastes vérifiés selon la charte BVMAC ; les variations de cours ne reposent jamais sur la seule couleur.</li>
        <li>Graphiques accompagnés d’un résumé et d’un tableau de données.</li>
        <li>Défilement des cours pouvant être mis en pause ; respect de la préférence « réduire les animations ».</li>
        <li>Textes alternatifs pour les images et sous-titres pour les vidéos.</li>
      </ul>
      <h2 className="text-h3">Signaler un problème</h2>
      <p>Si vous rencontrez une difficulté d’accès à un contenu, écrivez-nous via la page Contact : nous vous fournirons l’information sous une autre forme.</p>
      <h2 className="text-h3">État de conformité</h2>
      <p>[Résultats de l’audit d’accessibilité à publier avant la mise en production].</p>
    </LegalPage>
  );
}
