import type { AppData, Phone, SearchHit } from '../types'
import { faultGuides } from '../data/seed'
import { normalize, scoreMatch } from './utils'

export function phoneScore(phone: Phone, q: string): number {
  const fields: Array<[string, number]> = [
    [phone.name, 1.6], [phone.modelNumber, 1.5], [phone.codename, 1.4],
    [phone.brand, 1.1], [phone.series, 0.9], [String(phone.year ?? ''), 0.7],
    [phone.soc, 0.7], [phone.os, 0.5], [phone.displayType, 0.4], [phone.nameAr || '', 1.2],
  ]
  let best = 0
  for (const [value, weight] of fields) {
    if (!value) continue
    best = Math.max(best, scoreMatch(value, q) * weight)
  }
  if (best > 0) return best
  const n = normalize(q)
  const hay = normalize(`${phone.brand} ${phone.name} ${phone.modelNumber} ${phone.codename} ${phone.series} ${phone.year}`)
  if (n.split(' ').every(p => hay.includes(p))) return 12
  return 0
}

export function searchPhones(phones: Phone[], q: string): Phone[] {
  if (!q.trim()) return phones
  return phones
    .map(p => ({ p, s: phoneScore(p, q) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s || (b.p.year ?? 0) - (a.p.year ?? 0))
    .map(x => x.p)
}

export function globalSearch(data: AppData, query: string, perType = 5): SearchHit[] {
  const q = query.trim()
  if (!q) return []
  const hits: SearchHit[] = []

  for (const p of data.phones.filter(x => x.publishStatus === 'published')) {
    const s = phoneScore(p, q)
    if (s > 0) hits.push({
      id: p.id, type: 'phone', title: `${p.brand} ${p.name}`, badge: p.year ? String(p.year) : undefined,
      subtitle: [p.modelNumber, p.codename, p.soc].filter(Boolean).join(' • ') || p.series,
      path: `/phones/${p.id}`, score: s,
    })
  }

  for (const p of data.screenPrices.filter(x => x.publishStatus === 'published' && x.status === 'verified')) {
    const s = Math.max(scoreMatch(p.phoneName, q), scoreMatch(p.modelNumber, q), scoreMatch(p.brand, q))
    if (s > 0) hits.push({
      id: p.id, type: 'price', title: p.phoneName,
      subtitle: `${p.quality} • ${p.city} • ${p.supplier}`,
      badge: p.price ? String(p.price) : undefined, path: '/screens', score: s,
    })
  }

  for (const p of data.spareParts.filter(x => x.publishStatus === 'published')) {
    const s = Math.max(scoreMatch(p.name, q), scoreMatch(p.nameEn, q), scoreMatch(p.category, q), scoreMatch(p.brands.join(' '), q))
    if (s > 0) hits.push({
      id: p.id, type: 'part', title: p.name, subtitle: `${p.category} • ${p.brands.slice(0, 4).join(', ')}`,
      path: '/parts', score: s,
    })
  }

  for (const f of data.firmware.filter(x => x.publishStatus === 'published')) {
    const s = Math.max(scoreMatch(f.brand, q), scoreMatch(f.modelName, q), scoreMatch(f.modelNumber, q), scoreMatch(f.version, q))
    if (s > 0) hits.push({
      id: f.id, type: 'firmware', title: `${f.brand} — ${f.modelName}`,
      subtitle: `${f.version} • ${f.region} • ${f.sourceName}`, path: '/firmware', score: s,
    })
  }

  for (const a of data.articles.filter(x => x.publishStatus === 'published')) {
    const s = Math.max(
      scoreMatch(a.titleAr, q) * 1.3, scoreMatch(a.titleEn, q) * 1.2,
      scoreMatch(a.excerptAr, q), scoreMatch(a.excerptEn, q),
      scoreMatch(a.tags.join(' '), q),
    )
    if (s > 0) hits.push({
      id: a.id, type: 'article', title: a.titleAr,
      subtitle: a.titleEn, badge: a.category, path: `/articles/${a.slug}`, score: s,
    })
  }

  for (const f of faultGuides) {
    const s = Math.max(scoreMatch(f.titleAr, q) * 1.2, scoreMatch(f.titleEn, q), scoreMatch(f.symptoms.join(' '), q), scoreMatch(f.deviceType, q))
    if (s > 0) hits.push({
      id: f.id, type: 'fault', title: f.titleAr, subtitle: f.titleEn, path: `/faults#${f.id}`, score: s,
    })
  }

  const sort = (arr: SearchHit[]) => arr.sort((a, b) => b.score - a.score)
  const groups: SearchHit[] = []
  const types: SearchHit['type'][] = ['phone', 'firmware', 'article', 'fault', 'part', 'price']
  for (const type of types) groups.push(...sort(hits.filter(h => h.type === type)).slice(0, perType))
  return groups
}

export function countByType(hits: SearchHit[]) {
  return hits.reduce<Record<string, number>>((acc, h) => { acc[h.type] = (acc[h.type] || 0) + 1; return acc }, {})
}
