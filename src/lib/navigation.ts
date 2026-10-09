import type { Dictionary } from "@/i18n";

export type NavItemKey = keyof Dictionary["nav"]["items"];
export type NavGroupKey = "markets" | "invest" | "issuers" | "learn" | "news" | "about";

export type NavItem = { key: NavItemKey; href: string; icon: string };
export type NavGroup = {
  key: NavGroupKey;
  href: string;
  items: NavItem[];
  feature: { image: string; href: string; title: Record<"fr" | "en" | "es", string>; text: Record<"fr" | "en" | "es", string> };
};

// Six top-level sections. Single source of truth for the header, footer,
// breadcrumbs and site map. Icons are lucide-react component names.
export const NAV: NavGroup[] = [
  {
    key: "markets",
    href: "/marches",
    items: [
      { key: "session", href: "/marches", icon: "Activity" },
      { key: "equities", href: "/marches/actions", icon: "LineChart" },
      { key: "bonds", href: "/marches/obligations", icon: "Landmark" },
      { key: "capitalisation", href: "/marches/capitalisation", icon: "BarChart3" },
      { key: "boc", href: "/marches/boc", icon: "FileText" },
      { key: "agenda", href: "/marches/agenda", icon: "CalendarDays" },
      { key: "hours", href: "/marches/calendrier-horaires", icon: "Clock" },
    ],
    feature: {
      image: "/photos/ceremony-trading-floor.webp",
      href: "/marches/boc",
      title: { fr: "Bulletin Officiel de la Cote", en: "Official Price Bulletin", es: "Boletín Oficial de Cotización" },
      text: { fr: "Cours, volumes et capitalisation publiés après chaque séance.", en: "Prices, volumes and capitalisation after every session.", es: "Cotizaciones, volúmenes y capitalización tras cada sesión." },
    },
  },
  {
    key: "invest",
    href: "/investisseurs/comment-investir",
    items: [
      { key: "howTo", href: "/investisseurs/comment-investir", icon: "Compass" },
      { key: "brokers", href: "/participants/societes-de-bourse", icon: "Building2" },
      { key: "products", href: "/investisseurs/produits-boursiers", icon: "Layers" },
      { key: "protection", href: "/investisseurs/protection", icon: "ShieldCheck" },
      { key: "fees", href: "/investisseurs/commissions", icon: "Receipt" },
      { key: "tax", href: "/investisseurs/fiscalite", icon: "Percent" },
      { key: "depositary", href: "/participants/depositaire", icon: "Vault" },
      { key: "regulator", href: "/participants/regulateur", icon: "Scale" },
    ],
    feature: {
      image: "/photos/ceremony-audience.webp",
      href: "/participants/societes-de-bourse",
      title: { fr: "25 sociétés de bourse agréées", en: "25 licensed brokers", es: "25 sociedades de bolsa autorizadas" },
      text: { fr: "Trouvez un intermédiaire dans votre pays pour passer vos ordres.", en: "Find an intermediary in your country to place your orders.", es: "Encuentre un intermediario en su país para dar sus órdenes." },
    },
  },
  {
    key: "issuers",
    href: "/emetteurs/societes-cotees",
    items: [
      { key: "listed", href: "/emetteurs/societes-cotees", icon: "Briefcase" },
      { key: "ipo", href: "/emetteurs/s-introduire-en-bourse", icon: "Rocket" },
      { key: "admission", href: "/emetteurs/conditions-d-admission", icon: "ListChecks" },
      { key: "eligibility", href: "/emetteurs/test-d-eligibilite", icon: "Gauge" },
      { key: "fees", href: "/emetteurs/commissions", icon: "Receipt" },
      { key: "tax", href: "/emetteurs/fiscalite", icon: "Percent" },
    ],
    feature: {
      image: "/photos/ceremony-speech.webp",
      href: "/emetteurs/s-introduire-en-bourse",
      title: { fr: "Lever des fonds en bourse", en: "Raise capital on the exchange", es: "Captar fondos en bolsa" },
      text: { fr: "Actions ou obligations : les étapes, de la préparation à la première cotation.", en: "Shares or bonds: the steps from preparation to first listing.", es: "Acciones u obligaciones: las etapas hasta la primera cotización." },
    },
  },
  {
    key: "learn",
    href: "/ecole-de-bourse",
    items: [
      { key: "paths", href: "/ecole-de-bourse", icon: "GraduationCap" },
      { key: "glossary", href: "/ecole-de-bourse/glossaire", icon: "BookA" },
      { key: "portfolio", href: "/ecole-de-bourse/portefeuille-virtuel", icon: "PieChart" },
    ],
    feature: {
      image: "/photos/school-students.webp",
      href: "/ecole-de-bourse",
      title: { fr: "École de bourse", en: "Stock Market School", es: "Escuela de bolsa" },
      text: { fr: "Leçons de 5 minutes, quiz et portefeuille virtuel, gratuitement.", en: "5-minute lessons, quizzes and a virtual portfolio, free.", es: "Lecciones de 5 minutos, cuestionarios y cartera virtual, gratis." },
    },
  },
  {
    key: "news",
    href: "/avis-et-communiques",
    items: [
      { key: "notices", href: "/avis-et-communiques", icon: "Megaphone" },
      { key: "newsList", href: "/actualites", icon: "Newspaper" },
      { key: "tv", href: "/actualites/bvmac-tv", icon: "PlayCircle" },
      { key: "photos", href: "/actualites/phototheque", icon: "Images" },
      { key: "pressRoom", href: "/actualites/espace-presse", icon: "Mic" },
      { key: "regulation", href: "/documentation", icon: "ScrollText" },
      { key: "reports", href: "/documentation/rapports", icon: "FileBarChart" },
      { key: "tariffs", href: "/documentation/tarifs", icon: "Tags" },
      { key: "economic", href: "/documentation/donnees-economiques", icon: "Globe2" },
    ],
    feature: {
      image: "/photos/ceremony-podium.webp",
      href: "/avis-et-communiques",
      title: { fr: "Avis et communiqués", en: "Notices and releases", es: "Avisos y comunicados" },
      text: { fr: "Toutes les publications officielles, filtrables par émetteur et par type.", en: "All official publications, filterable by issuer and type.", es: "Todas las publicaciones oficiales, filtrables por emisor y tipo." },
    },
  },
  {
    key: "about",
    href: "/la-bvmac",
    items: [
      { key: "presentation", href: "/la-bvmac", icon: "Info" },
      { key: "history", href: "/la-bvmac/histoire", icon: "History" },
      { key: "organisation", href: "/la-bvmac/organisation-du-marche", icon: "Network" },
      { key: "governance", href: "/la-bvmac/gouvernance", icon: "Users" },
      { key: "orgchart", href: "/la-bvmac/organigramme", icon: "Workflow" },
      { key: "shareholding", href: "/la-bvmac/actionnariat", icon: "PieChart" },
      { key: "services", href: "/la-bvmac/produits-et-services", icon: "Boxes" },
      { key: "tenders", href: "/la-bvmac/appels-d-offres", icon: "FileSignature" },
    ],
    feature: {
      image: "/photos/bvmac-building.webp",
      href: "/la-bvmac",
      title: { fr: "L’entreprise de marché de la CEMAC", en: "The CEMAC market operator", es: "La empresa de mercado de la CEMAC" },
      text: { fr: "Mission, gouvernance et organisation du marché financier régional.", en: "Mission, governance and organisation of the regional market.", es: "Misión, gobernanza y organización del mercado regional." },
    },
  },
];

