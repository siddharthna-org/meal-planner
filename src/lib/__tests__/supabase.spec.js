import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createClient } = vi.hoisted(() => ({ createClient: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient }));

beforeEach(() => {
  vi.resetModules();
  createClient.mockReset();
  vi.stubEnv("VITE_SUPABASE_URL", "http://127.0.0.1:54321");
  vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_example");
});

afterEach(() => vi.unstubAllEnvs());

describe("Supabase client", () => {
  it("creates one client lazily", async () => {
    const instance = {};
    createClient.mockReturnValue(instance);
    const { getSupabaseClient } = await import("../supabase");
    expect(createClient).not.toHaveBeenCalled();
    expect(getSupabaseClient()).toBe(instance);
    expect(getSupabaseClient()).toBe(instance);
    expect(createClient).toHaveBeenCalledExactlyOnceWith(
      "http://127.0.0.1:54321",
      "sb_publishable_example",
    );
  });

  it.each(["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"])(
    "allows imports but rejects calls when %s is missing",
    async (variable) => {
      vi.stubEnv(variable, "");
      const { getSupabaseClient } = await import("../supabase");
      expect(() => getSupabaseClient()).toThrow(".env.local");
      expect(createClient).not.toHaveBeenCalled();
    },
  );

  it.each(["not-a-url", "ftp://example.com"])(
    "rejects invalid URL %s",
    async (url) => {
      vi.stubEnv("VITE_SUPABASE_URL", url);
      const { getSupabaseClient } = await import("../supabase");
      expect(() => getSupabaseClient()).toThrow("HTTP or HTTPS");
    },
  );

  it("rejects secret keys", async () => {
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_secret_example");
    const { getSupabaseClient } = await import("../supabase");
    expect(() => getSupabaseClient()).toThrow("never a secret key");
  });
});
