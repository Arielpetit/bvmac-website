# Deploy the website

1. `git pull` on the branch to ship (`deploy/cloudflare`).
2. `npm ci`
3. `npm run cf:deploy`
4. Open https://bvmac.skyengpro.site, sign in, check the home page and one page in each language.

Run one deploy at a time. Two deploys in parallel corrupt the cache upload.
