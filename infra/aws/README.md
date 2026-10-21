# Provisioning BVMAC hosting on AWS Amplify

One CloudFormation template creates everything. One script deploys it.

## What it creates (Europe, Paris, `eu-west-3`)

| Resource | Purpose |
|---|---|
| Amplify app `bvmac-website` | The website (Next.js, server-rendered), builds from `web/amplify.yml` |
| Amplify app `bvmac-app-web` | The web version of the mobile app (static), builds from `mobile/amplify.yml` |
| One environment per app (one branch each) | Built and published on every push |
| Optional password on both apps | For the private preview. Remove it at public launch |
| Optional custom domains | HTTPS certificates are created and renewed by AWS |
| AWS Budget `bvmac-monthly` | Email alert at 80 % and 100 % of the monthly amount (default $10) |

The template creates no IAM roles and no servers.

## Permissions needed by whoever runs it

`cloudformation:*` on the stack `bvmac-amplify`, `amplify:*`, `budgets:*`, and, only if a custom domain is
attached and its DNS zone is in the same AWS account, `route53:ChangeResourceRecordSets` and
`route53:ListHostedZones`. Nothing else.

## Steps

1. Install the AWS CLI and sign in to the account (`aws sts get-caller-identity` must work).
2. Create the settings file. It holds the secrets, stays on your machine, and is git-ignored:
   ```bash
   cd web/infra/aws
   cp secrets.env.example secrets.env
   chmod 600 secrets.env      # the script refuses a file that other users can read
   ```
   Fill it in (editor of your choice). Keep real values out of chats, tickets and commits. You can also point to a
   file outside the repository: `./deploy.sh ~/secrets/bvmac.env`. A variable already exported in your shell
   wins over the file.
3. Run `./deploy.sh`. It prints the Amplify addresses when it finishes.
4. **GitHub (you, in the console).** With no `GITHUB_TOKEN` (the default), the script only creates the apps and starts
   no build. In the Amplify console, open each app, click "Start migration" (or "Connect repository"), and authorise
   the AWS Amplify GitHub App on the repository (an organisation owner may have to approve it). Then open the branch
   and click "Redeploy this version", or push a commit. Optional: put a read-only `GITHUB_TOKEN` in the file and the
   script connects GitHub and starts the first builds itself. The branches must already exist on GitHub.
5. **DNS (once).** If you set `WEB_DOMAIN` or `APP_DOMAIN`, Amplify shows the records to add. If the zone is in
   Route 53 in the same account, they are added for you.
6. Push to the branch. Amplify builds and deploys each push.

To change a value, edit the file and run `./deploy.sh` again; it updates the same stack.

## First-run checks (do these before public launch)

- [ ] The website build passes. AWS lists Next.js up to version 15 as supported; the site uses 16.4. If the build or
      the pages fail, stop and switch to the S3 + CloudFront + Lambda route.
- [ ] `/en`, `/fr`, `/es` load, and the language redirect on `/` works (`proxy.ts` runs on Amplify).
- [ ] The AI assistant answers. Its streaming is not supported by Amplify; if it hangs, switch it to whole-answer mode.
- [ ] The app web version opens, and a deep link such as `/marches` opens the right screen after a refresh.
- [ ] The first build time is recorded; the cost estimate assumes 5 minutes.
- [ ] The budget alert email was received (AWS sends a confirmation).

## Teardown

`./teardown.sh` lists what will be deleted, asks you to type the stack name, then removes both Amplify apps (with their
branches, builds and deployed files), the domain associations and the budget. Use `./teardown.sh --yes` to skip the
question. It does not remove DNS records you added yourself, the GitHub connection, Supabase content or past charges.

## Known limits (not yet tested against a real account)

- The template passes `cfn-lint`, but it has not been deployed. Expect to adjust it on the first run.
- Two Amplify apps cannot always share the same root domain. If the app's domain is rejected, attach it as a
  subdomain (for example `app.example.org`) in the console instead.
- Amplify does not give the running server the build's environment variables. `amplify.yml` copies the ones the site
  needs into `.env.production` during the build.
