import type { Metadata } from "next";
import { StackTable } from "@/components/ui/StackTable";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { LegalPage } from "@/components/content/LegalPage";
import { RightsForm } from "@/components/content/RightsForm";
import { CookieSettingsLink } from "@/components/layout/CookieConsent";

export async function generateMetadata({ params }: PageProps<"/[locale]/politique-de-confidentialite">): Promise<Metadata> {
  return pageTitle(params, (d) => d.footer.privacy);
}

const TOC_IDS = ["responsable", "registre", "transferts", "mineurs", "cookies", "securite", "droits"];

const T = {
  fr: {
    toc: ["Responsable", "Traitements", "Transferts", "Mineurs", "Cookies", "Sécurité", "Vos droits"],
    intro: "La BVMAC protège les données personnelles des utilisateurs de ses plateformes conformément à la loi n°2024/017 du 23 décembre 2024 relative à la protection des données à caractère personnel.",
    controllerTitle: "Responsable du traitement",
    controller: "Bourse des Valeurs Mobilières de l’Afrique Centrale, B.P. 442 Douala, Cameroun. Pour toute question relative à vos données, écrivez à bvmac@bvmac.cm à l’attention du délégué à la protection des données.",
    registerTitle: "Traitements de données",
    caption: "Traitements de données personnelles",
    head: ["Traitement", "Données", "Finalité", "Base légale", "Destinataires", "Conservation"],
    rows: [
      ["Newsletter et alertes", "Nom, e-mail, langue, thèmes, preuve du consentement", "Envoi d’informations de la BVMAC", "Consentement", "Service Communication ; prestataire d’envoi", "Jusqu’au désabonnement"],
      ["Contact et questions", "Nom, e-mail, téléphone, message", "Répondre aux demandes", "Intérêt légitime", "Service concerné de la BVMAC", "24 mois après clôture"],
      ["Réclamations", "Identité, coordonnées, description, pièces", "Traiter et suivre la réclamation", "Obligation légale / intérêt légitime", "Direction Juridique ; COSUMAF si saisie", "5 ans après clôture"],
      ["Mesure d’audience", "Données de navigation pseudonymisées, IP tronquée", "Statistiques de visite", "Consentement", "DSI de la BVMAC (outil hébergé en interne)", "13 mois"],
      ["Journaux de sécurité", "Adresse IP, navigateur, événements", "Sécurité du site, prévention des fraudes", "Intérêt légitime", "DSI ; hébergeur", "12 mois"],
    ],
    transfersTitle: "Transferts hors de la CEMAC",
    transfers: "Par principe, les données sont hébergées dans la zone CEMAC. Si un prestataire situé hors de la zone intervient (envoi d’e-mails, par exemple), le transfert est encadré par des garanties contractuelles et vous en êtes informé.",
    minorsTitle: "Mineurs",
    minors: "Le site s’adresse au grand public. Les outils pédagogiques (École de la Bourse, portefeuille virtuel) fonctionnent sans compte et sans collecte de données. Les formulaires ne doivent pas être remplis par un mineur de moins de 15 ans sans l’accord d’un parent.",
    cookiesTitle: "Cookies",
    cookies: "Les cookies strictement nécessaires sont toujours actifs. La mesure d’audience et les vidéos YouTube ne sont activées qu’avec votre accord, modifiable à tout moment :",
    cookiesMore: "Détails dans la",
    cookiesLink: "politique de cookies",
    securityTitle: "Sécurité et hébergement",
    security: "Les données sont chiffrées en transit et au repos, et accessibles aux seules personnes habilitées. Vos favoris et votre progression dans l’École de la Bourse restent sur votre appareil.",
    rightsTitle: "Vos droits",
    rights: "Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité, ainsi que du droit de retirer votre consentement. Réponse sous un mois. Vous pouvez aussi saisir l’autorité de protection des données compétente.",
  },
  en: {
    toc: ["Controller", "Processing", "Transfers", "Minors", "Cookies", "Security", "Your rights"],
    intro: "The BVMAC protects the personal data of the users of its platforms in accordance with Law No. 2024/017 of 23 December 2024 on the protection of personal data.",
    controllerTitle: "Data controller",
    controller: "Bourse des Valeurs Mobilières de l’Afrique Centrale, P.O. Box 442 Douala, Cameroon. For any question about your data, write to bvmac@bvmac.cm for the attention of the data protection officer.",
    registerTitle: "Data processing",
    caption: "Processing of personal data",
    head: ["Processing", "Data", "Purpose", "Legal basis", "Recipients", "Retention"],
    rows: [
      ["Newsletter and alerts", "Name, e-mail, language, topics, proof of consent", "Sending BVMAC information", "Consent", "Communications Unit; mailing provider", "Until you unsubscribe"],
      ["Contact and questions", "Name, e-mail, phone, message", "Replying to requests", "Legitimate interest", "Relevant BVMAC unit", "24 months after closure"],
      ["Complaints", "Identity, contact details, description, documents", "Handling and following up the complaint", "Legal obligation / legitimate interest", "Legal Department; COSUMAF if referred", "5 years after closure"],
      ["Audience measurement", "Pseudonymised browsing data, truncated IP", "Visit statistics", "Consent", "BVMAC IT Department (self-hosted tool)", "13 months"],
      ["Security logs", "IP address, browser, events", "Website security, fraud prevention", "Legitimate interest", "IT Department; host", "12 months"],
    ],
    transfersTitle: "Transfers outside the CEMAC",
    transfers: "As a rule, data is hosted within the CEMAC area. If a provider outside the area is involved (for sending e-mails, for example), the transfer is covered by contractual safeguards and you are informed.",
    minorsTitle: "Minors",
    minors: "The website is aimed at the general public. The learning tools (Stock Market School, virtual portfolio) work without an account and without collecting data. Forms should not be filled in by a minor under 15 without a parent’s consent.",
    cookiesTitle: "Cookies",
    cookies: "Strictly necessary cookies are always active. Audience measurement and YouTube videos are only enabled with your consent, which you can change at any time:",
    cookiesMore: "Details in the",
    cookiesLink: "cookie policy",
    securityTitle: "Security and hosting",
    security: "Data is encrypted in transit and at rest, and only authorised staff can access it. Your favourites and your Stock Market School progress stay on your device.",
    rightsTitle: "Your rights",
    rights: "You have the right of access, rectification, erasure, objection, restriction and portability, and the right to withdraw your consent. We reply within one month. You can also contact the competent data protection authority.",
  },
  es: {
    toc: ["Responsable", "Tratamientos", "Transferencias", "Menores", "Cookies", "Seguridad", "Sus derechos"],
    intro: "La BVMAC protege los datos personales de los usuarios de sus plataformas de conformidad con la Ley n.º 2024/017 de 23 de diciembre de 2024 sobre la protección de datos personales.",
    controllerTitle: "Responsable del tratamiento",
    controller: "Bourse des Valeurs Mobilières de l’Afrique Centrale, Apdo. 442 Duala, Camerún. Para cualquier pregunta sobre sus datos, escriba a bvmac@bvmac.cm a la atención del delegado de protección de datos.",
    registerTitle: "Tratamientos de datos",
    caption: "Tratamientos de datos personales",
    head: ["Tratamiento", "Datos", "Finalidad", "Base jurídica", "Destinatarios", "Conservación"],
    rows: [
      ["Boletín y alertas", "Nombre, correo, idioma, temas, prueba del consentimiento", "Envío de información de la BVMAC", "Consentimiento", "Servicio de Comunicación; proveedor de envíos", "Hasta la baja"],
      ["Contacto y preguntas", "Nombre, correo, teléfono, mensaje", "Responder a las solicitudes", "Interés legítimo", "Servicio correspondiente de la BVMAC", "24 meses tras el cierre"],
      ["Reclamaciones", "Identidad, datos de contacto, descripción, documentos", "Tramitar y seguir la reclamación", "Obligación legal / interés legítimo", "Dirección Jurídica; COSUMAF si se le remite", "5 años tras el cierre"],
      ["Medición de audiencia", "Datos de navegación seudonimizados, IP truncada", "Estadísticas de visita", "Consentimiento", "DSI de la BVMAC (herramienta propia)", "13 meses"],
      ["Registros de seguridad", "Dirección IP, navegador, eventos", "Seguridad del sitio, prevención del fraude", "Interés legítimo", "DSI; proveedor de alojamiento", "12 meses"],
    ],
    transfersTitle: "Transferencias fuera de la CEMAC",
    transfers: "Por principio, los datos se alojan en la zona CEMAC. Si interviene un proveedor situado fuera de la zona (por ejemplo, para enviar correos), la transferencia está protegida por garantías contractuales y se le informa.",
    minorsTitle: "Menores",
    minors: "El sitio se dirige al público en general. Las herramientas pedagógicas (Escuela de Bolsa, cartera virtual) funcionan sin cuenta y sin recogida de datos. Los formularios no deben rellenarlos menores de 15 años sin el consentimiento de un progenitor.",
    cookiesTitle: "Cookies",
    cookies: "Las cookies estrictamente necesarias están siempre activas. La medición de audiencia y los vídeos de YouTube solo se activan con su consentimiento, modificable en cualquier momento:",
    cookiesMore: "Más detalles en la",
    cookiesLink: "política de cookies",
    securityTitle: "Seguridad y alojamiento",
    security: "Los datos se cifran en tránsito y en reposo, y solo pueden acceder a ellos las personas autorizadas. Sus favoritos y su progreso en la Escuela de Bolsa se quedan en su dispositivo.",
    rightsTitle: "Sus derechos",
    rights: "Tiene derecho de acceso, rectificación, supresión, oposición, limitación y portabilidad, así como a retirar su consentimiento. Respondemos en el plazo de un mes. También puede dirigirse a la autoridad de protección de datos competente.",
  },
};

