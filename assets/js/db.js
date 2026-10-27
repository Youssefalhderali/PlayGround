import seed from "./data/index.js";
import { uid, storageGet, storageSet, downloadFile } from "./utils.js";

const DB_KEY = "brxvih.db.v1";
const SESSION_KEY = "brxvih.admin.session";
const PASS_KEY = "brxvih.passhash.v1";
const DEFAULT_PASSCODE = "brxvih2026";
const SESSION_MS = 8 * 60 * 60 * 1000;

export const COLLECTIONS = [
  "phones", "prices", "parts", "suppliers", "faults",
  "tools", "firmware", "articles", "requests"
];

let db = null;

function clone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function createSeedDB() {
  const collections = {};
  COLLECTIONS.forEach((name) => {
    collections[name] = clone(seed[name] || []);
  });
  return {
    version: seed.meta.version,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    collections,
    tombstones: Object.fromEntries(COLLECTIONS.map((name) => [name, []])),
    settings: {
      siteConfig: clone(seed.siteConfig),
      exchange: clone(seed.exchange),
      cities: clone(seed.cities),
      qualities: clone(seed.qualities),
      requestStatuses: clone(seed.requestStatuses)
    }
  };
}

function mergeById(seedItems, savedItems, deleted = []) {
  const savedMap = new Map(savedItems.map((item) => [item.id, item]));
  const deletedSet = new Set(deleted);
  const result = [];
  seedItems.forEach((item) => {
    if (deletedSet.has(item.id)) return;
    result.push(savedMap.has(item.id) ? savedMap.get(item.id) : item);
    savedMap.delete(item.id);
  });
  savedMap.forEach((item, id) => {
    if (!deletedSet.has(id)) result.push(item);
  });
  return result;
}

function persist() {
  if (!db) return false;
  db.updatedAt = new Date().toISOString();
  const ok = storageSet(DB_KEY, db);
  if (!ok) {
    window.dispatchEvent(new CustomEvent("brxvih:storage-error"));
  }
  return ok;
}

function emit(collection, action, id) {
  window.dispatchEvent(new CustomEvent("brxvih:data", {
    detail: { collection, action, id }
  }));
}

export function loadDB() {
  if (db) return db;
  const base = createSeedDB();
  const saved = storageGet(DB_KEY);
  if (!saved || !saved.collections) {
    db = base;
    persist();
    return db;
  }
  COLLECTIONS.forEach((name) => {
    const deleted = Array.isArray(saved.tombstones?.[name]) ? saved.tombstones[name] : [];
    db = db || {};
    base.collections[name] = mergeById(
      base.collections[name],
      Array.isArray(saved.collections[name]) ? saved.collections[name] : [],
      deleted
    );
    base.tombstones[name] = deleted;
  });
  base.settings = {
    ...base.settings,
    ...(saved.settings || {}),
    siteConfig: { ...base.settings.siteConfig, ...(saved.settings?.siteConfig || {}) },
    exchange: { ...base.settings.exchange, ...(saved.settings?.exchange || {}) }
  };
  base.createdAt = saved.createdAt || base.createdAt;
  base.updatedAt = saved.updatedAt || base.updatedAt;
  db = base;
  persist();
  return db;
}

export function getDB() {
  return loadDB();
}

export function list(collection) {
  const data = loadDB();
  if (!COLLECTIONS.includes(collection)) return [];
  return data.collections[collection] || [];
}

export function get(collection, id) {
  return list(collection).find((item) => item.id === id) || null;
}

export function upsert(collection, record) {
  const data = loadDB();
  if (!COLLECTIONS.includes(collection)) return null;
  const items = data.collections[collection];
  const next = { ...record };
  if (!next.id) next.id = uid(collection.slice(0, -1));
  next.updatedAt = new Date().toISOString();
  const index = items.findIndex((item) => item.id === next.id);
  if (index >= 0) items[index] = next;
  else items.push(next);
  data.tombstones[collection] = (data.tombstones[collection] || []).filter((id) => id !== next.id);
  persist();
  emit(collection, index >= 0 ? "update" : "create", next.id);
  return next;
}

export function remove(collection, id) {
  const data = loadDB();
  if (!COLLECTIONS.includes(collection)) return false;
  data.collections[collection] = data.collections[collection].filter((item) => item.id !== id);
  data.tombstones[collection] = [...new Set([...(data.tombstones[collection] || []), id])];
  persist();
  emit(collection, "delete", id);
  return true;
}

export function replaceCollection(collection, items) {
  const data = loadDB();
  if (!COLLECTIONS.includes(collection) || !Array.isArray(items)) return false;
  const seen = new Set();
  data.collections[collection] = items
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const next = { ...item };
      if (!next.id || seen.has(next.id)) next.id = uid(collection.slice(0, -1));
      seen.add(next.id);
      return next;
    });
  data.tombstones[collection] = [];
  persist();
  emit(collection, "replace", null);
  return true;
}

