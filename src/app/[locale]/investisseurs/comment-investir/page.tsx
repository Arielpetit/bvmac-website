import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Building2, FileSignature, Scale, Wallet } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Accordion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/Parallax";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/comment-investir">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.howTo);
}

const STEPS = [
  { Icon: Building2, title: "Choisir une société de bourse", text: "Contactez une société de bourse agréée par la COSUMAF, dans votre pays ou ailleurs dans la CEMAC." },
  { Icon: Wallet, title: "Ouvrir un compte titres", text: "La société de bourse ouvre à votre nom un compte pour vos titres et un compte pour vos fonds." },
  { Icon: FileSignature, title: "Lire les conditions", text: "Chaque société de bourse publie ses tarifs : droits de garde et commissions de négociation." },
  { Icon: Scale, title: "Passer vos ordres", text: "Vous transmettez vos ordres d’achat ou de vente ; ils sont exécutés en séance de cotation." },
];

const FAQ = [
  { q: "Qui peut investir à la BVMAC ?", a: "Les particuliers comme les personnes morales : banques, compagnies d’assurance, caisses de retraite, fonds. Chaque investisseur a ses propres objectifs d’horizon et de rendement." },
  { q: "Puis-je acheter des actions directement auprès de la BVMAC ?", a: "Non. Les ordres passent obligatoirement par une société de bourse agréée. La BVMAC organise le marché mais ne reçoit pas d’ordres du public." },
  { q: "Faut-il habiter le pays où la société est cotée ?", a: "Non. Le marché est régional : un résident de l’un des six pays de la CEMAC peut acheter des titres de toutes les sociétés cotées à la BVMAC." },
  { q: "Combien faut-il pour commencer ?", a: "Il n’y a pas de minimum fixé par la BVMAC. Le minimum pratique dépend du prix d’une action et des conditions de votre société de bourse." },
  { q: "Quels documents pour ouvrir un compte ?", a: "En général une pièce d’identité, un justificatif de domicile et un relevé d’identité bancaire. Votre société de bourse vous donnera la liste exacte." },
  { q: "Quand le marché est-il ouvert ?", a: "Les séances de cotation ont lieu chaque jour ouvré selon le calendrier publié par la BVMAC. Consultez la page Calendrier et horaires." },
  { q: "Que devient un actionnaire ?", a: "L’acheteur d’une action devient actionnaire : il peut recevoir des dividendes et voter en assemblée générale." },
  { q: "Où trouver les cours ?", a: "Dans la rubrique Marchés de ce site, dans le Bulletin Officiel de la Cote publié après chaque séance et dans l’application BVMAC." },
  { q: "Mes titres sont-ils en sécurité si ma société de bourse fait faillite ?", a: "Les titres sont inscrits auprès du dépositaire central, séparément des avoirs de l’intermédiaire. Ils restent votre propriété." },
  { q: "Comment déposer une réclamation ?", a: "Adressez-vous d’abord à votre société de bourse. Vous pouvez ensuite utiliser le formulaire de réclamation de la BVMAC ou saisir la COSUMAF." },
];

export default async function HowToPage({ params }: PageProps<"/[locale]/investisseurs/comment-investir">) {
  const { locale, dict } = await resolveLocale(params);
  const p = (path: string) => localePath(locale, path);
  return (
    <ContentPage locale={locale} dict={dict} group="invest" isGroupRoot title={dict.nav.items.howTo} intro="Investir en bourse en Afrique centrale, en quatre étapes simples." image="/photos/ceremony-audience.webp">
      <div className="grid gap-24">
        <section aria-label="Étapes">
          <Stagger as="ol" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ Icon, title, text }, i) => (
              <StaggerItem as="li" key={title} className="card-lift relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface p-7">
                <span aria-hidden="true" className="font-serif-display absolute -right-2 -top-6 text-[8rem] leading-none text-surface-alt">{i + 1}</span>
                <span className="relative flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-text"><Icon aria-hidden="true" className="size-6" strokeWidth={1.4} /></span>
                <h2 className="text-h3 relative mt-10">{title}</h2>
                <p className="relative mt-2 text-sm text-muted">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={p("/participants/societes-de-bourse")}>{dict.nav.items.findBroker}</ButtonLink>
            <ButtonLink href={p("/ecole-de-bourse")} variant="secondary">{dict.nav.school}</ButtonLink>
          </div>
        </section>

        <section aria-labelledby="rights" className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-panel)]">
            <ParallaxImage src="/photos/school-students.webp" alt="Étudiants lors d’une séance de l’École de la Bourse" className="absolute inset-0" />
          </div>
          <Reveal>
            <p className="eyebrow">Être actionnaire</p>
            <h2 id="rights" className="text-h2 mt-3">Vos droits d’actionnaire</h2>
            <ul className="mt-8 grid gap-4">
              {["Droit aux dividendes votés en assemblée générale", "Droit de vote en assemblée générale", "Droit à l’information : rapports, états financiers, avis", "Droit préférentiel lors de certaines augmentations de capital"].map((r) => (
                <li key={r} className="flex gap-4 border-b border-line pb-4 text-[1.0625rem]"><BadgeCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-text" strokeWidth={1.6} />{r}</li>
              ))}
            </ul>
            <Link href={p("/investisseurs/protection")} className="link mt-6 inline-flex items-center gap-1 text-sm">Protection des investisseurs<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          </Reveal>
        </section>

        <Reveal className="relative overflow-hidden rounded-[var(--radius-panel)] bg-espresso p-10 text-brand-ivory md:p-14">
          <Image src="/photos/school-students-2.webp" alt="" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="relative grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-end">
            <div>
              <p className="eyebrow text-brand-gold-light!">Sans risque</p>
              <h2 className="font-serif-display mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight text-brand-ivory">Entraînez-vous avec le portefeuille virtuel</h2>
              <p className="mt-3 text-brand-sand/75">5 millions de FCFA fictifs pour tester vos idées sur les vrais cours de la BVMAC.</p>
            </div>
            <ButtonLink href={p("/ecole-de-bourse/portefeuille-virtuel")} variant="gold" className="md:justify-self-end">Essayer le simulateur</ButtonLink>
          </div>
        </Reveal>

        <Faq items={FAQ} />
      </div>
    </ContentPage>
  );
}
