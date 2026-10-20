import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n-server";
import { PageHeader } from "@/components/ui/PageHeader";
import { SessionTimeline } from "@/components/market/SessionTimeline";
import { HolidayList } from "@/components/market/HolidayList";

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
  fr: {
    intro: "Les séances de cotation ont lieu du lundi au vendredi. Les jours fériés au Cameroun font l'objet d'un avis de la BVMAC.",
    phases: "Déroulement d'une séance", phasesSub: "Heure de Douala (UTC+1), du lundi au vendredi.",
    glance: "En bref",
    facts: [["Jours de cotation", "Lundi au vendredi"], ["Fuseau horaire", "Douala, UTC+1"], ["Fixing", "11:00"], ["Fin de séance", "15:30"], ["Jours fériés", "Annoncés par avis de la BVMAC"]],
    nextHoliday: "Prochain jour férié",
    holidays: "Jours fériés 2026",
    note: "* Fête religieuse : la date dépend du calendrier lunaire et est confirmée par un avis de la BVMAC.",
  },
  en: {
    intro: "Trading sessions take place Monday to Friday. Public holidays in Cameroon are announced by a BVMAC notice.",
    phases: "Course of a session", phasesSub: "Douala time (UTC+1), Monday to Friday.",
    glance: "At a glance",
    facts: [["Trading days", "Monday to Friday"], ["Time zone", "Douala, UTC+1"], ["Fixing", "11:00"], ["Session ends", "15:30"], ["Public holidays", "Announced by a BVMAC notice"]],
    nextHoliday: "Next public holiday",
    holidays: "Public holidays 2026",
    note: "* Religious holiday: the date depends on the lunar calendar and is confirmed by a BVMAC notice.",
  },
  es: {
    intro: "Las sesiones tienen lugar de lunes a viernes. Los festivos en Camerún se anuncian mediante un aviso de la BVMAC.",
    phases: "Desarrollo de una sesión", phasesSub: "Hora de Duala (UTC+1), de lunes a viernes.",
    glance: "En resumen",
    facts: [["Días de sesión", "De lunes a viernes"], ["Huso horario", "Duala, UTC+1"], ["Fixing", "11:00"], ["Fin de la sesión", "15:30"], ["Festivos", "Anunciados por aviso de la BVMAC"]],
    nextHoliday: "Próximo festivo",
    holidays: "Festivos 2026",
    note: "* Fiesta religiosa: la fecha depende del calendario lunar y se confirma mediante un aviso de la BVMAC.",
  },
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
          <h2 id="phases" className="text-h2">{t.phases}</h2>
          <p className="mb-6 mt-2 text-muted">{t.phasesSub}</p>
          <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-2 sm:p-3">
              <SessionTimeline vertical />
            </div>
            <aside aria-label={t.glance} className="rounded-[var(--radius-card)] bg-espresso p-6 text-brand-sand md:p-7">
              <p className="eyebrow text-brand-gold-light!">{t.glance}</p>
              <dl className="mt-4 divide-y divide-white/10">
                {t.facts.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                    <dt className="shrink-0 text-brand-sand/70">{k}</dt>
                    <dd className="text-right font-medium text-brand-ivory">{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>
        <section aria-labelledby="holidays">
          <h2 id="holidays" className="text-h2 mb-4">{t.holidays}</h2>
          <HolidayList holidays={HOLIDAYS_2026} />
          <p className="mt-4 text-xs text-muted">{t.note}</p>
        </section>
      </div>
    </>
  );
}