export function getSettings() {
  return loadDB().settings;
}

export function saveSettings(patch = {}) {
  const data = loadDB();
  data.settings = {
    ...data.settings,
    ...patch,
    siteConfig: { ...data.settings.siteConfig, ...(patch.siteConfig || {}) },
    exchange: { ...data.settings.exchange, ...(patch.exchange || {}) }
  };
  persist();
  emit("settings", "update", null);
  return data.settings;
}

export function setExchangeRates(rates) {
  return saveSettings({
    exchange: {
      ...getSettings().exchange,
      rates: { ...getSettings().exchange.rates, ...rates },
      updatedAt: new Date().toISOString().slice(0, 10)
    }
  });
}

export function convertPrice(amount, from, to) {
  const rates = getSettings().exchange?.rates || {};
  const value = Number(amount);
  const fromRate = Number(rates[from]);
  const toRate = Number(rates[to]);
  if (!Number.isFinite(value) || !fromRate || !toRate) return null;
  return (value / fromRate) * toRate;
}

export function addRequest(payload) {
  const record = {
    id: uid("req"),
    name: payload.name,
    phone: payload.phone,
    brand: payload.brand || "",
    model: payload.model || "",
    fault: payload.fault,
    city: payload.city || "",
    notes: payload.notes || "",
    status: "new",
    source: "website",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  upsert("requests", record);
  return record;
}

export function updateRequestStatus(id, status) {
  const request = get("requests", id);
  if (!request) return null;
  return upsert("requests", { ...request, status });
}

export function resetAll() {
  try {
    localStorage.removeItem(DB_KEY);
  } catch {
    return false;
  }
  db = null;
  loadDB();
  emit("all", "reset", null);
  return true;
}

export function exportAll() {
  const data = loadDB();
  return {
    app: "BRXVIH",
    schema: 1,
    version: data.version,
    exportedAt: new Date().toISOString(),
    collections: clone(data.collections),
    tombstones: clone(data.tombstones),
    settings: clone(data.settings)
  };
}

export function importAll(payload) {
  if (!payload || typeof payload !== "object" || !payload.collections) return false;
  const next = createSeedDB();
  COLLECTIONS.forEach((name) => {
    if (Array.isArray(payload.collections[name])) {
      next.collections[name] = payload.collections[name];
    }
  });
  next.settings = {
    ...next.settings,
    ...(payload.settings || {}),
    siteConfig: { ...next.settings.siteConfig, ...(payload.settings?.siteConfig || {}) },
    exchange: { ...next.settings.exchange, ...(payload.settings?.exchange || {}) }
  };
  next.tombstones = Object.fromEntries(COLLECTIONS.map((name) => [
    name, Array.isArray(payload.tombstones?.[name]) ? payload.tombstones[name] : []
  ]));
  db = next;
  persist();
  emit("all", "import", null);
  return true;
}

function csvValue(value) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportCsv(collection) {
  const items = list(collection);
  if (!items.length) return false;
  const columns = [...new Set(items.flatMap((item) => Object.keys(item)))];
  const rows = [
    columns.map(csvValue).join(","),
    ...items.map((item) => columns.map((column) => csvValue(item[column])).join(","))
  ];
  downloadFile(`brxvih-${collection}.csv`, rows.join("\n"), "text/csv;charset=utf-8");
  return true;
}

export function exportBackupFile() {
  downloadFile(`brxvih-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(exportAll(), null, 2));
}

export function counts() {
  return Object.fromEntries(COLLECTIONS.map((name) => [name, list(name).length]));
}

async function sha256(text) {
  const input = new TextEncoder().encode(String(text));
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", input);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  let hash = 2166136261;
  for (const byte of input) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return `fallback-${(hash >>> 0).toString(16)}`;
}

export async function login(passcode) {
  const expected = localStorage.getItem(PASS_KEY) || await sha256(DEFAULT_PASSCODE);
  const actual = await sha256(String(passcode || "").trim());
  if (actual !== expected) return false;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expires: Date.now() + SESSION_MS }));
  } catch {
    return false;
  }
  return true;
}

export function isAdmin() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    if (session && Number(session.expires) > Date.now()) return true;
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    return false;
  }
  return false;
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    return;
  }
}

export async function changePasscode(current, next) {
  if (!isAdmin()) return { ok: false, reason: "auth" };
  if (!(await login(current))) return { ok: false, reason: "current" };
  if (String(next || "").length < 8) return { ok: false, reason: "length" };
  localStorage.setItem(PASS_KEY, await sha256(next));
  return { ok: true };
}

export const DEFAULT_ADMIN_CODE = DEFAULT_PASSCODE;
