# 0005 — Demonstration data behind one data access layer

**Status:** accepted. **Date:** 2026-10-10.

**Context.** No BVMAC market data API was available during the tender.

**Decision.** All market data comes from `src/data/` through `src/lib/api.ts`. Components never import data files directly.

**Consequences.** Plugging in the real feed changes one module. Until then, every price and volume on the site is illustrative.
