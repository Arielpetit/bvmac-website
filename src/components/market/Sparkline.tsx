import type { Point } from "@/data/series";

// Tiny inline trend line. Decorative: the value it summarises is always shown as text.
export function Sparkline({
  points,
  className = "h-8 w-24",
  stroke = "currentColor",
}: {
  points: Point[];
  className?: string;
  stroke?: string;
}) {
  if (points.length < 2) return null;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const d = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (values.length - 1)) * 100).toFixed(2)},${(28 - ((v - min) / span) * 24).toFixed(2)}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
