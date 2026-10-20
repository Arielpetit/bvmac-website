import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Building2, Coins, FileText, LineChart, CirclePlus, Scale, Vote, Wallet } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Accordion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/comment-investir">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.howTo);
}

const ICONS = [BookOpen, Building2, Wallet, Scale, LineChart];
const LINKS = ["/ecole-de-bourse", "/participants/societes-de-bourse", "/investisseurs/commissions", "/marches/calendrier-horaires", "/marches/actions"];

const T = {
  fr: {
    intro: "Investir en bourse en Afrique centrale, étape par étape : de la découverte du marché au suivi de vos titres.",
    roadmapEyebrow: "Votre parcours",
    roadmapTitle: "Cinq étapes pour investir",
    roadmapText: "Suivez les étapes dans l’ordre. Chacune renvoie à la page qui vous aide à la réaliser.",
    step: "Étape",
    steps: [
      { title: "Comprendre le marché", text: "Découvrez comment fonctionnent les actions et les obligations, et comment lire le Bulletin Officiel de la Cote. L’École de bourse propose des leçons courtes et gratuites.", items: ["Actions et obligations", "Risques et horizon de placement", "Lecture du BOC"], link: "Aller à l’École de bourse" },
      { title: "Choisir une société de bourse", text: "Seules les sociétés de bourse agréées par la COSUMAF peuvent transmettre vos ordres. Choisissez-en une dans votre pays ou ailleurs dans la CEMAC.", items: ["Agrément COSUMAF", "Services proposés", "Proximité et contact"], link: "Voir l’annuaire des sociétés de bourse" },
      { title: "Ouvrir un compte titres", text: "La société de bourse ouvre à votre nom un compte pour vos titres et un compte pour vos fonds. Elle vous remet ses conditions et ses tarifs.", items: ["Pièce d’identité", "Justificatif de domicile", "Relevé d’identité bancaire"], link: "Comprendre les frais" },
      { title: "Passer vos ordres", text: "Indiquez le titre, la quantité et le prix limite. Votre société de bourse transmet l’ordre, exécuté pendant une séance de cotation.", items: ["Titre et quantité", "Prix limite", "Durée de validité"], link: "Voir les horaires de séance" },
      { title: "Suivre vos placements", text: "Suivez les cours, le Bulletin Officiel de la Cote et les avis du marché. En tant qu’actionnaire, vous recevez les dividendes et votez en assemblée générale.", items: ["Cours et BOC", "Dividendes", "Assemblées générales"], link: "Suivre les cours" },
    ],
    rightsEyebrow: "Être actionnaire",
    rightsTitle: "Vos droits d’actionnaire",
    rightsIntro: "Une action fait de vous copropriétaire de la société. Elle vous donne quatre droits essentiels.",
    rights: [
      ["Dividendes", "Vous recevez votre part des bénéfices distribués, au montant voté en assemblée générale et payé via votre teneur de compte."],
      ["Droit de vote", "Vous votez en assemblée générale sur les comptes, la distribution des bénéfices et l’élection des administrateurs."],
      ["Information", "La société publie ses rapports annuels, ses états financiers et ses avis ; la BVMAC les relaie dans les avis et communiqués."],
      ["Droit préférentiel", "Lors d’une augmentation de capital, vous pouvez souscrire en priorité aux nouvelles actions pour garder votre part."],
    ],
    protection: "Protection des investisseurs",
    simEyebrow: "Sans risque",
    simTitle: "Entraînez-vous avec le portefeuille virtuel",
    simText: "5 millions de FCFA fictifs pour tester vos idées sur les vrais cours de la BVMAC.",
    simCta: "Essayer le simulateur",
    faqTitle: "Questions fréquentes",
    faq: [
      { q: "Qui peut investir à la BVMAC ?", a: "Les particuliers comme les personnes morales : banques, compagnies d’assurance, caisses de retraite, fonds. Chaque investisseur a ses propres objectifs d’horizon et de rendement." },
      { q: "Puis-je acheter des actions directement auprès de la BVMAC ?", a: "Non. Les ordres passent obligatoirement par une société de bourse agréée. La BVMAC organise le marché mais ne reçoit pas d’ordres du public." },
      { q: "Faut-il habiter le pays où la société est cotée ?", a: "Non. Le marché est régional : un résident de l’un des six pays de la CEMAC peut acheter des titres de toutes les sociétés cotées à la BVMAC." },
      { q: "Combien faut-il pour commencer ?", a: "Il n’y a pas de minimum fixé par la BVMAC. Le minimum pratique dépend du prix d’une action et des conditions de votre société de bourse." },
      { q: "Quels documents pour ouvrir un compte ?", a: "En général une pièce d’identité, un justificatif de domicile et un relevé d’identité bancaire. Votre société de bourse vous donnera la liste exacte." },
      { q: "Quand le marché est-il ouvert ?", a: "Les séances de cotation ont lieu chaque jour ouvré selon le calendrier publié par la BVMAC. Consultez la page Calendrier et horaires." },
      { q: "Que devient un actionnaire ?", a: "L’acheteur d’une action devient actionnaire : il peut recevoir des dividendes et voter en assemblée générale." },
      { q: "Où trouver les cours ?", a: "Dans la rubrique Marchés de ce site, dans le Bulletin Officiel de la Cote publié après chaque séance et dans l’application BVMAC." },
      { q: "Mes titres sont-ils en sécurité si ma société de bourse fait faillite ?", a: "Les titres sont inscrits auprès du dépositaire central, séparément des avoirs de l’intermédiaire. Ils restent votre propriété." },
      { q: "Comment déposer une réclamation ?", a: "Adressez-vous d’abord à votre société de bourse. Vous pouvez ensuite utiliser le formulaire de réclamation de la BVMAC ou saisir la COSUMAF." },
    ],
  },
  en: {
    intro: "Investing on the Central African stock exchange, step by step: from discovering the market to following your securities.",
    roadmapEyebrow: "Your path",
    roadmapTitle: "Five steps to invest",
    roadmapText: "Follow the steps in order. Each one links to the page that helps you complete it.",
    step: "Step",
    steps: [
      { title: "Understand the market", text: "Learn how shares and bonds work, and how to read the Official Price Bulletin. The Stock Market School offers short, free lessons.", items: ["Shares and bonds", "Risk and time horizon", "Reading the BOC"], link: "Go to the Stock Market School" },
      { title: "Choose a broker", text: "Only brokers (sociétés de bourse) licensed by COSUMAF can pass on your orders. Choose one in your country or elsewhere in the CEMAC.", items: ["COSUMAF licence", "Services offered", "Location and contact"], link: "See the broker directory" },
      { title: "Open a securities account", text: "The broker opens a securities account and a cash account in your name. It gives you its terms and fees.", items: ["Identity document", "Proof of address", "Bank details"], link: "Understand the fees" },
      { title: "Place your orders", text: "State the security, the quantity and the limit price. Your broker passes on the order, which is executed during a trading session.", items: ["Security and quantity", "Limit price", "Validity period"], link: "See trading hours" },
      { title: "Follow your investments", text: "Follow prices, the Official Price Bulletin and market notices. As a shareholder, you receive dividends and vote at general meetings.", items: ["Prices and BOC", "Dividends", "General meetings"], link: "Follow prices" },
    ],
    rightsEyebrow: "Being a shareholder",
    rightsTitle: "Your rights as a shareholder",
    rightsIntro: "A share makes you a co-owner of the company. It gives you four essential rights.",
    rights: [
      ["Dividends", "You receive your share of the profits paid out, at the amount voted at the general meeting and paid through your account keeper."],
      ["Voting rights", "You vote at the general meeting on the accounts, the profit distribution and the election of directors."],
      ["Information", "The company publishes its annual reports, financial statements and notices; the BVMAC relays them in its notices and releases."],
      ["Preferential right", "In a capital increase, you can subscribe to the new shares first, so you keep your share of the company."],
    ],
    protection: "Investor protection",
    simEyebrow: "Risk-free",
    simTitle: "Practise with the virtual portfolio",
    simText: "5 million virtual FCFA to test your ideas on real BVMAC prices.",
    simCta: "Try the simulator",
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Who can invest on the BVMAC?", a: "Individuals and legal entities alike: banks, insurers, pension funds, investment funds. Each investor has their own time horizon and return objectives." },
      { q: "Can I buy shares directly from the BVMAC?", a: "No. Orders must go through a licensed broker. The BVMAC runs the market but does not take orders from the public." },
      { q: "Do I need to live in the country where the company is listed?", a: "No. The market is regional: a resident of any of the six CEMAC countries can buy securities of every company listed on the BVMAC." },
      { q: "How much do I need to start?", a: "The BVMAC sets no minimum. In practice, the minimum depends on the price of one share and on your broker’s terms." },
      { q: "Which documents do I need to open an account?", a: "Usually an identity document, proof of address and bank details. Your broker will give you the exact list." },
      { q: "When is the market open?", a: "Trading sessions take place every business day according to the calendar published by the BVMAC. See the Calendar and trading hours page." },
      { q: "What does being a shareholder mean?", a: "The buyer of a share becomes a shareholder: they can receive dividends and vote at the general meeting." },
      { q: "Where can I find prices?", a: "In the Markets section of this site, in the Official Price Bulletin published after each session, and in the BVMAC app." },
      { q: "Are my securities safe if my broker goes bankrupt?", a: "Securities are registered with the central depository, separately from the intermediary’s own assets. They remain your property." },
      { q: "How do I file a complaint?", a: "Contact your broker first. You can then use the BVMAC complaint form or refer the matter to COSUMAF." },
    ],
  },
  es: {
    intro: "Invertir en la bolsa de África Central, paso a paso: desde descubrir el mercado hasta seguir sus valores.",
    roadmapEyebrow: "Su recorrido",
    roadmapTitle: "Cinco pasos para invertir",
    roadmapText: "Siga los pasos en orden. Cada uno remite a la página que le ayuda a realizarlo.",
    step: "Paso",
    steps: [
      { title: "Comprender el mercado", text: "Descubra cómo funcionan las acciones y las obligaciones, y cómo leer el Boletín Oficial de Cotización. La Escuela de Bolsa ofrece lecciones cortas y gratuitas.", items: ["Acciones y obligaciones", "Riesgo y horizonte de inversión", "Lectura del BOC"], link: "Ir a la Escuela de Bolsa" },
      { title: "Elegir una sociedad de bolsa", text: "Solo las sociedades de bolsa autorizadas por la COSUMAF pueden transmitir sus órdenes. Elija una en su país o en otro lugar de la CEMAC.", items: ["Autorización COSUMAF", "Servicios ofrecidos", "Proximidad y contacto"], link: "Ver el directorio de sociedades de bolsa" },
      { title: "Abrir una cuenta de valores", text: "La sociedad de bolsa abre a su nombre una cuenta de valores y una cuenta de efectivo. Le entrega sus condiciones y tarifas.", items: ["Documento de identidad", "Justificante de domicilio", "Datos bancarios"], link: "Entender las comisiones" },
      { title: "Dar sus órdenes", text: "Indique el valor, la cantidad y el precio límite. Su sociedad de bolsa transmite la orden, que se ejecuta durante una sesión de cotización.", items: ["Valor y cantidad", "Precio límite", "Plazo de validez"], link: "Ver los horarios de sesión" },
      { title: "Seguir sus inversiones", text: "Siga las cotizaciones, el Boletín Oficial de Cotización y los avisos del mercado. Como accionista, cobra dividendos y vota en la junta general.", items: ["Cotizaciones y BOC", "Dividendos", "Juntas generales"], link: "Seguir las cotizaciones" },
    ],
    rightsEyebrow: "Ser accionista",
    rightsTitle: "Sus derechos como accionista",
    rightsIntro: "Una acción le convierte en copropietario de la sociedad. Le da cuatro derechos esenciales.",
    rights: [
      ["Dividendos", "Recibe su parte de los beneficios repartidos, por el importe votado en junta general y pagado a través de su depositario."],
      ["Derecho de voto", "Vota en junta general sobre las cuentas, el reparto de beneficios y la elección de los administradores."],
      ["Información", "La sociedad publica sus informes anuales, estados financieros y avisos; la BVMAC los difunde en sus avisos y comunicados."],
      ["Derecho preferente", "En una ampliación de capital, puede suscribir primero las nuevas acciones para mantener su participación."],
    ],
    protection: "Protección de los inversores",
    simEyebrow: "Sin riesgo",
    simTitle: "Practique con la cartera virtual",
    simText: "5 millones de FCFA ficticios para probar sus ideas con las cotizaciones reales de la BVMAC.",
    simCta: "Probar el simulador",
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Quién puede invertir en la BVMAC?", a: "Tanto particulares como personas jurídicas: bancos, aseguradoras, fondos de pensiones, fondos de inversión. Cada inversor tiene sus propios objetivos de plazo y rentabilidad." },
      { q: "¿Puedo comprar acciones directamente a la BVMAC?", a: "No. Las órdenes pasan obligatoriamente por una sociedad de bolsa autorizada. La BVMAC organiza el mercado pero no recibe órdenes del público." },
      { q: "¿Tengo que vivir en el país donde cotiza la empresa?", a: "No. El mercado es regional: un residente de cualquiera de los seis países de la CEMAC puede comprar valores de todas las empresas que cotizan en la BVMAC." },
      { q: "¿Cuánto necesito para empezar?", a: "La BVMAC no fija ningún mínimo. En la práctica, depende del precio de una acción y de las condiciones de su sociedad de bolsa." },
      { q: "¿Qué documentos necesito para abrir una cuenta?", a: "Por lo general, un documento de identidad, un justificante de domicilio y los datos bancarios. Su sociedad de bolsa le dará la lista exacta." },
      { q: "¿Cuándo está abierto el mercado?", a: "Las sesiones de cotización se celebran cada día hábil según el calendario publicado por la BVMAC. Consulte la página Calendario y horarios." },
      { q: "¿Qué significa ser accionista?", a: "Quien compra una acción se convierte en accionista: puede cobrar dividendos y votar en la junta general." },
      { q: "¿Dónde encuentro las cotizaciones?", a: "En la sección Mercados de este sitio, en el Boletín Oficial de Cotización publicado tras cada sesión y en la aplicación BVMAC." },
      { q: "¿Están seguros mis valores si mi sociedad de bolsa quiebra?", a: "Los valores están inscritos en el depositario central, separados de los activos del intermediario. Siguen siendo de su propiedad." },
      { q: "¿Cómo presento una reclamación?", a: "Diríjase primero a su sociedad de bolsa. Después puede usar el formulario de reclamación de la BVMAC o acudir a la COSUMAF." },
    ],
  },
};

