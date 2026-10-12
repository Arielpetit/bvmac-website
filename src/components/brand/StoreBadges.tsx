import { cn } from "@/lib/cn";

const APPLE = "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z";

function PlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <path fill="#00d7fe" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256z" />
      <path fill="#00f076" d="M325.3 234.3L104.6 13l280.8 161.2z" />
      <path fill="#ff3a44" d="M104.6 499l280.8-161.2-60.1-60.1z" />
      <path fill="#ffd500" d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z" />
    </svg>
  );
}

// Official-style store badges (black, store logo, two-line label).
export function StoreBadge({ store, href, locale = "fr", soon = false }: { store: "apple" | "google"; href?: string; locale?: "fr" | "en" | "es"; soon?: boolean }) {
  const top = store === "apple" ? { fr: "Télécharger dans", en: "Download on the", es: "Descárgalo en" }[locale] : { fr: "Disponible sur", en: "Get it on", es: "Disponible en" }[locale];
  const name = store === "apple" ? "App Store" : "Google Play";
  const inner = (
    <>
      {store === "apple" ? (
        <svg viewBox="0 0 384 512" className="size-6 shrink-0 fill-white sm:size-7" aria-hidden="true"><path d={APPLE} /></svg>
      ) : (
        <PlayLogo className="size-5 shrink-0 sm:size-6" />
      )}
      <span className="text-left leading-none">
        <span className="block whitespace-nowrap text-[9px] tracking-wide text-white/80 sm:text-[10px]">{soon ? { fr: "Bientôt sur", en: "Coming to", es: "Pronto en" }[locale] : top}</span>
        <span className="mt-0.5 block whitespace-nowrap text-base font-semibold tracking-tight text-white sm:mt-1 sm:text-[19px]">{name}</span>
      </span>
    </>
  );
  const cls = cn("inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-[12px] border border-white/25 bg-black px-3 transition-transform duration-300 sm:h-14 sm:justify-start sm:gap-3 sm:rounded-[14px] sm:px-4 sm:pr-5", href && "hover:-translate-y-0.5 hover:border-white/50", soon && "opacity-80");
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${top} ${name}`}>{inner}</a>
  ) : (
    <span className={cls} aria-label={`${name} – ${soon ? "bientôt" : ""}`}>{inner}</span>
  );
}

function Finder({ x0, y0 }: { x0: number; y0: number }) {
  return (
    <g>
      <rect x={x0 + 0.5} y={y0 + 0.5} width="6" height="6" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x={x0 + 2} y={y0 + 2} width="3" height="3" rx="0.8" />
    </g>
  );
}

// Deterministic pseudo-random bit for cell (r, c).
const bit = (r: number, c: number, seed: number) => (Math.sin(r * 12.9898 + c * 78.233 + seed * 3.7) * 43758.5453) % 1;

// Decorative QR-style code (replace with the real store link QR before launch).
export function QrCode({ className, seed = 7 }: { className?: string; seed?: number }) {
  const n = 25;
  const reserved = (r: number, c: number) => (r < 8 && c < 8) || (r < 8 && c > n - 9) || (r > n - 9 && c < 8);
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (reserved(r, c)) continue;
      if (Math.abs(bit(r, c, seed)) > 0.5) cells.push(<rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" rx="0.25" />);
    }
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className={className} fill="currentColor" aria-hidden="true">
      {cells}
      <Finder x0={0} y0={0} />
      <Finder x0={n - 7} y0={0} />
      <Finder x0={0} y0={n - 7} />
    </svg>
  );
}
