import Link from "next/link";
import { ArrowUpRight, Building2, CalendarDays, FileText, Landmark, MapPin, Share2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import type { EquityQuote } from "@/lib/api";
import type { Notice } from "@/data/content";
import type { Point } from "@/data/series";
import { COUNTRIES } from "@/lib/navigation";
import { LAST_SESSION } from "@/data/market";
import { localePath } from "@/lib/paths";
import { formatDate, formatFcfa, formatNumber, ucfirst } from "@/lib/format";
import { STATUS_LABEL, formatListedOn, sectorLabel } from "@/lib/market-labels";
import { PageHeader } from "@/components/ui/PageHeader";
import { CompanyMark } from "@/components/brand/CompanyMark";
import { Tabs } from "@/components/ui/Tabs";
import { CountryChip, Tag } from "@/components/ui/Chip";
import { PriceChange } from "@/components/ui/PriceChange";
import { TimeSeriesChart } from "./LazyCharts";
import { NoticeRow } from "@/components/content/NoticeRow";
import { ISSUER_DOCUMENTS } from "@/data/issuer-documents";

const T = {
  fr: { statements: "États financiers", noDocs: "Aucun document publié pour le moment.", overview: "Aperçu", prices: "Cours", figures: "Chiffres clés", documents: "Documents", notices: "Avis", about: "À propos", contact: "Contact", key: "Données de marché", sector: "Secteur", country: "Pays", compartment: "Compartiment", listed: "Introduction en bourse", nominal: "Valeur nominale", dividend: "Dernier dividende", ref: "Cours de référence", close: "Cours de clôture", traded: "Quantité transigée", demanded: "Quantité demandée", offered: "Quantité offerte", status: "Statut", history: "Historique des cours", last: "20 dernières séances", noNotice: "Aucun avis récent pour cette valeur.", founded: "Création", hq: "Siège", docsText: "Les états financiers (OHADA et IFRS), fiches signalétiques et rapports d’activité sont publiés sur la page émetteur officielle.", docsCta: "Documents de l’émetteur sur bvm-ac.org", ohada: "États financiers OHADA", ifrs: "États financiers IFRS", report: "Rapport d’activité", sheet: "Fiche signalétique", contactText: "Pour toute question relative à cette valeur, contactez votre société de bourse ou le service Émetteurs de la BVMAC.", brokers: "Trouver une société de bourse", issuer: "Profil de l’émetteur", market: "Fiche de marché", share: "Partager", illustrative: "Historique illustratif ; dernier cours officiel.", na: "Non communiqué" },
  en: { statements: "Financial statements", noDocs: "No documents published yet.", overview: "Overview", prices: "Prices", figures: "Key figures", documents: "Documents", notices: "Notices", about: "About", contact: "Contact", key: "Market data", sector: "Sector", country: "Country", compartment: "Compartment", listed: "Listing", nominal: "Nominal value", dividend: "Last dividend", ref: "Reference price", close: "Closing price", traded: "Quantity traded", demanded: "Quantity bid", offered: "Quantity offered", status: "Status", history: "Price history", last: "Last 20 sessions", noNotice: "No recent notice for this security.", founded: "Founded", hq: "Head office", docsText: "Financial statements (OHADA and IFRS), fact sheets and activity reports are published on the official issuer page.", docsCta: "Issuer documents on bvm-ac.org", ohada: "OHADA financial statements", ifrs: "IFRS financial statements", report: "Activity report", sheet: "Fact sheet", contactText: "For any question about this security, contact your broker or BVMAC’s Issuers department.", brokers: "Find a broker", issuer: "Issuer profile", market: "Market page", share: "Share", illustrative: "Illustrative history; last price official.", na: "Not disclosed" },
  es: { statements: "Estados financieros", noDocs: "Aún no hay documentos publicados.", overview: "Resumen", prices: "Cotizaciones", figures: "Cifras clave", documents: "Documentos", notices: "Avisos", about: "Acerca de", contact: "Contacto", key: "Datos de mercado", sector: "Sector", country: "País", compartment: "Compartimento", listed: "Salida a bolsa", nominal: "Valor nominal", dividend: "Último dividendo", ref: "Precio de referencia", close: "Precio de cierre", traded: "Cantidad negociada", demanded: "Cantidad demandada", offered: "Cantidad ofrecida", status: "Estado", history: "Histórico de cotizaciones", last: "Últimas 20 sesiones", noNotice: "Ningún aviso reciente.", founded: "Creación", hq: "Sede", docsText: "Los estados financieros (OHADA y NIIF), fichas y memorias se publican en la página oficial del emisor.", docsCta: "Documentos del emisor en bvm-ac.org", ohada: "Estados financieros OHADA", ifrs: "Estados financieros NIIF", report: "Informe de actividad", sheet: "Ficha descriptiva", contactText: "Para cualquier pregunta sobre este valor, contacte con su sociedad de bolsa o con el servicio de Emisores de la BVMAC.", brokers: "Encontrar una sociedad de bolsa", issuer: "Perfil del emisor", market: "Ficha de mercado", share: "Compartir", illustrative: "Histórico ilustrativo; último precio oficial.", na: "No comunicado" },
};

const ISSUER_PAGE = "https://www.bvm-ac.org/espace-emetteurs/emetteurs-actions/";
// Only images that relate to the issuer; others show the logo-led header.

export function SecurityProfile({
  e,
  history,
  notices,
  locale,
  dict,
  mode,
}: {
  e: EquityQuote;
  history: Point[];
  notices: Notice[];
  locale: Locale;
  dict: Dictionary;
  mode: "market" | "issuer";
}) {
  const t = T[locale];
  const country = COUNTRIES.find((c) => c.code === e.country)!;
  const docs = ISSUER_DOCUMENTS[e.slug];
  const years = [...new Set([...Object.keys(docs?.ohada ?? {}), ...Object.keys(docs?.ifrs ?? {})].map(Number))].sort((a, b) => b - a);
  const pdf = "rounded-full border border-line px-3 py-1 text-xs hover:border-line-strong";

  const keyData: [string, string][] = [
    [t.close, formatFcfa(e.closePrice, locale)],
    [t.ref, formatFcfa(e.referencePrice, locale)],
    [t.dividend, `${formatFcfa(e.lastDividend.amount, locale)} · ${formatDate(e.lastDividend.date, locale, "short")}`],
    [t.nominal, e.nominal ? formatFcfa(e.nominal, locale) : t.na],
    [t.traded, formatNumber(e.qtyTraded, locale)],
    [t.demanded, formatNumber(e.qtyDemanded, locale)],
    [t.offered, formatNumber(e.qtyOffered, locale)],
    [t.status, STATUS_LABEL[locale][e.status]],
  ];
  const companyData: [string, string][] = [
    [t.sector, sectorLabel(e.sector, locale)],
    [t.country, country[locale]],
    [t.hq, e.headquarters],
    [t.founded, e.founded ?? t.na],
    [t.compartment, e.compartment ?? t.na],
    [t.listed, formatListedOn(e.listedOn, locale)],
    ["ISIN", e.isin],
  ];

  const dl = (rows: [string, string][]) => (
    <dl className="divide-y divide-line text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-6 py-3">
          <dt className="text-muted">{k}</dt>
          <dd className="figure text-right text-heading">{v}</dd>
        </div>
      ))}
    </dl>
  );

  const overview = (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <h2 className="text-h3 mb-4">{t.history}</h2>
        <TimeSeriesChart data={history} title={`${e.shortName} (FCFA)`} note={t.illustrative} defaultRange="6M" />
      </div>
      <div className="h-fit rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <h2 className="text-h3">{t.key}</h2>
        <div className="mt-2">{dl(keyData)}</div>
      </div>
    </div>
  );

  const pricesTable = (
    <div className="relative overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface">
      <table className="w-full min-w-[480px] text-sm">
        <caption className="sr-only">{t.last}</caption>
        <thead className="bg-surface-alt">
          <tr className="text-xs uppercase tracking-[0.08em] text-muted">
            <th scope="col" className="px-5 py-3.5 text-left font-medium">Date</th>
            <th scope="col" className="px-5 py-3.5 text-right font-medium">{dict.market.price}</th>
            <th scope="col" className="px-5 py-3.5 text-right font-medium">{dict.market.changeLong}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {history.slice(-20).reverse().map((p, i, arr) => {
            const prev = arr[i + 1]?.value ?? p.value;
            return (
              <tr key={p.date}>
                <td className="px-5 py-3">{ucfirst(formatDate(p.date, locale))}</td>
                <td className="figure px-5 py-3 text-right">{formatNumber(p.value, locale)}</td>
                <td className="px-5 py-3 text-right"><PriceChange value={((p.value - prev) / prev) * 100} locale={locale} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-line px-5 py-3 text-xs text-muted">{t.illustrative}</p>
    </div>
  );

  const documents = (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="rounded-[var(--radius-card)] bg-surface-alt p-6">
        <FileText aria-hidden="true" className="size-7 text-accent-text" strokeWidth={1.5} />
        <p className="mt-4 text-muted">{t.docsText}</p>
        <a href={ISSUER_PAGE} target="_blank" rel="noopener noreferrer" className="link mt-4 inline-flex items-center gap-1 text-sm">
          {t.docsCta} <ArrowUpRight aria-hidden="true" className="size-4" />
          <span className="sr-only">{dict.a11y.external}</span>
        </a>
      </div>
      <div className="grid gap-2">
        {docs?.factsheet && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-3.5 text-sm">
            <span className="flex items-center gap-2.5"><FileText aria-hidden="true" className="size-4 text-accent-text" strokeWidth={1.6} />{t.sheet}</span>
            <a href={docs.factsheet} target="_blank" rel="noopener noreferrer" className={pdf}>PDF<span className="sr-only"> {dict.a11y.external}</span></a>
          </div>
        )}
        {years.map((year, i) => (
          <details key={year} open={i === 0} className="group rounded-2xl border border-line bg-surface">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-serif-display text-xl text-heading">
              {t.statements} {year}
              <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">+</span>
            </summary>
            <ul className="divide-y divide-line border-t border-line">
              {([[t.ohada, docs?.ohada[year]], [t.ifrs, docs?.ifrs[year]]] as const).filter(([, url]) => url).map(([doc, url]) => (
                <li key={doc} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <span className="flex items-center gap-2.5"><FileText aria-hidden="true" className="size-4 shrink-0 text-accent-text" strokeWidth={1.6} />{doc} {year}</span>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={pdf}>PDF<span className="sr-only"> {dict.a11y.external}</span></a>
                </li>
              ))}
            </ul>
          </details>
        ))}
        {docs?.reports.map((r) => (
          <div key={r.url} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-3.5 text-sm">
            <span lang="fr" className="flex items-center gap-2.5"><FileText aria-hidden="true" className="size-4 shrink-0 text-accent-text" strokeWidth={1.6} />{r.title}</span>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className={pdf}>PDF<span className="sr-only"> {dict.a11y.external}</span></a>
          </div>
        ))}
        {!docs && <p className="text-sm text-muted">{t.noDocs}</p>}
      </div>
    </div>
  );

  const noticesTab = notices.length ? (
    <div className="divide-y divide-line border-y border-line">{notices.map((n) => <NoticeRow key={n.id} notice={n} locale={locale} />)}</div>
  ) : (
    <p className="text-muted">{t.noNotice}</p>
  );

  const about = (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <p lang="fr" className="max-w-2xl text-lg leading-relaxed text-text">{e.bio}</p>
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">{dl(companyData)}</div>
    </div>
  );

  const contact = (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <Building2 aria-hidden="true" className="size-6 text-accent-text" strokeWidth={1.5} />
        <p className="mt-4 text-muted">{t.contactText}</p>
        <p className="mt-4 flex items-center gap-2 text-sm"><MapPin aria-hidden="true" className="size-4 text-muted" />{e.headquarters}</p>
      </div>
      <Link href={localePath(locale, "/participants/societes-de-bourse")} className="card-lift flex flex-col justify-between rounded-[var(--radius-card)] bg-espresso p-6 text-brand-sand">
        <Landmark aria-hidden="true" className="size-6 text-brand-gold-light" strokeWidth={1.5} />
        <span className="mt-6 font-serif-display text-2xl text-brand-ivory">{t.brokers}</span>
      </Link>
    </div>
  );

  const tabs =
    mode === "market"
      ? [
          { id: "apercu", label: t.overview, content: overview },
          { id: "cours", label: t.prices, content: pricesTable },
          { id: "documents", label: t.documents, content: documents },
          { id: "avis", label: t.notices, content: noticesTab },
          { id: "apropos", label: t.about, content: about },
        ]
      : [
          { id: "apropos", label: t.about, content: about },
          { id: "cours", label: t.prices, content: overview },
          { id: "chiffres", label: t.figures, content: <div className="max-w-2xl rounded-[var(--radius-card)] border border-line bg-surface p-6">{dl([...keyData, ...companyData])}</div> },
          { id: "documents", label: t.documents, content: documents },
          { id: "avis", label: t.notices, content: noticesTab },
          { id: "contact", label: t.contact, content: contact },
        ];

  return (
    <>
      <PageHeader
        title={e.name}
        leading={<CompanyMark slug={e.slug} name={e.shortName} size="xl" />}
        overline={`${e.ticker} · ${e.isin}`}
        meta={
          <>
            <a href={`mailto:?subject=${encodeURIComponent(`BVMAC – ${e.shortName}`)}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-heading hover:border-line-strong">
              <Share2 aria-hidden="true" className="size-4" strokeWidth={1.6} /> {t.share}
            </a>
            <Link href={localePath(locale, mode === "market" ? `/emetteurs/societes-cotees/${e.slug}` : `/marches/actions/${e.slug}`)} className="link text-sm">
              {mode === "market" ? t.issuer : t.market}
            </Link>
          </>
        }
      >
        <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
          <p className="flex items-baseline gap-2">
            <span className="font-serif-display text-6xl text-heading">{formatNumber(e.closePrice, locale)}</span>
            <span className="text-muted">FCFA</span>
          </p>
          <PriceChange value={e.change} locale={locale} className="text-lg" />
          <div className="flex flex-wrap gap-2">
            <CountryChip code={e.country} label={country[locale]} />
            <Tag>{sectorLabel(e.sector, locale)}</Tag>
            {e.compartment && <Tag>{e.compartment}</Tag>}
          </div>
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <CalendarDays aria-hidden="true" className="size-4" strokeWidth={1.6} />
          {dict.session.closingOf} {formatDate(LAST_SESSION, locale)} · {dict.session.delayed}
        </p>
      </PageHeader>
      <div className="container-site grid gap-10 pt-10 pb-14 md:pt-12 md:pb-20">
        <Tabs tabs={tabs} />
      </div>
    </>
  );
}
