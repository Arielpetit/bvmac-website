// Stock Market School content in English. Same structure, slugs and answers as school.ts (French source).
import type { Lesson, Path } from "./school";

export const PATHS_EN: Path[] = [
  { slug: "comprendre-la-bourse", title: "Understanding the stock exchange", text: "What a stock exchange is, what it is for and who does what on the regional market.", badge: "First step" },
  { slug: "investir-via-une-societe-de-bourse", title: "Investing through a broker", text: "Opening an account, placing an order, knowing your fees and your rights.", badge: "Informed investor" },
  { slug: "lire-un-boc", title: "Reading the BOC", text: "Understanding the columns of the Official Price Bulletin.", badge: "BOC reader" },
  { slug: "investir-dans-une-obligation", title: "Investing in a bond", text: "Coupon, maturity, issuer risk: the basics of the bond market.", badge: "Bond expert" },
  { slug: "s-introduire-en-bourse", title: "Going public", text: "Why and how a company or a state raises funds on the stock exchange.", badge: "Informed issuer" },
];

export const LESSONS_EN: Lesson[] = [
  {
    slug: "comprendre-la-bourse", path: "comprendre-la-bourse", title: "What is a stock exchange for?", minutes: 4,
    sections: [
      { h: "A meeting place", p: "A stock exchange connects companies or states that need financing with savers who want to invest their money. It organises these exchanges under common, public rules." },
      { h: "Two markets", p: "On the primary market, an issuer sells new securities to raise funds. On the secondary market, investors then trade these securities among themselves: this is daily trading." },
    ],
    keep: "The stock exchange finances the economy and lets savers buy or sell securities within a regulated framework.",
    quiz: [
      { q: "On which market does an issuer raise new funds?", options: ["The primary market", "The secondary market", "The foreign exchange market"], answer: 0, explain: "The primary market is where securities are issued: the money goes to the issuer." },
      { q: "What happens on the secondary market?", options: ["The issuer receives money", "Investors trade existing securities", "The central bank sets interest rates"], answer: 1, explain: "On the secondary market, money moves from one investor to another." },
      { q: "Who sets the rules of the regional financial market?", options: ["Listed companies", "COSUMAF", "Each investor"], answer: 1, explain: "COSUMAF is the market’s regulatory and supervisory authority." },
      { q: "Which of these are players in the regional market? (several answers)", options: ["COSUMAF", "Brokers", "The IMF", "The BVMAC"], answer: [0, 1, 3], explain: "The regulator, intermediaries and the market operator are part of the market; the IMF is not." },
    ],
  },
  {
    slug: "actions-et-obligations", path: "comprendre-la-bourse", title: "Shares and bonds", minutes: 5,
    sections: [
      { h: "The share", p: "A share is a portion of a company’s capital. The shareholder becomes a co-owner: they can receive a dividend and vote at the general meeting. The share price varies with supply and demand." },
      { h: "The bond", p: "A bond is a loan made to an issuer (company, state, institution). In return, the issuer pays interest called coupons and repays the capital at maturity." },
    ],
    keep: "Share = part of the capital, variable income. Bond = loan, income set in advance but not risk-free.",
    quiz: [
      { q: "What is a bond?", options: ["A portion of the capital", "A loan to an issuer", "A savings account"], answer: 1, explain: "The bondholder lends money and receives coupons." },
      { q: "Is a share’s dividend guaranteed?", options: ["Yes, always", "No, it depends on profits and the general meeting’s vote", "Yes, if it appears in the BOC"], answer: 1, explain: "The dividend is decided each year by the general meeting." },
      { q: "What is the interest paid by a bond called?", options: ["The coupon", "The face value", "The premium"], answer: 0, explain: "The coupon is the bond’s periodic interest." },
      { q: "What rights does a shareholder have? (several answers)", options: ["Receive a dividend if one is approved", "Vote at the general meeting", "Be repaid on a fixed date", "Receive a guaranteed coupon"], answer: [0, 1], explain: "A shareholder is entitled to any approved dividend and to vote; repayment and coupons concern bonds." },
    ],
  },
  {
    slug: "qui-fait-quoi", path: "comprendre-la-bourse", title: "Who does what on the regional market?", minutes: 4,
    sections: [
      { h: "The institutions", p: "COSUMAF regulates and supervises. The BVMAC runs trading and publishes information. The central depository holds the securities and handles settlement." },
      { h: "The intermediaries", p: "Brokers, licensed by COSUMAF, receive and execute investors’ orders. An individual always goes through one of them." },
    ],
    keep: "To invest, you go through a licensed broker; the BVMAC runs the market.",
    quiz: [
      { q: "Where does an individual place an order?", options: ["Directly with the BVMAC", "With a licensed broker", "With COSUMAF"], answer: 1, explain: "Only licensed brokers take orders from the public." },
      { q: "Who holds the securities?", options: ["The central depository", "The listed company", "The investor, on paper"], answer: 0, explain: "The central depository handles safekeeping and settlement." },
      { q: "What is the BVMAC’s role?", options: ["Lending money", "Running trading and publishing information", "Setting taxes"], answer: 1, explain: "The BVMAC is the market operator." },
    ],
  },
  {
    slug: "ouvrir-un-compte", path: "investir-via-une-societe-de-bourse", title: "Opening a securities account", minutes: 4,
    sections: [
      { h: "Two accounts", p: "The broker opens a securities account, where your holdings are recorded, and a cash account, which receives your funds, dividends and coupons." },
      { h: "Documents required", p: "An identity document, proof of address and information about your situation and objectives. This information lets the intermediary check that the products suit you." },
    ],
    keep: "Securities account + cash account, opened by a broker after checking your identity.",
    quiz: [
      { q: "Where are your shares recorded?", options: ["In the securities account", "In the cash account", "In the BOC"], answer: 0, explain: "The securities account lists your holdings." },
      { q: "Why does the intermediary ask about your objectives?", options: ["Out of curiosity", "To check the products are suitable", "To set the price"], answer: 1, explain: "It is an investor protection rule." },
      { q: "Where are dividends paid?", options: ["Into the cash account", "In securities only", "To the BVMAC"], answer: 0, explain: "Cash income goes into the cash account." },
    ],
  },
  {
    slug: "passer-un-ordre", path: "investir-via-une-societe-de-bourse", title: "Placing a stock market order", minutes: 5,
    sections: [
      { h: "What an order contains", p: "An order states the direction (buy or sell), the security, the quantity, any price limit and the validity period." },
      { h: "Execution", p: "The broker sends the order to the market. On the BVMAC, orders are matched at the fixing: a single price is set and compatible orders are executed." },
    ],
    keep: "A precise order (direction, security, quantity, price, validity) is executed at the fixing if it finds a counterparty.",
    quiz: [
      { q: "What is the fixing?", options: ["A fee", "Matching orders to set a price", "A dividend"], answer: 1, explain: "The fixing determines an equilibrium price between supply and demand." },
      { q: "Is an order always executed?", options: ["Yes", "No, it needs a compatible counterparty", "Yes, if the amount is large"], answer: 1, explain: "Without a seller at the requested price, a limit buy order stays pending." },
      { q: "Which information is not part of an order?", options: ["The quantity", "The direction", "The future dividend"], answer: 2, explain: "The future dividend is not known when the order is placed." },
    ],
  },
  {
    slug: "frais-et-droits", path: "investir-via-une-societe-de-bourse", title: "Investor fees and rights", minutes: 4,
    sections: [
      { h: "Fees", p: "Each transaction carries fees (market, depository, regulator, brokerage) and the account may carry custody fees. Compare the rates published by brokers." },
      { h: "Rights", p: "A shareholder is entitled to approved dividends, to vote at the general meeting and to information. In a dispute, they can file a complaint." },
    ],
    keep: "Know your fees before investing; know your rights afterwards.",
    quiz: [
      { q: "What are custody fees?", options: ["Fees for keeping the securities account", "A tax", "A dividend"], answer: 0, explain: "They pay for the safekeeping of securities." },
      { q: "What should you do in a dispute?", options: ["Nothing", "Contact your broker, then file a complaint", "Sell your securities"], answer: 1, explain: "A complaint goes first to the intermediary, then to the BVMAC." },
      { q: "Are fees the same everywhere?", options: ["Yes", "No, brokerage varies from firm to firm", "Yes, they are set by law"], answer: 1, explain: "Each broker sets its commission freely." },
    ],
  },
  {
    slug: "lire-un-boc", path: "lire-un-boc", title: "The columns of the BOC", minutes: 5,
    sections: [
      { h: "Reference and closing prices", p: "The reference price is the starting point of the session. The closing price is the price recorded at the end of the session. The change compares the two, as a percentage." },
      { h: "Quantities", p: "The quantity bid and the quantity offered show buyers’ and sellers’ interest. The quantity traded shows the securities actually exchanged." },
    ],
    keep: "Change = (close − reference) ÷ reference. Traded = actually exchanged.",
    quiz: [
      { q: "A security moves from 10,000 to 10,100 FCFA. What is the change?", options: ["+1%", "+10%", "+0.1%"], answer: 0, explain: "100 ÷ 10,000 = 1%." },
      { q: "What does a traded quantity of zero mean?", options: ["No securities were exchanged", "The security has been delisted", "The price has doubled"], answer: 0, explain: "There can be orders without any trade." },
      { q: "When is the BOC published?", options: ["After each session", "Once a year", "Only for an IPO"], answer: 0, explain: "The BVMAC publishes the BOC after every trading session." },
    ],
  },
  {
    slug: "statuts-et-avis", path: "lire-un-boc", title: "Trading statuses and notices", minutes: 3,
    sections: [
      { h: "A security’s status", p: "A security can be traded, not traded that day (no trade) or suspended by the BVMAC after informing COSUMAF and the issuer." },
      { h: "Notices", p: "BVMAC notices announce events: listings, dividends, meetings, suspensions. They are numbered and dated." },
    ],
    keep: "Read the status together with the price, and follow the BVMAC’s numbered notices.",
    quiz: [
      { q: "Who can suspend a security?", options: ["The BVMAC, after informing COSUMAF and the issuer", "A shareholder", "The broker"], answer: 0, explain: "It is a power of the market operator." },
      { q: "Where can you find a dividend announcement?", options: ["In a BVMAC notice", "On social media only", "Nowhere"], answer: 0, explain: "Official notices are the reference source." },
      { q: "“Not traded today” means:", options: ["No trade during the session", "The security has disappeared", "The price is guaranteed"], answer: 0, explain: "The security remains listed." },
    ],
  },
  {
    slug: "investir-dans-une-obligation", path: "investir-dans-une-obligation", title: "Coupon, maturity, face value", minutes: 5,
    sections: [
      { h: "The vocabulary", p: "The face value is the nominal value of the bond. The interest rate applied to the face value gives the coupon. Maturity is the repayment date." },
      { h: "The price", p: "Before maturity, a bond trades at a price expressed as a percentage of face value. This price varies in particular with interest rates and the quality of the issuer." },
    ],
    keep: "Coupon = face value × rate. A bond’s price is read as a % of face value.",
    quiz: [
      { q: "Face value 10,000 FCFA, rate 6%. What is the annual coupon?", options: ["600 FCFA", "60 FCFA", "6,000 FCFA"], answer: 0, explain: "10,000 × 6% = 600 FCFA." },
      { q: "A price of 101 means:", options: ["101% of face value", "101 FCFA", "101 securities"], answer: 0, explain: "Bond prices are expressed as a percentage of face value." },
      { q: "What is maturity?", options: ["The repayment date", "The dividend date", "The listing date"], answer: 0, explain: "At maturity, the capital is repaid." },
    ],
  },
  {
    slug: "risques-obligataires", path: "investir-dans-une-obligation", title: "The risks of a bond", minutes: 4,
    sections: [
      { h: "Issuer risk", p: "If the issuer runs into difficulty, it may pay late or fail to repay. The information document approved by COSUMAF describes the issuer and the transaction." },
      { h: "Price risk", p: "If you sell before maturity, the price may be lower than what you paid. A thinly traded market can also make reselling slower." },
    ],
    keep: "A bond is not risk-free: read the information document.",
    quiz: [
      { q: "Which document describes a bond issue?", options: ["The information document approved by COSUMAF", "The BOC", "A bank statement"], answer: 0, explain: "It presents the issuer, the terms and the risks." },
      { q: "Selling before maturity can lead to:", options: ["A loss or a gain, depending on the price", "Always a gain", "A fine"], answer: 0, explain: "The market price varies before maturity." },
      { q: "Can a state issue bonds on the BVMAC?", options: ["Yes", "No", "Only Gabon"], answer: 0, explain: "CEMAC states issue bonds on the regional market." },
    ],
  },
  {
    slug: "pourquoi-entrer-en-bourse", path: "s-introduire-en-bourse", title: "Why go public?", minutes: 4,
    sections: [
      { h: "Raising funds", p: "The stock exchange lets a company finance projects by opening its capital or borrowing from a broad public, without depending on a single lender." },
      { h: "Visibility and obligations", p: "Listing brings visibility and a market value, but requires transparency, governance and regular publication of information." },
    ],
    keep: "Going public: more financing and visibility, in exchange for transparency.",
    quiz: [
      { q: "A listed company must:", options: ["Publish its information regularly", "Keep its accounts secret", "Pay a fixed dividend"], answer: 0, explain: "Transparency is the price of access to the market." },
      { q: "Who reviews a listing application?", options: ["The BVMAC Admission and Development Committee", "The existing shareholders alone", "The broker alone"], answer: 0, explain: "The decision is published in a notice." },
      { q: "Can a company raise funds through bonds?", options: ["Yes", "No", "Only banks"], answer: 0, explain: "Companies, states and institutions can issue bonds." },
    ],
  },
  {
    slug: "etapes-introduction", path: "s-introduire-en-bourse", title: "The steps of an IPO", minutes: 5,
    sections: [
      { h: "Prepare", p: "The company brings itself into compliance, has its accounts audited and chooses a broker and advisers." },
      { h: "Obtain approvals", p: "It files an application with the BVMAC and an information document for COSUMAF approval; the public offering then opens before the first listing." },
    ],
    keep: "Preparation, application, approval, decision published in a notice, then first listing.",
    quiz: [
      { q: "Who approves the information document?", options: ["COSUMAF", "The BEAC", "The depository"], answer: 0, explain: "COSUMAF approval is required for a public offering." },
      { q: "Which segment requires a capitalisation of at least FCFA 10 billion?", options: ["A-Premium", "All of them", "None"], answer: 0, explain: "It is one of the A-Premium segment criteria." },
      { q: "How is the admission decision made public?", options: ["Through a BVMAC notice", "By private letter", "It stays confidential"], answer: 0, explain: "Decisions are published in notices." },
    ],
  },
  {
    slug: "diversifier", path: "investir-via-une-societe-de-bourse", title: "Diversify and think long term", minutes: 3,
    sections: [
      { h: "Don’t put everything on one security", p: "Spreading your savings across several securities and types of product reduces the impact of bad news about a single issuer." },
      { h: "Time", p: "Prices vary in the short term. Investing with a horizon that matches your plans avoids having to sell at the wrong moment." },
    ],
    keep: "Diversification and a long horizon reduce risk, without removing it.",
    quiz: [
      { q: "Diversification makes it possible to:", options: ["Reduce the risk linked to a single issuer", "Guarantee a gain", "Avoid fees"], answer: 0, explain: "It spreads risk, without cancelling it." },
      { q: "Does past performance guarantee the future?", options: ["No", "Yes", "Only for bonds"], answer: 0, explain: "Past performance is no guide to future performance." },
      { q: "Why a long horizon?", options: ["So you are not forced to sell during a fall", "To pay less tax everywhere", "To avoid the BOC"], answer: 0, explain: "A suitable horizon avoids forced sales." },
    ],
  },
  {
    slug: "lire-un-avis-de-dividende", path: "lire-un-boc", title: "Reading a dividend notice", minutes: 3,
    sections: [
      { h: "Key dates", p: "A dividend notice gives the amount per share, the ex-dividend date and the payment date. To receive the dividend, you must hold the share before the ex-dividend date." },
      { h: "Effect on the price", p: "On the ex-dividend date, the reference price is adjusted by the amount of the dividend: this is not a loss of value for the shareholder." },
    ],
    keep: "Hold the share before the ex-dividend date; that day the price adjusts by the dividend.",
    quiz: [
      { q: "To receive the dividend, you must hold the share:", options: ["Before the ex-dividend date", "After payment", "Only on the day of the meeting"], answer: 0, explain: "The ex-dividend date determines who receives it." },
      { q: "On the ex-dividend date, the reference price:", options: ["Is adjusted by the dividend", "Doubles", "Stays frozen for a week"], answer: 0, explain: "The adjustment reflects the dividend paid." },
      { q: "Where is the notice published?", options: ["In BVMAC notices", "Only by phone", "Nowhere"], answer: 0, explain: "Notices are published on the website and in the app." },
    ],
  },
];

