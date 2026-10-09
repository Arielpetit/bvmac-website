import { formatPercent } from "@/lib/format";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

// Rises and falls always carry an arrow and a sign: colour is never the only signal.
export function PriceChange({ value, locale, className, tone = "default" }: { value: number; locale: Locale; className?: string; tone?: "default" | "onDark" }) {
  const rounded = Math.round(value * 100) / 100;
  const dir = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  const symbol = dir === "up" ? "▲" : dir === "down" ? "▼" : "■";
  const words = { fr: ["hausse", "baisse", "inchangé"], en: ["up", "down", "unchanged"], es: ["sube", "baja", "sin cambios"] }[locale];
  const label = dir === "up" ? words[0] : dir === "down" ? words[1] : words[2];
  const colours =
    tone === "onDark"
      ? { up: "text-[#6be29b]", down: "text-[#ff8a96]", flat: "text-brand-sand/60" }
      : { up: "text-rise", down: "text-fall", flat: "text-muted" };
  return (
    <span className={cn("figure inline-flex items-center gap-1 whitespace-nowrap", colours[dir], className)}>
      <span aria-hidden="true" className="text-[0.62em]">
        {symbol}
      </span>
      <span className="sr-only">{label}</span>
      {formatPercent(rounded, locale, dir !== "flat")}
    </span>
  );
}
