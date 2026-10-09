import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { localePath } from "@/lib/paths";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";
import { LastUpdated } from "@/components/ui/States";

export function LegalPage({ locale, dict, title, updated, toc, children }: { locale: Locale; dict: Dictionary; title: string; updated: string; toc?: { id: string; label: string }[]; children: React.ReactNode }) {
  return (
    <>
      <PageHeader title={title} breadcrumbLabel={dict.a11y.breadcrumb} breadcrumb={[{ label: dict.nav.home, href: localePath(locale, "/") }, { label: title }]} meta={<LastUpdated date={updated} label="Dernière mise à jour" />} />
      <div lang="fr" className="container-site grid gap-12 py-14 md:py-20 lg:grid-cols-[220px_1fr]">
        {toc ? (
          <nav aria-label="Sommaire" className="hidden h-fit lg:sticky lg:top-32 lg:block">
            <p className="eyebrow">Sommaire</p>
            <ul className="mt-4 grid gap-2 border-l border-line text-sm">
              {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-muted hover:border-brand-gold hover:text-heading">{t.label}</a></li>)}
            </ul>
          </nav>
        ) : <div className="hidden lg:block" />}
        <div className="max-w-3xl">
          <Callout tone="warning" className="mb-10">Projet de texte à valider par le service juridique et le délégué à la protection des données de la BVMAC.</Callout>
          <div className="prose-bvmac [&_h2]:scroll-mt-32">{children}</div>
        </div>
      </div>
    </>
  );
}
