import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookA, LineChart } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { GLOSSARY, schoolContent } from "@/data/school";
import { ContentPage } from "@/components/content/ContentPage";
import { SchoolHub } from "@/components/school/SchoolHub";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/ecole-de-bourse">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.school);
}

const T = {
  fr: { title: "Apprenez la bourse, pas à pas", intro: "Un espace gratuit pour comprendre le marché financier régional : leçons de 3 à 5 minutes, quiz expliqués, glossaire et portefeuille virtuel.", glossary: "Glossaire", glossaryText: (n: number) => `${n} mots de la bourse, en français, anglais et espagnol.`, portfolio: "Portefeuille virtuel", portfolioText: "Entraînez-vous avec 5 000 000 FCFA fictifs sur les vrais cours.", note: "Contenu pédagogique, sans conseil en investissement. Votre progression reste sur votre appareil ; aucune donnée n’est envoyée. Les mineurs sont invités à l’utiliser avec un adulte.", privacy: "Confidentialité" },
  en: { title: "Learn the stock market, step by step", intro: "A free space to understand the regional financial market: 3- to 5-minute lessons, explained quizzes, a glossary and a virtual portfolio.", glossary: "Glossary", glossaryText: (n: number) => `${n} stock market terms, in French, English and Spanish.`, portfolio: "Virtual portfolio", portfolioText: "Practise with 5,000,000 virtual FCFA on real prices.", note: "Educational content, not investment advice. Your progress stays on your device; no data is sent. Minors are encouraged to use it with an adult.", privacy: "Privacy" },
  es: { title: "Aprenda la bolsa, paso a paso", intro: "Un espacio gratuito para comprender el mercado financiero regional: lecciones de 3 a 5 minutos, cuestionarios explicados, glosario y cartera virtual.", glossary: "Glosario", glossaryText: (n: number) => `${n} términos de bolsa, en francés, inglés y español.`, portfolio: "Cartera virtual", portfolioText: "Practique con 5 000 000 de FCFA ficticios sobre cotizaciones reales.", note: "Contenido pedagógico, sin asesoramiento de inversión. Su progreso se queda en su dispositivo; no se envía ningún dato. Se recomienda a los menores usarlo con un adulto.", privacy: "Privacidad" },
};

export default async function SchoolPage({ params }: PageProps<"/[locale]/ecole-de-bourse">) {
  const { locale, dict } = await resolveLocale(params);
  const p = (s: string) => localePath(locale, s);
  const t = T[locale];
  const { paths, lessons } = schoolContent(locale);
  return (
    <ContentPage locale={locale} dict={dict} title={t.title} overline={dict.nav.school} intro={t.intro}>
      <SchoolHub paths={paths} lessons={lessons} />
      <Stagger className="mt-20 grid gap-4 md:grid-cols-2">
        <StaggerItem>
          <Link href={p("/ecole-de-bourse/glossaire")} className="card-lift group relative flex h-full min-h-64 flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface p-8">
            <BookA aria-hidden="true" className="size-8 text-accent-text" strokeWidth={1.3} />
            <span aria-hidden="true" className="font-serif-display absolute -right-4 -top-8 text-[10rem] leading-none text-surface-alt">Aa</span>
            <span className="relative">
              <span className="font-serif-display block text-3xl text-heading">{t.glossary}</span>
              <span className="mt-1 block text-sm text-muted">{t.glossaryText(GLOSSARY.length)}</span>
            </span>
          </Link>
        </StaggerItem>
        <StaggerItem>
          <Link href={p("/ecole-de-bourse/portefeuille-virtuel")} className="card-lift group relative flex h-full min-h-64 flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-ivory">
            <Image src="/photos/ceremony-trading-floor-2.webp" alt="" fill sizes="50vw" className="object-cover opacity-25 transition-transform duration-[1.2s] group-hover:scale-105" />
            <LineChart aria-hidden="true" className="relative size-8 text-brand-gold" strokeWidth={1.3} />
            <span className="relative flex items-end justify-between gap-4">
              <span>
                <span className="font-serif-display block text-3xl">{t.portfolio}</span>
                <span className="mt-1 block text-sm text-brand-sand/70">{t.portfolioText}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-6 shrink-0 text-brand-gold transition-transform group-hover:rotate-45" />
            </span>
          </Link>
        </StaggerItem>
      </Stagger>
    </ContentPage>
  );
}
