import { cacheLife } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import type { BocEntry, Bond, Broker, NewsItem, Notice } from "@/data/real";
import type { CorporateAction, Equity } from "@/data/market";
import type { DocItem } from "@/data/content";
import type { Album, Video } from "@/data/media";
import type { Tender } from "@/data/institution";
import type { CountryCode } from "@/lib/navigation";

// Content published through the admin (Supabase). Each function returns null when
// Supabase is unreachable, empty or not yet set up, and the caller falls back to the
// static data shipped with the site. Results are cached for a few minutes.

export async function fetchNotices(): Promise<Notice[] | null> {
  "use cache";
  cacheLife("minutes");
  const db = getPublicClient();
  if (!db) return null;
  const { data, error } = await db.from("notices").select("slug,number,type,title,original_title,notice_date,issuer,country,url").order("notice_date", { ascending: false }).limit(500);
  if (error || !data?.length) return null;
  return data.map((r) => ({
    id: r.slug,
    number: r.number,
    type: r.type,
    title: r.title,
    original: r.original_title ?? r.title,
    date: r.notice_date,
    issuer: r.issuer,
    country: r.country as CountryCode | null,
    url: r.url,
  }));
}

export async function fetchNews(): Promise<NewsItem[] | null> {
  "use cache";
  cacheLife("minutes");
  const db = getPublicClient();
  if (!db) return null;
  const { data, error } = await db.from("news").select("slug,title,news_date,excerpt,category,image,url").order("news_date", { ascending: false }).limit(200);
  if (error || !data?.length) return null;
  return data.map((r) => ({ slug: r.slug, title: r.title, date: r.news_date, excerpt: r.excerpt, category: r.category, image: r.image, url: r.url ?? "" }));
}

export async function fetchBulletins(): Promise<BocEntry[] | null> {
  "use cache";
  cacheLife("minutes");
  const db = getPublicClient();
  if (!db) return null;
  const { data, error } = await db.from("bulletins").select("number,session_date,url").order("session_date", { ascending: false }).limit(1000);
  if (error || !data?.length) return null;
  return data.map((r) => ({ number: r.number, date: r.session_date, url: r.url }));
}

export async function fetchTenders(): Promise<Tender[] | null> {
  "use cache";
  cacheLife("minutes");
  const db = getPublicClient();
  if (!db) return null;
  const { data, error } = await db.from("tenders").select("ref,title,type,published_on,deadline,is_open,url").order("published_on", { ascending: false }).limit(200);
  if (error || !data?.length) return null;
  return data.map((r) => ({ ref: r.ref, title: r.title, type: r.type, published: r.published_on, deadline: r.deadline ?? undefined, open: r.is_open, url: r.url }));
}

// ------------------------------------------------------------------ part 2

type Row = Record<string, unknown>;
async function rows(table: string, columns: string, order: string, ascending = true, limit = 1000): Promise<Row[] | null> {
  const db = getPublicClient();
  if (!db) return null;
  const { data, error } = await db.from(table).select(columns).order(order, { ascending }).limit(limit);
  if (error || !data?.length) return null;
  return data as unknown as Row[];
}
const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const n = (v: unknown) => Number(v ?? 0);

export async function fetchEquities(): Promise<Equity[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("equities", "*", "position");
  return data && data.map((r) => ({
    ticker: s(r.ticker), slug: s(r.slug), name: s(r.name), shortName: s(r.short_name), isin: s(r.isin), country: r.country as CountryCode, sector: s(r.sector),
    compartment: r.compartment ? s(r.compartment) : undefined, nominal: r.nominal === null ? null : n(r.nominal), listedOn: r.listed_on ? s(r.listed_on) : null,
    lastDividend: { amount: n(r.dividend_amount), date: s(r.dividend_date) }, referencePrice: n(r.reference_price), closePrice: n(r.close_price),
    qtyDemanded: n(r.qty_demanded), qtyOffered: n(r.qty_offered), qtyTraded: n(r.qty_traded), status: s(r.status) as Equity["status"], bio: s(r.bio),
    founded: r.founded ? s(r.founded) : undefined, headquarters: s(r.headquarters),
  }));
}

