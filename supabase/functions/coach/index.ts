import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// The AI coach. The app sends {system, messages}; this function adds the Anthropic API key
// (kept as a secret here, never in the app) and returns {text}.
// Only signed-in users may call it. Deploy with:  supabase functions deploy coach
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
const MODEL = Deno.env.get("COACH_MODEL") || "claude-sonnet-4-5";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  // Who is calling? Verify the user's JWT with the anon client.
  const auth = req.headers.get("Authorization") || "";
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error: authErr } = await sb.auth.getUser();
  if (authErr || !user) return json({ error: "Sign in to use the coach." }, 401);

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "The coach isn't set up yet: add the ANTHROPIC_API_KEY secret to this function." }, 500);

  let body: { system?: string; messages?: { role: string; content: string }[] };
  try { body = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  const messages = (body.messages || []).filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-20).map((m) => ({ role: m.role, content: m.content.slice(0, 8000) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "Nothing to answer" }, 400);

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 700, system: String(body.system || "").slice(0, 20000), messages }),
  });
  if (!r.ok) {
    const t = await r.text();
    return json({ error: r.status === 429 ? "Too many questions in a short time. Wait a minute and ask again." : `Coach error (${r.status})`, detail: t.slice(0, 300) }, 502);
  }
  const out = await r.json();
  const text = (out.content || []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("\n").trim();
  return json({ text });
});
