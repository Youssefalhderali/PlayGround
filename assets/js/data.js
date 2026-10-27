import { L, getLang } from './i18n.js'

const DATA_ROOT = new URL('../../data/', import.meta.url)

export const store = {
  phones: [],
  content: null,
  iphones: [],
  prices: { prices: [], suppliers: [], updatedAt: null },
  phoneBySlug: new Map(),
  articlesBySlug: new Map(),
  brandGroups: new Map(),
  years: [],
  loaded: false
}

async function getJson(name, fallback) {
  try {
    const response = await fetch(new URL(name, DATA_ROOT), { cache: 'no-cache' })
    if (!response.ok) throw new Error(`${name}: ${response.status}`)
    return await response.json()
  } catch (error) {
    if (fallback !== undefined) return fallback
    throw error
  }
}

export async function loadData() {
  if (store.loaded) return store
  const [phones, content, iphones, prices] = await Promise.all([
    getJson('phones.json'),
    getJson('content.json'),
    getJson('iphones.json', { devices: [], count: 0 }),
    getJson('prices.json', { prices: [], suppliers: [], updatedAt: null })
  ])
  store.phones = Array.isArray(phones) ? phones : []
  store.content = content
  store.iphones = Array.isArray(iphones.devices) ? iphones.devices : []
  store.prices = prices || { prices: [], suppliers: [], updatedAt: null }
  store.phoneBySlug = new Map(store.phones.map((phone) => [phone.slug, phone]))
  store.articlesBySlug = new Map((content.articles || []).map((article) => [article.slug, article]))
  store.years = [...new Set(store.phones.map((phone) => Number(phone.release_year)).filter(Boolean))].sort((a, b) => b - a)
  store.brandGroups = new Map()
  for (const phone of store.phones) {
    if (!store.brandGroups.has(phone.brand)) store.brandGroups.set(phone.brand, [])
    store.brandGroups.get(phone.brand).push(phone)
  }
  for (const list of store.brandGroups.values()) {
    list.sort((a, b) => (Number(b.release_year) || 0) - (Number(a.release_year) || 0) || a.name.localeCompare(b.name))
  }
  store.phones.sort((a, b) => (Number(b.release_year) || 0) - (Number(a.release_year) || 0) || a.name.localeCompare(b.name))
  store.loaded = true
  return store
}

export function content() { return store.content || {} }
export function settings() { return content().settings || {} }

export function phoneBySlug(slug) {
  return store.phoneBySlug.get(slug) || null
}

export function articleBySlug(slug) {
  return store.articlesBySlug.get(slug) || null
}

export function articleTitle(article) {
  return getLang() === 'ar' ? article.titleAr : article.titleEn
}

export function articleExcerpt(article) {
  return getLang() === 'ar' ? article.excerptAr : article.excerptEn
}

export function articleBody(article) {
  return getLang() === 'ar' ? article.bodyAr : article.bodyEn
}

export function serviceTitle(service) {
  return getLang() === 'ar' ? service.titleAr : service.titleEn
}

export function serviceDesc(service) {
  return getLang() === 'ar' ? service.descAr : service.descEn
}

export function toolDesc(tool) {
  return getLang() === 'ar' ? tool.descAr : tool.descEn
}

export function firmwareNote(source) {
  return getLang() === 'ar' ? source.noteAr : source.noteEn
}

export function securityTitle(module) {
  return getLang() === 'ar' ? module.titleAr : module.titleEn
}

export function securityLevel(module) {
  return getLang() === 'ar' ? module.levelAr : module.levelEn
}

export function securityTopics(module) {
  return getLang() === 'ar' ? module.topicsAr : module.topicsEn
}

export function faq(entry) {
  return getLang() === 'ar' ? { q: entry.qAr, a: entry.aAr } : { q: entry.qEn, a: entry.aEn }
}

export function brandInfo(name) {
  return (content().brands || []).find((brand) => brand.nameEn === name) || {
    nameEn: name,
    nameAr: name,
    slug: String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    color: '#777',
    series: ''
  }
}

export function brandDisplay(name) {
  const info = brandInfo(name)
  return getLang() === 'ar' && info.nameAr ? info.nameAr : info.nameEn || name
}

export function brandSlug(name) {
  return brandInfo(name).slug
}

export function firmwareSourcesFor(name) {
  return (content().firmwareSources || []).filter((source) => source.brand === name)
}

export function articlesForPhone(phone) {
  const articles = content().articles || []
  const brandWords = String(phone.brand || '').toLowerCase().split(/\s+/)
  return articles.filter((article) => {
    const text = `${article.titleAr} ${article.titleEn} ${(article.tags || []).join(' ')}`.toLowerCase()
    return brandWords.some((word) => word.length > 3 && text.includes(word)) ||
      (phone.common_faults && text.includes(String(phone.common_faults).toLowerCase()))
  }).slice(0, 3)
}

