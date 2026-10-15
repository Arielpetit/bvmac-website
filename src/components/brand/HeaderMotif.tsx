import { CEMAC_CONTOURS } from "@/components/brand/cemacContours";
import { cn } from "@/lib/cn";

// Faint topographic rings around the six CEMAC states, for the right side of inner-page
// headers. Desktop only and decorative; cropped by the header so it reads as texture.
export function HeaderMotif({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="150 40 320 420"
      preserveAspectRatio="xMidYMin meet"
      className={cn("pointer-events-none absolute hidden select-none lg:block", className)}
    >
      <g className="fill-none stroke-brand-gold" strokeLinejoin="round">
        {CEMAC_CONTOURS.map((d, i) => (
          <path key={i} d={d} strokeWidth={i === 2 ? 1.1 : 0.7} strokeOpacity={i === 2 ? 0.4 : Math.max(0.12, 0.32 - Math.abs(i - 2) * 0.03)} />
        ))}
      </g>
    </svg>
  );
}
