import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Network, UserRound } from "lucide-react";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { localePath } from "@/lib/paths";
import { getBoard } from "@/lib/api";
import { tc } from "@/i18n/content";
import { ContentPage } from "@/components/content/ContentPage";
import { Tabs } from "@/components/ui/Tabs";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/la-bvmac/gouvernance">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.governance);
}

const T = {
  fr: {
    intro: "Conseil d’administration, direction générale et règles d’éthique de la BVMAC.",
    messages: "Messages",
    pca: { role: "Président du Conseil d’Administration", title: "Mot du Président" },
    dg: { role: "Directeur Général", title: "Mot du Directeur Général" },
    board: "Conseil d’administration",
    boardText: "Le Conseil d’Administration définit les orientations stratégiques de la BVMAC et contrôle leur mise en œuvre. Il représente les différentes catégories d’actionnaires.",
    director: "Administrateur",
    committees: "Comités spécialisés",
    committeeList: [
      { name: "Comité d’audit et des risques", text: "Examine les comptes, le contrôle interne et la cartographie des risques." },
      { name: "Comité des nominations et des rémunérations", text: "Prépare les nominations des dirigeants et la politique de rémunération." },
      { name: "Comité stratégique", text: "Suit le plan stratégique, les projets de développement du marché et les investissements." },
    ],
    management: "Direction générale",
    ceo: "Le Directeur Général",
    ceoText: "Nommé par le Conseil d’Administration, il assure la gestion courante de la BVMAC et la représente auprès des autorités et des membres du marché. Il est assisté des directeurs opérationnels et fonctionnels.",
    readMessage: "Lire son message",
    orgchart: "Organigramme",
    orgchartText: "Directions et services de la BVMAC",
    ethics: "Éthique",
    code: "Code d’éthique et de déontologie",
    codeText: "Règles de conduite des administrateurs, dirigeants et collaborateurs : confidentialité, conflits d’intérêts, opérations personnelles sur titres.",
    report: "Signaler un manquement",
    reportText: "Toute pratique contraire aux règles du marché peut être signalée à la BVMAC ou à la COSUMAF, autorité de régulation.",
    contact: "Nous contacter",
  },
  en: {
    intro: "The BVMAC Board of Directors, executive management and ethics rules.",
    messages: "Messages",
    pca: { role: "Chairman of the Board of Directors", title: "Message from the Chairman" },
    dg: { role: "Chief Executive Officer", title: "Message from the CEO" },
    board: "Board of Directors",
    boardText: "The Board of Directors sets the BVMAC’s strategic direction and oversees its implementation. It represents the different categories of shareholders.",
    director: "Director",
    committees: "Board committees",
    committeeList: [
      { name: "Audit and Risk Committee", text: "Reviews the accounts, internal control and the risk map." },
      { name: "Nominations and Remuneration Committee", text: "Prepares senior appointments and the remuneration policy." },
      { name: "Strategy Committee", text: "Follows the strategic plan, market development projects and investments." },
    ],
    management: "Executive management",
    ceo: "The Chief Executive Officer",
    ceoText: "Appointed by the Board of Directors, the CEO runs the BVMAC day to day and represents it before the authorities and market members, supported by the operational and support directors.",
    readMessage: "Read the message",
    orgchart: "Organisation chart",
    orgchartText: "BVMAC departments and units",
    ethics: "Ethics",
    code: "Code of ethics and conduct",
    codeText: "Rules of conduct for directors, executives and staff: confidentiality, conflicts of interest, personal securities transactions.",
    report: "Report a breach",
    reportText: "Any practice contrary to market rules can be reported to the BVMAC or to COSUMAF, the regulator.",
    contact: "Contact us",
  },
  es: {
    intro: "Consejo de administración, dirección general y normas éticas de la BVMAC.",
    messages: "Mensajes",
    pca: { role: "Presidente del Consejo de Administración", title: "Mensaje del Presidente" },
    dg: { role: "Director General", title: "Mensaje del Director General" },
    board: "Consejo de administración",
    boardText: "El Consejo de Administración define las orientaciones estratégicas de la BVMAC y controla su aplicación. Representa a las distintas categorías de accionistas.",
    director: "Consejero",
    committees: "Comités especializados",
    committeeList: [
      { name: "Comité de auditoría y riesgos", text: "Examina las cuentas, el control interno y el mapa de riesgos." },
      { name: "Comité de nombramientos y retribuciones", text: "Prepara los nombramientos de los directivos y la política de retribución." },
      { name: "Comité estratégico", text: "Sigue el plan estratégico, los proyectos de desarrollo del mercado y las inversiones." },
    ],
    management: "Dirección general",
    ceo: "El Director General",
    ceoText: "Nombrado por el Consejo de Administración, gestiona el día a día de la BVMAC y la representa ante las autoridades y los miembros del mercado, con el apoyo de los directores operativos y funcionales.",
    readMessage: "Leer su mensaje",
    orgchart: "Organigrama",
    orgchartText: "Direcciones y servicios de la BVMAC",
    ethics: "Ética",
    code: "Código de ética y deontología",
    codeText: "Normas de conducta de los consejeros, directivos y empleados: confidencialidad, conflictos de intereses, operaciones personales con valores.",
    report: "Denunciar un incumplimiento",
    reportText: "Cualquier práctica contraria a las normas del mercado puede comunicarse a la BVMAC o a la COSUMAF, autoridad reguladora.",
    contact: "Contactar",
  },
};

