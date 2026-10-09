import type { CountryCode } from "@/lib/navigation";

// Simplified CEMAC flags. Flag colours appear only here and in country chips.
export function Flag({ code, className = "h-3.5 w-5" }: { code: CountryCode; className?: string }) {
  const common = { viewBox: "0 0 30 20", className: `${className} shrink-0 rounded-[2px] ring-1 ring-black/10`, "aria-hidden": true };
  switch (code) {
    case "CM":
      return (
        <svg {...common}>
          <rect width="10" height="20" fill="#007a5e" />
          <rect x="10" width="10" height="20" fill="#ce1126" />
          <rect x="20" width="10" height="20" fill="#fcd116" />
          <polygon points="15,6.5 16,9.6 19.2,9.6 16.6,11.5 17.6,14.6 15,12.7 12.4,14.6 13.4,11.5 10.8,9.6 14,9.6" fill="#fcd116" />
        </svg>
      );
    case "CF":
      return (
        <svg {...common}>
          <rect width="30" height="5" fill="#003082" />
          <rect y="5" width="30" height="5" fill="#ffffff" />
          <rect y="10" width="30" height="5" fill="#289728" />
          <rect y="15" width="30" height="5" fill="#ffce00" />
          <rect x="13" width="4" height="20" fill="#d21034" />
          <polygon points="5,0.8 5.6,2.4 7.3,2.4 5.9,3.4 6.5,5 5,4 3.5,5 4.1,3.4 2.7,2.4 4.4,2.4" fill="#ffce00" />
        </svg>
      );
    case "CG":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#fbde4a" />
          <polygon points="0,0 20,0 0,20" fill="#009543" />
          <polygon points="30,0 30,20 10,20" fill="#dc241f" />
        </svg>
      );
    case "GA":
      return (
        <svg {...common}>
          <rect width="30" height="6.67" fill="#009e60" />
          <rect y="6.67" width="30" height="6.67" fill="#fcd116" />
          <rect y="13.33" width="30" height="6.67" fill="#3a75c4" />
        </svg>
      );
    case "GQ":
      return (
        <svg {...common}>
          <rect width="30" height="6.67" fill="#3e9a00" />
          <rect y="6.67" width="30" height="6.67" fill="#ffffff" />
          <rect y="13.33" width="30" height="6.67" fill="#e32118" />
          <polygon points="0,0 8,10 0,20" fill="#0073ce" />
        </svg>
      );
    case "TD":
      return (
        <svg {...common}>
          <rect width="10" height="20" fill="#002664" />
          <rect x="10" width="10" height="20" fill="#fecb00" />
          <rect x="20" width="10" height="20" fill="#c60c30" />
        </svg>
      );
  }
}
