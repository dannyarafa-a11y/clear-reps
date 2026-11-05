# Clear Reps

A calm, one-thing-at-a-time workout app. Static files, no build step: open `index.html` on any
web server and it runs. Installed on an iPhone it works offline at the gym; everything is saved on
the phone, and (optionally) backed up and synced through Supabase.

## What's in here

```
index.html              the shell
css/app.css             styles (fonts are self-hosted in fonts/)
js/app.js               the app
js/store.js             local-first storage (IndexedDB) + optional Supabase sync
js/body.js              muscle-map SVG paths (MIT, @mjcdev/react-body-highlighter)
js/config.js            ← the one file you edit: Supabase URL + anon key
data/library.json       820 exercises (Free Exercise DB, public domain)
data/seed.json          your exported data; imported automatically on first launch
img/<exercise>/0.webp   start / finish photos, loaded on demand and cached offline
sw.js, manifest.webmanifest, icons/   PWA bits
supabase/               SQL + Edge Functions for the optional cloud features
```

## 1. Publish on GitHub Pages (free, loads fine in Egypt)

1. Create a new repository on GitHub, e.g. `clear-reps` (public or private both work with Pages).
2. Upload everything in this folder to the repository root (drag the whole folder into the
   GitHub web upload, or `git init && git add . && git commit -m "Clear Reps" && git push`).
3. Repository → Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. After a minute the app is live at `https://<your-user>.github.io/clear-reps/`.

Every later change: edit the files, push, and bump `VERSION` in `sw.js` so phones fetch the new
files (the app is cached for offline use, so without the bump an installed app may keep the old
version for a while).

## 2. Add it to your iPhone home screen

Open the URL in **Safari** → Share → **Add to Home Screen**. It launches full screen, keeps your
data in the app's own storage, and works with no signal (the exercise library and any photos you
have already seen are cached; new photos need a connection the first time).

Your data is on the phone until you sign in (step 3). Progress → **Export my data** downloads a
JSON backup you can import on any device.

## 3. Optional: sign-in, backup & sync (Supabase)

Your existing project `clear-reps` (ref `vjppymebgysvxnrqunua`) already holds the Apple Health
tables. Add the app tables and turn on sign-in:

1. **SQL** — Supabase → SQL editor → paste `supabase/migrations/001_app_tables.sql` → Run.
   It creates `documents` (your synced workouts/settings/check-ins, RLS so only you can read
   them), a private `photos` bucket, and a `health_bundle()` function the app uses to read
   your Apple Health data.
2. **Auth** — Authentication → Providers → Email: keep **Email** enabled. Under
   Authentication → URL configuration add your GitHub Pages URL to **Site URL** and
   **Redirect URLs** (e.g. `https://<your-user>.github.io/clear-reps/`).
3. **Code sign-in (recommended for the home-screen app)** — magic links open in Safari, not in
   the installed app, so the app also accepts a 6-digit code. Authentication → Email Templates →
   *Magic Link*: add the line `Your code: {{ .Token }}` anywhere in the template. Now every
   sign-in email carries both the link and the code.
4. **Key** — Project settings → API keys → copy the **anon / publishable** key into
   `js/config.js`. (It is designed to be public; the tables are protected by RLS.) Push.
5. In the app: Progress → **Backup & sync** → enter your email → type the code from the email.
   From then on every change syncs both ways whenever you're online. The same sign-in on a
   second device pulls everything down.

## 4. Optional: the AI coach (costs money: Anthropic API usage)

The coach runs as an Edge Function so the API key never ships in the app.

```sh
npm i -g supabase            # once
supabase login
supabase link --project-ref vjppymebgysvxnrqunua
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...        # from console.anthropic.com
supabase functions deploy coach
```

Only signed-in users can call it. Each answer is one short request (≈ a fraction of a cent).
To change the model, set a secret `COACH_MODEL`.

## 5. Apple Health sync (unchanged)

The `health-sync` function is the same one you already deployed; its source is in
`supabase/functions/health-sync/` for reference. The iPhone Shortcut keeps POSTing to
`https://vjppymebgysvxnrqunua.supabase.co/functions/v1/health-sync` with your `x-sync-key`.

Two known Shortcut fixes from the handoff:
- **Steps double-counted**: in the Steps *Find Health Samples* step set *Start Date* = "is today"
  and *Group by* = "Day".
- **Sleep empty**: Zepp → Profile → Apple Health → make sure Sleep is on, and check the Health app
  actually shows sleep.

Health data appears on Home (readiness strip) and in Progress once you're signed in (step 3).

## What changed from the artifact version

- **Standalone PWA**: no claude.ai runtime. Local-first storage, optional Supabase sync, installable, offline.
- **Exercise screen reordered**: the set logger is first; photos, muscle map and cues fold into a
  *How to do it* card (open by default the first time you do an exercise).
- **Rest timer** is a slim bar at the top: you can log, edit and scroll while it runs. Hold timers
  for stretches use the same bar.
- **Faster logging**: tap the ☰ bar to see today's exercises, jump anywhere, reorder (↑ ↓), remove
  (×) or pair as a **superset** (⇄): sets alternate with no rest, rest after each round. Recent
  weights are one tap away; dumbbell weights show "each hand" and the total.
- **Live muscle map** in the exercise list and on the finish screen: trained muscles shade darker
  with more sets, planned ones show grey.
- **Smarter cool-down**: stretches are chosen for the muscles you actually trained, with photos
  and 40-second hold timers.
- **Search understands trainer names**: "squat to overhead press", "shoulder taps", "side raises",
  "RDLs", "skull crushers", "pull downs"… plus plurals and spacing differences.
- **Fonts self-hosted**, photos are plain WebP files instead of 20 MB of JSON, no more full-screen
  re-renders when you log a set (no flashes, no scroll jumps).
- Fixed the stray "Â·" / "â€“" characters (missing charset).
