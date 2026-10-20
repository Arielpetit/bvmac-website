#!/usr/bin/env bash
# Deletes everything deploy.sh created: both Amplify apps (with their branches, builds and deployed
# files), the custom domain associations and the budget. This cannot be undone.
#
#   ./teardown.sh            asks you to type the stack name to confirm
#   ./teardown.sh --yes      no question (for scripts)
set -euo pipefail

STACK="${STACK_NAME:-bvmac-amplify}"
REGION="${AWS_REGION:-eu-west-3}"

if ! aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" >/dev/null 2>&1; then
  echo "Stack '$STACK' not found in $REGION. Nothing to delete."
  exit 0
fi

echo "Resources in stack '$STACK' ($REGION) that will be deleted:"
aws cloudformation list-stack-resources --region "$REGION" --stack-name "$STACK" \
  --query 'StackResourceSummaries[].[ResourceType,LogicalResourceId]' --output table

if [[ "${1:-}" != "--yes" ]]; then
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
