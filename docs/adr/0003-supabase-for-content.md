# 0003 — Supabase for editable content and the back office

**Status:** accepted. **Date:** 2026-10-12.

**Context.** BVMAC staff must edit notices, news, bulletins, agenda, documents and the announcement banner without a developer.

**Decision.** Supabase (Postgres, Auth, Row Level Security). Schema in `supabase/migrations/`. Staff roles `editor` and `admin` come from `app_metadata`, never from user-editable metadata. The admin UI lives at `/admin`. Public pages read through `src/lib/content.ts` with a 300 s cache.

**Consequences.** Managed database, auth and audit log (`public.audit_log`) at no hosting cost. Public sign-up must stay closed. Moving to AWS can keep Supabase or migrate to RDS; the schema is plain Postgres.
