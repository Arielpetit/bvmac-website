import Image from "next/image";
import { cn } from "@/lib/cn";

// Issuer marks: official logo emblems from /public/issuers/ (full logos: {slug}-logo.png).
// The coloured initials remain as a fallback for issuers without a logo file.
const MARKS: Record<string, { label: string; bg: string; fg: string; accent?: string; logo?: string; tile?: string; cover?: boolean }> = {
  "bgfi-holding": { label: "BGFI", bg: "#0b3d91", fg: "#ffffff", accent: "#f5a800", logo: "/issuers/bgfi-mark.png" },
  bange: { label: "BNG", bg: "#00543c", fg: "#ffffff", accent: "#e2b33c", logo: "/issuers/bange-mark.png" },
  semc: { label: "SEMC", bg: "#0077c8", fg: "#ffffff", accent: "#7fd3ff", logo: "/issuers/semc-mark.png" },
  socapalm: { label: "SCP", bg: "#2f6b2a", fg: "#ffffff", accent: "#e9c46a", logo: "/issuers/socapalm-mark.png" },
  safacam: { label: "SFC", bg: "#4d7c2f", fg: "#ffffff", accent: "#f0d27a", logo: "/issuers/safacam-mark.png" },
  "la-regionale": { label: "LR", bg: "#b3121f", fg: "#ffffff", accent: "#ffd9a0", logo: "/issuers/la-regionale-mark.png", tile: "#1d5fa9", cover: true },
  "scg-re": { label: "SCG", bg: "#1f3a5f", fg: "#ffffff", accent: "#9ec5ff", logo: "/issuers/scg-re-mark.png" },
};

export function CompanyMark({ slug, name, size = "md", className }: { slug: string; name?: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const m = MARKS[slug] ?? { label: (name ?? slug).slice(0, 3).toUpperCase(), bg: "#2a1c10", fg: "#ead18a" };
  const dimsLogo = { sm: "size-8 rounded-lg p-1", md: "size-10 rounded-xl p-1.5", lg: "size-14 rounded-2xl p-2", xl: "size-20 rounded-3xl p-3" }[size];
  if (m.logo) {
    return (
      <span aria-hidden="true" className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-white shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]", dimsLogo, m.cover && "p-0", className)} style={m.tile ? { background: m.tile } : undefined}>
        <Image src={m.logo} alt="" width={80} height={80} className={cn("size-full", m.cover ? "object-cover" : "object-contain")} />
      </span>
    );
  }
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
