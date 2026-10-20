import type { Metadata } from "next";
import Image from "next/image";
import { Download, Mail, Phone } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { formatDate, formatFcfa, formatNumber } from "@/lib/format";
import { getContact } from "@/lib/api";
import { KEY_FIGURES } from "@/data/content";
import { MARKET_SUMMARY } from "@/data/market";
import { getNotices } from "@/lib/api";
import { ContentPage } from "@/components/content/ContentPage";
import { NoticeRow } from "@/components/content/NoticeRow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/actualites/espace-presse">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.pressRoom);
}

const LOGO_FILES = [
  { file: "/brand/bvmac-logo-light.png", bg: "bg-white" },
  { file: "/brand/bvmac-logo-dark.png", bg: "bg-espresso" },
  { file: "/brand/bvmac-medal.png", bg: "bg-white" },
  { file: "/brand/bvmac-app-icon.png", bg: "bg-surface-alt" },
];

const T = {
  fr: {
    intro: "Contacts, logos, chiffres clés et communiqués pour les journalistes.",
    logos: ["Logo – fonds clairs", "Logo – fonds sombres", "Médaille seule", "Icône d’application"],
    facts: ["Capital social", "Capitalisation actions", "Encours obligataire", "Actions cotées", "Lignes obligataires", "Sociétés de bourse agréées", "Pays membres", "Siège"],
    countries: "Cameroun, Centrafrique, Congo, Gabon, Guinée équatoriale, Tchad",
    hq: "Immeuble de la Bourse, Douala",
    pressEyebrow: "Contact presse",
    pressTitle: "Service Communication de la BVMAC",
    pressText: "Demandes d’interview, accréditations et informations sur le marché.",
    kit: "Kit logo",
    kitText: "Utilisez uniquement les fichiers fournis ; ne redessinez pas et ne recolorez pas le logo.",
    factsheet: "Fiche d’information",
    about: "À propos de la BVMAC",
    aboutText: "La Bourse des Valeurs Mobilières de l’Afrique Centrale (BVMAC) est l’entreprise de marché du marché financier régional de la CEMAC. Elle organise, anime et gère la bourse commune au Cameroun, à la Centrafrique, au Congo, au Gabon, à la Guinée équatoriale et au Tchad. Son siège est à Douala.",
    releases: "Derniers communiqués",
  },
  en: {
    intro: "Contacts, logos, key figures and press releases for journalists.",
    logos: ["Logo – light backgrounds", "Logo – dark backgrounds", "Medal only", "App icon"],
    facts: ["Share capital", "Equity capitalisation", "Bonds outstanding", "Listed shares", "Bond lines", "Licensed brokers", "Member countries", "Headquarters"],
    countries: "Cameroon, Central African Republic, Congo, Gabon, Equatorial Guinea, Chad",
    hq: "Immeuble de la Bourse, Douala",
    pressEyebrow: "Press contact",
    pressTitle: "BVMAC Communications Unit",
    pressText: "Interview requests, accreditation and market information.",
    kit: "Logo kit",
    kitText: "Use only the files provided; do not redraw or recolour the logo.",
    factsheet: "Fact sheet",
    about: "About the BVMAC",
    aboutText: "The Central African Stock Exchange (BVMAC) is the market operator of the CEMAC regional financial market. It organises, runs and manages the exchange shared by Cameroon, the Central African Republic, Congo, Gabon, Equatorial Guinea and Chad. Its headquarters are in Douala.",
    releases: "Latest press releases",
  },
  es: {
    intro: "Contactos, logotipos, cifras clave y comunicados para los periodistas.",
    logos: ["Logotipo – fondos claros", "Logotipo – fondos oscuros", "Medalla sola", "Icono de la aplicación"],
    facts: ["Capital social", "Capitalización de acciones", "Saldo vivo de obligaciones", "Acciones cotizadas", "Líneas de obligaciones", "Sociedades de bolsa autorizadas", "Países miembros", "Sede"],
    countries: "Camerún, República Centroafricana, Congo, Gabón, Guinea Ecuatorial, Chad",
    hq: "Immeuble de la Bourse, Duala",
    pressEyebrow: "Contacto de prensa",
    pressTitle: "Servicio de Comunicación de la BVMAC",
    pressText: "Solicitudes de entrevista, acreditaciones e información sobre el mercado.",
    kit: "Kit de logotipos",
    kitText: "Utilice solo los archivos proporcionados; no redibuje ni cambie los colores del logotipo.",
    factsheet: "Ficha informativa",
    about: "Acerca de la BVMAC",
    aboutText: "La Bolsa de Valores de África Central (BVMAC) es la empresa de mercado del mercado financiero regional de la CEMAC. Organiza, anima y gestiona la bolsa común de Camerún, la República Centroafricana, el Congo, Gabón, Guinea Ecuatorial y Chad. Su sede está en Duala.",
    releases: "Últimos comunicados",
  },
};