export const COUNTRIES = [
  { code: "CM", slug: "cameroun", fr: "Cameroun", en: "Cameroon", es: "Camerún" },
  { code: "CF", slug: "centrafrique", fr: "Centrafrique", en: "Central African Rep.", es: "Centroáfrica" },
  { code: "CG", slug: "congo", fr: "Congo", en: "Congo", es: "Congo" },
  { code: "GA", slug: "gabon", fr: "Gabon", en: "Gabon", es: "Gabón" },
  { code: "GQ", slug: "guinee-equatoriale", fr: "Guinée équatoriale", en: "Equatorial Guinea", es: "Guinea Ecuatorial" },
  { code: "TD", slug: "tchad", fr: "Tchad", en: "Chad", es: "Chad" },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];

export const PARTNERS = [
  { name: "CEMAC", href: "https://www.cemac.int/", desc: "Communauté Économique et Monétaire de l'Afrique Centrale" },
  { name: "COSUMAF", href: "https://cosumaf.org/", desc: "Commission de Surveillance du Marché Financier de l'Afrique Centrale" },
  { name: "BEAC", href: "https://www.beac.int/", desc: "Banque des États de l'Afrique Centrale" },
  { name: "COBAC", href: "https://www.sgcobac.org/", desc: "Commission Bancaire de l'Afrique Centrale" },
];

export const CONTACT = {
  address: ["B.P. 442 Douala, Cameroun", "Immeuble de la Bourse"],
  phone: "+237 233 43 85 83",
  phoneHref: "tel:+237233438583",
  fax: "+237 233 43 85 85",
  email: "bvmac@bvmac.cm",
  social: {
    facebook: "https://www.facebook.com/LaBVMAC/",
    x: "https://twitter.com/BourseBVMAC",
    linkedin: "https://www.linkedin.com/company/bvmac-bourse/",
    youtube: "https://www.youtube.com/@BourseBVMAC",
  },
  playStore: "https://play.google.com/store/apps/details?id=io.osbvmac.projm",
};
