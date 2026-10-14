# Publish admin edits

Admin edits (notices, news, banner, agenda...) are saved in Supabase at once, but the public pages show them after the next deploy ([ADR 0002](../adr/0002-page-cache-in-deployment.md)).

1. Edit in https://bvmac.skyengpro.site/admin.
2. Run [deploy.md](deploy.md).

The announcement banner is the row `key = 'announcement'` in `public.site_settings`.
