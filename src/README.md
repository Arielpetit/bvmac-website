# BVMAC website — source guide

Next.js 16 (App Router, `cacheComponents`), React 19, Tailwind CSS 4, Motion, Recharts.

## Layout

| Folder | Contents |
| --- | --- |
| `app/[locale]/` | Every page, prefixed by locale (`fr`, `en`, `es`). `layout.tsx` holds fonts, header, footer, smooth scroll and cookie consent. |
| `app/[locale]/error.tsx`, `not-found.tsx`, `app/global-error.tsx` | Error pages (500, 404, root failure). `/maintenance` is a standalone page the proxy can rewrite to. |
| `proxy.ts` | Redirects `/` to the visitor's language (cookie `NEXT_LOCALE`, then `Accept-Language`). |
| `i18n/` | Dictionaries for interface text. Long-form content is French; EN/ES pages show a notice. |
| `data/` | Content and demo data. `real.ts` is generated from www.bvm-ac.org (notices, news, BOC archive, bonds, brokers). `market.ts` holds equities and the market summary. |
| `lib/api.ts` | The only data access layer. Replace these functions with calls to the BVMAC market data API and CMS. |
| `lib/navigation.ts` | Six-group navigation used by the header mega menu, section sub-navigation, footer and sitemap. |
| `lib/client-store.ts` | `useSyncExternalStore` hooks for local storage, URL params and media queries. |
| `components/layout/` | Header (single bar + mega menu + mobile sheet), footer, search dialog (Ctrl K), favourites, cookie consent. |
| `components/motion/` | Reveal, Stagger, WordReveal, CountUp, Parallax, Marquee, scroll progress, back-to-top, Lenis smooth scroll. All respect `prefers-reduced-motion`. |
| `components/ui/` | Design-system primitives: Button, Card, Tabs, Accordion/Faq, Sheet, Hint, PageHeader, Skeleton, Callout. |
| `components/market/` | Market tables and charts. Charts are code-split through `LazyCharts.tsx`. |
| `components/school/` | École de la Bourse: hub, lessons, quiz, glossary, simulator, certificate. Progress stays in `localStorage`. |

## Design tokens

Defined in `app/globals.css`: espresso `#120c06`, gold `#c9a23a`, paper `#fbf9f5`. Fonts are Fraunces (display) and Geist (text, figures). Dark mode switches through `data-theme="dark"` on `<html>`.

## Content to validate

Everything marked "à confirmer" or "à fournir par la BVMAC" in the UI is a placeholder: board names, organisation chart, fee amounts, national tax measures, leadership messages and legal texts.

## Commands

```bash
npm run dev       # http://localhost:3000
npx next typegen  # regenerate route types after adding a page
npx tsc --noEmit
npm run lint
npm run build
```
