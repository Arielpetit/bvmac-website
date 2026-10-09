// École de bourse content (French). Educational only: no advice, no recommendation.
// To be reviewed by BVMAC (and COSUMAF where relevant) before publication.

/** `answer` is an index, or a list of indexes for questions with several correct answers. */
export type Question = { q: string; options: string[]; answer: number | number[]; explain: string };
export type Lesson = { slug: string; path: string; title: string; minutes: number; sections: { h: string; p: string }[]; keep: string; quiz: Question[] };
export type Path = { slug: string; title: string; text: string; badge: string };

export const PATHS: Path[] = [
  { slug: "comprendre-la-bourse", title: "Comprendre la bourse", text: "Ce qu'est une bourse, à quoi elle sert et qui fait quoi sur le marché régional.", badge: "Premier pas" },
  { slug: "investir-via-une-societe-de-bourse", title: "Investir via une société de bourse", text: "Ouvrir un compte, passer un ordre, connaître ses frais et ses droits.", badge: "Investisseur averti" },
  { slug: "lire-un-boc", title: "Lire un BOC", text: "Comprendre les colonnes du Bulletin Officiel de la Cote.", badge: "Lecteur de BOC" },
  { slug: "investir-dans-une-obligation", title: "Investir dans une obligation", text: "Coupon, échéance, risque de l'émetteur : les bases du marché obligataire.", badge: "Expert obligations" },
  { slug: "s-introduire-en-bourse", title: "S'introduire en bourse", text: "Pourquoi et comment une entreprise ou un État lève des fonds en bourse.", badge: "Émetteur informé" },
];

