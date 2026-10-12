import { cacheLife } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import type { BocEntry, NewsItem, Notice } from "@/data/real";
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
