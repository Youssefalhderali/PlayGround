import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cache = join(root, '.cache')
const repo = join(cache, 'gsmrepo')
const outDir = join(root, 'data')
mkdirSync(outDir, { recursive: true })
if (!existsSync(repo)) throw new Error('Missing .cache/gsmrepo')

const brandNames = {
  samsung: 'Samsung', xiaomi: 'Xiaomi', huawei: 'Huawei', honor: 'Honor', oppo: 'OPPO', vivo: 'Vivo',
  realme: 'Realme', oneplus: 'OnePlus', apple: 'Apple iPhone', motorola: 'Motorola', nokia: 'Nokia',
  google: 'Google Pixel', nothing: 'Nothing', tecno: 'TECNO', infinix: 'Infinix', itel: 'itel',
  zte: 'ZTE', nubia: 'Nubia', lg: 'LG', sony: 'Sony', poco: 'POCO', redmi: 'Redmi'
}
const strip = s => String(s ?? '').replace(/\s+/g, ' ').replace(/[\u00a0\t]/g, ' ').trim()
const norm = s => strip(s).toLowerCase().replace(/[^a-z0-9]+/g, '').trim()
const slugify = s => String(s).toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
const yearOf = s => { const m = String(s || '').match(/(19|20)\d{2}/); return m ? Number(m[0]) : null }
const isPhone = name => !/(Tab|Tablet|Watch|Band|Pad|Book|Buds|Router|Camera|Smart TV|Projector|iPad|VistaTab|MagicPad|MatePad|MediaPad|RedMagic Watch|Nord Watch)/i.test(name)
const priceParts = p => {
  const t = String(p || '')
  const usd = t.match(/\$\s?([\d,]+(?:\.\d+)?)/), eur = t.match(/€\s?([\d,]+(?:\.\d+)?)/)
  return { usd: usd ? Number(usd[1].replace(/,/g, '')) : null, eur: eur ? Number(eur[1].replace(/,/g, '')) : null }
}

