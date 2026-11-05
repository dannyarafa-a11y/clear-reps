/* Clear Reps · local-first store.
   Everything lives in IndexedDB on the phone, so the app works at the gym with no signal.
   When Supabase is configured (js/config.js) and you are signed in, every change is queued
   and pushed to the `documents` table, and remote changes are pulled back. Last write wins. */
const Store = (() => {
  const DB_NAME = "clear-reps", DB_VER = 1;
  let dbp = null, sb = null, session = null, syncT = null, syncing = false, pushAgain = false;
  const subs = { workouts: new Set(), checkins: new Set(), settings: new Set(), auth: new Set(), sync: new Set() };
  const state = { configured: false, online: navigator.onLine, lastSync: null, pending: 0, error: "" };

  /* ---------- IndexedDB ---------- */
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, DB_VER);
      r.onupgradeneeded = () => {
        const d = r.result;
        if (!d.objectStoreNames.contains("docs")) d.createObjectStore("docs", { keyPath: "key" }).createIndex("coll", "coll");
        if (!d.objectStoreNames.contains("outbox")) d.createObjectStore("outbox", { keyPath: "key" });
        if (!d.objectStoreNames.contains("meta")) d.createObjectStore("meta", { keyPath: "key" });
        if (!d.objectStoreNames.contains("blobs")) d.createObjectStore("blobs", { keyPath: "id" });
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  const tx = async (names, mode, fn) => {
    const d = await open();
    return new Promise((res, rej) => {
      const t = d.transaction(names, mode), stores = [].concat(names).map(n => t.objectStore(n));
      let out; try { out = fn(...stores); } catch (e) { rej(e); return; }
      t.oncomplete = () => res(out && out.__req ? out.__req.result : out);
      t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    });
  };
  const req = r => ({ __req: r });
  const metaGet = async k => (await tx("meta", "readonly", s => req(s.get(k))))?.value;
  const metaSet = (k, value) => tx("meta", "readwrite", s => { s.put({ key: k, value }); });

  async function listDocs(coll) {
    const rows = await tx("docs", "readonly", s => req(s.index("coll").getAll(coll)));
    return rows.filter(r => !r.deleted).map(r => ({ id: r.id, ...r.data }));
  }
  async function getDoc(coll, id) {
    const r = await tx("docs", "readonly", s => req(s.get(coll + "/" + id)));
    return r && !r.deleted ? { id: r.id, ...r.data } : null;
  }
  async function writeLocal(coll, id, data, deleted, { queue = true, updated_at } = {}) {
    const row = { key: coll + "/" + id, coll, id, data: deleted ? {} : JSON.parse(JSON.stringify(data)), deleted: !!deleted, updated_at: updated_at || new Date().toISOString() };
    await tx(["docs", "outbox"], "readwrite", (d, o) => { d.put(row); if (queue) o.put({ key: row.key }); });
    if (queue) { state.pending++; emit("sync"); scheduleSync(1500); }
    notify(coll);
  }
  async function notify(coll) {
    const cbs = subs[coll]; if (!cbs || !cbs.size) return;
    const v = coll === "settings" ? await getDoc("settings", "main") : await listDocs(coll);
    cbs.forEach(cb => { try { cb(v); } catch (e) { console.error(e); } });
  }
  const emit = k => subs[k]?.forEach(cb => { try { cb(k === "auth" ? session : state); } catch (e) {} });

  /* ---------- public data API ---------- */
  const api = {
    state,
    async ready() { await open(); const n = await tx("outbox", "readonly", s => req(s.count())); state.pending = n || 0; },
    list: listDocs, get: getDoc,
    put: (coll, id, data) => writeLocal(coll, id, data, false),
    del: (coll, id) => writeLocal(coll, id, null, true),
    getSettings: () => getDoc("settings", "main"),
    putSettings: data => writeLocal("settings", "main", data, false),
    subscribe(coll, cb) { subs[coll].add(cb); if (coll === "auth") cb(session); else if (coll === "sync") cb(state); else notify(coll); return () => subs[coll].delete(cb); },
    /* progress photos: kept on the phone, uploaded to Storage when signed in */
    async putBlob(id, blob) {
      await tx(["blobs", "outbox"], "readwrite", (b, o) => { b.put({ id, blob, type: blob.type }); o.put({ key: "blob:" + id }); });
      state.pending++; emit("sync"); scheduleSync(1500);
    },
    async blobUrl(id) {
      const r = await tx("blobs", "readonly", s => req(s.get(id)));
      if (r?.blob) return URL.createObjectURL(r.blob);
      if (sb && session) {
        try { const { data } = await sb.storage.from("photos").download(session.user.id + "/" + id); if (data) { await tx("blobs", "readwrite", s => { s.put({ id, blob: data, type: data.type }); }); return URL.createObjectURL(data); } } catch (e) {}
      }
      return null;
    },
    /* first run: load the bundled export once */
    async seedIfEmpty(url) {
      if (await metaGet("seeded")) return false;
      const all = await tx("docs", "readonly", s => req(s.count()));
      if (all > 0) { await metaSet("seeded", true); return false; }
      try {
        const r = await fetch(url, { cache: "no-store" }); if (!r.ok) return false;
        const seed = await r.json();
        if (seed.settings) await writeLocal("settings", "main", seed.settings, false);
        for (const w of seed.workouts || []) { const { id, ...body } = w; await writeLocal("workouts", id, body, false); }
        for (const c of seed.checkins || []) { const { id, ...body } = c; await writeLocal("checkins", id, body, false); }
        await metaSet("seeded", true); return true;
      } catch (e) { console.warn("seed failed", e); return false; }
    },
    async exportAll() {
      return { exportedAt: new Date().toISOString(), settings: await getDoc("settings", "main"), workouts: await listDocs("workouts"), checkins: await listDocs("checkins") };
    },
    async importAll(obj) {
      if (obj.settings) { const { id, ...s } = obj.settings; await writeLocal("settings", "main", s, false); }
      for (const w of obj.workouts || []) { const { id, ...body } = w; await writeLocal("workouts", id || Math.random().toString(36).slice(2), body, false); }
      for (const c of obj.checkins || []) { const { id, ...body } = c; await writeLocal("checkins", id || Math.random().toString(36).slice(2), body, false); }
    },

    /* ---------- Supabase ---------- */
    configure(cfg) {
      if (!cfg?.supabaseUrl || !cfg?.supabaseAnonKey || !window.supabase) return false;
      try {
        sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
        state.configured = true;
        sb.auth.getSession().then(({ data }) => { session = data.session; emit("auth"); if (session) scheduleSync(300); });
        sb.auth.onAuthStateChange((_e, s) => { const was = !!session; session = s; emit("auth"); if (s && !was) scheduleSync(300); });
        return true;
      } catch (e) { console.warn(e); return false; }
    },
    get client() { return sb; },
    get session() { return session; },
    async sendCode(email) {
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href.split("#")[0].split("?")[0], shouldCreateUser: true } });
      if (error) throw error;
    },
    async verifyCode(email, token) {
      const { error } = await sb.auth.verifyOtp({ email, token: String(token).replace(/\D/g, ""), type: "email" });
      if (error) throw error;
    },
    async signInPassword(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async signUpPassword(email, password) {
      const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.href.split("#")[0].split("?")[0] } });
      if (error) throw error;
      return !!data.session;
    },
    async signOut() { try { await sb.auth.signOut(); } catch (e) {} session = null; emit("auth"); },
    syncNow: () => runSync(true),
    async rpc(name, args) { if (!sb || !session) throw Object.assign(new Error("not signed in"), { code: "not_signed_in" }); const { data, error } = await sb.rpc(name, args || {}); if (error) throw error; return data; },
    async fn(name, body) { if (!sb || !session) throw Object.assign(new Error("not signed in"), { code: "not_signed_in" }); const { data, error } = await sb.functions.invoke(name, { body }); if (error) throw error; return data; }
  };

  /* ---------- sync loop ---------- */
  function scheduleSync(ms) { clearTimeout(syncT); syncT = setTimeout(() => runSync(false), ms); }
  async function runSync(force) {
    if (!sb || !session) return;
    if (!navigator.onLine) { state.error = "offline"; emit("sync"); return; }
    if (syncing) { pushAgain = true; return; }
    syncing = true; state.error = ""; emit("sync");
    try {
      const uid = session.user.id;
      /* push */
      const keys = await tx("outbox", "readonly", s => req(s.getAllKeys()));
      for (const key of keys) {
        if (String(key).startsWith("blob:")) {
          const id = key.slice(5), r = await tx("blobs", "readonly", s => req(s.get(id)));
          if (r?.blob) { const { error } = await sb.storage.from("photos").upload(uid + "/" + id, r.blob, { upsert: true, contentType: r.type || "image/jpeg" }); if (error) throw error; }
        } else {
          const row = await tx("docs", "readonly", s => req(s.get(key)));
          if (row) { const { error } = await sb.from("documents").upsert({ user_id: uid, coll: row.coll, id: row.id, data: row.data, deleted: row.deleted, updated_at: row.updated_at }, { onConflict: "user_id,coll,id" }); if (error) throw error; }
        }
        await tx("outbox", "readwrite", s => { s.delete(key); });
        state.pending = Math.max(0, state.pending - 1); emit("sync");
      }
      /* pull */
      const since = (await metaGet("lastPull")) || "1970-01-01T00:00:00Z";
      const { data, error } = await sb.from("documents").select("coll,id,data,deleted,updated_at").gt("updated_at", since).order("updated_at", { ascending: true }).limit(2000);
      if (error) throw error;
      const touched = new Set(); let newest = since;
      for (const r of data || []) {
        const local = await tx("docs", "readonly", s => req(s.get(r.coll + "/" + r.id)));
        const queued = await tx("outbox", "readonly", s => req(s.get(r.coll + "/" + r.id)));
        if (!queued && (!local || r.updated_at > local.updated_at)) {
          await tx("docs", "readwrite", s => { s.put({ key: r.coll + "/" + r.id, coll: r.coll, id: r.id, data: r.data || {}, deleted: !!r.deleted, updated_at: r.updated_at }); });
          touched.add(r.coll);
        }
        if (r.updated_at > newest) newest = r.updated_at;
      }
      await metaSet("lastPull", newest);
      touched.forEach(c => notify(c));
      state.lastSync = new Date();
    } catch (e) { state.error = e?.message || "sync failed"; console.warn("sync", e); }
    syncing = false; emit("sync");
    if (pushAgain) { pushAgain = false; scheduleSync(500); }
  }
  window.addEventListener("online", () => { state.online = true; emit("sync"); scheduleSync(200); });
  window.addEventListener("offline", () => { state.online = false; emit("sync"); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) scheduleSync(400); });
  setInterval(() => { if (session && navigator.onLine && !document.hidden) runSync(false); }, 90000);
  return api;
})();
