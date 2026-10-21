# Deploying the BVMAC site and app on AWS Amplify

Every command runs from this folder:

```bash
cd web/infra/aws
```

## What gets deployed

| App | Repository | Branch | Result |
|---|---|---|---|
| Website | `WEB_REPO` | `WEB_BRANCH` (set in `secrets.env`) | Next.js, server-rendered |
| Mobile app, web version | `APP_REPO` | `APP_BRANCH` (set in `secrets.env`) | static export |

Amplify builds with `web/amplify.yml` and `mobile/amplify.yml`. The Cloudflare files (`wrangler.jsonc`,
`gate-worker.js`) are not used on Amplify.

## One-time setup

1. **AWS login.** Check it works: `aws sts get-caller-identity` (it must print your account).
   Temporary keys (`ASIA...`) need `AWS_SESSION_TOKEN` too; use `aws configure sso` or the portal's
   "Command line access" lines.
2. **Settings file.**
   ```bash
   cp secrets.env.example secrets.env
   chmod 600 secrets.env
   ```
   Fill it in. It is git-ignored; never paste it in a chat. Required: `BUDGET_EMAIL`, the repositories and branches,
   `GITHUB_TOKEN`, and the Supabase and Groq keys.
3. **GitHub connection.** With `GITHUB_TOKEN` in `secrets.env` the apps rebuild on every push to their branch.
   The console may show "Update required" and suggest the AWS Amplify GitHub App instead; the token keeps working
   until AWS retires it. Keep the token valid (check its expiry date) or switch to the GitHub App.

## Deploy (first time, or when hosting settings changed)

```bash
./deploy.sh
```

It creates or updates the two Amplify apps, starts one build per app, waits for each to finish, and prints:

```
== website: building branch 'deploy/cloudflare' ==
  website is live:  https://deploy-cloudflare.xxxxxxxx.amplifyapp.com
== app (web version): building branch 'master' ==
  app (web version) is live:  https://master.xxxxxxxx.amplifyapp.com
```

A failed build prints the link to its log instead.

## Deploy new code (hosting unchanged)

Push to the branch. Amplify builds it. Or build now from the terminal, without touching the AWS setup:

```bash
./deploy.sh --builds-only
```

## Change a secret, the password or the branch

Edit `secrets.env`, then run `./deploy.sh` again. It updates the same stack.

## Go live

1. Set `WEB_DOMAIN`, `APP_DOMAIN`, `SITE_URL` in `secrets.env`.
2. Empty `PREVIEW_USERNAME` and `PREVIEW_PASSWORD` to remove the preview password.
3. `./deploy.sh`. At the end it prints the DNS records to create at your domain provider. To print them again
   later: `./deploy.sh --builds-only`, or look in the console under Hosting > Custom domains, or run
   `aws amplify get-domain-association --region eu-west-3 --app-id <APP_ID> --domain-name <DOMAIN>`.
   The records are CNAMEs: one to validate the HTTPS certificate and one per address (`www`, the app...).
   It takes a few minutes to a few hours for the address to answer.

## Delete everything

```bash
./teardown.sh
```

It reads `STACK_NAME` and the region from `secrets.env`, the same file `deploy.sh` uses, shows what will be deleted
and asks you to type the stack name. If it says the stack was not found, check `STACK_NAME` in that file.

## If a build fails

Open the build in the Amplify console, scroll to the end of the "Build" step and find the line starting with
`[ERROR]`. Common causes: the build output is above 220 MiB (reduce the pre-built pages), or a Node version
problem (the build uses Node 22 through `nvm install 22`).
