import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { LeaderMessage } from "@/components/about/LeaderMessage";

const T = {
  fr: {
    title: "Mot du Président du Conseil d’Administration",
    role: "Président du Conseil d’Administration",
    quote: "Une bourse régionale forte est un bien commun : elle relie l’épargne de nos six pays aux projets qui feront leur croissance.",
    paragraphs: [
      "Depuis l’unification du marché financier de l’Afrique centrale, la BVMAC a franchi des étapes décisives : un cadre réglementaire unique, un siège à Douala et des plateformes de négociation communes aux six États de la CEMAC.",
      "Le Conseil d’Administration veille à ce que la Bourse remplisse sa mission de service public avec rigueur, transparence et équité. Nos priorités sont claires : accroître le nombre d’émetteurs, élargir la base d’investisseurs et moderniser nos infrastructures.",
      "L’arrivée de nouvelles sociétés à la cote, comme BGFI Holding Corporation en 2026, montre que les entreprises de la sous-région trouvent à la BVMAC un moyen crédible de lever des capitaux et de gagner en visibilité.",
      "Je remercie les États, les actionnaires, la COSUMAF, les sociétés de bourse et l’ensemble des collaborateurs de la BVMAC pour leur engagement au service du développement du marché.",
    ],
  },
  en: {
    title: "Message from the Chairman of the Board",
    role: "Chairman of the Board of Directors",
    quote: "A strong regional stock exchange is a common good: it connects the savings of our six countries to the projects that will drive their growth.",
    paragraphs: [
      "Since the Central African financial market was unified, the BVMAC has taken decisive steps: a single regulatory framework, headquarters in Douala and trading platforms shared by the six CEMAC states.",
      "The Board of Directors ensures that the Exchange fulfils its public-service mission with rigour, transparency and fairness. Our priorities are clear: more issuers, a broader investor base and modern infrastructure.",
      "The arrival of new listed companies, such as BGFI Holding Corporation in 2026, shows that companies in the region see the BVMAC as a credible way to raise capital and gain visibility.",
      "I thank the states, the shareholders, COSUMAF, the brokers and all BVMAC staff for their commitment to developing the market.",
    ],
  },
  es: {
    title: "Mensaje del Presidente del Consejo de Administración",
    role: "Presidente del Consejo de Administración",
    quote: "Una bolsa regional fuerte es un bien común: conecta el ahorro de nuestros seis países con los proyectos que impulsarán su crecimiento.",
    paragraphs: [
      "Desde la unificación del mercado financiero de África Central, la BVMAC ha dado pasos decisivos: un marco reglamentario único, una sede en Duala y plataformas de negociación comunes a los seis Estados de la CEMAC.",
      "El Consejo de Administración vela por que la Bolsa cumpla su misión de servicio público con rigor, transparencia y equidad. Nuestras prioridades son claras: aumentar el número de emisores, ampliar la base de inversores y modernizar nuestras infraestructuras.",
      "La llegada de nuevas sociedades a la cotización, como BGFI Holding Corporation en 2026, demuestra que las empresas de la subregión encuentran en la BVMAC un medio creíble para captar capital y ganar visibilidad.",
      "Agradezco a los Estados, los accionistas, la COSUMAF, las sociedades de bolsa y todo el personal de la BVMAC su compromiso con el desarrollo del mercado.",
    ],
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/gouvernance/message-du-pca">): Promise<Metadata> {
  const { locale } = await params;
  return pageTitle(params, () => T[locale as keyof typeof T]?.title ?? T.fr.title);
}

export default async function PcaMessagePage({ params }: PageProps<"/[locale]/la-bvmac/gouvernance/message-du-pca">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={t.title}>
      <LeaderMessage role={t.role} photo="/photos/governance-officials.webp" backHref={localePath(locale, "/la-bvmac/gouvernance")} backLabel={dict.nav.items.governance} quote={t.quote} paragraphs={t.paragraphs} />
    </ContentPage>
  );
}
