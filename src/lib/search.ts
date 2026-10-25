import Fuse from 'fuse.js'
import type { Article, Firmware, Part, Phone, Tool } from '../types'

export interface ParsedQuery {
  text: string
  brand?: string
  model?: string
  codename?: string
  series?: string
  year?: number
}

export function parseQuery(raw: string): ParsedQuery {
  const out: ParsedQuery = { text: '' }
  const words: string[] = []
  for (const token of raw.trim().split(/\s+/)) {
    const match = token.match(/^(brand|model|codename|series|year):(.+)$/i)
    if (!match) {
      words.push(token)
      continue
    }
    const key = match[1].toLowerCase()
    const value = match[2]
    if (key === 'brand') out.brand = value
    else if (key === 'model') out.model = value
    else if (key === 'codename') out.codename = value
    else if (key === 'series') out.series = value
    else if (key === 'year') out.year = Number(value) || undefined
  }
  out.text = words.join(' ')
  return out
}

const phoneFuse = (phones: Phone[]) =>
  new Fuse(phones, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'modelNumbers', weight: 2.5 },
      { name: 'codename', weight: 2.2 },
      { name: 'brand', weight: 1.4 },
      { name: 'series', weight: 1 },
      { name: 'chipset', weight: 0.8 },
    ],
    threshold: 0.32,
    distance: 160,
    ignoreLocation: true,
    minMatchCharLength: 2,
    useExtendedSearch: false,
  })

const fuseCache = new WeakMap<Phone[], Fuse<Phone>>()
function getPhoneFuse(phones: Phone[]) {
  let f = fuseCache.get(phones)
  if (!f) {
    f = phoneFuse(phones)
    fuseCache.set(phones, f)
  }
  return f
}

export function searchPhones(phones: Phone[], raw: string): Phone[] {
  const q = parseQuery(raw)
  let result = phones
  if (q.brand) {
    const b = q.brand.toLowerCase()
    result = result.filter((p) => p.brand.toLowerCase() === b || p.brand.toLowerCase().includes(b))
  }
  if (q.model) {
    const m = q.model.toLowerCase().replace(/[\s-]/g, '')
    result = result.filter((p) =>
      p.modelNumbers.some((n) => n.toLowerCase().replace(/[\s-]/g, '').includes(m)),
    )
  }
  if (q.codename) {
    const c = q.codename.toLowerCase()
    result = result.filter((p) => p.codename.toLowerCase().includes(c))
  }
  if (q.series) {
    const s = q.series.toLowerCase()
    result = result.filter((p) => p.series.toLowerCase().includes(s))
  }
  if (q.year) {
    result = result.filter((p) => p.releaseYear === q.year)
  }
  if (!q.text) return result
  if (q.brand || q.model || q.codename || q.series || q.year) {
    const f = new Fuse(result, {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'modelNumbers', weight: 2 },
        { name: 'codename', weight: 2 },
        { name: 'chipset', weight: 1 },
      ],
      threshold: 0.34,
      ignoreLocation: true,
      minMatchCharLength: 2,
    })
    return f.search(q.text).map((r) => r.item)
  }
  return getPhoneFuse(phones)
    .search(raw)
    .map((r) => r.item)
}

export function searchArticles(articles: Article[], raw: string): Article[] {
  if (!raw.trim()) return articles
  const f = new Fuse(articles, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'titleEn', weight: 2 },
      { name: 'excerpt', weight: 1.5 },
      { name: 'tags', weight: 1.2 },
      { name: 'content.heading', weight: 1 },
    ],
    threshold: 0.34,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
  return f.search(raw).map((r) => r.item)
}

export function searchFirmware(items: Firmware[], raw: string): Firmware[] {
  if (!raw.trim()) return items
  const f = new Fuse(items, {
    keys: [
      { name: 'model', weight: 3 },
      { name: 'modelNumber', weight: 2 },
      { name: 'brand', weight: 1.5 },
      { name: 'version', weight: 1 },
      { name: 'region', weight: 1 },
    ],
    threshold: 0.34,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
  return f.search(raw).map((r) => r.item)
}

export function searchTools(items: Tool[], raw: string): Tool[] {
  if (!raw.trim()) return items
  const f = new Fuse(items, {
    keys: ['name', 'category', 'purpose', 'platform'],
    threshold: 0.36,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
  return f.search(raw).map((r) => r.item)
}

export function searchParts(items: Part[], raw: string): Part[] {
  if (!raw.trim()) return items
  const f = new Fuse(items, {
    keys: [
      { name: 'name', weight: 2.5 },
      { name: 'compatibleModels', weight: 2 },
      { name: 'brand', weight: 1.3 },
      { name: 'category', weight: 1 },
    ],
    threshold: 0.34,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
  return f.search(raw).map((r) => r.item)
}
