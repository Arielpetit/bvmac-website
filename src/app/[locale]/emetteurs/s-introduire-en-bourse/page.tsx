import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, FileCheck2, Mail, UserRound } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion, Faq } from "@/components/ui/Accordion";
import { Callout } from "@/components/ui/Callout";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/s-introduire-en-bourse">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.ipo);
}

const STEPS = [
  { title: "Préparation", who: "Entreprise", delay: "6 à 12 mois", text: "Mise en conformité juridique (société anonyme), audit des comptes, gouvernance et communication financière.", docs: ["Statuts de société anonyme", "États financiers certifiés des 3 derniers exercices", "Plan d’affaires"] },
  { title: "Choix d’une société de bourse", who: "Entreprise", delay: "2 à 4 semaines", text: "La société de bourse, chef de file, accompagne l’émetteur, prépare l’offre et place les titres auprès des investisseurs.", docs: ["Mandat signé avec la société de bourse", "Lettre d’engagement des conseils"] },
  { title: "Dossier d’admission", who: "Entreprise et conseils", delay: "1 à 2 mois", text: "Dépôt du dossier à la BVMAC et du document d’information soumis au visa de la COSUMAF.", docs: ["Demande d’admission", "Document d’information (prospectus)", "Rapport d’évaluation"] },
  { title: "Examen par le Comité d’Admission", who: "BVMAC", delay: "Selon calendrier du Comité", text: "Le Comité d’Admission et de Développement examine la demande au regard des conditions du compartiment visé.", docs: ["Réponses aux questions du Comité"] },
  { title: "Visa, décision et avis", who: "BVMAC · COSUMAF", delay: "Variable", text: "La décision est publiée par avis de la BVMAC ; l’offre au public peut s’ouvrir après le visa de la COSUMAF.", docs: ["Visa COSUMAF", "Avis d’admission BVMAC"] },
  { title: "Souscription et première cotation", who: "BVMAC · sociétés de bourse", delay: "2 à 4 semaines", text: "Période de souscription, centralisation des ordres puis inscription à la cote et premier jour de négociation, souvent marqué par une cérémonie.", docs: ["Résultats de l’offre", "Avis de première cotation"] },
];

const FAQ = [
  { q: "Combien de temps dure une introduction en bourse ?", a: "Comptez en général entre 9 et 18 mois entre le début de la préparation et la première cotation, selon l’état de préparation de l’entreprise." },
  { q: "Faut-il être une grande entreprise ?", a: "Non. Les conditions varient selon le compartiment de la cote. Le test d’éligibilité vous donne une première indication." },
  { q: "Existe-t-il des aides pour financer l’introduction ?", a: "Oui. En 2026, un appel à manifestation d’intérêt a permis de sélectionner des sociétés bénéficiant d’une prise en charge des frais d’introduction en bourse." },
  { q: "Quelles obligations après la cotation ?", a: "Publier les états financiers annuels et semestriels, informer le marché de tout événement important et respecter les règles de gouvernance." },
];

export default async function IpoPage({ params }: PageProps<"/[locale]/emetteurs/s-introduire-en-bourse">) {
  const { locale, dict } = await resolveLocale(params);
  const p = (path: string) => localePath(locale, path);
  return (
    <ContentPage locale={locale} dict={dict} group="issuers" title={dict.nav.items.ipo} intro="Lever des fonds en bourse, étape par étape : actions ou obligations, de la préparation à la première cotation." image="/photos/ceremony-podium.webp">
      <div className="grid gap-24">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <section aria-labelledby="steps">
            <p className="eyebrow">Le parcours</p>
            <h2 id="steps" className="text-h2 mt-3">Six étapes vers la cote</h2>
            <p className="mt-3 text-muted">Ouvrez chaque étape pour voir les documents attendus, le délai indicatif et qui pilote.</p>
            <Accordion
              numbered
              defaultOpen={["s0"]}
              className="mt-8"
              items={STEPS.map((s, i) => ({
                id: `s${i}`,
                title: s.title,
                meta: s.delay,
                content: (
                  <div className="grid gap-5">
                    <p>{s.text}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <p className="flex items-center gap-2 text-sm"><UserRound aria-hidden="true" className="size-4 text-accent-text" />Pilote : <span className="text-heading">{s.who}</span></p>
                      <p className="flex items-center gap-2 text-sm"><Clock aria-hidden="true" className="size-4 text-accent-text" />Délai indicatif : <span className="text-heading">{s.delay}</span></p>
                    </div>
                    <ul className="grid gap-2">
                      {s.docs.map((d) => <li key={d} className="flex items-center gap-2 text-sm"><FileCheck2 aria-hidden="true" className="size-4 text-rise" />{d}</li>)}
                    </ul>
                  </div>
                ),
              }))}
            />
          </section>
          <aside className="grid h-fit gap-4 lg:sticky lg:top-40">
            <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-7 text-brand-sand">
              <Image src="/photos/ceremony-handshake.webp" alt="" fill sizes="400px" className="object-cover opacity-20" />
              <div className="relative">
                <h2 className="font-serif-display text-2xl text-brand-ivory">Parler à l’équipe Admission</h2>
                <p className="mt-2 text-sm text-brand-sand/75">Un premier échange permet de vérifier l’éligibilité et le calendrier de votre projet.</p>
                <ButtonLink href={p("/contact")} variant="gold" className="mt-6"><Mail aria-hidden="true" className="size-4" />Nous contacter</ButtonLink>
              </div>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <p className="text-h3">Outils</p>
              <ul className="mt-3 grid gap-1">
                {[["/emetteurs/test-d-eligibilite", "Test d’éligibilité"], ["/emetteurs/conditions-d-admission", "Conditions d’admission"], ["/emetteurs/commissions", "Commissions d’admission et de cotation"]].map(([href, label]) => (
                  <li key={href}><Link href={p(href)} className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-surface-alt">{label}<ArrowUpRight aria-hidden="true" className="size-4 text-muted group-hover:text-link" /></Link></li>
                ))}
              </ul>
            </div>
            <Callout>Étapes et délais indicatifs, à valider avec l’équipe Admission de la BVMAC.</Callout>
          </aside>
        </div>
        <Reveal><Faq items={FAQ} /></Reveal>
      </div>
    </ContentPage>
  );
}
