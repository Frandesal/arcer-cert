import { createBrowserClient } from "@supabase/ssr";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return { url, key };
}

export function createClient() {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Use API Keys tab (not Connection String). " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local"
    );
  }
  return createBrowserClient(url, key);
}
