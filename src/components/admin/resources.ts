// Admin content types. Field names are the database column names.
export type FieldType = "text" | "textarea" | "date" | "select" | "checkbox" | "file-url";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  folder?: string;
  accept?: string;
};
export type Values = Record<string, string | boolean | null>;
export type Resource = {
  key: string;
  table: string;
  label: string;
  singular: string;
  orderBy: string;
  hint: string;
  columns: { name: string; label: string }[];
  fields: Field[];
  defaults: Values;
  /** Fills computed fields while the user types (only when the field is still empty). */
  derive?: (v: Values, isNew: boolean) => Values;
  /** Public page of a row, for the "Voir" link. */
  publicPath?: (row: Record<string, unknown>) => string | null;
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

export const RESOURCES: Resource[] = [
  {
    key: "bulletins",
    table: "bulletins",
    label: "Bulletins (BOC)",
    singular: "bulletin",
    orderBy: "session_date",
    hint: "Un bulletin par séance de cotation : choisissez la date et déposez le PDF. Le numéro se remplit seul.",
    columns: [
      { name: "session_date", label: "Séance" },
      { name: "number", label: "Numéro" },
    ],
    fields: [
      { name: "session_date", label: "Date de la séance", type: "date", required: true },
      { name: "number", label: "Numéro du bulletin", type: "text", required: true, help: "Format BOC + JJMMAAAA, rempli automatiquement." },
      { name: "url", label: "Fichier PDF du BOC", type: "file-url", required: true, folder: "boc", accept: "application/pdf" },
      { name: "published", label: "Publié sur le site", type: "checkbox" },
    ],
    defaults: { session_date: "", number: "", url: "", published: true },
    derive: (v) => {
      const d = String(v.session_date ?? "");
      return /^\d{4}-\d{2}-\d{2}$/.test(d) ? { ...v, number: `BOC${d.slice(8, 10)}${d.slice(5, 7)}${d.slice(0, 4)}` } : v;
    },
  },
  {
    key: "notices",
    table: "notices",
    label: "Avis et communiqués",
    singular: "avis",
    orderBy: "notice_date",
    hint: "Avis numérotés, communiqués, décisions et convocations. Joignez le PDF officiel.",
    columns: [
      { name: "notice_date", label: "Date" },
      { name: "title", label: "Titre" },
      { name: "type", label: "Type" },
    ],
    fields: [
      { name: "type", label: "Type", type: "select", required: true, options: [{ value: "avis", label: "Avis" }, { value: "communique", label: "Communiqué" }, { value: "decision", label: "Décision" }, { value: "convocation", label: "Convocation" }, { value: "ost", label: "Opération sur titres" }] },
      { name: "number", label: "Numéro", type: "text", help: "Ex. 061/2026/BVMAC/DG (laisser vide pour un communiqué)." },
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "original_title", label: "Intitulé officiel complet", type: "textarea" },
      { name: "notice_date", label: "Date de publication", type: "date", required: true },
      { name: "issuer", label: "Émetteur concerné", type: "text" },
      { name: "country", label: "Pays", type: "select", options: COUNTRIES },
      { name: "url", label: "Document officiel (PDF)", type: "file-url", required: true, folder: "avis", accept: "application/pdf" },
      { name: "slug", label: "Identifiant dans l’adresse", type: "text", help: "Généré automatiquement ; ne le changez pas après publication." },
      { name: "published", label: "Publié sur le site", type: "checkbox" },
    ],
    defaults: { type: "avis", number: "", title: "", original_title: "", notice_date: "", issuer: "", country: "", url: "", slug: "", published: true },
    derive: (v, isNew) => {
      if (!isNew || v.slug) return v;
      const num = String(v.number ?? "").match(/^(\d+)\/(\d{4})/);
      const slug = num ? `${num[1]}-${num[2]}` : slugify(String(v.title ?? "")) + (v.notice_date ? `-${String(v.notice_date).slice(0, 7)}` : "");
      return slug ? { ...v, slug } : v;
    },
    publicPath: (r) => `/avis-et-communiques/${r.slug}`,
  },
  {
    key: "news",
    table: "news",
    label: "Actualités",
    singular: "actualité",
    orderBy: "news_date",
    hint: "Actualités du marché, vie de l’institution, événements. Les offres d’emploi vont dans « Appels d’offres et emplois ».",
    columns: [
      { name: "news_date", label: "Date" },
      { name: "title", label: "Titre" },
      { name: "category", label: "Catégorie" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "news_date", label: "Date", type: "date", required: true },
      { name: "category", label: "Catégorie", type: "select", required: true, options: opts("Marché", "Institutionnel", "Événements", "Recrutement") },
      { name: "excerpt", label: "Résumé", type: "textarea", required: true, help: "2 à 3 phrases affichées dans les listes et sur la page de l’article." },
      { name: "image", label: "Image", type: "file-url", folder: "actualites", accept: "image/jpeg,image/png,image/webp", help: "Chemin d’une image du site (/photos/…) ou fichier déposé." },
      { name: "url", label: "Lien vers le document ou l’annonce officielle", type: "file-url", folder: "actualites" },
      { name: "slug", label: "Identifiant dans l’adresse", type: "text" },
      { name: "published", label: "Publié sur le site", type: "checkbox" },
    ],
    defaults: { title: "", news_date: "", category: "Marché", excerpt: "", image: "/photos/bvmac-building.webp", url: "", slug: "", published: true },
    derive: (v, isNew) => (isNew && !v.slug && v.title ? { ...v, slug: slugify(String(v.title)) } : v),
    publicPath: (r) => `/actualites/${r.slug}`,
  },
  {
    key: "tenders",
    table: "tenders",
    label: "Appels d’offres et emplois",
    singular: "appel",
    orderBy: "published_on",
    hint: "Appels d’offres, manifestations d’intérêt, appels à candidatures et offres d’emploi.",
    columns: [
      { name: "published_on", label: "Publié le" },
      { name: "title", label: "Intitulé" },
      { name: "type", label: "Type" },
    ],
    fields: [
      { name: "type", label: "Type", type: "select", required: true, options: opts("Appel d’offres", "Manifestation d’intérêt", "Appel à candidatures", "Recrutement") },
      { name: "ref", label: "Référence", type: "text", required: true, help: "Ex. N°031/06/BVMAC/DSI/09-26 (doit être unique)." },
      { name: "title", label: "Intitulé", type: "text", required: true },
      { name: "published_on", label: "Date de publication", type: "date", required: true },
      { name: "deadline", label: "Date limite", type: "date" },
      { name: "is_open", label: "Encore ouvert", type: "checkbox" },
      { name: "url", label: "Dossier (PDF ou page officielle)", type: "file-url", required: true, folder: "appels-d-offres" },
      { name: "published", label: "Publié sur le site", type: "checkbox" },
    ],
    defaults: { type: "Appel d’offres", ref: "", title: "", published_on: "", deadline: "", is_open: true, url: "", published: true },
    publicPath: () => `/la-bvmac/appels-d-offres`,
  },
];
