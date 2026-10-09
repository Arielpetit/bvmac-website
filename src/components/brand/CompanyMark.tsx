import { cn } from "@/lib/cn";

// Issuer marks. Brand colours approximate each company's identity; replace with
// the official logo files (SVG/PNG in /public/issuers/) once supplied or approved.
const MARKS: Record<string, { label: string; bg: string; fg: string; accent?: string }> = {
  "bgfi-holding": { label: "BGFI", bg: "#0b3d91", fg: "#ffffff", accent: "#f5a800" },
  bange: { label: "BNG", bg: "#00543c", fg: "#ffffff", accent: "#e2b33c" },
  semc: { label: "SEMC", bg: "#0077c8", fg: "#ffffff", accent: "#7fd3ff" },
  socapalm: { label: "SCP", bg: "#2f6b2a", fg: "#ffffff", accent: "#e9c46a" },
  safacam: { label: "SFC", bg: "#4d7c2f", fg: "#ffffff", accent: "#f0d27a" },
  "la-regionale": { label: "LR", bg: "#b3121f", fg: "#ffffff", accent: "#ffd9a0" },
  "scg-re": { label: "SCG", bg: "#1f3a5f", fg: "#ffffff", accent: "#9ec5ff" },
};

export function CompanyMark({ slug, name, size = "md", className }: { slug: string; name?: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const m = MARKS[slug] ?? { label: (name ?? slug).slice(0, 3).toUpperCase(), bg: "#2a1c10", fg: "#ead18a" };
  const dims = { sm: "size-8 rounded-lg text-[9px]", md: "size-10 rounded-xl text-[10px]", lg: "size-14 rounded-2xl text-xs", xl: "size-20 rounded-3xl text-sm" }[size];
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden font-semibold tracking-wide shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]", dims, className)}
      style={{ background: m.bg, color: m.fg }}
    >
      <span className="absolute -right-1/4 -top-1/4 size-3/4 rounded-full opacity-35" style={{ background: m.accent ?? m.fg }} />
      <span className="relative">{m.label}</span>
    </span>
  );
}
