import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-xl bg-skeleton", className)} />;
}

export function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface p-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-surface-alt">
        <Search aria-hidden="true" className="size-5 text-accent-text" strokeWidth={1.6} />
      </span>
      <p className="text-muted">{message}</p>
      {action}
    </div>
  );
}

export function LastUpdated({ date, label }: { date: string; label: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-sm text-muted">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-gold" />
      {label} : <time>{date}</time>
    </p>
  );
}
