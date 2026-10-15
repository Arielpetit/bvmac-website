import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { formatDate, formatDayMonth } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { SessionTimeline } from "@/components/market/SessionTimeline";
import { tc } from "@/i18n/content";

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
      <PageHeader title={dict.nav.items.hours} intro={t.intro} />
      <div className="container-site grid gap-16 pt-10 pb-14 md:pt-12 md:pb-20">
        <section aria-labelledby="phases">
          <h2 id="phases" className="text-h2 mb-6">{t.phases}</h2>
          <SessionTimeline />
        </section>
        <section aria-labelledby="holidays">
          <h2 id="holidays" className="text-h2 mb-6">{t.holidays}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {HOLIDAYS_2026.map((h) => {
              const dm = formatDayMonth(h.date, locale);
              return (
                <li key={h.date} className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4">
                  <time dateTime={h.date} className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-accent-soft text-accent-text">
                    <span className="font-serif-display text-xl leading-none">{dm.day}</span>
                    <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider">{dm.month}</span>
                  </time>
                  <span className="min-w-0">
                    <span className="block font-medium text-heading">{tc(h.fr, locale)}</span>
                    <span className="block text-xs capitalize text-muted">{formatDate(h.date, locale)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
