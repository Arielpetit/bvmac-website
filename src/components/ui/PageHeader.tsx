import { Reveal } from "@/components/motion/Reveal";
import { HeaderMotif } from "@/components/brand/HeaderMotif";

// Inner-page hero: eyebrow, serif title and intro, with faint CEMAC contour lines on the
// right (desktop). No photo, so every page opens the same way and content starts higher.
export function PageHeader({
  title,
  intro,
  overline,
  meta,
  leading,
  children,
}: {
  title: string;
  intro?: string;
  overline?: string;
  meta?: React.ReactNode;
  leading?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-surface">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-brand-gold/10 blur-3xl" />
      <HeaderMotif className="right-[2%] top-[60px] -bottom-28 w-[440px]" />
      <div className="container-site relative pb-10 pt-[112px] md:pb-12 md:pt-[124px]">
        <Reveal className="max-w-3xl">
          {leading && <div className="mb-6">{leading}</div>}
          {overline && <p className="eyebrow mb-4">{overline}</p>}
          <h1 className="text-h1">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-lg text-muted">{intro}</p>}
        </Reveal>
        {meta && <div className="mt-6 flex flex-wrap items-center gap-3">{meta}</div>}
        {children}
      </div>
    </header>
  );
}
