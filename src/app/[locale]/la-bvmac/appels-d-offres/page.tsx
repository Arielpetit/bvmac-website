import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { formatDate } from "@/lib/format";
import { TENDERS } from "@/data/institution";
import { ContentPage } from "@/components/content/ContentPage";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/appels-d-offres">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.tenders);
}

export default async function TendersPage({ params }: PageProps<"/[locale]/la-bvmac/appels-d-offres">) {
  const { locale, dict } = await resolveLocale(params);
  const open = TENDERS.filter((t) => t.open);
  const closed = TENDERS.filter((t) => !t.open);
  const list = (items: typeof TENDERS) => (
    <Stagger as="ul" className="grid gap-3">
      {items.map((t) => (
        <StaggerItem as="li" key={t.ref}>
          <a href={t.url} target="_blank" rel="noopener noreferrer" className="card-lift group grid gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-line px-2.5 py-0.5 font-medium text-heading">{t.type}</span>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium", t.open ? "bg-rise-bg text-rise" : "bg-surface-alt text-muted")}>
                  <span className={cn("size-1.5 rounded-full", t.open ? "animate-live bg-rise" : "bg-muted")} />{t.open ? "Ouvert" : "Clos"}
                </span>
              </div>
              <h2 lang="fr" className="mt-3 text-lg font-medium text-heading group-hover:text-link">{t.title}</h2>
              <p className="code mt-1 text-muted">{t.ref}</p>
              <p className="mt-2 text-sm text-muted">
                Publié le {formatDate(t.published, locale, "short")}
                {t.deadline && <> · Date limite : {formatDate(t.deadline, locale, "short")}</>}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted group-hover:text-link">Voir le dossier<ArrowUpRight aria-hidden="true" className="size-4" /><span className="sr-only">{dict.a11y.external}</span></span>
          </a>
        </StaggerItem>
      ))}
    </Stagger>
  );
  return (
    <ContentPage locale={locale} dict={dict} group="about" title={dict.nav.items.tenders} intro="Consultations, appels d’offres et offres d’emploi de la BVMAC. Les dossiers complets sont publiés sur le site officiel.">
      <div className="grid gap-14">
        <section aria-labelledby="open-t">
          <h2 id="open-t" className="text-h2">En cours <span className="figure text-muted">({open.length})</span></h2>
          <div className="mt-6">{list(open)}</div>
        </section>
        <section aria-labelledby="closed-t">
          <h2 id="closed-t" className="text-h2">Clôturés <span className="figure text-muted">({closed.length})</span></h2>
          <div className="mt-6">{list(closed)}</div>
        </section>
      </div>
    </ContentPage>
  );
}
