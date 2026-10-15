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
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/s-introduire-en-bourse">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.ipo);
}

const T = {
  fr: {
    intro: "Lever des fonds en bourse, étape par étape : actions ou obligations, de la préparation à la première cotation.",
    eyebrow: "Le parcours",
    title: "Six étapes vers la cote",
    text: "Ouvrez chaque étape pour voir les documents attendus, le délai indicatif et qui pilote.",
    lead: "Pilote",
    delay: "Délai indicatif",
    contactTitle: "Parler à l’équipe Admission",
    contactText: "Un premier échange permet de vérifier l’éligibilité et le calendrier de votre projet.",
    contactCta: "Nous contacter",
    tools: "Outils",
    toolLinks: ["Test d’éligibilité", "Conditions d’admission", "Commissions d’admission et de cotation"],
    steps: [
      { title: "Préparation", who: "Entreprise", delay: "6 à 12 mois", text: "Mise en conformité juridique (société anonyme), audit des comptes, gouvernance et communication financière.", docs: ["Statuts de société anonyme", "États financiers certifiés des 3 derniers exercices", "Plan d’affaires"] },
      { title: "Choix d’une société de bourse", who: "Entreprise", delay: "2 à 4 semaines", text: "La société de bourse, chef de file, accompagne l’émetteur, prépare l’offre et place les titres auprès des investisseurs.", docs: ["Mandat signé avec la société de bourse", "Lettre d’engagement des conseils"] },
      { title: "Dossier d’admission", who: "Entreprise et conseils", delay: "1 à 2 mois", text: "Dépôt du dossier à la BVMAC et du document d’information soumis au visa de la COSUMAF.", docs: ["Demande d’admission", "Document d’information (prospectus)", "Rapport d’évaluation"] },
      { title: "Examen par le Comité d’Admission", who: "BVMAC", delay: "Selon le calendrier du Comité", text: "Le Comité d’Admission et de Développement examine la demande au regard des conditions du compartiment visé.", docs: ["Réponses aux questions du Comité"] },
      { title: "Visa, décision et avis", who: "BVMAC · COSUMAF", delay: "Variable", text: "La décision est publiée par avis de la BVMAC ; l’offre au public peut s’ouvrir après le visa de la COSUMAF.", docs: ["Visa COSUMAF", "Avis d’admission BVMAC"] },
      { title: "Souscription et première cotation", who: "BVMAC · sociétés de bourse", delay: "2 à 4 semaines", text: "Période de souscription, centralisation des ordres puis inscription à la cote et premier jour de négociation, souvent marqué par une cérémonie.", docs: ["Résultats de l’offre", "Avis de première cotation"] },
    ],
    faq: [
      { q: "Combien de temps dure une introduction en bourse ?", a: "Comptez en général entre 9 et 18 mois entre le début de la préparation et la première cotation, selon l’état de préparation de l’entreprise." },
      { q: "Faut-il être une grande entreprise ?", a: "Non. Les conditions varient selon le compartiment de la cote. Le test d’éligibilité vous donne une première indication." },
      { q: "Existe-t-il des aides pour financer l’introduction ?", a: "Oui. En 2026, un appel à manifestation d’intérêt a permis de sélectionner des sociétés bénéficiant d’une prise en charge des frais d’introduction en bourse." },
      { q: "Quelles obligations après la cotation ?", a: "Publier les états financiers annuels et semestriels, informer le marché de tout événement important et respecter les règles de gouvernance." },
    ],
  },
  en: {
    intro: "Raising funds on the stock exchange, step by step: shares or bonds, from preparation to first listing.",
    eyebrow: "The path",
    title: "Six steps to listing",
    text: "Open each step to see the documents required, the indicative timing and who leads.",
    lead: "Led by",
    delay: "Indicative timing",
    contactTitle: "Talk to the Admission team",
    contactText: "A first conversation lets us check your project’s eligibility and timetable.",
    contactCta: "Contact us",
    tools: "Tools",
    toolLinks: ["Eligibility check", "Listing requirements", "Admission and listing fees"],
    steps: [
      { title: "Preparation", who: "Company", delay: "6 to 12 months", text: "Legal compliance (public limited company), audit of the accounts, governance and financial communication.", docs: ["Articles of a public limited company", "Audited financial statements for the last 3 years", "Business plan"] },
      { title: "Choosing a broker", who: "Company", delay: "2 to 4 weeks", text: "The lead broker supports the issuer, prepares the offer and places the securities with investors.", docs: ["Mandate signed with the broker", "Engagement letter from the advisers"] },
      { title: "Admission file", who: "Company and advisers", delay: "1 to 2 months", text: "Filing of the application with the BVMAC and of the information document submitted for COSUMAF approval.", docs: ["Application for admission", "Information document (prospectus)", "Valuation report"] },
      { title: "Review by the Admission Committee", who: "BVMAC", delay: "Per the Committee’s calendar", text: "The Admission and Development Committee reviews the application against the requirements of the target segment.", docs: ["Answers to the Committee’s questions"] },
      { title: "Approval, decision and notice", who: "BVMAC · COSUMAF", delay: "Variable", text: "The decision is published in a BVMAC notice; the public offering can open after COSUMAF approval.", docs: ["COSUMAF approval", "BVMAC admission notice"] },
      { title: "Subscription and first listing", who: "BVMAC · brokers", delay: "2 to 4 weeks", text: "Subscription period, centralisation of orders, then admission to listing and first trading day, often marked by a ceremony.", docs: ["Results of the offering", "First listing notice"] },
    ],
    faq: [
      { q: "How long does an IPO take?", a: "Usually 9 to 18 months from the start of preparation to first listing, depending on how ready the company is." },
      { q: "Do I need to be a large company?", a: "No. Requirements vary by listing segment. The eligibility check gives you a first indication." },
      { q: "Is there support to fund the IPO?", a: "Yes. In 2026, a call for expressions of interest selected companies whose IPO costs are covered." },
      { q: "What are the obligations after listing?", a: "Publish annual and half-year financial statements, inform the market of any significant event and follow governance rules." },
    ],
  },
  es: {
    intro: "Captar fondos en bolsa, paso a paso: acciones u obligaciones, desde la preparación hasta la primera cotización.",
    eyebrow: "El recorrido",
    title: "Seis pasos hacia la cotización",
    text: "Abra cada paso para ver los documentos exigidos, el plazo orientativo y quién lo dirige.",
    lead: "Dirige",
    delay: "Plazo orientativo",
    contactTitle: "Hablar con el equipo de Admisión",
    contactText: "Una primera conversación permite comprobar la elegibilidad y el calendario de su proyecto.",
    contactCta: "Contactar",
    tools: "Herramientas",
    toolLinks: ["Prueba de elegibilidad", "Condiciones de admisión", "Comisiones de admisión y cotización"],
    steps: [
      { title: "Preparación", who: "Empresa", delay: "De 6 a 12 meses", text: "Adecuación jurídica (sociedad anónima), auditoría de las cuentas, gobernanza y comunicación financiera.", docs: ["Estatutos de sociedad anónima", "Estados financieros auditados de los 3 últimos ejercicios", "Plan de negocio"] },
      { title: "Elección de una sociedad de bolsa", who: "Empresa", delay: "De 2 a 4 semanas", text: "La sociedad de bolsa directora acompaña al emisor, prepara la oferta y coloca los valores entre los inversores.", docs: ["Mandato firmado con la sociedad de bolsa", "Carta de compromiso de los asesores"] },
      { title: "Expediente de admisión", who: "Empresa y asesores", delay: "De 1 a 2 meses", text: "Presentación del expediente a la BVMAC y del documento informativo sometido al visado de la COSUMAF.", docs: ["Solicitud de admisión", "Documento informativo (folleto)", "Informe de valoración"] },
      { title: "Examen por el Comité de Admisión", who: "BVMAC", delay: "Según el calendario del Comité", text: "El Comité de Admisión y Desarrollo examina la solicitud en función de las condiciones del segmento elegido.", docs: ["Respuestas a las preguntas del Comité"] },
      { title: "Visado, decisión y aviso", who: "BVMAC · COSUMAF", delay: "Variable", text: "La decisión se publica mediante aviso de la BVMAC; la oferta pública puede abrirse tras el visado de la COSUMAF.", docs: ["Visado de la COSUMAF", "Aviso de admisión de la BVMAC"] },
      { title: "Suscripción y primera cotización", who: "BVMAC · sociedades de bolsa", delay: "De 2 a 4 semanas", text: "Período de suscripción, centralización de las órdenes, inscripción en la cotización y primer día de negociación, a menudo con una ceremonia.", docs: ["Resultados de la oferta", "Aviso de primera cotización"] },
    ],
    faq: [
      { q: "¿Cuánto dura una salida a bolsa?", a: "Por lo general entre 9 y 18 meses desde el inicio de la preparación hasta la primera cotización, según el grado de preparación de la empresa." },
      { q: "¿Hay que ser una gran empresa?", a: "No. Las condiciones varían según el segmento de cotización. La prueba de elegibilidad le da una primera indicación." },
      { q: "¿Existen ayudas para financiar la salida a bolsa?", a: "Sí. En 2026, una convocatoria de manifestaciones de interés seleccionó empresas cuyos gastos de salida a bolsa se cubren." },
      { q: "¿Qué obligaciones hay tras la cotización?", a: "Publicar los estados financieros anuales y semestrales, informar al mercado de cualquier hecho relevante y cumplir las normas de gobernanza." },
    ],
  },
};

