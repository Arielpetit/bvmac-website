import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

// Resolves the [locale] segment for pages and layouts.
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<{ locale: Locale; dict: ReturnType<typeof getDictionary> }> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, dict: getDictionary(locale) };
}
