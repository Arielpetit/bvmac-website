import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";

export function Section({
  children,
  className,
  tone = "default",
  id,
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "alt" | "surface" | "dark";
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative py-20 md:py-28",
        tone === "alt" && "bg-surface-alt",
        tone === "surface" && "bg-surface",
        tone === "dark" && "bg-espresso text-brand-sand",
        className,
      )}
    >
      <div className="container-site">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  overline,
  title,
  intro,
  action,
  tone = "default",
  className,
}: {
  id?: string;
  overline?: string;
  title: string;
  intro?: string;
  action?: React.ReactNode;
  tone?: "default" | "dark";
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-12 flex flex-wrap items-end justify-between gap-6", className)}>
      <div className="max-w-2xl">
        {overline && <p className={cn("eyebrow mb-4", tone === "dark" && "text-brand-gold-light!")}>{overline}</p>}
        <h2 id={id} className={cn("text-h2", tone === "dark" && "text-brand-ivory!")}>
          {title}
        </h2>
        {intro && <p className={cn("mt-4 text-lg", tone === "dark" ? "text-brand-sand/75" : "text-muted")}>{intro}</p>}
      </div>
      {action}
    </Reveal>
  );
}
