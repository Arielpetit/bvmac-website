import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { crumbs } from "@/lib/page-helpers";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Callout } from "@/components/ui/Callout";
import { SessionTimeline } from "@/components/market/SessionTimeline";

// 2026 Cameroon public holidays. Movable religious dates are indicative and
// announced by an avis de la BVMAC.
const HOLIDAYS_2026 = [
  { date: "2026-01-01", fr: "Jour de l'an" },
  { date: "2026-02-11", fr: "Fête de la jeunesse" },
  { date: "2026-03-20", fr: "Aïd el-Fitr*" },
  { date: "2026-04-03", fr: "Vendredi saint" },
  { date: "2026-05-01", fr: "Fête du travail" },
  { date: "2026-05-14", fr: "Ascension" },
  { date: "2026-05-20", fr: "Fête nationale" },
  { date: "2026-05-27", fr: "Aïd el-Kébir*" },
  { date: "2026-08-15", fr: "Assomption" },
  { date: "2026-12-25", fr: "Noël" },
];

const T = {
  fr: { intro: "Les séances de cotation ont lieu du lundi au vendredi. Les jours fériés au Cameroun font l'objet d'un avis de la BVMAC.", phases: "Phases de la séance (heure de Douala, UTC+1)", holidays: "Jours fériés 2026", day: "Jour férié", date: "Date", note: "* Date susceptible d'être modifiée. Horaires et calendrier à confirmer par la BVMAC avant publication." },
  en: { intro: "Trading sessions take place Monday to Friday. Public holidays in Cameroon are announced by a BVMAC notice.", phases: "Session phases (Douala time, UTC+1)", holidays: "2026 public holidays", day: "Holiday", date: "Date", note: "* Date may change. Hours and calendar to be confirmed by BVMAC before publication." },
  es: { intro: "Las sesiones tienen lugar de lunes a viernes. Los festivos en Camerún se anuncian mediante un aviso de la BVMAC.", phases: "Fases de la sesión (hora de Duala, UTC+1)", holidays: "Festivos 2026", day: "Festivo", date: "Fecha", note: "* Fecha sujeta a cambios. Horarios y calendario por confirmar por la BVMAC antes de su publicación." },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/marches/calendrier-horaires">): Promise<Metadata> {
  const { dict } = await resolveLocale(params);
  return { title: dict.nav.items.hours };
}

export default async function HoursPage({ params }: PageProps<"/[locale]/marches/calendrier-horaires">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  return (
    <>
      <PageHeader group="markets" title={dict.nav.items.hours} intro={t.intro} breadcrumbLabel={dict.a11y.breadcrumb} breadcrumb={crumbs(locale, dict, "markets", dict.nav.items.hours)} />
      <div className="container-site grid gap-16 py-14 md:py-20">
        <section aria-labelledby="phases">
          <h2 id="phases" className="text-h2 mb-6">{t.phases}</h2>
          <SessionTimeline />
        </section>
        <section aria-labelledby="holidays" className="max-w-2xl">
          <h2 id="holidays" className="text-h2 mb-6">{t.holidays}</h2>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
            <table className="w-full text-sm">
              <caption className="sr-only">{t.holidays}</caption>
              <thead className="bg-surface-alt">
                <tr className="text-xs uppercase tracking-[0.08em] text-muted">
                  <th scope="col" className="px-4 py-3 text-left font-semibold">{t.day}</th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold">{t.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {HOLIDAYS_2026.map((h) => (
                  <tr key={h.date}>
                    <td className="px-4 py-2.5">{h.fr}</td>
                    <td className="px-4 py-2.5 capitalize">{formatDate(h.date, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <Callout tone="warning">{t.note}</Callout>
      </div>
    </>
  );
}
