import { CircleAlert, Clock, Info, TriangleAlert, WifiOff } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "info" | "warning" | "error" | "closed" | "offline";

const tones: Record<Tone, { cls: string; Icon: typeof Info }> = {
  info: { cls: "bg-surface-alt text-text border-line", Icon: Info },
  warning: { cls: "bg-accent-soft text-text border-brand-gold/40", Icon: TriangleAlert },
  error: { cls: "bg-fall-bg text-fall border-fall/40", Icon: CircleAlert },
  closed: { cls: "bg-surface-alt text-text border-line", Icon: Clock },
  offline: { cls: "bg-brand-gold-light text-brand-night border-brand-gold", Icon: WifiOff },
};

export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { cls, Icon } = tones[tone];
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn("flex gap-3 rounded-2xl border p-4 text-sm", cls, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.8} />
      <div>
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="[&_a]:underline">{children}</div>
      </div>
    </div>
  );
}
