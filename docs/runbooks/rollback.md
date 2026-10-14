# Roll back a bad deploy

1. `npx wrangler deployments list` and note the last good version id.
2. `npx wrangler rollback <version-id>`
3. Check https://bvmac.skyengpro.site.
4. Fix forward on the branch, then deploy again.
