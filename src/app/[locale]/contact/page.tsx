import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Newspaper, Phone } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { getContact } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForms } from "@/components/content/ContactForms";
import { FacebookIcon, LinkedinIcon, XIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Contact" };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale, dict } = await resolveLocale(params);
  const CONTACT = await getContact();
  const socials = [
    [CONTACT.social.facebook, FacebookIcon, "Facebook"],
    [CONTACT.social.x, XIcon, "X"],
    [CONTACT.social.linkedin, LinkedinIcon, "LinkedIn"],
    [CONTACT.social.youtube, YoutubeIcon, "YouTube"],
  ] as const;
  return (
    <>
      <PageHeader
        title={dict.nav.contact}
        intro="Une question sur le marché, une réclamation ou une demande presse : écrivez-nous, vous recevrez une référence de suivi."
        image="/photos/bvmac-building.webp"
        breadcrumbLabel={dict.a11y.breadcrumb}
        breadcrumb={[{ label: dict.nav.home, href: localePath(locale, "/") }, { label: dict.nav.contact }]}
      />
      <div className="container-site grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_1.5fr]">
        <Reveal className="grid h-fit gap-4">
          <div className="rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand">
            <p className="eyebrow text-brand-gold-light!">Siège</p>
            <h2 className="font-serif-display mt-3 text-2xl text-brand-ivory">Bourse des Valeurs Mobilières de l’Afrique Centrale</h2>
            <ul className="mt-6 grid gap-4 text-sm">
              <li className="flex gap-3"><MapPin aria-hidden="true" className="size-5 shrink-0 text-brand-gold" strokeWidth={1.5} />{CONTACT.address[1]}, {CONTACT.address[0]}</li>
              <li className="flex gap-3"><Phone aria-hidden="true" className="size-5 shrink-0 text-brand-gold" strokeWidth={1.5} /><a href={CONTACT.phoneHref} className="hover:text-brand-ivory">{CONTACT.phone}</a></li>
              <li className="flex gap-3"><Mail aria-hidden="true" className="size-5 shrink-0 text-brand-gold" strokeWidth={1.5} /><a href={`mailto:${CONTACT.email}`} className="hover:text-brand-ivory">{CONTACT.email}</a></li>
              <li className="flex gap-3"><Clock aria-hidden="true" className="size-5 shrink-0 text-brand-gold" strokeWidth={1.5} />Du lundi au vendredi · horaires d’accueil à confirmer</li>
            </ul>
            <ul className="mt-8 flex gap-2 border-t border-white/10 pt-6">
              {socials.map(([href, Icon, label]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${dict.a11y.external}`} className="flex size-10 items-center justify-center rounded-full border border-white/15 hover:border-brand-gold hover:text-brand-gold-light"><Icon className="size-4" /></a>
                </li>
              ))}
            </ul>
          </div>
          <Link href={localePath(locale, "/actualites/espace-presse")} className="card-lift group flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-text"><Newspaper aria-hidden="true" className="size-5" strokeWidth={1.5} /></span>
            <span className="flex-1"><span className="block font-medium text-heading">Journalistes</span><span className="text-sm text-muted">Espace presse : contacts, logos et chiffres clés</span></span>
            <ArrowUpRight aria-hidden="true" className="size-5 text-muted transition-transform group-hover:rotate-45 group-hover:text-link" />
          </Link>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-alt">
            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden="true" />
            <div className="relative text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-gold text-espresso shadow-soft"><MapPin aria-hidden="true" className="size-6" /></span>
              <p className="mt-3 font-medium text-heading">Immeuble de la Bourse, Douala</p>
              <p className="text-xs text-muted">Plan d’accès statique à intégrer (sans service de cartographie tiers)</p>
            </div>
          </div>
        </Reveal>
        <ContactForms />
      </div>
    </>
  );
}
