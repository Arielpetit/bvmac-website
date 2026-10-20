// Logos and contact details of the licensed brokers, from the official BVMAC page
// (bvm-ac.org, Sociétés de bourse par pays), read on 20 October 2026. Keyed by broker name.
// Obvious typos fixed: Africa Bright email domain, a stray "mailto:" (Afriland), and BEM's
// email link, which pointed to another company.
export type BrokerContact = { logo?: string; email?: string; phone?: string; website?: string };

export const BROKER_CONTACTS: Record<string, BrokerContact> = {
  "Almasi Capital & Advisory S.A": { logo: "/brokers/almasi-capital-advisory-s-a.webp", email: "contact@almasicapital.com", phone: "(+237) 620 28 84 36", website: "www.almasicapital.com" },
  "Building Emerging Markets Securities (BEM)": { logo: "/brokers/building-emerging-markets-securities-bem.webp", email: "contact@bemsecurities.com", phone: "+237 699 52 55 44", website: "www.bemsecurities.com" },
  "Contacturer Capital": { logo: "/brokers/contacturer-capital.webp", email: "info@contacturer.com", phone: "+237 222 20 04 94", website: "www.contacturer.com" },
  "Fedhen Capital S.A": { logo: "/brokers/fedhen-capital-s-a.webp", email: "contact@fedhencapital.com", phone: "+237 233 42 99 68", website: "www.fedhencapital.com" },
  "AFG Capital Central Africa S.A (ACCA)": { logo: "/brokers/afg-capital-central-africa-s-a-acca.webp", email: "brice.ngankeu@afg-capital.net", website: "www.afg-capital.net" },
  "Elite Capital Securities Central Africa S.A (EXCA)": { logo: "/brokers/elite-capital-securities-central-africa-.webp", email: "info@elitecapitalgroup.com", phone: "(+237) 222 207 611", website: "www.elitecapitalgroup.com" },
  "Horus Investment Capital S.A": { logo: "/brokers/horus-investment-capital-s-a.webp", email: "info@horus-ic.com", phone: "+237 233 425 963", website: "www.horus-ic.com" },
  "BEKO Capital Advisory S.A": { logo: "/brokers/beko-capital-advisory-s-a.webp", email: "beko@bekocapital.com", phone: "+237 698 774 824 +237 233 43 58 30", website: "www.bekocapital.com" },
  "Emrald Securities Services Bourse S.A (ESS Bourse)": { logo: "/brokers/emrald-securities-services-bourse-s-a-es.webp", email: "info@ess-capital.com", phone: "+237 676 74 74 74", website: "www.emraldsecuritiesservices.com" },
  "Africa Bright Securities S.A (ABS)": { logo: "/brokers/africa-bright-securities-s-a-abs.webp", email: "contact@africabright.com", phone: "+237 652 85 10 10", website: "www.africabright.com" },
  "EDC Investment Corporation": { logo: "/brokers/edc-investment-corporation.webp", phone: "+237 233 43 13 60" },
  "Upline Securities Central Africa (USCA)": { logo: "/brokers/upline-securities-central-africa-usca.webp" },
  "Financia Capital": { logo: "/brokers/financia-capital.webp", email: "contact@financiacapital.net", website: "www.financiacapital.net" },
  "Attijari Securities Central Africa (ASCA)": { logo: "/brokers/attijari-securities-central-africa-asca.webp", phone: "+237 233 43 14 46", website: "www.attijarisecurities.com" },
  "CBC Bourse": { logo: "/brokers/cbc-bourse.webp", email: "cbc_bourse@groupecommercialbank.com", phone: "+237 2 33 42 02 02", website: "www.commercialbank-cm.com" },
  "SG Capital Securities – Central Africa": { logo: "/brokers/sg-capital-securities-central-africa.webp", email: "sgcapital-cemac@socgen.com", phone: "+237 233 50 19 48 | 233 50 19 44", website: "www.societegenerale.cm" },
  "Afriland Bourse & Investissement S.A": { logo: "/brokers/afriland-bourse-investissement-s-a.webp", email: "bourseinvestissement@afrilandfirstbank.com", phone: "+237 422 05 80 31", website: "www.afrilandfirstbank.com" },
  "Premium Capital Securities S.A": { logo: "/brokers/premium-capital-securities-s-a.webp", email: "christelle.anzene@precapsec.com", phone: "(242) 06 57067 76/ 06 839 20 21 (241) 66 71 71 56/ 74 21 81 09", website: "www.precapsec.com" },
  "L’Archer Capital Securities S.A (ACS)": { logo: "/brokers/l-archer-capital-securities-s-a-acs.webp", email: "contact@larchercapital.com", phone: "(242) 05 554 89 89", website: "www.larchercapital.com" },
  "LCB Capital": { logo: "/brokers/lcb-capital.webp", email: "contact@lcb-bank.com", phone: "(242) 05 310 11 57 / (242) 05 310 11 93", website: "www.lcb-bank.com" },
  "BGFI Bourse": { logo: "/brokers/bgfi-bourse.webp", email: "eqc@bgfi.com", phone: "+241 01 79 13 02", website: "gabon.groupebgfibank.com" },
  "Bange Sociedad de Valores S.A": { logo: "/brokers/bange-sociedad-de-valores-s-a.webp", email: "info@bangesvalores.com", phone: "00240222165859", website: "www.bangesvalores.com" },
  "CBT Bourse": { logo: "/brokers/cbt-bourse.webp", email: "cbt_bourse@groupecommercialbnk.com", phone: "+235 22522829 / +235 22523318" },
};
