/* Clear Reps service worker: the app shell and exercise library are cached on install so the app
   opens with no signal; exercise photos are cached the first time they are seen.
   Bump VERSION whenever you change the app files, so phones pick up the new version. */
const VERSION = "v2.1.0";
const SHELL = "cr-shell-" + VERSION, IMG = "cr-img-v1";
const BASE = new URL("./", self.location).pathname;
const SHELL_FILES = [
  "", "index.html", "manifest.webmanifest", "css/app.css",
  "js/config.js", "js/body.js", "js/store.js", "js/smart.js", "js/app.js", "vendor/supabase.js",
  "data/library.json", "data/seed.json",
  "fonts/outfit-latin-500-normal.woff2", "fonts/outfit-latin-600-normal.woff2", "fonts/outfit-latin-700-normal.woff2", "fonts/outfit-latin-800-normal.woff2",
  "fonts/manrope-latin-400-normal.woff2", "fonts/manrope-latin-500-normal.woff2", "fonts/manrope-latin-600-normal.woff2", "fonts/manrope-latin-700-normal.woff2",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"
].map(p => BASE + p);

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== IMG).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Supabase and other APIs go straight to the network
  if (url.pathname.startsWith(BASE + "img/")) {
    // photos: cache first, then network
    e.respondWith(caches.open(IMG).then(async c => {
      const key = url.origin + url.pathname;
      const hit = await c.match(key); if (hit) return hit;
      try { const res = await fetch(key); if (res.ok) c.put(key, res.clone()); return res; }
      catch (err) { return new Response("", { status: 404 }); }
    }));
    return;
  }
  // app shell: network first (so updates arrive), falling back to cache when offline
  e.respondWith((async () => {
    const c = await caches.open(SHELL);
    try {
      const res = await fetch(req);
      if (res.ok && (url.pathname.startsWith(BASE))) c.put(req, res.clone());
      return res;
    } catch (err) {
      const hit = await c.match(req) || (req.mode === "navigate" ? await c.match(BASE + "index.html") || await c.match(BASE) : null);
      return hit || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
    }
  })());
});
