import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Rendered inside the locale layout; kept language-neutral because the
// segment value is not available here.
export default function NotFound() {
  const links = [
    ["/fr/marches", "Marchés", "Cours, BOC, capitalisation"],
    ["/fr/avis-et-communiques", "Avis et communiqués", "Publications officielles"],
    ["/fr/ecole-de-bourse", "École de la Bourse", "Apprendre la bourse"],
  ];
  return (
    <section className="container-site grid min-h-[80svh] content-center gap-14 py-32 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div>
        <p className="font-serif-display text-[clamp(6rem,18vw,14rem)] leading-none text-accent-text/30">404</p>
        <h1 className="text-h1 -mt-4">Page introuvable</h1>
        <p lang="en" className="mt-2 text-muted">Page not found · <span lang="es">Página no encontrada</span></p>
        <p className="mt-6 max-w-xl text-lg text-muted">La page demandée n’existe pas ou a été déplacée lors de la refonte du site. Utilisez la recherche (Ctrl K) ou l’un des raccourcis.</p>
        <Link href="/fr" className="mt-8 inline-flex h-12 items-center rounded-full bg-action px-6 font-medium text-action-text hover:bg-action-hover">Retour à l’accueil</Link>
      </div>
      <ul className="grid gap-3">
        {links.map(([href, label, text]) => (
          <li key={href}>
            <Link href={href} className="card-lift group flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <span><span className="block font-medium text-heading">{label}</span><span className="text-sm text-muted">{text}</span></span>
              <ArrowUpRight aria-hidden="true" className="size-5 text-muted transition-transform group-hover:rotate-45 group-hover:text-link" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
