#!/usr/bin/env bash
# Creates or updates the BVMAC hosting on AWS Amplify (Europe, Paris).
# Secrets are read from environment variables and are never written to a file.
#
#   export BUDGET_EMAIL=you@example.org
#   export SUPABASE_URL=... SUPABASE_PUBLISHABLE_KEY=... SUPABASE_SECRET_KEY=... GROQ_API_KEY=...
#   export PREVIEW_USERNAME=... PREVIEW_PASSWORD=...     # optional: password-protect the preview
#   export GITHUB_TOKEN=...                              # optional: otherwise connect GitHub in the console
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
