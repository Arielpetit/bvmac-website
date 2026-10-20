// Data access layer. Every page reads data through these functions only.
// Today they return the data captured from www.bvm-ac.org (src/data); in
// production they call the BVMAC market-data API and the headless CMS.

import { fetchAgenda, fetchAlbums, fetchBoard, fetchBonds, fetchBrokers, fetchBulletins, fetchDocuments, fetchEquities, fetchGlossary, fetchNews, fetchNotices, fetchPartners, fetchSetting, fetchTenders, fetchTimeline, fetchVideos } from "@/lib/content";
import { BOARD, SHAREHOLDING, TIMELINE } from "@/data/institution";
import { ALBUMS, VIDEOS } from "@/data/media";
import { GLOSSARY } from "@/data/school";
import { CONTACT, PARTNERS } from "@/lib/navigation";
import { TENDERS } from "@/data/institution";
import { AGENDA, EQUITIES, MARKET_SUMMARY, changePct, type Equity } from "@/data/market";
import { BOC_ARCHIVE, BROKERS, DOCUMENTS, NEWS, NOTICES } from "@/data/content";
import { BONDS } from "@/data/real";
import { businessDays, priceHistory, type Point } from "@/data/series";

export type EquityQuote = Equity & { change: number };

export async function getEquities(): Promise<EquityQuote[]> {
  return ((await fetchEquities()) ?? EQUITIES).map((e) => ({ ...e, change: changePct(e) }));
}

export async function getEquity(slug: string): Promise<EquityQuote | undefined> {
  return (await getEquities()).find((e) => e.slug === slug);
}

/** Securities with the largest moves; when the session was flat, the most active ones. */
export async function getMovers(count = 3) {
  const all = await getEquities();
  const moved = all.filter((e) => e.change !== 0);
  const gainers = moved.filter((e) => e.change > 0).sort((a, b) => b.change - a.change).slice(0, count);
  const losers = moved.filter((e) => e.change < 0).sort((a, b) => a.change - b.change).slice(0, count);
  const active = all
    .slice()
    .sort((a, b) => b.qtyTraded - a.qtyTraded || b.qtyDemanded + b.qtyOffered - (a.qtyDemanded + a.qtyOffered))
    .slice(0, count + 2);
  return { gainers, losers, active, flat: moved.length === 0 };
}

const listingDate = (e: Equity) => (e.listedOn && e.listedOn.length === 10 ? e.listedOn : null);

/** Illustrative history ending at the official last price (thin market: many flat sessions). */
export async function getPriceHistory(slug: string, count = 260): Promise<Point[]> {
  const equity = (await getEquities()).find((e) => e.slug === slug);
  if (!equity) return [];
  const tick = equity.closePrice >= 100000 ? 5 : 50;
  const from = listingDate(equity);
  const { date } = await getMarketSummary();
  return priceHistory(slug, equity.closePrice, date, count, 0.01, tick).filter((p) => !from || p.date >= from);
}

// Session summary: edited in the admin ("Synthèse de séance"); counts follow the lists.
export async function getMarketSummary(): Promise<typeof MARKET_SUMMARY> {
  const saved = await fetchSetting<Partial<typeof MARKET_SUMMARY>>("market");
  const valid = saved && /^\d{4}-\d{2}-\d{2}$/.test(String(saved.date ?? "")) && Number(saved.equityCapitalisation) > 0;
  if (!valid) return MARKET_SUMMARY;
  return {
    ...MARKET_SUMMARY,
    date: String(saved.date),
    valueTraded: Number(saved.valueTraded) || 0,
    equityCapitalisation: Number(saved.equityCapitalisation),
    bondOutstanding: Number(saved.bondOutstanding) || MARKET_SUMMARY.bondOutstanding,
    securitiesTraded: Number(saved.securitiesTraded) || 0,
  };
}

export async function getCapitalisationHistory(count = 260): Promise<Point[]> {
  const m = await getMarketSummary();
  return priceHistory("market-cap", m.equityCapitalisation, m.date, count, 0.004, 1_000_000);
}

export async function getValueTradedHistory(count = 60): Promise<Point[]> {
  const m = await getMarketSummary();
  return priceHistory("value-traded", m.valueTraded || MARKET_SUMMARY.valueTraded, m.date, count, 0.6, 1000).map((p, i) => ({ ...p, value: i % 6 === 2 ? 0 : p.value }));
}

