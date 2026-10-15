import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/participants/depositaire">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.depositary);
}

const T = {
  fr: {
    intro: "Conservation des titres et règlement-livraison des transactions conclues en bourse.",
    items: [
      { t: "Dépositaire central", d: "La Caisse Régionale de Dépôt de Valeurs (CRDV) assure la conservation centrale des titres et le règlement-livraison. La fonction est assurée temporairement par la BEAC." },
      { t: "Teneurs de compte", d: "Les sociétés de bourse et établissements habilités tiennent les comptes titres de leurs clients." },
      { t: "Règlement-livraison", d: "Après chaque séance, la BVMAC transmet les négociations au dépositaire central, qui livre les titres et assure le paiement." },
    ],
  },
  en: {
    intro: "Safekeeping of securities and settlement of transactions concluded on the exchange.",
    items: [
      { t: "Central depository", d: "The Caisse Régionale de Dépôt de Valeurs (CRDV) provides central safekeeping of securities and settlement. The BEAC performs this function on an interim basis." },
      { t: "Account keepers", d: "Brokers and authorised institutions keep their clients’ securities accounts." },
      { t: "Settlement and delivery", d: "After each session, the BVMAC sends the trades to the central depository, which delivers the securities and handles payment." },
    ],
  },
  es: {
    intro: "Custodia de los valores y liquidación de las operaciones cerradas en bolsa.",
    items: [
      { t: "Depositario central", d: "La Caisse Régionale de Dépôt de Valeurs (CRDV) se encarga de la custodia central de los valores y de la liquidación. La BEAC asume esta función de forma temporal." },
      { t: "Entidades de llevanza de cuentas", d: "Las sociedades de bolsa y las entidades habilitadas llevan las cuentas de valores de sus clientes." },
      { t: "Liquidación y entrega", d: "Después de cada sesión, la BVMAC transmite las negociaciones al depositario central, que entrega los valores y gestiona el pago." },
    ],
  },
};

export default async function DepositaryPage({ params }: PageProps<"/[locale]/participants/depositaire">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.depositary} intro={T[locale].intro}>
      <div className="grid gap-4 md:grid-cols-3">
        {T[locale].items.map((x) => (
          <div key={x.t} className="card-lift rounded-[var(--radius-panel)] border border-line bg-surface p-8">
            <h2 className="font-serif-display text-2xl text-heading">{x.t}</h2>
            <p className="mt-2 text-sm text-muted">{x.d}</p>
          </div>
        ))}
      </div>
    </ContentPage>
  );
}
