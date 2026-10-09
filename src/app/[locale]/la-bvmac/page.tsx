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

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.presentation);
}

const icons = [LineChart, Megaphone, Landmark];

export default async function PresentationPage({ params }: PageProps<"/[locale]/la-bvmac">) {
  const { locale, dict } = await resolveLocale(params);
  const p = (path: string) => localePath(locale, path);
  const figures = [
    ["Capital social", formatFcfa(SHAREHOLDING.capital, locale)],
    ["Pays membres", String(KEY_FIGURES.countries)],
    ["Sociétés de bourse", String(KEY_FIGURES.brokers)],
    ["Lignes cotées", String(KEY_FIGURES.listedEquities + KEY_FIGURES.listedBonds)],
  ];
  return (
    <ContentPage
      locale={locale}
      dict={dict}
      group="about"
      isGroupRoot
      title="La Bourse des Valeurs Mobilières de l’Afrique Centrale"
      overline={dict.nav.items.presentation}
      intro="Entreprise de marché du marché financier régional, la BVMAC organise, anime et gère la bourse commune aux six pays de la CEMAC."
      image="/photos/bvmac-building.webp"
    >
      <div className="grid gap-24">
        <section aria-labelledby="who" className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">Qui sommes-nous</p>
            <h2 id="who" className="text-h2 mt-3">Être la première source de financement des économies de la CEMAC.</h2>
            <div className="prose-bvmac mt-6 text-muted">
              <p>La BVMAC est une organisation internationale à caractère régional, créée par le {LEGAL_BASIS}.</p>
              <p>Société anonyme avec Conseil d’Administration, elle remplit à titre exclusif la mission de service public d’organisation, d’animation et de gestion du marché financier de l’Afrique centrale, sous agrément de la COSUMAF.</p>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
              {figures.map(([label, value]) => (
                <div key={label} className="bg-surface p-5">
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted">{label}</dt>
                  <dd className="figure mt-2 text-xl text-heading">{value}</dd>
                </div>
              ))}
            </dl>
            <Link href={p("/la-bvmac/actionnariat")} className="link mt-5 inline-flex items-center gap-1 text-sm">Voir l’actionnariat<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          </Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)]">
            <ParallaxImage src="/photos/ceremony-trading-floor.webp" alt="Salle de cotation de la BVMAC lors d’une cérémonie" className="absolute inset-0" />
          </div>
        </section>

        <section aria-labelledby="missions">
          <p className="eyebrow">Nos missions</p>
          <h2 id="missions" className="text-h2 mt-3 max-w-2xl">Trois missions au service du marché régional</h2>
          <Stagger as="ul" className="mt-10 grid gap-4 md:grid-cols-3">
            {MISSIONS.map((m, i) => {
              const Icon = icons[i];
              return (
                <StaggerItem as="li" key={m.title} className={i === 1 ? "card-lift rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand" : "card-lift rounded-[var(--radius-panel)] border border-line bg-surface p-8"}>
                  <span className={i === 1 ? "flex size-12 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold-light" : "flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-text"}>
                    <Icon aria-hidden="true" className="size-6" strokeWidth={1.4} />
                  </span>
                  <h3 className={i === 1 ? "font-serif-display mt-10 text-2xl text-brand-ivory" : "font-serif-display mt-10 text-2xl text-heading"}>{m.title}</h3>
                  <p className={i === 1 ? "mt-3 text-sm text-brand-sand/70" : "mt-3 text-sm text-muted"}>{m.text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        <section aria-labelledby="functions" className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="h-fit lg:sticky lg:top-40">
            <p className="eyebrow">Fonctions et prérogatives</p>
            <h2 id="functions" className="text-h2 mt-3">Ce que fait la Bourse régionale</h2>
            <p className="mt-4 text-muted">Dans l’exercice de ses fonctions, la BVMAC est notamment chargée des {FUNCTIONS.length} missions ci-contre.</p>
            <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface-alt p-6">
              <h3 className="text-h3">Missions régaliennes</h3>
              <ul className="mt-4 grid gap-2.5">
                {REGALIAN.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-gold text-espresso"><Check aria-hidden="true" className="size-3" strokeWidth={2.5} /></span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Stagger as="ol" stagger={0.05} className="divide-y divide-line border-y border-line">
            {FUNCTIONS.map((f, i) => (
              <StaggerItem as="li" key={f} className="group flex gap-6 py-5">
                <span className="figure w-8 shrink-0 pt-0.5 text-sm text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[1.0625rem] text-heading transition-transform duration-500 group-hover:translate-x-1">{f}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <Reveal className="relative overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-10 text-brand-ivory md:p-14">
          <Image src="/photos/governance-group.webp" alt="" fill sizes="100vw" className="object-cover opacity-25" />
          <div className="relative max-w-2xl">
            <h2 className="font-serif-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight text-brand-ivory">Gouvernance, histoire et organisation</h2>
            <p className="mt-4 text-brand-sand/75">Découvrez qui dirige la BVMAC, comment elle s’est construite et comment elle est organisée.</p>
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
