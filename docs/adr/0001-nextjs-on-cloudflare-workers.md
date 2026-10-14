# 0001 — Next.js on Cloudflare Workers through OpenNext

**Status:** accepted, temporary. **Date:** 2026-10-12.

**Context.** The tender preview needed a public address quickly, with HTTPS, a custom domain and low cost.

**Decision.** Build with Next.js 16 and deploy with `@opennextjs/cloudflare` to the worker `bvmac-website` on `bvmac.skyengpro.site`. Cache Components are off, because they hang on Workers; pages use `unstable_cache` instead. `scripts/patch-opennext.mjs` inlines `preview-props.json`, which the Workers bundle otherwise misses.

**Consequences.** Free hosting with a global edge. The app keeps only Web-standard APIs (Web Crypto, fetch), so it also runs on Node. Hosting moves to the SkyEngPro AWS environment soon; this ADR will then be superseded.
