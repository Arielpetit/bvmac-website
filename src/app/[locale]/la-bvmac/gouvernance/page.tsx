import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Network, UserRound } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { BOARD } from "@/data/institution";
import { ContentPage } from "@/components/content/ContentPage";
import { Tabs } from "@/components/ui/Tabs";
import { Callout } from "@/components/ui/Callout";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/gouvernance">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.governance);
}

const COMMITTEES = [
  { name: "Comité d’audit et des risques", text: "Examine les comptes, le contrôle interne et la cartographie des risques." },
  { name: "Comité des nominations et des rémunérations", text: "Prépare les nominations des dirigeants et la politique de rémunération." },
  { name: "Comité stratégique", text: "Suit le plan stratégique, les projets de développement du marché et les investissements." },
];

export default async function GovernancePage({ params }: PageProps<"/[locale]/la-bvmac/gouvernance">) {
  const { locale, dict } = await resolveLocale(params);
  const p = (path: string) => localePath(locale, path);
  const messages = [
    { href: p("/la-bvmac/gouvernance/message-du-pca"), role: "Président du Conseil d’Administration", title: "Mot du Président", photo: "/photos/governance-officials.webp" },
    { href: p("/la-bvmac/gouvernance/message-du-dg"), role: "Directeur Général", title: "Mot du Directeur Général", photo: "/photos/ceremony-speech.webp" },
  ];

  return (
    <ContentPage locale={locale} dict={dict} group="about" title={dict.nav.items.governance} intro="Conseil d’administration, direction générale et règles d’éthique de la BVMAC." image="/photos/governance-group.webp">
      <div className="grid gap-16">
        <section aria-label="Messages" className="grid gap-5 md:grid-cols-2">
          {messages.map((m) => (
            <Link key={m.href} href={m.href} className="card-lift group relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-panel)] bg-espresso">
              <Image src={m.photo} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-70 transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 text-brand-ivory">
                <div>
                  <p className="eyebrow text-brand-gold-light!">{m.role}</p>
                  <h2 className="font-serif-display mt-2 text-3xl text-brand-ivory">{m.title}</h2>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-gold text-espresso transition-transform group-hover:rotate-45"><ArrowUpRight aria-hidden="true" className="size-5" /></span>
              </div>
            </Link>
          ))}
        </section>

        <Tabs
          tabs={[
            {
              id: "board",
              label: "Conseil d’administration",
              content: (
                <div>
                  <p className="max-w-2xl text-muted">Le Conseil d’Administration définit les orientations stratégiques de la BVMAC et contrôle leur mise en œuvre. Il représente les différentes catégories d’actionnaires.</p>
                  <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {BOARD.map((m) => (
                      <StaggerItem key={m.name} className="rounded-[var(--radius-card)] border border-line bg-surface p-5 text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft to-surface-alt">
                          <UserRound aria-hidden="true" className="size-7 text-accent-text" strokeWidth={1.3} />
                        </div>
                        <p className="mt-4 font-medium text-heading">{m.name}</p>
                        <p className="mt-1 text-xs text-accent-text">{m.role}</p>
                        <p className="mt-1 text-xs text-muted">{m.entity}</p>
                      </StaggerItem>
                    ))}
                  </Stagger>
                  <Callout tone="warning" className="mt-6">Noms, fonctions et mandats à fournir par la BVMAC.</Callout>
                </div>
              ),
            },
            {
              id: "committees",
              label: "Comités spécialisés",
              content: (
                <Stagger className="grid gap-4 md:grid-cols-3">
                  {COMMITTEES.map((c, i) => (
                    <StaggerItem key={c.name} className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                      <span className="figure text-sm text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-h3 mt-3">{c.name}</h3>
                      <p className="mt-2 text-sm text-muted">{c.text}</p>
                    </StaggerItem>
                  ))}
                  <StaggerItem className="md:col-span-3"><Callout tone="warning">Liste des comités indicative, à confirmer par la BVMAC.</Callout></StaggerItem>
                </Stagger>
              ),
            },
            {
              id: "management",
              label: "Direction générale",
              content: (
                <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                    <h3 className="text-h3">Le Directeur Général</h3>
                    <p className="mt-2 text-muted">Nommé par le Conseil d’Administration, il assure la gestion courante de la BVMAC et la représente auprès des autorités et des membres du marché. Il est assisté des directeurs opérationnels et fonctionnels.</p>
                    <Link href={p("/la-bvmac/gouvernance/message-du-dg")} className="link mt-4 inline-block text-sm">Lire son message</Link>
                  </div>
                  <Link href={p("/la-bvmac/organigramme")} className="card-lift group flex flex-col justify-between rounded-[var(--radius-card)] bg-espresso p-6 text-brand-ivory">
                    <Network aria-hidden="true" className="size-8 text-brand-gold" strokeWidth={1.3} />
                    <div className="mt-8">
                      <h3 className="font-serif-display text-2xl text-brand-ivory">Organigramme</h3>
                      <p className="mt-1 text-sm text-brand-sand/70">Directions et services de la BVMAC</p>
                    </div>
                  </Link>
                </div>
              ),
            },
            {
              id: "ethics",
              label: "Éthique",
              content: (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                    <FileText aria-hidden="true" className="size-7 text-accent-text" strokeWidth={1.4} />
                    <h3 className="text-h3 mt-4">Code d’éthique et de déontologie</h3>
                    <p className="mt-2 text-sm text-muted">Règles de conduite des administrateurs, dirigeants et collaborateurs : confidentialité, conflits d’intérêts, opérations personnelles sur titres.</p>
                    <span className="mt-4 inline-block text-sm text-muted">PDF à fournir par la BVMAC</span>
                  </div>
                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                    <h3 className="text-h3">Signaler un manquement</h3>
                    <p className="mt-2 text-sm text-muted">Toute pratique contraire aux règles du marché peut être signalée à la BVMAC ou à la COSUMAF, autorité de régulation.</p>
                    <Link href={p("/contact")} className="link mt-4 inline-block text-sm">Nous contacter</Link>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </ContentPage>
  );
}
