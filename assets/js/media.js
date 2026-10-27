import { fileToDataUrl, uid } from "./utils.js";

const DB_NAME = "brxvih-media";
const STORE = "files";
const FALLBACK_KEY = "brxvih.media.fallback";
let dbPromise = null;

function openDB() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB unavailable"));
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE)) {
          database.createObjectStore(STORE, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

function fallbackList() {
  try {
    return JSON.parse(localStorage.getItem(FALLBACK_KEY) || "[]");
  } catch {
    return [];
  }
}

function fallbackSave(records) {
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}

export async function saveMedia(file) {
  const dataUrl = await fileToDataUrl(file);
  const record = {
    id: uid("media"),
    name: file.name,
    type: file.type,
    size: file.size,
    dataUrl,
    createdAt: new Date().toISOString()
  };
  try {
    const database = await openDB();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE, "readwrite");
      transaction.objectStore(STORE).put(record);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch {
    const records = [record, ...fallbackList()].slice(0, 20);
    if (!fallbackSave(records)) throw new Error("Storage full");
  }
  return record;
}

export async function listMedia() {
  try {
    const database = await openDB();
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE, "readonly");
      const request = transaction.objectStore(STORE).getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
      request.onerror = () => reject(request.error);
    });
  } catch {
    return fallbackList();
  }
}

export async function deleteMedia(id) {
  try {
    const database = await openDB();
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE, "readwrite");
      transaction.objectStore(STORE).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    return true;
  } catch {
    return fallbackSave(fallbackList().filter((record) => record.id !== id));
  }
}
