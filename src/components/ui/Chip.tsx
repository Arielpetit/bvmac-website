import { cn } from "@/lib/cn";
import { Flag } from "./Flag";
import type { CountryCode } from "@/lib/navigation";

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-surface-alt px-2.5 py-0.5 text-xs font-medium text-heading",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CountryChip({ code, label, className }: { code: CountryCode; label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-sm text-text",
        className,
      )}
    >
      <Flag code={code} />
      {label}
    </span>
  );
}

export type ChipState = "open" | "preopen" | "closed" | "delayed";

export function StatusDot({ state, label, className }: { state: ChipState; label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium backdrop-blur",
        state === "open" && "bg-rise-bg text-rise",
        state === "preopen" && "bg-accent-soft text-accent-text",
        state === "closed" && "bg-surface-alt text-muted",
        state === "delayed" && "bg-[#e6eef8] text-[#2464a8] dark:bg-[#1d2b3d] dark:text-[#9cc0ec]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          state === "open" && "animate-live text-rise",
          state === "open" && "bg-rise",
          state === "preopen" && "bg-brand-gold",
          state === "closed" && "bg-muted",
          state === "delayed" && "bg-[#2464a8]",
        )}
      />
      {label}
    </span>
  );
}
