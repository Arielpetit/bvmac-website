import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { resolveLocale } from "@/lib/i18n-server";
import { pageTitle } from "@/lib/page-helpers";
import { getBonds } from "@/lib/api";
import { localePath } from "@/lib/paths";
import { ContentPage } from "@/components/content/ContentPage";
import { Flag } from "@/components/ui/Flag";
import { Reveal } from "@/components/motion/Reveal";

type L3 = Record<Locale, string>;
type Issuer = {
  id: string;
  bondIssuer: string;
  name: string;
  country: "CG" | "CM" | "GA" | "TD";
  text: L3[];
  rows?: [string, string, string, string][];
};

// Issuer profiles follow the official "Émetteurs Obligations" page of bvm-ac.org.
const ISSUERS: Issuer[] = [
  {
    id: "snpc",
    bondIssuer: "SNPC",
    name: "SNPC",
    country: "CG",
    text: [
      {
        fr: "La Société Nationale des Pétroles du Congo (SNPC) est un établissement public à caractère industriel et commercial, créé par la loi n° 1-98 du 23 avril 1998. Son capital de 81,336 milliards FCFA est détenu à 100 % par l’État congolais. Elle mène des activités pétrolières amont et aval et gère un portefeuille de titres de participations.",
        en: "Société Nationale des Pétroles du Congo (SNPC) is a public industrial and commercial establishment created by law no. 1-98 of 23 April 1998. Its capital of FCFA 81.336 billion is wholly owned by the Congolese State. It runs upstream and downstream oil activities and manages a portfolio of shareholdings.",
        es: "La Société Nationale des Pétroles du Congo (SNPC) es un establecimiento público industrial y comercial creado por la ley n.º 1-98 del 23 de abril de 1998. Su capital de 81.336 millones de FCFA pertenece al 100 % al Estado congoleño. Desarrolla actividades petroleras de upstream y downstream y gestiona una cartera de participaciones.",
      },
      {
        fr: "Dans le cadre de son plan stratégique « Performance 2025 », son Conseil d’Administration a autorisé la mobilisation de 300 milliards FCFA par un programme d’émissions obligataires sur le marché financier de la CEMAC. Le premier emprunt, « SNPC 6,5 % NET 2024-2029 », a été introduit à la cote de la BVMAC le 15 octobre 2025.",
        en: "Under its “Performance 2025” strategic plan, its Board authorised raising FCFA 300 billion through a bond programme on the CEMAC financial market. The first loan, “SNPC 6.5% NET 2024-2029”, was listed on the BVMAC on 15 October 2025.",
        es: "En el marco de su plan estratégico «Performance 2025», su Consejo de Administración autorizó captar 300.000 millones de FCFA mediante un programa de emisiones de obligaciones en el mercado financiero de la CEMAC. El primer empréstito, «SNPC 6,5 % NET 2024-2029», se admitió a cotización en la BVMAC el 15 de octubre de 2025.",
      },
    ],
  },
  {
    id: "acep",
    bondIssuer: "ACEP Cameroun",
    name: "ACEP Cameroun",
    country: "CM",
    text: [
      {
        fr: "Né en 1999 à l’initiative du Gouvernement camerounais, avec l’Union européenne et l’Agence Française de Développement, le projet ACEP a été privatisé en septembre 2005. ACEP Cameroun S.A. est un établissement de microfinance de deuxième catégorie, au capital de 1,444 milliard FCFA, qui finance les très petites entreprises et les PME en milieu urbain.",
        en: "Launched in 1999 on the initiative of the Cameroonian Government, with the European Union and the Agence Française de Développement, the ACEP project was privatised in September 2005. ACEP Cameroun S.A. is a second-category microfinance institution with capital of FCFA 1.444 billion, financing very small businesses and SMEs in urban areas.",
        es: "Nacido en 1999 por iniciativa del Gobierno camerunés, con la Unión Europea y la Agencia Francesa de Desarrollo, el proyecto ACEP se privatizó en septiembre de 2005. ACEP Cameroun S.A. es una institución de microfinanzas de segunda categoría, con capital de 1.444 millones de FCFA, que financia microempresas y pymes en entornos urbanos.",
      },
      {
        fr: "Pour son plan stratégique 2022-2024, l’Assemblée Générale Ordinaire du 23 mai 2024 a autorisé la mobilisation de 5 milliards FCFA par appel public à l’épargne. Le premier emprunt, « ACEP 7 % BRUT 2024-2027 », a fait l’objet d’une cérémonie de première cotation le 8 avril 2025.",
        en: "For its 2022-2024 strategic plan, the Ordinary General Meeting of 23 May 2024 authorised raising FCFA 5 billion through a public offering. The first loan, “ACEP 7% GROSS 2024-2027”, had its first-listing ceremony on 8 April 2025.",
        es: "Para su plan estratégico 2022-2024, la Junta General Ordinaria del 23 de mayo de 2024 autorizó captar 5.000 millones de FCFA mediante oferta pública. El primer empréstito, «ACEP 7 % BRUTO 2024-2027», celebró su ceremonia de primera cotización el 8 de abril de 2025.",
      },
    ],
  },
  {
    id: "alios",
    bondIssuer: "Alios Finance Cameroun",
    name: "Alios Finance Cameroun",
    country: "CM",
    text: [
      {
        fr: "Créée en 1959, la Société Camerounaise de Crédit Automobile (SOCCA), connue sous le nom d’ALIOS Finance Cameroun, appartient au groupe ALIOS Finance, présent dans neuf pays d’Afrique subsaharienne. Société anonyme au capital de 2,4992 milliards FCFA, elle finance les professionnels et les particuliers : crédit-bail, crédit d’investissement, location-vente, leasing opérationnel et crédit court terme.",
        en: "Created in 1959, Société Camerounaise de Crédit Automobile (SOCCA), known as ALIOS Finance Cameroun, belongs to the ALIOS Finance group, present in nine sub-Saharan African countries. A limited company with capital of FCFA 2.4992 billion, it finances businesses and individuals: leasing, investment loans, hire-purchase, operating leases and short-term credit.",
        es: "Creada en 1959, la Société Camerounaise de Crédit Automobile (SOCCA), conocida como ALIOS Finance Cameroun, pertenece al grupo ALIOS Finance, presente en nueve países de África subsahariana. Sociedad anónima con capital de 2.499,2 millones de FCFA, financia a empresas y particulares: leasing, crédito de inversión, alquiler con opción, leasing operativo y crédito a corto plazo.",
      },
      {
        fr: "Après son premier emprunt « ALIOS01 5,75 % BRUT 2018-2023 » (8 milliards FCFA, coté le 6 février 2019) puis « ALIOS02 5,40 % BRUT 2021-2025 » (10 milliards, coté le 8 décembre 2021), elle a émis en 2023 deux tranches pour 8,08 milliards FCFA : « ALIOS 03 6,5 % BRUT 2023-2028 » et « ALIOS 04 6,00 % BRUT 2023-2026 ».",
        en: "After its first loan “ALIOS01 5.75% GROSS 2018-2023” (FCFA 8 billion, listed 6 February 2019) and “ALIOS02 5.40% GROSS 2021-2025” (FCFA 10 billion, listed 8 December 2021), it issued two tranches in 2023 for FCFA 8.08 billion: “ALIOS 03 6.5% GROSS 2023-2028” and “ALIOS 04 6.00% GROSS 2023-2026”.",
        es: "Tras su primer empréstito «ALIOS01 5,75 % BRUTO 2018-2023» (8.000 millones de FCFA, admitido el 6 de febrero de 2019) y «ALIOS02 5,40 % BRUTO 2021-2025» (10.000 millones, admitido el 8 de diciembre de 2021), emitió en 2023 dos tramos por 8.080 millones de FCFA: «ALIOS 03 6,5 % BRUTO 2023-2028» y «ALIOS 04 6,00 % BRUTO 2023-2026».",
      },
    ],
  },
  {
    id: "bdeac",
    bondIssuer: "BDEAC",
    name: "BDEAC",
    country: "CG",
    text: [
      {
        fr: "La Banque de Développement des États de l’Afrique Centrale (BDEAC), créée le 3 décembre 1975, est une institution financière internationale au capital de 1 200 milliards FCFA. Elle promeut le développement durable de la CEMAC et finance les investissements nationaux, multinationaux et les projets d’intégration économique, dans les secteurs public et privé.",
        en: "The Development Bank of Central African States (BDEAC), created on 3 December 1975, is an international financial institution with capital of FCFA 1,200 billion. It promotes the sustainable development of the CEMAC and finances national and multinational investments and economic integration projects, in both the public and private sectors.",
        es: "El Banco de Desarrollo de los Estados de África Central (BDEAC), creado el 3 de diciembre de 1975, es una institución financiera internacional con capital de 1,2 billones de FCFA. Promueve el desarrollo sostenible de la CEMAC y financia inversiones nacionales, multinacionales y proyectos de integración económica, en los sectores público y privado.",
      },
      {
        fr: "Son Assemblée Générale du 30 novembre 2020 a approuvé un programme d’émissions obligataires d’environ 300 milliards FCFA sur 2020-2022. Les trois emprunts, nettement sursouscrits, sont détaillés ci-dessous.",
        en: "Its General Meeting of 30 November 2020 approved a bond issuance programme of about FCFA 300 billion over 2020-2022. The three loans, all oversubscribed, are detailed below.",
        es: "Su Asamblea General del 30 de noviembre de 2020 aprobó un programa de emisiones de unos 300.000 millones de FCFA durante 2020-2022. Los tres empréstitos, todos sobresuscritos, se detallan a continuación.",
      },
    ],
    rows: [
      ["BDEAC 5,48 % NET 2020-2027", "2021-02-03", "100 000 000 000", "106 791 920 000"],
      ["BDEAC 5,60 % NET 2021-2028", "2022-03-11", "100 000 000 000", "114 873 410 000"],
      ["BDEAC 6,00 % NET 2022-2029", "2023-02-15", "78 000 000 000", "110 856 330 000"],
    ],
  },
  {
    id: "cameroun",
    bondIssuer: "État du Cameroun",
    name: "État du Cameroun",
    country: "CM",
    text: [
      {
        fr: "L’État du Cameroun lève des fonds sur le marché financier régional par emprunts obligataires du Trésor, cotés à la BVMAC (séries « ECMR »).",
        en: "The State of Cameroon raises funds on the regional financial market through Treasury bonds listed on the BVMAC (“ECMR” series).",
        es: "El Estado de Camerún capta fondos en el mercado financiero regional mediante empréstitos del Tesoro admitidos a cotización en la BVMAC (series «ECMR»).",
      },
    ],
  },
  {
    id: "gabon",
    bondIssuer: "État du Gabon",
    name: "État du Gabon",
    country: "GA",
    text: [
      {
        fr: "L’État du Gabon est l’émetteur le plus actif de la cote obligataire, avec les séries « EGA » et « EOG » à tranches multiples.",
        en: "The State of Gabon is the most active issuer on the bond list, with the “EGA” and “EOG” multi-tranche series.",
        es: "El Estado de Gabón es el emisor más activo de la cotización de obligaciones, con las series «EGA» y «EOG» de varios tramos.",
      },
    ],
  },
  {
    id: "tchad",
    bondIssuer: "État du Tchad",
    name: "État du Tchad",
    country: "TD",
    text: [
      {
        fr: "L’État du Tchad est présent sur la cote obligataire avec la série « EOTD ».",
        en: "The State of Chad is on the bond list with the “EOTD” series.",
        es: "El Estado de Chad figura en la cotización de obligaciones con la serie «EOTD».",
      },
    ],
  },
];

