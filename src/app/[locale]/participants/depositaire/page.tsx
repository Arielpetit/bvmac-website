import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { Callout } from "@/components/ui/Callout";

export async function generateMetadata({ params }: PageProps<"/[locale]/participants/depositaire">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.depositary);
}

export default async function DepositaryPage({ params }: PageProps<"/[locale]/participants/depositaire">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="invest" title={dict.nav.items.depositary} intro="Conservation des titres et règlement-livraison des transactions conclues en bourse." image="/photos/ceremony-trading-floor.webp">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { t: "Dépositaire central", d: "La Caisse Régionale de Dépôt de Valeurs (CRDV) assure la conservation centrale des titres et le règlement-livraison. La fonction est assurée temporairement par la BEAC." },
          { t: "Teneurs de compte", d: "Les sociétés de bourse et établissements habilités tiennent les comptes titres de leurs clients." },
          { t: "Règlement-livraison", d: "Après chaque séance, la BVMAC transmet les négociations au dépositaire central, qui livre les titres et assure le paiement." },
        ].map((x) => (
          <div key={x.t} className="card-lift rounded-[var(--radius-panel)] border border-line bg-surface p-8">
            <h2 className="font-serif-display text-2xl text-heading">{x.t}</h2>
            <p className="mt-2 text-sm text-muted">{x.d}</p>
          </div>
        ))}
      </div>
      <Callout tone="warning" className="mt-6">Liste des teneurs de compte et rôle exact du dépositaire à confirmer avec la BVMAC.</Callout>
    </ContentPage>
  );
}