export default async function HowToPage({ params }: PageProps<"/[locale]/investisseurs/comment-investir">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const p = (path: string) => localePath(locale, path);
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.howTo} intro={t.intro}>
      <div className="grid gap-24">
        {/* Roadmap: numbered steps on a vertical line */}
        <section aria-labelledby="roadmap-title" className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{t.roadmapEyebrow}</p>
            <h2 id="roadmap-title" className="text-h2 mt-3">{t.roadmapTitle}</h2>
            <p className="mt-4 text-muted">{t.roadmapText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={p("/participants/societes-de-bourse")}>{dict.nav.items.findBroker}</ButtonLink>
              <ButtonLink href={p("/ecole-de-bourse")} variant="secondary">{dict.nav.school}</ButtonLink>
            </div>
          </Reveal>

          <Stagger as="ol" className="relative grid gap-6">
            <span aria-hidden="true" className="absolute bottom-8 left-6 top-8 w-px bg-line md:left-7" />
            {t.steps.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <StaggerItem as="li" key={s.title} className="relative grid grid-cols-[48px_1fr] gap-5 md:grid-cols-[56px_1fr] md:gap-7">
                  <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-espresso font-serif-display text-xl text-brand-gold-light ring-8 ring-background md:size-14 md:text-2xl">
                    {i + 1}
                  </span>
                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 md:p-7">
                    <div className="flex items-center justify-between gap-4">
                      <p className="eyebrow">{t.step} {i + 1}</p>
                      <Icon aria-hidden="true" className="size-5 text-accent-text" strokeWidth={1.6} />
                    </div>
                    <h3 className="text-h3 mt-2">{s.title}</h3>
                    <p className="mt-2 text-muted">{s.text}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {s.items.map((it) => (
                        <li key={it} className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-heading">{it}</li>
                      ))}
                    </ul>
                    <Link href={p(LINKS[i])} className="link mt-5 inline-flex items-center gap-1.5 text-sm">
                      {s.link}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        <section aria-labelledby="rights" className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">{t.rightsEyebrow}</p>
            <h2 id="rights" className="text-h2 mt-3">{t.rightsTitle}</h2>
            <p className="mt-4 max-w-sm text-muted">{t.rightsIntro}</p>
            <Link href={p("/investisseurs/protection")} className="link mt-6 inline-flex items-center gap-1 text-sm">{t.protection}<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          </Reveal>
          <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
            {t.rights.map(([title, text], i) => {
              const Icon = RIGHT_ICONS[i];
              return (
                <StaggerItem as="li" key={title} className="card-lift group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 md:p-7">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-gold transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent-text ring-1 ring-brand-gold/25"><Icon aria-hidden="true" className="size-[22px]" strokeWidth={1.5} /></span>
                    <span aria-hidden="true" className="figure font-serif-display text-2xl text-brand-gold/40">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-heading">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        <Reveal className="relative overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-10 text-brand-ivory md:p-14">
          <PriceLine />
          <div className="relative grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <p className="eyebrow text-brand-gold-light!">{t.simEyebrow}</p>
              <h2 className="font-serif-display mt-3 text-[clamp(1.6rem,3.4vw,2.8rem)] leading-tight text-brand-ivory">{t.simTitle}</h2>
              <p className="mt-3 text-brand-sand/75">{t.simText}</p>
            </div>
            <ButtonLink href={p("/ecole-de-bourse/portefeuille-virtuel")} variant="gold" className="md:justify-self-end">{t.simCta}</ButtonLink>
          </div>
        </Reveal>

        <Faq items={t.faq} title={t.faqTitle} />
      </div>
    </ContentPage>
  );
}

// Icons for the four shareholder rights, in the order of t.rights.
const RIGHT_ICONS = [Coins, Vote, FileText, CirclePlus];

// Decorative share-price chart for the simulator band: a fixed random walk with a mild
// upward trend, faint gridlines and a glowing last price, so it reads as a real market.
const SERIES = [48, 47.2, 48.1, 49.4, 48.6, 47.9, 49.8, 51.2, 50.4, 51.9, 51.1, 52.8, 54.1, 53.2, 52.6, 54.4, 56.1, 55.3, 56.8, 58.2, 57.1, 56.4, 58.9, 60.2, 59.4, 61.3, 62.8, 61.9, 63.6, 65.1];

function PriceLine() {
  const min = 44, max = 68, w = 600, h = 200;
  const x = (i: number) => (i / (SERIES.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / (max - min)) * h;
  const line = SERIES.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = SERIES.length - 1;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-10 right-10 hidden w-1/2 md:block">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="size-full [mask-image:linear-gradient(to_right,transparent,black_40%)]">
        <defs>
          <linearGradient id="sim-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#c9a23a" stopOpacity="0.28" />
            <stop offset="1" stopColor="#c9a23a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="#efe6d4" strokeOpacity="0.07" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={`${line} L${w},${h} L0,${h} Z`} fill="url(#sim-fill)" />
        <path d={line} fill="none" stroke="#d9b24a" strokeOpacity="0.85" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className="absolute right-0 size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-gold-light shadow-[0_0_0_6px_rgb(201_162_58/0.18)]" style={{ top: `${(y(SERIES[last]) / h) * 100}%` }}>
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-gold/60 motion-reduce:hidden" />
      </span>
    </div>
  );
}
