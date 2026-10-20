import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Landmark, LineChart, Megaphone } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { formatFcfa } from "@/lib/format";
import { FUNCTIONS, LEGAL_BASIS, MISSIONS, REGALIAN, SHAREHOLDING } from "@/data/institution";
import { KEY_FIGURES } from "@/data/content";
import { ContentPage } from "@/components/content/ContentPage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/Parallax";
import { tc } from "@/i18n/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.presentation);
}

const icons = [LineChart, Megaphone, Landmark];

const T = {
  fr: {
    title: "La Bourse des Valeurs Mobilières de l’Afrique Centrale",
    intro: "Entreprise de marché du marché financier régional, la BVMAC organise, anime et gère la bourse commune aux six pays de la CEMAC.",
    figures: ["Capital social", "Pays membres", "Sociétés de bourse", "Lignes cotées"],
    whoEyebrow: "Qui sommes-nous",
    whoTitle: "Être la première source de financement des économies de la CEMAC.",
    who1: (basis: string) => `La BVMAC est une organisation internationale à caractère régional, créée par le ${basis}.`,
    who2: "Société anonyme avec Conseil d’Administration, elle remplit à titre exclusif la mission de service public d’organisation, d’animation et de gestion du marché financier de l’Afrique centrale, sous agrément de la COSUMAF.",
    shareholding: "Voir l’actionnariat",
    photoAlt: "Salle de cotation de la BVMAC lors d’une cérémonie",
    missionsEyebrow: "Nos missions",
    missionsTitle: "Trois missions au service du marché régional",
    functionsEyebrow: "Fonctions et prérogatives",
    functionsTitle: "Ce que fait la Bourse régionale",
    functionsText: (n: number) => `Dans l’exercice de ses fonctions, la BVMAC est notamment chargée des ${n} missions ci-contre.`,
    regalian: "Missions régaliennes",
    moreTitle: "Gouvernance, histoire et organisation",
    moreText: "Découvrez qui dirige la BVMAC, comment elle s’est construite et comment elle est organisée.",
  },
  en: {
    title: "The Central African Stock Exchange",
    intro: "As the market operator of the regional financial market, the BVMAC organises, runs and manages the stock exchange shared by the six CEMAC countries.",
    figures: ["Share capital", "Member countries", "Brokers", "Listed securities"],
    whoEyebrow: "Who we are",
    whoTitle: "To be the leading source of financing for the CEMAC economies.",
    who1: (basis: string) => `The BVMAC is a regional international organisation, created by ${basis}.`,
    who2: "A public limited company with a Board of Directors, it holds the exclusive public-service mission of organising, running and managing the Central African financial market, under COSUMAF licence.",
    shareholding: "See the shareholding",
    photoAlt: "BVMAC trading floor during a ceremony",
    missionsEyebrow: "Our missions",
    missionsTitle: "Three missions serving the regional market",
    functionsEyebrow: "Functions and powers",
    functionsTitle: "What the regional exchange does",
    functionsText: (n: number) => `In carrying out its functions, the BVMAC is responsible in particular for the ${n} tasks listed here.`,
    regalian: "Core public duties",
    moreTitle: "Governance, history and organisation",
    moreText: "Find out who runs the BVMAC, how it was built and how it is organised.",
  },
  es: {
    title: "La Bolsa de Valores de África Central",
    intro: "Empresa de mercado del mercado financiero regional, la BVMAC organiza, anima y gestiona la bolsa común de los seis países de la CEMAC.",
    figures: ["Capital social", "Países miembros", "Sociedades de bolsa", "Valores cotizados"],
    whoEyebrow: "Quiénes somos",
    whoTitle: "Ser la principal fuente de financiación de las economías de la CEMAC.",
    who1: (basis: string) => `La BVMAC es una organización internacional de carácter regional, creada por el ${basis}.`,
    who2: "Sociedad anónima con Consejo de Administración, tiene en exclusiva la misión de servicio público de organizar, animar y gestionar el mercado financiero de África Central, con autorización de la COSUMAF.",
    shareholding: "Ver el accionariado",
    photoAlt: "Sala de cotización de la BVMAC durante una ceremonia",
    missionsEyebrow: "Nuestras misiones",
    missionsTitle: "Tres misiones al servicio del mercado regional",
    functionsEyebrow: "Funciones y prerrogativas",
    functionsTitle: "Lo que hace la Bolsa regional",
    functionsText: (n: number) => `En el ejercicio de sus funciones, la BVMAC se encarga en particular de las ${n} tareas que figuran aquí.`,
    regalian: "Misiones de servicio público",
    moreTitle: "Gobernanza, historia y organización",
    moreText: "Descubra quién dirige la BVMAC, cómo se construyó y cómo está organizada.",
  },
};