export default async function PressPage({ params }: PageProps<"/[locale]/actualites/espace-presse">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const CONTACT = await getContact();
  const releases = (await getNotices()).filter((n) => n.type === "communique").slice(0, 4);
  const facts = [
    [t.facts[0], formatFcfa(KEY_FIGURES.capital, locale)],
    [`${t.facts[1]} (${formatDate(MARKET_SUMMARY.date, locale, "short")})`, formatFcfa(MARKET_SUMMARY.equityCapitalisation, locale)],
    [t.facts[2], formatFcfa(MARKET_SUMMARY.bondOutstanding, locale)],
    [t.facts[3], formatNumber(KEY_FIGURES.listedEquities, locale)],
    [t.facts[4], formatNumber(KEY_FIGURES.listedBonds, locale)],
    [t.facts[5], formatNumber(KEY_FIGURES.brokers, locale)],
    [t.facts[6], t.countries],
    [t.facts[7], t.hq],
  ];
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.pressRoom} intro={t.intro}>
      <div className="grid gap-16">
        <Reveal className="grid gap-6 rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand md:grid-cols-[1.4fr_1fr] md:items-center md:p-10">
          <div>
            <p className="eyebrow text-brand-gold-light!">{t.pressEyebrow}</p>
            <h2 className="text-h2 mt-3 text-brand-ivory!">{t.pressTitle}</h2>
            <p className="mt-3 text-brand-sand/75">{t.pressText}</p>
          </div>
          <div className="grid gap-3">
            <a href={`mailto:${CONTACT.email}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-gold px-6 font-medium text-espresso hover:bg-brand-gold-light"><Mail aria-hidden="true" className="size-4" />{CONTACT.email}</a>
            <a href={CONTACT.phoneHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-brand-ivory hover:border-white/50"><Phone aria-hidden="true" className="size-4" />{CONTACT.phone}</a>
          </div>
        </Reveal>

        <section aria-labelledby="logos">
          <h2 id="logos" className="text-h2">{t.kit}</h2>
          <p className="mt-2 text-muted">{t.kitText}</p>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOGO_FILES.map((l, i) => ({ ...l, label: t.logos[i] })).map((l) => (
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
            <h2 className="text-h2">{t.factsheet}</h2>
            <dl className="mt-6 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface px-5">
              {facts.map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3.5 text-sm"><dt className="text-muted">{k}</dt><dd className="figure ml-auto text-right text-heading">{v}</dd></div>
              ))}
            </dl>
          </Reveal>
          <Reveal as="section" delay={0.1}>
            <h2 className="text-h2">{t.about}</h2>
            <p className="mt-6 text-lg leading-relaxed">{t.aboutText}</p>
            <h3 className="text-h3 mt-10">{t.releases}</h3>
            <div className="mt-2 divide-y divide-line border-y border-line">{releases.map((n) => <NoticeRow key={n.id} notice={n} locale={locale} compact />)}</div>
          </Reveal>
        </div>
      </div>
    </ContentPage>
  );
}
