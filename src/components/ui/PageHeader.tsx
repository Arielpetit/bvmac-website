import Image from "next/image";
import { Breadcrumb } from "./Breadcrumb";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import { SectionSubnav } from "@/components/market/MarketSubnav";
import type { NavGroupKey } from "@/lib/navigation";

// Inner-page hero: breadcrumb, eyebrow, serif title, intro, optional photo band.
export function PageHeader({
  title,
  intro,
  overline,
  breadcrumb,
  breadcrumbLabel,
  meta,
  image,
  leading,
  group,
  children,
}: {
  title: string;
  intro?: string;
  overline?: string;
  breadcrumb: { label: string; href?: string }[];
  breadcrumbLabel: string;
  meta?: React.ReactNode;
  image?: string;
  leading?: React.ReactNode;
  group?: NavGroupKey;
  children?: React.ReactNode;
}) {
  return (
    <>
    <header className="relative overflow-hidden border-b border-line bg-surface">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-brand-gold/10 blur-3xl" />
      <div className={cn("container-site relative pb-12 pt-[120px] md:pb-16 md:pt-[136px]", image && "lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-12")}>
        <div>
          <Breadcrumb items={breadcrumb} label={breadcrumbLabel} />
          <Reveal className="mt-8 max-w-3xl">
            {leading && <div className="mb-6">{leading}</div>}
            {overline && <p className="eyebrow mb-4">{overline}</p>}
            <h1 className="text-h1">{title}</h1>
            {intro && <p className="mt-5 max-w-2xl text-lg text-muted">{intro}</p>}
          </Reveal>
          {meta && <div className="mt-6 flex flex-wrap items-center gap-3">{meta}</div>}
          {children}
        </div>
        {image && (
          <Reveal delay={0.1} className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] lg:mt-0 lg:block">
            <Image src={image} alt="" fill sizes="(min-width:1024px) 480px, 100vw" className="object-cover" priority />
          </Reveal>
        )}
      </div>
    </header>
    {group && <SectionSubnav group={group} />}
    </>
  );
}