export async function getBonds() {
  return (await fetchBonds()) ?? BONDS;
}

export async function getAgenda() {
  return ((await fetchAgenda()) ?? AGENDA).slice().sort((a, b) => b.date.localeCompare(a.date));
}

// Notices, news, bulletins and tenders come from the admin (Supabase) and fall
// back to the static data when it is unavailable.
// Items entered in the admin win; the archive of the official site fills in everything else.
function withArchive<T>(db: T[] | null, archive: T[], key: (x: T) => string): T[] {
  if (!db) return archive;
  const keys = new Set(db.map(key));
  return [...db, ...archive.filter((x) => !keys.has(key(x)))];
}

export async function getNotices() {
  return withArchive(await fetchNotices(), NOTICES, (n) => n.id).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNotice(id: string) {
  return (await getNotices()).find((n) => n.id === id);
}

export async function getNews() {
  return withArchive(await fetchNews(), NEWS, (n) => n.slug).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsItem(slug: string) {
  return (await getNews()).find((n) => n.slug === slug);
}

export async function getBocArchive() {
  return withArchive(await fetchBulletins(), BOC_ARCHIVE, (b) => b.date).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getTenders() {
  return withArchive(await fetchTenders(), TENDERS, (t) => t.url).sort((a, b) => b.published.localeCompare(a.published));
}

export async function getBrokers() {
  return (await fetchBrokers()) ?? BROKERS;
}

// Links to a listing page of the old site are dropped once the real PDFs are known.
const LISTING_PAGES = ["https://www.bvm-ac.org/documentations-rapports-boursiers/", "https://www.bvm-ac.org/donnees-economiques/"];

export async function getDocuments() {
  return withArchive(await fetchDocuments(), DOCUMENTS, (d) => d.url).filter((d) => !LISTING_PAGES.includes(d.url));
}

export async function getVideos() {
  return (await fetchVideos()) ?? VIDEOS;
}

export async function getAlbums() {
  return (await fetchAlbums()) ?? ALBUMS;
}

export async function getTimeline() {
  return (await fetchTimeline()) ?? TIMELINE;
}

export async function getBoard(): Promise<{ name: string; role: string; entity: string; photo?: string }[]> {
  return (await fetchBoard()) ?? BOARD;
}

export async function getPartners() {
  return (await fetchPartners()) ?? PARTNERS;
}

export async function getGlossary() {
  return (await fetchGlossary()) ?? GLOSSARY;
}

export async function getShareholding(): Promise<typeof SHAREHOLDING> {
  const saved = await fetchSetting<{ capital?: number; shareholdingAsOf?: string; shareholding?: { label: string; value: number }[] }>("institution");
  if (!saved?.shareholding?.length || !saved.capital) return SHAREHOLDING;
  return { asOf: saved.shareholdingAsOf || SHAREHOLDING.asOf, capital: Number(saved.capital), parts: saved.shareholding };
}

export type Announcement = { enabled: boolean; text: string; link: string };
export async function getAnnouncement(): Promise<Announcement | null> {
  const a = await fetchSetting<Announcement>("announcement");
  return a?.enabled && a.text ? a : null;
}

export { businessDays };

// Contact details and social links: edited in the admin ("Paramètres du site").
export async function getContact(): Promise<typeof CONTACT & { appStore: string }> {
  const c = await fetchSetting<Record<string, string>>("contact");
  if (!c?.email) return { ...CONTACT, appStore: "" };
  const phone = c.phone || CONTACT.phone;
  return {
    address: [c.addressLine2 || CONTACT.address[0], c.addressLine1 || CONTACT.address[1]],
    phone,
    phoneHref: `tel:${phone.replace(/[^+\d]/g, "")}`,
    fax: c.fax || CONTACT.fax,
    email: c.email,
    social: { facebook: c.facebook || CONTACT.social.facebook, x: c.x || CONTACT.social.x, linkedin: c.linkedin || CONTACT.social.linkedin, youtube: c.youtube || CONTACT.social.youtube },
    playStore: c.playStore || CONTACT.playStore,
    appStore: c.appStore || "",
  };
}
