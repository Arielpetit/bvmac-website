import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata({ params }: PageProps<"/[locale]/investisseurs/protection">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.protection);
}

const T = {
  fr: {
    intro: "Les règles du marché et la surveillance de la COSUMAF protègent les épargnants.",
    guaranteesTitle: "Vos garanties",
    guarantees: [
      "Seules les sociétés de bourse agréées par la COSUMAF peuvent recevoir vos ordres.",
      "Les émetteurs publient une information financière contrôlée et des avis officiels.",
      "La BVMAC surveille en permanence les séances et peut suspendre un titre.",
      "Les titres sont conservés par le dépositaire central, distinct de votre intermédiaire.",
    ],
    warnTitle: "Méfiez-vous des sollicitations non autorisées",
    warnText: "Aucun placement ne garantit un rendement élevé sans risque. Vérifiez toujours qu’un intermédiaire figure dans la liste des sociétés de bourse agréées avant de lui confier des fonds.",
    verify: "Vérifier un intermédiaire →",
    claimTitle: "Un problème avec une opération ?",
    claimText: "Adressez-vous d’abord à votre société de bourse. Si la réponse ne vous satisfait pas, déposez une réclamation auprès de la BVMAC : vous recevrez un numéro de suivi.",
    claimCta: "Soumettre une réclamation",
  },
  en: {
    intro: "Market rules and COSUMAF supervision protect savers.",
    guaranteesTitle: "Your safeguards",
    guarantees: [
      "Only brokers licensed by COSUMAF can take your orders.",
      "Issuers publish audited financial information and official notices.",
      "The BVMAC monitors every session and can suspend a security.",
      "Securities are held by the central depository, separately from your intermediary.",
    ],
    warnTitle: "Beware of unauthorised offers",
    warnText: "No investment guarantees a high return without risk. Always check that an intermediary appears on the list of licensed brokers before handing over any money.",
    verify: "Check an intermediary →",
    claimTitle: "A problem with a transaction?",
    claimText: "Contact your broker first. If the answer does not satisfy you, file a complaint with the BVMAC: you will receive a tracking number.",
    claimCta: "File a complaint",
  },
  es: {
    intro: "Las normas del mercado y la supervisión de la COSUMAF protegen a los ahorradores.",
    guaranteesTitle: "Sus garantías",
    guarantees: [
      "Solo las sociedades de bolsa autorizadas por la COSUMAF pueden recibir sus órdenes.",
      "Los emisores publican información financiera auditada y avisos oficiales.",
      "La BVMAC vigila permanentemente las sesiones y puede suspender un valor.",
      "Los valores los conserva el depositario central, separado de su intermediario.",
    ],
    warnTitle: "Desconfíe de las ofertas no autorizadas",
    warnText: "Ninguna inversión garantiza una rentabilidad alta sin riesgo. Compruebe siempre que un intermediario figura en la lista de sociedades de bolsa autorizadas antes de confiarle fondos.",
    verify: "Comprobar un intermediario →",
    claimTitle: "¿Un problema con una operación?",
    claimText: "Diríjase primero a su sociedad de bolsa. Si la respuesta no le satisface, presente una reclamación ante la BVMAC: recibirá un número de seguimiento.",
    claimCta: "Presentar una reclamación",
  },
};

export default async function ProtectionPage({ params }: PageProps<"/[locale]/investisseurs/protection">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.protection} intro={t.intro}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 md:p-8">
          <ShieldCheck aria-hidden="true" className="size-7 text-accent-text" strokeWidth={1.8} />
          <h2 className="text-h3 mt-3">{t.guaranteesTitle}</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {t.guarantees.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
        <div className="rounded-[var(--radius-card)] border-2 border-fall/40 bg-fall-bg p-6 md:p-8">
          <TriangleAlert aria-hidden="true" className="size-7 text-fall" strokeWidth={1.8} />
          <h2 className="text-h3 mt-3">{t.warnTitle}</h2>
          <p className="mt-2 text-sm">{t.warnText}</p>
          <Link href={localePath(locale, "/participants/societes-de-bourse")} className="link mt-3 inline-block text-sm">{t.verify}</Link>
        </div>
      </div>
      <section aria-labelledby="claim" className="mt-10 grid gap-6 rounded-[var(--radius-panel)] bg-espresso p-8 text-brand-sand md:grid-cols-[1.6fr_auto] md:items-center md:p-10">
        <div>
          <h2 id="claim" className="font-serif-display text-3xl text-brand-ivory">{t.claimTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm">{t.claimText}</p>
        </div>
        <ButtonLink href={localePath(locale, "/contact?formulaire=reclamation")} variant="gold">{t.claimCta}</ButtonLink>
      </section>
    </ContentPage>
  );
}