export default async function IpoPage({ params }: PageProps<"/[locale]/emetteurs/s-introduire-en-bourse">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const p = (path: string) => localePath(locale, path);
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.ipo} intro={t.intro}>
      <div className="grid gap-24">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <section aria-labelledby="steps">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id="steps" className="text-h2 mt-3">{t.title}</h2>
            <p className="mt-3 text-muted">{t.text}</p>
            <Accordion
              numbered
              defaultOpen={["s0"]}
              className="mt-8"
              items={t.steps.map((s, i) => ({
                id: `s${i}`,
                title: s.title,
                meta: s.delay,
                content: (
                  <div className="grid gap-5">
                    <p>{s.text}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <p className="flex items-center gap-2 text-sm"><UserRound aria-hidden="true" className="size-4 text-accent-text" />{t.lead} : <span className="text-heading">{s.who}</span></p>
                      <p className="flex items-center gap-2 text-sm"><Clock aria-hidden="true" className="size-4 text-accent-text" />{t.delay} : <span className="text-heading">{s.delay}</span></p>
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
                <h2 className="font-serif-display text-2xl text-brand-ivory">{t.contactTitle}</h2>
                <p className="mt-2 text-sm text-brand-sand/75">{t.contactText}</p>
                <ButtonLink href={p("/contact")} variant="gold" className="mt-6"><Mail aria-hidden="true" className="size-4" />{t.contactCta}</ButtonLink>
              </div>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <p className="text-h3">{t.tools}</p>
              <ul className="mt-3 grid gap-1">
                {[["/emetteurs/test-d-eligibilite", t.toolLinks[0]], ["/emetteurs/conditions-d-admission", t.toolLinks[1]], ["/emetteurs/commissions", t.toolLinks[2]]].map(([href, label]) => (
                  <li key={href}><Link href={p(href)} className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-surface-alt">{label}<ArrowUpRight aria-hidden="true" className="size-4 text-muted group-hover:text-link" /></Link></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        <Reveal><Faq items={t.faq} /></Reveal>
      </div>
    </ContentPage>
  );
}
