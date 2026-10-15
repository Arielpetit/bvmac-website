# BVMAC website – page-by-page review sheet

Date: 15 October 2026. Every page exists in three languages: `/fr/...`, `/en/...`, `/es/...`.
Local preview: `http://localhost:3100/fr` (replace `fr` with `en` or `es`).

## What changed on every page in this pass

- Section sub-navigation bar under the header: removed.
- Breadcrumb trail ("Home › Section › Page"): removed.
- Information/disclaimer bars ("This information is provided for information only…", French-only notices, callout boxes): removed.
- Page header: no photo on any inner page (title + short intro), with faint gold CEMAC contour lines on the right (desktop only). All 58 pages open the same way and content starts higher. Photos stay inside the page content (galleries, news, governance messages, home).
- Spacing: same space above and below the header line on every inner page (48 px each side on desktop, was 56/80). Bottom of page unchanged.
- Newsletter: moved to the top of the footer, right after the call-to-action band, above the link columns.
- Translation: all interface text, data labels, notices, corporate-action details, bond issuers, holidays, school lessons, quizzes and glossary are in FR/EN/ES. Proper names stay in French (company legal names, COSUMAF/BEAC full names, street addresses).
- Mobile check (375 px): no horizontal scrolling on any of the 58 pages.
- Visual review: every page was screenshotted in full on desktop (1440 px) and mobile (390 px) and checked by eye.
- AI assistant: the small "answers are indicative" line is removed.

## Fixes from the visual review

- Legal notice, Accessibility: body text was pushed right of the title. Now aligned on the same left edge.
- Privacy policy: the processing table was cut on the right. Narrowed so it fits.
- Trading calendar: the holiday list was a narrow table with empty space beside it. Now a full-width grid of date cards, same style as the agenda.
- Corporate actions agenda (mobile): text was squeezed to one word per line. Buttons now go under the text.
- Governance (mobile): 10 director cards were one per row. Now two per row.
- Stock Market School (mobile): the "My progress" card was cramped beside the ring. Now stacked.
- Markets overview (mobile): figures broke across two lines ("12.5 m FCF / A"). Now on one line.
- Brokers: the drawn schematic map is replaced by a real OpenStreetMap map. Gold markers show brokers per city; click a city to filter the list.
- Contact: the placeholder map is replaced by a real street map of Douala with a pin on the head office and a "Directions" link.

Status key: **Done** = reviewed and fixed in this pass. **Check** = fixed, but worth a look with the business team.

## Pages

