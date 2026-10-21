#!/usr/bin/env bash
# Creates or updates the BVMAC hosting on AWS Amplify (Europe, Paris): one environment per app.
#
# Settings and secrets are read from a file, never typed on the command line and never committed:
#
#   cp secrets.env.example secrets.env     # then fill it in
#   chmod 600 secrets.env                  # the script refuses a file that others can read
#   ./deploy.sh                            # reads ./secrets.env
#   ./deploy.sh /path/to/my-secrets.env    # or any other file (keep it outside the repository)
#   ./deploy.sh --builds-only              # code changed, hosting did not: just rebuild and publish
#
# A variable already exported in your shell wins over the file.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
BUILDS_ONLY=0
FILE="${SECRETS_FILE:-$HERE/secrets.env}"
for arg in "$@"; do
  case "$arg" in
    --builds-only) BUILDS_ONLY=1 ;;   # skip the AWS setup, only rebuild and publish the current code
    -*) echo "Unknown option $arg" >&2; exit 1 ;;
    *) FILE="$arg" ;;
  esac
done

source "$HERE/settings.sh"
load_file

: "${BUDGET_EMAIL:?Set BUDGET_EMAIL in $FILE (receives the budget alerts)}"
STACK="${STACK_NAME:-bvmac-amplify}"
REGION="${AWS_REGION:-eu-west-3}"
WEB_BRANCH="${WEB_BRANCH:-main}"
APP_BRANCH="${APP_BRANCH:-master}"

if [[ "$BUILDS_ONLY" == "0" ]]; then
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
fi

out() { aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text; }

# Builds an app's branch and waits until it is published, then prints the address.
publish() {   # name appId branch domain
  local name="$1" id="$2" branch="$3" domain="$4" job status
  echo
  echo "== $name: building branch '$branch' =="
  job="$(aws amplify start-job --region "$REGION" --app-id "$id" --branch-name "$branch" --job-type RELEASE \
    --query 'jobSummary.jobId' --output text 2>&1)" || { echo "  could not start the build: $job"; echo "  (does branch '$branch' exist on GitHub, and is the repository connected in Amplify?)"; return 1; }
  while :; do
    status="$(aws amplify get-job --region "$REGION" --app-id "$id" --branch-name "$branch" --job-id "$job" --query 'job.summary.status' --output text)"
    case "$status" in
      SUCCEED) echo "  $name is live:  https://${branch//\//-}.${domain}"; return 0 ;;
      FAILED|CANCELLED) echo "  build $status. Open the build log: https://${REGION}.console.aws.amazon.com/amplify/apps/${id}/branches/${branch//\//%2F}/deployments/${job}"; return 1 ;;
      *) printf '  %s...\r' "$status"; sleep 15 ;;
    esac
  done
}

# Prints the DNS records to create at your domain provider (only when a custom domain is set).
dns_records() {   # name appId domain
  local name="$1" id="$2" domain="$3"
  [[ -n "$domain" ]] || return 0
  echo
  echo "== DNS records for $name ($domain) - create these at your domain provider =="
  aws amplify get-domain-association --region "$REGION" --app-id "$id" --domain-name "$domain" \
    --query 'domainAssociation.[domainStatus, certificateVerificationDNSRecord, subDomains[].dnsRecord]' --output text 2>&1 \
    | sed 's/^/  /' || echo "  not available yet: run ./deploy.sh --builds-only again in a few minutes"
}

if [[ -n "${GITHUB_TOKEN:-}" || "$BUILDS_ONLY" == "1" ]]; then
  fail=0
  publish "website" "$(out WebAppId)" "$WEB_BRANCH" "$(out WebDefaultDomain)" || fail=1
  publish "app (web version)" "$(out AppWebAppId)" "$APP_BRANCH" "$(out AppWebDefaultDomain)" || fail=1
  echo
  [[ -n "${PREVIEW_USERNAME:-}" ]] && echo "Both addresses ask for the preview login (user: $PREVIEW_USERNAME, password: PREVIEW_PASSWORD in $FILE)."
  dns_records "website" "$(out WebAppId)" "${WEB_DOMAIN:-}"
  dns_records "app (web version)" "$(out AppWebAppId)" "${APP_DOMAIN:-}"
  exit $fail
else
  echo "No GITHUB_TOKEN: connect each repository in the Amplify console, then push to start the first build."
fi
