import type { B } from "./prefs";

// Admin content types. Field names are the database column names.
export type FieldType = "text" | "textarea" | "date" | "number" | "select" | "checkbox" | "file-url";
export type Field = {
  name: string;
  label: B;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: B;
  folder?: string;
  accept?: string;
  half?: boolean;
};
export type Values = Record<string, string | number | boolean | null>;
export type Resource = {
  key: string;
  table: string;
  label: B;
  singular: B;
  orderBy: string;
  ascending?: boolean;
  /** Short line under the title. */
  hint: B;
  /** Guide shown by the (i) button. */
  info: B[];
  columns: { name: string; label: B }[];
  fields: Field[];
  defaults: Values;
  derive?: (v: Values, isNew: boolean) => Values;
  /** Where the content appears on the public site. */
  publicPath?: string;
};

const opts = (...v: string[]) => v.map((x) => ({ value: x, label: x }));

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

const COUNTRIES = [
  { value: "", label: "—" },
  { value: "CM", label: "Cameroun" },
  { value: "CF", label: "Centrafrique" },
  { value: "CG", label: "Congo" },
  { value: "GA", label: "Gabon" },
  { value: "GQ", label: "Guinée équatoriale" },
  { value: "TD", label: "Tchad" },
];
const STATUS = [{ value: "NC", label: "NC – non coté" }, { value: "PEq", label: "PEq – prix d’équilibre" }, { value: "Suspendu", label: "Suspendu" }];
const published: Field = { name: "published", label: ["Publié sur le site", "Published on the site"], type: "checkbox" };
const position: Field = { name: "position", label: ["Ordre d’affichage", "Display order"], type: "number", half: true, help: ["0 en premier, puis 1, 2…", "0 first, then 1, 2…"] };
const COMMON_INFO: B[] = [
  ["« Publié » = visible sur le site. Décochez pour garder un brouillon.", "“Published” = visible on the site. Untick to keep a draft."],
  ["L’œil publie ou masque sans ouvrir la fiche ; le crayon modifie ; la corbeille supprime (administrateurs).", "The eye publishes or hides without opening the item; the pencil edits; the bin deletes (administrators)."],
  ["Les changements apparaissent sur le site en quelques minutes.", "Changes appear on the site within a few minutes."],
];

