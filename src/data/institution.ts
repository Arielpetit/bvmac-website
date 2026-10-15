// Institutional content. Facts come from the current BVMAC website (presentation,
// history, organisation pages). Items marked "à confirmer" need BVMAC validation;
// names of board members and directors are placeholders.

export const LEGAL_BASIS =
  "Règlement N°01/22/CEMAC/UMAC/CM/COSUMAF du 22 juillet 2022 portant organisation et fonctionnement du marché financier de l'Afrique Centrale";

export const MISSIONS = [
  { title: "Organiser l'inscription et la cotation des valeurs", text: "Admettre les titres à la cote, organiser les séances de cotation et garantir la sécurité des plateformes." },
  { title: "Assurer la publication des cours", text: "Diffuser après chaque séance les cours, volumes et informations de marché, de façon équitable pour tous." },
  { title: "Promouvoir le développement du marché", text: "Accompagner les entreprises et les États vers la bourse et développer l'éducation financière dans la sous-région." },
];

export const FUNCTIONS = [
  "Autoriser l'admission des instruments financiers à sa cote officielle.",
  "Assurer une gestion optimale de ses plateformes techniques et garantir leur sécurité et leur fiabilité opérationnelle.",
  "Assurer une liaison technique sécurisée avec les sociétés de bourse pour la bonne exécution des ordres.",
  "Contrôler les sociétés de bourse dans l'exercice de leur activité de négociation.",
  "Enregistrer les négociations et transmettre les données au Dépositaire Central pour la livraison des titres et le paiement.",
  "Publier, après chaque séance de cotation, les informations sur les transactions réalisées.",
  "Assurer une diffusion équitable de l'information boursière.",
  "Surveiller le marché boursier.",
  "Suspendre ou radier un titre de la cote, après en avoir informé la COSUMAF et l'émetteur.",
  "Communiquer sans délai à la COSUMAF toute information de nature à affecter le bon fonctionnement du marché.",
  "Proposer à la COSUMAF des mesures visant à développer le marché financier.",
];

export const REGALIAN = [
  "Égalité de traitement et d'information des intervenants",
  "Bon fonctionnement du marché",
  "Transparence des opérations",
  "Sécurité des opérations",
  "Prévention des pratiques illicites",
  "Surveillance permanente des opérations",
  "Protection des investisseurs",
];

export const TIMELINE = [
  { date: "Nov. 1994", title: "Décision de créer une bourse régionale", text: "À la demande des pays de la sous-région, le Conseil d'Administration de la BEAC charge la BEAC de créer la BVMAC." },
  { date: "Juin 1999", title: "Étude de faisabilité", text: "L'étude conclut à la viabilité d'une bourse régionale pour l'Afrique centrale." },
  { date: "Déc. 2000", title: "Choix du siège", text: "La conférence de N'Djamena désigne Libreville pour abriter le siège de la BVMAC." },
  { date: "Juin 2003", title: "Création de la BVMAC", text: "La BVMAC est créée le 27 juin 2003 à Libreville pour financer les économies des pays de la CEMAC." },
  { date: "Nov. 2003", title: "Cadre réglementaire", text: "Adoption du règlement CEMAC-UMAC portant organisation, fonctionnement et surveillance du marché financier de l'Afrique centrale." },
  { date: "2006 – 2007", title: "Assistance opérationnelle", text: "Contrats d'assistance avec Maroclear (règlement-livraison) et la Bourse de Casablanca (cotation)." },
  { date: "Juil. 2022", title: "Nouvelle organisation du marché", text: "Le Règlement N°01/22/CEMAC/UMAC/CM/COSUMAF du 22 juillet 2022 organise le marché financier de l'Afrique centrale ; la BVMAC, dont le siège est à Douala, en est l'entreprise de marché." },
  { date: "7 mai 2026", title: "Première cotation de BGFI Holding Corporation", text: "Cérémonie de première cotation de la holding du Groupe BGFIBank sur le compartiment A-Premium." },
];

export type MarketNode = { id: string; name: string; role: string; details: string[]; href?: string };

export const MARKET_NODES: MarketNode[] = [
  { id: "cemac", name: "CEMAC · UMAC · BEAC", role: "Cadre régional", details: ["Communauté Économique et Monétaire de l'Afrique Centrale et Union Monétaire.", "La BEAC, banque centrale, assure temporairement la fonction de dépositaire central."], href: "https://www.cemac.int/" },
  { id: "cosumaf", name: "COSUMAF", role: "Régulateur", details: ["Autorité de régulation, de contrôle et de surveillance du marché financier de l'Afrique centrale.", "Veille au bon fonctionnement du marché et agrée les intervenants."], href: "https://cosumaf.org/" },
  { id: "bvmac", name: "BVMAC", role: "Entreprise de marché", details: ["Investie à titre exclusif de la mission de service public d'organisation, d'animation et de gestion du marché financier régional.", "Admet les titres, organise la cotation, diffuse l'information et surveille le marché."] },
  { id: "crdv", name: "Dépositaire central (CRDV)", role: "Règlement-livraison", details: ["Caisse Régionale de Dépôt de Valeurs : conservation des titres, règlement-livraison des transactions.", "Fonction assurée temporairement par la BEAC."] },
  { id: "sdb", name: "Sociétés de bourse", role: "Intermédiaires agréés", details: ["25 sociétés agréées par la COSUMAF dans la CEMAC.", "Négociation, placement, tenue de compte, gestion sous mandat et conseil."] },
  { id: "issuers", name: "Émetteurs", role: "Entreprises et États", details: ["Sociétés cotées et États ou institutions qui émettent des obligations.", "Publient leurs informations financières et leurs avis."] },
  { id: "investors", name: "Investisseurs", role: "Particuliers et institutionnels", details: ["Achètent et vendent des titres par l'intermédiaire d'une société de bourse.", "Protégés par les règles du marché et la surveillance de la COSUMAF."] },
];

