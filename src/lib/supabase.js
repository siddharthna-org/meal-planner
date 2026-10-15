import { createClient } from "@supabase/supabase-js";

let client;

export function getSupabaseClient() {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key || key === "your-publishable-key") {
    throw new Error(
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local, then restart Vite.",
    );
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("VITE_SUPABASE_URL must be a valid HTTP or HTTPS URL.");
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("VITE_SUPABASE_URL must be a valid HTTP or HTTPS URL.");
  }
  if (key.startsWith("sb_secret_")) {
    throw new Error(
      "Use a Supabase publishable key, never a secret key in the browser.",
    );
  }

  client = createClient(url, key);
  return client;
}
