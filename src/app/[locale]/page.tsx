import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  FileDown,
  GraduationCap,
  LineChart,
  PieChart,
  QrCode,
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
import { Logo } from "@/components/layout/Logo";
import { HeroMarketCard } from "@/components/home/HeroMarketCard";
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
    figures: ["Capitalisation actions (Md FCFA)", "Encours obligataire (Md FCFA)", "Lignes d’actions", "Lignes obligataires", "Sociétés de bourse", "Pays membres"],
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
  },
  en: {
    eyebrow: "Regional financial market · CEMAC",
    titleA: "The stock exchange",
    titleB: "of Central Africa",
    subtitle: "Official prices, market notices and listed companies from Cameroon, the Central African Republic, Congo, Gabon, Equatorial Guinea and Chad.",
    ctaA: "See prices",
    ctaB: "How to invest",
    figures: ["Equity capitalisation (FCFA bn)", "Bonds outstanding (FCFA bn)", "Listed shares", "Listed bonds", "Licensed brokers", "Member countries"],
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
  },
  es: {
    eyebrow: "Mercado financiero regional · CEMAC",
    titleA: "La bolsa de los seis países",
    titleB: "de África Central",
    subtitle: "Cotizaciones oficiales, avisos del mercado y sociedades cotizadas de Camerún, Centroáfrica, Congo, Gabón, Guinea Ecuatorial y Chad.",
    ctaA: "Ver cotizaciones",
    ctaB: "Cómo invertir",
    figures: ["Capitalización acciones (mil M FCFA)", "Saldo obligacionista (mil M FCFA)", "Acciones cotizadas", "Obligaciones cotizadas", "Sociedades de bolsa", "Países miembros"],
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
  },
};

