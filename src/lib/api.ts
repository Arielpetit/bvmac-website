// Data access layer. Every page reads data through these functions only.
// Today they return the data captured from www.bvm-ac.org (src/data); in
// production they call the BVMAC market-data API and the headless CMS.

import { AGENDA, EQUITIES, LAST_SESSION, MARKET_SUMMARY, changePct, type Equity } from "@/data/market";
import { BOC_ARCHIVE, BROKERS, DOCUMENTS, NEWS, NOTICES } from "@/data/content";
import { BONDS } from "@/data/real";
import { businessDays, priceHistory, type Point } from "@/data/series";

export type EquityQuote = Equity & { change: number };

export async function getEquities(): Promise<EquityQuote[]> {
  return EQUITIES.map((e) => ({ ...e, change: changePct(e) }));
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
  const equity = EQUITIES.find((e) => e.slug === slug);
  if (!equity) return [];
  const tick = equity.closePrice >= 100000 ? 5 : 50;
  const from = listingDate(equity);
  return priceHistory(slug, equity.closePrice, LAST_SESSION, count, 0.01, tick).filter((p) => !from || p.date >= from);
}

export async function getMarketSummary() {
  return MARKET_SUMMARY;
}

export async function getCapitalisationHistory(count = 260): Promise<Point[]> {
  return priceHistory("market-cap", MARKET_SUMMARY.equityCapitalisation, LAST_SESSION, count, 0.004, 1_000_000);
}

export async function getValueTradedHistory(count = 60): Promise<Point[]> {
  return priceHistory("value-traded", MARKET_SUMMARY.valueTraded, LAST_SESSION, count, 0.6, 1000).map((p, i) => ({ ...p, value: i % 6 === 2 ? 0 : p.value }));
}

export async function getBonds() {
  return BONDS;
}

export async function getAgenda() {
  return AGENDA.slice().sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNotices() {
  return NOTICES.slice().sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNotice(id: string) {
  return NOTICES.find((n) => n.id === id);
}

export async function getNews() {
  return NEWS.slice().sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsItem(slug: string) {
  return NEWS.find((n) => n.slug === slug);
}

export async function getBocArchive() {
  return BOC_ARCHIVE;
}

export async function getBrokers() {
  return BROKERS;
}

export async function getDocuments() {
  return DOCUMENTS;
}

export { businessDays };
