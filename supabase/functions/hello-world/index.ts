import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: "none" }, async (request) => {
    if (request.method !== "POST") {
      return Response.json(
        { error: "Use POST with a JSON body." },
        { status: 405, headers: { Allow: "POST, OPTIONS" } },
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    if (
      typeof body?.name !== "string" ||
      !body.name.trim() ||
      body.name.trim().length > 100
    ) {
      return Response.json(
        { error: "Enter a name between 1 and 100 characters." },
        { status: 400 },
      );
    }

    return Response.json({ message: `Hello ${body.name.trim()}!` });
  }),
};
