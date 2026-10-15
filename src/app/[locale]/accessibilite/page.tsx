import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { LegalPage } from "@/components/content/LegalPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/accessibilite">): Promise<Metadata> {
  return pageTitle(params, (d) => d.footer.accessibility);
}

const T = {
  fr: {
    intro: "La BVMAC s’engage à rendre son site accessible au plus grand nombre. L’objectif est la conformité au niveau AA des Règles pour l’accessibilité des contenus Web (WCAG 2.1).",
    measuresTitle: "Mesures prises",
    measures: ["Navigation complète au clavier, lien d’évitement et focus visible.", "Contrastes vérifiés selon la charte BVMAC ; les variations de cours ne reposent jamais sur la seule couleur.", "Graphiques accompagnés d’un résumé et d’un tableau de données.", "Défilement des cours pouvant être mis en pause ; respect de la préférence « réduire les animations ».", "Textes alternatifs pour les images et sous-titres pour les vidéos."],
    reportTitle: "Signaler un problème",
    report: "Si vous rencontrez une difficulté d’accès à un contenu, écrivez-nous via la page Contact : nous vous fournirons l’information sous une autre forme.",
    statusTitle: "État de conformité",
    status: "Le site est en cours d’audit. Les résultats seront publiés sur cette page.",
  },
  en: {
    intro: "The BVMAC is committed to making its website accessible to as many people as possible. The goal is conformance with level AA of the Web Content Accessibility Guidelines (WCAG 2.1).",
    measuresTitle: "Measures taken",
    measures: ["Full keyboard navigation, a skip link and a visible focus.", "Contrast checked against the BVMAC brand guidelines; price changes never rely on colour alone.", "Charts come with a summary and a data table.", "The price ticker can be paused; the “reduce motion” preference is respected.", "Alternative text for images and subtitles for videos."],
    reportTitle: "Report a problem",
    report: "If you have trouble accessing any content, write to us through the Contact page: we will provide the information in another format.",
    statusTitle: "Conformance status",
    status: "The website is being audited. The results will be published on this page.",
  },
  es: {
    intro: "La BVMAC se compromete a hacer su sitio accesible al mayor número de personas. El objetivo es cumplir el nivel AA de las Pautas de Accesibilidad para el Contenido Web (WCAG 2.1).",
    measuresTitle: "Medidas adoptadas",
    measures: ["Navegación completa con el teclado, enlace de salto y foco visible.", "Contrastes comprobados según la identidad de la BVMAC; las variaciones de precio nunca dependen solo del color.", "Gráficos acompañados de un resumen y de una tabla de datos.", "La cinta de cotizaciones puede pausarse; se respeta la preferencia «reducir movimiento».", "Textos alternativos para las imágenes y subtítulos para los vídeos."],
    reportTitle: "Comunicar un problema",
    report: "Si tiene dificultades para acceder a un contenido, escríbanos a través de la página Contacto: le facilitaremos la información en otro formato.",
    statusTitle: "Estado de conformidad",
    status: "El sitio está en proceso de auditoría. Los resultados se publicarán en esta página.",
  },
};

export default async function AccessibilityPage({ params }: PageProps<"/[locale]/accessibilite">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <LegalPage locale={locale} dict={dict} title={dict.footer.accessibility} updated="2026-10-15">
      <p>{t.intro}</p>
      <h2 className="text-h3">{t.measuresTitle}</h2>
      <ul>{t.measures.map((m) => <li key={m}>{m}</li>)}</ul>
      <h2 className="text-h3">{t.reportTitle}</h2>
      <p>{t.report}</p>
      <h2 className="text-h3">{t.statusTitle}</h2>
      <p>{t.status}</p>
    </LegalPage>
  );
}
