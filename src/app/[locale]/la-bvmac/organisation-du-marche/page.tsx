import type { Metadata } from "next";
import { tc } from "@/i18n/content";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { MARKET_NODES } from "@/data/institution";
import { ContentPage } from "@/components/content/ContentPage";
import { MarketDiagram } from "@/components/institution/MarketDiagram";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/organisation-du-marche">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.organisation);
}

const T = {
  fr: { title: "Organisation du marché financier régional", intro: "Qui fait quoi sur le marché financier de l’Afrique centrale : le régulateur, l’entreprise de marché, le dépositaire, les intermédiaires, les émetteurs et les investisseurs.", list: "Les acteurs en détail" },
  en: { title: "Organisation of the regional financial market", intro: "Who does what on the Central African financial market: the regulator, the market operator, the depository, intermediaries, issuers and investors.", list: "The participants in detail" },
  es: { title: "Organización del mercado financiero regional", intro: "Quién hace qué en el mercado financiero de África Central: el regulador, la empresa de mercado, el depositario, los intermediarios, los emisores y los inversores.", list: "Los participantes en detalle" },
};

export default async function OrganisationPage({ params }: PageProps<"/[locale]/la-bvmac/organisation-du-marche">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const nodes = MARKET_NODES.map((n) => ({ ...n, name: tc(n.name, locale), role: tc(n.role, locale), details: n.details.map((d) => tc(d, locale)) }));
  return (
    <ContentPage locale={locale} dict={dict} title={t.title} intro={t.intro}>
      <MarketDiagram nodes={nodes} />
      <section aria-labelledby="list" className="mt-12">
        <h2 id="list" className="text-h2">{t.list}</h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          {nodes.map((n) => (
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