export default async function PresentationPage({ params }: PageProps<"/[locale]/la-bvmac">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const p = (path: string) => localePath(locale, path);
  const figures = [
    [t.figures[0], formatFcfa(SHAREHOLDING.capital, locale)],
    [t.figures[1], String(KEY_FIGURES.countries)],
    [t.figures[2], String(KEY_FIGURES.brokers)],
    [t.figures[3], String(KEY_FIGURES.listedEquities + KEY_FIGURES.listedBonds)],
  ];
  return (
    <ContentPage
      locale={locale}
      dict={dict}
      title={t.title}
      overline={dict.nav.items.presentation}
      intro={t.intro}
    >
      <div className="grid gap-24">
        <section aria-labelledby="who" className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">{t.whoEyebrow}</p>
            <h2 id="who" className="text-h2 mt-3">{t.whoTitle}</h2>
            <div className="prose-bvmac mt-6 text-muted">
              <p>{t.who1(tc(LEGAL_BASIS, locale))}</p>
              <p>{t.who2}</p>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
              {figures.map(([label, value], i) => (
                <div key={label} className={i === 0 ? "col-span-3 bg-surface p-5" : "bg-surface p-4 sm:p-5"}>
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted [overflow-wrap:normal]">{label}</dt>
                  <dd className="figure mt-2 text-xl text-heading">{value}</dd>
                </div>
              ))}
            </dl>
            <Link href={p("/la-bvmac/actionnariat")} className="link mt-5 inline-flex items-center gap-1 text-sm">{t.shareholding}<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          </Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)]">
            <ParallaxImage src="/photos/ceremony-trading-floor.webp" alt={t.photoAlt} className="absolute inset-0" />
          </div>
        </section>

        <section aria-labelledby="missions">
          <p className="eyebrow">{t.missionsEyebrow}</p>
          <h2 id="missions" className="text-h2 mt-3 max-w-2xl">{t.missionsTitle}</h2>
          <Stagger as="ul" className="mt-10 grid gap-4 md:grid-cols-3">
            {MISSIONS.map((m, i) => {
              const Icon = icons[i];
              return (
                <StaggerItem as="li" key={m.title} className={i === 1 ? "card-lift rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand" : "card-lift rounded-[var(--radius-panel)] border border-line bg-surface p-8"}>
                  <span className={i === 1 ? "flex size-12 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold-light" : "flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-text"}>
                    <Icon aria-hidden="true" className="size-6" strokeWidth={1.4} />
                  </span>
                  <h3 className={i === 1 ? "font-serif-display mt-10 text-2xl text-brand-ivory" : "font-serif-display mt-10 text-2xl text-heading"}>{tc(m.title, locale)}</h3>
                  <p className={i === 1 ? "mt-3 text-sm text-brand-sand/70" : "mt-3 text-sm text-muted"}>{tc(m.text, locale)}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        <section aria-labelledby="functions" className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="h-fit lg:sticky lg:top-40">
            <p className="eyebrow">{t.functionsEyebrow}</p>
            <h2 id="functions" className="text-h2 mt-3">{t.functionsTitle}</h2>
            <p className="mt-4 text-muted">{t.functionsText(FUNCTIONS.length)}</p>
            <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface-alt p-6">
              <h3 className="text-h3">{t.regalian}</h3>
              <ul className="mt-4 grid gap-2.5">
                {REGALIAN.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-gold text-espresso"><Check aria-hidden="true" className="size-3" strokeWidth={2.5} /></span>
                    {tc(r, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Stagger as="ol" stagger={0.05} className="divide-y divide-line border-y border-line">
            {FUNCTIONS.map((f, i) => (
              <StaggerItem as="li" key={f} className="group flex gap-6 py-5">
                <span className="figure w-8 shrink-0 pt-0.5 text-sm text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[1.0625rem] text-heading transition-transform duration-500 group-hover:translate-x-1">{tc(f, locale)}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <Reveal className="relative overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-10 text-brand-ivory md:p-14">
          <Image src="/photos/governance-group.webp" alt="" fill sizes="100vw" className="object-cover opacity-25" />
          <div className="relative max-w-2xl">
            <h2 className="font-serif-display text-[clamp(1.6rem,3.4vw,2.8rem)] leading-tight text-brand-ivory">{t.moreTitle}</h2>
            <p className="mt-4 text-brand-sand/75">{t.moreText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[["/la-bvmac/gouvernance", dict.nav.items.governance], ["/la-bvmac/histoire", dict.nav.items.history], ["/la-bvmac/organigramme", dict.nav.items.orgchart]].map(([href, label]) => (
                <Link key={href} href={p(href)} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm hover:border-brand-gold hover:text-brand-gold-light">{label}<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </ContentPage>
  );
}
