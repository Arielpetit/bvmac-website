import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { MARKET_NODES } from "@/data/institution";
import { ContentPage } from "@/components/content/ContentPage";
import { MarketDiagram } from "@/components/institution/MarketDiagram";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/organisation-du-marche">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.organisation);
}

export default async function OrganisationPage({ params }: PageProps<"/[locale]/la-bvmac/organisation-du-marche">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="about" title="Organisation du marché financier régional" intro="Qui fait quoi sur le marché financier de l'Afrique centrale : le régulateur, l'entreprise de marché, le dépositaire, les intermédiaires, les émetteurs et les investisseurs.">
      <MarketDiagram nodes={MARKET_NODES} />
      <section aria-labelledby="list" className="mt-12">
        <h2 id="list" className="text-h2">Les acteurs en détail</h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          {MARKET_NODES.map((n) => (
            <div key={n.id} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <dt>
                <span className="eyebrow">{n.role}</span>
                <span className="mt-1 block font-serif-display text-xl text-heading">{n.name}</span>
              </dt>
              {n.details.map((d) => (
                <dd key={d} className="mt-2 text-sm text-muted">{d}</dd>
              ))}
            </div>
          ))}
        </dl>
      </section>
    </ContentPage>
  );
}
