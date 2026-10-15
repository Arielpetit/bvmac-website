import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getAgenda } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { AgendaList } from "@/components/market/AgendaList";
import { Reveal } from "@/components/motion/Reveal";

const T = {
  fr: "Dividendes, coupons, remboursements, assemblées générales, souscriptions et introductions, tels qu’annoncés dans les avis de la BVMAC.",
  en: "Dividends, coupons, redemptions, general meetings, subscriptions and listings, as announced in BVMAC notices.",
  es: "Dividendos, cupones, amortizaciones, juntas generales, suscripciones y salidas a bolsa, anunciados en los avisos de la BVMAC.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/marches/agenda">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.agenda);
}

export default async function AgendaPage({ params }: PageProps<"/[locale]/marches/agenda">) {
  const { locale, dict } = await resolveLocale(params);
  const events = await getAgenda();
  return (
    <>
      <PageHeader title={dict.nav.items.agenda} intro={T[locale]} />
      <Reveal className="container-site pt-10 pb-14 md:pt-12 md:pb-20">
        <AgendaList events={events} today="2026-10-09" />
      </Reveal>
    </>
  );
}
