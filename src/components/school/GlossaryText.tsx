import { GLOSSARY } from "@/data/school";
import { Hint } from "@/components/ui/Hint";

const TERMS = [...GLOSSARY].sort((a, b) => b.term.length - a.term.length).filter((t) => t.term.length > 3 && !t.term.includes("("));
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Wraps the first occurrence of each glossary term in a paragraph with a tooltip.
export function GlossaryText({ text }: { text: string }) {
  const used = new Set<string>();
  const re = new RegExp(`(?<![\\p{L}])(${TERMS.map((t) => escape(t.term)).join("|")})s?(?![\\p{L}])`, "giu");
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const term = TERMS.find((t) => t.term.toLowerCase() === m[1].toLowerCase());
    if (!term || used.has(term.term) || m.index === undefined) continue;
    used.add(term.term);
    parts.push(text.slice(last, m.index));
    parts.push(<Hint key={m.index} text={term.def} className="inline">{m[0]}</Hint>);
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}
