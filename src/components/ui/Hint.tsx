import { cn } from "@/lib/cn";

// Glossary hint shown on hover and keyboard focus (term stays readable without it).
// The bubble is display:none until shown so it never widens the page on phones,
// and the wrapper stays inline so punctuation after the term does not wrap alone.
export function Hint({ children, text, className }: { children: React.ReactNode; text: string; className?: string }) {
  return (
    <span className={cn("group/hint relative", className)}>
      <span tabIndex={0} className="cursor-help underline decoration-dotted decoration-1 underline-offset-4 outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
        {children}
      </span>
      <span role="tooltip" className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-60 max-w-[80vw] -translate-x-1/2 rounded-xl bg-espresso px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-brand-sand shadow-lg group-hover/hint:block group-focus-within/hint:block">
        {text}
      </span>
    </span>
  );
}
