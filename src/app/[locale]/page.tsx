import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  CandlestickChart,
  ReceiptText,
  CalendarDays,
  Check,
  Flame,
  Globe2,
  FileDown,
  GraduationCap,
  LineChart,
  PieChart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { formatDate, formatDayMonth, formatNumber } from "@/lib/format";
import { getAgenda, getBocArchive, getBonds, getCapitalisationHistory, getEquities, getMarketSummary, getNews, getNotices, getPriceHistory } from "@/lib/api";
import { KEY_FIGURES } from "@/data/content";
import { COUNTRIES, CONTACT, PARTNERS } from "@/lib/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PriceChange } from "@/components/ui/PriceChange";
import { Flag } from "@/components/ui/Flag";
import { Sparkline } from "@/components/market/Sparkline";
import { NoticeRow } from "@/components/content/NoticeRow";
import { NewsCard } from "@/components/content/NewsCard";
import { VideoCard } from "@/components/content/VideoCard";
import { SessionChip } from "@/components/layout/SessionChip";
import { HeroMarketCard } from "@/components/home/HeroMarketCard";
import { InvestArt, LearnArt, NoticesArt, RaiseArt } from "@/components/home/Illustrations";
import { AppShowcase } from "@/components/home/AppShowcase";
import { CompanyMark } from "@/components/brand/CompanyMark";
import { QrCode, StoreBadge } from "@/components/brand/StoreBadges";
import { Reveal, Stagger, StaggerItem, WordReveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { ParallaxImage } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";

const copy = {
  fr: {
    eyebrow: "Marché financier régional · CEMAC",
    titleA: "La bourse des six pays",
    titleB: "de l’Afrique centrale",
    subtitle: "Cours officiels, avis du marché et sociétés cotées du Cameroun, de la Centrafrique, du Congo, du Gabon, de la Guinée équatoriale et du Tchad.",
    ctaA: "Voir les cours",
    ctaB: "Comment investir",
    figures: ["Capitalisation actions", "Encours obligataire", "Actions cotées", "Lignes obligataires", "Sociétés de bourse", "Pays membres"],
    figUnit: "Md FCFA",
    figSession: "Séance du",
    figCapCta: "Voir le marché actions",
    figBondCta: "Voir les obligations",
    figBondSplit: "Lignes par pays émetteur",
    figCapNote: "Évolution sur 120 séances",
    doEyebrow: "Par où commencer",
    doTitle: "Que souhaitez-vous faire ?",
    personas: [
      { title: "Investir", text: "Comprendre le marché, choisir une société de bourse et suivre vos valeurs.", href: "/investisseurs/comment-investir", cta: "Comment investir" },
      { title: "Lever des fonds", text: "S’introduire en bourse ou émettre une obligation : conditions, étapes et accompagnement.", href: "/emetteurs/s-introduire-en-bourse", cta: "Devenir émetteur" },
      { title: "Professionnels", text: "Avis officiels, textes réglementaires et intermédiaires agréés.", href: "/avis-et-communiques", cta: "Avis du marché" },
      { title: "Apprendre", text: "Leçons courtes, quiz et portefeuille virtuel, gratuitement.", href: "/ecole-de-bourse", cta: "École de bourse" },
    ],
    marketEyebrow: "Marché du jour",
    marketTitle: "Cours de clôture",
    marketIntro: "Les sept actions cotées à la BVMAC et leur évolution récente.",
    tableSecurity: "Valeur",
    tablePrice: "Cours (FCFA)",
    tableChange: "Var.",
    tableTrend: "Tendance",
    tableVolume: "Qté échangée",
    seeAll: "Toutes les actions",
    bocTitle: "Bulletin Officiel de la Cote",
    bocText: "Le document de référence de chaque séance : cours, volumes et capitalisation.",
    bocDownload: "Télécharger le PDF",
    bocArchive: "Archives du BOC",
    bondsTitle: "Marché obligataire",
    bondsText: "lignes d’obligations d’États, d’institutions et d’entreprises.",
    bondsCta: "Voir les obligations",
    storyEyebrow: "Introduction en bourse",
    storyTitle: "BGFI Holding Corporation rejoint le compartiment A-Premium",
    storyText: "Le 7 mai 2026, la BVMAC a célébré la première cotation des actions de la holding du Groupe BGFIBank, premier groupe financier d’Afrique centrale, présent dans 12 pays.",
    storyStats: [["7 mai 2026", "Première cotation"], ["A-Premium", "Compartiment"], ["12 pays", "Présence du groupe"]],
    storyCta: "Voir la fiche valeur",
    noticesEyebrow: "Publications officielles",
    noticesTitle: "Échos du marché",
    noticesAll: "Tous les avis",
    agendaTitle: "Opérations sur titres",
    agendaAll: "Tout l’agenda",
    agendaTypes: { dividende: "Dividende", coupon: "Coupon", remboursement: "Remboursement", ag: "Assemblée", introduction: "Introduction", souscription: "Souscription" },
    schoolEyebrow: "École de bourse",
    schoolTitle: "Apprendre la bourse, pas à pas.",
    schoolText: "Un espace gratuit pour comprendre le marché financier régional avant d’investir : 14 leçons, des quiz expliqués et un portefeuille virtuel.",
    schoolPoints: [["Leçons de 5 minutes", "Des notions claires, du BOC aux obligations."], ["Quiz et badges", "Une progression enregistrée sur votre appareil."], ["Portefeuille virtuel", "5 000 000 FCFA fictifs, cours réels différés."]],
    schoolCta: "Commencer un parcours",
    newsEyebrow: "Actualités",
    newsTitle: "La vie du marché",
    newsAll: "Toutes les actualités",
    tvTitle: "Cérémonie de première cotation",
    tvCaption: "BVMAC TV · Reportages et cérémonies",
    appEyebrow: "Application mobile",
    appTitle: "Le marché dans votre poche.",
    appText: "Cours, avis officiels et alertes personnalisées : BOC publié, nouvel avis d’un émetteur suivi, seuil de cours.",
    appPoints: ["Cours et variations", "Alertes choisies", "École de bourse hors ligne"],
    qr: "Scannez pour télécharger",
    partners: "Institutions du marché financier régional",
    partnersEyebrow: "Écosystème",
    partnersVisit: "Site officiel",
  },
  en: {
    eyebrow: "Regional financial market · CEMAC",
    titleA: "The stock exchange",
    titleB: "of Central Africa",
    subtitle: "Official prices, market notices and listed companies from Cameroon, the Central African Republic, Congo, Gabon, Equatorial Guinea and Chad.",
    ctaA: "See prices",
    ctaB: "How to invest",
    figures: ["Equity capitalisation", "Bonds outstanding", "Listed shares", "Listed bonds", "Licensed brokers", "Member countries"],
    figUnit: "FCFA bn",
    figSession: "Session of",
    figCapCta: "See the equity market",
    figBondCta: "See bonds",
    figBondSplit: "Lines by issuer country",
    figCapNote: "Last 120 sessions",
    doEyebrow: "Where to start",
    doTitle: "What would you like to do?",
    personas: [
      { title: "Invest", text: "Understand the market, choose a broker and follow your securities.", href: "/investisseurs/comment-investir", cta: "How to invest" },
      { title: "Raise capital", text: "List shares or issue a bond: requirements, steps and support.", href: "/emetteurs/s-introduire-en-bourse", cta: "Become an issuer" },
      { title: "Professionals", text: "Official notices, regulations and licensed intermediaries.", href: "/avis-et-communiques", cta: "Market notices" },
      { title: "Learn", text: "Short lessons, quizzes and a virtual portfolio, free.", href: "/ecole-de-bourse", cta: "Stock Market School" },
    ],
    marketEyebrow: "Today’s market",
    marketTitle: "Closing prices",
    marketIntro: "The seven shares listed on BVMAC and their recent trend.",
    tableSecurity: "Security",
    tablePrice: "Price (FCFA)",
    tableChange: "Chg.",
    tableTrend: "Trend",
    tableVolume: "Qty traded",
    seeAll: "All equities",
    bocTitle: "Official Price Bulletin",
    bocText: "The reference document for every session: prices, volumes and capitalisation.",
    bocDownload: "Download PDF",
    bocArchive: "BOC archive",
    bondsTitle: "Bond market",
    bondsText: "lines of government, institutional and corporate bonds.",
    bondsCta: "See bonds",
    storyEyebrow: "New listing",
    storyTitle: "BGFI Holding Corporation joins the A-Premium compartment",
    storyText: "On 7 May 2026, BVMAC celebrated the first listing of the holding company of the BGFIBank Group, Central Africa’s leading financial group, present in 12 countries.",
    storyStats: [["7 May 2026", "First listing"], ["A-Premium", "Compartment"], ["12 countries", "Group footprint"]],
    storyCta: "See the security page",
    noticesEyebrow: "Official publications",
    noticesTitle: "Market notices",
    noticesAll: "All notices",
    agendaTitle: "Corporate actions",
    agendaAll: "Full calendar",
    agendaTypes: { dividende: "Dividend", coupon: "Coupon", remboursement: "Redemption", ag: "Meeting", introduction: "Listing", souscription: "Subscription" },
    schoolEyebrow: "Stock Market School",
    schoolTitle: "Learn the market, step by step.",
    schoolText: "A free space to understand the regional financial market before investing: 14 lessons, explained quizzes and a virtual portfolio.",
    schoolPoints: [["5-minute lessons", "Clear concepts, from the BOC to bonds."], ["Quizzes and badges", "Progress saved on your device."], ["Virtual portfolio", "5,000,000 virtual FCFA, real delayed prices."]],
    schoolCta: "Start a learning path",
    newsEyebrow: "News",
    newsTitle: "Life of the market",
    newsAll: "All news",
    tvTitle: "First listing ceremony",
    tvCaption: "BVMAC TV · Reports and ceremonies",
    appEyebrow: "Mobile app",
    appTitle: "The market in your pocket.",
    appText: "Prices, official notices and the alerts you choose: BOC published, new notice from a followed issuer, price threshold.",
    appPoints: ["Prices and moves", "Chosen alerts", "Offline Stock Market School"],
    qr: "Scan to download",
    partners: "Regional financial market institutions",
    partnersEyebrow: "Ecosystem",
    partnersVisit: "Official website",
  },
  es: {
    eyebrow: "Mercado financiero regional · CEMAC",
    titleA: "La bolsa de los seis países",
    titleB: "de África Central",
    subtitle: "Cotizaciones oficiales, avisos del mercado y sociedades cotizadas de Camerún, Centroáfrica, Congo, Gabón, Guinea Ecuatorial y Chad.",
    ctaA: "Ver cotizaciones",
    ctaB: "Cómo invertir",
    figures: ["Capitalización acciones", "Saldo obligacionista", "Acciones cotizadas", "Obligaciones cotizadas", "Sociedades de bolsa", "Países miembros"],
    figUnit: "mil M FCFA",
    figSession: "Sesión del",
    figCapCta: "Ver el mercado de acciones",
    figBondCta: "Ver obligaciones",
    figBondSplit: "Líneas por país emisor",
    figCapNote: "Últimas 120 sesiones",
    doEyebrow: "Por dónde empezar",
    doTitle: "¿Qué desea hacer?",
    personas: [
      { title: "Invertir", text: "Comprender el mercado, elegir una sociedad de bolsa y seguir sus valores.", href: "/investisseurs/comment-investir", cta: "Cómo invertir" },
      { title: "Captar fondos", text: "Salir a bolsa o emitir obligaciones: condiciones, etapas y acompañamiento.", href: "/emetteurs/s-introduire-en-bourse", cta: "Ser emisor" },
      { title: "Profesionales", text: "Avisos oficiales, textos reglamentarios e intermediarios autorizados.", href: "/avis-et-communiques", cta: "Avisos del mercado" },
      { title: "Aprender", text: "Lecciones cortas, cuestionarios y cartera virtual, gratis.", href: "/ecole-de-bourse", cta: "Escuela de bolsa" },
    ],
    marketEyebrow: "Mercado del día",
    marketTitle: "Cotizaciones de cierre",
    marketIntro: "Las siete acciones cotizadas en la BVMAC y su evolución reciente.",
    tableSecurity: "Valor",
    tablePrice: "Precio (FCFA)",
    tableChange: "Var.",
    tableTrend: "Tendencia",
    tableVolume: "Cant. negociada",
    seeAll: "Todas las acciones",
    bocTitle: "Boletín Oficial de Cotización",
    bocText: "El documento de referencia de cada sesión: cotizaciones, volúmenes y capitalización.",
    bocDownload: "Descargar el PDF",
    bocArchive: "Archivo del BOC",
    bondsTitle: "Mercado de obligaciones",
    bondsText: "líneas de obligaciones de Estados, instituciones y empresas.",
    bondsCta: "Ver obligaciones",
    storyEyebrow: "Salida a bolsa",
    storyTitle: "BGFI Holding Corporation se incorpora al compartimento A-Premium",
    storyText: "El 7 de mayo de 2026, la BVMAC celebró la primera cotización del holding del Grupo BGFIBank, primer grupo financiero de África Central, presente en 12 países.",
    storyStats: [["7 mayo 2026", "Primera cotización"], ["A-Premium", "Compartimento"], ["12 países", "Presencia del grupo"]],
    storyCta: "Ver la ficha del valor",
    noticesEyebrow: "Publicaciones oficiales",
    noticesTitle: "Ecos del mercado",
    noticesAll: "Todos los avisos",
    agendaTitle: "Operaciones sobre valores",
    agendaAll: "Toda la agenda",
    agendaTypes: { dividende: "Dividendo", coupon: "Cupón", remboursement: "Amortización", ag: "Junta", introduction: "Salida a bolsa", souscription: "Suscripción" },
    schoolEyebrow: "Escuela de bolsa",
    schoolTitle: "Aprender la bolsa, paso a paso.",
    schoolText: "Un espacio gratuito para comprender el mercado financiero regional antes de invertir: 14 lecciones, cuestionarios explicados y una cartera virtual.",
    schoolPoints: [["Lecciones de 5 minutos", "Conceptos claros, del BOC a las obligaciones."], ["Cuestionarios e insignias", "Progreso guardado en su dispositivo."], ["Cartera virtual", "5.000.000 FCFA ficticios, cotizaciones reales diferidas."]],
    schoolCta: "Empezar un itinerario",
    newsEyebrow: "Actualidad",
    newsTitle: "La vida del mercado",
    newsAll: "Todas las noticias",
    tvTitle: "Ceremonia de primera cotización",
    tvCaption: "BVMAC TV · Reportajes y ceremonias",
    appEyebrow: "Aplicación móvil",
    appTitle: "El mercado en su bolsillo.",
    appText: "Cotizaciones, avisos oficiales y las alertas que elija: BOC publicado, nuevo aviso de un emisor seguido, umbral de precio.",
    appPoints: ["Cotizaciones y variaciones", "Alertas elegidas", "Escuela de bolsa sin conexión"],
    qr: "Escanee para descargar",
    partners: "Instituciones del mercado financiero regional",
    partnersEyebrow: "Ecosistema",
    partnersVisit: "Sitio oficial",
  },
};

const personaIcons = [TrendingUp, Briefcase, LineChart, GraduationCap];
const countIcons = [CandlestickChart, ReceiptText, BriefcaseBusiness, Globe2];
const COUNTRY_TONES = ["#5a3412", "#8a6614", "#c9a23a", "#ead18a", "#b38a2a", "#3a2414"];

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale, dict } = await resolveLocale(params);
  const t = copy[locale];
  const p = (path: string) => localePath(locale, path);

  const [summary, capHistory, equities, notices, agenda, news, boc, bonds] = await Promise.all([
    getMarketSummary(),
    getCapitalisationHistory(120),
    getEquities(),
    getNotices(),
    getAgenda(),
    getNews(),
    getBocArchive(),
    getBonds(),
  ]);
  const sparks = Object.fromEntries(await Promise.all(equities.map(async (e) => [e.slug, await getPriceHistory(e.slug, 60)] as const)));
  const latestBoc = boc[0];
  const heroRows = equities.slice().sort((a, b) => b.lastDividend.amount / b.closePrice - a.lastDividend.amount / a.closePrice).slice(0, 4);
  const marketNews = news.filter((n) => n.category !== "Recrutement");

  const counts = [
    { value: KEY_FIGURES.listedEquities, label: t.figures[2], href: "/marches/actions" },
    { value: KEY_FIGURES.listedBonds, label: t.figures[3], href: "/marches/obligations" },
    { value: KEY_FIGURES.brokers, label: t.figures[4], href: "/participants/societes-de-bourse" },
    { value: KEY_FIGURES.countries, label: t.figures[5], href: "/la-bvmac" },
  ];
  const bondSplit = COUNTRIES.map((c) => ({ code: c.code, count: bonds.filter((b) => b.country === c.code).length })).filter((b) => b.count > 0).sort((a, b) => b.count - a.count);

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-espresso text-brand-sand">
        <div aria-hidden="true" className="absolute inset-0 -z-30 bg-[#0b0704]" />
        {/* Building on the right; faded with a solid gradient overlay (no CSS mask, which rendered blocky pixels). */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-20 w-full lg:w-[62%]">
          <Image src="/photos/bvmac-building.webp" alt="" fill priority sizes="(min-width:1024px) 62vw, 100vw" className="object-cover object-[60%_35%] opacity-[0.28] saturate-[0.8]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0704] via-[#0b0704]/70 to-transparent" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_85%_0%,rgb(234_209_138/0.22),transparent_60%),radial-gradient(ellipse_60%_50%_at_10%_100%,rgb(201_162_58/0.10),transparent_60%),linear-gradient(180deg,transparent_55%,#0b0704)]" />
        <div aria-hidden="true" className="absolute -top-40 right-[18%] -z-10 h-[140%] w-40 rotate-[24deg] bg-gradient-to-b from-brand-gold-light/15 via-brand-gold/5 to-transparent blur-2xl" />
        <div aria-hidden="true" className="animate-orb absolute -left-40 top-24 -z-10 size-[520px] rounded-full bg-brand-gold/10 blur-[130px]" />

        <div className="container-site grid gap-14 pb-14 pt-32 md:pt-36 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:pb-16 lg:pt-40">
          <div>
            <Reveal y={12} className="flex flex-wrap items-center gap-3">
              <SessionChip withNext className="bg-white/10! text-brand-ivory! ring-1 ring-white/15" />
              <span className="text-sm text-brand-sand/70">{t.eyebrow}</span>
            </Reveal>
            <h1 id="hero-title" className="text-display mt-7 text-brand-ivory!">
              <WordReveal text={t.titleA} />
              <br />
              <WordReveal text={t.titleB} delay={0.25} className="italic text-brand-gold-light [font-variation-settings:'SOFT'_100,'opsz'_144]" />
            </h1>
            <Reveal delay={0.5} className="mt-7 max-w-xl text-lg leading-relaxed text-brand-sand/80">
              <p>{t.subtitle}</p>
            </Reveal>
            <Reveal delay={0.65} className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={p("/marches")} variant="gold">
                {t.ctaA}
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
              <ButtonLink href={p("/investisseurs/comment-investir")} variant="outlineDark">
                {t.ctaB}
              </ButtonLink>
            </Reveal>
            <Reveal delay={0.8} className="mt-12">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-brand-sand/70">
                {COUNTRIES.map((c) => (
                  <li key={c.code} className="flex items-center gap-2">
                    <Flag code={c.code} className="h-3 w-[18px]" />
                    {c[locale]}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <HeroMarketCard
            history={capHistory}
            capitalisation={summary.equityCapitalisation}
            traded={summary.valueTraded}
            bonds={summary.bondOutstanding}
            equitiesCount={KEY_FIGURES.listedEquities}
            bondsCount={KEY_FIGURES.listedBonds}
            rows={heroRows.map(({ slug, shortName, sector, closePrice, lastDividend }) => ({ slug, shortName, sector, closePrice, dividend: lastDividend.amount }))}
            date={summary.date}
            bocUrl={latestBoc.url}
          />
        </div>

        <div className="border-t border-white/10 bg-black/20">
          <Marquee duration={45} className="py-3.5">
            {[...equities, ...bonds.slice(0, 8).map((b) => ({ slug: "", shortName: b.name, closePrice: b.close, change: b.change, ticker: b.isin }))].map((e, i) => (
              <span key={i} className="flex items-center gap-2.5 px-6 text-sm">
                <span className="font-medium text-brand-ivory">{e.shortName}</span>
                <span className="figure text-brand-sand/80">{formatNumber(e.closePrice, locale, e.closePrice < 1000 ? 2 : 0)}</span>
                <PriceChange value={e.change} locale={locale} tone="onDark" className="text-xs" />
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* KEY FIGURES */}
      <section aria-label={t.figures.join(", ")} className="relative bg-background pb-16 pt-12 md:pb-20 md:pt-14">
        <div aria-hidden="true" className="dots absolute inset-x-0 top-0 h-72 opacity-50" />
        <div className="container-site relative grid gap-4 lg:grid-cols-2">
          {/* Equity capitalisation */}
          <Reveal className="card-lift group relative flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface shadow-soft">
            <div className="flex items-start justify-between gap-4 p-7 pb-0 md:p-8 md:pb-0">
              <div>
                <p className="text-sm text-muted">{t.figures[0]}</p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-serif-display text-[2.75rem] leading-none sm:text-[3.25rem] text-heading md:text-6xl"><CountUp value={summary.equityCapitalisation} kind="billions" /></span>
                  <span className="whitespace-nowrap text-sm font-medium text-accent-text">{t.figUnit}</span>
                </p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-text"><PieChart aria-hidden="true" className="size-5" strokeWidth={1.6} /></span>
            </div>
            <figure className="relative mt-4 h-28 px-2" aria-label={t.figCapNote}>
              <MiniArea points={capHistory.map((pt) => pt.value)} id="cap-area" />
            </figure>
            <Link href={p("/marches/actions")} className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-line px-7 py-4 text-sm md:px-8">
              <span className="text-muted">{t.figSession} {formatDate(summary.date, locale, "short")}<span className="hidden sm:inline"> · {t.figCapNote}</span></span>
              <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-link">{t.figCapCta}<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </Reveal>

          {/* Bonds outstanding */}
          <Reveal delay={0.08} className="card-lift group relative flex flex-col overflow-hidden rounded-[var(--radius-panel)] bg-espresso text-brand-sand shadow-soft">
            <span aria-hidden="true" className="grid-lines absolute inset-0 opacity-70" />
            <span aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-brand-gold/20 blur-[80px]" />
            <div className="relative flex items-start justify-between gap-4 p-7 pb-0 md:p-8 md:pb-0">
              <div>
                <p className="text-sm text-brand-sand/70">{t.figures[1]}</p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-serif-display text-[2.75rem] leading-none sm:text-[3.25rem] text-brand-ivory md:text-6xl"><CountUp value={summary.bondOutstanding} kind="billions" /></span>
                  <span className="whitespace-nowrap text-sm font-medium text-brand-gold-light">{t.figUnit}</span>
                </p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-brand-gold-light"><ReceiptText aria-hidden="true" className="size-5" strokeWidth={1.6} /></span>
            </div>
            <div className="relative mt-6 px-7 pb-6 md:px-8">
              <p className="text-xs uppercase tracking-[0.12em] text-brand-sand/55">{t.figBondSplit}</p>
              <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-white/10">
                {bondSplit.map((b, k) => (
                  <span key={b.code} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${(b.count / bonds.length) * 100}%`, background: COUNTRY_TONES[k % COUNTRY_TONES.length], marginRight: 2 }} />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-brand-sand/75">
                {bondSplit.map((b) => (
                  <li key={b.code} className="flex items-center gap-1.5"><Flag code={b.code} className="h-2.5 w-[15px]" />{COUNTRIES.find((c) => c.code === b.code)?.[locale]} <span className="figure text-brand-ivory">{b.count}</span></li>
                ))}
              </ul>
            </div>
            <Link href={p("/marches/obligations")} className="relative mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/10 px-7 py-4 text-sm md:px-8">
              <span className="text-brand-sand/60">{t.figSession} {formatDate(summary.date, locale, "short")}</span>
              <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-brand-gold-light">{t.figBondCta}<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </Reveal>

          {/* Counts strip */}
          <Reveal delay={0.12} className="lg:col-span-2">
            <dl className="grid grid-cols-2 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface md:grid-cols-4">
              {counts.map((c, k) => {
                const Icon = countIcons[k];
                return (
                  <Link key={c.href} href={p(c.href)} className={`group/c flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:gap-4 transition-colors hover:bg-surface-alt md:p-6 border-line ${k % 2 ? "border-l" : ""} ${k > 0 ? "md:border-l" : ""} ${k > 1 ? "max-md:border-t" : ""}`}>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line text-accent-text transition-colors group-hover/c:border-transparent group-hover/c:bg-action group-hover/c:text-action-text">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0">
                      <dd className="font-serif-display text-3xl leading-none text-heading"><CountUp value={c.value} /></dd>
                      <dt className="mt-1.5 text-sm leading-snug text-muted sm:truncate">{c.label}</dt>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="ml-auto hidden size-4 shrink-0 text-muted opacity-0 sm:block transition-all group-hover/c:rotate-45 group-hover/c:opacity-100" />
                  </Link>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* PERSONAS — bento */}
      <Section labelledBy="do-title">
        <SectionHeading id="do-title" overline={t.doEyebrow} title={t.doTitle} />
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {t.personas.map((persona, i) => {
            const Icon = personaIcons[i];
            const Art = [InvestArt, RaiseArt, NoticesArt, LearnArt][i];
            const theme = ["dark", "gold", "light", "dark"][i];
            const span = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"][i];
            const dark = theme === "dark";
            return (
              <StaggerItem key={persona.title} className={span}>
                <Link
                  href={p(persona.href)}
                  className={`card-lift group relative flex h-full min-h-[400px] flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] border p-7 md:p-9 ${
                    theme === "dark" ? "border-transparent bg-espresso text-brand-sand" : theme === "gold" ? "border-transparent bg-gradient-to-br from-[#f3e2b0] via-[#e9cf86] to-[#d4b25a] text-espresso" : "border-line bg-surface"
                  }`}
                >
                  {dark && <span aria-hidden="true" className="grid-lines absolute inset-0 opacity-70" />}
                  {dark && <span aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-brand-gold/20 blur-[80px] transition-opacity duration-700 group-hover:opacity-100 md:opacity-70" />}
                  {theme === "light" && <span aria-hidden="true" className="dots absolute inset-0 opacity-70" />}
                  <span className="relative flex items-start justify-between">
                    <span className={`flex size-12 items-center justify-center rounded-2xl ${dark ? "bg-white/10 text-brand-gold-light" : theme === "gold" ? "bg-espresso/10 text-espresso" : "bg-accent-soft text-accent-text"}`}>
                      <Icon aria-hidden="true" className="size-6" strokeWidth={1.5} />
                    </span>
                    <span className={`flex size-11 items-center justify-center rounded-full border transition-all duration-300 group-hover:rotate-45 ${dark ? "border-white/20 text-brand-gold-light group-hover:border-transparent group-hover:bg-brand-gold group-hover:text-espresso" : theme === "gold" ? "border-espresso/20 group-hover:bg-espresso group-hover:text-brand-gold-light" : "border-line text-accent-text group-hover:border-transparent group-hover:bg-action group-hover:text-action-text"}`}>
                      <ArrowUpRight aria-hidden="true" className="size-5" />
                    </span>
                  </span>
                  <Art className="pointer-events-none absolute right-5 top-20 w-[48%] max-w-[340px] transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.04] max-md:w-[60%] max-md:opacity-30 md:right-8" />
                  <span className="relative max-w-[min(100%,22rem)] pt-36">
                    <span className={`block font-serif-display text-3xl md:text-4xl ${dark ? "text-brand-ivory" : "text-heading"} ${theme === "gold" ? "!text-espresso" : ""}`}>{persona.title}</span>
                    <span className={`mt-3 block ${dark ? "text-brand-sand/75" : theme === "gold" ? "text-espresso/75" : "text-muted"}`}>{persona.text}</span>
                    <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium ${dark ? "text-brand-gold-light" : theme === "gold" ? "text-espresso" : "text-link"}`}>
                      {persona.cta}
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      {/* MARKET OF THE DAY */}
      <Section tone="surface" className="border-y border-line" labelledBy="market-title">
        <SectionHeading
          id="market-title"
          overline={t.marketEyebrow}
          title={t.marketTitle}
          intro={t.marketIntro}
          action={<SessionChip />}
        />
        <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
          <Reveal className="overflow-hidden rounded-[var(--radius-card)] border border-line">
            <table className="w-full text-sm">
              <caption className="sr-only">{t.marketTitle}</caption>
              <thead className="bg-surface-alt text-left text-xs uppercase tracking-[0.1em] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-medium">{t.tableSecurity}</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-medium">{t.tablePrice}</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-medium">{t.tableChange}</th>
                  <th scope="col" className="hidden px-5 py-3.5 font-medium sm:table-cell">{t.tableTrend}</th>
                  <th scope="col" className="hidden px-5 py-3.5 text-right font-medium md:table-cell">{t.tableVolume}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {equities.map((e) => (
                  <tr key={e.slug} className="group transition-colors hover:bg-surface-alt/60">
                    <th scope="row" className="px-5 py-4 text-left font-normal">
                      <Link href={p(`/marches/actions/${e.slug}`)} className="flex items-center gap-3">
                        <CompanyMark slug={e.slug} name={e.shortName} />
                        <span>
                          <span className="block font-medium text-heading group-hover:text-link">{e.shortName}</span>
                          <span className="flex items-center gap-1.5 text-xs text-muted"><Flag code={e.country} className="h-2.5 w-[15px]" />{e.sector}</span>
                        </span>
                      </Link>
                    </th>
                    <td className="figure px-5 py-4 text-right text-heading">{formatNumber(e.closePrice, locale)}</td>
                    <td className="px-5 py-4 text-right"><PriceChange value={e.change} locale={locale} /></td>
                    <td className="hidden px-5 py-4 sm:table-cell"><Sparkline points={sparks[e.slug]} className="h-8 w-28 text-[color:var(--chart-price)]" /></td>
                    <td className="figure hidden px-5 py-4 text-right text-muted md:table-cell">{formatNumber(e.qtyTraded, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-line bg-surface px-5 py-3.5 text-sm">
              <span className="text-muted">{dict.session.closingOf} {formatDate(summary.date, locale)} · {dict.session.delayed}</span>
              <Link href={p("/marches/actions")} className="link">{t.seeAll}</Link>
            </div>
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={0.1} className="relative overflow-hidden rounded-[var(--radius-card)] bg-espresso p-7 text-brand-sand">
              <div aria-hidden="true" className="absolute -right-10 -top-10 size-48 rounded-full bg-brand-gold/20 blur-3xl" />
              <p className="eyebrow text-brand-gold-light!">BOC · {latestBoc.number}</p>
              <h3 className="mt-3 font-serif-display text-2xl text-brand-ivory">{t.bocTitle}</h3>
              <p className="mt-2 text-sm text-brand-sand/75">{t.bocText}</p>
              <p className="mt-4 text-sm text-brand-sand">{dict.session.sessionOf} {formatDate(latestBoc.date, locale)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={latestBoc.url} variant="gold" size="sm" external>
                  <FileDown aria-hidden="true" className="size-4" />
                  {t.bocDownload}
                </ButtonLink>
                <ButtonLink href={p("/marches/boc")} variant="outlineDark" size="sm">{t.bocArchive}</ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.2} className="rounded-[var(--radius-card)] border border-line bg-background p-7">
              <PieChart aria-hidden="true" className="size-6 text-accent-text" strokeWidth={1.5} />
              <h3 className="mt-4 font-serif-display text-2xl text-heading">{t.bondsTitle}</h3>
              <p className="mt-2 text-muted">
                <span className="figure font-medium text-heading">{bonds.length}</span> {t.bondsText}
              </p>
              <Link href={p("/marches/obligations")} className="link mt-5 inline-block text-sm">{t.bondsCta}</Link>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* FEATURED STORY */}
      <section aria-labelledby="story-title" className="grain relative isolate overflow-hidden bg-espresso text-brand-sand">
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10" />
        <div aria-hidden="true" className="animate-orb absolute -right-40 top-10 -z-10 size-[560px] rounded-full bg-brand-gold/15 blur-[130px]" />
        <div className="container-site grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <Reveal className="flex items-center gap-3">
              <CompanyMark slug="bgfi-holding" size="md" />
              <p className="eyebrow text-brand-gold-light!">{t.storyEyebrow}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 id="story-title" className="text-h1 mt-6 text-brand-ivory!">{t.storyTitle}</h2>
            </Reveal>
            <Reveal delay={0.2}><p className="mt-6 max-w-xl text-lg text-brand-sand/80">{t.storyText}</p></Reveal>
            <Stagger as="dl" className="mt-10 grid grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {t.storyStats.map(([value, label]) => (
                <StaggerItem key={label}>
                  <dd className="font-serif-display text-2xl text-brand-ivory md:text-3xl">{value}</dd>
                  <dt className="mt-1 text-sm text-brand-sand/65">{label}</dt>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-5">
              <ButtonLink href={p("/marches/actions/bgfi-holding")} variant="gold">
                {t.storyCta} <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
              <span className="text-xs text-brand-sand/55">Visa COSUMAF N° COSUMAF-IPO1/25</span>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[970/624] overflow-hidden rounded-[var(--radius-panel)] shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)] ring-1 ring-white/10">
              <ParallaxImage src="/photos/bgfi-ipo-signing.webp" alt="Signature lors de l’introduction en bourse de BGFI Holding Corporation" className="absolute inset-0" strength={40} sizes="(min-width:1024px) 640px, 100vw" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-espresso/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 left-5 flex items-center gap-3 rounded-2xl bg-espresso-2 px-4 py-3 shadow-2xl ring-1 ring-brand-gold/30 md:-left-8">
              <CalendarDays aria-hidden="true" className="size-5 text-brand-gold-light" strokeWidth={1.6} />
              <span className="text-sm">
                <span className="block font-medium text-brand-ivory">{t.storyStats[0][0]}</span>
                <span className="block text-xs text-brand-sand/65">Siège BVMAC, Douala</span>
              </span>
            </div>
            <div className="absolute -top-5 right-5 flex items-center gap-2.5 rounded-full bg-brand-ivory py-2 pl-2 pr-4 text-espresso shadow-2xl md:-right-6">
              <span className="flex size-7 items-center justify-center rounded-full bg-brand-gold text-espresso"><TrendingUp aria-hidden="true" className="size-4" /></span>
              <span className="text-sm font-medium">{t.storyStats[1][0]}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NOTICES + AGENDA */}
      <Section labelledBy="notices-title">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SectionHeading id="notices-title" overline={t.noticesEyebrow} title={t.noticesTitle} action={<Link href={p("/avis-et-communiques")} className="link text-sm">{t.noticesAll}</Link>} className="mb-6" />
            <Stagger className="divide-y divide-line border-y border-line">
              {notices.slice(0, 6).map((n) => (
                <StaggerItem key={n.id}>
                  <NoticeRow notice={n} locale={locale} compact />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div>
            <Reveal className="mb-6 flex items-end justify-between gap-4 pt-[2.15rem]">
              <h2 className="font-serif-display text-2xl text-heading md:text-3xl">{t.agendaTitle}</h2>
              <Link href={p("/marches/agenda")} className="link text-sm">{t.agendaAll}</Link>
            </Reveal>
            <Stagger as="ol" className="relative grid gap-3">
              {agenda.slice(0, 6).map((a) => {
                const dm = formatDayMonth(a.date, locale);
                return (
                  <StaggerItem key={a.id} as="li">
                    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong">
                      <time dateTime={a.date} className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                        <span className="font-serif-display text-xl leading-none">{dm.day}</span>
                        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider">{dm.month}</span>
                      </time>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">{t.agendaTypes[a.type]}</p>
                        <p className="truncate font-medium text-heading">{a.issuer}</p>
                        <p className="line-clamp-1 text-sm text-muted">{a.detail}</p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
            <Link href={p("/marches/agenda")} className="mt-4 inline-flex items-center gap-2 text-sm text-link hover:underline">
              <CalendarDays aria-hidden="true" className="size-4" strokeWidth={1.6} /> .ics
            </Link>
          </div>
        </div>
      </Section>

      {/* SCHOOL */}
      <Section tone="alt" labelledBy="school-title">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-6 md:p-10">
              <span aria-hidden="true" className="grid-lines absolute inset-0" />
              <span aria-hidden="true" className="absolute -left-20 -top-20 size-72 rounded-full bg-brand-gold/25 blur-[90px]" />
              <LearnArt className="relative mx-auto w-full max-w-md opacity-90" />
              <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-brand-sand backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-brand-gold-light">Leçon 2 · 5 min</p>
                  <p className="mt-1.5 font-medium text-brand-ivory">Actions et obligations</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 rounded-full bg-brand-gold" /></div>
                </div>
                <div className="rounded-2xl bg-brand-ivory p-4 text-espresso shadow-2xl">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#8a6614]">Quiz</p>
                  <p className="mt-1.5 text-sm font-medium">Qu’est-ce qu’une obligation ?</p>
                  <p className="mt-2 flex items-center gap-2 rounded-lg bg-[#e4f3ea] px-2.5 py-1.5 text-xs text-[#157a43]"><Check aria-hidden="true" className="size-3.5" />Un prêt à un émetteur</p>
                </div>
              </div>
              <div className="relative mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-sm text-brand-sand">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-gold text-espresso"><Flame aria-hidden="true" className="size-4" /></span>
                <span><span className="font-medium text-brand-ivory">Série de 4 jours</span> · badge « Premier pas » obtenu</span>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal><p className="eyebrow">{t.schoolEyebrow}</p></Reveal>
            <Reveal delay={0.1}><h2 id="school-title" className="text-h2 mt-4">{t.schoolTitle}</h2></Reveal>
            <Reveal delay={0.15}><p className="mt-5 text-lg text-muted">{t.schoolText}</p></Reveal>
            <Stagger as="ul" className="mt-8 grid gap-4">
              {t.schoolPoints.map(([title, text], i) => {
                const Icon = [BookOpen, Sparkles, LineChart][i];
                return (
                  <StaggerItem key={title} as="li" className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-accent-text">
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
                    </span>
                    <span>
                      <span className="block font-medium text-heading">{title}</span>
                      <span className="block text-sm text-muted">{text}</span>
                    </span>
                  </StaggerItem>
                );
              })}
            </Stagger>
            <Reveal delay={0.2} className="mt-9">
              <ButtonLink href={p("/ecole-de-bourse")}>{t.schoolCta} <ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* NEWS */}
      <Section labelledBy="news-title">
        <SectionHeading id="news-title" overline={t.newsEyebrow} title={t.newsTitle} action={<Link href={p("/actualites")} className="link text-sm">{t.newsAll}</Link>} />
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>{marketNews[0] && <NewsCard item={marketNews[0]} locale={locale} large />}</Reveal>
          <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            {marketNews.slice(1, 3).map((n) => (
              <StaggerItem key={n.slug}>
                <NewsCard item={n} locale={locale} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <Reveal className="mt-14">
          <VideoCard title={t.tvTitle} caption={t.tvCaption} channelUrl={CONTACT.social.youtube} poster="/photos/ceremony-trading-floor-2.webp" />
        </Reveal>
      </Section>

      {/* APP */}
      <section aria-labelledby="app-title" className="grain relative overflow-hidden bg-espresso-2 text-brand-sand">
        <div aria-hidden="true" className="grid-lines absolute inset-0" />
        <div aria-hidden="true" className="animate-orb absolute -left-20 top-0 size-[420px] rounded-full bg-brand-gold/15 blur-[110px]" />
        <div className="container-site relative grid items-center gap-16 py-24 md:py-32 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal><p className="eyebrow text-brand-gold-light!">{t.appEyebrow}</p></Reveal>
            <Reveal delay={0.1}><h2 id="app-title" className="text-h1 mt-5 text-brand-ivory!">{t.appTitle}</h2></Reveal>
            <Reveal delay={0.15}><p className="mt-6 max-w-lg text-lg text-brand-sand/80">{t.appText}</p></Reveal>
            <Stagger as="ul" className="mt-8 flex flex-wrap gap-2">
              {t.appPoints.map((point) => (
                <StaggerItem key={point} as="li" className="rounded-full border border-white/15 px-4 py-2 text-sm text-brand-ivory">{point}</StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center gap-3">
              <StoreBadge store="google" href={CONTACT.playStore} locale={locale} />
              <StoreBadge store="apple" locale={locale} soon />
            </Reveal>
            <Reveal delay={0.3} className="mt-8 flex items-center gap-4 border-t border-white/10 pt-8">
              <span className="rounded-2xl bg-brand-ivory p-2.5 text-espresso shadow-xl"><QrCode className="size-20" /></span>
              <span className="max-w-[14rem] text-sm text-brand-sand/70">{t.qr}</span>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="mx-auto">
            <AppShowcase
              capitalisation={formatNumber(summary.equityCapitalisation / 1e9, locale, 1)}
              area={capHistory.slice(-60).map((pt) => pt.value)}
              rows={equities.slice(0, 5).map((e) => ({ slug: e.slug, name: e.shortName, sector: e.sector, price: formatNumber(e.closePrice, locale), change: e.change, spark: sparks[e.slug].slice(-20).map((pt) => pt.value) }))}
            />
          </Reveal>
        </div>
      </section>

      {/* PARTNERS */}
      <section aria-labelledby="partners-title" className="relative border-b border-line bg-surface py-20">
        <div className="container-site">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow">{t.partnersEyebrow}</p>
            <h2 id="partners-title" className="text-h2 mt-3">{t.partners}</h2>
          </div>
          <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNERS.map((partner) => (
              <StaggerItem as="li" key={partner.name}>
                <a href={partner.href} target="_blank" rel="noopener noreferrer" className="card-lift group flex h-full flex-col items-center rounded-[var(--radius-card)] border border-line bg-background p-7 text-center">
                  <span className="flex h-28 w-full items-center justify-center rounded-2xl bg-white p-3 dark:bg-white/95">
                    {partner.logo ? (
                      <Image src={partner.logo} alt={`Logo ${partner.name}`} width={240} height={200} className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="relative flex size-20 items-center justify-center rounded-full border border-brand-gold/40 bg-surface">
                        <span className="absolute inset-1.5 rounded-full border border-dashed border-brand-gold/40" />
                        <span className="font-serif-display text-lg text-heading">{partner.name}</span>
                      </span>
                    )}
                  </span>
                  <span className="mt-5 font-medium text-heading">{partner.name}</span>
                  <span className="mt-1.5 text-xs leading-relaxed text-muted">{partner.desc}</span>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-link opacity-0 transition-opacity group-hover:opacity-100">{t.partnersVisit}<ArrowUpRight aria-hidden="true" className="size-3.5" /></span>
                  <span className="sr-only">{dict.a11y.external}</span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

// Smooth gold area chart that draws itself in (decorative; values in the card text).
function MiniArea({ points, id }: { points: number[]; id: string }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const xy = points.map((v, i) => [(i / (points.length - 1)) * 600, 104 - ((v - min) / (max - min || 1)) * 88] as const);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 600 112" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a23a" stopOpacity="0.32" />
          <stop offset="1" stopColor="#c9a23a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L600 112 L0 112 Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="var(--chart-price)" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength={1} className="animate-draw" />
    </svg>
  );
}
