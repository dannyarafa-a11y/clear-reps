import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// Receives Apple Health data from an iPhone Shortcut. Auth: x-sync-key header, checked against hashed keys.
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const TZ_OFFSET_H = 2; // Cairo; used only when a timestamp arrives without its own offset

async function sha256(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
const items = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : String(v ?? "").split(/\n+/)).map((s) => s.trim()).filter(Boolean);
// Shortcuts often send numbers as text, sometimes several values on separate lines, with units or commas.
function num(v: unknown, mode: "avg" | "sum" = "avg"): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return isFinite(v) ? v : null;
  const parts = items(v).map((p) => parseFloat(p.replace(/,/g, ".").replace(/[^0-9.\-]/g, ""))).filter((n) => isFinite(n));
  if (!parts.length) return null;
  const s = parts.reduce((a, b) => a + b, 0);
  return Math.round((mode === "sum" ? s : s / parts.length) * 100) / 100;
}
// Sleep can arrive as hours, as durations with units ("7 hr 3 min", "3600 sec"), or as raw seconds/minutes, one per line.
function sleepHours(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return v > 600 ? v / 3600 : v > 24 ? v / 60 : v;
  let total = 0, any = false;
  for (const it of items(v)) {
    const t = it.toLowerCase().replace(/,/g, ".");
    const h = t.match(/([\d.]+)\s*(h|hr|hrs|hour|hours)\b/), m = t.match(/([\d.]+)\s*(m|min|mins|minute|minutes)\b/), s = t.match(/([\d.]+)\s*(s|sec|secs|second|seconds)\b/);
    const hms = t.match(/^\s*(\d+):(\d{2})(?::(\d{2}))?\s*$/);
    if (h || m || s) { total += (h ? +h[1] : 0) + (m ? +m[1] / 60 : 0) + (s ? +s[1] / 3600 : 0); any = true; continue; }
    if (hms) { total += +hms[1] + +hms[2] / 60 + (hms[3] ? +hms[3] / 3600 : 0); any = true; continue; }
    const n = parseFloat(t.replace(/[^0-9.\-]/g, ""));
    if (isFinite(n)) { total += n > 600 ? n / 3600 : n > 24 ? n / 60 : n; any = true; }
  }
  return any ? Math.round(total * 100) / 100 : null;
}
const MON: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
// Parse the many date formats Shortcuts can produce; dates without an offset are treated as Cairo local time.
function parseTs(raw: string): Date | null {
  const s = raw.trim().replace(/ | /g, " ");
  if (/^\d{4}-\d{2}-\d{2}T.*(Z|[+-]\d{2}:?\d{2})$/.test(s)) { const d = new Date(s); return isNaN(+d) ? null : d; }
  let y = 0, mo = -1, d = 0, hh = 0, mm = 0, ss = 0;
  let m = s.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) { y = +m[1]; mo = +m[2] - 1; d = +m[3]; hh = +m[4]; mm = +m[5]; ss = +(m[6] || 0); }
  else {
    m = s.match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})(?:,|\s+at)?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])?/);
    if (m) { mo = MON[m[1].toLowerCase()] ?? -1; d = +m[2]; y = +m[3]; hh = +m[4]; mm = +m[5]; ss = +(m[6] || 0); if (m[7]) { const pm = /p/i.test(m[7]); if (pm && hh < 12) hh += 12; if (!pm && hh === 12) hh = 0; } }
    else {
      m = s.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?\s+(\d{4})(?:,|\s+at)?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])?/);
      if (m) { d = +m[1]; mo = MON[m[2].toLowerCase()] ?? -1; y = +m[3]; hh = +m[4]; mm = +m[5]; ss = +(m[6] || 0); if (m[7]) { const pm = /p/i.test(m[7]); if (pm && hh < 12) hh += 12; if (!pm && hh === 12) hh = 0; } }
      else {
        m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])?/);
        if (m) { mo = +m[1] - 1; d = +m[2]; y = +m[3] < 100 ? 2000 + +m[3] : +m[3]; hh = +m[4]; mm = +m[5]; ss = +(m[6] || 0); if (m[7]) { const pm = /p/i.test(m[7]); if (pm && hh < 12) hh += 12; if (!pm && hh === 12) hh = 0; } if (!m[7] && mo > 11) { const t = mo; mo = d - 1; d = t + 1; } }
      }
    }
  }
  if (mo < 0 || !y) return null;
  const t = Date.UTC(y, mo, d, hh, mm, ss) - TZ_OFFSET_H * 3600e3;
  return isNaN(t) ? null : new Date(t);
}
function day(v: unknown): string | null {
  if (!v) return new Date(Date.now() + TZ_OFFSET_H * 3600e3).toISOString().slice(0, 10);
  const m = String(v).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);
  const key = req.headers.get("x-sync-key") || "";
  if (!key) return json({ error: "Missing x-sync-key header" }, 401);
  const { data: k } = await db.from("ingest_keys").select("key_hash").eq("key_hash", await sha256(key)).maybeSingle();
  if (!k) return json({ error: "Wrong sync key" }, 401);
  const text = await req.text();
  await db.from("health_raw").insert({ body: text.slice(0, 50000) });
  let body: any;
  try { body = JSON.parse(text); } catch { return json({ error: "Body must be JSON" }, 400); }

  // Heart-rate readings with their times: matched later to workouts logged in the app.
  let hrSaved = 0;
  const bpms = items(body.hrbpm ?? body.hr_bpm ?? body.hrvalues), times = items(body.hrtime ?? body.hr_time ?? body.hrtimes);
  if (bpms.length && bpms.length === times.length) {
    const rows: { ts: string; bpm: number }[] = [];
    for (let i = 0; i < bpms.length; i++) {
      const b = parseFloat(bpms[i].replace(/,/g, ".").replace(/[^0-9.]/g, "")), t = parseTs(times[i]);
      if (t && isFinite(b) && b > 25 && b < 240) rows.push({ ts: t.toISOString(), bpm: b });
    }
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await db.from("health_hr").upsert(rows.slice(i, i + 500), { onConflict: "ts" });
      if (!error) hrSaved += Math.min(500, rows.length - i);
    }
  }
  const hrAvg = bpms.length ? num(bpms) : null;

  const days = Array.isArray(body.days) ? body.days : [body];
  const rows = days.map((d: any) => ({
    day: day(d.date ?? d.day),
    steps: num(d.steps, "sum") === null ? null : Math.round(num(d.steps, "sum")!),
    resting_hr: num(d.resting_hr ?? d.rhr ?? d.resting),
    avg_hr: num(d.avg_hr ?? d.hr) ?? hrAvg,
    hrv_ms: num(d.hrv_ms ?? d.hrv),
    sleep_hours: sleepHours(d.sleep_hours ?? d.sleep),
    active_kcal: num(d.active_kcal ?? d.kcal, "sum"),
    weight_kg: num(d.weight_kg ?? d.weight),
    updated_at: new Date().toISOString(),
  })).filter((r: any) => r.day);
  // Only overwrite fields that were sent, so partial syncs don't erase data.
  const got: Record<string, unknown> = {};
  for (const r of rows) {
    const clean = Object.fromEntries(Object.entries(r).filter(([, v]) => v !== null));
    Object.assign(got, clean);
    const { error } = await db.from("health_daily").upsert(clean, { onConflict: "day" });
    if (error) return json({ error: error.message }, 500);
  }
  return json({ ok: true, saved: got, heartRateReadings: hrSaved, heartRateSent: bpms.length });
});
