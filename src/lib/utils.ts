import type { Availability, Currency, Lang, MaintenanceRequest, PublishStatus, RequestStatus, ScreenQuality } from '../types'

export const cn = (...v: Array<string | false | null | undefined>) => v.filter(Boolean).join(' ')

export const WHATSAPP = '+967777066424'
export const PHONE = '+967777066424'
export const EMAIL = ''

export const normalize = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

export const scoreMatch = (haystack: string, needle: string): number => {
  if (!needle.trim()) return 1
  const h = normalize(haystack)
  const n = normalize(needle)
  if (!n) return 1
  if (h === n) return 100
  if (h.startsWith(n)) return 80
  if (h.includes(` ${n}`)) return 65
  if (h.includes(n)) return 50
  const parts = n.split(' ').filter(Boolean)
  if (parts.length > 1) {
    const hits = parts.filter(p => h.includes(p)).length
    if (hits === parts.length) return 35
    if (hits > 0) return 10 + hits * 3
  }
  return 0
}

export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export const ticketId = () => `BRX-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random().toString(36).toUpperCase().slice(2, 5)}`

export const formatDate = (iso: string, lang: Lang) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-YE' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' }).format(d)
}

export const formatNumber = (n: number, lang: Lang) => new Intl.NumberFormat(lang === 'ar' ? 'ar-YE' : 'en-US').format(n)

export const currencySymbol = (c: Currency, lang: Lang) =>
  c === 'YER' ? (lang === 'ar' ? 'ر.ي' : 'YER') : c === 'SAR' ? (lang === 'ar' ? 'ر.س' : 'SAR') : (lang === 'ar' ? '$' : 'USD')

export const convertPrice = (amount: number, from: Currency, to: Currency, rates: Record<Currency, number>) => {
  if (!amount) return 0
  const usd = amount / (rates[from] || 1)
  return usd * (rates[to] || 1)
}

export const formatPrice = (amount: number | null, currency: Currency, lang: Lang, rates?: Record<Currency, number>, displayCurrency?: Currency) => {
  if (amount === null || amount === undefined || amount === 0) return null
  let value = amount
  let cur = currency
  if (rates && displayCurrency && displayCurrency !== currency) {
    value = convertPrice(amount, currency, displayCurrency, rates)
    cur = displayCurrency
  }
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 100) / 100
  return `${formatNumber(rounded, lang)} ${currencySymbol(cur, lang)}`
}

export const whatsappLink = (message: string, number = WHATSAPP) => `https://wa.me/${number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`

export const phoneHref = (number = PHONE) => `tel:${number.replace(/\s/g, '')}`

export const qualityLabel = (q: ScreenQuality, lang: Lang) => ({
  original: lang === 'ar' ? 'أصلية' : 'Original',
  'service-pack': lang === 'ar' ? 'خدمة' : 'Service pack',
  commercial: lang === 'ar' ? 'تجارية' : 'Commercial',
  refurbished: lang === 'ar' ? 'مجددة' : 'Refurbished',
  used: lang === 'ar' ? 'مستعملة' : 'Used',
}[q])

export const availabilityLabel = (a: Availability, lang: Lang) => ({
  'in-stock': lang === 'ar' ? 'متوفر' : 'In stock',
  limited: lang === 'ar' ? 'كمية محدودة' : 'Limited',
  'on-request': lang === 'ar' ? 'عند الطلب' : 'On request',
  'out-of-stock': lang === 'ar' ? 'غير متوفر' : 'Out of stock',
}[a])

export const publishLabel = (s: PublishStatus, lang: Lang) => ({
  published: lang === 'ar' ? 'منشور' : 'Published',
  pending: lang === 'ar' ? 'قيد المراجعة' : 'Pending review',
  draft: lang === 'ar' ? 'مسودة' : 'Draft',
  archived: lang === 'ar' ? 'مؤرشف' : 'Archived',
}[s])

export const requestStatusLabel = (s: RequestStatus, lang: Lang) => ({
  new: lang === 'ar' ? 'جديد' : 'New',
  review: lang === 'ar' ? 'قيد المراجعة' : 'In review',
  'in-progress': lang === 'ar' ? 'قيد التنفيذ' : 'In progress',
  'waiting-parts': lang === 'ar' ? 'بانتظار قطعة' : 'Waiting for part',
  done: lang === 'ar' ? 'مكتمل' : 'Completed',
  cancelled: lang === 'ar' ? 'ملغي' : 'Cancelled',
}[s])

export const requestStatusTone = (s: RequestStatus) => ({
  new: 'info', review: 'warn', 'in-progress': 'accent', 'waiting-parts': 'warn', done: 'ok', cancelled: 'muted',
} as const)[s]

export const qualityTone = (status: string) => status === 'verified' ? 'ok' as const : status === 'review' ? 'warn' as const : 'muted' as const

export const average = (nums: number[]) => nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0

export const truncate = (s: string, n = 120) => s.length > n ? s.slice(0, n).trim() + '…' : s

export const requestToWhatsApp = (r: MaintenanceRequest, lang: Lang) => {
  const lines = lang === 'ar'
    ? [
        `مرحبًا brxvih، أود متابعة طلب صيانة.`,
        `التذكرة: ${r.ticket}`,
        `الاسم: ${r.name}`,
        `الهاتف: ${r.phone}`,
        `المدينة: ${r.city}`,
        `الجهاز: ${r.brand} ${r.model}`,
        `الخدمة: ${r.serviceType}`,
        `الحالة: ${requestStatusLabel(r.status, lang)}`,
        `الوصف: ${r.description}`,
      ]
    : [
        `Hello brxvih, I would like to follow up on a repair request.`,
        `Ticket: ${r.ticket}`,
        `Name: ${r.name}`,
        `Phone: ${r.phone}`,
        `City: ${r.city}`,
        `Device: ${r.brand} ${r.model}`,
        `Service: ${r.serviceType}`,
        `Status: ${requestStatusLabel(r.status, lang)}`,
        `Issue: ${r.description}`,
      ]
  return whatsappLink(lines.join('\n'))
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${pin}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function randomSalt(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function fileToDataUrl(file: File, maxSide = 1400, quality = 0.85): Promise<string> {
  if (!file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  const url = URL.createObjectURL(file)
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file) })
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  URL.revokeObjectURL(url)
  return canvas.toDataURL('image/jpeg', quality)
}

export function downloadBlob(content: BlobPart, filename: string, type = 'application/json') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const keys = Array.from(new Set(rows.flatMap(r => Object.keys(r))))
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
    return `"${s.replace(/"/g, '""')}"`
  }
  return '\uFEFF' + [keys.join(','), ...rows.map(r => keys.map(k => escape(r[k])).join(','))].join('\n')
}

export function useNoop() {}
