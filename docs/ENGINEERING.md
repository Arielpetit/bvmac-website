# BVMAC website — engineering

Public website and content back office for the Bourse des Valeurs Mobilières de l'Afrique Centrale (BVMAC), built for tender N°030/06/BVMAC/DG/DSI/07-26. Companion app: [skyengpro/bvmac-mobile](https://github.com/skyengpro/bvmac-mobile/blob/master/docs/ENGINEERING.md).

User guide for BVMAC staff and testers: [USER-GUIDE.md](USER-GUIDE.md).

## Environments

| Environment | Address | Hosting |
|---|---|---|
| Preview | https://bvmac.skyengpro.site | Cloudflare Workers, worker `bvmac-website`. Moving to the SkyEngPro AWS environment soon. |
| Development | http://localhost:3000 | `npm run dev` |

Both are behind a sign-in gate (`/login`). Market data is demonstration data; there is no BVMAC feed yet.

## Technology

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4; brand tokens in `src/app/globals.css` (light and dark), per the [brand guidelines v0.2](brand/BVMAC-Brand-Guidelines-v0.2.pdf) |
| Motion | `motion`, `lenis` (smooth scroll) |
| Charts, icons | Recharts, lucide-react |
| Fonts | Fraunces (headings), Geist (text, figures), Geist Mono (codes), self-hosted through `next/font` |
| Languages | French (source), English, Spanish; dictionaries in `src/i18n/`; `/fr`, `/en`, `/es` |
| Content and admin | Supabase (Postgres, Auth, RLS), project `kshheckxedarrothfinh`; admin UI at `/admin` |
| Assistant | `/api/bvmac-ai`, Groq chat completions (`GROQ_MODEL`), answers grounded on site content (`src/lib/ai/`) |
| Access gate | `src/lib/gate.ts` + `src/proxy.ts` + `gate-worker.js`; HMAC-signed cookie, PBKDF2 password hashes, Web Crypto only |
| Hosting adapter | `@opennextjs/cloudflare` (`open-next.config.ts`, `wrangler.jsonc`) |
| Third parties in the browser | None (no analytics, Google Fonts, Maps or reCAPTCHA) |

## Code map

```
src/app/[locale]/   public pages, one folder per page
src/app/admin/      back office (Supabase Auth, staff roles editor/admin)
src/app/api/        bvmac-ai, gate/login|logout, admin/users
src/components/     layout, ui, market, content, school
src/data/           demonstration data
src/lib/api.ts      single data access layer: swap here for the real BVMAC API
src/lib/content.ts  Supabase content reads, cached 300 s
supabase/           migrations (18 tables: notices, news, bulletins, equities, bonds, agenda, ...) and seeds
scripts/            patch-opennext.mjs (postinstall), gate-user.mjs
```

## Run

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev                  # http://localhost:3000
npm run lint
npm run cf:preview           # production build on the local Workers runtime
```

## Configuration

| Name | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | secret / `.env.local` | Supabase, browser-safe |
| `SUPABASE_SECRET_KEY` | secret | Server only: team management |
| `GROQ_API_KEY`, `GROQ_MODEL` | secret | Assistant |
| `GATE_SECRET`, `GATE_USERS` | secret | Access gate; gate off when `GATE_SECRET` is empty |
| `GATE_COOKIE_DOMAIN` | `wrangler.jsonc` var | `.skyengpro.site`, shares the session with the app |
| `SITE_URL` | `.env.production` | Canonical address for metadata, sitemap, share images |

Secrets are Cloudflare worker secrets. They are never committed.

## Operations

Runbooks: [docs/runbooks](runbooks/README.md). Decisions: [docs/adr](adr/README.md).

## Known limits

- Demonstration market data only.
- Admin edits show after the next deploy, because the page cache ships with the deployment ([ADR 0002](adr/0002-page-cache-in-deployment.md)).
- No monitoring beyond Cloudflare observability. No backups beyond Supabase defaults.
