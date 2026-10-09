"use client";

import { useState } from "react";
import { Check, Link2, Mail } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { LinkedinIcon, XIcon } from "@/components/ui/SocialIcons";
import { useHydrated } from "@/lib/client-store";

// Plain share links (no third-party script, no tracking).
export function ShareButtons({ title }: { title: string }) {
  const { locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const L = { fr: ["Partager", "Copier le lien", "Lien copié"], en: ["Share", "Copy link", "Link copied"], es: ["Compartir", "Copiar enlace", "Enlace copiado"] }[locale];
  const hydrated = useHydrated();
  const url = hydrated ? window.location.href : "";
  const enc = encodeURIComponent;
  const btn = "inline-flex size-10 items-center justify-center rounded-full border border-line text-heading transition-colors hover:border-line-strong hover:bg-surface-alt";
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm text-muted">{L[0]}</span>
      <button type="button" className={btn} onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} }}>
        {copied ? <Check aria-hidden="true" className="size-4 text-rise" /> : <Link2 aria-hidden="true" className="size-4" />}
        <span className="sr-only">{copied ? L[2] : L[1]}</span>
      </button>
      <a className={btn} href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer"><XIcon className="size-4" /><span className="sr-only">X</span></a>
      <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer"><LinkedinIcon className="size-4" /><span className="sr-only">LinkedIn</span></a>
      <a className={btn} href={`mailto:?subject=${enc(title)}&body=${enc(url)}`}><Mail aria-hidden="true" className="size-4" /><span className="sr-only">E-mail</span></a>
      <span role="status" className="sr-only">{copied ? L[2] : ""}</span>
    </div>
  );
}
