// Official PDFs published by BVMAC on each equity issuer's page
// (https://www.bvm-ac.org/espace-emetteurs/emetteurs-actions/). Paths are relative to /wp-content/uploads.
const U = "https://www.bvm-ac.org/wp-content/uploads/";

export type IssuerDocs = {
  factsheet?: string;
  // Annual financial statements by year, per accounting framework.
  ohada: Partial<Record<number, string>>;
  ifrs: Partial<Record<number, string>>;
  // Other reports, with their official French title.
  reports: { title: string; url: string }[];
};

const f = (path: string) => `${U}${path}`;
const years = (list: [number, string][]) => Object.fromEntries(list.map(([y, p]) => [y, f(p)]));

export const ISSUER_DOCUMENTS: Record<string, IssuerDocs> = {
  semc: {
    factsheet: f("2025/07/FICHE-SIGNALETIQUE-SEMC-2025.pdf"),
    ohada: years([
      [2019, "2023/09/Etats-financiers-SEMC-2019.pdf"],
      [2020, "2024/08/SEMC-2020-OHADA.pdf"],
      [2021, "2023/09/Etats-financiers-SEMC-2021.pdf"],
      [2022, "2023/09/Etats-financiers-SEMC-2022.pdf"],
      [2023, "2024/07/OHADA-SITE.pdf"],
      [2024, "2025/07/Etats-financiers-OHADA-SEMC.pdf"],
      [2025, "2026/07/Etats-financiers-OHADA-SEMC-2025.pdf"],
    ]),
    ifrs: years([
      [2019, "2024/08/SEMC-2019-IFRSS.pdf"],
      [2020, "2024/08/SEMC-2020-IFRS.pdf"],
      [2021, "2024/08/SEMC-2021-IFRS.pdf"],
      [2022, "2024/08/SEMC-2022-IFRS.pdf"],
      [2023, "2024/07/IFRSS-SITE-compresse.pdf"],
      [2024, "2025/07/Etats-financiers-IFRS-SEMC-2.pdf"],
      [2025, "2026/07/Etats-financiers-IFRS-SEMC-2025.pdf"],
    ]),
    reports: [{ title: "Rapport d’activité semestriel 2024", url: f("2024/11/SEMC-Rapport-semestriel-2024-SYSCOHADA.pdf") }],
  },
  safacam: {
    ohada: years([
      [2019, "2023/09/Etats-financiers-SAFACAM-2019.pdf"],
      [2020, "2023/09/Etats-financiers-SAFACAM-2020.pdf"],
      [2021, "2023/09/Etats-financiers-SAFACAM-2021.pdf"],
      [2022, "2023/09/Etats-financiers-SAFACAM-2022.pdf"],
      [2023, "2024/07/OHADA-SAFACAM-compresse.pdf"],
      [2024, "2025/07/Etats-financiers-OHADA-SAFACAM.pdf"],
      [2025, "2026/07/Etats-financiers-OHADA-2025-SAFACAM.pdf"],
    ]),
    ifrs: years([
      [2019, "2024/08/IFRS-SAFACAM-2019_removed-compresse.pdf"],
      [2020, "2024/08/IFRS-2020_removed-1.pdf"],
      [2021, "2024/08/IFRS-2021_removed-1.pdf"],
      [2022, "2024/08/IFRS-SAFACAM-2022_removed-1.pdf"],
      [2023, "2024/07/IFRSS-SAFACAM-compresse.pdf"],
      [2024, "2025/07/Etats-financiers-IFRS-SAFACAM-1.pdf"],
      [2025, "2026/07/Etats-financiers-IFRS-2025-SAFACAM.pdf"],
    ]),
    reports: [{ title: "Rapport d’activité semestriel 2024", url: f("2024/11/Rapport-semestriel-SAFACAM-2024.pdf") }],
  },
  socapalm: {
    ohada: years([
      [2019, "2023/09/Etats-financiers-SOCAPALM-2019.pdf"],
      [2020, "2023/09/Etats-financiers-SOCAPALM-2020.pdf"],
      [2021, "2023/09/Etats-financiers-SOCAPALM-2021.pdf"],
      [2022, "2023/09/Etats-financiers-SOCAPALM-2022.pdf"],
      [2023, "2024/07/OHADA-SOCAPALM-compresse.pdf"],
      [2024, "2025/07/Etats-financiers-OHADA-2024.pdf"],
    ]),
    ifrs: years([
      [2019, "2024/07/IFRSS-SOCAPALM-2019-1.pdf"],
      [2020, "2024/07/IFRS-SOCAPALM-2020.pdf"],
      [2021, "2024/07/IFRS-SOCAPALM-2021.pdf"],
      [2022, "2024/07/IFRS-SOCAPALM-2022-1-1.pdf"],
      [2023, "2024/07/IFRS-SOCAPALM-compresse.pdf"],
      [2024, "2025/07/Etats-financiers-IFRS-2024.pdf"],
    ]),
    reports: [],
  },
  "la-regionale": {
    factsheet: f("2025/07/FICHE-SIGNALETIQUE-LA-REGIONALE-BANK-2025.pdf"),
    ohada: years([
      [2019, "2023/09/Etats-Financiers-LA-REGIONALE-2019.pdf"],
      [2020, "2023/09/Etats-financiers-LA-REGIONALE-2020.pdf"],
      [2022, "2024/08/Etats-financiers-2022-LA-REGIONALE-BANK_removed-1-1.pdf"],
      [2023, "2024/08/Etats-financiers-2023-LA-REGIONALE-BANK_removed-compresse.pdf"],
      [2024, "2025/07/Etats-financiers-REGIONALE-BANK.pdf"],
    ]),
    ifrs: {},
    reports: [
      { title: "Rapport d’activités, exercice 2021", url: f("2023/09/La-Regionale-Rapport-dactivites-exercice-2021.pdf") },
      { title: "Rapport d’activité semestriel 2024", url: f("2024/11/LA-REGIONALE-ETATS-FINANCIERS-30-06-24-2.pdf") },
      { title: "Rapport de gestion 2024", url: f("2025/07/RAPPORT-DE-GESTION-2024.pdf") },
    ],
  },
  bange: {
    ohada: years([
      [2021, "2023/09/Etats-financiers-BANGE-2021.pdf"],
      [2022, "2023/09/Etats-financiers-BANGE-2022.pdf"],
      [2023, "2024/10/Etats-financiers-BANGE-2023-compresse.pdf"],
    ]),
    ifrs: {},
    reports: [{ title: "Rapport de gestion 2024", url: f("2025/07/RAPPORT-DE-GESTION-BANGE-2024.pdf") }],
  },
  "scg-re": {
    factsheet: f("2025/12/Fiche-signaletique-SCG-Re-2024.pdf"),
    ohada: years([
      [2023, "2024/10/Etats-financiers-SCG-Re-2023-1-1.pdf"],
      [2024, "2025/10/Etats-financiers-SCG-Re-2024.pdf"],
    ]),
    ifrs: {},
    reports: [],
  },
  "bgfi-holding": {
    ohada: years([[2025, "2026/09/Etats-financiers-BGFI-2025.pdf"]]),
    ifrs: {},
    reports: [],
  },
};
