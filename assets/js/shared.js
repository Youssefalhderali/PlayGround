import { t, getLang, nf, df } from './i18n.js'
import {
  store, settings, content, phoneBySlug, articleTitle, articleExcerpt,
  brandDisplay, categoryLabel
} from './data.js'
import { icon, esc, phoneVisual, emptyState } from './ui.js'

export const serviceIcons = {
  repair: 'wrench', software: 'cpu', programming: 'code', cybersecurity: 'shield',
  tools: 'toolbox', firmware: 'download', models: 'smartphone', screens: 'display',
  parts: 'battery', faults: 'alert', guides: 'book', requests: 'clipboard', contact: 'message'
}

export const categoryIcons = {
  maintenance: 'wrench', software: 'cpu', security: 'shield', prices: 'tag', guides: 'book'
}

export const categoryOrder = ['maintenance', 'software', 'security', 'prices', 'guides']

export function part(value, length = 80) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  return text.length > length ? `${text.slice(0, length - 1)}…` : text
}

export function waNumber() {
  return String(settings().whatsapp || '967777066424').replace(/[^\d]/g, '')
}

export function waLink(message) {
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(message)}`
}

export function genericWa() {
  return waLink(getLang() === 'ar'
    ? 'مرحباً Brxvih، أرغب في استشارة فنية / طلب صيانة.'
    : 'Hello Brxvih, I would like technical advice / a repair request.')
}

export function requestWa(phone) {
  return waLink(getLang() === 'ar'
    ? `مرحباً Brxvih، لدي استفسار عن ${phone ? `${phone.brand} ${phone.name}` : 'جهاز'}.`
    : `Hello Brxvih, I have a question about ${phone ? `${phone.brand} ${phone.name}` : 'a device'}.`)
}

export function hashFor(path, params = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '' && value !== false) search.set(key, value)
  }
  const query = search.toString()
  return `#${path}${query ? `?${query}` : ''}`
}

