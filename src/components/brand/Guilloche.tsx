import { cn } from "@/lib/cn";

// Banknote / share-certificate style guilloche: interlaced sine bands drawn once at module load.
const W = 1440;
const H = 260;
const LINES = 18;

function wave(i: number) {
  const phase = (i / LINES) * Math.PI * 2;
  const amp = 46 + 14 * Math.sin(phase * 2);
  let d = "";
  for (let x = 0; x <= W; x += 12) {
    const t = (x / W) * Math.PI * 2;
    const y = H / 2 + amp * Math.sin(t * 3 + phase) + 22 * Math.sin(t * 7 - phase * 2);
    d += `${x === 0 ? "M" : "L"}${x},${y.toFixed(1)}`;
  }
  return d;
}

const PATHS = Array.from({ length: LINES }, (_, i) => wave(i));

export function Guilloche({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={cn("pointer-events-none", className)} fill="none" stroke="currentColor" strokeWidth="0.8">
      {PATHS.map((d, i) => <path key={i} d={d} vectorEffect="non-scaling-stroke" />)}
    </svg>
  );
}
