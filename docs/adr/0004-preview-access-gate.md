# 0004 — Sign-in gate on previews

**Status:** accepted. **Date:** 2026-10-13.

**Context.** The preview shows unreleased BVMAC material and must not be public or indexed.

**Decision.** A small gate in front of every page (`src/proxy.ts`, `gate-worker.js` for the image optimizer). Testers are listed in `GATE_USERS` as PBKDF2 hashes. Sign-in sets an HMAC-signed cookie (`bvmac_access`, one day) on `.skyengpro.site`, so the app web build accepts it too.

**Consequences.** No user database is needed for testers. Turning the gate off is one setting: empty `GATE_SECRET`. Remove it at public launch.