export async function fetchBonds(): Promise<Bond[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("bonds", "*", "name");
  return data && data.map((r) => ({
    isin: s(r.isin), name: s(r.name), issuer: s(r.issuer), country: r.country as CountryCode, nominal: n(r.nominal), reference: n(r.reference), close: n(r.close), accrued: n(r.accrued),
    qtyDemanded: n(r.qty_demanded), qtyOffered: n(r.qty_offered), qtyTraded: n(r.qty_traded), change: n(r.change), status: s(r.status), start: r.start_date ? s(r.start_date) : null, maturity: r.maturity ? s(r.maturity) : null,
  }));
}

export async function fetchAgenda(): Promise<CorporateAction[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("agenda", "id,event_date,end_date,type,issuer,detail,notice_slug", "event_date", false);
  return data && data.map((r) => ({ id: s(r.id), date: s(r.event_date), endDate: r.end_date ? s(r.end_date) : undefined, type: s(r.type) as CorporateAction["type"], issuer: s(r.issuer), detail: s(r.detail), notice: r.notice_slug ? s(r.notice_slug) : undefined }));
}

export async function fetchBrokers(): Promise<Broker[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("brokers", "name,country,city,approval,approved_on,address", "approved_on");
  return data && data.map((r) => ({ name: s(r.name), country: r.country as CountryCode, city: s(r.city), approval: s(r.approval), approvedOn: s(r.approved_on), address: s(r.address) }));
}

export async function fetchDocuments(): Promise<DocItem[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("documents", "id,title,ref,body,category,year,url,language", "year", false);
  return data && data.map((r) => ({ id: s(r.id), title: s(r.title), ref: r.ref ? s(r.ref) : undefined, body: s(r.body) as DocItem["body"], category: s(r.category) as DocItem["category"], year: s(r.year), url: s(r.url), language: "FR" as const }));
}

export async function fetchVideos(): Promise<Video[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("videos", "slug,title,caption,playlist,poster", "position");
  return data && data.map((r) => ({ id: s(r.slug), title: s(r.title), caption: s(r.caption), playlist: s(r.playlist) as Video["playlist"], poster: s(r.poster) }));
}

export async function fetchAlbums(): Promise<Album[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("photos", "album_slug,album_title,album_date,src,alt,position", "position");
  if (!data) return null;
  const albums = new Map<string, Album>();
  for (const r of data) {
    const id = s(r.album_slug);
    if (!albums.has(id)) albums.set(id, { id, title: s(r.album_title), date: s(r.album_date), photos: [] });
    albums.get(id)!.photos.push({ src: s(r.src), alt: s(r.alt) });
  }
  return [...albums.values()];
}

export async function fetchTimeline(): Promise<{ date: string; title: string; text: string }[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("timeline", "date_label,title,body", "position");
  return data && data.map((r) => ({ date: s(r.date_label), title: s(r.title), text: s(r.body) }));
}

export async function fetchBoard(): Promise<{ name: string; role: string; entity: string; photo?: string }[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("board_members", "name,role,entity,photo,body", "position");
  return data && data.filter((r) => r.body !== "management").map((r) => ({ name: s(r.name), role: s(r.role), entity: s(r.entity), photo: r.photo ? s(r.photo) : undefined }));
}

export async function fetchPartners(): Promise<{ name: string; href: string; desc: string; logo?: string }[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("partners", "name,description,href,logo", "position");
  return data && data.map((r) => ({ name: s(r.name), href: s(r.href), desc: s(r.description), logo: r.logo ? s(r.logo) : undefined }));
}

export async function fetchGlossary(): Promise<{ term: string; def: string }[] | null> {
  "use cache";
  cacheLife("minutes");
  const data = await rows("glossary", "term,definition", "term");
  return data && data.map((r) => ({ term: s(r.term), def: s(r.definition) }));
}

/** One block of site settings (see the admin "Paramètres"), or null. */
export async function fetchSetting<T extends Record<string, unknown>>(key: string): Promise<T | null> {
  "use cache";
  cacheLife("minutes");
  const db = getPublicClient();
  if (!db) return null;
  const { data, error } = await db.from("site_settings").select("value").eq("key", key).maybeSingle();
  if (error || !data) return null;
  return data.value as T;
}