export function articleDate(article) {
  return df(article.published_at, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function sortArticles(list) {
  return [...list].sort((a, b) => String(b.published_at || '').localeCompare(String(a.published_at || '')))
}

export function phoneCard(phone) {
  const fallbackSpec = part(phone.chipset || phone.display_size || phone.os, 34)
  const specs = [
    phone.display_size ? part(phone.display_size, 19) : '',
    phone.battery ? part(phone.battery, 18) : '',
    phone.memory ? part(phone.memory.replace(/,/g, ' ·'), 26) : ''
  ].filter(Boolean)
  return `<a class="phone-card" href="${hashFor(`/phone/${phone.slug}`)}" aria-label="${esc(phone.name)}">
    <div class="phone-media">
      <span class="phone-brand-tag">${esc(brandDisplay(phone.brand))}</span>
      ${phoneVisual(phone)}
      <span class="phone-year">${esc(phone.release_year || '—')}</span>
    </div>
    <div class="phone-body">
      <h3>${esc(phone.name)}</h3>
      <div class="phone-specs">${specs.length ? specs.map((spec) => `<span>${esc(spec)}</span>`).join('') : `<span>${esc(fallbackSpec || t('phones.partial'))}</span>`}</div>
      <div class="phone-foot"><span>${esc(phone.model_number || phone.series || phone.brand)}</span>${icon('arrow-up-right')}</div>
    </div>
  </a>`
}

export function articleCard(article) {
  return `<a class="card card-link article-card" href="${hashFor(`/article/${article.slug}`)}">
    <span class="card-num">${esc(article.slug.slice(0, 2).toUpperCase())}</span>
    <div class="article-top">
      <span class="category-tag">${esc(categoryLabel(article.category))}</span>
      <span class="icon-badge">${icon(categoryIcons[article.category] || 'book')}</span>
    </div>
    <h3>${esc(articleTitle(article))}</h3>
    <p>${esc(articleExcerpt(article))}</p>
    <div class="article-foot"><span>${esc(nf(article.readMinutes || 3))} ${esc(t('minutes'))}</span><span>${icon('arrow-up-right')}</span></div>
  </a>`
}

export function articleRow(article, index) {
  return `<a class="article-row" href="${hashFor(`/article/${article.slug}`)}">
    <span class="article-row-index">${String(index + 1).padStart(2, '0')} / ${esc(article.category)}</span>
    <div><h3>${esc(articleTitle(article))}</h3><p>${esc(articleExcerpt(article))}</p></div>
    <div class="article-row-meta"><span>${esc(categoryLabel(article.category))}</span><span>${esc(nf(article.readMinutes || 3))} ${esc(t('minutes'))}</span></div>
  </a>`
}

export function ticker() {
  const brands = (content().brands || []).slice(0, 8).map((brand) => brand.nameEn)
  const items = [
    ['MODEL INDEX', `${nf(store.phones.length)} DEVICES`],
    ['BRANDS', brands.slice(0, 5).join(' · ')],
    ['FIRMWARE', `${nf((content().firmwareSources || []).length)} SOURCES`],
    ['GUIDES', `${nf((content().articles || []).length)} FIELD NOTES`],
    ['SECURITY', 'DEFENSIVE ONLY'],
    ['PRICES', 'SUPPLIER VERIFIED']
  ]
  const markup = items.map(([label, value]) => `<span class="ticker-item">${icon('spark')} <b>${esc(label)}</b> ${esc(value)} <i></i></span>`).join('')
  return `<div class="ticker" aria-hidden="true"><div class="ticker-track">${markup}${markup}</div></div>`
}

export function featuredPhones(limit = 8) {
  const chosen = []
  const brands = new Set()
  for (const phone of store.phones) {
    if (!phone.image_url || brands.has(phone.brand)) continue
    chosen.push(phone)
    brands.add(phone.brand)
    if (chosen.length >= limit) break
  }
  for (const phone of store.phones) {
    if (chosen.length >= limit) break
    if (!chosen.includes(phone) && phone.image_url) chosen.push(phone)
  }
  return chosen
}

export function pagination(page, pages, params, path = '/phones') {
  if (pages <= 1) return ''
  const make = (target, label, active = false, disabled = false) => {
    const next = new URLSearchParams(params.toString())
    if (target === 1) next.delete('page')
    else next.set('page', String(target))
    const href = `${hashFor(path)}${next.toString() ? `?${next.toString()}` : ''}`
    return `<a class="page-btn ${active ? 'active' : ''}" href="${href}" ${active ? 'aria-current="page"' : ''} ${disabled ? 'aria-disabled="true" tabindex="-1"' : ''}>${label}</a>`
  }
  const numbers = []
  for (let index = 1; index <= pages; index += 1) {
    if (index === 1 || index === pages || Math.abs(index - page) <= 1) numbers.push(index)
    else if (numbers[numbers.length - 1] !== '...') numbers.push('...')
  }
  return `<nav class="pagination" aria-label="pagination">
    ${make(page - 1, icon(getLang() === 'ar' ? 'chevron-right' : 'chevron-left'), false, page <= 1)}
    ${numbers.map((number) => number === '...' ? `<span class="page-ellipsis">…</span>` : make(number, String(number), number === page)).join('')}
    ${make(page + 1, icon(getLang() === 'ar' ? 'chevron-left' : 'chevron-right'), false, page >= pages)}
  </nav>`
}

export function notFoundView() {
  return `<div class="page"><div class="shell" style="padding-block:100px">${emptyState(
    'alert',
    getLang() === 'ar' ? 'الصفحة غير موجودة' : 'Page not found',
    getLang() === 'ar' ? 'الرابط غير صحيح أو أُزيل.' : 'The link is incorrect or was removed.',
    `<a class="btn btn-sm" href="#/">${esc(t('home'))}</a>`
  )}</div></div>`
}

export function articleTitleFromSlug(slug) {
  const article = phoneBySlug(slug)
  return article ? article.name : ''
}
