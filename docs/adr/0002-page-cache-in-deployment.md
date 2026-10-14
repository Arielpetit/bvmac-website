# 0002 — Page cache shipped with the deployment

**Status:** accepted. **Date:** 2026-10-12.

**Context.** The OpenNext incremental cache first used Workers KV. The free tier allows 1,000 writes per day; prerendering ~265 pages in 3 languages used it up and the site returned errors.

**Decision.** Use the static-assets incremental cache (`open-next.config.ts`): prerendered pages ship inside the deployment.

**Consequences.** No write quota. A content change in the admin appears after the next deploy, not live. Revisit on AWS, where a regular cache store is available.
