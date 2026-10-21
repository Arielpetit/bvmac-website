import { cn } from "@/lib/cn";

// The BVMAC assistant mascot: a gold coin with the Bourse pediment as
// a cap and a friendly face. Eyes blink; they bounce while the assistant thinks.
export function BvmacAvatar({ className, thinking = false }: { className?: string; thinking?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id="bva-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e2b0" />
          <stop offset="0.5" stopColor="#c9a23a" />
          <stop offset="1" stopColor="#8a6614" />
        </linearGradient>
        <radialGradient id="bva-face" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#3a2414" />
          <stop offset="1" stopColor="#120c06" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#bva-rim)" />
      <circle cx="32" cy="32" r="28.5" fill="none" stroke="#120c06" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="1.2 2.2" />
      <circle cx="32" cy="32" r="25.5" fill="url(#bva-face)" />
      {/* pediment cap */}
      <path d="M19 22.5 L32 13.5 L45 22.5 Z" fill="url(#bva-rim)" />
      <rect x="18" y="23.2" width="28" height="2.6" rx="1.3" fill="#ead18a" />
      <circle cx="32" cy="19.6" r="1.5" fill="#120c06" />
      {/* eyes */}
      <g className={thinking ? "bva-think" : "bva-blink"} style={{ transformOrigin: "32px 35px" }}>
        <rect x="23" y="31" width="5.4" height="8" rx="2.7" fill="#fbf6ea" />
        <rect x="35.6" y="31" width="5.4" height="8" rx="2.7" fill="#fbf6ea" />
        <circle cx="26.6" cy="33.6" r="1.1" fill="#120c06" />
        <circle cx="39.2" cy="33.6" r="1.1" fill="#120c06" />
      </g>
      {/* smile and cheeks */}
      <path d="M26 44 Q32 49.5 38 44" fill="none" stroke="#ead18a" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="20.5" cy="42" r="2.2" fill="#c9a23a" opacity="0.35" />
      <circle cx="43.5" cy="42" r="2.2" fill="#c9a23a" opacity="0.35" />
    </svg>
  );
}
