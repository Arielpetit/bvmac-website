import Image from "next/image";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getPartners } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/participants/regulateur">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.regulator);
}

const T = {
  fr: {
    intro: "Les institutions qui encadrent le marché financier de l’Afrique centrale.",
    site: "Site officiel",
    roles: {
      CEMAC: "Communauté de six États qui fixe le cadre de l’intégration économique, dont le marché financier régional.",
      COSUMAF: "Régulateur du marché : agrée les intermédiaires, vise les opérations d’appel public à l’épargne et surveille le marché.",
      BEAC: "Banque centrale des États de l’Afrique centrale ; assure temporairement la fonction de dépositaire central.",
      COBAC: "Commission bancaire : supervise les banques, dont celles qui interviennent sur le marché.",
    } as Record<string, string>,
  },
  en: {
    intro: "The institutions that oversee the Central African financial market.",
    site: "Official website",
    roles: {
      CEMAC: "A community of six states that sets the framework for economic integration, including the regional financial market.",
      COSUMAF: "The market regulator: licenses intermediaries, approves public offerings and supervises the market.",
      BEAC: "The central bank of the Central African states; acts as central depository on an interim basis.",
      COBAC: "The banking commission: supervises banks, including those active on the market.",
    } as Record<string, string>,
  },
  es: {
    intro: "Las instituciones que regulan el mercado financiero de África Central.",
    site: "Sitio oficial",
    roles: {
      CEMAC: "Comunidad de seis Estados que fija el marco de la integración económica, incluido el mercado financiero regional.",
      COSUMAF: "Regulador del mercado: autoriza a los intermediarios, visa las ofertas públicas y supervisa el mercado.",
      BEAC: "Banco central de los Estados de África Central; asume temporalmente la función de depositario central.",
      COBAC: "Comisión bancaria: supervisa a los bancos, incluidos los que operan en el mercado.",
    } as Record<string, string>,
  },
};

export default async function RegulatorPage({ params }: PageProps<"/[locale]/participants/regulateur">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const partners = await getPartners();
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.regulator} intro={t.intro}>
      <ul className="grid gap-4 md:grid-cols-2">
        {partners.map((p) => (
          <li key={p.name} className="card-lift rounded-[var(--radius-panel)] border border-line bg-surface p-8">
            {p.logo && <span className="mb-5 flex h-24 w-fit items-center rounded-2xl bg-white p-3"><Image src={p.logo} alt={`Logo ${p.name}`} width={200} height={160} className="h-full w-auto object-contain" /></span>}
            <h2 className="font-serif-display text-4xl text-heading">{p.name}</h2>
            <p lang="fr" className="eyebrow mt-2">{p.desc}</p>
            <p className="mt-3 text-sm text-muted">{t.roles[p.name]}</p>
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="link mt-4 inline-flex items-center gap-1.5 text-sm">
              {t.site} <ExternalLink aria-hidden="true" className="size-3.5" />
              <span className="sr-only">{dict.a11y.external}</span>
            </a>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
