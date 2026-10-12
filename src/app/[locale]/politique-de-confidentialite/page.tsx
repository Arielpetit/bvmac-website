import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { LegalPage } from "@/components/content/LegalPage";
import { RightsForm } from "@/components/content/RightsForm";
import { CookieSettingsLink } from "@/components/layout/CookieConsent";

export const metadata: Metadata = { title: "Politique de confidentialité" };

const REGISTER = [
  ["Newsletter et alertes", "Nom, e-mail, langue, thèmes, preuve du consentement", "Envoi d’informations de la BVMAC", "Consentement", "Service Communication ; prestataire d’envoi", "Jusqu’au désabonnement"],
  ["Contact et questions", "Nom, e-mail, téléphone, message", "Répondre aux demandes", "Intérêt légitime", "Service concerné de la BVMAC", "24 mois après clôture"],
  ["Réclamations", "Identité, coordonnées, description, pièces", "Traiter et suivre la réclamation", "Obligation légale / intérêt légitime", "Direction Juridique ; COSUMAF si saisie", "[durée à confirmer]"],
  ["Mesure d’audience", "Données de navigation pseudonymisées, IP tronquée", "Statistiques de visite", "Consentement", "DSI de la BVMAC (outil hébergé en interne)", "13 mois"],
  ["Journaux de sécurité", "Adresse IP, navigateur, événements", "Sécurité du site, prévention des fraudes", "Intérêt légitime", "DSI ; hébergeur", "12 mois"],
];

const TOC = [
  { id: "responsable", label: "Responsable" },
  { id: "registre", label: "Traitements" },
  { id: "transferts", label: "Transferts" },
  { id: "mineurs", label: "Mineurs" },
  { id: "cookies", label: "Cookies" },
  { id: "securite", label: "Sécurité" },
  { id: "droits", label: "Vos droits" },
];

export default async function PrivacyPage({ params }: PageProps<"/[locale]/politique-de-confidentialite">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <LegalPage locale={locale} dict={dict} title={dict.footer.privacy} updated="à définir" toc={TOC}>
      <p>La BVMAC protège les données personnelles des utilisateurs de ses plateformes conformément à la loi n°2024/017 du 23 décembre 2024 relative à la protection des données à caractère personnel.</p>
      <h2 id="responsable" className="text-h2">Responsable du traitement</h2>
      <p>Bourse des Valeurs Mobilières de l’Afrique Centrale, B.P. 442 Douala, Cameroun. Délégué à la protection des données : [à désigner], [adresse e-mail dédiée].</p>
      <h2 id="registre" className="text-h2">Traitements de données</h2>
      <div className="not-prose my-6 relative overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface" data-lenis-prevent>
        <table className="w-full min-w-[900px] text-sm">
          <caption className="sr-only">Traitements de données personnelles</caption>
          <thead>
            <tr className="border-b border-line">{["Traitement", "Données", "Finalité", "Base légale", "Destinataires", "Conservation"].map((h) => <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.1em] text-muted">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-line">
            {REGISTER.map((r) => <tr key={r[0]}>{r.map((c, i) => i === 0 ? <th key={i} scope="row" className="px-4 py-3 text-left font-medium text-heading">{c}</th> : <td key={i} className="px-4 py-3 text-muted">{c}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <h2 id="transferts" className="text-h2">Transferts hors de la CEMAC</h2>
      <p>Par principe, les données sont hébergées dans la zone CEMAC. Si un prestataire situé hors de la zone intervient (envoi d’e-mails, par exemple), le transfert est encadré par des garanties contractuelles et vous en êtes informé. [Liste des prestataires à confirmer par la DSI.]</p>
      <h2 id="mineurs" className="text-h2">Mineurs</h2>
      <p>Le site s’adresse au grand public. Les outils pédagogiques (École de la Bourse, portefeuille virtuel) fonctionnent sans compte et sans collecte de données. Les formulaires ne doivent pas être remplis par un mineur de moins de 15 ans sans l’accord d’un parent.</p>
      <h2 id="cookies" className="text-h2">Cookies</h2>
      <p>Les cookies strictement nécessaires sont toujours actifs. La mesure d’audience et les vidéos YouTube ne sont activées qu’avec votre accord, modifiable à tout moment : <CookieSettingsLink className="link" />. Détails dans la <Link href={localePath(locale, "/politique-de-cookies")} className="link">politique de cookies</Link>.</p>
      <h2 id="securite" className="text-h2">Sécurité et hébergement</h2>
      <p>Les données sont hébergées [lieu validé par la DSI et le RSSI], chiffrées en transit et au repos, et accessibles aux seules personnes habilitées. Vos favoris et votre progression dans l’École de la Bourse restent sur votre appareil.</p>
      <h2 id="droits" className="text-h2">Vos droits</h2>
      <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité, ainsi que du droit de retirer votre consentement. Réponse sous un mois. Vous pouvez aussi saisir l’autorité de protection des données compétente.</p>
      <RightsForm />
    </LegalPage>
  );
}
