# Clear Reps: notes for Claude

Danny's personal workout app. He trains about 3x a week (often with a personal trainer who picks
exercises on the day), is getting back into the gym after time off, and finds workouts confusing.
The app's job is **clarity and calm**: one thing at a time, plain words, explain every change.

Live at https://dannyarafa-a11y.github.io/clear-reps/ (GitHub Pages from `main`, root). Installed
on his iPhone as a home-screen app. He usually tests on the phone, often mid-workout.

## Ground rules
- **Design:** light, minimal, positive. White cards on soft grey, one blue accent `#3366FF`,
  Outfit (display) + Manrope (text), big tap targets. No dark mode, no orange, nothing text-heavy.
- **No build step.** Plain HTML/CSS/JS, served as static files. Keep it that way.
- **Bump `VERSION` in `sw.js` on every change**, or phones keep the old copy.
  The app checks for updates on open and switches over, except during an active workout.
- **Never lose a workout in progress.** `S.active` is saved after every set (`saveActiveSoon`)
  and restored on boot.
- **Ask Danny before anything that costs money** (e.g. an AI API key). He decided against the
  in-app AI coach; the monthly summary is exported to an AI instead.
- Test in a phone-sized browser (Playwright, `devices['iPhone 13']`) before pushing.

## Files
- `index.html`: shell; registers the service worker.
- `js/smart.js`: loaded **before** `app.js`; only defines functions (may use app.js globals at
  call time). Rolling muscle load, plan adjustments, debriefs, swap, at-home helpers' consumers,
  My own workout, soreness check-in, learning layer, monthly AI summary, timer chime, iOS fixes.
- `js/app.js`: everything else. Data (`MUSCLES`, `EX` exercises, `DAYS` A/B/C, `HOME_DAYS`,
  `STRETCHES`), state `S`, views (`viewToday`, `viewLearn` = Body tab, `viewProgress`), the session
  flow (warm-up → one exercise per screen → stretch → finish), and one delegated click handler
  keyed on `data-act`.
- `js/store.js`: local-first IndexedDB store with optional Supabase sync (`documents` table,
  one row per doc, RLS by `auth.uid()`). Email + password sign-in.
- `js/body.js`: muscle-map SVG paths (MIT, @mjcdev/react-body-highlighter). `bodyFig(levels)`
  draws front/back; a level is a number 0–1 (blue intensity), `"plan"` (grey) or `{col,rank}`.
- `data/library.json`: 820 exercises from Free Exercise DB (public domain); photos in
  `img/<id>/0.webp` (start) and `1.webp` (finish).
- `supabase/`: schema, migrations, `health-sync` Edge Function (Apple Health via an iPhone
  Shortcut), unused `coach` function.

## How the "smart" parts work (all plain rules, no AI)
- **Progression:** each set starts from the matching set last time (`plannedSets`); weight goes
  up when every set hits the top of the rep range (`targetFor`). Easy/Good/Tough adjusts the
  next set live.
- **Phases** by week since start: ease in (2 sets, 3–4 RIR) → build (3 sets, 1–2 RIR), every
  5th week lighter (`phaseFor`).
- **7-day body map** (`muscleStatus`): sets fade linearly over 7 days; colour blue → green
  (right amount for the phase) → orange → red. Used on the Body tab only.
- **In-workout map** (`sessionGrad`): same colour scale, judged per session (2–5 sets per
  muscle easing in, 3–8 building). Plan previews stay plain blue.
- **Plan adjustments** (`planAdjust`): ±1 set per exercise from the 7-day status and soreness.
- **Learning layer** (`learnAdjust`): ease back after 10+ days off; trim after "brutal"
  sessions; lighten exercises that keep feeling Tough; break stalls (3 flat sessions);
  low readiness from Apple Health. Every change is explained in the pre-workout brief.
- **Soreness check-in:** saved on the workout as `sore:{muscle:1|2}`; sore = recovering 48h.
- **Monthly summary** (`monthReport`): Markdown written for Claude/ChatGPT to analyse.
- **Gym | Home switch:** `S.settings.where`; at home the A/B/C days use `HOME_DAYS`.
- **My own workout:** `dayId:"free"`, starts empty, `plan` = muscle groups picked on Home.

## Data and accounts
- Supabase project `clear-reps` (ref `vjppymebgysvxnrqunua`, eu-central-1), in Danny's own
  Supabase account. `js/config.js` holds the public anon key (safe to commit).
- The Apple Health sync key lives only in his iPhone Shortcut. Never commit it.
- Known open items: Shortcut steps double-count (set Start Date "is today", Group by Day);
  sleep arrives empty (check Zepp → Apple Health → Sleep).

## Working on this from another Claude account
- Connect GitHub (claude.ai → Settings → Connectors) with the same GitHub user, `dannyarafa-a11y`,
  and make sure the Claude GitHub app has access to `clear-reps`. Then start a Claude Code session
  on this repo. Commit straight to `main`; GitHub Pages redeploys in about a minute.
- Supabase is only needed for database work: connect the Supabase connector with Danny's own
  Supabase login (project `clear-reps`).
- Only one session should edit at a time. Pull before starting.
- Commit author: Danny Arafa. Danny reads replies on his phone: keep them short, no file paths.

## Where we left off (Nov 2026)
Done recently: Gym | Home switch, My own workout, rolling 7-day map, per-session map, soreness
check-in, learning layer, monthly AI summary, stretch fixes (single-person photos, coverage map,
video links), coach tab removed.

Open ideas Danny hasn't picked yet:
- Supersets: carry pairings into "Do again" / "Save as a workout", show them in history,
  maybe an optional faster A/B/C with built-in pairs.
- Apple Health sync fixes on the iPhone Shortcut (steps double-count, empty sleep).
- Sign-up lock: after Danny signs in for the first time, turn off "Allow new users to sign up" in
  Supabase → Authentication → Sign In / Providers (check whether he has signed in yet).
- A real standing quad stretch photo is missing from the library (side-lying is used instead).
