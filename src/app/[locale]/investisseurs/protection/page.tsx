import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/protection">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.protection);
}

export default async function ProtectionPage({ params }: PageProps<"/[locale]/investisseurs/protection">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="invest" title={dict.nav.items.protection} intro="Les règles du marché et la surveillance de la COSUMAF protègent les épargnants." image="/photos/governance-handover.webp">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
          <ShieldCheck aria-hidden="true" className="size-7 text-accent-text" strokeWidth={1.8} />
          <h2 className="text-h3 mt-3">Vos garanties</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>Seules les sociétés de bourse agréées par la COSUMAF peuvent recevoir vos ordres.</li>
            <li>Les émetteurs publient une information financière contrôlée et des avis officiels.</li>
            <li>La BVMAC surveille en permanence les séances et peut suspendre un titre.</li>
            <li>Les titres sont conservés par le dépositaire central, distinct de votre intermédiaire.</li>
          </ul>
        </div>
        <div className="rounded-[var(--radius-card)] border-2 border-fall/40 bg-fall-bg p-6">
          <TriangleAlert aria-hidden="true" className="size-7 text-fall" strokeWidth={1.8} />
          <h2 className="text-h3 mt-3">Méfiez-vous des sollicitations non autorisées</h2>
          <p className="mt-2 text-sm">Aucun placement ne garantit un rendement élevé sans risque. Vérifiez toujours qu’un intermédiaire figure dans la liste des sociétés de bourse agréées avant de lui confier des fonds.</p>
          <Link href={localePath(locale, "/participants/societes-de-bourse")} className="link mt-3 inline-block text-sm">Vérifier un intermédiaire →</Link>
        </div>
      </div>
      <section aria-labelledby="claim" className="mt-10 rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand">
        <h2 id="claim" className="font-serif-display text-3xl text-brand-ivory">Un problème avec une opération ?</h2>
        <p className="mt-2 max-w-2xl text-sm">Adressez-vous d’abord à votre société de bourse. Si la réponse ne vous satisfait pas, déposez une réclamation auprès de la BVMAC : vous recevrez un numéro de suivi.</p>
        <ButtonLink href={localePath(locale, "/contact?formulaire=reclamation")} variant="gold" className="mt-4">Soumettre une réclamation</ButtonLink>
      </section>
    </ContentPage>
  );
}
