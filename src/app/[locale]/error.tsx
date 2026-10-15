"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";

const T = {
  fr: { eyebrow: "Erreur 500", title: "Une erreur est survenue de notre côté.", text: "Le problème a été signalé à l’équipe technique. Réessayez dans un instant ; si le problème persiste, contactez-nous.", ref: "Référence", retry: "Réessayer", home: "Accueil", contact: "Contact" },
  en: { eyebrow: "Error 500", title: "Something went wrong on our side.", text: "The problem has been reported to the technical team. Please try again in a moment; if it persists, contact us.", ref: "Reference", retry: "Try again", home: "Home", contact: "Contact" },
  es: { eyebrow: "Error 500", title: "Se ha producido un error por nuestra parte.", text: "El problema se ha comunicado al equipo técnico. Vuelva a intentarlo en un momento; si persiste, contáctenos.", ref: "Referencia", retry: "Reintentar", home: "Inicio", contact: "Contacto" },
};

// Error boundary for all localised pages (status 500 equivalent).
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale } = useI18n();
  const t = T[locale];
  return (
    <section className="container-site flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="text-h1 mt-4 max-w-3xl">{t.title}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{t.text}</p>
      {error.digest && <p className="code mt-4 text-muted">{t.ref} : {error.digest}</p>}
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="inline-flex h-12 items-center gap-2 rounded-full bg-action px-6 font-medium text-action-text hover:bg-action-hover"><RotateCcw aria-hidden="true" className="size-4" />{t.retry}</button>
        <Link href={localePath(locale, "/")} className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium hover:border-action">{t.home}</Link>
        <Link href={localePath(locale, "/contact")} className="inline-flex h-12 items-center px-4 text-link hover:underline">{t.contact}</Link>
      </div>
    </section>
  );
}
