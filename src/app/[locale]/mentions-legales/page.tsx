import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { LegalPage } from "@/components/content/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/mentions-legales">): Promise<Metadata> {
  return pageTitle(params, (d) => d.footer.legal);
}

const T = {
  fr: [
    ["Éditeur", "Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC), société anonyme avec Conseil d’Administration au capital de 9 073 000 000 FCFA. Siège : Immeuble de la Bourse, B.P. 442 Douala, Cameroun. Téléphone : +237 233 43 85 83. E-mail : bvmac@bvmac.cm."],
    ["Directeur de la publication", "Le Directeur Général de la BVMAC."],
    ["Hébergement", "Le site est hébergé par un prestataire retenu par la Direction des Systèmes d’Information de la BVMAC. Ses coordonnées sont communiquées sur demande à bvmac@bvmac.cm."],
    ["Propriété intellectuelle", "Les contenus, logos et marques présents sur ce site sont la propriété de la BVMAC ou de leurs titulaires. Toute reproduction non autorisée est interdite."],
    ["Responsabilité", "Seuls les avis officiels et le Bulletin Officiel de la Cote font foi. Les données de marché peuvent être différées."],
    ["Droit applicable", "Le présent site est soumis au droit en vigueur au Cameroun, siège de la BVMAC, et aux textes communautaires de la CEMAC."],
  ],
  en: [
    ["Publisher", "Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC), a public limited company with a Board of Directors and share capital of FCFA 9,073,000,000. Headquarters: Immeuble de la Bourse, P.O. Box 442 Douala, Cameroon. Phone: +237 233 43 85 83. E-mail: bvmac@bvmac.cm."],
    ["Publication director", "The Chief Executive Officer of the BVMAC."],
    ["Hosting", "The website is hosted by a provider selected by the BVMAC Information Systems Department. Its details are available on request at bvmac@bvmac.cm."],
    ["Intellectual property", "The content, logos and trademarks on this website belong to the BVMAC or their respective owners. Any unauthorised reproduction is prohibited."],
    ["Liability", "Only official notices and the Official Price Bulletin are authoritative. Market data may be delayed."],
    ["Governing law", "This website is governed by the law in force in Cameroon, where the BVMAC has its headquarters, and by CEMAC regional texts."],
  ],
  es: [
    ["Editor", "Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC), sociedad anónima con Consejo de Administración y capital de 9 073 000 000 FCFA. Sede: Immeuble de la Bourse, Apdo. 442 Duala, Camerún. Teléfono: +237 233 43 85 83. Correo: bvmac@bvmac.cm."],
    ["Director de la publicación", "El Director General de la BVMAC."],
    ["Alojamiento", "El sitio está alojado por un proveedor seleccionado por la Dirección de Sistemas de Información de la BVMAC. Sus datos se facilitan a petición en bvmac@bvmac.cm."],
    ["Propiedad intelectual", "Los contenidos, logotipos y marcas de este sitio son propiedad de la BVMAC o de sus titulares. Queda prohibida toda reproducción no autorizada."],
    ["Responsabilidad", "Solo los avisos oficiales y el Boletín Oficial de Cotización tienen valor oficial. Los datos de mercado pueden estar diferidos."],
    ["Derecho aplicable", "Este sitio se rige por el derecho vigente en Camerún, sede de la BVMAC, y por los textos comunitarios de la CEMAC."],
  ],
};

export default async function LegalNoticePage({ params }: PageProps<"/[locale]/mentions-legales">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <LegalPage locale={locale} dict={dict} title={dict.footer.legal} updated="2026-10-15">
      {T[locale].map(([h, p]) => (
        <div key={h}>
          <h2 className="text-h3">{h}</h2>
          <p>{p}</p>
        </div>
      ))}
    </LegalPage>
  );
}
