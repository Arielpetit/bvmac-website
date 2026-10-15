import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Newspaper, Phone } from "lucide-react";
import { RealMap } from "@/components/ui/RealMap";

import { resolveLocale } from "@/lib/i18n-server";
import { localePath } from "@/lib/paths";
import { getContact } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForms } from "@/components/content/ContactForms";
import { FacebookIcon, LinkedinIcon, XIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";

// BVMAC head office, 1450 Boulevard de la Liberté, Akwa, Douala (position to be confirmed on site).
const HQ: [number, number] = [4.0575, 9.7003];

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Contact" };
}

const T = {
  fr: { intro: "Une question sur le marché, une réclamation ou une demande presse : écrivez-nous, vous recevrez une référence de suivi.", hq: "Siège", directions: "Itinéraire", name: "Bourse des Valeurs Mobilières de l’Afrique Centrale", hours: "Du lundi au vendredi", press: "Journalistes", pressText: "Espace presse : contacts, logos et chiffres clés", building: "Immeuble de la Bourse, Douala", city: "B.P. 442 Douala, Cameroun" },
  en: { intro: "A question about the market, a complaint or a press enquiry: write to us and you will receive a tracking reference.", hq: "Headquarters", directions: "Directions", name: "Central African Stock Exchange", hours: "Monday to Friday", press: "Journalists", pressText: "Press room: contacts, logos and key figures", building: "Immeuble de la Bourse, Douala", city: "P.O. Box 442 Douala, Cameroon" },
  es: { intro: "Una pregunta sobre el mercado, una reclamación o una solicitud de prensa: escríbanos y recibirá una referencia de seguimiento.", hq: "Sede", directions: "Cómo llegar", name: "Bolsa de Valores de África Central", hours: "De lunes a viernes", press: "Periodistas", pressText: "Sala de prensa: contactos, logotipos y cifras clave", building: "Immeuble de la Bourse, Duala", city: "Apdo. 442 Duala, Camerún" },
};

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
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
        intro={t.intro}
      />
      <div className="container-site grid gap-10 pt-10 pb-14 md:pt-12 md:pb-20 lg:grid-cols-[1fr_1.5fr]">
        <Reveal className="grid h-fit gap-4">
          <div className="rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand">
            <p className="eyebrow text-brand-gold-light!">{t.hq}</p>
            <h2 className="font-serif-display mt-3 text-2xl text-brand-ivory">{t.name}</h2>
            <ul className="mt-6 grid gap-4 text-sm">
              <li className="flex gap-3"><MapPin aria-hidden="true" className="size-5 shrink-0 text-brand-gold" strokeWidth={1.5} />{CONTACT.address[1]}, {CONTACT.address[0]}</li>
              <li className="flex gap-3"><Phone aria-hidden="true" className="size-5 shrink-0 text-brand-gold" strokeWidth={1.5} /><a href={CONTACT.phoneHref} className="hover:text-brand-ivory">{CONTACT.phone}</a></li>
              <li className="flex gap-3"><Mail aria-hidden="true" className="size-5 shrink-0 text-brand-gold" strokeWidth={1.5} /><a href={`mailto:${CONTACT.email}`} className="hover:text-brand-ivory">{CONTACT.email}</a></li>
              <li className="flex gap-3"><Clock aria-hidden="true" className="size-5 shrink-0 text-brand-gold" strokeWidth={1.5} />{t.hours}</li>
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
            <span className="flex-1"><span className="block font-medium text-heading">{t.press}</span><span className="text-sm text-muted">{t.pressText}</span></span>
            <ArrowUpRight aria-hidden="true" className="size-5 text-muted transition-transform group-hover:rotate-45 group-hover:text-link" />
          </Link>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
            <RealMap
              label={t.building}
              center={HQ}
              zoom={16}
              fit={false}
              className="aspect-[4/3] w-full"
              markers={[{ id: "hq", lat: HQ[0], lon: HQ[1], label: `${t.building} · ${t.city}` }]}
            />
            <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
              <span><span className="block font-medium text-heading">{t.building}</span><span className="text-xs text-muted">{t.city}</span></span>
              <a href={`https://www.openstreetmap.org/?mlat=${HQ[0]}&mlon=${HQ[1]}#map=17/${HQ[0]}/${HQ[1]}`} target="_blank" rel="noopener noreferrer" className="link inline-flex shrink-0 items-center gap-1 text-sm">{t.directions}<ArrowUpRight aria-hidden="true" className="size-4" /></a>
            </div>
          </div>
        </Reveal>
        <ContactForms />
      </div>
    </>
  );
}
