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
        "relative isolate overflow-hidden py-16 md:py-24",
        tone === "alt" && "bg-surface-alt",
        tone === "surface" && "bg-surface",
        tone === "dark" && "bg-espresso text-brand-sand",
        className,
      )}
    >
      {(tone === "default" || tone === "alt") && (
        // Faint dot field and gold glow behind the section heading; content areas stay plain.
        <>
          <span aria-hidden="true" className="dots absolute left-0 top-0 -z-10 h-72 w-[min(640px,90%)] opacity-60 [mask-image:radial-gradient(ellipse_at_20%_20%,black_10%,transparent_70%)]" />
          <span aria-hidden="true" className="absolute -right-32 -top-32 -z-10 size-[420px] rounded-full bg-brand-gold/[0.07] blur-3xl" />
        </>
      )}
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
