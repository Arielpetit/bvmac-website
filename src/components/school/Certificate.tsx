"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, Printer } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";
import { formatDate } from "@/lib/format";
import type { Path } from "@/data/school";
import { isoDay, useProgress } from "./progress";

const L = {
  fr: { left: (n: number) => `Encore ${n} leçon${n > 1 ? "s" : ""}`, finish: (t: string) => `Terminez le parcours « ${t} » pour débloquer votre certificat.`, resume: "Reprendre le parcours", name: "Votre nom (reste sur cet appareil)", print: "Imprimer / PDF", cert: "Certificat", heading: "École de la Bourse · Certificat de parcours", awarded: "Décerné à", yourName: "Votre nom", completed: "pour avoir terminé le parcours", on: "Le", badge: "Badge", note: ["Certificat pédagogique,", "sans valeur de diplôme"] },
  en: { left: (n: number) => `${n} more lesson${n > 1 ? "s" : ""}`, finish: (t: string) => `Complete the “${t}” path to unlock your certificate.`, resume: "Resume the path", name: "Your name (stays on this device)", print: "Print / PDF", cert: "Certificate", heading: "Stock Market School · Path certificate", awarded: "Awarded to", yourName: "Your name", completed: "for completing the path", on: "On", badge: "Badge", note: ["Educational certificate,", "not a diploma"] },
  es: { left: (n: number) => `Faltan ${n} lección${n > 1 ? "es" : ""}`, finish: (t: string) => `Termine el recorrido «${t}» para desbloquear su certificado.`, resume: "Retomar el recorrido", name: "Su nombre (se queda en este dispositivo)", print: "Imprimir / PDF", cert: "Certificado", heading: "Escuela de Bolsa · Certificado de recorrido", awarded: "Otorgado a", yourName: "Su nombre", completed: "por haber terminado el recorrido", on: "El", badge: "Insignia", note: ["Certificado pedagógico,", "sin valor de diploma"] },
};

// Printable certificate, generated on the device. Name is stored locally only.
export function Certificate({ path, lessons }: { path: Path; lessons: string[] }) {
  const { locale } = useI18n();
  const t = L[locale];
  const { progress, ready, setName } = useProgress();
  const remaining = lessons.filter((l) => progress.done[l] === undefined).length;

  if (!ready) return <div className="mx-auto aspect-[1.414] max-w-4xl animate-pulse rounded-[var(--radius-panel)] bg-skeleton" />;

  if (remaining > 0) {
    return (
      <div className="mx-auto max-w-xl rounded-[var(--radius-panel)] border border-line bg-surface p-10 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface-alt text-muted"><Lock aria-hidden="true" className="size-7" /></span>
        <h2 className="text-h2 mt-6">{t.left(remaining)}</h2>
        <p className="mt-2 text-muted">{t.finish(path.title)}</p>
        <Link href={localePath(locale, `/ecole-de-bourse/parcours/${path.slug}`)} className="mt-6 inline-flex h-11 items-center rounded-full bg-action px-6 text-sm font-medium text-action-text">{t.resume}</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-end gap-3 print:hidden">
        <div className="min-w-60 flex-1">
          <label htmlFor="cert-name" className="mb-1.5 block text-sm font-medium">{t.name}</label>
          <input id="cert-name" value={progress.name ?? ""} onChange={(e) => setName(e.target.value)} maxLength={60} className="h-11 w-full rounded-full border border-line bg-surface px-5" />
        </div>
        <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 rounded-full bg-action px-6 text-sm font-medium text-action-text"><Printer aria-hidden="true" className="size-4" />{t.print}</button>
      </div>
      <article aria-label={t.cert} className="relative mx-auto aspect-[1.414] w-full max-w-4xl overflow-hidden rounded-[var(--radius-panel)] bg-[#fbf6ea] p-[6%] text-[#1a140e] shadow-soft print:rounded-none print:shadow-none">
        <div className="absolute inset-[3%] rounded-[18px] border border-[#c9a23a]" aria-hidden="true" />
        <div className="absolute inset-[4%] rounded-[14px] border border-[#c9a23a]/40" aria-hidden="true" />
        <div className="relative flex h-full flex-col items-center justify-between text-center">
          <Image src="/brand/bvmac-logo-light.png" alt="BVMAC" width={220} height={72} className="h-[9%] w-auto" />
          <div>
            <p className="text-[clamp(0.6rem,1.3vw,0.85rem)] uppercase tracking-[0.3em] text-[#8a6614]">{t.heading}</p>
            <p className="mt-[3%] text-[clamp(0.75rem,1.5vw,1rem)]">{t.awarded}</p>
            <p className="font-serif-display mt-1 text-[clamp(1.6rem,5vw,3.5rem)] leading-tight">{progress.name?.trim() || t.yourName}</p>
            <p className="mx-auto mt-[2%] max-w-[70%] text-[clamp(0.7rem,1.5vw,1rem)]">{t.completed}</p>
            <p className="font-serif-display mt-1 text-[clamp(1.1rem,3vw,2rem)] italic text-[#8a6614]">{path.title}</p>
          </div>
          <div className="flex w-full items-end justify-between text-[clamp(0.6rem,1.2vw,0.8rem)]">
            <span className="text-left">{t.on} {formatDate(progress.streak.last || isoDay(), locale)}<br /><span className="text-[#6b6155]">{t.badge} « {path.badge} »</span></span>
            <Image src="/brand/bvmac-medal.png" alt="" width={120} height={120} className="h-auto w-[12%]" />
            <span className="text-right text-[#6b6155]">{t.note[0]}<br />{t.note[1]}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
