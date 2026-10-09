import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Callout } from "@/components/ui/Callout";

// Long-form message from a leader, with a large pull quote and portrait.
export function LeaderMessage({ role, quote, paragraphs, photo, backHref, backLabel }: { role: string; quote: string; paragraphs: string[]; photo: string; backHref: string; backLabel: string }) {
  return (
    <article className="grid gap-12 lg:grid-cols-[360px_1fr]">
      <Reveal className="h-fit lg:sticky lg:top-40">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)] bg-surface-alt">
          <Image src={photo} alt="" fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/90 to-transparent p-6 text-brand-ivory">
            <p className="eyebrow text-brand-gold-light!">{role}</p>
            <p className="mt-1 text-sm text-brand-sand/80">Nom et portrait officiel à fournir par la BVMAC</p>
          </div>
        </div>
        <Link href={backHref} className="link mt-6 inline-flex items-center gap-2 text-sm"><ArrowLeft aria-hidden="true" className="size-4" />{backLabel}</Link>
      </Reveal>
      <div>
        <Reveal>
          <Quote aria-hidden="true" className="size-10 text-brand-gold" strokeWidth={1.2} />
          <p lang="fr" className="font-serif-display mt-4 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.2] text-heading">{quote}</p>
        </Reveal>
        <div lang="fr" className="prose-bvmac mt-10">
          {paragraphs.map((p, i) => <Reveal key={i} delay={0.05}><p>{p}</p></Reveal>)}
        </div>
        <Callout tone="warning" className="mt-8 max-w-[68ch]">Texte provisoire rédigé pour la maquette, à remplacer par le message officiel.</Callout>
      </div>
    </article>
  );
}
