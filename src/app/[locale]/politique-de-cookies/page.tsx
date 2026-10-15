import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { LegalPage } from "@/components/content/LegalPage";
import { CookieSettingsLink } from "@/components/layout/CookieConsent";

const T = {
  fr: {
    title: "Politique de cookies",
    toc: ["Principes", "Liste des cookies", "Vos choix"],
    principlesTitle: "Principes",
    principles: "Un cookie est un petit fichier déposé sur votre appareil. La BVMAC limite leur usage au strict nécessaire. Aucun cookie publicitaire n’est utilisé. Refuser est aussi simple qu’accepter, et fermer le bandeau ne vaut pas consentement.",
    listTitle: "Liste des cookies et traceurs",
    caption: "Cookies utilisés",
    head: ["Nom", "Catégorie", "Finalité", "Durée", "Émetteur"],
    rows: [
      ["NEXT_LOCALE", "Nécessaire", "Mémorise la langue choisie", "1 an", "BVMAC"],
      ["bvmac-consent", "Nécessaire", "Mémorise vos choix de cookies", "6 mois", "BVMAC"],
      ["bvmac-theme", "Nécessaire (stockage local)", "Mémorise le thème clair ou sombre", "Jusqu’à suppression", "BVMAC"],
      ["bvmac-favourites", "Nécessaire (stockage local)", "Liste de valeurs suivies", "Jusqu’à suppression", "BVMAC"],
      ["bvmac-school / bvmac-simulator", "Nécessaire (stockage local)", "Progression pédagogique et portefeuille virtuel", "Jusqu’à suppression", "BVMAC"],
      ["_pk_id, _pk_ses", "Mesure d’audience", "Statistiques de visite anonymisées", "13 mois / 30 min", "BVMAC (outil hébergé)"],
      ["YouTube (VISITOR_INFO1_LIVE…)", "Contenus tiers", "Lecture des vidéos BVMAC TV", "Jusqu’à 6 mois", "Google"],
    ],
    choiceTitle: "Modifier vos choix",
    choice: "Vous pouvez modifier vos préférences à tout moment :",
    browser: "Vous pouvez aussi supprimer les cookies depuis les réglages de votre navigateur.",
  },
  en: {
    title: "Cookie policy",
    toc: ["Principles", "List of cookies", "Your choices"],
    principlesTitle: "Principles",
    principles: "A cookie is a small file stored on your device. The BVMAC keeps their use to what is strictly necessary. No advertising cookies are used. Refusing is as easy as accepting, and closing the banner does not count as consent.",
    listTitle: "List of cookies and trackers",
    caption: "Cookies used",
    head: ["Name", "Category", "Purpose", "Duration", "Set by"],
    rows: [
      ["NEXT_LOCALE", "Necessary", "Remembers your chosen language", "1 year", "BVMAC"],
      ["bvmac-consent", "Necessary", "Remembers your cookie choices", "6 months", "BVMAC"],
      ["bvmac-theme", "Necessary (local storage)", "Remembers the light or dark theme", "Until deleted", "BVMAC"],
      ["bvmac-favourites", "Necessary (local storage)", "List of followed securities", "Until deleted", "BVMAC"],
      ["bvmac-school / bvmac-simulator", "Necessary (local storage)", "Learning progress and virtual portfolio", "Until deleted", "BVMAC"],
      ["_pk_id, _pk_ses", "Audience measurement", "Anonymised visit statistics", "13 months / 30 min", "BVMAC (self-hosted tool)"],
      ["YouTube (VISITOR_INFO1_LIVE…)", "Third-party content", "Playing BVMAC TV videos", "Up to 6 months", "Google"],
    ],
    choiceTitle: "Change your choices",
    choice: "You can change your preferences at any time:",
    browser: "You can also delete cookies from your browser settings.",
  },
  es: {
    title: "Política de cookies",
    toc: ["Principios", "Lista de cookies", "Sus opciones"],
    principlesTitle: "Principios",
    principles: "Una cookie es un pequeño archivo que se guarda en su dispositivo. La BVMAC limita su uso a lo estrictamente necesario. No se utiliza ninguna cookie publicitaria. Rechazar es tan sencillo como aceptar, y cerrar el aviso no equivale a consentir.",
    listTitle: "Lista de cookies y rastreadores",
    caption: "Cookies utilizadas",
    head: ["Nombre", "Categoría", "Finalidad", "Duración", "Emisor"],
    rows: [
      ["NEXT_LOCALE", "Necesaria", "Recuerda el idioma elegido", "1 año", "BVMAC"],
      ["bvmac-consent", "Necesaria", "Recuerda sus opciones de cookies", "6 meses", "BVMAC"],
      ["bvmac-theme", "Necesaria (almacenamiento local)", "Recuerda el tema claro u oscuro", "Hasta su eliminación", "BVMAC"],
      ["bvmac-favourites", "Necesaria (almacenamiento local)", "Lista de valores seguidos", "Hasta su eliminación", "BVMAC"],
      ["bvmac-school / bvmac-simulator", "Necesaria (almacenamiento local)", "Progreso pedagógico y cartera virtual", "Hasta su eliminación", "BVMAC"],
      ["_pk_id, _pk_ses", "Medición de audiencia", "Estadísticas de visita anonimizadas", "13 meses / 30 min", "BVMAC (herramienta propia)"],
      ["YouTube (VISITOR_INFO1_LIVE…)", "Contenidos de terceros", "Reproducción de los vídeos de BVMAC TV", "Hasta 6 meses", "Google"],
    ],
    choiceTitle: "Modificar sus opciones",
    choice: "Puede modificar sus preferencias en cualquier momento:",
    browser: "También puede borrar las cookies desde la configuración de su navegador.",
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/politique-de-cookies">): Promise<Metadata> {
  const { locale } = await params;
  return { title: (T[locale as keyof typeof T] ?? T.fr).title };
}

export default async function CookiesPage({ params }: PageProps<"/[locale]/politique-de-cookies">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <LegalPage locale={locale} dict={dict} title={t.title} updated="2026-10-15" toc={[{ id: "principes", label: t.toc[0] }, { id: "liste", label: t.toc[1] }, { id: "choix", label: t.toc[2] }]}>
      <h2 id="principes" className="text-h2">{t.principlesTitle}</h2>
      <p>{t.principles}</p>
      <h2 id="liste" className="text-h2">{t.listTitle}</h2>
      <div className="not-prose my-6 relative overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface" data-lenis-prevent>
        <table className="w-full min-w-[760px] text-sm">
          <caption className="sr-only">{t.caption}</caption>
          <thead><tr className="border-b border-line">{t.head.map((h) => <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.1em] text-muted">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">
            {t.rows.map((c) => <tr key={c[0]}>{c.map((v, i) => i === 0 ? <th key={i} scope="row" className="code px-4 py-3 text-left font-normal text-heading">{v}</th> : <td key={i} className="px-4 py-3 text-muted">{v}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <h2 id="choix" className="text-h2">{t.choiceTitle}</h2>
      <p>{t.choice} <CookieSettingsLink className="link" />. {t.browser}</p>
    </LegalPage>
  );
}