| # | Page | Path | Status | What to review / improve next |
|---|------|------|--------|-------------------------------|
| 1 | Home | `/` | Check | Hero, market strip, notices and agenda now translated. Confirm hero photo choice and the order of home sections. |
| **Markets** | | | | |
| 2 | Markets overview | `/marches` | Done | Disclaimer line removed. Confirm which indicators BVMAC wants first. |
| 3 | Equities | `/marches/actions` | Done | Disclaimer line removed. Sector names translated. |
| 4 | Equity profile (e.g. BGFI Holding) | `/marches/actions/[slug]` | Check | Profile header has no breadcrumb now; check the "back to list" link is enough. Company descriptions need official texts. |
| 5 | Bonds | `/marches/obligations` | Done | Issuers ("State of Cameroon"…) translated in table, filter and detail sheet. |
| 6 | Capitalisation | `/marches/capitalisation` | Check | Chart labels fine. Add a short explanation sentence if BVMAC wants one. |
| 7 | Official Price Bulletin (BOC) | `/marches/boc` | Check | Confirm PDF archive source and naming. |
| 8 | Corporate actions agenda | `/marches/agenda` | Done | Event details translated; mobile layout fixed. |
| 9 | Trading calendar & hours | `/marches/calendrier-horaires` | Done | Holidays redesigned as date cards and translated; "note" bar removed. Confirm 2026 holiday list with BVMAC. |
| **Invest** | | | | |
| 10 | How to invest | `/investisseurs/comment-investir` | Done | Rebuilt as a 5-step roadmap (Step 1 … Step 5), each with a link. Confirm step wording with BVMAC. |
| 11 | Investment products | `/investisseurs/produits-boursiers` | Done | Callout removed. Could add one illustration per product. |
| 12 | Investor fees | `/investisseurs/commissions` | Check | Fee figures must be validated against the official tariff. |
| 13 | Investor taxation | `/investisseurs/fiscalite` | Check | Callout removed. Rates per country need legal validation. |
| 14 | Investor protection | `/investisseurs/protection` | Done | — |
| **Issuers** | | | | |
| 15 | Listed companies | `/emetteurs/societes-cotees` | Done | — |
| 16 | Listed company profile | `/emetteurs/societes-cotees/[slug]` | Check | Same template as #4; needs official company texts and logos. |
| 17 | Going public | `/emetteurs/s-introduire-en-bourse` | Done | Callout removed. Could become a roadmap like "How to invest". |
| 18 | Listing requirements | `/emetteurs/conditions-d-admission` | Done | Callout removed. |
| 19 | Eligibility test | `/emetteurs/test-d-eligibilite` | Done | — |
| 20 | Issuer fees | `/emetteurs/commissions` | Check | Validate fee figures. |
| 21 | Issuer taxation | `/emetteurs/fiscalite` | Check | Placeholder per-country section removed; add real content when available. |
| **Participants** | | | | |
| 22 | Brokers (SDB) | `/participants/societes-de-bourse` | Check | Real map with city markers (click to filter). Addresses stay in French. Confirm broker list is current. |
| 23 | Central depository | `/participants/depositaire` | Done | Callout removed. |
| 24 | Regulator (COSUMAF) | `/participants/regulateur` | Done | — |
| **Learn (School)** | | | | |
| 25 | Stock Market School | `/ecole-de-bourse` | Done | Note bar removed; progress card fixed on mobile. |
| 26 | Learning path | `/ecole-de-bourse/parcours/[slug]` | Done | — |
| 27 | Lesson | `/ecole-de-bourse/lecon/[slug]` | Done | 13 lessons + quizzes in FR/EN/ES. |
| 28 | Certificate | `/ecole-de-bourse/certificat/[slug]` | Check | Check print layout. |
| 29 | Glossary | `/ecole-de-bourse/glossaire` | Done | Definitions translated. |
| 30 | Virtual portfolio | `/ecole-de-bourse/portefeuille-virtuel` | Done | Disclaimer line removed; "simulation" label kept on the tool. |
| **News** | | | | |
| 31 | News | `/actualites` | Done | Titles/excerpts translated for existing articles. New articles from admin appear in French until translated. |
| 32 | Article | `/actualites/[slug]` | Done | Breadcrumb removed. |
| 33 | Press area | `/actualites/espace-presse` | Check | Placeholder entries removed; add press kit files when available. |
| 34 | Photo library | `/actualites/phototheque` | Done | — |
| 35 | BVMAC TV | `/actualites/bvmac-tv` | Done | — |
| 36 | Notices & press releases | `/avis-et-communiques` | Done | Notice titles translated; search works in all languages. |
| 37 | Notice detail | `/avis-et-communiques/[id]` | Check | The PDF itself stays the French original. |
| **About BVMAC** | | | | |
| 38 | Overview | `/la-bvmac` | Done | Legal-basis sentence translated. |
| 39 | History | `/la-bvmac/histoire` | Done | Callout removed. |
| 40 | Governance | `/la-bvmac/gouvernance` | Check | Callouts removed; 2 cards per row on mobile. Board member names still to be supplied ("Director N"). |
| 41 | Message from the CEO | `/la-bvmac/gouvernance/message-du-dg` | Check | Needs official signed text and portrait. |
| 42 | Message from the Chair | `/la-bvmac/gouvernance/message-du-pca` | Check | Same as #41. |
| 43 | Organisation chart | `/la-bvmac/organigramme` | Check | Callout removed. Names to confirm with HR. |
| 44 | Market organisation | `/la-bvmac/organisation-du-marche` | Done | — |
| 45 | Products & services | `/la-bvmac/produits-et-services` | Done | — |
| 46 | Shareholding | `/la-bvmac/actionnariat` | Check | Confirm percentages. |
| 47 | Tenders | `/la-bvmac/appels-d-offres` | Done | — |
| **Documentation** | | | | |
| 48 | Documentation | `/documentation` | Done | — |
| 49 | Economic data | `/documentation/donnees-economiques` | Check | Confirm data sources and update dates. |
| 50 | Reports | `/documentation/rapports` | Check | Upload real annual reports. |
| 51 | Tariffs | `/documentation/tarifs` | Check | Validate against official tariff. |
| **Utility & legal** | | | | |
| 52 | Contact | `/contact` | Check | Real street map added; confirm the exact pin position of 1450 Boulevard de la Liberté. Form not yet wired to a real mailbox. |
| 53 | Site map | `/plan-du-site` | Done | — |
| 54 | Legal notice | `/mentions-legales` | Check | Text aligned with title. "Not investment advice" sentence removed as requested; legal team should confirm. Legal review needed. |
| 55 | Privacy policy | `/politique-de-confidentialite` | Check | Legal review needed. |
| 56 | Cookie policy | `/politique-de-cookies` | Check | Legal review needed. |
| 57 | Accessibility | `/accessibilite` | Done | Text aligned with title. |
| 58 | Maintenance | `/maintenance` | Done | Shown only during maintenance. |

## Still open (not in this pass)

- Content that admins add later through the back office is shown in French in EN/ES until a translation is added.