const CODE_PDF = "https://www.bvm-ac.org/wp-content/uploads/2025/02/Code-ethique-et-de-deontologie-de-la-BVMAC_compressed.pdf";
const BROCHURE_PDF = "https://www.bvm-ac.org/wp-content/uploads/2024/05/Plaquette-de-presentation-BVMAC.pdf";
const DL = {
  fr: { code: "Télécharger le code (PDF)", brochure: "Plaquette de présentation (PDF)" },
  en: { code: "Download the code (PDF)", brochure: "Presentation brochure (PDF, French)" },
  es: { code: "Descargar el código (PDF)", brochure: "Folleto de presentación (PDF, francés)" },
};

export default async function GovernancePage({ params }: PageProps<"/[locale]/la-bvmac/gouvernance">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const board = (await getBoard()).map((m) => ({ ...m, name: m.name.replace(/^Administrateur (\d+)$/, `${t.director} $1`), role: tc(m.role, locale), entity: tc(m.entity, locale) }));
  const p = (path: string) => localePath(locale, path);
  const messages = [
    { href: p("/la-bvmac/gouvernance/message-du-pca"), role: t.pca.role, title: t.pca.title, photo: "/photos/governance-officials.webp" },
    { href: p("/la-bvmac/gouvernance/message-du-dg"), role: t.dg.role, title: t.dg.title, photo: "/photos/ceremony-speech.webp" },
  ];

  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.governance} intro={t.intro}>
      <div className="grid gap-16">
        <section aria-label={t.messages} className="grid gap-5 md:grid-cols-2">
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
              label: t.board,
              content: (
                <div>
                  <p className="max-w-2xl text-muted">{t.boardText}</p>
                  <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {board.map((m) => (
                      <StaggerItem key={m.name} className="rounded-[var(--radius-card)] border border-line bg-surface p-4 text-center sm:p-5">
                        <div className="mx-auto flex size-12 items-center sm:size-16 justify-center rounded-full bg-gradient-to-br from-accent-soft to-surface-alt">
                          <UserRound aria-hidden="true" className="size-7 text-accent-text" strokeWidth={1.3} />
                        </div>
                        <p className="mt-4 font-medium text-heading">{m.name}</p>
                        <p className="mt-1 text-xs text-accent-text">{m.role}</p>
                        <p className="mt-1 text-xs text-muted">{m.entity}</p>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              ),
            },
            {
              id: "committees",
              label: t.committees,
              content: (
                <Stagger className="grid gap-4 md:grid-cols-3">
                  {t.committeeList.map((c, i) => (
                    <StaggerItem key={c.name} className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                      <span className="figure text-sm text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-h3 mt-3">{c.name}</h3>
                      <p className="mt-2 text-sm text-muted">{c.text}</p>
                    </StaggerItem>
                  ))}
                </Stagger>
              ),
            },
            {
              id: "management",
              label: t.management,
              content: (
                <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                    <h3 className="text-h3">{t.ceo}</h3>
                    <p className="mt-2 text-muted">{t.ceoText}</p>
                    <Link href={p("/la-bvmac/gouvernance/message-du-dg")} className="link mt-4 inline-block text-sm">{t.readMessage}</Link>
                  </div>
                  <Link href={p("/la-bvmac/organigramme")} className="card-lift group flex flex-col justify-between rounded-[var(--radius-card)] bg-espresso p-6 text-brand-ivory">
                    <Network aria-hidden="true" className="size-8 text-brand-gold" strokeWidth={1.3} />
                    <div className="mt-8">
                      <h3 className="font-serif-display text-2xl text-brand-ivory">{t.orgchart}</h3>
                      <p className="mt-1 text-sm text-brand-sand/70">{t.orgchartText}</p>
                    </div>
                  </Link>
                </div>
              ),
            },
            {
              id: "ethics",
              label: t.ethics,
              content: (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                    <FileText aria-hidden="true" className="size-7 text-accent-text" strokeWidth={1.4} />
                    <h3 className="text-h3 mt-4">{t.code}</h3>
                    <p className="mt-2 text-sm text-muted">{t.codeText}</p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      <a href={CODE_PDF} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">{DL[locale].code}<ArrowUpRight aria-hidden="true" className="size-4" /></a>
                      <a href={BROCHURE_PDF} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">{DL[locale].brochure}<ArrowUpRight aria-hidden="true" className="size-4" /></a>
                    </div>
                  </div>
                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                    <h3 className="text-h3">{t.report}</h3>
                    <p className="mt-2 text-sm text-muted">{t.reportText}</p>
                    <Link href={p("/contact")} className="link mt-4 inline-block text-sm">{t.contact}</Link>
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
