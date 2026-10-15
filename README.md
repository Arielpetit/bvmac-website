# BVMAC website (Next.js)

Website for the Bourse des Valeurs Mobilières de l'Afrique Centrale, built for
tender N°030/06/BVMAC/DG/DSI/07-26. It follows the BVMAC Digital Brand Guidelines v0.2 ([docs/brand](docs/brand/BVMAC-Brand-Guidelines-v0.2.pdf))
and the blueprint in `../docs/`.

User guide: [docs/USER-GUIDE.md](docs/USER-GUIDE.md) · Engineering doc: [docs/ENGINEERING.md](docs/ENGINEERING.md) · ADRs: [docs/adr](docs/adr/README.md) · Runbooks: [docs/runbooks](docs/runbooks/README.md)

## Run

```bash
npm install
npm run dev        # http://localhost:3000 (redirects to /fr)
npm run build      # production build (265 prerendered pages)
npm run lint
```

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS 4 with brand tokens in `src/app/globals.css`
- Recharts for charts, lucide-react for icons
- Fonts (Fraunces, Geist, Geist Mono) self-hosted by `next/font` at build time
- No third-party scripts: no Google Analytics, Fonts, Maps or reCAPTCHA

## Structure

```
src/
  app/[locale]/        one folder per page; /fr, /en and /es are prerendered
  app/globals.css      brand tokens (light and dark) and type scale
  components/layout/   top bar, header + mega menu, ticker, footer, cookie consent, search
  components/ui/       buttons, chips, flags, price change, cards, callouts, states
  components/market/   charts, equity table, BOC archive, agenda, session timeline
  components/content/  notices, documents, forms, legal page wrapper
  components/school/   École de bourse hub, quiz, badges, simulator
  data/                demonstration data (market, content, institution, school)
  lib/api.ts           the only data access layer (replace with the real API)
  i18n/                dictionaries (fr is the source) and provider
  proxy.ts             redirects paths without a locale prefix
public/brand/          logo files extracted from the brand guidelines PDF
```

## Pages

Home · Marchés (séance, actions, fiche valeur ×7, obligations, capitalisation, BOC,
agenda, calendrier) · La BVMAC (présentation, histoire, organisation du marché,
gouvernance, organigramme, actionnariat, produits et services, appels d'offres) ·
Émetteurs (sociétés cotées, s'introduire en bourse, conditions, test d'éligibilité,
commissions, fiscalité) · Investisseurs (comment investir, produits, protection,
commissions, fiscalité) · Participants (sociétés de bourse, dépositaire, régulateur) ·
École de bourse (hub, 14 leçons avec quiz, glossaire, portefeuille virtuel) ·
Actualités (actualités, avis et communiqués, BVMAC TV, photothèque, espace presse) ·
Documentation (textes, rapports, tarifs, données économiques) · Contact ·
Mentions légales · Confidentialité · Accessibilité · Plan du site · sitemap.xml · robots.txt

## What is demonstration content

- Headline market figures for 8 Oct 2026 come from the current site; individual
  prices, volumes and histories are illustrative (`src/data/market.ts`, `series.ts`).
- Notice and news titles mirror the current site; numbers, sizes and some items are placeholders.
- Board members, organigramme, fees, tax rates, press contact and legal texts are
  placeholders marked "à confirmer" / "à publier" on the pages.
- 12 of the 25 brokers are entered (names, licences and addresses from the current site).
- Logos are cropped from the brand guidelines PDF; replace with the official SVG files.
- English and Spanish cover navigation, interface and key pages; long institutional
  texts show a "Content available in French" notice.

## To connect for production

1. Replace `src/lib/api.ts` with calls to the market-data API and the headless CMS.
2. Wire forms, newsletter and consent log to the API (`POST /v1/forms`, `/v1/consent`).
3. Supply official charte graphique values (only `globals.css` tokens change).
4. Add a strict Content-Security-Policy with nonces at the edge; the other security
   headers are already set in `next.config.ts`.
5. Confirm trading hours, holidays, fees and legal texts with BVMAC.
