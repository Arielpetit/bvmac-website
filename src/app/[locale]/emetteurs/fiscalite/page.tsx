import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { COUNTRIES } from "@/lib/navigation";
import { ContentPage } from "@/components/content/ContentPage";
import { OfficialDocs } from "@/components/content/FeeTable";
import { Callout } from "@/components/ui/Callout";
import { Faq } from "@/components/ui/Accordion";
import { Flag } from "@/components/ui/Flag";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/fiscalite">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.tax);
}

export default async function IssuerTaxPage({ params }: PageProps<"/[locale]/emetteurs/fiscalite">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="issuers" title="Bourse et fiscalité pour les émetteurs" intro="Un régime fiscal communautaire encourage la cotation à la BVMAC ; des mesures nationales peuvent s’y ajouter.">
      <div className="grid gap-16">
        <section aria-labelledby="regime" className="rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand md:p-12">
          <p className="eyebrow text-brand-gold-light!">Cadre communautaire</p>
          <h2 id="regime" className="font-serif-display mt-3 max-w-3xl text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-brand-ivory">Régime fiscal spécifique applicable aux opérations cotées à la BVMAC</h2>
          <p className="mt-4 max-w-2xl text-brand-sand/75">Le Règlement N°14/07-UEAC-175-CM-15 prévoit des avantages fiscaux pour les sociétés qui ouvrent leur capital ou émettent des titres de créance sur le marché, ainsi que pour les investisseurs. Le texte officiel fait foi.</p>
        </section>
        <section aria-labelledby="by-country">
          <h2 id="by-country" className="text-h2">Mesures nationales</h2>
          <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COUNTRIES.map((c) => (
              <StaggerItem as="li" key={c.code} className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                <span className="flex items-center gap-3"><Flag code={c.code} className="h-5 w-7 rounded-sm" /><span className="text-h3">{c.fr}</span></span>
                <p className="mt-3 text-sm text-muted">Mesures fiscales nationales en faveur des sociétés cotées : à renseigner avec la référence des textes et leur date.</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Callout tone="warning" className="mt-6">Contenu à fournir et valider par la BVMAC.</Callout>
        </section>
        <OfficialDocs ids={["r6"]} />
        <Faq items={[
          { q: "Le régime fiscal s’applique-t-il dans les six pays ?", a: "Le règlement est un texte communautaire de l’UEAC, applicable dans les États membres de la CEMAC." },
          { q: "Les avantages s’appliquent-ils aux obligations ?", a: "Le règlement couvre les opérations cotées à la BVMAC, y compris certaines émissions de titres de créance. Consultez le texte pour les conditions exactes." },
          { q: "Qui contacter pour une question fiscale précise ?", a: "Votre conseil fiscal ou l’administration fiscale de votre pays. La BVMAC peut vous orienter vers les textes applicables." },
        ]} />
      </div>
    </ContentPage>
  );
}
