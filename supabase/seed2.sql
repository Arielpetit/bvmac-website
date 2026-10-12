-- Seed part 2. Run ONCE on an empty database: some tables are cleared before insert.
insert into public.equities (slug,ticker,name,short_name,isin,country,sector,compartment,nominal,listed_on,dividend_amount,dividend_date,reference_price,close_price,qty_demanded,qty_offered,qty_traded,status,bio,founded,headquarters,position) values
('bgfi-holding','BGFI','BGFI Holding Corporation','BGFI HC','GA0000010074','GA','Banque','A-Premium',null,'2026-05-07',2500,'2026-05-18',89000,89000,0,42,0,'NC','Née à Libreville en 1971, BGFI Holding Corporation est la société tête du Groupe BGFIBank, premier groupe financier d’Afrique centrale. D’une banque gabonaise, elle est devenue en cinq décennies un groupe international présent dans 12 pays, autour de quatre métiers : banque commerciale, banque de financement des entreprises, banque privée et gestion d’actifs, services financiers spécialisés et assurance. Ses actions sont cotées sur le compartiment A-Premium depuis le 7 mai 2026.','1971','Libreville, Gabon',0),
('bange','BANGE','Banque Nationale de Guinée Équatoriale','BANGE','GQ0000010050','GQ','Banque',null,206220,null,4830,'2026-07-31',228085,228085,0,40,0,'NC','La Banque Nationale de Guinée Équatoriale (BANGE) débute ses activités en 2006 avec un capital de 2 milliards FCFA, aux côtés de l’État équato-guinéen, de partenaires techniques et de petits investisseurs privés. Elle a depuis renforcé ses fonds propres à plusieurs reprises et s’est imposée comme une banque de référence du pays.','2006','Malabo, Guinée équatoriale',1),
('semc','SEMC','Société des Eaux Minérales du Cameroun','SEMC','CM0000010009','CM','Boissons',null,10000,'2006',800,'2026-06-25',53000,53000,25,0,0,'NC','Créée le 16 janvier 1979, filiale des Brasseries du Cameroun, la SEMC produit et distribue depuis 1983 l’eau minérale « Tangui ». Elle fait son entrée en bourse en 2006 dans le cadre d’une offre publique de vente partielle des actions détenues par la Société Nationale d’Investissement du Cameroun.','1979','Douala, Cameroun',2),
('socapalm','SOCAPALM','Société Camerounaise de Palmeraies','SOCAPALM','CM0000010025','CM','Agro-industrie',null,10000,'2009-04',2325,'2026-07-20',49500,49500,150,1986,144,'PEq','Société agro-industrielle créée en 1968, la SOCAPALM est le premier producteur d’huile de palme brute du Cameroun, avec environ 42 % du marché. Elle exploite des plantations dans le Littoral, la Sanaga-Maritime, le Nyong-et-Kéllé, le Moungo et l’Océan, et a intégré la cote en avril 2009 par une augmentation de capital par appel public à l’épargne.','1968','Douala, Cameroun',3),
('safacam','SAFACAM','Société Africaine Forestière et Agricole du Cameroun','SAFACAM','CM0000010017','CM','Agro-industrie',null,5000,'2008',2200,'2026-07-20',38500,38500,423,6,6,'PEq','L’origine de SAFACAM remonte à 1897 sur la rive droite de la Sanaga, à Dizangué. La société voit le jour sous ce nom en 1962 et produit du caoutchouc naturel et de l’huile de palme. Elle entre en bourse en 2008 par une offre publique de vente de la Société Nationale d’Investissement.','1962','Dizangué, Cameroun',4),
('la-regionale','REGIONALE','La Régionale d’Épargne et de Crédit','La Régionale','CM0000010041','CM','Microfinance',null,10000,null,894,'2024-09-18',38000,38000,0,170,0,'NC','Établissement de microfinance de deuxième catégorie créé en 1993, La Régionale est un acteur majeur de la microfinance au Cameroun : collecte de l’épargne, crédit à la consommation, à l’habitat et au monde rural, financement des PME, transferts et micro-assurance, avec un réseau de plus de 40 agences.','1993','Yaoundé, Cameroun',5),
('scg-re','SCG-RE','Société Commerciale Gabonaise de Réassurance','SCG-Ré','GA0000010066','GA','Réassurance',null,10000,null,433,'2025-10-22',20000,20000,19,104,4,'PEq','Créée en 2012 à l’initiative de l’État gabonais et des compagnies d’assurance du pays, SCG-Ré illustre le partenariat public-privé. Elle gère pour le compte de l’État la cession légale sur les primes des assureurs agréés au Gabon et souscrit de la réassurance commerciale au Gabon et en Afrique.','2012','Libreville, Gabon',6)
on conflict (slug) do nothing;
insert into public.bonds (isin,name,issuer,country,nominal,reference,close,accrued,qty_demanded,qty_offered,qty_traded,change,status,start_date,maturity) values
('CM0000020628','AFC06','AFCMR','CM',10000,100,100,114.22,0,0,0,0,'NC',null,null),
('GA0000020529','EOG.13 24/28','État du Gabon','GA',10000,100,100,192.33,0,0,0,0,'NC',null,null),
('GA0000020537','EOG. 14 24/30','État du Gabon','GA',10000,100,100,199.45,0,0,0,0,'NC',null,null),
('CM0000020545','ACEP01 24/27','ACEP Cameroun','CM',10000,100,100,120.82,0,0,0,0,'NC',null,null),
('GA0000020552','EOG.15 24/27','État du Gabon','GA',10000,97,97,518.96,0,0,0,0,'NC',null,null),
('GA0000020560','EOG.16 24/28','État du Gabon','GA',10000,97,97,530.75,0,0,0,0,'NC',null,null),
('GA0000020578','EOG.17 24/30','État du Gabon','GA',10000,100,100,550.41,0,0,0,0,'NC',null,null),
('CG0000020584','SNPC 1','SNPC','CG',10000,100,100,407.45,0,0,0,0,'NC',null,null),
('CM0000020610','AFC05','AFCMR','CM',10000,100,100,88.11,0,0,0,0,'NC',null,null),
('GA0000020503','EOG.11 24/31','État du Gabon','GA',10000,100,100,406.85,0,0,0,0,'NC',null,null),
('GA0000020594','EOG. 18 25/27','État du Gabon','GA',10000,100,100,293.04,0,0,0,0,'NC',null,null),
('GA0000020602','EOG. 19 25/28','État du Gabon','GA',10000,100,100,313.97,0,0,0,0,'NC',null,null),
('GA0000020636','EGA20','État du Gabon','GA',10000,100,100,18.41,0,0,0,0,'NC',null,null),
('GA0000020644','EGA21','État du Gabon','GA',10000,100,100,19.73,0,0,0,0,'NC',null,null),
('CG00000202020','EOBDE01 20/27','BDEAC','CG',10000,100,100,170.82,0,0,0,0,'NC',null,null),
('GA0000020511','EOG.12 24/27','État du Gabon','GA',10000,98,98,94.03,0,0,0,0,'NC',null,null),
('CG0000020261','BDEAC 02 21/28','BDEAC','CG',10000,98.5,98.5,284.45,0,0,0,0,'NC',null,null),
('GA0000020495','EOG. 10 24/29','État du Gabon','GA',10000,100,100,352.6,0,0,0,0,'NC',null,null),
('GA0000020487','EOG.09 24/27','État du Gabon','GA',10000,100,100,325.48,0,0,0,0,'NC',null,null),
('GA0000020396','EOG.08 23/28','État du Gabon','GA',10000,96,96,77.05,0,0,0,0,'NC',null,null),
('CG0000020444','BDEAC 06 24/27','BDEAC','CG',10000,100,100,263.97,0,0,0,0,'NC',null,null),
('CG0000020436','BDEAC 05 24/29','BDEAC','CG',10000,94.96,94.96,334.18,0,0,0,0,'NC',null,null),
('CG0000020469','BDEAC 04 24/31','BDEAC','CG',10000,100,100,348.22,0,0,0,0,'NC',null,null),
('CM000002041-2','ALIOS.03 23/28','Alios Finance Cameroun','CM',10000,100,100,51.64,0,0,0,0,'NC',null,null),
('CM000002038-8','ECMR.10 23/31','État du Cameroun','CM',10000,99,99,222.47,0,0,0,0,'NC',null,null),
('CM000002037-0','ECMR.09 23/29','État du Cameroun','CM',10000,100,100,207.12,0,0,0,0,'NC',null,null),
('CM000002036-2','ECMR.08 23/27','État du Cameroun','CM',10000,100,100,92.05,0,0,0,0,'NC',null,null),
('TD0000020331','EOTD01 22/27','État du Tchad','TD',10000,100,100,255.55,0,0,0,0,'NC',null,null),
('CG0000020329','BDEAC 03 22/29','BDEAC','CG',10000,100,100,377.42,0,0,0,0,'NC',null,null),
('GAB000002031-3','EOG 07 22/28','État du Gabon','GA',10000,100,100,355.48,0,0,0,0,'NC',null,null),
('CM0000020305','ECMR.06 22/29','État du Cameroun','CM',10000,100,100,142.81,995,0,0,0,'NC',null,null)
on conflict (isin) do nothing;
delete from public.agenda where true;
insert into public.agenda (event_date,end_date,type,issuer,detail,notice_slug) values
('2026-10-22',null,'ag','SCG-Ré','Assemblée générale ordinaire (convocation par l’avis N°057/2026)','057-2026'),
('2026-11-02',null,'introduction','RENAPROV Finance S.A.','Introduction en bourse autorisée par la décision CAD/05-08-2026/04 (date de cotation à confirmer)','059-2026'),
('2026-08-05',null,'remboursement','AFCMR','Amortissement du principal et paiement des intérêts « AFCMR à tranches multiples 2023-2028 »','055-2026'),
('2026-07-31',null,'dividende','BANGE','Paiement du dividende de l’exercice 2025 : 4 830 FCFA par action','053-2026'),
('2026-07-20',null,'dividende','SOCAPALM','Paiement du dividende de l’exercice 2025 : 2 325 FCFA par action','049-2026'),
('2026-07-20',null,'dividende','SAFACAM','Paiement du dividende de l’exercice 2025 : 2 200 FCFA par action','048-2026'),
('2026-07-06',null,'coupon','État du Gabon','Amortissement et intérêts « EOG multi-tranches 2024-2030 »','047-2026'),
('2026-06-25',null,'dividende','SEMC','Paiement du dividende de l’exercice 2025 : 800 FCFA par action','043-2026'),
('2026-06-24',null,'coupon','ACEP Cameroun','Amortissement et intérêts « ACEP 7 % brut 2024-2027 »','041-2026'),
('2026-06-05',null,'remboursement','État du Cameroun','Amortissement et intérêts « ECMR 2023 à tranches multiples »','039-2026'),
('2026-05-07',null,'introduction','BGFI Holding Corporation','Première cotation sur le compartiment A-Premium',null),
('2026-02-25','2026-05-25','souscription','État du Gabon','Souscription à l’emprunt « EOG 2026 à tranches multiples » (85 milliards FCFA)',null),
('2025-12-15','2026-03-15','souscription','RENAPROV','Souscription à l’introduction en bourse : 400 000 actions à 21 000 FCFA',null)
;
insert into public.brokers (name,country,city,approval,approved_on,address) values
('BGFI Bourse','GA','Libreville','MFAC-SB-002/2006','2006-12-20','1295, Boulevard de l’indépendance – BP 2253 Libreville'),
('EDC Investment Corporation','CM','Douala','MFAC-SB-003/2007','2007-12-13','Immeuble ACTIVA, 2ème étage, rue Prince de Galles, AKWA – BP : 15385 Douala'),
('Financia Capital','CM','Douala','MFAC-SB-004/2011','2011-11-17','125, Rue de La Perousse, Bonanjo – BP : 4593 Douala'),
('LCB Capital','CG','Brazzaville','MFAC-SB-01/2015','2015-05-26','3, Avenue Amilcar Cabral, BP : 2889 Brazzaville'),
('Attijari Securities Central Africa (ASCA)','CM','Douala','MFAC-SB-01/2016','2016-03-01','Rue Njo Njo, Carrefour Soppo Priso, immeuble du Phare, 3e étage, Bonapriso – BP : 255 Douala'),
('CBT Bourse','TD','N''Djamena','MFAC-SB-02/2016','2016-06-14','Avenue Maldom Bada Abbas – BP : 19 N’Djamena'),
('SG Capital Securities – Central Africa','CM','Douala','091/10/CMF/18','2018-10-30','Immeuble NSIA Bonanjo, B.P.:2759 Douala'),
('Afriland Bourse & Investissement S.A','CM','Yaoundé','MFAC-SDB-01/2019','2019-12-30','Avenue Charles de Gaulle, Yaoundé, en face du Lycée Fustel, BP : 11 834'),
('Upline Securities Central Africa (USCA)','CM','Douala','MFAC-SDB-02/2019','2019-12-30','234, Avenue de l’indépendance, Carrefour Hôtel de l’Air, Bonapriso – BP : 1925 Douala'),
('Africa Bright Securities S.A (ABS)','CM','Douala','MFAC-SDB-02/2020','2020-07-15','316, Rue Victoria – Bonanjo, BP : 15451 Douala'),
('CBC Bourse','CM','Douala','MFAC-SB-01/2020','2020-03-04','Bonanjo – Douala / BP : 4004'),
('AFG Capital Central Africa S.A (ACCA)','CM','Douala','COSUMAF-SDB-03/2020','2020-09-25','Immeuble Noutchogouin, Akwa, B.P. : 2933 Douala'),
('Emrald Securities Services Bourse S.A (ESS Bourse)','CM','Douala','COSUMAF-SDB-04/2020','2020-12-08','Immeuble Victoria, 3ème étage, BP : 5540 Bonanjo, Douala'),
('L’Archer Capital Securities S.A (ACS)','CG','Brazzaville','COSUMAF-SDB-01/2021','2020-03-11','70 rue de la Musique Tambourinée, Immeuble Coray-Résidence, 2ème étage, Brazzaville'),
('Horus Investment Capital S.A','CM','Douala','COSUMAF-SDB-02/2021','2021-06-17','Immeuble SOTICAM, face Croissanterie Total Bonapriso, 1er étage, BP 13207, Douala'),
('BEKO Capital Advisory S.A','CM','Douala','COSUMAF-SDB-03/2021','2021-07-28','Avenue Douala Manga Bell, Immeuble Diamaré, Niveau 2, Akwa, Douala'),
('Bange Sociedad de Valores S.A','GQ','Malabo','COSUMAF-SDB-04/2021','2021-07-28','Avenida de las Naciones Unidas, N° 28, APDO 430, Malabo'),
('Elite Capital Securities Central Africa S.A (EXCA)','CM','Yaoundé','COSUMAF-SDB-05/2021','2021-12-16','2ème étage Immeuble ICON Residences & Offices, Bastos, BP : 35 303 Yaoundé'),
('Premium Capital Securities S.A','CG','Brazzaville','COSUMAF-SDB-06/2021','2021-12-16','800, Rue Moukoukoulou, Plateau des 15 ans, Moungali, Brazzaville'),
('CCA Bourse S.A','CM','Douala','COSUMAF-SDB-01/2022','2022-09-29','Immeuble CCA Bank, Akwa, Douala'),
('Digicapital Bourse S.A','CM','Yaoundé','COSUMAF-SDB-02/2022','2022-12-20','Yaoundé, Carrefour Bastos ; succursale : Douala-Bonanjo, rue Joss'),
('Fedhen Capital S.A','CM','Douala','COSUMAF-SDB-01/2023','2023-03-31','Immeuble Indigo Bonapriso, 5e étage, Douala'),
('Contacturer Capital','CM','Yaoundé','COSUMAF-SDB-02/2023','2023-10-02','4ème étage Immeuble FENA, Nouvelle route Bastos, BP 13625 Yaoundé'),
('Building Emerging Markets Securities (BEM)','CM','Douala','COSUMAF-SDB-03/2023','2023-10-02','973, Rue Christian Tobie Kuoh, Bonanjo, BP : 5758 Douala'),
('Almasi Capital & Advisory S.A','CM','Douala','COSUMAF-SDB-01/2024','2024-10-15','Immeuble The Hydrocarbures, 1er étage, Bonapriso, B.P : 4185 Douala')
on conflict (name) do nothing;
delete from public.documents where true;
insert into public.documents (title,ref,body,category,year,url,language) values
('Règlement portant organisation et fonctionnement du marché financier de l’Afrique centrale','Règlement N°01/22/CEMAC/UMAC/CM/COSUMAF','CEMAC','regulation','2022','https://www.bvm-ac.org/wp-content/uploads/2022/09/Reglment-n%C2%B001-Portant-Organisation-et-Fonctionnement-du-Marche-Financier-de-lAfrique-Centrale.pdf','FR'),
('Règlement portant organisation et fonctionnement du marché financier de l’Afrique centrale (23 mai 2023)','Règlement COSUMAF','COSUMAF','regulation','2023','https://www.bvm-ac.org/wp-content/uploads/2023/10/Reglement-COSUMAF-du-23-mai-2023.pdf','FR'),
('Règlement général de la Bourse des Valeurs Mobilières de l’Afrique Centrale',null,'BVMAC','regulation','2025','https://www.bvm-ac.org/wp-content/uploads/2025/04/LE-REGLEMENT-GENERAL-DE-LA-BVMAC.pdf','FR'),
('Réglementation des changes dans la CEMAC','Règlement N°02/18/CEMAC/UMAC/CM','UMAC','regulation','2018','https://www.bvm-ac.org/wp-content/uploads/2019/11/BVMAC-reglement-n02-18-cemac-umac-cm-portant-reglementation-des-changes-dans-la-cemac.pdf','FR'),
('Régime d’inscription en compte des valeurs mobilières et autres instruments financiers dans la CEMAC','Règlement N°01/14/CEMAC-UMAC-CM','UMAC','regulation','2014','https://www.bvm-ac.org/wp-content/uploads/2019/11/BVMAC-reglement-n01-14-cemac-umac-cm-portant-institution-dun-regime-dinscription-en-compte-des-valeurs-mobiles-et-autres-instruments-financiers-dans-la-cemac.pdf','FR'),
('Régime fiscal spécifique applicable aux opérations cotées à la BVMAC','Règlement N°14/07-UEAC-175-CM-15','UEAC','regulation','2007','https://www.bvm-ac.org/wp-content/uploads/2019/11/Reglement-UEAC-Regime-fiscal-BVMAC.pdf','FR'),
('Règlement portant organisation, fonctionnement et surveillance du marché financier de l’Afrique centrale (14 mars 2002)',null,'CEMAC','regulation','2002','https://www.bvm-ac.org/wp-content/uploads/2019/11/BVMAC-reglement-portant-organisation-fonctionnement-et-surveillance-du-marche-financier-de-lafrique-centrale.pdf','FR'),
('Instruction BVMAC N°1 : conditions d’admission à la BVMAC',null,'BVMAC','regulation','2019','https://www.bvm-ac.org/wp-content/uploads/2019/11/BVMAC-instruction-n1-relative-aux-conditions-dadmission-a-la-bvmac.pdf','FR'),
('Instruction BVMAC N°2 : règles de marché',null,'BVMAC','regulation','2019','https://www.bvm-ac.org/wp-content/uploads/2019/11/BVMAC-instruction-n2-relative-aux-regles-de-marche-de-bvmac.pdf','FR'),
('Instruction BVMAC N°3 : grille tarifaire de l’entreprise de marché',null,'BVMAC','tariff','2019','https://www.bvm-ac.org/wp-content/uploads/2019/11/BVMAC-instruction-n3-relative-a-la-grille-tarifaire-de-lentreprise-de-marche.pdf','FR'),
('Communiqué COSUMAF 01/08 relatif à la tarification du marché financier de l’Afrique centrale',null,'COSUMAF','tariff','2008','https://www.bvm-ac.org/wp-content/uploads/2019/11/BVMAC-communique-cosumaf-o1-08-relatif-a-la-tarification-du-marche-financier-de-lafrique-centrale.pdf','FR'),
('Rapport intérimaire de surveillance multilatérale 2017 et perspectives pour 2018',null,'CEMAC','economic','2018','https://www.bvm-ac.org/donnees-economiques/','FR'),
('Rapport intérimaire de surveillance multilatérale 2015 et perspectives pour 2016',null,'CEMAC','economic','2016','https://www.bvm-ac.org/donnees-economiques/','FR'),
('Synthèse trimestrielle du Bulletin Officiel de la Cote (avis N°051/2026)',null,'BVMAC','report','2026','https://www.bvm-ac.org/echos-du-marche/avis-n051-2026-bvmac-dg-relatif-a-la-diffusion-dune-synthese-trimestrielle-du-boc/','FR'),
('Rapports boursiers de la BVMAC',null,'BVMAC','report','2026','https://www.bvm-ac.org/documentations-rapports-boursiers/','FR')
;
insert into public.videos (slug,title,caption,playlist,poster,position) values
('v1','Cérémonie de première cotation de BGFI Holding Corporation','7 mai 2026 · Compartiment A-Premium','Cérémonies','/photos/ceremony-speech.webp',0),
('v2','Première cotation à la bourse d’Afrique centrale','Cérémonie de 2020','Cérémonies','/photos/ceremony-trading-floor.webp',1),
('v3','La BVMAC demande aux entreprises de la CEMAC d’entrer en bourse','Reportage','Reportages','/photos/ceremony-talk.webp',2),
('v4','Un marché financier commun et unique en Afrique centrale','Reportage','Reportages','/photos/bvmac-building.webp',3),
('v5','Ouverture de la bourse aux épargnants','Reportage','Pédagogie','/photos/ceremony-audience.webp',4),
('v6','Visite des étudiants à la BVMAC','Éducation financière','Pédagogie','/photos/school-students.webp',5)
on conflict (slug) do nothing;
delete from public.photos where true;
insert into public.photos (album_slug,album_title,album_date,src,alt,position) values
('premiere-cotation','Cérémonie de la première cotation','Février 2020','/photos/ceremony-speech.webp','Allocution au pupitre lors de la cérémonie de première cotation',0),
('premiere-cotation','Cérémonie de la première cotation','Février 2020','/photos/ceremony-podium.webp','Discours officiel devant le logo de la BVMAC',1),
('premiere-cotation','Cérémonie de la première cotation','Février 2020','/photos/ceremony-audience.webp','Invités assis sous la tente de la cérémonie',2),
('premiere-cotation','Cérémonie de la première cotation','Février 2020','/photos/ceremony-guests.webp','Personnalités au premier rang',3),
('premiere-cotation','Cérémonie de la première cotation','Février 2020','/photos/ceremony-handshake.webp','Poignée de main entre officiels devant l’Immeuble de la Bourse',4),
('premiere-cotation','Cérémonie de la première cotation','Février 2020','/photos/ceremony-arrival.webp','Arrivée des invités sur le tapis rouge',5),
('premiere-cotation','Cérémonie de la première cotation','Février 2020','/photos/ceremony-trading-floor.webp','Officiels dans la salle de cotation',6),
('premiere-cotation','Cérémonie de la première cotation','Février 2020','/photos/ceremony-trading-floor-2.webp','Échanges dans la salle de cotation',7),
('premiere-cotation','Cérémonie de la première cotation','Février 2020','/photos/ceremony-talk.webp','Entretien entre deux personnalités',8),
('installation-dg','Passation de service et installation du Directeur Général','29 décembre 2021','/photos/governance-handover.webp','Passation de service entre le Directeur Général sortant et le nouveau Directeur Général',0),
('installation-dg','Passation de service et installation du Directeur Général','29 décembre 2021','/photos/governance-officials.webp','Officiels devant les drapeaux des pays de la CEMAC',1),
('installation-dg','Passation de service et installation du Directeur Général','29 décembre 2021','/photos/governance-group.webp','Photo de groupe devant l’Immeuble de la Bourse',2),
('essec','Visite d’entreprise des étudiants de l’ESSEC Douala','26 novembre 2021','/photos/school-students.webp','Étudiants de l’ESSEC Douala dans la salle de conférence de la BVMAC',0),
('essec','Visite d’entreprise des étudiants de l’ESSEC Douala','26 novembre 2021','/photos/school-students-2.webp','Étudiantes attentives pendant la présentation',1),
('essec','Visite d’entreprise des étudiants de l’ESSEC Douala','26 novembre 2021','/photos/school-students-3.webp','Étudiants pendant la visite',2),
('iut-jif','Visite de l’IUT de Douala et Journée internationale des femmes','Juin et mars 2021','/photos/school-iut.webp','Étudiants de l’IUT de Douala en visite à la BVMAC',0),
('iut-jif','Visite de l’IUT de Douala et Journée internationale des femmes','Juin et mars 2021','/photos/event-jif.webp','Collaboratrices de la BVMAC lors de la Journée internationale des femmes',1),
('iut-jif','Visite de l’IUT de Douala et Journée internationale des femmes','Juin et mars 2021','/photos/bvmac-building.webp','Immeuble de la Bourse à Douala',2)
;
delete from public.board_members where true;
insert into public.board_members (name,role,entity,body,position) values
('Administrateur 1','Président du Conseil d''Administration','Entité publique','board',0),
('Administrateur 2','Administrateur','Banque','board',1),
('Administrateur 3','Administrateur','Société de bourse','board',2),
('Administrateur 4','Administrateur','Assurance','board',3),
('Administrateur 5','Administrateur','Autre actionnaire','board',4),
('Administrateur 6','Administrateur','Entité publique','board',5),
('Administrateur 7','Administrateur','Banque','board',6),
('Administrateur 8','Administrateur','Société de bourse','board',7),
('Administrateur 9','Administrateur','Assurance','board',8),
('Administrateur 10','Administrateur','Autre actionnaire','board',9)
;
delete from public.timeline where true;
insert into public.timeline (date_label,title,body,position) values
('Nov. 1994','Décision de créer une bourse régionale','À la demande des pays de la sous-région, le Conseil d''Administration de la BEAC charge la BEAC de créer la BVMAC.',0),
('Juin 1999','Étude de faisabilité','L''étude conclut à la viabilité d''une bourse régionale pour l''Afrique centrale.',1),
('Déc. 2000','Choix du siège','La conférence de N''Djamena désigne Libreville pour abriter le siège de la BVMAC.',2),
('Juin 2003','Création de la BVMAC','La BVMAC est créée le 27 juin 2003 à Libreville pour financer les économies des pays de la CEMAC.',3),
('Nov. 2003','Cadre réglementaire','Adoption du règlement CEMAC-UMAC portant organisation, fonctionnement et surveillance du marché financier de l''Afrique centrale.',4),
('2006 – 2007','Assistance opérationnelle','Contrats d''assistance avec Maroclear (règlement-livraison) et la Bourse de Casablanca (cotation).',5),
('Juil. 2022','Nouvelle organisation du marché','Le Règlement N°01/22/CEMAC/UMAC/CM/COSUMAF du 22 juillet 2022 organise le marché financier de l''Afrique centrale ; la BVMAC, dont le siège est à Douala, en est l''entreprise de marché.',6),
('7 mai 2026','Première cotation de BGFI Holding Corporation','Cérémonie de première cotation de la holding du Groupe BGFIBank sur le compartiment A-Premium.',7)
;
insert into public.partners (name,description,href,logo,position) values
('CEMAC','Communauté Économique et Monétaire de l''Afrique Centrale','https://www.cemac.int/','/institutions/cemac.png',0),
('COSUMAF','Commission de Surveillance du Marché Financier de l''Afrique Centrale','https://cosumaf.org/','/institutions/cosumaf.png',1),
('BEAC','Banque des États de l''Afrique Centrale','https://www.beac.int/','/institutions/beac.png',2),
('COBAC','Commission Bancaire de l''Afrique Centrale','https://www.beac.int/supervision-bancaire/reglements-de-cobac/','/institutions/cobac.png',3)
on conflict (name) do nothing;
insert into public.glossary (term,definition,term_en,term_es) values
('Action','Titre de propriété représentant une part du capital d''une société.','Share','Acción'),
('Actionnaire','Détenteur d''actions, copropriétaire de la société.','Shareholder','Accionista'),
('Admission à la cote','Inscription d''un titre sur la liste des valeurs négociées à la BVMAC.','Listing','Admisión a cotización'),
('Appel public à l''épargne (APE)','Offre de titres au public, soumise au visa de la COSUMAF.','Public offering','Oferta pública'),
('Assemblée générale','Réunion des actionnaires qui approuve les comptes et vote le dividende.','General meeting','Junta general'),
('Avis','Communication officielle et numérotée de la BVMAC.','Market notice','Aviso'),
('BOC','Bulletin Officiel de la Cote, publié après chaque séance.','Official price list','Boletín oficial de cotización'),
('Capitalisation boursière','Nombre d''actions multiplié par le cours.','Market capitalisation','Capitalización bursátil'),
('CEMAC','Communauté Économique et Monétaire de l''Afrique Centrale (six États).','CEMAC','CEMAC'),
('Compartiment','Segment de la cote regroupant des titres selon des critères d''admission.','Market segment','Segmento'),
('Compte titres','Compte où sont inscrites les valeurs mobilières d''un investisseur.','Securities account','Cuenta de valores'),
('COSUMAF','Commission de Surveillance du Marché Financier de l''Afrique Centrale, le régulateur.','COSUMAF (regulator)','COSUMAF (regulador)'),
('Coupon','Intérêt versé périodiquement au détenteur d''une obligation.','Coupon','Cupón'),
('Cours','Prix d''un titre sur le marché.','Price','Cotización'),
('Cours de clôture','Cours retenu à l''issue de la séance.','Closing price','Precio de cierre'),
('Cours de référence','Cours de départ d''une séance, servant au calcul de la variation.','Reference price','Precio de referencia'),
('Date de détachement','Date à partir de laquelle l''action se négocie sans le dividende.','Ex-dividend date','Fecha ex-dividendo'),
('Dépositaire central','Institution qui conserve les titres et assure le règlement-livraison.','Central securities depository','Depositario central'),
('Diversification','Répartition de l''épargne entre plusieurs placements pour réduire le risque.','Diversification','Diversificación'),
('Dividende','Part du bénéfice distribuée aux actionnaires.','Dividend','Dividendo'),
('Droits de garde','Frais de conservation des titres sur un compte.','Custody fees','Comisiones de custodia'),
('Échéance','Date de remboursement d''une obligation.','Maturity','Vencimiento'),
('Émetteur','Entreprise, État ou institution qui émet des titres.','Issuer','Emisor'),
('Fixing','Confrontation des ordres pour déterminer un cours unique.','Call auction','Subasta (fixing)'),
('Introduction en bourse','Première admission des titres d''une société à la cote.','Initial public offering (IPO)','Salida a bolsa (OPV)'),
('Investisseur institutionnel','Banque, assurance, caisse de retraite ou fonds qui investit à titre professionnel.','Institutional investor','Inversor institucional'),
('Liquidité','Facilité à acheter ou vendre un titre sans faire varier fortement son prix.','Liquidity','Liquidez'),
('Marché primaire','Marché de l''émission de titres nouveaux.','Primary market','Mercado primario'),
('Marché secondaire','Marché des échanges de titres déjà émis.','Secondary market','Mercado secundario'),
('Nominal','Valeur faciale d''un titre.','Face value','Valor nominal'),
('Obligation','Titre de créance représentant un prêt à un émetteur.','Bond','Obligación'),
('OPCVM','Organisme de placement collectif en valeurs mobilières (SICAV, FCP).','Mutual fund (UCITS)','Fondo de inversión'),
('Ordre de bourse','Instruction d''achat ou de vente transmise à une société de bourse.','Stock order','Orden bursátil'),
('Plus-value','Gain réalisé lors de la vente d''un titre au-dessus de son prix d''achat.','Capital gain','Plusvalía'),
('Portefeuille','Ensemble des titres détenus par un investisseur.','Portfolio','Cartera'),
('Quantité transigée','Nombre de titres réellement échangés pendant la séance.','Traded volume','Volumen negociado'),
('Règlement-livraison','Échange des titres contre leur paiement après la transaction.','Settlement','Liquidación'),
('Séance de cotation','Période pendant laquelle les ordres sont confrontés.','Trading session','Sesión bursátil'),
('Société de bourse','Intermédiaire agréé par la COSUMAF pour négocier les titres.','Broker-dealer','Sociedad de bolsa'),
('Suspension','Arrêt temporaire de la cotation d''un titre décidé par la BVMAC.','Trading halt','Suspensión'),
('Variation','Évolution du cours en pourcentage par rapport au cours de référence.','Price change','Variación')
on conflict (term) do nothing;
insert into public.site_settings (key, value) values
('market', '{"date":"2026-10-08","valueTraded":7517000,"equityCapitalisation":1795850543600,"bondOutstanding":1226606149540,"securitiesTraded":3}'::jsonb),
('contact', '{"addressLine1":"Immeuble de la Bourse","addressLine2":"B.P. 442 Douala, Cameroun","phone":"+237 233 43 85 83","fax":"+237 233 43 85 85","email":"bvmac@bvmac.cm","facebook":"https://www.facebook.com/LaBVMAC/","x":"https://twitter.com/BourseBVMAC","linkedin":"https://www.linkedin.com/company/bvmac-bourse/","youtube":"https://www.youtube.com/@BourseBVMAC","playStore":"https://play.google.com/store/apps/details?id=io.osbvmac.projm","appStore":""}'::jsonb),
('institution', '{"capital":9073000000,"shareholdingAsOf":"2024-10-17","shareholding":[{"label":"Entités publiques","value":29},{"label":"Banques et microfinances","value":22},{"label":"Sociétés de bourse","value":12},{"label":"Sociétés d''assurance","value":6},{"label":"Autres","value":31}]}'::jsonb),
('announcement', '{"enabled":false,"text":"","link":""}'::jsonb),
('security', '{"require_2fa":false}'::jsonb),
('messages', '{"pcaName":"","pcaQuote":"","pcaText":"","dgName":"","dgQuote":"","dgText":""}'::jsonb)
on conflict (key) do nothing;
