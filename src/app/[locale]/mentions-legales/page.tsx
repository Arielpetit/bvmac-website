import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { LegalPage } from "@/components/content/LegalPage";

export const metadata: Metadata = { title: "Mentions légales" };

export default async function LegalNoticePage({ params }: PageProps<"/[locale]/mentions-legales">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <LegalPage locale={locale} dict={dict} title={dict.footer.legal} updated="à définir">
      <h2 className="text-h3">Éditeur</h2>
      <p>Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC), société anonyme avec Conseil d’Administration au capital de 9 073 000 000 FCFA. Siège : Immeuble de la Bourse, B.P. 442 Douala, Cameroun. Téléphone : +237 233 43 85 83. E-mail : bvmac@bvmac.cm.</p>
      <h2 className="text-h3">Directeur de la publication</h2>
      <p>[À désigner].</p>
      <h2 className="text-h3">Hébergement</h2>
      <p>[Hébergeur validé par la DSI et le RSSI de la BVMAC : raison sociale, adresse, pays d’hébergement].</p>
      <h2 className="text-h3">Propriété intellectuelle</h2>
      <p>Les contenus, logos et marques présents sur ce site sont la propriété de la BVMAC ou de leurs titulaires. Toute reproduction non autorisée est interdite.</p>
      <h2 className="text-h3">Responsabilité</h2>
      <p>Les informations publiées ont un caractère informatif et ne constituent pas un conseil en investissement. Seuls les avis officiels et le Bulletin Officiel de la Cote font foi. Les données de marché peuvent être différées.</p>
      <h2 className="text-h3">Droit applicable</h2>
      <p>[À préciser par le service juridique].</p>
    </LegalPage>
  );
}
