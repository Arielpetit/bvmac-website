# Rotate a secret

| Secret | Where to create the new value |
|---|---|
| `SUPABASE_SECRET_KEY`, publishable key | Supabase dashboard, Project settings, API keys |
| Database password | Supabase dashboard, Database settings |
| `GROQ_API_KEY` | console.groq.com, API keys |
| `GATE_SECRET` | any 64-character random string (`openssl rand -hex 32`) |

1. Create the new value.
2. `npx wrangler secret put <NAME>`; update `.env.local` for local work.
3. Revoke the old value at the provider.
4. Check the site and `/admin` still work.
