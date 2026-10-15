import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { PageHeader } from "@/components/ui/PageHeader";
import { LastUpdated } from "@/components/ui/States";
import { formatDate } from "@/lib/format";

const L = {
  fr: { updated: "Dernière mise à jour", toc: "Sommaire" },
  en: { updated: "Last updated", toc: "Contents" },
  es: { updated: "Última actualización", toc: "Índice" },
};

export function LegalPage({ locale, title, updated, toc, children }: { locale: Locale; dict?: Dictionary; title: string; updated: string; toc?: { id: string; label: string }[]; children: React.ReactNode }) {
  const l = L[locale];
  return (
    <>
      <PageHeader title={title} meta={<LastUpdated date={/^\d{4}-\d{2}-\d{2}$/.test(updated) ? formatDate(updated, locale) : updated} label={l.updated} />} />
      <div lang={locale} className={cn("container-site grid gap-12 pt-10 pb-14 md:pt-12 md:pb-20", toc && "lg:grid-cols-[220px_1fr]")}>
        {toc ? (
          <nav aria-label={l.toc} className="hidden h-fit lg:sticky lg:top-32 lg:block">
            <p className="eyebrow">{l.toc}</p>
            <ul className="mt-4 grid gap-2 border-l border-line text-sm">
              {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-muted hover:border-brand-gold hover:text-heading">{t.label}</a></li>)}
            </ul>
          </nav>
        ) : null}
        <div className="max-w-3xl">
          <div className="prose-bvmac [&_h2]:scroll-mt-32">{children}</div>
        </div>
      </div>
    </>
  );
}
