import greeting from "./index.ts";

Deno.env.set("SUPABASE_URL", "http://127.0.0.1:54321");
Deno.env.set("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test_fixture");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function request(body: string, method = "POST") {
  return new Request("http://localhost/hello-world", {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:5173",
    },
    ...(method === "POST" ? { body } : {}),
  });
}

Deno.test("returns a trimmed greeting without credentials", async () => {
  const response = await greeting.fetch(
    request(JSON.stringify({ name: " Ada " })),
  );
  assert(response.status === 200, `Expected 200, received ${response.status}`);
  assert(
    (await response.json()).message === "Hello Ada!",
    "Unexpected greeting",
  );
  assert(
    response.headers.has("access-control-allow-origin"),
    "Missing CORS headers",
  );
});

for (const body of [
  {},
  null,
  [],
  { name: 3 },
  { name: " " },
  { name: "a".repeat(101) },
]) {
  Deno.test(`rejects invalid payload: ${JSON.stringify(body)}`, async () => {
    const response = await greeting.fetch(request(JSON.stringify(body)));
    assert(
      response.status === 400,
      `Expected 400, received ${response.status}`,
    );
    assert(typeof (await response.json()).error === "string", "Missing error");
    assert(
      response.headers.has("access-control-allow-origin"),
      "Missing error CORS headers",
    );
  });
}

Deno.test("accepts a 100-character name", async () => {
  const response = await greeting.fetch(
    request(JSON.stringify({ name: "a".repeat(100) })),
  );
  assert(response.status === 200, "Expected maximum-length name to pass");
  await response.body?.cancel();
});

Deno.test("rejects malformed JSON", async () => {
  const response = await greeting.fetch(request("{"));
  assert(response.status === 400, "Expected malformed JSON to fail");
  assert(
    (await response.json()).error === "Invalid JSON body.",
    "Unexpected error",
  );
});

Deno.test("rejects unsupported methods", async () => {
  const response = await greeting.fetch(request("", "GET"));
  assert(response.status === 405, "Expected GET to fail");
  assert(
    response.headers.get("allow") === "POST, OPTIONS",
    "Missing Allow header",
  );
  await response.body?.cancel();
});

Deno.test("handles browser preflight", async () => {
  const response = await greeting.fetch(
    new Request("http://localhost/hello-world", {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers":
          "authorization, apikey, content-type, x-client-info",
      },
    }),
  );
  assert(response.ok, "Preflight failed");
  assert(
    response.headers.has("access-control-allow-origin"),
    "Missing CORS origin",
  );
  assert(
    response.headers.get("access-control-allow-headers")?.includes("apikey"),
    "Missing CORS headers",
  );
  await response.body?.cancel();
});
