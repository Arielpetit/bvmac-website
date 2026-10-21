#!/usr/bin/env bash
# Deletes everything deploy.sh created: both Amplify apps (with their environments, builds and deployed
# files), the custom domain associations and the budget. This cannot be undone.
#
#   ./teardown.sh                    asks you to type the stack name to confirm
#   ./teardown.sh --yes              no question (for scripts)
#   ./teardown.sh path/to/file.env   use another settings file
#
# The stack name and region come from secrets.env (the same file deploy.sh reads), so teardown
# targets the stack that deploy created. STACK_NAME=name ./teardown.sh also works.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
FILE="${SECRETS_FILE:-$HERE/secrets.env}"
ASSUME_YES=0
for arg in "$@"; do
  case "$arg" in
    --yes) ASSUME_YES=1 ;;
    -*) echo "Unknown option $arg" >&2; exit 1 ;;
    *) FILE="$arg" ;;
  esac
done
source "$HERE/settings.sh"
[[ -f "$FILE" ]] && load_file   # without a settings file, STACK_NAME and AWS_REGION come from the shell or the defaults

STACK="${STACK_NAME:-bvmac-amplify}"
REGION="${AWS_REGION:-eu-west-3}"
echo "Stack: $STACK (region $REGION)"

if ! err="$(aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" 2>&1 >/dev/null)"; then
  if [[ "$err" == *"does not exist"* ]]; then
    echo "Stack '$STACK' not found in $REGION. Nothing to delete."
    echo "Check STACK_NAME in $FILE: it must be the name deploy.sh used."
    exit 0
  fi
  echo "Could not read stack '$STACK' in $REGION:" >&2
  echo "$err" >&2
  exit 1
fi

echo "Resources in stack '$STACK' ($REGION) that will be deleted:"
aws cloudformation list-stack-resources --region "$REGION" --stack-name "$STACK" \
  --query 'StackResourceSummaries[].[ResourceType,LogicalResourceId]' --output table

if [[ "$ASSUME_YES" != "1" ]]; then
  read -r -p "Type the stack name ($STACK) to delete it: " answer
  [[ "$answer" == "$STACK" ]] || { echo "Cancelled."; exit 1; }
fi

aws cloudformation delete-stack --region "$REGION" --stack-name "$STACK"
echo "Deleting... (this can take a few minutes)"
aws cloudformation wait stack-delete-complete --region "$REGION" --stack-name "$STACK"
echo "Deleted."
echo
echo "Not removed, by design:"
echo "  - DNS records you added yourself for a custom domain (remove them at your DNS provider)."
echo "  - The GitHub connection (revoke the AWS Amplify GitHub App in GitHub if no longer needed)."
echo "  - Content in Supabase and any billing already incurred."