export const LESSONS: Lesson[] = [
  {
    slug: "comprendre-la-bourse", path: "comprendre-la-bourse", title: "À quoi sert une bourse ?", minutes: 4,
    sections: [
      { h: "Un lieu de rencontre", p: "Une bourse met en relation des entreprises ou des États qui ont besoin de financement et des épargnants qui cherchent à placer leur argent. Elle organise ces échanges selon des règles communes et publiques." },
      { h: "Deux marchés", p: "Sur le marché primaire, un émetteur vend des titres nouveaux pour lever des fonds. Sur le marché secondaire, les investisseurs s'échangent ensuite ces titres entre eux : c'est la cotation quotidienne." },
    ],
    keep: "La bourse finance l'économie et permet aux épargnants d'acheter ou de revendre des titres dans un cadre réglementé.",
    quiz: [
      { q: "Sur quel marché un émetteur lève-t-il de nouveaux fonds ?", options: ["Le marché primaire", "Le marché secondaire", "Le marché des changes"], answer: 0, explain: "Le marché primaire est celui de l'émission : l'argent va à l'émetteur." },
      { q: "Que se passe-t-il sur le marché secondaire ?", options: ["L'émetteur reçoit de l'argent", "Les investisseurs s'échangent des titres existants", "La banque centrale fixe les taux"], answer: 1, explain: "Sur le marché secondaire, l'argent passe d'un investisseur à un autre." },
      { q: "Qui fixe les règles du marché financier régional ?", options: ["Les sociétés cotées", "La COSUMAF", "Chaque investisseur"], answer: 1, explain: "La COSUMAF est l'autorité de régulation et de surveillance du marché." },
      { q: "Lesquels sont des acteurs du marché régional ? (plusieurs réponses)", options: ["La COSUMAF", "Les sociétés de bourse", "Le FMI", "La BVMAC"], answer: [0, 1, 3], explain: "Régulateur, intermédiaires et entreprise de marché font partie du marché ; le FMI n’y intervient pas."  },
    ],
  },
  {
    slug: "actions-et-obligations", path: "comprendre-la-bourse", title: "Actions et obligations", minutes: 5,
    sections: [
      { h: "L'action", p: "Une action est une part du capital d'une société. L'actionnaire devient copropriétaire : il peut recevoir un dividende et voter en assemblée générale. Le cours de l'action varie selon l'offre et la demande." },
      { h: "L'obligation", p: "Une obligation est un prêt accordé à un émetteur (entreprise, État, institution). En échange, l'émetteur verse des intérêts appelés coupons et rembourse le capital à l'échéance." },
    ],
    keep: "Action = part du capital, revenus variables. Obligation = prêt, revenus fixés à l'avance mais pas sans risque.",
    quiz: [
      { q: "Qu'est-ce qu'une obligation ?", options: ["Une part du capital", "Un prêt à un émetteur", "Un compte d'épargne"], answer: 1, explain: "L'obligataire prête de l'argent et reçoit des coupons." },
      { q: "Le dividende d'une action est-il garanti ?", options: ["Oui, toujours", "Non, il dépend des résultats et du vote de l'assemblée", "Oui, s'il est inscrit au BOC"], answer: 1, explain: "Le dividende est décidé chaque année par l'assemblée générale." },
      { q: "Comment s'appelle l'intérêt versé par une obligation ?", options: ["Le coupon", "Le nominal", "La prime"], answer: 0, explain: "Le coupon est l'intérêt périodique de l'obligation." },
      { q: "Quels droits a un actionnaire ? (plusieurs réponses)", options: ["Recevoir un dividende s’il est voté", "Voter en assemblée générale", "Être remboursé à une date fixe", "Recevoir un coupon garanti"], answer: [0, 1], explain: "L’actionnaire a droit au dividende voté et au vote en assemblée. Remboursement et coupon concernent les obligations." },
    ],
  },
  {
    slug: "qui-fait-quoi", path: "comprendre-la-bourse", title: "Qui fait quoi sur le marché régional ?", minutes: 4,
    sections: [
      { h: "Les institutions", p: "La COSUMAF régule et surveille. La BVMAC organise la cotation et diffuse l'information. Le dépositaire central conserve les titres et assure le règlement-livraison." },
      { h: "Les intermédiaires", p: "Les sociétés de bourse, agréées par la COSUMAF, reçoivent et exécutent les ordres des investisseurs. Un particulier passe toujours par l'une d'elles." },
    ],
    keep: "Pour investir, on passe par une société de bourse agréée ; la BVMAC organise le marché.",
    quiz: [
      { q: "Auprès de qui un particulier passe-t-il un ordre ?", options: ["Directement à la BVMAC", "Auprès d'une société de bourse agréée", "Auprès de la COSUMAF"], answer: 1, explain: "Seules les sociétés de bourse agréées reçoivent les ordres du public." },
      { q: "Qui conserve les titres ?", options: ["Le dépositaire central", "La société cotée", "L'investisseur sur papier"], answer: 0, explain: "Le dépositaire central assure la conservation et le règlement-livraison." },
      { q: "Quel est le rôle de la BVMAC ?", options: ["Prêter de l'argent", "Organiser la cotation et diffuser l'information", "Fixer les impôts"], answer: 1, explain: "La BVMAC est l'entreprise de marché." },
    ],
  },
  {
    slug: "ouvrir-un-compte", path: "investir-via-une-societe-de-bourse", title: "Ouvrir un compte titres", minutes: 4,
    sections: [
      { h: "Deux comptes", p: "La société de bourse ouvre un compte titres, où sont inscrites vos valeurs, et un compte espèces, qui reçoit vos fonds, vos dividendes et vos coupons." },
      { h: "Les pièces demandées", p: "Une pièce d'identité, un justificatif de domicile et des informations sur votre situation et vos objectifs. Ces informations permettent à l'intermédiaire de vérifier que les produits vous conviennent." },
    ],
    keep: "Compte titres + compte espèces, ouverts par une société de bourse après vérification de votre identité.",
    quiz: [
      { q: "Où sont inscrites vos actions ?", options: ["Sur le compte titres", "Sur le compte espèces", "Sur le BOC"], answer: 0, explain: "Le compte titres recense vos valeurs mobilières." },
      { q: "Pourquoi l'intermédiaire pose-t-il des questions sur vos objectifs ?", options: ["Par curiosité", "Pour vérifier l'adéquation des produits", "Pour fixer le cours"], answer: 1, explain: "C'est une règle de protection des investisseurs." },
      { q: "Où sont versés les dividendes ?", options: ["Sur le compte espèces", "En titres uniquement", "À la BVMAC"], answer: 0, explain: "Les revenus en argent arrivent sur le compte espèces." },
    ],
  },
  {
    slug: "passer-un-ordre", path: "investir-via-une-societe-de-bourse", title: "Passer un ordre de bourse", minutes: 5,
    sections: [
      { h: "Le contenu d'un ordre", p: "Un ordre précise le sens (achat ou vente), la valeur, la quantité, la limite de prix éventuelle et la durée de validité." },
      { h: "L'exécution", p: "La société de bourse transmet l'ordre au marché. À la BVMAC, les ordres sont confrontés lors du fixing : un cours unique est déterminé et les ordres compatibles sont exécutés." },
    ],
    keep: "Un ordre précis (sens, valeur, quantité, prix, durée) est exécuté au fixing s'il trouve une contrepartie.",
    quiz: [
      { q: "Qu'est-ce que le fixing ?", options: ["Une commission", "La confrontation des ordres pour fixer un cours", "Un dividende"], answer: 1, explain: "Le fixing détermine un cours d'équilibre entre offre et demande." },
      { q: "Un ordre est-il toujours exécuté ?", options: ["Oui", "Non, il faut une contrepartie compatible", "Oui, si le montant est élevé"], answer: 1, explain: "Sans vendeur au prix demandé, un ordre d'achat limité reste en attente." },
      { q: "Quelle information n'est pas dans un ordre ?", options: ["La quantité", "Le sens", "Le dividende futur"], answer: 2, explain: "Le dividende futur n'est pas connu au moment de l'ordre." },
    ],
  },
  {
    slug: "frais-et-droits", path: "investir-via-une-societe-de-bourse", title: "Frais et droits de l'investisseur", minutes: 4,
    sections: [
      { h: "Les frais", p: "Chaque transaction supporte des commissions (marché, dépositaire, régulateur, courtage) et le compte peut supporter des droits de garde. Comparez les tarifs publiés par les sociétés de bourse." },
      { h: "Les droits", p: "L'actionnaire a droit aux dividendes votés, au vote en assemblée et à l'information. En cas de litige, il peut déposer une réclamation." },
    ],
    keep: "Connaître ses frais avant d'investir ; connaître ses droits après.",
    quiz: [
      { q: "Que sont les droits de garde ?", options: ["Des frais de tenue du compte titres", "Un impôt", "Un dividende"], answer: 0, explain: "Ils rémunèrent la conservation des titres." },
      { q: "Que faire en cas de litige ?", options: ["Rien", "S'adresser à sa société de bourse puis déposer une réclamation", "Vendre ses titres"], answer: 1, explain: "La réclamation suit d'abord l'intermédiaire, puis la BVMAC." },
      { q: "Les tarifs sont-ils identiques partout ?", options: ["Oui", "Non, le courtage varie selon la société", "Oui, fixés par la loi"], answer: 1, explain: "Le courtage est fixé librement par chaque société de bourse." },
    ],
  },
  {
    slug: "lire-un-boc", path: "lire-un-boc", title: "Les colonnes du BOC", minutes: 5,
    sections: [
      { h: "Cours de référence et de clôture", p: "Le cours de référence est le point de départ de la séance. Le cours de clôture est le cours retenu à l'issue de la séance. La variation compare les deux, en pourcentage." },
      { h: "Quantités", p: "La quantité demandée et la quantité offerte montrent l'intérêt des acheteurs et des vendeurs. La quantité transigée indique les titres réellement échangés." },
    ],
    keep: "Variation = (clôture − référence) ÷ référence. Transigé = réellement échangé.",
    quiz: [
      { q: "Un titre passe de 10 000 à 10 100 FCFA. Quelle est la variation ?", options: ["+1 %", "+10 %", "+0,1 %"], answer: 0, explain: "100 ÷ 10 000 = 1 %." },
      { q: "Que signifie une quantité transigée de zéro ?", options: ["Aucun titre n'a été échangé", "Le titre est radié", "Le cours a doublé"], answer: 0, explain: "Il peut y avoir des ordres sans échange." },
      { q: "Quand le BOC est-il publié ?", options: ["Après chaque séance", "Une fois par an", "Seulement en cas d'introduction"], answer: 0, explain: "La BVMAC publie le BOC après chaque séance de cotation." },
    ],
  },
  {
    slug: "statuts-et-avis", path: "lire-un-boc", title: "Statuts de cotation et avis", minutes: 3,
    sections: [
      { h: "Le statut d'une valeur", p: "Une valeur peut être cotée, non cotée ce jour (absence d'échange) ou suspendue par la BVMAC après information de la COSUMAF et de l'émetteur." },
      { h: "Les avis", p: "Les avis de la BVMAC annoncent les événements : introductions, dividendes, assemblées, suspensions. Ils sont numérotés et datés." },
    ],
    keep: "Lisez le statut avec le cours, et suivez les avis numérotés de la BVMAC.",
    quiz: [
      { q: "Qui peut suspendre un titre ?", options: ["La BVMAC, après information de la COSUMAF et de l'émetteur", "Un actionnaire", "La société de bourse"], answer: 0, explain: "C'est une prérogative de l'entreprise de marché." },
      { q: "Où trouver l'annonce d'un dividende ?", options: ["Dans un avis de la BVMAC", "Sur les réseaux sociaux uniquement", "Nulle part"], answer: 0, explain: "Les avis officiels sont la source de référence." },
      { q: "« Non coté ce jour » signifie :", options: ["Aucun échange pendant la séance", "Le titre a disparu", "Le cours est garanti"], answer: 0, explain: "Le titre reste inscrit à la cote." },
    ],
  },
  {
    slug: "investir-dans-une-obligation", path: "investir-dans-une-obligation", title: "Coupon, échéance, nominal", minutes: 5,
    sections: [
      { h: "Le vocabulaire", p: "Le nominal est la valeur faciale de l'obligation. Le taux d'intérêt appliqué au nominal donne le coupon. L'échéance est la date de remboursement." },
      { h: "Le prix", p: "Avant l'échéance, une obligation se négocie à un prix exprimé en pourcentage du nominal. Ce prix varie notamment avec les taux d'intérêt et la qualité de l'émetteur." },
    ],
    keep: "Coupon = nominal × taux. Le prix d'une obligation se lit en % du nominal.",
    quiz: [
      { q: "Nominal 10 000 FCFA, taux 6 %. Quel est le coupon annuel ?", options: ["600 FCFA", "60 FCFA", "6 000 FCFA"], answer: 0, explain: "10 000 × 6 % = 600 FCFA." },
      { q: "Un prix de 101 signifie :", options: ["101 % du nominal", "101 FCFA", "101 titres"], answer: 0, explain: "Le prix des obligations est exprimé en pourcentage du nominal." },
      { q: "Qu'est-ce que l'échéance ?", options: ["La date de remboursement", "La date du dividende", "La date d'introduction"], answer: 0, explain: "À l'échéance, le capital est remboursé." },
    ],
  },
  {
    slug: "risques-obligataires", path: "investir-dans-une-obligation", title: "Les risques d'une obligation", minutes: 4,
    sections: [
      { h: "Le risque de l'émetteur", p: "Si l'émetteur rencontre des difficultés, il peut payer en retard ou ne pas rembourser. Le document d'information visé par la COSUMAF décrit l'émetteur et l'opération." },
      { h: "Le risque de prix", p: "Si vous vendez avant l'échéance, le prix peut être inférieur au prix payé. Un marché peu actif peut aussi rendre la revente plus lente." },
    ],
    keep: "Une obligation n'est pas sans risque : lisez le document d'information.",
    quiz: [
      { q: "Quel document décrit une émission obligataire ?", options: ["Le document d'information visé par la COSUMAF", "Le BOC", "Le relevé bancaire"], answer: 0, explain: "Il présente l'émetteur, les conditions et les risques." },
      { q: "Revendre avant l'échéance peut entraîner :", options: ["Une perte ou un gain selon le prix", "Toujours un gain", "Une amende"], answer: 0, explain: "Le prix de marché varie avant l'échéance." },
      { q: "Un État peut-il émettre des obligations à la BVMAC ?", options: ["Oui", "Non", "Seulement le Gabon"], answer: 0, explain: "Les États de la CEMAC émettent des obligations sur le marché régional." },
    ],
  },
  {
    slug: "pourquoi-entrer-en-bourse", path: "s-introduire-en-bourse", title: "Pourquoi entrer en bourse ?", minutes: 4,
    sections: [
      { h: "Lever des fonds", p: "La bourse permet de financer des projets en ouvrant le capital ou en empruntant auprès d'un large public, sans dépendre d'un seul prêteur." },
      { h: "Visibilité et exigences", p: "La cotation donne de la visibilité et une valeur de marché, mais impose transparence, gouvernance et publication régulière d'informations." },
    ],
    keep: "Entrer en bourse : plus de financement et de visibilité, en échange de transparence.",
    quiz: [
      { q: "Une société cotée doit :", options: ["Publier régulièrement ses informations", "Garder ses comptes secrets", "Verser un dividende fixe"], answer: 0, explain: "La transparence est la contrepartie de l'accès au marché." },
      { q: "Qui examine une demande d'introduction ?", options: ["Le Comité d'Admission et de Développement de la BVMAC", "Les actionnaires existants seuls", "La société de bourse seule"], answer: 0, explain: "La décision est publiée par avis." },
      { q: "Une entreprise peut-elle lever des fonds par obligations ?", options: ["Oui", "Non", "Seulement les banques"], answer: 0, explain: "Entreprises, États et institutions peuvent émettre des obligations." },
    ],
  },
  {
    slug: "etapes-introduction", path: "s-introduire-en-bourse", title: "Les étapes d'une introduction", minutes: 5,
    sections: [
      { h: "Préparer", p: "L'entreprise se met en conformité, fait auditer ses comptes et choisit une société de bourse et des conseils." },
      { h: "Obtenir les autorisations", p: "Elle dépose un dossier d'admission à la BVMAC et un document d'information soumis au visa de la COSUMAF, puis l'opération d'appel public à l'épargne s'ouvre avant la première cotation." },
    ],
    keep: "Préparation, dossier, visa, décision publiée par avis, puis première cotation.",
    quiz: [
      { q: "Qui vise le document d'information ?", options: ["La COSUMAF", "La BEAC", "Le dépositaire"], answer: 0, explain: "Le visa de la COSUMAF est requis pour un appel public à l'épargne." },
      { q: "Quel compartiment exige une capitalisation d'au moins 10 milliards FCFA ?", options: ["A-Premium", "Tous", "Aucun"], answer: 0, explain: "C'est l'un des critères du compartiment A-Premium." },
      { q: "Comment la décision d'admission est-elle rendue publique ?", options: ["Par un avis de la BVMAC", "Par un courrier privé", "Elle reste confidentielle"], answer: 0, explain: "Les décisions sont publiées dans les avis." },
    ],
  },
  {
    slug: "diversifier", path: "investir-via-une-societe-de-bourse", title: "Diversifier et penser long terme", minutes: 3,
    sections: [
      { h: "Ne pas tout miser sur un titre", p: "Répartir son épargne entre plusieurs titres et plusieurs types de produits réduit l'impact d'une mauvaise nouvelle sur un seul émetteur." },
      { h: "Le temps", p: "Les cours varient à court terme. Investir avec un horizon cohérent avec ses projets évite de devoir vendre au mauvais moment." },
    ],
    keep: "Diversification et horizon long réduisent le risque, sans le supprimer.",
    quiz: [
      { q: "La diversification permet :", options: ["De réduire le risque lié à un seul émetteur", "De garantir un gain", "D'éviter les frais"], answer: 0, explain: "Elle répartit le risque, sans l'annuler." },
      { q: "Les performances passées garantissent-elles l'avenir ?", options: ["Non", "Oui", "Seulement pour les obligations"], answer: 0, explain: "Les performances passées ne préjugent pas des performances futures." },
      { q: "Pourquoi un horizon long ?", options: ["Pour ne pas être forcé de vendre lors d'une baisse", "Pour payer moins d'impôts partout", "Pour éviter le BOC"], answer: 0, explain: "Un horizon adapté évite les ventes contraintes." },
    ],
  },
  {
    slug: "lire-un-avis-de-dividende", path: "lire-un-boc", title: "Lire un avis de dividende", minutes: 3,
    sections: [
      { h: "Les dates clés", p: "Un avis de dividende indique le montant par action, la date de détachement et la date de paiement. Pour toucher le dividende, il faut détenir l'action avant la date de détachement." },
      { h: "L'effet sur le cours", p: "Le jour du détachement, le cours de référence est ajusté du montant du dividende : ce n'est pas une perte de valeur pour l'actionnaire." },
    ],
    keep: "Détenir l'action avant le détachement ; le cours s'ajuste du dividende ce jour-là.",
    quiz: [
      { q: "Pour recevoir le dividende, il faut détenir l'action :", options: ["Avant la date de détachement", "Après le paiement", "Le jour de l'assemblée seulement"], answer: 0, explain: "La date de détachement détermine les bénéficiaires." },
      { q: "Le jour du détachement, le cours de référence :", options: ["Est ajusté du dividende", "Double", "Reste figé une semaine"], answer: 0, explain: "L'ajustement reflète le dividende versé." },
      { q: "Où l'avis est-il publié ?", options: ["Dans les avis de la BVMAC", "Uniquement par téléphone", "Nulle part"], answer: 0, explain: "Les avis sont publiés sur le site et dans l'application." },
    ],
  },
];

