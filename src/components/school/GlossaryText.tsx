import { GLOSSARY, glossaryDef } from "@/data/school";
import { TERM_TRANSLATIONS } from "@/data/glossary-extra";
import type { Locale } from "@/i18n/config";
import { Hint } from "@/components/ui/Hint";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Glossary terms in the visitor's language, longest first so multi-word terms win.
function termsFor(locale: Locale) {
  return GLOSSARY.map((g) => ({
    term: locale === "fr" ? g.term : TERM_TRANSLATIONS[g.term]?.[locale === "en" ? 0 : 1] ?? g.term,
    def: glossaryDef(g.term, g.def, locale),
  }))
    .filter((t) => t.term.length > 3 && !t.term.includes("("))
    .sort((a, b) => b.term.length - a.term.length);
}

// Wraps the first occurrence of each glossary term in a paragraph with a tooltip.
export function GlossaryText({ text, locale = "fr" }: { text: string; locale?: Locale }) {
  const terms = termsFor(locale);
  const used = new Set<string>();
  const re = new RegExp(`(?<![\\p{L}])(${terms.map((t) => escape(t.term)).join("|")})s?(?![\\p{L}])`, "giu");
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const term = terms.find((t) => t.term.toLowerCase() === m[1].toLowerCase());
    if (!term || used.has(term.term) || m.index === undefined) continue;
    used.add(term.term);
    parts.push(text.slice(last, m.index));
    parts.push(<Hint key={m.index} text={term.def} className="inline">{m[0]}</Hint>);
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}
