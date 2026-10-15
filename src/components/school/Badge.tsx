import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

// Earned: night brown disc, gold ring, gold-light icon. Locked: sand disc, dashed ring, lock.
export function Badge({ label, detail, earned, icon, lockedLabel = "Verrouillé" }: { label: string; detail: string; earned: boolean; icon: React.ReactNode; lockedLabel?: string }) {
  return (
    <div className="flex w-32 flex-col items-center text-center">
      <span
        className={cn(
          "flex size-20 items-center justify-center rounded-full",
          earned ? "border-2 border-brand-gold bg-espresso text-brand-gold-light shadow-[0_0_0_6px_rgb(201_162_58/0.15)]" : "border-2 border-dashed border-muted/50 bg-surface-alt text-muted",
        )}
      >
        {earned ? icon : <Lock aria-hidden="true" className="size-7" strokeWidth={1.8} />}
      </span>
      <span className="mt-2 text-sm font-medium text-heading">{label}</span>
      <span className="text-xs text-muted">{earned ? detail : `${lockedLabel} · ${detail}`}</span>
    </div>
  );
}
