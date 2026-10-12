import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { NAV } from "@/lib/navigation";
import { getContact, getPartners } from "@/lib/api";
import { localePath } from "@/lib/paths";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { CookieSettingsLink } from "./CookieConsent";
import { CurrentYear } from "./CurrentYear";
import { FacebookIcon, LinkedinIcon, XIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";
import { Guilloche } from "@/components/brand/Guilloche";

const CTA = {
  fr: { title: "Investir dans les économies de l’Afrique centrale commence ici.", text: "Trouvez une société de bourse agréée, suivez les cours et apprenez à votre rythme.", a: "Trouver une société de bourse", b: "Commencer à apprendre" },
  en: { title: "Investing in Central Africa’s economies starts here.", text: "Find a licensed broker, follow prices and learn at your own pace.", a: "Find a broker", b: "Start learning" },
  es: { title: "Invertir en las economías de África Central empieza aquí.", text: "Encuentre una sociedad de bolsa autorizada, siga las cotizaciones y aprenda a su ritmo.", a: "Encontrar una sociedad de bolsa", b: "Empezar a aprender" },
};

export async function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [CONTACT, PARTNERS] = await Promise.all([getContact(), getPartners()]);
  const t = dict.footer;
  const c = CTA[locale];
  const p = (path: string) => localePath(locale, path);
  const columns = ["markets", "invest", "learn", "about"].map((k) => NAV.find((g) => g.key === k)!);
  const social = [
    { label: "Facebook", href: CONTACT.social.facebook, Icon: FacebookIcon },
    { label: "X", href: CONTACT.social.x, Icon: XIcon },
    { label: "LinkedIn", href: CONTACT.social.linkedin, Icon: LinkedinIcon },
    { label: "YouTube", href: CONTACT.social.youtube, Icon: YoutubeIcon },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-espresso text-brand-sand">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-brand-gold/10 blur-3xl" />
      <Guilloche className="absolute inset-x-0 top-0 h-80 w-full text-brand-gold-light opacity-[0.09] [mask-image:linear-gradient(90deg,transparent,black_35%,black_100%)]" />
      <div className="container-site relative">
        <Reveal className="grid gap-8 border-b border-white/10 py-16 md:grid-cols-[1.4fr_1fr] md:items-end md:py-20">
          <h2 className="text-h1 max-w-2xl text-brand-ivory!">{c.title}</h2>
          <div>
            <p className="text-brand-sand/80">{c.text}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={p("/participants/societes-de-bourse")} className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-gold px-6 font-medium text-espresso transition-colors hover:bg-brand-gold-light">
                {c.a} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href={p("/ecole-de-bourse")} className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 font-medium text-brand-ivory transition-colors hover:border-white/50">
                {c.b}
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-12 py-14 lg:grid-cols-[1.3fr_2.7fr]">
          <div>
            <Logo variant="dark" className="h-12 w-auto" alt="BVMAC – Bourse des Valeurs Mobilières de l’Afrique Centrale" />
            <p className="mt-5 max-w-sm text-sm text-brand-sand/75">
              {t.company}. {t.capital}.
            </p>
            <ul className="mt-6 grid gap-2.5 text-sm">
              <li className="flex gap-2.5">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-gold" strokeWidth={1.6} />
                {CONTACT.address[1]}, {CONTACT.address[0]}
              </li>
              <li className="flex gap-2.5">
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-gold" strokeWidth={1.6} />
                <a href={CONTACT.phoneHref} className="hover:text-brand-ivory">{CONTACT.phone}</a>
              </li>
              <li className="flex gap-2.5">
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-gold" strokeWidth={1.6} />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-brand-ivory">{CONTACT.email}</a>
              </li>
            </ul>
            <ul className="mt-6 flex gap-2">
              {social.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 text-brand-sand transition-colors hover:border-brand-gold hover:text-brand-gold-light">
                    <Icon className="size-[18px]" />
                    <span className="sr-only">{label} {dict.a11y.external}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {columns.map((group) => (
              <nav key={group.key} aria-labelledby={`f-${group.key}`}>
                <h2 id={`f-${group.key}`} className="text-xs font-medium uppercase tracking-[0.14em] text-brand-gold-light">
                  {dict.nav[group.key]}
                </h2>
                <ul className="mt-4 grid gap-2.5 text-sm">
                  {group.items.slice(0, 6).map((item) => (
                    <li key={item.href}>
                      <Link href={p(item.href)} className="text-brand-sand/80 transition-colors hover:text-brand-ivory">
                        {dict.nav.items[item.key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/10 py-12 lg:grid-cols-[1.3fr_2.7fr]">
          <div>
            <h2 className="font-serif-display text-2xl text-brand-ivory">{t.newsletter}</h2>
            <p className="mt-2 text-sm text-brand-sand/70">{t.app} · Google Play · App Store</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 py-6 text-sm">
          {PARTNERS.map((partner) => (
            <a key={partner.name} href={partner.href} target="_blank" rel="noopener noreferrer" title={partner.desc} className="inline-flex items-center gap-1 text-brand-sand/70 hover:text-brand-ivory">
              {partner.name}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              <span className="sr-only">{dict.a11y.external}</span>
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-brand-sand/60 md:flex-row md:items-center md:justify-between">
          <p>© <CurrentYear fallback={2026} /> BVMAC. {t.rights}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href={p("/mentions-legales")} className="hover:text-brand-ivory">{t.legal}</Link></li>
            <li><Link href={p("/politique-de-confidentialite")} className="hover:text-brand-ivory">{t.privacy}</Link></li>
            <li><Link href={p("/politique-de-cookies")} className="hover:text-brand-ivory">Cookies</Link></li>
            <li><CookieSettingsLink className="hover:text-brand-ivory" /></li>
            <li><Link href={p("/accessibilite")} className="hover:text-brand-ivory">{t.accessibility}</Link></li>
            <li><Link href={p("/plan-du-site")} className="hover:text-brand-ivory">{t.sitemap}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
