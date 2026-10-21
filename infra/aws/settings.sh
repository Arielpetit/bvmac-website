# Shared by deploy.sh and teardown.sh: reads secrets.env (plain KEY=VALUE lines).
# The file is parsed, never executed, and a file that other users can read is refused.
# Expects FILE to be set. A variable already exported in the shell wins over the file.
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
