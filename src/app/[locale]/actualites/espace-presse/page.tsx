import type { Metadata } from "next";
import Image from "next/image";
import { Download, FileText, Mail, Phone } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { formatFcfa, formatNumber } from "@/lib/format";
import { CONTACT } from "@/lib/navigation";
import { KEY_FIGURES } from "@/data/content";
import { MARKET_SUMMARY } from "@/data/market";
import { getNotices } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { NoticeRow } from "@/components/content/NoticeRow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/actualites/espace-presse">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.pressRoom);
}

const LOGOS = [
  { file: "/brand/bvmac-logo-light.png", label: "Logo – fonds clairs", bg: "bg-white" },
  { file: "/brand/bvmac-logo-dark.png", label: "Logo – fonds sombres", bg: "bg-espresso" },
  { file: "/brand/bvmac-medal.png", label: "Médaille seule", bg: "bg-white" },
  { file: "/brand/bvmac-app-icon.png", label: "Icône d’application", bg: "bg-surface-alt" },
];

export default async function PressPage({ params }: PageProps<"/[locale]/actualites/espace-presse">) {
  const { locale, dict } = await resolveLocale(params);
  const releases = (await getNotices()).filter((n) => n.type === "communique").slice(0, 4);
  const facts = [
    ["Capital social", formatFcfa(KEY_FIGURES.capital, locale)],
    ["Capitalisation actions (8 oct. 2026)", formatFcfa(MARKET_SUMMARY.equityCapitalisation, locale)],
    ["Encours obligataire", formatFcfa(MARKET_SUMMARY.bondOutstanding, locale)],
    ["Actions cotées", formatNumber(KEY_FIGURES.listedEquities, locale)],
    ["Lignes obligataires", formatNumber(KEY_FIGURES.listedBonds, locale)],
    ["Sociétés de bourse agréées", formatNumber(KEY_FIGURES.brokers, locale)],
    ["Pays membres", "Cameroun, Centrafrique, Congo, Gabon, Guinée équatoriale, Tchad"],
    ["Siège", "Immeuble de la Bourse, Douala"],
  ];
  return (
    <ContentPage locale={locale} dict={dict} group="news" title={dict.nav.items.pressRoom} intro="Contacts, logos, chiffres clés et communiqués pour les journalistes." image="/photos/ceremony-podium.webp">
      <div className="grid gap-16">
        <Reveal className="grid gap-6 rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand md:grid-cols-[1.4fr_1fr] md:items-center md:p-10">
          <div>
            <p className="eyebrow text-brand-gold-light!">Contact presse</p>
            <h2 className="text-h2 mt-3 text-brand-ivory!">Service Communication de la BVMAC</h2>
            <p className="mt-3 text-brand-sand/75">Demandes d’interview, accréditations et informations sur le marché. Coordonnées nominatives à confirmer par la BVMAC.</p>
          </div>
          <div className="grid gap-3">
            <a href={`mailto:${CONTACT.email}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gold px-6 font-medium text-espresso hover:bg-brand-gold-light"><Mail aria-hidden="true" className="size-4" />{CONTACT.email}</a>
            <a href={CONTACT.phoneHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-brand-ivory hover:border-white/50"><Phone aria-hidden="true" className="size-4" />{CONTACT.phone}</a>
          </div>
        </Reveal>

        <section aria-labelledby="logos">
          <h2 id="logos" className="text-h2">Kit logo</h2>
          <p className="mt-2 text-muted">Utilisez uniquement les fichiers fournis ; ne redessinez pas et ne recolorez pas le logo.</p>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOGOS.map((l) => (
              <StaggerItem key={l.file} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
                <div className={`flex h-40 items-center justify-center p-6 ${l.bg}`}>
                  <Image src={l.file} alt={l.label} width={320} height={120} className="h-full w-auto object-contain" />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <span className="text-sm">{l.label}</span>
                  <a href={l.file} download className="inline-flex items-center gap-1 text-sm text-link hover:underline"><Download aria-hidden="true" className="size-4" />PNG</a>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal as="section">
            <div className="flex items-center justify-between">
              <h2 className="text-h2">Fiche d’information</h2>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted"><FileText aria-hidden="true" className="size-4" />PDF à venir</span>
            </div>
            <dl className="mt-6 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface px-5">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3.5 text-sm"><dt className="text-muted">{k}</dt><dd className="figure text-right text-heading">{v}</dd></div>
              ))}
            </dl>
          </Reveal>
          <Reveal as="section" delay={0.1}>
            <h2 className="text-h2">À propos de la BVMAC</h2>
            <p className="mt-6 text-lg leading-relaxed">La Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC) est l’entreprise de marché du marché financier régional de la CEMAC. Elle organise, anime et gère la bourse commune au Cameroun, à la Centrafrique, au Congo, au Gabon, à la Guinée équatoriale et au Tchad. Son siège est à Douala.</p>
            <h3 className="text-h3 mt-10">Derniers communiqués</h3>
            <div className="mt-2 divide-y divide-line border-y border-line">{releases.map((n) => <NoticeRow key={n.id} notice={n} locale={locale} compact />)}</div>
          </Reveal>
        </div>
      </div>
    </ContentPage>
  );
}
