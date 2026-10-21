import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BellRing, Building2, CalendarDays, FileText, Hash } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { breakable, formatDate, ucfirst } from "@/lib/format";
import { getNotice, getNotices } from "@/lib/api";
import { NOTICES, NOTICE_TYPES } from "@/data/content";
import { EQUITIES } from "@/data/market";
import { COUNTRIES } from "@/lib/navigation";
import { locales } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { NoticeRow, NoticeTypeTag } from "@/components/content/NoticeRow";
import { SubscribeForm } from "@/components/content/SubscribeForm";
import { Reveal } from "@/components/motion/Reveal";
import { tc } from "@/i18n/content";


// Only the newest notices are built ahead of time; older ones from the archive render on first visit.
const PREBUILT = 8;

export function generateStaticParams() {
  const recent = [...NOTICES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, PREBUILT);
  return locales.flatMap((locale) => recent.map((n) => ({ locale, id: n.id })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/avis-et-communiques/[id]">): Promise<Metadata> {
  const { id } = await params;
  const n = NOTICES.find((x) => x.id === id);
  return { title: n ? `${n.number ? `Avis N°${n.number} – ` : ""}${n.title}` : undefined };
}

const L = {
  fr: { official: "Consulter l’avis officiel et son PDF", source: "Publication officielle sur www.bvm-ac.org", related: "Publications liées", back: "Tous les avis", number: "Numéro", date: "Date de publication", issuer: "Émetteur", country: "Pays", type: "Type", original: "Intitulé officiel", alerts: "Être alerté des prochains avis", security: "Voir la fiche valeur" },
  en: { official: "View the official notice and PDF", source: "Official publication on www.bvm-ac.org", related: "Related publications", back: "All notices", number: "Number", date: "Publication date", issuer: "Issuer", country: "Country", type: "Type", original: "Official title", alerts: "Get alerts for future notices", security: "See the security page" },
  es: { official: "Consultar el aviso oficial y su PDF", source: "Publicación oficial en www.bvm-ac.org", related: "Publicaciones relacionadas", back: "Todos los avisos", number: "Número", date: "Fecha de publicación", issuer: "Emisor", country: "País", type: "Tipo", original: "Título oficial", alerts: "Recibir alertas de próximos avisos", security: "Ver la ficha del valor" },
};

export default async function NoticePage({ params }: PageProps<"/[locale]/avis-et-communiques/[id]">) {
  const { locale, dict } = await resolveLocale(params);
  const { id } = await params;
  const n = await getNotice(id);
  if (!n) notFound();
  const t = L[locale];
  const all = await getNotices();
  const related = all.filter((x) => x.id !== n.id && ((n.issuer && x.issuer === n.issuer) || x.type === n.type)).slice(0, 4);
  const equity = EQUITIES.find((e) => n.issuer && (n.issuer.toUpperCase().includes(e.shortName.toUpperCase().split(" ")[0]) || e.name === n.issuer));
  const country = COUNTRIES.find((c) => c.code === n.country);
  const meta: [typeof Hash, string, string][] = [
    [Hash, t.number, n.number ? `N°${n.number}` : "—"],
    [CalendarDays, t.date, formatDate(n.date, locale)],
    [Building2, t.issuer, n.issuer ?? "BVMAC"],
    [FileText, t.type, NOTICE_TYPES[n.type][locale]],
  ];

  return (
    <>
      <PageHeader
        title={tc(n.title, locale)}
        overline={n.number ? `Avis N°${n.number}` : NOTICE_TYPES[n.type][locale]}
        meta={<><NoticeTypeTag type={n.type} locale={locale} /><span className="text-sm text-muted">{ucfirst(formatDate(n.date, locale))}</span></>}
      />
      <div className="container-site grid gap-12 pt-10 pb-14 md:pt-12 md:pb-20 lg:grid-cols-[1.6fr_1fr]">
        <Reveal className="grid content-start gap-8">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-7">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{t.original}</p>
            <p lang="fr" className="mt-3 font-serif-display text-xl leading-snug text-heading sm:text-2xl">{breakable(n.original)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-action px-6 font-medium text-action-text hover:bg-action-hover">
                {t.official} <ArrowUpRight aria-hidden="true" className="size-4" />
                <span className="sr-only">{dict.a11y.external}</span>
              </a>
              {equity && (
                <Link href={localePath(locale, `/marches/actions/${equity.slug}`)} className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium hover:border-heading/40">{t.security}</Link>
              )}
            </div>
            <p className="mt-4 text-xs text-muted">{t.source}</p>
          </div>
          {related.length > 0 && (
            <section aria-labelledby="related">
              <h2 id="related" className="text-h2 mb-4">{t.related}</h2>
              <div className="divide-y divide-line border-y border-line">{related.map((r) => <NoticeRow key={r.id} notice={r} locale={locale} />)}</div>
            </section>
          )}
          <Link href={localePath(locale, "/avis-et-communiques")} className="inline-flex items-center gap-2 text-sm text-link hover:underline"><ArrowLeft aria-hidden="true" className="size-4" />{t.back}</Link>
        </Reveal>
        <Reveal delay={0.1} as="div" className="grid h-fit gap-5">
          <dl className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface p-2">
            {meta.map(([Icon, k, v]) => (
              <div key={k} className="flex items-center gap-3 px-4 py-3.5">
                <Icon aria-hidden="true" className="size-4 text-accent-text" strokeWidth={1.6} />
                <dt className="flex-1 text-sm text-muted">{k}</dt>
                <dd className="text-right text-sm text-heading">{v}</dd>
              </div>
            ))}
            {country && (
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="size-4" />
                <dt className="flex-1 text-sm text-muted">{t.country}</dt>
                <dd className="text-sm text-heading">{country[locale]}</dd>
              </div>
            )}
          </dl>
          <div className="rounded-[var(--radius-card)] bg-espresso p-6 text-brand-sand">
            <BellRing aria-hidden="true" className="size-6 text-brand-gold-light" strokeWidth={1.5} />
            <p className="mt-3 font-serif-display text-xl text-brand-ivory">{t.alerts}</p>
            <div className="mt-4"><SubscribeForm tone="dark" /></div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
