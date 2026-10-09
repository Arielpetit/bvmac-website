// Photo albums and videos (photos from www.bvm-ac.org "Photothèque").
export type Album = { id: string; title: string; date: string; photos: { src: string; alt: string }[] };

export const ALBUMS: Album[] = [
  {
    id: "premiere-cotation",
    title: "Cérémonie de la première cotation",
    date: "Février 2020",
    photos: [
      { src: "/photos/ceremony-speech.webp", alt: "Allocution au pupitre lors de la cérémonie de première cotation" },
      { src: "/photos/ceremony-podium.webp", alt: "Discours officiel devant le logo de la BVMAC" },
      { src: "/photos/ceremony-audience.webp", alt: "Invités assis sous la tente de la cérémonie" },
      { src: "/photos/ceremony-guests.webp", alt: "Personnalités au premier rang" },
      { src: "/photos/ceremony-handshake.webp", alt: "Poignée de main entre officiels devant l’Immeuble de la Bourse" },
      { src: "/photos/ceremony-arrival.webp", alt: "Arrivée des invités sur le tapis rouge" },
      { src: "/photos/ceremony-trading-floor.webp", alt: "Officiels dans la salle de cotation" },
      { src: "/photos/ceremony-trading-floor-2.webp", alt: "Échanges dans la salle de cotation" },
      { src: "/photos/ceremony-talk.webp", alt: "Entretien entre deux personnalités" },
    ],
  },
  {
    id: "installation-dg",
    title: "Passation de service et installation du Directeur Général",
    date: "29 décembre 2021",
    photos: [
      { src: "/photos/governance-handover.webp", alt: "Passation de service entre le Directeur Général sortant et le nouveau Directeur Général" },
      { src: "/photos/governance-officials.webp", alt: "Officiels devant les drapeaux des pays de la CEMAC" },
      { src: "/photos/governance-group.webp", alt: "Photo de groupe devant l’Immeuble de la Bourse" },
    ],
  },
  {
    id: "essec",
    title: "Visite d’entreprise des étudiants de l’ESSEC Douala",
    date: "26 novembre 2021",
    photos: [
      { src: "/photos/school-students.webp", alt: "Étudiants de l’ESSEC Douala dans la salle de conférence de la BVMAC" },
      { src: "/photos/school-students-2.webp", alt: "Étudiantes attentives pendant la présentation" },
      { src: "/photos/school-students-3.webp", alt: "Étudiants pendant la visite" },
    ],
  },
  {
    id: "iut-jif",
    title: "Visite de l’IUT de Douala et Journée internationale des femmes",
    date: "Juin et mars 2021",
    photos: [
      { src: "/photos/school-iut.webp", alt: "Étudiants de l’IUT de Douala en visite à la BVMAC" },
      { src: "/photos/event-jif.webp", alt: "Collaboratrices de la BVMAC lors de la Journée internationale des femmes" },
      { src: "/photos/bvmac-building.webp", alt: "Immeuble de la Bourse à Douala" },
    ],
  },
];

export type Video = { id: string; title: string; caption: string; playlist: "Cérémonies" | "Reportages" | "Pédagogie"; poster: string };

export const VIDEOS: Video[] = [
  { id: "v1", title: "Cérémonie de première cotation de BGFI Holding Corporation", caption: "7 mai 2026 · Compartiment A-Premium", playlist: "Cérémonies", poster: "/photos/ceremony-speech.webp" },
  { id: "v2", title: "Première cotation à la bourse d’Afrique centrale", caption: "Cérémonie de 2020", playlist: "Cérémonies", poster: "/photos/ceremony-trading-floor.webp" },
  { id: "v3", title: "La BVMAC demande aux entreprises de la CEMAC d’entrer en bourse", caption: "Reportage", playlist: "Reportages", poster: "/photos/ceremony-talk.webp" },
  { id: "v4", title: "Un marché financier commun et unique en Afrique centrale", caption: "Reportage", playlist: "Reportages", poster: "/photos/bvmac-building.webp" },
  { id: "v5", title: "Ouverture de la bourse aux épargnants", caption: "Reportage", playlist: "Pédagogie", poster: "/photos/ceremony-audience.webp" },
  { id: "v6", title: "Visite des étudiants à la BVMAC", caption: "Éducation financière", playlist: "Pédagogie", poster: "/photos/school-students.webp" },
];
