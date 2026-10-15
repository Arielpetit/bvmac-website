import type { Dictionary } from "@/i18n";

export async function pageTitle(params: Promise<{ locale: string }>, pick: (dict: Dictionary) => string) {
  const { getDictionary } = await import("@/i18n");
  const { isLocale } = await import("@/i18n/config");
  const { locale } = await params;
  return { title: pick(getDictionary(isLocale(locale) ? locale : "fr")) };
}
