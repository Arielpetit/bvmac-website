"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

// Error boundary for all localised pages (status 500 equivalent).
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-site flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">Erreur 500</p>
      <h1 className="text-h1 mt-4 max-w-3xl">Une erreur est survenue de notre côté.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">Le problème a été signalé à l’équipe technique. Réessayez dans un instant ; si le problème persiste, contactez-nous.</p>
      <p lang="en" className="mt-2 text-sm text-muted">Something went wrong on our side. Please try again.</p>
      {error.digest && <p className="code mt-4 text-muted">Référence : {error.digest}</p>}
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="inline-flex h-12 items-center gap-2 rounded-full bg-action px-6 font-medium text-action-text hover:bg-action-hover"><RotateCcw aria-hidden="true" className="size-4" />Réessayer</button>
        <Link href="/fr" className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium hover:border-action">Accueil</Link>
        <Link href="/fr/contact" className="inline-flex h-12 items-center px-4 text-link hover:underline">Contact</Link>
      </div>
    </section>
  );
}
