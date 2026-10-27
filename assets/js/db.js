const DB_NAME = 'brxvih'
const DB_VERSION = 1
const STORES = ['prices', 'suppliers', 'requests', 'settings']

let dbPromise = null

function open() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB is unavailable'))
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: name === 'settings' ? 'key' : 'id' })
        }
      }
      if (!request.transaction) return
      const prices = request.transaction.objectStore('prices')
      if (!prices.indexNames.contains('phoneSlug')) prices.createIndex('phoneSlug', 'phoneSlug', { unique: false })
      if (!prices.indexNames.contains('supplierId')) prices.createIndex('supplierId', 'supplierId', { unique: false })
      const requests = request.transaction.objectStore('requests')
      if (!requests.indexNames.contains('status')) requests.createIndex('status', 'status', { unique: false })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Could not open the local database'))
    request.onblocked = () => reject(new Error('Local database is blocked by another tab'))
  })
  return dbPromise
}

function run(store, mode, action) {
  return open().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode)
    const objectStore = tx.objectStore(store)
    let result
    try { result = action(objectStore) } catch (error) { reject(error); return }
    tx.oncomplete = () => resolve(result?.result ?? result)
    tx.onerror = () => reject(tx.error || new Error('Local database transaction failed'))
    tx.onabort = () => reject(tx.error || new Error('Local database transaction aborted'))
  }))
}

export function getAll(store) {
  return run(store, 'readonly', (objectStore) => objectStore.getAll())
}

export function get(store, key) {
  return run(store, 'readonly', (objectStore) => objectStore.get(key))
}

export function put(store, value) {
  return run(store, 'readwrite', (objectStore) => { objectStore.put(value); return value })
}

export function remove(store, key) {
  return run(store, 'readwrite', (objectStore) => { objectStore.delete(key); return true })
}

export function clear(store) {
  return run(store, 'readwrite', (objectStore) => { objectStore.clear(); return true })
}

export function uid(prefix = '') {
  const random = crypto.getRandomValues(new Uint8Array(5))
  const suffix = Array.from(random, (b) => b.toString(16).padStart(2, '0')).join('')
  return `${prefix}${Date.now().toString(36)}${suffix}`.toUpperCase()
}

export async function getSetting(key, fallback = null) {
  try {
    const row = await get('settings', key)
    return row ? row.value : fallback
  } catch {
    return fallback
  }
}

export async function setSetting(key, value) {
  return put('settings', { key, value })
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

async function derive(passcode, salt, iterations = 150000) {
  const material = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passcode), 'PBKDF2', false, ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, material, 256
  )
  return toHex(bits)
}

export async function hasPasscode() {
  return Boolean(await getSetting('adminPasscode'))
}

export async function createPasscode(passcode) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iterations = 150000
  const hash = await derive(passcode, salt, iterations)
  await setSetting('adminPasscode', { salt: toHex(salt), hash, iterations })
}

export async function verifyPasscode(passcode) {
  const record = await getSetting('adminPasscode')
  if (!record) return false
  const hash = await derive(passcode, fromHex(record.salt), record.iterations || 150000)
  return hash === record.hash
}

export async function changePasscode(current, next) {
  if (!(await verifyPasscode(current))) return false
  await createPasscode(next)
  return true
}

export async function listPrices() {
  const rows = await getAll('prices')
  return rows.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
}

export async function listSuppliers() {
  const rows = await getAll('suppliers')
  return rows.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'))
}

export async function listRequests() {
  const rows = await getAll('requests')
  return rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
}

export async function exportBackup() {
  const [prices, suppliers, requests] = await Promise.all([listPrices(), listSuppliers(), listRequests()])
  return {
    app: 'Brxvih',
    schema: 1,
    exportedAt: new Date().toISOString(),
    prices,
    suppliers,
    requests
  }
}

export async function importBackup(data, { replace = true } = {}) {
  if (!data || data.app !== 'Brxvih' || !Array.isArray(data.prices) || !Array.isArray(data.suppliers)) {
    throw new Error('Invalid backup')
  }
  if (replace) await Promise.all([clear('prices'), clear('suppliers'), clear('requests')])
  for (const row of data.prices) if (row && row.id) await put('prices', row)
  for (const row of data.suppliers) if (row && row.id) await put('suppliers', row)
  for (const row of data.requests || []) if (row && row.id) await put('requests', row)
  return true
}

export async function clearLocalData() {
  await Promise.all([clear('prices'), clear('suppliers'), clear('requests')])
}

export async function removePasscode() {
  return remove('settings', 'adminPasscode')
}
