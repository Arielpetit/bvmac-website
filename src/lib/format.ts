import { intlLocale, type Locale } from "@/i18n/config";

// French typography: narrow no-break space for thousands (Intl does this),
// comma decimal, no-break space before % and units.
const NBSP = " ";

export function formatNumber(value: number, locale: Locale, digits = 0): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatFcfa(value: number, locale: Locale, digits = 0): string {
  return `${formatNumber(value, locale, digits)}${NBSP}FCFA`;
}

// Compact large amounts: 1 795,9 Md FCFA (fr) / 1,795.9 bn FCFA (en).
export function formatFcfaCompact(value: number, locale: Locale): string {
  if (Math.abs(value) < 1e9) {
    const m = { fr: "M", en: "m", es: "M" }[locale];
    return `${formatNumber(value / 1e6, locale, 1)}${NBSP}${m}${NBSP}FCFA`;
  }
  const unit = { fr: "Md", en: "bn", es: "mil M" }[locale];
  return `${formatNumber(value / 1e9, locale, 1)}${NBSP}${unit}${NBSP}FCFA`;
}

export function formatPercent(value: number, locale: Locale, signed = true): string {
  const sign = signed ? (value > 0 ? "+" : value < 0 ? "−" : "") : "";
  const body = formatNumber(Math.abs(value), locale, 2);
  return locale === "en" ? `${sign}${body}%` : `${sign}${body}${NBSP}%`;
}

const TZ = "Africa/Douala";

export function formatDate(iso: string, locale: Locale, style: "long" | "short" | "numeric" = "long"): string {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  const options: Intl.DateTimeFormatOptions =
    style === "long"
      ? { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ }
      : style === "short"
        ? { day: "2-digit", month: "short", year: "numeric", timeZone: TZ }
        : { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ };
  return new Intl.DateTimeFormat(intlLocale[locale], options).format(date);
}

export function formatDayMonth(iso: string, locale: Locale): { day: string; month: string } {
  const date = new Date(`${iso}T12:00:00Z`);
  return {
    day: new Intl.DateTimeFormat(intlLocale[locale], { day: "2-digit", timeZone: TZ }).format(date),
    month: new Intl.DateTimeFormat(intlLocale[locale], { month: "short", timeZone: TZ })
      .format(date)
      .replace(".", ""),
  };
}

export function formatFileSize(kb: number, locale: Locale): string {
  return kb >= 1024 ? `${formatNumber(kb / 1024, locale, 1)}${NBSP}Mo` : `${formatNumber(kb, locale)}${NBSP}Ko`;
}