export default async function PrivacyPage({ params }: PageProps<"/[locale]/politique-de-confidentialite">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <LegalPage locale={locale} dict={dict} title={dict.footer.privacy} updated="2026-10-15" toc={TOC_IDS.map((id, i) => ({ id, label: t.toc[i] }))}>
      <p>{t.intro}</p>
      <h2 id="responsable" className="text-h2">{t.controllerTitle}</h2>
      <p>{t.controller}</p>
      <h2 id="registre" className="text-h2">{t.registerTitle}</h2>
      <StackTable alwaysStack className="not-prose my-6 [overflow-wrap:normal]" caption={t.caption} head={t.head} rows={t.rows} minWidth={760} />
      <h2 id="transferts" className="text-h2">{t.transfersTitle}</h2>
      <p>{t.transfers}</p>
      <h2 id="mineurs" className="text-h2">{t.minorsTitle}</h2>
      <p>{t.minors}</p>
      <h2 id="cookies" className="text-h2">{t.cookiesTitle}</h2>
      <p>{t.cookies} <CookieSettingsLink className="link" />. {t.cookiesMore} <Link href={localePath(locale, "/politique-de-cookies")} className="link">{t.cookiesLink}</Link>.</p>
      <h2 id="securite" className="text-h2">{t.securityTitle}</h2>
      <p>{t.security}</p>
      <h2 id="droits" className="text-h2">{t.rightsTitle}</h2>
      <p>{t.rights}</p>
      <RightsForm />
    </LegalPage>
  );
}
