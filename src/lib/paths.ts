import type { Locale } from "@/i18n/config";

// Every internal link carries the locale prefix: /fr/marches, /en/marches…
export function localePath(locale: Locale, path: string): string {
  if (path.startsWith("http") || path.startsWith("mailto:") || path.startsWith("tel:")) return path;
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
