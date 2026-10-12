import { createClient } from "@supabase/supabase-js";

// Read-only server client for the public site (anon role, no session).
// Returns null when Supabase is not configured, so pages fall back to static data.
export function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