export function relatedPhones(phone, limit = 4) {
  const group = store.brandGroups.get(phone.brand) || []
  const sameSeries = group.filter((item) => item.slug !== phone.slug && item.series && item.series === phone.series)
  const rest = group.filter((item) => item.slug !== phone.slug && !sameSeries.includes(item))
  return [...sameSeries, ...rest].slice(0, limit)
}

export function searchPhones(query, limit = 8) {
  const q = normalize(query)
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)
  const results = []
  for (const phone of store.phones) {
    const haystack = normalize(`${phone.name} ${phone.brand} ${phone.series} ${phone.model_number}`)
    if (terms.every((term) => haystack.includes(term))) {
      results.push(phone)
      if (results.length >= limit * 4) break
    }
  }
  return results.slice(0, limit)
}

export function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

export function localizePhoneName(phone) {
  return phone.name || phone.model_name || phone.slug
}

export function publishedPrices() {
  return Array.isArray(store.prices?.prices) ? store.prices.prices : []
}

export function publishedSuppliers() {
  return Array.isArray(store.prices?.suppliers) ? store.prices.suppliers : []
}

export function publishedPriceFor(slug) {
  return publishedPrices().filter((row) => row.phoneSlug === slug)
}

export function mergePrices(localRows = []) {
  const map = new Map()
  for (const row of publishedPrices()) if (row?.id) map.set(row.id, row)
  for (const row of localRows) if (row?.id) map.set(row.id, row)
  return [...map.values()].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
}

export function mergeSuppliers(localRows = []) {
  const map = new Map()
  for (const row of publishedSuppliers()) if (row?.id) map.set(row.id, row)
  for (const row of localRows) if (row?.id) map.set(row.id, row)
  return [...map.values()].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'))
}

export function partLabel(type) {
  const labels = {
    screen: { ar: 'شاشة', en: 'Display' },
    battery: { ar: 'بطارية', en: 'Battery' },
    charging_port: { ar: 'منفذ شحن', en: 'Charging port' },
    back_glass: { ar: 'زجاج خلفي', en: 'Back glass' },
    camera: { ar: 'كاميرا', en: 'Camera' },
    flex: { ar: 'فلكس', en: 'Flex cable' },
    speaker: { ar: 'سماعة', en: 'Speaker' },
    other: { ar: 'أخرى', en: 'Other' }
  }
  return labels[type]?.[getLang()] || type || ''
}

export function qualityLabel(quality) {
  const labels = {
    genuine: { ar: 'أصلي Service Pack', en: 'Genuine service pack' },
    oem: { ar: 'OEM', en: 'OEM' },
    refurbished: { ar: 'مجدد', en: 'Refurbished' },
    aftermarket: { ar: 'تجاري', en: 'Aftermarket' },
    used: { ar: 'مستعمل', en: 'Used' },
    pull: { ar: 'مسحوب', en: 'Pull' }
  }
  return labels[quality]?.[getLang()] || quality || ''
}

export function localized(valueAr, valueEn) {
  return getLang() === 'ar' ? valueAr : valueEn
}

export function humanSize(bytes) {
  const size = Number(bytes)
  if (!Number.isFinite(size) || size <= 0) return '—'
  if (size >= 1e9) return `${(size / 1e9).toFixed(2)} GB`
  if (size >= 1e6) return `${(size / 1e6).toFixed(1)} MB`
  return `${(size / 1e3).toFixed(1)} KB`
}

export function fieldText(phone, key) {
  const value = phone?.[key]
  if (value === null || value === undefined || value === '') return ''
  return String(value)
}

export function imageUrl(phone) {
  const url = String(phone?.image_url || '')
  return /^https:\/\//.test(url) ? url : ''
}

export function sourceLabel(phone) {
  return phone?.source_name || 'GSMArena'
}

export function dataQuality(phone) {
  return Number(phone?.verified) === 1 ? 'verified' : 'partial'
}

export function issueCount(phone) {
  return [phone?.chipset, phone?.display_type, phone?.display_resolution, phone?.battery, phone?.camera_main, phone?.model_number]
    .filter(Boolean).length
}

export function categoryLabel(category) {
  const labels = {
    maintenance: { ar: 'صيانة', en: 'Repair' },
    software: { ar: 'سوفت وير', en: 'Software' },
    security: { ar: 'أمن سيبراني', en: 'Security' },
    prices: { ar: 'أسعار', en: 'Prices' },
    guides: { ar: 'أدلة', en: 'Guides' }
  }
  return labels[category]?.[getLang()] || category
}

export { L }
