import type { Metadata } from "next";
import { FileDown } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { crumbs, pageTitle } from "@/lib/page-helpers";
import { formatDate } from "@/lib/format";
import { getBocArchive, getEquities, getMarketSummary } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { BocArchive } from "@/components/market/BocArchive";
import { BocOnline } from "@/components/market/BocOnline";
import { Reveal } from "@/components/motion/Reveal";

const T = {
  fr: { intro: "Après chaque séance, la BVMAC publie le Bulletin Officiel de la Cote : cours, volumes et capitalisation. Il fait foi.", latest: "Dernier bulletin", archive: "Archives", download: "Télécharger le PDF officiel" },
  en: { intro: "After every session, BVMAC publishes the Official Price Bulletin: prices, volumes and capitalisation. It is the authoritative record.", latest: "Latest bulletin", archive: "Archive", download: "Download the official PDF" },
  es: { intro: "Tras cada sesión, la BVMAC publica el Boletín Oficial de Cotización: cotizaciones, volúmenes y capitalización. Es el documento de referencia.", latest: "Último boletín", archive: "Archivo", download: "Descargar el PDF oficial" },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/marches/boc">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.boc);
}

export default async function BocPage({ params }: PageProps<"/[locale]/marches/boc">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const [archive, equities, summary] = await Promise.all([getBocArchive(), getEquities(), getMarketSummary()]);
  const latest = archive[0];
  return (
    <>
      <PageHeader group="markets" title={dict.nav.items.boc} intro={t.intro} breadcrumbLabel={dict.a11y.breadcrumb} breadcrumb={crumbs(locale, dict, "markets", dict.nav.items.boc)} />
      <div className="container-site grid gap-16 py-14 md:py-20">
        <Reveal className="relative overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand md:p-12">
          <div aria-hidden="true" className="animate-orb absolute -right-20 -top-20 size-80 rounded-full bg-brand-gold/20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex h-40 w-32 flex-col justify-between rounded-xl bg-brand-ivory p-4 text-espresso shadow-2xl [transform:rotate(-4deg)]">
              <span className="font-serif-display text-lg leading-tight">Bulletin Officiel de la Cote</span>
              <span className="code text-[10px]">{latest.number}</span>
            </div>
            <div>
              <p className="eyebrow text-brand-gold-light!">{t.latest}</p>
              <h2 className="text-h2 mt-3 text-brand-ivory! capitalize">{dict.session.sessionOf} {formatDate(latest.date, locale)}</h2>
              <p className="code mt-2 text-brand-sand/70">N° {latest.number}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={latest.url} variant="gold" external><FileDown aria-hidden="true" className="size-4" />{t.download}</ButtonLink>
                <BocOnline rows={equities} date={latest.date} number={latest.number} valueTraded={summary.valueTraded} />
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal as="section">
          <h2 className="text-h2 mb-6">{t.archive}</h2>
          <BocArchive entries={archive} />
        </Reveal>
      </div>
    </>
  );
}
