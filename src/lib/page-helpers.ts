import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { localePath } from "@/lib/paths";
import { NAV, type NavGroupKey } from "@/lib/navigation";

// Breadcrumb: Accueil › Section › Page (› extra)
export function crumbs(locale: Locale, dict: Dictionary, group: NavGroupKey, page?: string, extra?: { label: string; href?: string }[]) {
  const g = NAV.find((n) => n.key === group)!;
  const section = { label: dict.nav[group], href: page ? localePath(locale, g.href) : undefined };
  const items: { label: string; href?: string }[] = [{ label: dict.nav.home, href: localePath(locale, "/") }, section];
  if (page && page !== dict.nav[group]) items.push({ label: page, href: extra?.length ? localePath(locale, g.href) : undefined });
  if (extra) items.push(...extra);
  return items;
}

export async function pageTitle(params: Promise<{ locale: string }>, pick: (dict: Dictionary) => string) {
  const { getDictionary } = await import("@/i18n");
  const { isLocale } = await import("@/i18n/config");
  const { locale } = await params;
  return { title: pick(getDictionary(isLocale(locale) ? locale : "fr")) };
}