const personaIcons = [TrendingUp, Briefcase, LineChart, GraduationCap];
const personaImages = ["/photos/ceremony-audience.webp", "/photos/ceremony-speech.webp", null, "/photos/school-students.webp"];

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
  const heroRows = equities.slice().sort((a, b) => b.closePrice * (b.qtyTraded + 1) - a.closePrice * (a.qtyTraded + 1)).slice(0, 4);
  const marketNews = news.filter((n) => n.category !== "Recrutement");

  const figures = [
    { value: summary.equityCapitalisation, kind: "billions" as const },
    { value: summary.bondOutstanding, kind: "billions" as const },
    { value: KEY_FIGURES.listedEquities, kind: "number" as const },
    { value: KEY_FIGURES.listedBonds, kind: "number" as const },
    { value: KEY_FIGURES.brokers, kind: "number" as const },
    { value: KEY_FIGURES.countries, kind: "number" as const },
  ];

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-title" className="grain relative isolate overflow-hidden bg-espresso text-brand-sand">
        <Image src="/photos/bvmac-building.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[70%_40%] opacity-[0.18]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_20%,rgb(201_162_58/0.18),transparent_55%),linear-gradient(180deg,rgb(18_12_6/0.55),#120c06_92%)]" />
        <div aria-hidden="true" className="animate-orb absolute -left-40 top-24 -z-10 size-[520px] rounded-full bg-brand-gold/20 blur-[120px]" />
        <div aria-hidden="true" className="animate-orb absolute -right-32 bottom-0 -z-10 size-[460px] rounded-full bg-[#7a4f12]/40 blur-[120px] [animation-delay:-8s]" />
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10" />

        <div className="container-site grid gap-14 pb-16 pt-32 md:pt-40 lg:min-h-[92vh] lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:pb-24">
          <div>
            <Reveal y={12} className="flex flex-wrap items-center gap-3">
              <SessionChip className="bg-white/10! text-brand-ivory!" />
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
            lines={KEY_FIGURES.listedEquities + KEY_FIGURES.listedBonds}
            rows={heroRows.map(({ slug, shortName, sector, closePrice, change }) => ({ slug, shortName, sector, closePrice, change }))}
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
      <section aria-label={t.figures.join(", ")} className="border-b border-line bg-surface">
        <Stagger as="dl" className="container-site grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-6">
          {figures.map((f, i) => (
            <StaggerItem key={i} className="px-2 py-10 md:px-5">
              <dd className="font-serif-display text-4xl text-heading md:text-[2.75rem]">
                <CountUp value={f.value} kind={f.kind} />
              </dd>
              <dt className="mt-2 text-sm text-muted">{t.figures[i]}</dt>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* PERSONAS — bento */}
      <Section labelledBy="do-title">
        <SectionHeading id="do-title" overline={t.doEyebrow} title={t.doTitle} />
        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {t.personas.map((persona, i) => {
            const Icon = personaIcons[i];
            const img = personaImages[i];
            const span = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"][i];
            return (
              <StaggerItem key={persona.title} className={span}>
                <Link
                  href={p(persona.href)}
                  className={`group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-[var(--radius-panel)] border p-7 transition-[border-color] duration-500 md:p-9 ${img ? "border-transparent bg-espresso text-brand-sand" : "border-line bg-surface hover:border-line-strong"}`}
                >
                  {img && (
                    <>
                      <Image src={img} alt="" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover opacity-55 transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
                      <span className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/60 to-espresso/10" />
                    </>
                  )}
                  <span className={`absolute right-7 top-7 flex size-12 items-center justify-center rounded-full border transition-colors md:right-9 md:top-9 ${img ? "border-white/20 text-brand-gold-light group-hover:bg-brand-gold group-hover:text-espresso" : "border-line text-accent-text group-hover:bg-action group-hover:text-action-text"}`}>
                    <ArrowUpRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                  <span className="relative">
                    <Icon aria-hidden="true" className={`size-7 ${img ? "text-brand-gold-light" : "text-accent-text"}`} strokeWidth={1.5} />
                    <span className={`mt-5 block font-serif-display text-3xl md:text-4xl ${img ? "text-brand-ivory" : "text-heading"}`}>{persona.title}</span>
                    <span className={`mt-3 block max-w-md ${img ? "text-brand-sand/80" : "text-muted"}`}>{persona.text}</span>
                    <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium ${img ? "text-brand-gold-light" : "text-link"}`}>{persona.cta}</span>
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
                        <Flag code={e.country} className="h-3 w-[18px]" />
                        <span>
                          <span className="block font-medium text-heading group-hover:text-link">{e.shortName}</span>
                          <span className="block text-xs text-muted">{e.sector}</span>
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
      <section aria-labelledby="story-title" className="relative isolate overflow-hidden bg-espresso text-brand-sand">
        <ParallaxImage src="/photos/ceremony-podium.webp" alt="" className="absolute inset-0 -z-10 opacity-45" strength={80} />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-espresso via-espresso/85 to-espresso/20" />
        <div className="container-site grid min-h-[78vh] items-center py-24">
          <div className="max-w-2xl">
            <Reveal><p className="eyebrow text-brand-gold-light!">{t.storyEyebrow}</p></Reveal>
            <Reveal delay={0.1}>
              <h2 id="story-title" className="text-h1 mt-5 text-brand-ivory!">{t.storyTitle}</h2>
            </Reveal>
            <Reveal delay={0.2}><p className="mt-6 text-lg text-brand-sand/80">{t.storyText}</p></Reveal>
            <Stagger as="dl" className="mt-10 grid grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {t.storyStats.map(([value, label]) => (
                <StaggerItem key={label}>
                  <dd className="font-serif-display text-2xl text-brand-ivory md:text-3xl">{value}</dd>
                  <dt className="mt-1 text-sm text-brand-sand/65">{label}</dt>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.3} className="mt-10">
              <ButtonLink href={p("/marches/actions/bgfi-holding")} variant="gold">
                {t.storyCta} <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </Reveal>
          </div>
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)] md:aspect-[5/5]">
              <Image src="/photos/school-students-2.webp" alt="" fill sizes="(min-width:1024px) 600px, 100vw" className="object-cover" />
            </div>
            <div className="glass absolute -bottom-6 left-6 right-6 rounded-[var(--radius-card)] border border-line p-5 shadow-soft md:left-auto md:w-72">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">Parcours</p>
              <p className="mt-1 font-medium text-heading">Comprendre la bourse</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-alt">
                <div className="h-full w-2/3 rounded-full bg-brand-gold" />
              </div>
              <p className="mt-2 text-xs text-muted">2 / 3 · 4 min</p>
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
      <section aria-labelledby="app-title" className="relative overflow-hidden bg-espresso-2 text-brand-sand">
        <div aria-hidden="true" className="animate-orb absolute -left-20 top-0 size-[420px] rounded-full bg-brand-gold/15 blur-[110px]" />
        <div className="container-site relative grid items-center gap-14 py-24 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal><p className="eyebrow text-brand-gold-light!">{t.appEyebrow}</p></Reveal>
            <Reveal delay={0.1}><h2 id="app-title" className="text-h1 mt-5 text-brand-ivory!">{t.appTitle}</h2></Reveal>
            <Reveal delay={0.15}><p className="mt-6 max-w-lg text-lg text-brand-sand/80">{t.appText}</p></Reveal>
            <Stagger as="ul" className="mt-8 flex flex-wrap gap-2">
              {t.appPoints.map((point) => (
                <StaggerItem key={point} as="li" className="rounded-full border border-white/15 px-4 py-2 text-sm text-brand-ivory">{point}</StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink href={CONTACT.playStore} variant="gold" external>Google Play</ButtonLink>
              <span className="inline-flex h-12 items-center rounded-full border border-dashed border-white/25 px-6 text-sm text-brand-sand/70">App Store</span>
              <span className="flex items-center gap-3 text-sm text-brand-sand/70">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-ivory text-espresso" aria-hidden="true">
                  <QrCode className="size-10" strokeWidth={1.25} />
                </span>
                {t.qr}
              </span>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="mx-auto">
            <PhoneMockup locale={locale} rows={equities.slice(0, 5).map((e) => ({ name: e.shortName, price: formatNumber(e.closePrice, locale), change: e.change }))} />
          </Reveal>
        </div>
      </section>

      {/* PARTNERS */}
      <section aria-labelledby="partners-title" className="border-b border-line bg-surface py-14">
        <div className="container-site">
          <h2 id="partners-title" className="text-center text-sm uppercase tracking-[0.14em] text-muted">{t.partners}</h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {PARTNERS.map((partner) => (
              <li key={partner.name}>
                <a href={partner.href} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col items-center justify-center rounded-2xl px-4 py-6 text-center transition-colors hover:bg-surface-alt">
                  <span className="font-serif-display text-3xl text-heading">{partner.name}</span>
                  <span className="mt-2 text-xs text-muted">{partner.desc}</span>
                  <span className="sr-only">{dict.a11y.external}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function PhoneMockup({ rows, locale }: { rows: { name: string; price: string; change: number }[]; locale: "fr" | "en" | "es" }) {
  return (
    <div aria-hidden="true" className="relative w-[280px] rotate-[-4deg] rounded-[44px] border-[10px] border-[#05030a] bg-[#05030a] shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)] transition-transform duration-700 hover:rotate-0">
      <div className="overflow-hidden rounded-[34px] bg-[#fbf9f5] p-5 text-[#1a140e]">
        <div className="mx-auto mb-4 h-5 w-24 rounded-full bg-[#05030a]" />
        <div className="flex items-center justify-between">
          <span className="font-serif-display text-2xl">Marchés</span>
          <Logo variant="medal" className="size-8" alt="" />
        </div>
        <div className="mt-4 rounded-2xl bg-[#1c130b] p-4 text-[#efe6d4]">
          <p className="text-[10px] uppercase tracking-wider opacity-70">Capitalisation</p>
          <p className="font-serif-display text-2xl text-[#fbf6ea]">1 795,9 Md</p>
          <svg viewBox="0 0 100 24" className="mt-2 h-8 w-full"><path d="M0 18 L12 15 L22 16 L34 10 L46 12 L58 7 L70 9 L82 5 L100 6" fill="none" stroke="#ead18a" strokeWidth="1.5" /></svg>
        </div>
        <ul className="mt-3 divide-y divide-[#e8e0d0] text-xs">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center justify-between py-2.5">
              <span className="font-medium">{r.name}</span>
              <span className="flex items-center gap-2">
                <span className="figure">{r.price}</span>
                <PriceChange value={r.change} locale={locale} className="text-[10px]" />
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-4 border-t border-[#e8e0d0] pt-3 text-center text-[9px] text-[#6b6155]">
          {["Marchés", "Favoris", "Avis", "École"].map((tab, i) => (
            <span key={tab} className={i === 0 ? "font-semibold text-[#1c130b]" : ""}>{tab}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
