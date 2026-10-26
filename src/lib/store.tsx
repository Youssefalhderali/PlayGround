import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type {
  AppData, Article, AuditEntry, Currency, FirmwareRecord, Lang, MaintenanceRequest,
  Phone, ScreenPrice, Settings, SparePart, Supplier, Theme, UploadedFile,
} from '../types'
import { defaultSettings } from '../data/seed'
import { addAudit, db, exportBackup, importBackup, loadAll, resetDatabase, seedDatabase } from './db'
import { hashPin, randomSalt, ticketId, uid } from './utils'
import { translate, type TranslationKey } from './i18n'

type ToastKind = 'success' | 'error' | 'info'
interface Toast { id: string; message: string; kind: ToastKind }

interface NewRequest {
  name: string
  phone: string
  city: string
  brand: string
  model: string
  serviceType: string
  description: string
  contactMethod: string
  priority?: 'normal' | 'urgent'
  consent: boolean
}

interface StoreValue {
  data: AppData
  ready: boolean
  error: string | null
  lang: Lang
  theme: Theme
  dir: 'rtl' | 'ltr'
  setLang: (lang: Lang) => void
  toggleLang: () => void
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
  toasts: Toast[]
  toast: (message: string, kind?: ToastKind) => void
  dismissToast: (id: string) => void
  adminUnlocked: boolean
  isFirstRun: boolean
  setupAdmin: (pin: string) => Promise<void>
  unlockAdmin: (pin: string) => Promise<boolean>
  lockAdmin: () => void
  changePin: (current: string, next: string) => Promise<boolean>
  savePhone: (phone: Phone) => Promise<void>
  deletePhone: (id: string) => Promise<void>
  saveScreenPrice: (row: ScreenPrice) => Promise<void>
  deleteScreenPrice: (id: string) => Promise<void>
  saveSparePart: (row: SparePart) => Promise<void>
  deleteSparePart: (id: string) => Promise<void>
  saveSupplier: (row: Supplier) => Promise<void>
  deleteSupplier: (id: string) => Promise<void>
  saveFirmware: (row: FirmwareRecord) => Promise<void>
  deleteFirmware: (id: string) => Promise<void>
  saveArticle: (row: Article) => Promise<void>
  deleteArticle: (id: string) => Promise<void>
  addRequest: (input: NewRequest) => Promise<MaintenanceRequest>
  updateRequest: (row: MaintenanceRequest) => Promise<void>
  deleteRequest: (id: string) => Promise<void>
  saveSettings: (patch: Partial<Settings>) => Promise<void>
  uploadFile: (file: File) => Promise<UploadedFile>
  downloadStoredFile: (id: string, name?: string) => Promise<void>
  deleteStoredFile: (id: string) => Promise<void>
  resetAll: () => Promise<void>
  createBackup: () => Promise<Record<string, unknown>>
  restoreBackup: (payload: unknown) => Promise<void>
  trackRequest: (ticket: string, phone: string) => MaintenanceRequest | undefined
  refresh: () => Promise<void>
}

const emptyData: AppData = {
  phones: [], screenPrices: [], spareParts: [], suppliers: [], firmware: [],
  articles: [], requests: [], settings: defaultSettings, audit: [],
}

const StoreContext = createContext<StoreValue | null>(null)

const readStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch { return fallback }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lang, setLangState] = useState<Lang>(() => readStored<Lang>('brx-lang', 'ar'))
  const [theme, setThemeState] = useState<Theme>(() => readStored<Theme>('brx-theme', 'dark'))
  const [toasts, setToasts] = useState<Toast[]>([])
  const [adminUnlocked, setAdminUnlocked] = useState(() => sessionStorage.getItem('brx-admin-session') === '1')
  const [isFirstRun, setIsFirstRun] = useState(false)
  const timers = useRef<Record<string, number>>({})

  const refresh = useCallback(async () => {
    const all = await loadAll()
    setData(all)
    setIsFirstRun(!all.settings.adminPinHash)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await seedDatabase()
        if (!cancelled) {
          await refresh()
          setReady(true)
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Database initialization failed')
          setReady(true)
        }
      }
    })()
    return () => { cancelled = true }
  }, [refresh])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dataset.lang = lang
    localStorage.setItem('brx-lang', JSON.stringify(lang))
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('brx-theme', JSON.stringify(theme))
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#07090b' : '#f5f5f2')
  }, [theme])

  const t = useCallback((key: TranslationKey, vars?: Record<string, string | number>) => translate(lang, key, vars), [lang])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(x => x.id !== id))
    window.clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = uid('toast')
    setToasts(prev => [...prev.slice(-3), { id, message, kind }])
    timers.current[id] = window.setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== id))
      delete timers.current[id]
    }, 3800)
  }, [])

  const setLang = useCallback((next: Lang) => setLangState(next), [])
  const toggleLang = useCallback(() => setLangState(v => v === 'ar' ? 'en' : 'ar'), [])
  const setTheme = useCallback((next: Theme) => setThemeState(next), [])
  const toggleTheme = useCallback(() => setThemeState(v => v === 'dark' ? 'light' : 'dark'), [])

  const setupAdmin = useCallback(async (pin: string) => {
    const salt = randomSalt()
    const adminPinHash = await hashPin(pin, salt)
    await db.settings.put({ ...data.settings, adminPinHash, adminSalt: salt })
    await addAudit('setup', 'admin', 'app', 'تم إنشاء رمز دخول المدير')
    sessionStorage.setItem('brx-admin-session', '1')
    setAdminUnlocked(true)
    await refresh()
  }, [data.settings, refresh])

  const unlockAdmin = useCallback(async (pin: string) => {
    const settings = await db.settings.get('app')
    if (!settings?.adminPinHash || !settings.adminSalt) return false
    const h = await hashPin(pin, settings.adminSalt)
    if (h !== settings.adminPinHash) return false
    sessionStorage.setItem('brx-admin-session', '1')
    setAdminUnlocked(true)
    return true
  }, [])

  const lockAdmin = useCallback(() => {
    sessionStorage.removeItem('brx-admin-session')
    setAdminUnlocked(false)
  }, [])

  const changePin = useCallback(async (current: string, next: string) => {
    const settings = await db.settings.get('app')
    if (!settings?.adminPinHash || !settings.adminSalt) return false
    if (await hashPin(current, settings.adminSalt) !== settings.adminPinHash) return false
    const salt = randomSalt()
    await db.settings.put({ ...settings, adminSalt: salt, adminPinHash: await hashPin(next, salt) })
    await addAudit('update', 'admin', 'app', 'تم تغيير رمز الدخول')
    await refresh()
    return true
  }, [refresh])

  const savePhone = useCallback(async (phone: Phone) => {
    const updated = { ...phone, updatedAt: new Date().toISOString() }
    const exists = await db.phones.get(phone.id)
    await db.phones.put(updated)
    await addAudit(exists ? 'update' : 'create', 'phone', phone.id, phone.name)
    await refresh()
  }, [refresh])
  const deletePhone = useCallback(async (id: string) => {
    await db.phones.delete(id)
    await addAudit('delete', 'phone', id)
    await refresh()
  }, [refresh])

  const saveScreenPrice = useCallback(async (row: ScreenPrice) => {
    const exists = await db.screenPrices.get(row.id)
    await db.screenPrices.put(row)
    await addAudit(exists ? 'update' : 'create', 'screenPrice', row.id, row.phoneName)
    await refresh()
  }, [refresh])
  const deleteScreenPrice = useCallback(async (id: string) => {
    await db.screenPrices.delete(id)
    await addAudit('delete', 'screenPrice', id)
    await refresh()
  }, [refresh])

  const saveSparePart = useCallback(async (row: SparePart) => {
    const exists = await db.spareParts.get(row.id)
    await db.spareParts.put(row)
    await addAudit(exists ? 'update' : 'create', 'sparePart', row.id, row.name)
    await refresh()
  }, [refresh])
  const deleteSparePart = useCallback(async (id: string) => {
    await db.spareParts.delete(id)
    await addAudit('delete', 'sparePart', id)
    await refresh()
  }, [refresh])

  const saveSupplier = useCallback(async (row: Supplier) => {
    const exists = await db.suppliers.get(row.id)
    await db.suppliers.put(row)
    await addAudit(exists ? 'update' : 'create', 'supplier', row.id, row.name)
    await refresh()
  }, [refresh])
  const deleteSupplier = useCallback(async (id: string) => {
    await db.suppliers.delete(id)
    await addAudit('delete', 'supplier', id)
    await refresh()
  }, [refresh])

  const saveFirmware = useCallback(async (row: FirmwareRecord) => {
    const exists = await db.firmware.get(row.id)
    await db.firmware.put(row)
    await addAudit(exists ? 'update' : 'create', 'firmware', row.id, row.modelName)
    await refresh()
  }, [refresh])
  const deleteFirmware = useCallback(async (id: string) => {
    await db.firmware.delete(id)
    await addAudit('delete', 'firmware', id)
    await refresh()
  }, [refresh])

  const saveArticle = useCallback(async (row: Article) => {
    const exists = await db.articles.get(row.id)
    await db.articles.put(row)
    await addAudit(exists ? 'update' : 'create', 'article', row.id, row.titleAr)
    await refresh()
  }, [refresh])
  const deleteArticle = useCallback(async (id: string) => {
    await db.articles.delete(id)
    await addAudit('delete', 'article', id)
    await refresh()
  }, [refresh])

  const addRequest = useCallback(async (input: NewRequest) => {
    const stamp = new Date().toISOString()
    const record: MaintenanceRequest = {
      id: uid('req'),
      ticket: ticketId(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      city: input.city.trim(),
      brand: input.brand,
      model: input.model.trim(),
      serviceType: input.serviceType,
      description: input.description.trim(),
      contactMethod: input.contactMethod,
      status: 'new',
      priority: input.priority ?? 'normal',
      createdAt: stamp,
      updatedAt: stamp,
      consent: input.consent,
    }
    await db.requests.put(record)
    await addAudit('create', 'request', record.id, record.ticket)
    await refresh()
    return record
  }, [refresh])

  const updateRequest = useCallback(async (row: MaintenanceRequest) => {
    await db.requests.put({ ...row, updatedAt: new Date().toISOString() })
    await addAudit('update', 'request', row.id, row.ticket)
    await refresh()
  }, [refresh])

  const deleteRequest = useCallback(async (id: string) => {
    await db.requests.delete(id)
    await addAudit('delete', 'request', id)
    await refresh()
  }, [refresh])

  const saveSettings = useCallback(async (patch: Partial<Settings>) => {
    const current = await db.settings.get('app') ?? defaultSettings
    await db.settings.put({ ...current, ...patch, id: 'app' })
    await addAudit('update', 'settings', 'app')
    await refresh()
  }, [refresh])

  const uploadFile = useCallback(async (file: File) => {
    if (file.size > 20 * 1024 * 1024) throw new Error('FILE_TOO_LARGE')
    const record: UploadedFile = {
      id: uid('file'), name: file.name, type: file.type || 'application/octet-stream',
      size: file.size, blob: file, createdAt: new Date().toISOString(),
    }
    await db.files.put(record)
    return record
  }, [])

  const downloadStoredFile = useCallback(async (id: string, name?: string) => {
    const f = await db.files.get(id)
    if (!f) { toast(lang === 'ar' ? 'الملف غير موجود.' : 'File not found.', 'error'); return }
    const url = URL.createObjectURL(f.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name || f.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 3000)
  }, [lang, toast])

  const deleteStoredFile = useCallback(async (id: string) => { await db.files.delete(id) }, [])

  const resetAll = useCallback(async () => {
    await resetDatabase()
    await refresh()
  }, [refresh])

  const createBackup = useCallback(() => exportBackup(), [])
  const restoreBackup = useCallback(async (payload: unknown) => {
    await importBackup(payload)
    await refresh()
  }, [refresh])

  const trackRequest = useCallback((ticket: string, phone: string) => {
    const t = ticket.trim().toUpperCase()
    const p = phone.replace(/[^\d]/g, '')
    return data.requests.find(r => r.ticket.toUpperCase() === t && r.phone.replace(/[^\d]/g, '') === p)
  }, [data.requests])

  const value = useMemo<StoreValue>(() => ({
    data, ready, error, lang, theme, dir: lang === 'ar' ? 'rtl' : 'ltr',
    setLang, toggleLang, setTheme, toggleTheme, t, toasts, toast, dismissToast,
    adminUnlocked, isFirstRun, setupAdmin, unlockAdmin, lockAdmin, changePin,
    savePhone, deletePhone, saveScreenPrice, deleteScreenPrice, saveSparePart,
    deleteSparePart, saveSupplier, deleteSupplier, saveFirmware, deleteFirmware,
    saveArticle, deleteArticle, addRequest, updateRequest, deleteRequest, saveSettings,
    uploadFile, downloadStoredFile, deleteStoredFile, resetAll, createBackup,
    restoreBackup, trackRequest, refresh,
  }), [
    data, ready, error, lang, theme, setLang, toggleLang, setTheme, toggleTheme, t,
    toasts, toast, dismissToast, adminUnlocked, isFirstRun, setupAdmin, unlockAdmin,
    lockAdmin, changePin, savePhone, deletePhone, saveScreenPrice, deleteScreenPrice,
    saveSparePart, deleteSparePart, saveSupplier, deleteSupplier, saveFirmware,
    deleteFirmware, saveArticle, deleteArticle, addRequest, updateRequest, deleteRequest,
    saveSettings, uploadFile, downloadStoredFile, deleteStoredFile, resetAll,
    createBackup, restoreBackup, trackRequest, refresh,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
