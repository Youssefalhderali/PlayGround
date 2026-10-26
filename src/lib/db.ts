import Dexie, { type Table } from 'dexie'
import type {
  AppData, Article, AuditEntry, FirmwareRecord, MaintenanceRequest, Phone,
  ScreenPrice, Settings, SparePart, Supplier, UploadedFile,
} from '../types'
import phonesJson from '../data/phones.json'
import {
  articles as seededArticles, defaultSettings, seedFirmware, seedScreenPrices,
  seedSpareParts, seedSuppliers, seedVersion,
} from '../data/seed'

class BrxvihDB extends Dexie {
  phones!: Table<Phone, string>
  screenPrices!: Table<ScreenPrice, string>
  spareParts!: Table<SparePart, string>
  suppliers!: Table<Supplier, string>
  firmware!: Table<FirmwareRecord, string>
  articles!: Table<Article, string>
  requests!: Table<MaintenanceRequest, string>
  settings!: Table<Settings, string>
  audit!: Table<AuditEntry, string>
  files!: Table<UploadedFile, string>
  meta!: Table<{ key: string; value: string }, string>

  constructor() {
    super('brxvih-platform')
    this.version(1).stores({
      phones: 'id, brand, series, year, publishStatus, name, modelNumber, codename',
      screenPrices: 'id, phoneId, brand, publishStatus, status, city, supplier',
      spareParts: 'id, category, publishStatus, status',
      suppliers: 'id, name, city',
      firmware: 'id, brand, status, publishStatus',
      articles: 'id, slug, category, publishStatus, date',
      requests: 'id, ticket, phone, status, createdAt',
      settings: 'id',
      audit: 'id, at, entity',
      files: 'id, createdAt',
      meta: 'key',
    })
  }
}

export const db = new BrxvihDB()

const now = () => new Date().toISOString()

export async function seedDatabase(force = false) {
  const seeded = await db.meta.get('seedVersion')
  const settings = await db.settings.get('app')
  if (!force && seeded?.value === String(seedVersion) && settings) return
  await db.transaction('rw', [
      db.phones, db.screenPrices, db.spareParts, db.suppliers, db.firmware,
      db.articles, db.requests, db.settings, db.audit, db.meta,
    ], async () => {
      if (force) {
        await Promise.all([
          db.phones.clear(), db.screenPrices.clear(), db.spareParts.clear(),
          db.suppliers.clear(), db.firmware.clear(), db.articles.clear(),
          db.requests.clear(), db.settings.clear(), db.audit.clear(),
        ])
      }
      if (!force) {
        const phonesCount = await db.phones.count()
        if (phonesCount === 0) await db.phones.bulkPut(phonesJson as unknown as Phone[])
        if (await db.screenPrices.count() === 0) await db.screenPrices.bulkPut(seedScreenPrices)
        if (await db.spareParts.count() === 0) await db.spareParts.bulkPut(seedSpareParts)
        if (await db.suppliers.count() === 0) await db.suppliers.bulkPut(seedSuppliers)
        if (await db.firmware.count() === 0) await db.firmware.bulkPut(seedFirmware)
        if (await db.articles.count() === 0) await db.articles.bulkPut(seededArticles)
        if (!(await db.settings.get('app'))) await db.settings.put(defaultSettings)
      } else {
        await db.phones.bulkPut(phonesJson as unknown as Phone[])
        await db.screenPrices.bulkPut(seedScreenPrices)
        await db.spareParts.bulkPut(seedSpareParts)
        await db.suppliers.bulkPut(seedSuppliers)
        await db.firmware.bulkPut(seedFirmware)
        await db.articles.bulkPut(seededArticles)
        await db.settings.put(defaultSettings)
      }
      await db.meta.put({ key: 'seedVersion', value: String(seedVersion) })
      await db.audit.add({
        id: `audit-${Date.now()}`, action: force ? 'reset' : 'seed', entity: 'database',
        entityId: 'all', at: now(), note: force ? 'إعادة تعيين إلى البيانات الأولية' : 'تهيئة قاعدة البيانات',
      })
  })
}

export async function loadAll(): Promise<AppData> {
  const [phones, screenPrices, spareParts, suppliers, firmware, articles, requests, settings, audit] = await Promise.all([
    db.phones.toArray(), db.screenPrices.toArray(), db.spareParts.toArray(),
    db.suppliers.toArray(), db.firmware.toArray(), db.articles.toArray(),
    db.requests.toArray(), db.settings.get('app'), db.audit.toArray(),
  ])
  return {
    phones, screenPrices, spareParts, suppliers, firmware, articles,
    requests: requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    settings: settings ?? defaultSettings,
    audit: audit.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 500),
  }
}

export async function resetDatabase() {
  await seedDatabase(true)
}

export async function exportBackup(): Promise<Record<string, unknown>> {
  const data = await loadAll()
  const fileRows = await db.files.toArray()
  const files = await Promise.all(fileRows.map(async f => ({
    ...f,
    blob: undefined,
    data: await blobToBase64(f.blob),
  })))
  return {
    meta: { app: 'brxvih', version: 1, exportedAt: now() },
    data,
    files,
  }
}

export async function importBackup(payload: unknown) {
  const p = payload as { data?: Partial<AppData>; files?: Array<Record<string, unknown>> }
  if (!p || typeof p !== 'object' || !p.data) throw new Error('Invalid backup')
  const d = p.data
  await db.transaction('rw', [
    db.phones, db.screenPrices, db.spareParts, db.suppliers, db.firmware,
    db.articles, db.requests, db.settings, db.audit, db.files, db.meta,
  ], async () => {
    if (Array.isArray(d.phones)) { await db.phones.clear(); await db.phones.bulkPut(d.phones as Phone[]) }
    if (Array.isArray(d.screenPrices)) { await db.screenPrices.clear(); await db.screenPrices.bulkPut(d.screenPrices as ScreenPrice[]) }
    if (Array.isArray(d.spareParts)) { await db.spareParts.clear(); await db.spareParts.bulkPut(d.spareParts as SparePart[]) }
    if (Array.isArray(d.suppliers)) { await db.suppliers.clear(); await db.suppliers.bulkPut(d.suppliers as Supplier[]) }
    if (Array.isArray(d.firmware)) { await db.firmware.clear(); await db.firmware.bulkPut(d.firmware as FirmwareRecord[]) }
    if (Array.isArray(d.articles)) { await db.articles.clear(); await db.articles.bulkPut(d.articles as Article[]) }
    if (Array.isArray(d.requests)) { await db.requests.clear(); await db.requests.bulkPut(d.requests as MaintenanceRequest[]) }
    if (d.settings) await db.settings.put(d.settings as Settings)
    if (Array.isArray(d.audit)) { await db.audit.clear(); await db.audit.bulkPut(d.audit as AuditEntry[]) }
    if (Array.isArray(p.files)) {
      await db.files.clear()
      for (const f of p.files) {
        try {
          const blob = base64ToBlob(String(f.data || ''), String(f.type || 'application/octet-stream'))
          await db.files.put({ id: String(f.id), name: String(f.name), type: String(f.type), size: Number(f.size), blob, createdAt: String(f.createdAt) })
        } catch { /* skip broken attachment */ }
      }
    }
    await db.meta.put({ key: 'seedVersion', value: String(seedVersion) })
  })
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function base64ToBlob(base64: string, type: string): Blob {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type })
}

export async function addAudit(action: string, entity: string, entityId: string, note?: string) {
  await db.audit.add({ id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, action, entity, entityId, at: now(), note })
}
