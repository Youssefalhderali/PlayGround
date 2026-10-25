import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Database, Phone, Settings } from '../types'
import BASE_PHONES_JSON from '../data/phones.json'
import { createSeedDatabase, DEFAULT_SETTINGS } from '../data/seed'
import { sha256, uid } from '../lib/utils'
import { useToast } from './ToastContext'

const STORAGE_KEY = 'brxvih:db:v1'
const SESSION_KEY = 'brxvih:admin:session'
export const DEFAULT_ADMIN_PASSWORD = 'brxvih2026'

export const BASE_PHONES = BASE_PHONES_JSON as unknown as Phone[]

function mergeDb(raw: Partial<Database>): Database {
  const seed = createSeedDatabase()
  return {
    version: 1,
    settings: { ...DEFAULT_SETTINGS, ...(raw.settings || {}) },
    customPhones: raw.customPhones || [],
    phoneOverrides: raw.phoneOverrides || {},
    hiddenPhoneIds: raw.hiddenPhoneIds || [],
    screenPrices: raw.screenPrices || seed.screenPrices,
    parts: raw.parts || seed.parts,
    suppliers: raw.suppliers || seed.suppliers,
    firmware: raw.firmware || seed.firmware,
    tools: raw.tools || seed.tools,
    articles: raw.articles || seed.articles,
    repairRequests: raw.repairRequests || [],
    messages: raw.messages || [],
    priceRequests: raw.priceRequests || [],
    uploads: raw.uploads || [],
    auditLog: raw.auditLog || [],
  }
}

function loadDb(): Database {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedDatabase()
    return mergeDb(JSON.parse(raw) as Partial<Database>)
  } catch {
    return createSeedDatabase()
  }
}

