"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, Printer } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { formatDate } from "@/lib/format";
import type { Path } from "@/data/school";
import { isoDay, useProgress } from "./progress";

// Printable certificate, generated on the device. Name is stored locally only.
export function Certificate({ path, lessons }: { path: Path; lessons: string[] }) {
  const { locale } = useI18n();
  const { progress, ready, setName } = useProgress();
  const remaining = lessons.filter((l) => progress.done[l] === undefined).length;

  if (!ready) return <div className="mx-auto aspect-[1.414] max-w-4xl animate-pulse rounded-[var(--radius-panel)] bg-skeleton" />;

  if (remaining > 0) {
    return (
      <div className="mx-auto max-w-xl rounded-[var(--radius-panel)] border border-line bg-surface p-10 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface-alt text-muted"><Lock aria-hidden="true" className="size-7" /></span>
        <h2 className="text-h2 mt-6">Encore {remaining} leçon{remaining > 1 ? "s" : ""}</h2>
        <p className="mt-2 text-muted">Terminez le parcours « {path.title} » pour débloquer votre certificat.</p>
        <Link href={localePath(locale, `/ecole-de-bourse/parcours/${path.slug}`)} className="mt-6 inline-flex h-11 items-center rounded-full bg-action px-6 text-sm font-medium text-action-text">Reprendre le parcours</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-end gap-3 print:hidden">
        <div className="min-w-60 flex-1">
          <label htmlFor="cert-name" className="mb-1.5 block text-sm font-medium">Votre nom (reste sur cet appareil)</label>
          <input id="cert-name" value={progress.name ?? ""} onChange={(e) => setName(e.target.value)} maxLength={60} className="h-11 w-full rounded-full border border-line bg-surface px-5" />
        </div>
        <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 rounded-full bg-action px-6 text-sm font-medium text-action-text"><Printer aria-hidden="true" className="size-4" />Imprimer / PDF</button>
      </div>
      <article aria-label="Certificat" className="relative mx-auto aspect-[1.414] w-full max-w-4xl overflow-hidden rounded-[var(--radius-panel)] bg-[#fbf6ea] p-[6%] text-[#1a140e] shadow-soft print:rounded-none print:shadow-none">
        <div className="absolute inset-[3%] rounded-[18px] border border-[#c9a23a]" aria-hidden="true" />
        <div className="absolute inset-[4%] rounded-[14px] border border-[#c9a23a]/40" aria-hidden="true" />
        <div className="relative flex h-full flex-col items-center justify-between text-center">
          <Image src="/brand/bvmac-logo-light.png" alt="BVMAC" width={220} height={72} className="h-[9%] w-auto" />
          <div>
            <p className="text-[clamp(0.6rem,1.3vw,0.85rem)] uppercase tracking-[0.3em] text-[#8a6614]">École de la Bourse · Certificat de parcours</p>
            <p className="mt-[3%] text-[clamp(0.75rem,1.5vw,1rem)]">Décerné à</p>
            <p className="font-serif-display mt-1 text-[clamp(1.6rem,5vw,3.5rem)] leading-tight">{progress.name?.trim() || "Votre nom"}</p>
            <p className="mx-auto mt-[2%] max-w-[70%] text-[clamp(0.7rem,1.5vw,1rem)]">pour avoir terminé le parcours</p>
            <p className="font-serif-display mt-1 text-[clamp(1.1rem,3vw,2rem)] italic text-[#8a6614]">{path.title}</p>
          </div>
          <div className="flex w-full items-end justify-between text-[clamp(0.6rem,1.2vw,0.8rem)]">
            <span className="text-left">Le {formatDate(progress.streak.last || isoDay(), locale)}<br /><span className="text-[#6b6155]">Badge « {path.badge} »</span></span>
            <Image src="/brand/bvmac-medal.png" alt="" width={120} height={120} className="h-auto w-[12%]" />
            <span className="text-right text-[#6b6155]">Certificat pédagogique,<br />sans valeur de diplôme</span>
          </div>
        </div>
      </article>
    </div>
  );
}
