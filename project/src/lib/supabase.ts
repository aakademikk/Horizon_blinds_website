import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for storing enquiries.
 *
 * Both environment variables are optional: without them the API route still
 * validates, still fires the webhook and still returns success, so the site
 * works out of the box before any backend is connected.
 */
let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  if (cached) return cached;

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "fab-shutters-website" } },
  });
  return cached;
}

export const ENQUIRIES_TABLE = process.env.SUPABASE_ENQUIRIES_TABLE ?? "enquiries";
