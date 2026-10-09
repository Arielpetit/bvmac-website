import { cn } from "@/lib/cn";

// CSS marquee: content duplicated once, paused on hover and for reduced motion.
export function Marquee({ children, className, duration = 50 }: { children: React.ReactNode; className?: string; duration?: number }) {
  return (
    <div className={cn("group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]", className)}>
      <div className="animate-marquee animate-marquee-hover flex w-max" style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