export const GLOSSARY_DEFS_EN: Record<string, string> = {
  Action: "A title of ownership representing a share of a company’s capital.",
  Actionnaire: "A holder of shares, co-owner of the company.",
  "Admission à la cote": "Registration of a security on the list of securities traded on the BVMAC.",
  "Appel public à l'épargne (APE)": "An offer of securities to the public, subject to COSUMAF approval.",
  "Assemblée générale": "The meeting of shareholders that approves the accounts and votes on the dividend.",
  Avis: "An official, numbered communication from the BVMAC.",
  BOC: "Official Price Bulletin, published after each session.",
  "Capitalisation boursière": "Number of shares multiplied by the share price.",
  CEMAC: "Economic and Monetary Community of Central Africa (six states).",
  Compartiment: "A segment of the list grouping securities by admission criteria.",
  "Compte titres": "The account in which an investor’s securities are recorded.",
  COSUMAF: "Central African Financial Market Supervisory Commission, the regulator.",
  Coupon: "Interest paid periodically to a bondholder.",
  Cours: "The price of a security on the market.",
  "Cours de clôture": "The price recorded at the end of the session.",
  "Cours de référence": "The starting price of a session, used to calculate the change.",
  "Date de détachement": "The date from which the share trades without the dividend.",
  "Dépositaire central": "The institution that holds securities and handles settlement.",
  Diversification: "Spreading savings across several investments to reduce risk.",
  Dividende: "The share of profit distributed to shareholders.",
  "Droits de garde": "Fees for holding securities in an account.",
  "Échéance": "The repayment date of a bond.",
  "Émetteur": "A company, state or institution that issues securities.",
  Fixing: "Matching orders to determine a single price.",
  "Introduction en bourse": "The first admission of a company’s securities to listing.",
  "Investisseur institutionnel": "A bank, insurer, pension fund or fund that invests professionally.",
  "Liquidité": "How easily a security can be bought or sold without moving its price much.",
  "Marché primaire": "The market where new securities are issued.",
  "Marché secondaire": "The market where securities already issued are traded.",
  Nominal: "The face value of a security.",
  Obligation: "A debt security representing a loan to an issuer.",
  OPCVM: "Collective investment scheme in transferable securities (SICAV, FCP).",
  "Ordre de bourse": "An instruction to buy or sell given to a broker.",
  "Plus-value": "The gain made when a security is sold above its purchase price.",
  Portefeuille: "All the securities held by an investor.",
  "Quantité transigée": "The number of securities actually traded during the session.",
  "Règlement-livraison": "The exchange of securities against payment after the transaction.",
  "Séance de cotation": "The period during which orders are matched.",
  "Société de bourse": "An intermediary licensed by COSUMAF to trade securities.",
  Suspension: "A temporary halt in a security’s trading, decided by the BVMAC.",
  Variation: "The change in price, as a percentage of the reference price.",
};
