import Image from "next/image";
import { cn } from "@/lib/cn";

// Branded spinner: the BVMAC medal inside a rotating gold arc.
export function Loader({ size = 64, label = "Chargement…", className }: { size?: number; label?: string; className?: string }) {
  return (
    <span role="status" className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 50 50" className="absolute inset-0 animate-spin [animation-duration:1.1s]" aria-hidden="true">
        <circle cx="25" cy="25" r="22" fill="none" stroke="var(--line)" strokeWidth="2.5" />
        <circle cx="25" cy="25" r="22" fill="none" stroke="#c9a23a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="34 140" />
      </svg>
      <Image src="/brand/bvmac-medal.png" alt="" width={size} height={size} className="animate-pulse rounded-full" style={{ width: size * 0.62, height: size * 0.62 }} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
