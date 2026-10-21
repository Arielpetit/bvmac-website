#!/usr/bin/env bash
# Creates or updates the BVMAC hosting on AWS Amplify (Europe, Paris): one environment per app.
#
# Settings and secrets are read from a file, never typed on the command line and never committed:
#
#   cp secrets.env.example secrets.env     # then fill it in
#   chmod 600 secrets.env                  # the script refuses a file that others can read
#   ./deploy.sh                            # reads ./secrets.env
#   ./deploy.sh /path/to/my-secrets.env    # or any other file (keep it outside the repository)
#
# A variable already exported in your shell wins over the file.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
FILE="${1:-${SECRETS_FILE:-$HERE/secrets.env}}"

KEYS=(BUDGET_EMAIL MONTHLY_BUDGET_USD GITHUB_TOKEN WEB_REPO APP_REPO WEB_BRANCH APP_BRANCH
      PREVIEW_USERNAME PREVIEW_PASSWORD WEB_DOMAIN APP_DOMAIN SITE_URL
      SUPABASE_URL SUPABASE_PUBLISHABLE_KEY SUPABASE_SECRET_KEY GROQ_API_KEY
      STACK_NAME AWS_REGION)

load_file() {
  [[ -f "$FILE" ]] || { echo "No settings file at $FILE (copy secrets.env.example to secrets.env)." >&2; return 1; }
  local mode; mode="$(stat -c '%a' "$FILE" 2>/dev/null || stat -f '%Lp' "$FILE")"
  if [[ "${mode: -2}" != "00" ]]; then
    echo "Refusing to read $FILE: permissions are $mode, others can read it. Run: chmod 600 \"$FILE\"" >&2
    exit 1
  fi
  local line key value
  # Plain KEY=VALUE lines only. The file is parsed, not executed, so it cannot run commands.
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*(#|$) ]] && continue
    key="${line%%=*}"; key="${key//[[:space:]]/}"; key="${key#export}"
    value="${line#*=}"
    value="${value%\"}"; value="${value#\"}"; value="${value%\'}"; value="${value#\'}"
    for k in "${KEYS[@]}"; do
      if [[ "$k" == "$key" && -z "${!k+x}" ]]; then export "$k=$value"; fi
    done
  done < "$FILE"
}
load_file

: "${BUDGET_EMAIL:?Set BUDGET_EMAIL in $FILE (receives the budget alerts)}"
STACK="${STACK_NAME:-bvmac-amplify}"
REGION="${AWS_REGION:-eu-west-3}"
WEB_BRANCH="${WEB_BRANCH:-main}"
APP_BRANCH="${APP_BRANCH:-master}"

aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK" \
  --template-file "$HERE/amplify.yaml" \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    "BudgetEmail=$BUDGET_EMAIL" \
    "MonthlyBudgetUsd=${MONTHLY_BUDGET_USD:-10}" \
    "GitHubAccessToken=${GITHUB_TOKEN:-}" \
    "WebBranch=$WEB_BRANCH" \
    "AppBranch=$APP_BRANCH" \
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
# app now instead of waiting for the next push.
if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  out() { aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text; }
  start() {
    echo "Starting build: app $1, branch $2"
    aws amplify start-job --region "$REGION" --app-id "$1" --branch-name "$2" --job-type RELEASE \
      --query 'jobSummary.[jobId,status]' --output text \
      || echo "  could not start (does branch '$2' exist on GitHub?)"
  }
  start "$(out WebAppId)" "$WEB_BRANCH"
  start "$(out AppWebAppId)" "$APP_BRANCH"
  echo "Follow the builds in the Amplify console: $(out Console)"
else
  cat <<MSG

Done. The apps exist, nothing has been built yet. Next, in the Amplify console ($(aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" --query "Stacks[0].Outputs[?OutputKey=='Console'].OutputValue" --output text)):
  1. Open each app (bvmac-website, bvmac-app-web).
  2. Click "Start migration" (or "Connect repository") and authorise the AWS Amplify GitHub App on the repository.
  3. Open the branch ($WEB_BRANCH for the website, $APP_BRANCH for the app) and click "Redeploy this version", or push a commit.
MSG
fi
