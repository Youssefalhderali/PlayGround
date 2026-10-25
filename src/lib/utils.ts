export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function formatDate(value?: string | null, lang: 'ar' | 'en' = 'ar'): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-YE' : 'en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d)
  } catch {
    return value
  }
}

export function formatNumber(n: number, lang: 'ar' | 'en' = 'ar'): string {
  try {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-YE' : 'en-US').format(n)
  } catch {
    return String(n)
  }
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function ticketId(): string {
  return `BRX-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

export function truncate(value: string, max = 120): string {
  if (value.length <= max) return value
  return value.slice(0, max).trimEnd() + '…'
}

export function waLink(phone: string, text?: string): string {
  const clean = phone.replace(/[^\d]/g, '')
  const base = `https://wa.me/${clean}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export function safeExternal(url?: string): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.toString()
  } catch {
    return undefined
  }
  return undefined
}

export async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function bytesLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