export const GLOSSARY: { term: string; def: string }[] = [
  { term: "Action", def: "Titre de propriété représentant une part du capital d'une société." },
  { term: "Actionnaire", def: "Détenteur d'actions, copropriétaire de la société." },
  { term: "Admission à la cote", def: "Inscription d'un titre sur la liste des valeurs négociées à la BVMAC." },
  { term: "Appel public à l'épargne (APE)", def: "Offre de titres au public, soumise au visa de la COSUMAF." },
  { term: "Assemblée générale", def: "Réunion des actionnaires qui approuve les comptes et vote le dividende." },
  { term: "Avis", def: "Communication officielle et numérotée de la BVMAC." },
  { term: "BOC", def: "Bulletin Officiel de la Cote, publié après chaque séance." },
  { term: "Capitalisation boursière", def: "Nombre d'actions multiplié par le cours." },
  { term: "CEMAC", def: "Communauté Économique et Monétaire de l'Afrique Centrale (six États)." },
  { term: "Compartiment", def: "Segment de la cote regroupant des titres selon des critères d'admission." },
  { term: "Compte titres", def: "Compte où sont inscrites les valeurs mobilières d'un investisseur." },
  { term: "COSUMAF", def: "Commission de Surveillance du Marché Financier de l'Afrique Centrale, le régulateur." },
  { term: "Coupon", def: "Intérêt versé périodiquement au détenteur d'une obligation." },
  { term: "Cours", def: "Prix d'un titre sur le marché." },
  { term: "Cours de clôture", def: "Cours retenu à l'issue de la séance." },
  { term: "Cours de référence", def: "Cours de départ d'une séance, servant au calcul de la variation." },
  { term: "Date de détachement", def: "Date à partir de laquelle l'action se négocie sans le dividende." },
  { term: "Dépositaire central", def: "Institution qui conserve les titres et assure le règlement-livraison." },
  { term: "Diversification", def: "Répartition de l'épargne entre plusieurs placements pour réduire le risque." },
  { term: "Dividende", def: "Part du bénéfice distribuée aux actionnaires." },
  { term: "Droits de garde", def: "Frais de conservation des titres sur un compte." },
  { term: "Échéance", def: "Date de remboursement d'une obligation." },
  { term: "Émetteur", def: "Entreprise, État ou institution qui émet des titres." },
  { term: "Fixing", def: "Confrontation des ordres pour déterminer un cours unique." },
  { term: "Introduction en bourse", def: "Première admission des titres d'une société à la cote." },
  { term: "Investisseur institutionnel", def: "Banque, assurance, caisse de retraite ou fonds qui investit à titre professionnel." },
  { term: "Liquidité", def: "Facilité à acheter ou vendre un titre sans faire varier fortement son prix." },
  { term: "Marché primaire", def: "Marché de l'émission de titres nouveaux." },
  { term: "Marché secondaire", def: "Marché des échanges de titres déjà émis." },
  { term: "Nominal", def: "Valeur faciale d'un titre." },
  { term: "Obligation", def: "Titre de créance représentant un prêt à un émetteur." },
  { term: "OPCVM", def: "Organisme de placement collectif en valeurs mobilières (SICAV, FCP)." },
  { term: "Ordre de bourse", def: "Instruction d'achat ou de vente transmise à une société de bourse." },
  { term: "Plus-value", def: "Gain réalisé lors de la vente d'un titre au-dessus de son prix d'achat." },
  { term: "Portefeuille", def: "Ensemble des titres détenus par un investisseur." },
  { term: "Quantité transigée", def: "Nombre de titres réellement échangés pendant la séance." },
  { term: "Règlement-livraison", def: "Échange des titres contre leur paiement après la transaction." },
  { term: "Séance de cotation", def: "Période pendant laquelle les ordres sont confrontés." },
  { term: "Société de bourse", def: "Intermédiaire agréé par la COSUMAF pour négocier les titres." },
  { term: "Suspension", def: "Arrêt temporaire de la cotation d'un titre décidé par la BVMAC." },
  { term: "Variation", def: "Évolution du cours en pourcentage par rapport au cours de référence." },
];
