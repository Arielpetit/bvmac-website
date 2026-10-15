"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/lib/paths";

const T = {
  fr: { title: "Page introuvable", text: "La page demandée n’existe pas ou a été déplacée lors de la refonte du site. Utilisez la recherche (Ctrl K) ou l’un des raccourcis.", home: "Retour à l’accueil", links: [["/marches", "Marchés", "Cours, BOC, capitalisation"], ["/avis-et-communiques", "Avis et communiqués", "Publications officielles"], ["/ecole-de-bourse", "École de la Bourse", "Apprendre la bourse"]] },
  en: { title: "Page not found", text: "The page you requested does not exist or was moved when the website was redesigned. Use search (Ctrl K) or one of the shortcuts.", home: "Back to the home page", links: [["/marches", "Markets", "Prices, BOC, capitalisation"], ["/avis-et-communiques", "Notices and releases", "Official publications"], ["/ecole-de-bourse", "Stock Market School", "Learn about the stock market"]] },
  es: { title: "Página no encontrada", text: "La página solicitada no existe o se trasladó durante el rediseño del sitio. Utilice la búsqueda (Ctrl K) o uno de los accesos directos.", home: "Volver al inicio", links: [["/marches", "Mercados", "Cotizaciones, BOC, capitalización"], ["/avis-et-communiques", "Avisos y comunicados", "Publicaciones oficiales"], ["/ecole-de-bourse", "Escuela de Bolsa", "Aprender la bolsa"]] },
};

// Rendered inside the locale layout, so the visitor's language is known from the provider.
export default function NotFound() {
  const { locale } = useI18n();
  const t = T[locale];
  return (
    <section className="container-site grid min-h-[80svh] content-center gap-14 py-32 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div>
        <p className="font-serif-display text-[clamp(6rem,18vw,14rem)] leading-none text-accent-text/30">404</p>
        <h1 className="text-h1 -mt-4">{t.title}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{t.text}</p>
        <Link href={localePath(locale, "/")} className="mt-8 inline-flex h-12 items-center rounded-full bg-action px-6 font-medium text-action-text hover:bg-action-hover">{t.home}</Link>
      </div>
      <ul className="grid gap-3">
        {t.links.map(([href, label, text]) => (
          <li key={href}>
            <Link href={localePath(locale, href)} className="card-lift group flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <span><span className="block font-medium text-heading">{label}</span><span className="text-sm text-muted">{text}</span></span>
              <ArrowUpRight aria-hidden="true" className="size-5 text-muted transition-transform group-hover:rotate-45 group-hover:text-link" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