export const RESOURCES: Resource[] = [
  {
    key: "bulletins",
    table: "bulletins",
    label: ["Bulletins (BOC)", "Bulletins (BOC)"],
    singular: ["bulletin", "bulletin"],
    orderBy: "session_date",
    hint: ["Un bulletin officiel de la cote par séance.", "One official price bulletin per session."],
    info: [
      ["À faire après chaque séance : choisissez la date et déposez le PDF du BOC.", "After each session: pick the date and upload the BOC PDF."],
      ["Le numéro (BOC + JJMMAAAA) se remplit seul.", "The number (BOC + DDMMYYYY) fills in by itself."],
      ["Pensez à mettre à jour les cours dans « Actions » et « Synthèse de séance ».", "Remember to update prices in “Equities” and “Session summary”."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "session_date", label: ["Séance", "Session"] }, { name: "number", label: ["Numéro", "Number"] }],
    fields: [
      { name: "session_date", label: ["Date de la séance", "Session date"], type: "date", required: true, half: true },
      { name: "number", label: ["Numéro du bulletin", "Bulletin number"], type: "text", required: true, half: true },
      { name: "url", label: ["Fichier PDF du BOC", "BOC PDF file"], type: "file-url", required: true, folder: "boc", accept: "application/pdf" },
      published,
    ],
    defaults: { session_date: "", number: "", url: "", published: true },
    derive: (v) => {
      const d = String(v.session_date ?? "");
      return /^\d{4}-\d{2}-\d{2}$/.test(d) ? { ...v, number: `BOC${d.slice(8, 10)}${d.slice(5, 7)}${d.slice(0, 4)}` } : v;
    },
    publicPath: "/marches/boc",
  },
  {
    key: "equities",
    table: "equities",
    label: ["Actions (cours)", "Equities (prices)"],
    singular: ["action", "equity"],
    orderBy: "position",
    ascending: true,
    hint: ["Sociétés cotées : cours de la dernière séance et fiche de l’émetteur.", "Listed companies: last session prices and issuer profile."],
    info: [
      ["Après chaque séance, mettez à jour le cours de référence, le cours de clôture et les quantités de chaque valeur.", "After each session, update the reference price, closing price and quantities of each security."],
      ["La variation affichée sur le site est calculée automatiquement à partir des deux cours.", "The change shown on the site is computed automatically from the two prices."],
      ["La présentation, le siège et le dernier dividende alimentent la fiche de l’émetteur.", "The description, head office and last dividend feed the issuer profile."],
      ["N’ajoutez une valeur qu’après son admission à la cote.", "Add a security only after it is admitted to listing."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "close_price", label: ["Clôture", "Close"] }, { name: "short_name", label: ["Valeur", "Security"] }, { name: "sector", label: ["Secteur", "Sector"] }],
    fields: [
      { name: "short_name", label: ["Nom court", "Short name"], type: "text", required: true, half: true },
      { name: "ticker", label: ["Code (ticker)", "Ticker"], type: "text", required: true, half: true },
      { name: "name", label: ["Dénomination complète", "Full name"], type: "text", required: true },
      { name: "reference_price", label: ["Cours de référence (FCFA)", "Reference price (FCFA)"], type: "number", required: true, half: true },
      { name: "close_price", label: ["Cours de clôture (FCFA)", "Closing price (FCFA)"], type: "number", required: true, half: true },
      { name: "qty_demanded", label: ["Quantité demandée", "Quantity bid"], type: "number", half: true },
      { name: "qty_offered", label: ["Quantité offerte", "Quantity offered"], type: "number", half: true },
      { name: "qty_traded", label: ["Quantité transigée", "Quantity traded"], type: "number", half: true },
      { name: "status", label: ["Statut de cotation", "Quotation status"], type: "select", options: STATUS, half: true },
      { name: "isin", label: ["Code ISIN", "ISIN code"], type: "text", half: true },
      { name: "country", label: ["Pays", "Country"], type: "select", options: COUNTRIES, half: true },
      { name: "sector", label: ["Secteur", "Sector"], type: "text", half: true },
      { name: "compartment", label: ["Compartiment", "Compartment"], type: "text", half: true },
      { name: "nominal", label: ["Valeur nominale (FCFA)", "Nominal value (FCFA)"], type: "number", half: true },
      { name: "listed_on", label: ["Date d’admission", "Listing date"], type: "text", half: true, help: ["AAAA-MM-JJ, AAAA-MM ou AAAA.", "YYYY-MM-DD, YYYY-MM or YYYY."] },
      { name: "dividend_amount", label: ["Dernier dividende (FCFA)", "Last dividend (FCFA)"], type: "number", half: true },
      { name: "dividend_date", label: ["Date du dividende", "Dividend date"], type: "date", half: true },
      { name: "founded", label: ["Année de création", "Founded"], type: "text", half: true },
      { name: "headquarters", label: ["Siège", "Head office"], type: "text", half: true },
      { name: "bio", label: ["Présentation de la société", "Company description"], type: "textarea" },
      { name: "slug", label: ["Identifiant dans l’adresse", "Address identifier"], type: "text", half: true, help: ["Ne le changez pas après publication.", "Do not change it after publishing."] },
      position,
      published,
    ],
    defaults: { short_name: "", ticker: "", name: "", reference_price: 0, close_price: 0, qty_demanded: 0, qty_offered: 0, qty_traded: 0, status: "NC", isin: "", country: "CM", sector: "", compartment: "", nominal: null, listed_on: "", dividend_amount: 0, dividend_date: "", founded: "", headquarters: "", bio: "", slug: "", position: 0, published: true },
    derive: (v, isNew) => (isNew && !v.slug && v.short_name ? { ...v, slug: slugify(String(v.short_name)) } : v),
    publicPath: "/marches/actions",
  },
  {
    key: "bonds",
    table: "bonds",
    label: ["Obligations", "Bonds"],
    singular: ["obligation", "bond"],
    orderBy: "name",
    ascending: true,
    hint: ["Lignes obligataires cotées et leurs cours.", "Listed bond lines and their prices."],
    info: [
      ["Les cours s’expriment en pourcentage du nominal (100 = le pair).", "Prices are a percentage of nominal (100 = par)."],
      ["Mettez à jour cours, coupon couru et quantités après chaque séance.", "Update prices, accrued interest and quantities after each session."],
      ["À l’échéance ou à la radiation, dépubliez la ligne plutôt que de la supprimer.", "At maturity or delisting, unpublish the line rather than deleting it."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "close", label: ["Clôture %", "Close %"] }, { name: "name", label: ["Ligne", "Line"] }, { name: "issuer", label: ["Émetteur", "Issuer"] }],
    fields: [
      { name: "name", label: ["Libellé de la ligne", "Line name"], type: "text", required: true, half: true },
      { name: "isin", label: ["Code ISIN", "ISIN code"], type: "text", required: true, half: true },
      { name: "issuer", label: ["Émetteur", "Issuer"], type: "text", half: true },
      { name: "country", label: ["Pays", "Country"], type: "select", options: COUNTRIES, half: true },
      { name: "nominal", label: ["Nominal (FCFA)", "Nominal (FCFA)"], type: "number", half: true },
      { name: "status", label: ["Statut", "Status"], type: "select", options: STATUS, half: true },
      { name: "reference", label: ["Cours de référence (%)", "Reference price (%)"], type: "number", half: true },
      { name: "close", label: ["Cours de clôture (%)", "Closing price (%)"], type: "number", half: true },
      { name: "change", label: ["Variation (%)", "Change (%)"], type: "number", half: true },
      { name: "accrued", label: ["Coupon couru", "Accrued interest"], type: "number", half: true },
      { name: "qty_demanded", label: ["Quantité demandée", "Quantity bid"], type: "number", half: true },
      { name: "qty_offered", label: ["Quantité offerte", "Quantity offered"], type: "number", half: true },
      { name: "qty_traded", label: ["Quantité transigée", "Quantity traded"], type: "number", half: true },
      { name: "start_date", label: ["Date de jouissance", "Start date"], type: "date", half: true },
      { name: "maturity", label: ["Échéance", "Maturity"], type: "date", half: true },
      published,
    ],
    defaults: { name: "", isin: "", issuer: "", country: "CM", nominal: 10000, status: "NC", reference: 100, close: 100, change: 0, accrued: 0, qty_demanded: 0, qty_offered: 0, qty_traded: 0, start_date: "", maturity: "", published: true },
    publicPath: "/marches/obligations",
  },
  {
    key: "agenda",
    table: "agenda",
    label: ["Agenda des opérations", "Corporate actions"],
    singular: ["opération", "event"],
    orderBy: "event_date",
    hint: ["Dividendes, assemblées, coupons, introductions et souscriptions.", "Dividends, meetings, coupons, listings and subscriptions."],
    info: [
      ["Ajoutez chaque opération annoncée par un avis : la date, le type et l’émetteur.", "Add each event announced by a notice: date, type and issuer."],
      ["Renseignez l’identifiant de l’avis (ex. 057-2026) pour créer le lien vers l’avis.", "Enter the notice identifier (e.g. 057-2026) to link to the notice."],
      ["La date de fin sert aux périodes de souscription.", "The end date is for subscription periods."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "event_date", label: ["Date", "Date"] }, { name: "issuer", label: ["Émetteur", "Issuer"] }, { name: "type", label: ["Type", "Type"] }],
    fields: [
      { name: "event_date", label: ["Date", "Date"], type: "date", required: true, half: true },
      { name: "end_date", label: ["Date de fin", "End date"], type: "date", half: true },
      { name: "type", label: ["Type", "Type"], type: "select", required: true, half: true, options: [{ value: "dividende", label: "Dividende" }, { value: "ag", label: "Assemblée générale" }, { value: "coupon", label: "Coupon" }, { value: "remboursement", label: "Remboursement" }, { value: "introduction", label: "Introduction" }, { value: "souscription", label: "Souscription" }] },
      { name: "issuer", label: ["Émetteur", "Issuer"], type: "text", required: true, half: true },
      { name: "detail", label: ["Détail", "Detail"], type: "textarea", required: true },
      { name: "notice_slug", label: ["Identifiant de l’avis lié", "Linked notice identifier"], type: "text", half: true },
      published,
    ],
    defaults: { event_date: "", end_date: "", type: "dividende", issuer: "", detail: "", notice_slug: "", published: true },
    publicPath: "/marches/agenda",
  },
  {
    key: "notices",
    table: "notices",
    label: ["Avis et communiqués", "Notices and releases"],
    singular: ["avis", "notice"],
    orderBy: "notice_date",
    hint: ["Avis numérotés, communiqués, décisions et convocations.", "Numbered notices, releases, decisions and convocations."],
    info: [
      ["Un avis = un numéro, un titre court, la date et le PDF officiel.", "One notice = a number, a short title, the date and the official PDF."],
      ["Le titre court est celui que lit le public ; l’intitulé officiel complet s’affiche sur la page de l’avis.", "The short title is what the public reads; the full official title shows on the notice page."],
      ["Chaque avis a une adresse permanente : ne changez pas l’identifiant après publication.", "Each notice has a permanent address: do not change the identifier after publishing."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "notice_date", label: ["Date", "Date"] }, { name: "title", label: ["Titre", "Title"] }, { name: "type", label: ["Type", "Type"] }],
    fields: [
      { name: "type", label: ["Type", "Type"], type: "select", required: true, half: true, options: [{ value: "avis", label: "Avis" }, { value: "communique", label: "Communiqué" }, { value: "decision", label: "Décision" }, { value: "convocation", label: "Convocation" }, { value: "ost", label: "Opération sur titres" }] },
      { name: "number", label: ["Numéro", "Number"], type: "text", half: true, help: ["Ex. 061/2026/BVMAC/DG.", "E.g. 061/2026/BVMAC/DG."] },
      { name: "title", label: ["Titre court", "Short title"], type: "text", required: true },
      { name: "original_title", label: ["Intitulé officiel complet", "Full official title"], type: "textarea" },
      { name: "notice_date", label: ["Date de publication", "Publication date"], type: "date", required: true, half: true },
      { name: "country", label: ["Pays", "Country"], type: "select", options: COUNTRIES, half: true },
      { name: "issuer", label: ["Émetteur concerné", "Issuer concerned"], type: "text" },
      { name: "url", label: ["Document officiel (PDF)", "Official document (PDF)"], type: "file-url", required: true, folder: "avis", accept: "application/pdf" },
      { name: "slug", label: ["Identifiant dans l’adresse", "Address identifier"], type: "text", help: ["Généré automatiquement.", "Generated automatically."] },
      published,
    ],
    defaults: { type: "avis", number: "", title: "", original_title: "", notice_date: "", issuer: "", country: "", url: "", slug: "", published: true },
    derive: (v, isNew) => {
      if (!isNew || v.slug) return v;
      const num = String(v.number ?? "").match(/^(\d+)\/(\d{4})/);
      const slug = num ? `${num[1]}-${num[2]}` : slugify(String(v.title ?? "")) + (v.notice_date ? `-${String(v.notice_date).slice(0, 7)}` : "");
      return slug ? { ...v, slug } : v;
    },
    publicPath: "/avis-et-communiques",
  },
  {
    key: "news",
    table: "news",
    label: ["Actualités", "News"],
    singular: ["actualité", "news item"],
    orderBy: "news_date",
    hint: ["Actualités du marché, vie de l’institution et événements.", "Market news, life of the institution and events."],
    info: [
      ["Écrivez un titre clair et un résumé de 2 à 3 phrases.", "Write a clear title and a 2 to 3 sentence summary."],
      ["Ajoutez une image (JPG, PNG ou WebP) ; elle s’affiche dans les listes et en tête d’article.", "Add an image (JPG, PNG or WebP); it shows in lists and at the top of the article."],
      ["Les appels d’offres et offres d’emploi ont leur propre rubrique.", "Tenders and job offers have their own section."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "news_date", label: ["Date", "Date"] }, { name: "title", label: ["Titre", "Title"] }, { name: "category", label: ["Catégorie", "Category"] }],
    fields: [
      { name: "title", label: ["Titre", "Title"], type: "text", required: true },
      { name: "news_date", label: ["Date", "Date"], type: "date", required: true, half: true },
      { name: "category", label: ["Catégorie", "Category"], type: "select", required: true, half: true, options: opts("Marché", "Institutionnel", "Événements", "Recrutement") },
      { name: "excerpt", label: ["Résumé", "Summary"], type: "textarea", required: true },
      { name: "image", label: ["Image", "Image"], type: "file-url", folder: "actualites", accept: "image/jpeg,image/png,image/webp" },
      { name: "url", label: ["Lien vers le document officiel", "Link to the official document"], type: "file-url", folder: "actualites" },
      { name: "slug", label: ["Identifiant dans l’adresse", "Address identifier"], type: "text" },
      published,
    ],
    defaults: { title: "", news_date: "", category: "Marché", excerpt: "", image: "/photos/bvmac-building.webp", url: "", slug: "", published: true },
    derive: (v, isNew) => (isNew && !v.slug && v.title ? { ...v, slug: slugify(String(v.title)) } : v),
    publicPath: "/actualites",
  },
  {
    key: "tenders",
    table: "tenders",
    label: ["Appels d’offres et emplois", "Tenders and jobs"],
    singular: ["appel", "tender"],
    orderBy: "published_on",
    hint: ["Appels d’offres, manifestations d’intérêt, candidatures et recrutements.", "Tenders, expressions of interest, applications and recruitment."],
    info: [
      ["La référence doit être unique (ex. N°031/06/BVMAC/DSI/09-26).", "The reference must be unique (e.g. N°031/06/BVMAC/DSI/09-26)."],
      ["Décochez « Encore ouvert » à la clôture : l’appel passe dans la liste « Clôturés ».", "Untick “Still open” at closing: the tender moves to the “Closed” list."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "published_on", label: ["Publié le", "Published"] }, { name: "title", label: ["Intitulé", "Title"] }, { name: "type", label: ["Type", "Type"] }],
    fields: [
      { name: "type", label: ["Type", "Type"], type: "select", required: true, half: true, options: opts("Appel d’offres", "Manifestation d’intérêt", "Appel à candidatures", "Recrutement") },
      { name: "ref", label: ["Référence", "Reference"], type: "text", required: true, half: true },
      { name: "title", label: ["Intitulé", "Title"], type: "text", required: true },
      { name: "published_on", label: ["Date de publication", "Publication date"], type: "date", required: true, half: true },
      { name: "deadline", label: ["Date limite", "Deadline"], type: "date", half: true },
      { name: "url", label: ["Dossier (PDF ou page officielle)", "File (PDF or official page)"], type: "file-url", required: true, folder: "appels-d-offres" },
      { name: "is_open", label: ["Encore ouvert", "Still open"], type: "checkbox" },
      published,
    ],
    defaults: { type: "Appel d’offres", ref: "", title: "", published_on: "", deadline: "", is_open: true, url: "", published: true },
    publicPath: "/la-bvmac/appels-d-offres",
  },
  {
    key: "documents",
    table: "documents",
    label: ["Documents", "Documents"],
    singular: ["document", "document"],
    orderBy: "year",
    hint: ["Textes réglementaires, rapports, tarifs et données économiques.", "Regulations, reports, fee schedules and economic data."],
    info: [
      ["La rubrique détermine la page de la Documentation où le document apparaît.", "The section sets which Documentation page shows the document."],
      ["Indiquez l’organisme auteur et l’année : ils servent de filtres aux visiteurs.", "Give the issuing body and the year: visitors filter on them."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "year", label: ["Année", "Year"] }, { name: "title", label: ["Titre", "Title"] }, { name: "category", label: ["Rubrique", "Section"] }],
    fields: [
      { name: "title", label: ["Titre", "Title"], type: "text", required: true },
      { name: "ref", label: ["Référence du texte", "Text reference"], type: "text" },
      { name: "category", label: ["Rubrique", "Section"], type: "select", required: true, half: true, options: [{ value: "regulation", label: "Textes réglementaires" }, { value: "report", label: "Rapports boursiers" }, { value: "tariff", label: "Tarifs" }, { value: "economic", label: "Données économiques" }] },
      { name: "body", label: ["Organisme", "Body"], type: "select", required: true, half: true, options: opts("BVMAC", "COSUMAF", "CEMAC", "UMAC", "UEAC") },
      { name: "year", label: ["Année", "Year"], type: "text", required: true, half: true },
      { name: "language", label: ["Langue", "Language"], type: "select", half: true, options: opts("FR", "EN", "ES") },
      { name: "url", label: ["Fichier (PDF)", "File (PDF)"], type: "file-url", required: true, folder: "documents", accept: "application/pdf" },
      published,
    ],
    defaults: { title: "", ref: "", category: "regulation", body: "BVMAC", year: String(new Date().getFullYear()), language: "FR", url: "", published: true },
    publicPath: "/documentation",
  },
  {
    key: "videos",
    table: "videos",
    label: ["Vidéos (BVMAC TV)", "Videos (BVMAC TV)"],
    singular: ["vidéo", "video"],
    orderBy: "position",
    ascending: true,
    hint: ["Vidéos YouTube classées par liste de lecture.", "YouTube videos grouped by playlist."],
    info: [
      ["Collez le lien YouTube de la vidéo et choisissez une image d’aperçu.", "Paste the video’s YouTube link and choose a preview image."],
      ["Les vidéos ne se chargent chez le visiteur qu’avec son accord (cookies).", "Videos load for the visitor only with their consent (cookies)."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "playlist", label: ["Liste", "Playlist"] }, { name: "title", label: ["Titre", "Title"] }, { name: "caption", label: ["Légende", "Caption"] }],
    fields: [
      { name: "title", label: ["Titre", "Title"], type: "text", required: true },
      { name: "caption", label: ["Légende", "Caption"], type: "text" },
      { name: "playlist", label: ["Liste de lecture", "Playlist"], type: "select", required: true, half: true, options: opts("Cérémonies", "Reportages", "Pédagogie") },
      position,
      { name: "url", label: ["Lien YouTube", "YouTube link"], type: "text" },
      { name: "poster", label: ["Image d’aperçu", "Preview image"], type: "file-url", folder: "videos", accept: "image/jpeg,image/png,image/webp" },
      { name: "slug", label: ["Identifiant", "Identifier"], type: "text", half: true },
      published,
    ],
    defaults: { title: "", caption: "", playlist: "Reportages", position: 0, url: "", poster: "/photos/ceremony-trading-floor-2.webp", slug: "", published: true },
    derive: (v, isNew) => (isNew && !v.slug && v.title ? { ...v, slug: slugify(String(v.title)).slice(0, 40) } : v),
    publicPath: "/actualites/bvmac-tv",
  },
  {
    key: "photos",
    table: "photos",
    label: ["Photothèque", "Photo library"],
    singular: ["photo", "photo"],
    orderBy: "album_slug",
    ascending: true,
    hint: ["Photos regroupées par album.", "Photos grouped by album."],
    info: [
      ["Les photos qui partagent le même identifiant d’album forment un album.", "Photos that share the same album identifier form one album."],
      ["Rédigez une description de chaque image : elle est lue aux personnes malvoyantes.", "Describe each image: the text is read to visually impaired visitors."],
      ["Format conseillé : JPG ou WebP, 1600 px de large au plus.", "Recommended: JPG or WebP, at most 1600 px wide."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "album_title", label: ["Album", "Album"] }, { name: "alt", label: ["Description", "Description"] }, { name: "album_date", label: ["Date", "Date"] }],
    fields: [
      { name: "album_title", label: ["Titre de l’album", "Album title"], type: "text", required: true },
      { name: "album_slug", label: ["Identifiant de l’album", "Album identifier"], type: "text", required: true, half: true },
      { name: "album_date", label: ["Date affichée", "Displayed date"], type: "text", half: true, help: ["Ex. Février 2020.", "E.g. February 2020."] },
      { name: "src", label: ["Photo", "Photo"], type: "file-url", required: true, folder: "photos", accept: "image/jpeg,image/png,image/webp" },
      { name: "alt", label: ["Description de l’image", "Image description"], type: "text", required: true },
      position,
      published,
    ],
    defaults: { album_title: "", album_slug: "", album_date: "", src: "", alt: "", position: 0, published: true },
    derive: (v, isNew) => (isNew && !v.album_slug && v.album_title ? { ...v, album_slug: slugify(String(v.album_title)) } : v),
    publicPath: "/actualites/phototheque",
  },
  {
    key: "board_members",
    table: "board_members",
    label: ["Conseil et direction", "Board and management"],
    singular: ["membre", "member"],
    orderBy: "position",
    ascending: true,
    hint: ["Administrateurs et dirigeants affichés sur la page Gouvernance.", "Directors and executives shown on the Governance page."],
    info: [
      ["Renseignez le nom, la fonction et l’entité représentée.", "Enter the name, the role and the entity represented."],
      ["L’ordre d’affichage place le Président en premier (0).", "Display order puts the Chairman first (0)."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "role", label: ["Fonction", "Role"] }, { name: "name", label: ["Nom", "Name"] }, { name: "entity", label: ["Entité", "Entity"] }],
    fields: [
      { name: "name", label: ["Nom et prénom", "Full name"], type: "text", required: true },
      { name: "role", label: ["Fonction", "Role"], type: "text", required: true, half: true },
      { name: "body", label: ["Organe", "Body"], type: "select", half: true, options: [{ value: "board", label: "Conseil d’administration" }, { value: "management", label: "Direction générale" }] },
      { name: "entity", label: ["Entité représentée", "Entity represented"], type: "text" },
      { name: "photo", label: ["Portrait", "Portrait"], type: "file-url", folder: "gouvernance", accept: "image/jpeg,image/png,image/webp" },
      position,
      published,
    ],
    defaults: { name: "", role: "Administrateur", body: "board", entity: "", photo: "", position: 0, published: true },
    publicPath: "/la-bvmac/gouvernance",
  },
  {
    key: "timeline",
    table: "timeline",
    label: ["Histoire", "History"],
    singular: ["étape", "milestone"],
    orderBy: "position",
    ascending: true,
    hint: ["Les grandes dates de la BVMAC.", "BVMAC’s key dates."],
    info: [["Une étape = une date affichée, un titre et deux lignes de texte.", "A milestone = a displayed date, a title and two lines of text."], ["L’ordre d’affichage suit la chronologie (0 = la plus ancienne).", "Display order follows the chronology (0 = oldest)."], ...COMMON_INFO],
    columns: [{ name: "date_label", label: ["Date", "Date"] }, { name: "title", label: ["Titre", "Title"] }],
    fields: [
      { name: "date_label", label: ["Date affichée", "Displayed date"], type: "text", required: true, half: true, help: ["Ex. Juin 2003.", "E.g. June 2003."] },
      position,
      { name: "title", label: ["Titre", "Title"], type: "text", required: true },
      { name: "body", label: ["Texte", "Text"], type: "textarea", required: true },
      published,
    ],
    defaults: { date_label: "", position: 0, title: "", body: "", published: true },
    publicPath: "/la-bvmac/histoire",
  },
  {
    key: "brokers",
    table: "brokers",
    label: ["Sociétés de bourse", "Brokers"],
    singular: ["société de bourse", "broker"],
    orderBy: "approved_on",
    ascending: true,
    hint: ["Intermédiaires agréés par la COSUMAF.", "Intermediaries licensed by COSUMAF."],
    info: [
      ["Ajoutez une société dès la publication de son agrément ; retirez-la en cas de retrait d’agrément.", "Add a firm once its licence is published; remove it if the licence is withdrawn."],
      ["La ville sert à placer la société sur la carte (Douala, Yaoundé, Libreville, Brazzaville, N'Djamena, Malabo, Bangui).", "The city places the firm on the map (Douala, Yaoundé, Libreville, Brazzaville, N'Djamena, Malabo, Bangui)."],
      ...COMMON_INFO,
    ],
    columns: [{ name: "city", label: ["Ville", "City"] }, { name: "name", label: ["Société", "Firm"] }, { name: "approval", label: ["Agrément", "Licence"] }],
    fields: [
      { name: "name", label: ["Dénomination", "Name"], type: "text", required: true },
      { name: "country", label: ["Pays", "Country"], type: "select", required: true, half: true, options: COUNTRIES.slice(1) },
      { name: "city", label: ["Ville", "City"], type: "text", required: true, half: true },
      { name: "approval", label: ["Numéro d’agrément", "Licence number"], type: "text", half: true },
      { name: "approved_on", label: ["Date d’agrément", "Licence date"], type: "date", half: true },
      { name: "address", label: ["Adresse", "Address"], type: "textarea" },
      { name: "phone", label: ["Téléphone", "Phone"], type: "text", half: true },
      { name: "email", label: ["E-mail", "E-mail"], type: "text", half: true },
      { name: "website", label: ["Site web", "Website"], type: "text" },
      published,
    ],
    defaults: { name: "", country: "CM", city: "Douala", approval: "", approved_on: "", address: "", phone: "", email: "", website: "", published: true },
    publicPath: "/participants/societes-de-bourse",
  },
  {
    key: "partners",
    table: "partners",
    label: ["Institutions partenaires", "Partner institutions"],
    singular: ["institution", "institution"],
    orderBy: "position",
    ascending: true,
    hint: ["Logos et liens des institutions du marché (CEMAC, COSUMAF, BEAC, COBAC).", "Logos and links of market institutions (CEMAC, COSUMAF, BEAC, COBAC)."],
    info: [["Déposez le logo en PNG à fond transparent.", "Upload the logo as a PNG with a transparent background."], ...COMMON_INFO],
    columns: [{ name: "position", label: ["Ordre", "Order"] }, { name: "name", label: ["Sigle", "Acronym"] }, { name: "description", label: ["Nom complet", "Full name"] }],
    fields: [
      { name: "name", label: ["Sigle", "Acronym"], type: "text", required: true, half: true },
      position,
      { name: "description", label: ["Nom complet", "Full name"], type: "text", required: true },
      { name: "href", label: ["Site officiel", "Official website"], type: "text", required: true },
      { name: "logo", label: ["Logo", "Logo"], type: "file-url", folder: "institutions", accept: "image/png,image/webp,image/jpeg" },
      published,
    ],
    defaults: { name: "", position: 0, description: "", href: "", logo: "", published: true },
    publicPath: "/",
  },
  {
    key: "glossary",
    table: "glossary",
    label: ["Glossaire", "Glossary"],
    singular: ["terme", "term"],
    orderBy: "term",
    ascending: true,
    hint: ["Les mots de la bourse, avec leur équivalent anglais et espagnol.", "Stock-market terms, with their English and Spanish equivalents."],
    info: [["Une définition tient en une phrase simple, sans jargon.", "A definition fits in one simple sentence, without jargon."], ["Les équivalents anglais et espagnol aident la recherche dans le glossaire.", "English and Spanish equivalents help glossary search."], ...COMMON_INFO],
    columns: [{ name: "term_en", label: ["Anglais", "English"] }, { name: "term", label: ["Terme", "Term"] }, { name: "definition", label: ["Définition", "Definition"] }],
    fields: [
      { name: "term", label: ["Terme (français)", "Term (French)"], type: "text", required: true },
      { name: "definition", label: ["Définition", "Definition"], type: "textarea", required: true },
      { name: "term_en", label: ["Équivalent anglais", "English equivalent"], type: "text", half: true },
      { name: "term_es", label: ["Équivalent espagnol", "Spanish equivalent"], type: "text", half: true },
      published,
    ],
    defaults: { term: "", definition: "", term_en: "", term_es: "", published: true },
    publicPath: "/ecole-de-bourse/glossaire",
  },
];

export const resource = (key: string) => RESOURCES.find((r) => r.key === key);