function brandFor(rawBrand, name) {
  const b = String(rawBrand || '').toLowerCase()
  if (b === 'xiaomi' || b === 'redmi' || b === 'poco') {
    if (/^Redmi\b/i.test(name)) return 'Redmi'
    if (/^POCO\b|^Poco\b/i.test(name)) return 'POCO'
    return 'Xiaomi'
  }
  if (b === 'zte' && /^Nubia\b/i.test(name)) return 'Nubia'
  if (b === 'apple') return 'Apple iPhone'
  if (b === 'google') return 'Google Pixel'
  return brandNames[b] || strip(rawBrand)
}
function modelNameOf(name, brand) {
  let n = strip(name)
  n = n.replace(/^Samsung\s+/i, '').replace(/^Apple\s+/i, '').replace(/^Google\s+/i, '')
  n = n.replace(new RegExp('^' + brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+', 'i'), '')
  return n
}
function seriesFor(name, brand) {
  if (brand === 'Samsung') { const m = name.match(/Galaxy\s+(S|A|M|F|Z|Note|Xcover)\b/i); return m ? `Galaxy ${m[1].toUpperCase()}` : 'Galaxy' }
  if (brand === 'Apple iPhone') { const m = name.match(/iPhone\s+(\d+|SE|XR|XS|X)\b/i); return m ? `iPhone ${m[1].toUpperCase()}` : 'iPhone' }
  if (brand === 'Redmi') { const m = name.match(/Redmi\s+(Note|A)\b/i); return m ? `Redmi ${m[1][0].toUpperCase() + m[1].slice(1).toLowerCase()}` : 'Redmi' }
  if (brand === 'POCO') { const m = name.match(/POCO\s+(X|F|M|C)\b/i); return m ? `POCO ${m[1].toUpperCase()}` : 'POCO' }
  if (brand === 'Xiaomi') { const m = name.match(/Xiaomi\s+(MIX|Pad|\d+)/i); return m ? `Xiaomi ${m[1].toUpperCase()}` : 'Xiaomi' }
  if (brand === 'Google Pixel') { const m = name.match(/Pixel\s+(\d+|[A-Z])/i); return m ? `Pixel ${m[1].toUpperCase()}` : 'Pixel' }
  return name.split(/\s+/).slice(0, 2).join(' ') || brand
}
function normalizeKey(brand, name, year) {
  return brand + '|' + norm(modelNameOf(name, brand)) + '|' + year
}

// Enrichment: recent phone specs (display type, image) and older CSV
const phoneJson = JSON.parse(readFileSync('/tmp/pa.json', 'utf8'))
const displayByUrl = new Map()
const recentByKey = new Map()
for (const p of phoneJson) {
  if (!p.gsmarena_url) continue
  const key = norm(p.gsmarena_url.replace(/https?:\/\/(www\.)?gsmarena\.com\//, '').replace(/\.php$/, '').replace(/-\d+$/, ''))
  if (p.screen_type) displayByUrl.set(key, p.screen_type)
  const brand = p.brand === 'Apple' ? 'Apple iPhone' : p.brand === 'Google' ? 'Google Pixel' : brandFor(p.brand, p.model_name || p.model)
  const year = yearOf(p.launch_date)
  if (year) recentByKey.set(normalizeKey(brand, p.model_name || p.model, year), p)
}
const csvDevices = JSON.parse(readFileSync(join(outDir, 'csv-devices.json'), 'utf8'))
const csvDisplay = new Map()
for (const r of csvDevices) {
  const brand = brandFor(r._brand_raw, r['Model Name'])
  const key = normalizeKey(brand, r['Model Name'], r._year)
  if (r.Type) csvDisplay.set(key, r.Type)
}

const phones = new Map()
function addPhone(p) {
  if (!p.name || !p.slug || !p.release_year) return null
  if (!isPhone(p.name)) return null
  let key = normalizeKey(p.brand, p.name, p.release_year)
  if (phones.has(key)) return phones.get(key)
  phones.set(key, p)
  return p
}
function enrich(p, extra) {
  if (!p || !extra) return p
  for (const k of ['display_type', 'display_refresh', 'image_url', 'display_size', 'display_resolution', 'chipset', 'battery', 'memory', 'os', 'charging']) {
    if (!p[k] && extra[k]) p[k] = extra[k]
  }
  return p
}

// 1) Full GSMArena per-device dataset (2022+)
const rawDir = join(repo, 'data')
const files = []
for (const folder of readdirSync(rawDir)) {
  let entries = []
  try { entries = readdirSync(join(rawDir, folder)) } catch { continue }
  for (const f of entries) if (f.endsWith('.json') && f !== 'index.json') files.push(join(rawDir, folder, f))
}
let n = 0
for (const file of files) {
  let d
  try { d = JSON.parse(readFileSync(file, 'utf8')) } catch { continue }
  const folder = basename(dirname(file))
  const name = strip(d.name)
  const specs = d.specifications || {}
  const year = yearOf(specs.Announced || specs.Status)
  if (!name || !year || year < 2022 || /rumored|cancelled/i.test(specs.Status || '')) continue
  const brand = brandFor(folder, name)
  const url = d.url || ''
  const urlKey = norm(url.replace(/https?:\/\/(www\.)?gsmarena\.com\//, '').replace(/\.php$/, '').replace(/-\d+$/, ''))
  const slug = slugify(url.replace(/https?:\/\/(www\.)?gsmarena\.com\//, '').replace(/\.php$/, '') || name)
  const price = priceParts(specs.Price)
  const extra = recentByKey.get(normalizeKey(brand, name, year))
  const displayType = extra?.screen_type || displayByUrl.get(urlKey) || csvDisplay.get(normalizeKey(brand, name, year)) || ''
  const p = addPhone({
    slug, name, model_name: modelNameOf(name, brand), brand, series: seriesFor(name, brand),
    model_number: strip(specs.Models || ''), codename: '', release_year: year,
    announced: strip(specs.Announced || ''), status: strip(specs.Status || ''),
    chipset: strip(specs.Chipset || ''), cpu: strip(specs.CPU || ''), gpu: strip(specs.GPU || ''),
    display_type: displayType, display_size: strip(specs.Size || ''), display_resolution: strip(specs.Resolution || ''),
    display_protection: strip(specs.Protection || ''), display_refresh: extra?.refresh_rate || '',
    battery: strip(specs.Type || ''), charging: strip(specs.Charging || ''),
    memory: strip(specs.Internal || ''), storage: strip(specs.Internal || ''),
    os: strip(specs.OS || ''), body: strip([specs.Dimensions, specs.Weight, specs.Build].filter(Boolean).join(' · ')),
    camera_main: strip(specs.Quad || specs.Triple || specs.Dual || specs.Single || ''),
    camera_selfie: strip(specs.Single || ''),
    network: strip([specs.Technology, specs['5G bands'] ? '5G' : ''].filter(Boolean).join(' · ')),
    sim: strip(specs.SIM || ''), nfc: strip(specs.NFC || ''), usb: strip(specs.USB || ''), colors: strip(specs.Colors || ''),
    launch_price_text: strip(specs.Price || ''), launch_price_usd: price.usd, launch_price_eur: price.eur,
    image_url: extra?.image_url || '', source_name: 'GSMArena', source_url: url, verified: 0,
    data_status: displayType ? 'imported' : 'partial', software_info: strip(specs.OS || ''),
    firmware_notes: '', common_faults: '', repair_methods: '', compatible_parts: '',
    tags: [brand, seriesFor(name, brand), String(year)].join(','),
  })
  if (p) { n++; if (extra) enrich(p, { display_type: extra.screen_type, display_refresh: extra.refresh_rate, image_url: extra.image_url }) }
}
console.log('gsmarena 2022+', phones.size)

// 2) Recent curated phones (phones.json) for 2021+, fills display type and images
let addedRecent = 0
for (const x of phoneJson) {
  const year = yearOf(x.launch_date)
  if (!year || year < 2021) continue
  const brand = x.brand === 'Apple' ? 'Apple iPhone' : x.brand === 'Google' ? 'Google Pixel' : brandFor(x.brand, x.model_name || x.model)
  const name = strip(x.model_name || x.model)
  if (!name || !isPhone(name)) continue
  if (/\bSE 4\b|iPhone 18|Xiaomi 16 Pro/i.test(name)) continue
  const sourceUrl = String(x.gsmarena_url || '')
  const urlSlug = norm(sourceUrl.replace(/https?:\/\/(www\.)?gsmarena\.com\//, '').replace(/\.php$/, ''))
  const brandToken = brand === 'Apple iPhone' ? 'apple' : brand === 'Google Pixel' ? 'google' : brand.toLowerCase().split(' ')[0]
  if (!sourceUrl.includes('gsmarena.com') || /watch|pad|tab|book|buds|band/.test(urlSlug)) continue
  if (!urlSlug.includes(brandToken)) continue
  const tokens = norm(name).replace(norm(brandToken), '')
  const nums = (tokens.match(/\d+/g) || [])
  if (nums.length && !nums.some(n => urlSlug.includes(n))) continue
  if (/flip/i.test(name) && !urlSlug.includes('flip')) continue
  if (/fold/i.test(name) && !urlSlug.includes('fold')) continue
  const key = normalizeKey(brand, name, year)
  if (phones.has(key)) { enrich(phones.get(key), { display_type: x.screen_type, display_refresh: x.refresh_rate, image_url: x.image_url }); continue }
  const price = Number(x.price_usd) || null
  const slug = slugify((x.gsmarena_slug || brand + '-' + modelNameOf(name, brand)) + '-' + (x.gsmarena_id || year) + '-r')
  const p = addPhone({
    slug, name, model_name: modelNameOf(name, brand), brand, series: seriesFor(name, brand), model_number: '',
    codename: '', release_year: year, announced: strip(x.launch_date || ''), status: 'Available',
    chipset: strip(x.chipset || ''), cpu: strip(x.cpu_cores || ''), gpu: strip(x.gpu || ''),
    display_type: strip(x.screen_type || ''), display_size: strip(x.screen_size || ''), display_resolution: strip(x.resolution || ''),
    display_protection: '', display_refresh: strip(x.refresh_rate || ''), battery: strip(x.battery_capacity || ''),
    charging: strip([x.charging_wired, x.charging_wireless].filter(Boolean).join(' · ')),
    memory: strip([x.ram, x.storage].filter(Boolean).join(' / ')), storage: strip(x.storage || ''), os: strip(x.os || ''),
    body: strip([x.dimensions, x.weight].filter(Boolean).join(' · ')),
    camera_main: strip(x.rear_camera_specs || x.rear_camera_main || ''), camera_selfie: strip(x.front_camera || ''),
    network: x.network_5g ? '5G' : '4G', sim: strip(x.sim_type || ''), nfc: x.nfc ? 'Yes' : 'No', usb: '', colors: '',
    launch_price_text: price ? '$' + price : '', launch_price_usd: price, launch_price_eur: null,
    image_url: strip(x.image_url || ''), source_name: 'GSMArena', source_url: strip(x.gsmarena_url || ''), verified: 0,
    data_status: 'imported', software_info: strip(x.os || ''), firmware_notes: '', common_faults: '', repair_methods: '',
    compatible_parts: '', tags: [brand, seriesFor(name, brand), String(year)].join(','),
  })
  if (p) addedRecent++
}
console.log('added recent phones.json', addedRecent, 'total', phones.size)

// 3) CSV dataset for 2018-2021 (complete specs, display type)
let addedCsv = 0
for (const r of csvDevices) {
  const name = strip(r._name)
  const year = r._year
  if (!name || !year || year > 2021) continue
  const brand = brandFor(r._brand_raw, name)
  const key = normalizeKey(brand, name, year)
  if (phones.has(key)) continue
  const slug = slugify('gsm-' + brand + '-' + modelNameOf(name, brand) + '-' + year)
  const price = priceParts(r.Price)
  const p = addPhone({
    slug, name, model_name: modelNameOf(name, brand), brand, series: seriesFor(name, brand), model_number: strip(r.Models || ''),
    codename: '', release_year: year, announced: strip(r.Announced || ''), status: strip(r.Status || ''),
    chipset: strip(r.Chipset || ''), cpu: strip(r.CPU || ''), gpu: strip(r.GPU || ''),
    display_type: strip(r.Type || ''), display_size: strip(r.Size || ''), display_resolution: strip(r.Resolution || ''),
    display_protection: strip(r.Protection || ''), display_refresh: '', battery: strip(r.Type_1 || ''),
    charging: strip(r.Charging || ''), memory: strip(r.Internal || ''), storage: strip(r.Internal || ''), os: strip(r.OS || ''),
    body: strip([r.Dimensions, r.Weight, r.Build].filter(Boolean).join(' · ')),
    camera_main: strip(r.Quad || r.Triple || r.Dual || r.Single || ''), camera_selfie: strip(r.Single || ''),
    network: strip([r.Technology, r['5G bands'] ? '5G' : ''].filter(Boolean).join(' · ')), sim: strip(r.SIM || ''),
    nfc: strip(r.NFC || ''), usb: strip(r.USB || ''), colors: strip(r.Colors || ''), launch_price_text: strip(r.Price || ''),
    launch_price_usd: price.usd, launch_price_eur: price.eur, image_url: strip(r['Model Image'] || ''),
    source_name: 'GSMArena', source_url: strip(r.Url || ''), verified: 0, data_status: 'imported',
    software_info: strip(r.OS || ''), firmware_notes: '', common_faults: '', repair_methods: '', compatible_parts: '',
    tags: [brand, seriesFor(name, brand), String(year)].join(','),
  })
  if (p) addedCsv++
}
console.log('added csv 2018-2021', addedCsv, 'total', phones.size)

// 4) itel partial data from cached GSMArena listing
const listingDir = join(cache, 'gsmarena')
let addedItel = 0
if (existsSync(listingDir)) {
  let html = ''
  for (const f of readdirSync(listingDir)) {
    if (!f.endsWith('.html')) continue
    try {
      const u = Buffer.from(f.slice(0, -5), 'base64url').toString()
      if (u.includes('itel-phones')) html += readFileSync(join(listingDir, f), 'utf8')
    } catch {}
  }
  for (const m of html.matchAll(/<li><a href="([^"]+-\d+\.php)"><img[^>]*title="([^"]*)"[\s\S]*?<strong><span>([^<]+)<\/span>/g)) {
    const path = m[1], desc = strip(m[2]), rawName = strip(m[3].replace(/&amp;/g, '&'))
    if (!rawName || !isPhone(rawName)) continue
    const year = yearOf(desc) || 2024
    if (year < 2018) continue
    const name = 'itel ' + rawName.replace(/^itel\s+/i, '')
    const key = normalizeKey('itel', name, year)
    if (phones.has(key)) continue
    const display = (desc.match(/Features\s+([\d.]+)("|″|&Prime;)/i) || [])[1] || ''
    const chip = (desc.match(/Features[^,]*,\s*([^,]+?)\s+chipset/i) || [])[1] || ''
    const bat = (desc.match(/([\d,]+)\s*mAh\s+battery/i) || [])[1] || ''
    const storage = (desc.match(/([\d]+)\s*GB\s+storage/i) || [])[1] || ''
    const ram = (desc.match(/([\d]+)\s*GB\s+RAM/i) || [])[1] || ''
    const p = addPhone({
      slug: slugify('itel-' + rawName + '-' + path.replace(/\.php$/, '').slice(-6)), name, model_name: rawName,
      brand: 'itel', series: 'itel', model_number: '', codename: '', release_year: year,
      announced: strip(desc.replace(/^.*?Announced\s*/, '').split('.')[0] || ''), status: /Available|Released/i.test(desc) ? 'Available' : '',
      chipset: strip(chip), cpu: '', gpu: '', display_type: '', display_size: display ? display + '"' : '',
      display_resolution: '', display_protection: '', display_refresh: '', battery: bat ? bat + ' mAh' : '', charging: '',
      memory: [storage ? storage + 'GB' : '', ram ? ' · ' + ram + 'GB RAM' : ''].filter(Boolean).join(''), storage: storage ? storage + 'GB' : '',
      os: '', body: '', camera_main: '', camera_selfie: '', network: /5G/i.test(desc) ? '5G' : '', sim: '', nfc: '', usb: '',
      colors: '', launch_price_text: '', launch_price_usd: null, launch_price_eur: null, image_url: '',
      source_name: 'GSMArena (قائمة الموديلات)', source_url: 'https://www.gsmarena.com/' + path, verified: 0,
      data_status: 'partial', software_info: '', firmware_notes: '', common_faults: '', repair_methods: '',
      compatible_parts: '', tags: ['itel', 'itel', String(year)].join(','),
    })
    if (p) addedItel++
  }
}
console.log('added itel', addedItel, 'total', phones.size)

// Final enrichment + cleanup
for (const p of phones.values()) {
  if (!p.display_type) {
    const d = csvDisplay.get(normalizeKey(p.brand, p.name, p.release_year))
    if (d) p.display_type = d
  }
  if (!p.display_type && recentByKey.get(normalizeKey(p.brand, p.name, p.release_year))?.screen_type) {
    p.display_type = recentByKey.get(normalizeKey(p.brand, p.name, p.release_year)).screen_type
  }
  p.data_status = p.display_type && p.chipset && p.model_number ? 'imported' : 'partial'
  p.tags = [p.brand, p.series, String(p.release_year)].join(',')
  delete p.display
  delete p.storage
  if (!p.software_info) p.software_info = p.os
}

const list = [...phones.values()].sort((a, b) => (b.release_year - a.release_year) || a.name.localeCompare(b.name))
const slugSeen = new Map()
for (const p of list) {
  const base = p.slug || slugify(p.brand + '-' + p.name + '-' + p.release_year)
  let slug = base, i = 2
  while (slugSeen.has(slug)) { slug = base + '-' + i; i++ }
  p.slug = slug
  slugSeen.set(slug, p)
}
writeFileSync(join(outDir, 'phones.json'), JSON.stringify(list))
const counts = {}
for (const p of list) counts[p.brand] = (counts[p.brand] || 0) + 1
writeFileSync(join(outDir, 'phone-stats.json'), JSON.stringify({ total: list.length, counts, generated: new Date().toISOString(), sources: ['GSMArena via sksalapur/gsmarena-scraper (MIT)', 'GSMArena via rinehartwang1979/phone-specs-api', 'GSMArena via foykes/gsm-arena-dataset'] }, null, 2))
console.log('TOTAL', list.length)
console.log(counts)
const withImage = list.filter(p => p.image_url).length
const withType = list.filter(p => p.display_type).length
console.log({ withImage, withType, withModel: list.filter(p => p.model_number).length })