const T = {
  fr: {
    intro: "Les émetteurs dont les obligations sont cotées à la BVMAC : établissements, banques de développement et États de la sous-région.",
    lines: "Lignes cotées",
    line: "Ligne",
    isin: "Code ISIN",
    maturity: "Échéance",
    noLines: "Aucune ligne cotée actuellement.",
    name: "Valeur",
    listed: "Introduction à la cote",
    wanted: "Montant voulu (FCFA)",
    raised: "Montant levé (FCFA)",
    all: "Voir toutes les obligations",
    jump: "Aller à",
    table: "Emprunts obligataires de la BDEAC",
  },
  en: {
    intro: "Issuers whose bonds are listed on the BVMAC: institutions, development banks and States of the region.",
    lines: "Listed lines",
    line: "Line",
    isin: "ISIN code",
    maturity: "Maturity",
    noLines: "No line currently listed.",
    name: "Security",
    listed: "Listing date",
    wanted: "Target amount (FCFA)",
    raised: "Amount raised (FCFA)",
    all: "See all bonds",
    jump: "Go to",
    table: "BDEAC bond loans",
  },
  es: {
    intro: "Emisores cuyas obligaciones cotizan en la BVMAC: instituciones, bancos de desarrollo y Estados de la subregión.",
    lines: "Líneas admitidas",
    line: "Línea",
    isin: "Código ISIN",
    maturity: "Vencimiento",
    noLines: "Ninguna línea admitida actualmente.",
    name: "Valor",
    listed: "Admisión a cotización",
    wanted: "Importe previsto (FCFA)",
    raised: "Importe captado (FCFA)",
    all: "Ver todas las obligaciones",
    jump: "Ir a",
    table: "Empréstitos de la BDEAC",
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/emetteurs/emetteurs-obligataires">): Promise<Metadata> {
  return pageTitle(params, (d) => d.nav.items.bondIssuers);
}

export default async function BondIssuersPage({ params }: PageProps<"/[locale]/emetteurs/emetteurs-obligataires">) {
  const { locale, dict } = await resolveLocale(params);
  const t = T[locale];
  const bonds = await getBonds();
  const dateFmt = new Intl.DateTimeFormat({ fr: "fr-FR", en: "en-GB", es: "es-ES" }[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <ContentPage locale={locale} dict={dict} title={dict.nav.items.bondIssuers} intro={t.intro}>
      <nav aria-label={t.jump} className="mb-10 flex flex-wrap gap-2">
        {ISSUERS.map((i) => (
          <a key={i.id} href={`#${i.id}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm hover:border-line-strong">
            <Flag code={i.country} />
            {i.name}
          </a>
        ))}
      </nav>

      <div className="grid gap-6">
        {ISSUERS.map((i) => {
          const lines = bonds.filter((b) => b.issuer === i.bondIssuer);
          return (
            <Reveal key={i.id}>
              <section id={i.id} aria-labelledby={`${i.id}-t`} className="scroll-mt-28 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft font-serif-display text-lg text-accent-text" aria-hidden="true">
                    {i.name.replace(/^État du /, "").slice(0, 2).toUpperCase()}
                  </span>
                  <h2 id={`${i.id}-t`} className="text-h2 !text-[clamp(1.5rem,2.6vw,2rem)]">
                    {i.name}
                  </h2>
                  <Flag code={i.country} className="ml-auto h-3.5 w-5" />
                </div>
                <div className="mt-5 grid max-w-3xl gap-3 text-muted">
                  {i.text.map((p, k) => (
                    <p key={k} lang={locale}>{p[locale]}</p>
                  ))}
                </div>

                {i.rows && (
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-line" data-lenis-prevent>
                    <table className="w-full min-w-[560px] text-sm">
                      <caption className="sr-only">{t.table}</caption>
                      <thead className="bg-surface-alt text-xs uppercase tracking-[0.08em] text-muted">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left font-medium">{t.name}</th>
                          <th scope="col" className="px-4 py-3 text-left font-medium">{t.listed}</th>
                          <th scope="col" className="px-4 py-3 text-right font-medium">{t.wanted}</th>
                          <th scope="col" className="px-4 py-3 text-right font-medium">{t.raised}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {i.rows.map(([name, date, wanted, raised]) => (
                          <tr key={name}>
                            <th scope="row" className="px-4 py-3 text-left font-medium text-heading">{name}</th>
                            <td className="px-4 py-3 text-muted">{dateFmt.format(new Date(`${date}T00:00:00Z`))}</td>
                            <td className="figure px-4 py-3 text-right">{wanted}</td>
                            <td className="figure px-4 py-3 text-right">{raised}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <h3 className="mt-6 text-xs font-medium uppercase tracking-[0.12em] text-muted">{t.lines} ({lines.length})</h3>
                {lines.length ? (
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {lines.map((b) => (
                      <li key={b.isin} className="rounded-xl border border-line px-4 py-3 text-sm">
                        <span className="block font-medium text-heading">{b.name}</span>
                        <span className="code block text-muted">{b.isin}</span>
                        {b.maturity && <span className="block text-xs text-muted">{t.maturity} {b.maturity}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">{t.noLines}</p>
                )}
              </section>
            </Reveal>
          );
        })}
      </div>

      <Link href={localePath(locale, "/marches/obligations")} className="link mt-8 inline-flex items-center gap-1 text-sm">
        {t.all}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </ContentPage>
  );
}
