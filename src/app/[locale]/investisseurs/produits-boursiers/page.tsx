import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Callout } from "@/components/ui/Callout";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/produits-boursiers">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.products);
}

const PRODUCTS = [
  { title: "Actions", who: "Investisseurs acceptant les variations de cours, horizon long.", risk: "Le cours peut baisser ; le dividende n'est pas garanti.", income: "Dividendes et plus-value éventuelle.", lesson: "comprendre-la-bourse" },
  { title: "Obligations", who: "Épargnants recherchant des revenus réguliers.", risk: "Risque de défaut de l'émetteur ; prix variable avant l'échéance.", income: "Coupons à date fixe et remboursement du capital.", lesson: "investir-dans-une-obligation" },
  { title: "OPCVM",  who: "Investisseurs souhaitant une gestion collective et diversifiée.", risk: "Variable selon la politique de placement du fonds.", income: "Selon la performance du portefeuille du fonds.", lesson: "comprendre-la-bourse" },
];

const OTHERS = [
  { title: "Titres de créances négociables", text: "Bons et billets émis par les entreprises ou les États, à court et moyen terme." },
  { title: "Emprunts obligataires des États", text: "Obligations du Trésor émises par les États de la CEMAC et cotées à la BVMAC." },
  { title: "Sukuk et produits islamiques", text: "Titres conformes à la finance islamique, lorsqu’ils sont agréés par la COSUMAF." },
  { title: "Droits de souscription", text: "Droits détachés lors des augmentations de capital, négociables pendant la période de souscription." },
];

export default async function ProductsPage({ params }: PageProps<"/[locale]/investisseurs/produits-boursiers">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <ContentPage locale={locale} dict={dict} group="invest" title={dict.nav.items.products} intro="Comprendre les produits négociés à la BVMAC avant d’investir." image="/photos/ceremony-trading-floor-2.webp">
      <div className="grid gap-20">
        <Stagger as="ul" className="grid gap-4 md:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <StaggerItem as="li" key={p.title} className={i === 0 ? "card-lift flex flex-col rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand" : "card-lift flex flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-8"}>
              <h2 className={i === 0 ? "font-serif-display text-4xl text-brand-ivory" : "font-serif-display text-4xl text-heading"}>{p.title}</h2>
              <dl className="mt-8 grid gap-5 text-sm">
                {([["Pour qui ?", p.who], ["Revenus", p.income], ["Risques", p.risk]] as const).map(([k, v]) => (
                  <div key={k}><dt className={i === 0 ? "eyebrow text-brand-gold-light!" : "eyebrow"}>{k}</dt><dd className={i === 0 ? "mt-1.5 text-brand-sand/80" : "mt-1.5 text-muted"}>{v}</dd></div>
                ))}
              </dl>
              <Link href={localePath(locale, `/ecole-de-bourse/lecon/${p.lesson}`)} className={i === 0 ? "mt-auto pt-8 text-sm text-brand-gold-light hover:underline" : "link mt-auto pt-8 text-sm"}>Leçon associée →</Link>
            </StaggerItem>
          ))}
        </Stagger>
        <section aria-labelledby="others">
          <p className="eyebrow">Autres produits agréés</p>
          <h2 id="others" className="text-h2 mt-3">Au-delà des actions et obligations</h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
            {OTHERS.map((o) => (
              <li key={o.title} className="bg-surface p-6">
                <h3 className="text-h3">{o.title}</h3>
                <p className="mt-2 text-sm text-muted">{o.text}</p>
              </li>
            ))}
          </ul>
          <Callout tone="warning" className="mt-4">Liste indicative, à aligner sur les produits effectivement agréés par la COSUMAF.</Callout>
        </section>
      </div>
    </ContentPage>
  );
}
