export const locales = ["fr", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

// Languages whose pages are built ahead of time. The others render the first time they are opened,
// which keeps the deployed build small (hosting limits the size of the build output).
export const prebuiltLocales: readonly Locale[] = [defaultLocale, "en"];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
};

// BCP 47 tags used by Intl for numbers and dates.
export const intlLocale: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",
  es: "es-ES",
};
