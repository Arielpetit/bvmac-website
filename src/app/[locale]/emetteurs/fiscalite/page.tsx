import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { ContentPage } from "@/components/content/ContentPage";
import { OfficialDocs } from "@/components/content/FeeTable";
import { Faq } from "@/components/ui/Accordion";

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/fiscalite">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.tax);
}

const T = {
  fr: {
    title: "Bourse et fiscalité pour les émetteurs",
    intro: "Un régime fiscal communautaire encourage la cotation à la BVMAC ; des mesures nationales peuvent s’y ajouter.",
    eyebrow: "Cadre communautaire",
    heading: "Régime fiscal spécifique applicable aux opérations cotées à la BVMAC",
    text: "Le Règlement N°14/07-UEAC-175-CM-15 prévoit des avantages fiscaux pour les sociétés qui ouvrent leur capital ou émettent des titres de créance sur le marché, ainsi que pour les investisseurs. Le texte officiel fait foi.",
    faq: [
      { q: "Le régime fiscal s’applique-t-il dans les six pays ?", a: "Le règlement est un texte communautaire de l’UEAC, applicable dans les États membres de la CEMAC." },
      { q: "Les avantages s’appliquent-ils aux obligations ?", a: "Le règlement couvre les opérations cotées à la BVMAC, y compris certaines émissions de titres de créance. Consultez le texte pour les conditions exactes." },
      { q: "Existe-t-il des mesures nationales ?", a: "Certains États ajoutent leurs propres mesures en faveur des sociétés cotées. Renseignez-vous auprès de l’administration fiscale de votre pays." },
      { q: "Qui contacter pour une question fiscale précise ?", a: "Votre conseil fiscal ou l’administration fiscale de votre pays. La BVMAC peut vous orienter vers les textes applicables." },
    ],
  },
  en: {
    title: "Stock market taxation for issuers",
    intro: "A regional tax regime encourages listing on the BVMAC; national measures may add to it.",
    eyebrow: "Regional framework",
    heading: "Specific tax regime for transactions listed on the BVMAC",
    text: "Regulation No. 14/07-UEAC-175-CM-15 provides tax benefits for companies that open their capital or issue debt securities on the market, and for investors. The official text prevails.",
    faq: [
      { q: "Does the tax regime apply in all six countries?", a: "The regulation is a regional UEAC text, applicable in the CEMAC member states." },
      { q: "Do the benefits apply to bonds?", a: "The regulation covers transactions listed on the BVMAC, including some debt issues. See the text for the exact conditions." },
      { q: "Are there national measures?", a: "Some states add their own measures for listed companies. Ask your country’s tax administration." },
      { q: "Who can I contact about a specific tax question?", a: "Your tax adviser or your country’s tax administration. The BVMAC can point you to the applicable texts." },
    ],
  },
  es: {
    title: "Bolsa y fiscalidad para los emisores",
    intro: "Un régimen fiscal comunitario fomenta la cotización en la BVMAC; pueden añadirse medidas nacionales.",
    eyebrow: "Marco comunitario",
    heading: "Régimen fiscal específico aplicable a las operaciones cotizadas en la BVMAC",
    text: "El Reglamento n.º 14/07-UEAC-175-CM-15 prevé ventajas fiscales para las empresas que abren su capital o emiten títulos de deuda en el mercado, así como para los inversores. El texto oficial prevalece.",
    faq: [
      { q: "¿Se aplica el régimen fiscal en los seis países?", a: "El reglamento es un texto comunitario de la UEAC, aplicable en los Estados miembros de la CEMAC." },
      { q: "¿Se aplican las ventajas a las obligaciones?", a: "El reglamento abarca las operaciones cotizadas en la BVMAC, incluidas algunas emisiones de títulos de deuda. Consulte el texto para conocer las condiciones exactas." },
      { q: "¿Existen medidas nacionales?", a: "Algunos Estados añaden sus propias medidas a favor de las empresas cotizadas. Infórmese en la administración tributaria de su país." },
      { q: "¿A quién dirigirse para una pregunta fiscal concreta?", a: "A su asesor fiscal o a la administración tributaria de su país. La BVMAC puede orientarle hacia los textos aplicables." },
    ],
  },
};

export default async function IssuerTaxPage({ params }: PageProps<"/[locale]/emetteurs/fiscalite">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={t.title} intro={t.intro}>
      <div className="grid gap-16">
        <section aria-labelledby="regime" className="rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand md:p-12">
          <p className="eyebrow text-brand-gold-light!">{t.eyebrow}</p>
          <h2 id="regime" className="font-serif-display mt-3 max-w-3xl text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-brand-ivory">{t.heading}</h2>
          <p className="mt-4 max-w-2xl text-brand-sand/75">{t.text}</p>
        </section>
        <OfficialDocs locale={locale} ids={["r6"]} />
        <Faq items={t.faq} />
      </div>
    </ContentPage>
  );
}
