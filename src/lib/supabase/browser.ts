"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser client for the admin (session kept in localStorage by supabase-js).
// Uses the publishable key only: every write is checked by Row Level Security.
let client: SupabaseClient | null = null;

export function supabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getBrowserClient(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  }
  return client;
}
