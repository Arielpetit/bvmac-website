import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { LegalPage } from "@/components/content/LegalPage";
import { CookieSettingsLink } from "@/components/layout/CookieConsent";

export const metadata: Metadata = { title: "Politique de cookies" };

const COOKIES = [
  ["NEXT_LOCALE", "Nécessaire", "Mémorise la langue choisie", "1 an", "BVMAC"],
  ["bvmac-consent", "Nécessaire", "Mémorise vos choix de cookies", "6 mois", "BVMAC"],
  ["bvmac-theme", "Nécessaire (stockage local)", "Mémorise le thème clair ou sombre", "Jusqu’à suppression", "BVMAC"],
  ["bvmac-favourites", "Nécessaire (stockage local)", "Liste de valeurs suivies", "Jusqu’à suppression", "BVMAC"],
  ["bvmac-school / bvmac-simulator", "Nécessaire (stockage local)", "Progression pédagogique et portefeuille virtuel", "Jusqu’à suppression", "BVMAC"],
  ["_pk_id, _pk_ses", "Mesure d’audience", "Statistiques de visite anonymisées", "13 mois / 30 min", "BVMAC (outil hébergé)"],
  ["YouTube (VISITOR_INFO1_LIVE…)", "Contenus tiers", "Lecture des vidéos BVMAC TV", "Jusqu’à 6 mois", "Google"],
];

export default async function CookiesPage({ params }: PageProps<"/[locale]/politique-de-cookies">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <LegalPage locale={locale} dict={dict} title="Politique de cookies" updated="à définir" toc={[{ id: "principes", label: "Principes" }, { id: "liste", label: "Liste des cookies" }, { id: "choix", label: "Vos choix" }]}>
      <h2 id="principes" className="text-h2">Principes</h2>
      <p>Un cookie est un petit fichier déposé sur votre appareil. La BVMAC limite leur usage au strict nécessaire. Aucun cookie publicitaire n’est utilisé. Refuser est aussi simple qu’accepter, et fermer le bandeau ne vaut pas consentement.</p>
      <h2 id="liste" className="text-h2">Liste des cookies et traceurs</h2>
      <div className="not-prose my-6 relative overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface" data-lenis-prevent>
        <table className="w-full min-w-[760px] text-sm">
          <caption className="sr-only">Cookies utilisés</caption>
          <thead><tr className="border-b border-line">{["Nom", "Catégorie", "Finalité", "Durée", "Émetteur"].map((h) => <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.1em] text-muted">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">
            {COOKIES.map((c) => <tr key={c[0]}>{c.map((v, i) => i === 0 ? <th key={i} scope="row" className="code px-4 py-3 text-left font-normal text-heading">{v}</th> : <td key={i} className="px-4 py-3 text-muted">{v}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <h2 id="choix" className="text-h2">Modifier vos choix</h2>
      <p>Vous pouvez modifier vos préférences à tout moment : <CookieSettingsLink className="link" />. Vous pouvez aussi supprimer les cookies depuis les réglages de votre navigateur.</p>
    </LegalPage>
  );
}
