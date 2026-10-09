import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookA, LineChart, ShieldCheck } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { GLOSSARY, LESSONS, PATHS } from "@/data/school";
import { ContentPage } from "@/components/content/ContentPage";
import { SchoolHub } from "@/components/school/SchoolHub";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/ecole-de-bourse">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.school);
}

export default async function SchoolPage({ params }: PageProps<"/[locale]/ecole-de-bourse">) {
  const { locale, dict } = await resolveLocale(params);
  const p = (s: string) => localePath(locale, s);
  return (
    <ContentPage locale={locale} dict={dict} group="learn" isGroupRoot title="Apprenez la bourse, pas à pas" overline={dict.nav.school} intro="Un espace gratuit pour comprendre le marché financier régional : leçons de 3 à 5 minutes, quiz expliqués, glossaire et portefeuille virtuel." image="/photos/school-students-3.webp">
      <SchoolHub paths={PATHS} lessons={LESSONS} />
      <Stagger className="mt-20 grid gap-4 md:grid-cols-2">
        <StaggerItem>
          <Link href={p("/ecole-de-bourse/glossaire")} className="card-lift group relative flex h-full min-h-64 flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface p-8">
            <BookA aria-hidden="true" className="size-8 text-accent-text" strokeWidth={1.3} />
            <span aria-hidden="true" className="font-serif-display absolute -right-4 -top-8 text-[10rem] leading-none text-surface-alt">Aa</span>
            <span className="relative">
              <span className="font-serif-display block text-3xl text-heading">Glossaire</span>
              <span className="mt-1 block text-sm text-muted">{GLOSSARY.length} mots de la bourse, en français, anglais et espagnol.</span>
            </span>
          </Link>
        </StaggerItem>
        <StaggerItem>
          <Link href={p("/ecole-de-bourse/portefeuille-virtuel")} className="card-lift group relative flex h-full min-h-64 flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-ivory">
            <Image src="/photos/ceremony-trading-floor-2.webp" alt="" fill sizes="50vw" className="object-cover opacity-25 transition-transform duration-[1.2s] group-hover:scale-105" />
            <LineChart aria-hidden="true" className="relative size-8 text-brand-gold" strokeWidth={1.3} />
            <span className="relative flex items-end justify-between gap-4">
              <span>
                <span className="font-serif-display block text-3xl">Portefeuille virtuel</span>
                <span className="mt-1 block text-sm text-brand-sand/70">Entraînez-vous avec 5 000 000 FCFA fictifs sur les vrais cours.</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-6 shrink-0 text-brand-gold transition-transform group-hover:rotate-45" />
            </span>
          </Link>
        </StaggerItem>
      </Stagger>
      <p className="mt-10 flex items-start gap-3 text-sm text-muted">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
        <span>Contenu pédagogique, sans conseil en investissement. Votre progression reste sur votre appareil ; aucune donnée n’est envoyée. Les mineurs sont invités à l’utiliser avec un adulte. <Link href={p("/politique-de-confidentialite")} className="link">Confidentialité</Link></span>
      </p>
    </ContentPage>
  );
}
