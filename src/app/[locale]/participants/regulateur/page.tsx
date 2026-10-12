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

const ROLES: Record<string, string> = {
  CEMAC: "Communauté de six États qui fixe le cadre de l'intégration économique, dont le marché financier régional.",
  COSUMAF: "Régulateur du marché : agrée les intermédiaires, vise les opérations d'appel public à l'épargne et surveille le marché.",
  BEAC: "Banque centrale des États de l'Afrique centrale ; assure temporairement la fonction de dépositaire central.",
  COBAC: "Commission bancaire : supervise les banques, dont celles qui interviennent sur le marché.",
};

export default async function RegulatorPage({ params }: PageProps<"/[locale]/participants/regulateur">) {
  const { locale, dict } = await resolveLocale(params);
  const partners = await getPartners();
  return (
    <ContentPage locale={locale} dict={dict} group="invest" title={dict.nav.items.regulator} intro="Les institutions qui encadrent le marché financier de l’Afrique centrale." image="/photos/governance-officials.webp">
      <ul className="grid gap-4 md:grid-cols-2">
        {partners.map((p) => (
          <li key={p.name} className="card-lift rounded-[var(--radius-panel)] border border-line bg-surface p-8">
            {p.logo && <span className="mb-5 flex h-24 w-fit items-center rounded-2xl bg-white p-3"><Image src={p.logo} alt={`Logo ${p.name}`} width={200} height={160} className="h-full w-auto object-contain" /></span>}
            <h2 className="font-serif-display text-4xl text-heading">{p.name}</h2>
            <p className="eyebrow mt-2">{p.desc}</p>
            <p className="mt-3 text-sm text-muted">{ROLES[p.name]}</p>
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="link mt-4 inline-flex items-center gap-1.5 text-sm">
              Site officiel <ExternalLink aria-hidden="true" className="size-3.5" />
              <span className="sr-only">{dict.a11y.external}</span>
            </a>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