interface StoreValue {
  db: Database
  phones: Phone[]
  isAdmin: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
  changePassword: (current: string, next: string) => Promise<boolean>
  update: (updater: (db: Database) => Database) => void
  updateSettings: (patch: Partial<Settings>) => void
  logAudit: (action: string, entity: string, detail: string) => void
  updatePhone: (id: string, patch: Partial<Phone>) => void
  addPhone: (phone: Phone) => void
  deletePhone: (id: string) => void
  restorePhone: (id: string) => void
  importDatabase: (raw: Partial<Database>, mode: 'replace' | 'merge') => boolean
  resetDatabase: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [db, setDb] = useState<Database>(() => loadDb())
  const [isAdmin, setIsAdmin] = useState<boolean>(() => sessionStorage.getItem(SESSION_KEY) === '1')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
    } catch (error) {
      toast('تعذر حفظ البيانات محلياً. قد يكون التخزين ممتلئاً. صدّر نسخة احتياطية.', 'error')
      console.error(error)
    }
  }, [db, toast])

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          setDb(mergeDb(JSON.parse(event.newValue) as Partial<Database>))
        } catch {
          /* ignore corrupt external data */
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const update = useCallback((updater: (db: Database) => Database) => {
    setDb((prev) => updater(prev))
  }, [])

  const logAudit = useCallback((action: string, entity: string, detail: string) => {
    setDb((prev) => ({
      ...prev,
      auditLog: [
        { id: uid('log'), action, entity, detail, at: new Date().toISOString() },
        ...prev.auditLog,
      ].slice(0, 300),
    }))
  }, [])

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setDb((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
      logAudit('update', 'settings', 'تم تحديث إعدادات الموقع')
    },
    [logAudit],
  )

  const phones = useMemo(() => {
    const hidden = new Set(db.hiddenPhoneIds)
    const custom = db.customPhones.filter((p) => !hidden.has(p.id))
    const customIds = new Set(custom.map((p) => p.id))
    const base = BASE_PHONES.filter((p) => !hidden.has(p.id) && !customIds.has(p.id)).map((p) => {
      const override = db.phoneOverrides[p.id]
      if (!override) return p
      return { ...p, ...override, id: p.id, slug: p.slug }
    })
    return [...custom, ...base].sort((a, b) => {
      const yearDiff = (b.releaseYear || 0) - (a.releaseYear || 0)
      if (yearDiff !== 0) return yearDiff
      return a.name.localeCompare(b.name)
    })
  }, [db.customPhones, db.hiddenPhoneIds, db.phoneOverrides])

  const login = useCallback(
    async (password: string) => {
      const expected = db.settings.adminPasswordHash
      if (!expected) {
        if (password === DEFAULT_ADMIN_PASSWORD) {
          sessionStorage.setItem(SESSION_KEY, '1')
          setIsAdmin(true)
          toast('مرحباً بك في لوحة التحكم', 'success')
          return true
        }
        return false
      }
      const hash = await sha256(password)
      if (hash === expected) {
        sessionStorage.setItem(SESSION_KEY, '1')
        setIsAdmin(true)
        toast('مرحباً بك في لوحة التحكم', 'success')
        return true
      }
      return false
    },
    [db.settings.adminPasswordHash, toast],
  )

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsAdmin(false)
  }, [])

  const changePassword = useCallback(
    async (current: string, next: string) => {
      const expected = db.settings.adminPasswordHash
      let ok = false
      if (!expected) ok = current === DEFAULT_ADMIN_PASSWORD
      else ok = (await sha256(current)) === expected
      if (!ok) return false
      if (next.length < 8) return false
      const hash = await sha256(next)
      updateSettings({ adminPasswordHash: hash })
      toast('تم تغيير كلمة المرور', 'success')
      return true
    },
    [db.settings.adminPasswordHash, toast, updateSettings],
  )

  const updatePhone = useCallback(
    (id: string, patch: Partial<Phone>) => {
      const custom = db.customPhones.find((p) => p.id === id)
      if (custom) {
        setDb((prev) => ({
          ...prev,
          customPhones: prev.customPhones.map((p) => (p.id === id ? { ...p, ...patch, id } : p)),
        }))
      } else {
        setDb((prev) => ({
          ...prev,
          phoneOverrides: {
            ...prev.phoneOverrides,
            [id]: { ...(prev.phoneOverrides[id] || {}), ...patch },
          },
        }))
      }
      logAudit('update', 'phone', `تعديل الموديل ${id}`)
    },
    [db.customPhones, logAudit],
  )

  const addPhone = useCallback(
    (phone: Phone) => {
      setDb((prev) => ({ ...prev, customPhones: [phone, ...prev.customPhones], hiddenPhoneIds: prev.hiddenPhoneIds.filter((id) => id !== phone.id) }))
      logAudit('create', 'phone', `إضافة الموديل ${phone.name}`)
    },
    [logAudit],
  )

  const deletePhone = useCallback(
    (id: string) => {
      const isCustom = db.customPhones.some((p) => p.id === id)
      setDb((prev) => ({
        ...prev,
        customPhones: prev.customPhones.filter((p) => p.id !== id),
        hiddenPhoneIds: isCustom ? prev.hiddenPhoneIds : [...new Set([...prev.hiddenPhoneIds, id])],
      }))
      logAudit('delete', 'phone', `حذف/إخفاء الموديل ${id}`)
    },
    [db.customPhones, logAudit],
  )

  const restorePhone = useCallback(
    (id: string) => {
      setDb((prev) => ({ ...prev, hiddenPhoneIds: prev.hiddenPhoneIds.filter((x) => x !== id) }))
      logAudit('restore', 'phone', `استعادة الموديل ${id}`)
    },
    [logAudit],
  )

  const importDatabase = useCallback(
    (raw: Partial<Database>, mode: 'replace' | 'merge') => {
      try {
        if (!raw || typeof raw !== 'object') return false
        if (mode === 'replace') {
          setDb(mergeDb(raw))
        } else {
          setDb((prev) => {
            const merged = mergeDb(raw)
            const mergeArrays = <T extends { id: string }>(a: T[], b: T[]) => {
              const map = new Map(a.map((x) => [x.id, x]))
              b.forEach((x) => map.set(x.id, x))
              return [...map.values()]
            }
            return {
              ...prev,
              screenPrices: mergeArrays(prev.screenPrices, merged.screenPrices),
              parts: mergeArrays(prev.parts, merged.parts),
              suppliers: mergeArrays(prev.suppliers, merged.suppliers),
              firmware: mergeArrays(prev.firmware, merged.firmware),
              tools: mergeArrays(prev.tools, merged.tools),
              articles: mergeArrays(prev.articles, merged.articles),
              repairRequests: mergeArrays(prev.repairRequests, merged.repairRequests),
              messages: mergeArrays(prev.messages, merged.messages),
              priceRequests: mergeArrays(prev.priceRequests, merged.priceRequests),
              customPhones: mergeArrays(prev.customPhones, merged.customPhones),
              uploads: mergeArrays(prev.uploads, merged.uploads),
              auditLog: prev.auditLog,
            }
          })
        }
        logAudit('import', 'database', `استيراد بيانات (${mode})`)
        return true
      } catch {
        return false
      }
    },
    [logAudit],
  )

  const resetDatabase = useCallback(() => {
    setDb(createSeedDatabase())
    sessionStorage.removeItem(SESSION_KEY)
    setIsAdmin(false)
    toast('تمت استعادة البيانات الأولية', 'info')
  }, [toast])

  const value = useMemo<StoreValue>(
    () => ({
      db,
      phones,
      isAdmin,
      login,
      logout,
      changePassword,
      update,
      updateSettings,
      logAudit,
      updatePhone,
      addPhone,
      deletePhone,
      restorePhone,
      importDatabase,
      resetDatabase,
    }),
    [
      db,
      phones,
      isAdmin,
      login,
      logout,
      changePassword,
      update,
      updateSettings,
      logAudit,
      updatePhone,
      addPhone,
      deletePhone,
      restorePhone,
      importDatabase,
      resetDatabase,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