export const SHAREHOLDING = {
  asOf: "2024-10-17",
  capital: 9_073_000_000,
  parts: [
    { label: "Entités publiques", value: 29 },
    { label: "Banques et microfinances", value: 22 },
    { label: "Sociétés de bourse", value: 12 },
    { label: "Sociétés d'assurance", value: 6 },
    { label: "Autres", value: 31 },
  ],
};

export const BOARD = Array.from({ length: 10 }, (_, i) => ({
  name: `Administrateur ${i + 1}`,
  role: i === 0 ? "Président du Conseil d'Administration" : "Administrateur",
  entity: ["Entité publique", "Banque", "Société de bourse", "Assurance", "Autre actionnaire"][i % 5],
}));

export type OrgUnit = { title: string; text?: string; children?: OrgUnit[] };

// Placeholder structure: replace with BVMAC's official organigramme.
export const ORG_CHART: OrgUnit = {
  title: "Direction Générale",
  text: "Directeur Général, assisté du Secrétariat de Direction",
  children: [
    { title: "Direction des Opérations de Marché", text: "Cotation, admission, surveillance", children: [{ title: "Service Cotation" }, { title: "Service Admission et Émetteurs" }] },
    { title: "Direction des Systèmes d'Information", text: "Plateformes, sécurité, données", children: [{ title: "Service Infrastructures" }, { title: "Sécurité des SI (RSSI)" }] },
    { title: "Direction Juridique et Conformité", text: "Réglementation, contrôle, éthique", children: [{ title: "Service Juridique" }, { title: "Contrôle et Conformité" }] },
    { title: "Direction Administrative et Financière", text: "Finances, ressources humaines, achats", children: [{ title: "Comptabilité et Finances" }, { title: "Ressources Humaines" }] },
    { title: "Service Communication", text: "Image, relations presse, éducation financière" },
  ],
};

export type Tender = { ref: string; title: string; type: "Appel d’offres" | "Manifestation d’intérêt" | "Appel à candidatures" | "Recrutement"; published: string; deadline?: string; open: boolean; url: string };

// From www.bvm-ac.org news and tenders (2025-2026).
export const TENDERS: Tender[] = [
  { ref: "Ingénieur Support", title: "Rejoignez l’équipe des Ressources Humaines de la BVMAC : recrutement d’un Ingénieur Support", type: "Recrutement", published: "2026-10-09", open: true, url: "https://www.bvm-ac.org/actualites-bvmac-en/rejoignez-lequipe-des-ressources-humaines-de-la-bvmac-en-postulant-a-loffre-ci-apres/" },
  { ref: "N°031/06/BVMAC/DSI/09-26", title: "Consultation pour la fourniture d’un accès Internet professionnel", type: "Appel d’offres", published: "2026-09-25", open: true, url: "https://www.bvm-ac.org/actualite/appel-doffres-restreint-n031-06-bvmac-dsi-09-26/" },
  { ref: "AMI N°002/BEAC/SG/UGRIF/PASFIC/SQC/2026", title: "Recrutement d’un cabinet pour la feuille de route de l’introduction en bourse des institutions financières (BEAC)", type: "Manifestation d’intérêt", published: "2026-09-16", open: true, url: "https://www.bvm-ac.org/actualite/avis-a-manifestation-dinteret-n002-beac-sg-ugrif-pasfic-sqc-2026-du-09-09-2026-portant-sur-le-recrutement-dun-cabinet-pour-letablissement-dune-feuille-de-route-pour-lintroduction-en-bo/" },
  { ref: "N°030/06/BVMAC/DG/DSI/07-26", title: "Refonte du site web et de l’application mobile de la BVMAC", type: "Appel d’offres", published: "2026-07-13", deadline: "2026-07-22", open: false, url: "https://www.bvm-ac.org/actualite/appel-doffres-restreint-n-n030-06-bvmac-dg-dsi-07-26/" },
  { ref: "N°029/04/BVMAC/DSI/02-26", title: "Formation des agents de la Direction des Systèmes d’Information", type: "Appel d’offres", published: "2026-05-05", open: false, url: "https://www.bvm-ac.org/actualite/appel-doffres-restreint-n-n029-04-bvmac-dsi-02-26/" },
  { ref: "AMI 2026", title: "Sélection et financement des sociétés pouvant bénéficier de la prise en charge des frais d’introduction en bourse", type: "Manifestation d’intérêt", published: "2026-03-18", open: false, url: "https://www.bvm-ac.org/actualite/avis-a-manifestation-dinteret/" },
  { ref: "N°025/01/BVMAC/DSI/01-26", title: "Refonte et renforcement de la sécurité des accès physiques de la BVMAC", type: "Appel d’offres", published: "2026-01-21", open: false, url: "https://www.bvm-ac.org/actualite/appel-doffres-n-025-01-bvmac-dsi-01-26/" },
  { ref: "N°024/17/BVMAC/DSI/10-25", title: "Solution professionnelle et sécurisée de bureau à distance", type: "Appel d’offres", published: "2025-10-10", open: false, url: "https://www.bvm-ac.org/actualite/appel-doffres-n-024-17-bvmac-dsi-10-25/" },
  { ref: "N°001/01/BVMAC/DG/05-25", title: "Sélection de commissaires aux comptes à compter de l’exercice 2025", type: "Appel à candidatures", published: "2025-05-14", open: false, url: "https://www.bvm-ac.org/actualites-bvmac-en/appel-a-candidatures-n001-01-bvmac-dg-05-25/" },
];
