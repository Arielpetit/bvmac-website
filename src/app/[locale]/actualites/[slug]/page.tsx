import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { crumbs } from "@/lib/page-helpers";
import { formatDate } from "@/lib/format";
import { getNews } from "@/lib/api";
import { NEWS } from "@/data/content";
import { locales } from "@/i18n/config";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { NewsCard } from "@/components/content/NewsCard";
import { ShareButtons } from "@/components/content/ShareButtons";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/Parallax";

export const instant = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => NEWS.map((n) => ({ locale, slug: n.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/actualites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const n = NEWS.find((x) => x.slug === slug);
  return n ? { title: n.title, description: n.excerpt, openGraph: { images: [n.image] } } : {};
}

const L = {
  fr: { full: "Lire l’article complet sur bvm-ac.org", related: "À lire aussi", prev: "Précédent", next: "Suivant", back: "Toutes les actualités" },
  en: { full: "Read the full article on bvm-ac.org", related: "Read also", prev: "Previous", next: "Next", back: "All news" },
  es: { full: "Leer el artículo completo en bvm-ac.org", related: "Lea también", prev: "Anterior", next: "Siguiente", back: "Todas las noticias" },
};

export default async function ArticlePage({ params }: PageProps<"/[locale]/actualites/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const news = await getNews();
  const index = news.findIndex((n) => n.slug === slug);
  if (index < 0) notFound();
  const item = news[index];
  const t = L[locale];
  const prev = news[index + 1];
  const next = news[index - 1];

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-espresso text-brand-sand">
        <ParallaxImage src={item.image} alt="" className="absolute inset-0 -z-10 opacity-50" strength={60} priority />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/30" />
        <div className="container-site pb-16 pt-32 md:pb-24 md:pt-44">
          <div className="[&_a]:text-brand-sand/70 [&_a:hover]:text-brand-ivory [&_span[aria-current]]:text-brand-ivory">
            <Breadcrumb label={dict.a11y.breadcrumb} items={crumbs(locale, dict, "news", dict.nav.items.newsList, [{ label: item.category }])} />
          </div>
          <Reveal className="mt-10 max-w-4xl">
            <p className="eyebrow text-brand-gold-light!">{item.category} · <time dateTime={item.date}>{formatDate(item.date, locale)}</time></p>
            <h1 lang="fr" className="text-h1 mt-5 text-brand-ivory!">{item.title}</h1>
          </Reveal>
        </div>
      </header>
      <div className="container-site grid gap-12 py-14 md:py-20 lg:grid-cols-[1fr_280px]">
        <Reveal className="prose-bvmac" >
          <p lang="fr" className="text-xl leading-relaxed text-heading">{item.excerpt}</p>
          <p>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-link underline underline-offset-4">
              {t.full} <ArrowUpRight aria-hidden="true" className="size-4" />
              <span className="sr-only">{dict.a11y.external}</span>
            </a>
          </p>
          <div className="relative my-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-panel)]">
            <Image src={item.image} alt="" fill sizes="(min-width:1024px) 800px, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <aside className="grid h-fit gap-6 lg:sticky lg:top-28">
          <ShareButtons title={item.title} />
          <Link href={localePath(locale, "/actualites")} className="inline-flex items-center gap-2 text-sm text-link hover:underline"><ArrowLeft aria-hidden="true" className="size-4" />{t.back}</Link>
        </aside>
      </div>
      <nav aria-label={`${t.prev} / ${t.next}`} className="border-y border-line">
        <div className="container-site grid md:grid-cols-2">
          {prev ? (
            <Link href={localePath(locale, `/actualites/${prev.slug}`)} className="group flex flex-col gap-2 py-8 md:pr-8">
              <span className="inline-flex items-center gap-2 text-sm text-muted"><ArrowLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-1" />{t.prev}</span>
              <span lang="fr" className="font-serif-display text-xl text-heading group-hover:text-link">{prev.title}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={localePath(locale, `/actualites/${next.slug}`)} className="group flex flex-col items-end gap-2 border-line py-8 text-right md:border-l md:pl-8">
              <span className="inline-flex items-center gap-2 text-sm text-muted">{t.next}<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
              <span lang="fr" className="font-serif-display text-xl text-heading group-hover:text-link">{next.title}</span>
            </Link>
          )}
        </div>
      </nav>
      <section aria-labelledby="related" className="container-site py-20">
        <h2 id="related" className="text-h2 mb-10">{t.related}</h2>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {news.filter((n) => n.slug !== item.slug && n.category === item.category).concat(news.filter((n) => n.category !== item.category)).slice(0, 3).map((n) => (
            <li key={n.slug}><NewsCard item={n} locale={locale} /></li>
          ))}
        </ul>
      </section>
    </article>
  );
}
