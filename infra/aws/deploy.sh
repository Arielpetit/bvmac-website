#!/usr/bin/env bash
# Creates or updates the BVMAC hosting on AWS Amplify (Europe, Paris).
# Secrets are read from environment variables and are never written to a file.
#
#   export BUDGET_EMAIL=you@example.org
#   export SUPABASE_URL=... SUPABASE_PUBLISHABLE_KEY=... SUPABASE_SECRET_KEY=... GROQ_API_KEY=...
#   export PREVIEW_USERNAME=... PREVIEW_PASSWORD=...     # optional: password-protect the preview
#   export GITHUB_TOKEN=...                              # fine-grained, read-only: lets the script connect GitHub and start the first builds
#   export PRODUCTION_BRANCH=main STAGING_BRANCH=develop # branches to deploy (these defaults); the branches must already exist on GitHub
#   export WEB_REPO=https://github.com/OWNER/REPO APP_REPO=https://github.com/OWNER/REPO   # optional: other repositories
#   export WEB_DOMAIN=example.org APP_DOMAIN=app.example.org SITE_URL=https://example.org   # optional
#   ./deploy.sh
set -euo pipefail

: "${BUDGET_EMAIL:?Set BUDGET_EMAIL (receives the budget alerts)}"
STACK="${STACK_NAME:-bvmac-amplify}"
REGION="${AWS_REGION:-eu-west-3}"
HERE="$(cd "$(dirname "$0")" && pwd)"

aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK" \
  --template-file "$HERE/amplify.yaml" \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    "BudgetEmail=$BUDGET_EMAIL" \
    "MonthlyBudgetUsd=${MONTHLY_BUDGET_USD:-10}" \
    "GitHubAccessToken=${GITHUB_TOKEN:-}" \
    "ProductionBranch=${PRODUCTION_BRANCH:-main}" \
    "StagingBranch=${STAGING_BRANCH:-develop}" \
    ${WEB_REPO:+"WebRepository=$WEB_REPO"} \
    ${APP_REPO:+"AppRepository=$APP_REPO"} \
    "PreviewUsername=${PREVIEW_USERNAME:-}" \
    "PreviewPassword=${PREVIEW_PASSWORD:-}" \
    "WebDomain=${WEB_DOMAIN:-}" \
    "AppDomain=${APP_DOMAIN:-}" \
    "SiteUrl=${SITE_URL:-}" \
    "SupabaseUrl=${SUPABASE_URL:-}" \
    "SupabasePublishableKey=${SUPABASE_PUBLISHABLE_KEY:-}" \
    "SupabaseSecretKey=${SUPABASE_SECRET_KEY:-}" \
    "GroqApiKey=${GROQ_API_KEY:-}"

echo
aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" \
  --query 'Stacks[0].Outputs[].[OutputKey,OutputValue]' --output table

# With a GitHub token the apps can already read the repositories, so start the first build of each
# branch now instead of waiting for the next push.
if [ -n "${GITHUB_TOKEN:-}" ]; then
  out() { aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text; }
  WEB_ID="$(out WebAppId)"; APP_ID="$(out AppWebAppId)"
  for branch in "${PRODUCTION_BRANCH:-main}" "${STAGING_BRANCH:-develop}"; do
    for id in "$WEB_ID" "$APP_ID"; do
      echo "Starting build: app $id, branch $branch"
      aws amplify start-job --region "$REGION" --app-id "$id" --branch-name "$branch" --job-type RELEASE \
        --query 'jobSummary.[jobId,status]' --output text || echo "  could not start (does branch '$branch' exist on GitHub?)"
    done
  done
  echo "Follow the builds in the Amplify console: $(out Console)"
else
  echo "No GITHUB_TOKEN: connect each repository in the Amplify console, then push to start the first build."
fi
