import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { LeaderMessage } from "@/components/about/LeaderMessage";

const T = {
  fr: {
    title: "Mot du Directeur Général",
    role: "Directeur Général",
    quote: "Notre ambition : faire de la BVMAC la première source de financement des économies de la CEMAC, et une bourse accessible à chaque épargnant.",
    paragraphs: [
      "La Bourse des Valeurs Mobilières de l’Afrique Centrale est au service des entreprises, des États et des épargnants de six pays. Chaque séance de cotation contribue à orienter l’épargne vers l’investissement productif.",
      "Nous avons engagé la modernisation de nos outils : diffusion des cours en temps réel, publication systématique des avis et communiqués, nouveau site et application mobile. L’objectif est simple : une information de marché fiable, rapide et accessible à tous.",
      "L’éducation financière est au cœur de notre action. L’École de la Bourse, les journées portes ouvertes et nos partenariats avec les universités permettent à de nouveaux investisseurs de découvrir le marché en toute confiance.",
      "Aux dirigeants d’entreprise, je dis : la bourse n’est pas réservée aux grands groupes. Nos équipes vous accompagnent à chaque étape de l’introduction en bourse ou de l’émission obligataire.",
    ],
  },
  en: {
    title: "Message from the Chief Executive Officer",
    role: "Chief Executive Officer",
    quote: "Our ambition: to make the BVMAC the leading source of financing for the CEMAC economies, and an exchange open to every saver.",
    paragraphs: [
      "The Central African Stock Exchange serves the companies, states and savers of six countries. Every trading session helps channel savings into productive investment.",
      "We have begun modernising our tools: real-time prices, systematic publication of notices and communiqués, a new website and a mobile app. The goal is simple: reliable, fast market information that is open to everyone.",
      "Financial education is at the heart of what we do. The Stock Market School, open days and our partnerships with universities help new investors discover the market with confidence.",
      "To business leaders, I say: the stock exchange is not only for large groups. Our teams support you at every step of an IPO or bond issue.",
    ],
  },
  es: {
    title: "Mensaje del Director General",
    role: "Director General",
    quote: "Nuestra ambición: hacer de la BVMAC la principal fuente de financiación de las economías de la CEMAC y una bolsa accesible a todos los ahorradores.",
    paragraphs: [
      "La Bolsa de Valores de África Central está al servicio de las empresas, los Estados y los ahorradores de seis países. Cada sesión de cotización contribuye a orientar el ahorro hacia la inversión productiva.",
      "Hemos emprendido la modernización de nuestras herramientas: difusión de cotizaciones en tiempo real, publicación sistemática de avisos y comunicados, nuevo sitio web y aplicación móvil. El objetivo es sencillo: una información de mercado fiable, rápida y accesible para todos.",
      "La educación financiera está en el centro de nuestra acción. La Escuela de Bolsa, las jornadas de puertas abiertas y nuestras alianzas con las universidades permiten a nuevos inversores descubrir el mercado con confianza.",
      "A los directivos de empresa les digo: la bolsa no está reservada a los grandes grupos. Nuestros equipos le acompañan en cada etapa de la salida a bolsa o de la emisión de obligaciones.",
    ],
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/gouvernance/message-du-dg">): Promise<Metadata> {
  const { locale } = await params;
  return pageTitle(params, () => T[locale as keyof typeof T]?.title ?? T.fr.title);
}

export default async function DgMessagePage({ params }: PageProps<"/[locale]/la-bvmac/gouvernance/message-du-dg">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={t.title}>
      <LeaderMessage role={t.role} photo="/photos/ceremony-speech.webp" backHref={localePath(locale, "/la-bvmac/gouvernance")} backLabel={dict.nav.items.governance} quote={t.quote} paragraphs={t.paragraphs} />
    </ContentPage>
  );
}
