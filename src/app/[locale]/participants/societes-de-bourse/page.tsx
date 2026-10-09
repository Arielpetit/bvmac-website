import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getBrokers } from "@/lib/api";
import { BROKER_TOTALS } from "@/data/content";
import { ContentPage } from "@/components/content/ContentPage";
import { BrokerDirectory } from "@/components/institution/BrokerDirectory";

const INTRO = {
  fr: "Les sociétés de bourse sont les intermédiaires agréés par la COSUMAF : négociation, placement, transmission d’ordres, tenue de compte, gestion sous mandat, conseil en patrimoine et démarchage financier. Pour investir, adressez-vous à l’une d’entre elles.",
  en: "Brokers (sociétés de bourse) are the intermediaries licensed by COSUMAF: trading, placement, order transmission, account keeping, discretionary management, wealth advice and financial canvassing. To invest, contact one of them.",
  es: "Las sociedades de bolsa son los intermediarios autorizados por la COSUMAF: negociación, colocación, transmisión de órdenes, llevanza de cuentas, gestión discrecional, asesoramiento patrimonial y captación financiera. Para invertir, diríjase a una de ellas.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/participants/societes-de-bourse">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.brokers);
}

export default async function BrokersPage({ params }: PageProps<"/[locale]/participants/societes-de-bourse">) {
  const { locale, dict } = await resolveLocale(params);
  const brokers = await getBrokers();
  return (
    <ContentPage
      locale={locale}
      dict={dict}
      group="invest"
      isGroupRoot
      title={dict.nav.items.brokers}
      frenchBody={false}
      intro={INTRO[locale]}
    >
      <BrokerDirectory brokers={brokers} totals={BROKER_TOTALS} />
    </ContentPage>
  );
}
