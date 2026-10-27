import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cacheDir = join(root, '.cache', 'gsmarena')
mkdirSync(cacheDir, { recursive: true })
mkdirSync(join(root, 'data'), { recursive: true })
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function get(url, { retries = 3 } = {}) {
  const key = Buffer.from(url).toString('base64url').slice(0, 160)
  const file = join(cacheDir, key + '.html')
  if (existsSync(file)) {
    const cached = readFileSync(file, 'utf8')
    if (cached.length > 5000 && !cached.includes('Turnstile check')) return cached
  }
  let last
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' }, signal: AbortSignal.timeout(30000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const html = await res.text()
      if (html.includes('Turnstile check')) throw new Error('Turnstile')
      writeFileSync(file, html)
      return html
    } catch (e) { last = e; await sleep(1200 * (i + 1)) }
  }
  throw new Error(`Failed ${url}: ${last?.message}`)
}

const sources = [
  { key: 'samsung', id: 9, pages: 5 },
  { key: 'xiaomi', id: 80, pages: 8 },
  { key: 'huawei', id: 58, pages: 4 },
  { key: 'honor', id: 121, pages: 4 },
  { key: 'oppo', id: 82, pages: 4 },
  { key: 'vivo', id: 98, pages: 4 },
  { key: 'realme', id: 118, pages: 4 },
  { key: 'oneplus', id: 95, pages: 4 },
  { key: 'apple', id: 48, pages: 3 },
  { key: 'tecno', id: 120, pages: 3 },
  { key: 'infinix', id: 119, pages: 3 },
  { key: 'itel', id: 131, pages: 3 },
  { key: 'zte', id: 62, pages: 6 },
  { key: 'motorola', id: 4, pages: 5 },
  { key: 'nokia', id: 1, pages: 4 },
  { key: 'lg', id: 20, pages: 3 },
  { key: 'google', id: 107, pages: 3 },
]

const brandNames = {
  samsung: 'Samsung', xiaomi: 'Xiaomi', huawei: 'Huawei', honor: 'Honor', oppo: 'OPPO', vivo: 'Vivo',
  realme: 'Realme', oneplus: 'OnePlus', apple: 'Apple iPhone', tecno: 'TECNO', infinix: 'Infinix', itel: 'itel',
  zte: 'ZTE', motorola: 'Motorola', nokia: 'Nokia', lg: 'LG', google: 'Google Pixel'
}

function parseList(html) {
  const out = []
  for (const m of html.matchAll(/<li><a href="([^"]+-\d+\.php)">[\s\S]*?<strong><span>([^<]+)<\/span>/g)) {
    out.push({ path: m[1], name: decode(m[2]) })
  }
  return out
}
function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&Prime;/g, '"').replace(/&thinsp;/g, ' ').replace(/&#x27;/g, "'").trim()
}
function clean(html) {
  if (!html) return ''
  return decode(html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim())
    .replace(/\n+/g, ' · ')
}
function isPhone(name) {
  return !/\b(Tab|Tablet|Watch|Band|Pad|Book|MatePad|MediaPad|iPad|Xpad|VistaTab|MagicPad|Fit|Buds|Router|Camera)\b/i.test(name)
}
function assignBrand(source, name) {
  if (source === 'xiaomi') {
    if (/^Redmi\b/i.test(name)) return 'Redmi'
    if (/^POCO\b/i.test(name) || /^Poco\b/i.test(name)) return 'POCO'
    return 'Xiaomi'
  }
  if (source === 'zte' && /^nubia\b/i.test(name)) return 'Nubia'
  return brandNames[source]
}
function seriesOf(name, brand) {
  const n = name.replace(/^Samsung\s+/i, '')
  if (brand === 'Samsung') {
    const m = n.match(/^Galaxy\s+(S|A|M|F|Z|Note)\b/i)
    return m ? `Galaxy ${m[1].toUpperCase()}` : 'Galaxy'
  }
  if (brand === 'Redmi') {
    const m = n.match(/^Redmi\s+(Note|A)\b/i)
    return m ? `Redmi ${m[1][0].toUpperCase()}${m[1].slice(1).toLowerCase()}` : 'Redmi'
  }
  if (brand === 'POCO') {
    const m = n.match(/^Poco\s+(X|F|M|C)\b/i)
    return m ? `POCO ${m[1].toUpperCase()}` : 'POCO'
  }
  if (brand === 'Apple iPhone') {
    const m = n.match(/iPhone\s+(\d+|SE|XR|XS|X)\b/i)
    return m ? `iPhone ${m[1].toUpperCase()}` : 'iPhone'
  }
  if (brand === 'Xiaomi') {
    const m = n.match(/^Xiaomi\s+(MIX|Pad|1\d|Mi\s*\d+)/i)
    return m ? `Xiaomi ${m[1].replace(/\s+/g, ' ')}` : 'Xiaomi'
  }
  const m = n.match(/^([A-Za-z]+(?:\s+[A-Za-z0-9]+)?)/)
  return m ? m[1] : brand
}

const popular = {
  samsung: ['Galaxy S25 Ultra', 'Galaxy S25', 'Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy Z Fold6', 'Galaxy Z Flip6', 'Galaxy A56', 'Galaxy A36', 'Galaxy A26', 'Galaxy A16', 'Galaxy M56', 'Galaxy M16', 'Galaxy S21 FE', 'Galaxy A54', 'Galaxy Note 20 Ultra'],
  xiaomi: ['Xiaomi 15 Ultra', 'Xiaomi 15', 'Xiaomi 14T Pro', 'Xiaomi 14 Ultra', 'Xiaomi 14', 'Redmi Note 14 Pro+', 'Redmi Note 14 Pro', 'Redmi Note 14', 'Redmi Note 13 Pro', 'Redmi 14C', 'Redmi 13C', 'Redmi A5', 'POCO X7 Pro', 'POCO X6 Pro', 'POCO F6 Pro', 'POCO F5', 'POCO M7 Pro', 'POCO C75', 'Redmi Note 13', 'Redmi 12'],
  huawei: ['Pura 70 Ultra', 'Pura 70 Pro', 'Mate 60 Pro', 'Mate X6', 'nova 13', 'nova 12', 'P60 Pro', 'P50 Pro', 'Mate 40 Pro', 'Y9a', 'nova 9'],
  honor: ['Magic 7 Pro', 'Magic 6 Pro', 'Magic V3', 'Honor 200 Pro', 'Honor 200', 'Honor X9c', 'Honor X8c', 'Honor 90', 'Honor X7c', 'Honor 50'],
  oppo: ['Find X8 Pro', 'Find X8', 'Find N5', 'Reno 13 Pro', 'Reno 12 Pro', 'Reno 11', 'A79', 'A78', 'A60', 'A5 Pro', 'A3 Pro', 'A18'],
  vivo: ['X200 Pro', 'X200', 'X100 Pro', 'V50', 'V40', 'V30', 'Y28', 'Y19s', 'Y18', 'Y17s', 'S19 Pro', 'T3 Ultra'],
  realme: ['GT 7 Pro', 'GT 6', 'Realme 14 Pro+', 'Realme 13 Pro+', 'Realme 12 Pro+', 'Realme 11 Pro', 'Realme Note 60', 'Realme C75', 'Realme C61', 'Realme C53', 'Realme Narzo 70'],
  oneplus: ['OnePlus 13', 'OnePlus 12', 'OnePlus 11', 'OnePlus Nord 4', 'OnePlus Nord CE4', 'OnePlus Nord 3', 'OnePlus 10 Pro', 'OnePlus 9 Pro', 'OnePlus 8T'],
  apple: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone SE'],
  tecno: ['Phantom V2 Fold', 'Phantom X2 Pro', 'Camon 30 Pro', 'Camon 30', 'Camon 20 Pro', 'Spark 30 Pro', 'Spark 20 Pro', 'Spark 20C', 'Pova 6 Pro', 'Pova 5 Pro', 'Pop 9'],
  infinix: ['Zero 40', 'Zero 30', 'Note 40 Pro', 'Note 40', 'Note 30 Pro', 'Hot 50 Pro', 'Hot 50', 'Hot 40i', 'Smart 9', 'GT 20 Pro'],
  itel: ['S24', 'S23', 'S18', 'A80', 'A70', 'A60', 'P55', 'P40', 'Power 70', 'City 100'],
  zte: ['Axon 60 Ultra', 'Axon 50 Ultra', 'Blade A75', 'Blade A55', 'Blade V60', 'Nubia Z60 Ultra', 'Nubia Z50', 'Nubia Neo 3', 'Nubia Flip', 'Nubia Red Magic 10 Pro', 'Nubia Red Magic 9 Pro', 'Nubia Music'],
  motorola: ['Edge 50 Ultra', 'Edge 50 Pro', 'Edge 50 Fusion', 'Razr 50 Ultra', 'Razr 50', 'Moto G84', 'Moto G64', 'Moto G54', 'Moto G34', 'Moto E14', 'Moto G Power'],
  nokia: ['XR21', 'X30', 'G42', 'G22', 'C32', 'C22', 'Nokia 8.3', 'Nokia 7.2', 'Nokia 105'],
  lg: ['LG Velvet', 'LG Wing', 'LG V60 ThinQ', 'LG G8 ThinQ', 'LG K92', 'LG Q92', 'LG Stylo 6'],
  google: ['Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 9 Pro Fold', 'Pixel 8a', 'Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7 Pro', 'Pixel 7', 'Pixel Fold', 'Pixel 6a'],
}

const entries = []
const bySource = {}
for (const s of sources) {
  const lists = []
  for (let p = 1; p <= s.pages; p++) {
    const url = p === 1 ? `https://www.gsmarena.com/${s.key}-phones-${s.id}.php` : `https://www.gsmarena.com/${s.key}-phones-f-${s.id}-0-p${p}.php`
    try {
      const html = await get(url)
      lists.push(...parseList(html))
      process.stderr.write(`[list] ${s.key} p${p} -> ${parseList(html).length}\n`)
    } catch (e) { process.stderr.write(`[list-fail] ${url} ${e.message}\n`) }
    await sleep(350)
  }
  const seen = new Set()
  const unique = lists.filter(x => !seen.has(x.path) && seen.add(x.path)).filter(x => isPhone(x.name))
  const hits = []
  for (const kw of (popular[s.key] || [])) {
    const hit = unique.find(x => x.name.toLowerCase().includes(kw.toLowerCase()) && !hits.includes(x))
    if (hit) hits.push(hit)
  }
  const chosen = [...hits]
  const remaining = unique.filter(x => !chosen.includes(x))
  if (s.key === 'xiaomi') {
    for (const sub of ['Redmi', 'POCO', 'Xiaomi']) {
      const pool = remaining.filter(x => assignBrand('xiaomi', x.name) === sub)
      const target = sub === 'Xiaomi' ? 12 : 14
      for (const x of pool) {
        const count = chosen.filter(y => assignBrand('xiaomi', y.name) === sub).length
        if (count >= target) break
        if (!chosen.includes(x)) chosen.push(x)
      }
    }
  } else if (s.key === 'zte') {
    for (const sub of ['ZTE', 'Nubia']) {
      const pool = remaining.filter(x => assignBrand('zte', x.name) === sub)
      const target = sub === 'Nubia' ? 16 : 12
      for (const x of pool) {
        const count = chosen.filter(y => assignBrand('zte', y.name) === sub).length
        if (count >= target) break
        if (!chosen.includes(x)) chosen.push(x)
      }
    }
  } else {
    const target = s.key === 'apple' ? 18 : 20
    for (const x of remaining) { if (chosen.length >= target) break; chosen.push(x) }
  }
  for (const item of chosen) entries.push({ ...item, source: s.key, brand: assignBrand(s.key, item.name) })
  const counts = {}
  for (const x of chosen) { const b = assignBrand(s.key, x.name); counts[b] = (counts[b] || 0) + 1 }
  process.stderr.write(`[pick] ${s.key} ${chosen.length} ${JSON.stringify(counts)} -> total ${entries.length}\n`)
}

const uniqueEntries = entries.filter((x, i, a) => a.findIndex(y => y.path === x.path) === i)
writeFileSync(join(root, 'data', 'harvest.json'), JSON.stringify(uniqueEntries, null, 1))
console.error(`Harvested ${uniqueEntries.length} phone candidates`)

if (process.argv.includes('--scrape')) {
  const specKeys = ['modelname','year','status','dimensions','weight','build','sim','displaytype','displaysize','displayresolution','displayprotection','os','chipset','cpu','gpu','internalmemory','memoryslot','battype-hl','batsize-hl','models','price','colors','nfc','usb','wlan','bluetooth','sensors','net5g','net4g','cam1modules','cam2modules','bodyother']
  const readSpec = (html, key) => {
    const re = new RegExp(`<[^>]*data-spec="${key}"[^>]*>([\\s\\S]*?)</(?:td|div|span|h1)>`, 'i')
    const m = html.match(re)
    return m ? clean(m[1]) : ''
  }
  const phones = []
  let n = 0
  for (const e of uniqueEntries) {
    n++
    try {
      const html = await get(`https://www.gsmarena.com/${e.path}`)
      const specs = {}
      for (const k of specKeys) specs[k] = readSpec(html, k)
      const name = clean(specs.modelname) || e.name
      const yearMatch = (specs.year || specs.status).match(/(19|20)\d{2}/)
      const year = yearMatch ? Number(yearMatch[0]) : null
      if (/rumored|cancelled|discontinued/i.test(specs.status) && !/Available/i.test(specs.status)) {
        process.stderr.write(`[skip-status] ${name} :: ${specs.status}\n`)
        continue
      }
      const priceText = specs.price
      const usd = priceText.match(/\$\s?([\d,]+(?:\.\d+)?)/)?.[1]?.replace(/,/g, '')
      const eur = priceText.match(/€\s?([\d,]+(?:\.\d+)?)/)?.[1]?.replace(/,/g, '')
      const slug = e.path.replace(/\.php$/, '').replace(/_/g, '-').replace(/\+/g, 'plus').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase()
      const battery = specs['battype-hl'] || specs['batsize-hl'] || ''
      const memory = [specs.internalmemory, specs.memoryslot].filter(Boolean).join(' · ')
      const charging = clean((html.match(/Charging<\/td>[\s\S]{0,400}?<td[^>]*>([\s\S]*?)<\/td>/i) || [])[1] || '')
      phones.push({
        slug,
        name,
        brand: e.brand,
        series: seriesOf(name, e.brand),
        model_number: specs.models || '',
        codename: '',
        release_year: year,
        announced: specs.year || '',
        status: specs.status || '',
        chipset: specs.chipset || '',
        cpu: specs.cpu || '',
        gpu: specs.gpu || '',
        display_type: specs.displaytype || '',
        display_size: specs.displaysize || '',
        display_resolution: specs.displayresolution || '',
        display_protection: specs.displayprotection || '',
        battery,
        charging,
        memory,
        storage: specs.internalmemory || '',
        os: specs.os || '',
        body: [specs.dimensions, specs.weight, specs.build].filter(Boolean).join(' · '),
        camera_main: specs.cam1modules || '',
        camera_selfie: specs.cam2modules || '',
        network: [specs.net5g && '5G', specs.net4g && '4G'].filter(Boolean).join(' / '),
        sim: specs.sim || '',
        nfc: specs.nfc || '',
        usb: specs.usb || '',
        colors: specs.colors || '',
        launch_price_text: priceText,
        launch_price_usd: usd ? Number(usd) : null,
        launch_price_eur: eur ? Number(eur) : null,
        measured: '',
        source_name: 'GSMArena',
        source_url: `https://www.gsmarena.com/${e.path}`,
        verified: 0,
        data_status: 'imported',
        software_info: specs.os ? `نظام التشغيل المعلن: ${specs.os}. تحقق من أحدث إصدار رسمي عبر بوابة الشركة.` : '',
        firmware_notes: '',
        common_faults: '',
        repair_methods: '',
        compatible_parts: '',
      })
      process.stderr.write(`[phone] ${n}/${uniqueEntries.length} ${name}\n`)
    } catch (err) {
      process.stderr.write(`[phone-fail] ${e.path} ${err.message}\n`)
    }
    await sleep(450)
  }
  writeFileSync(join(root, 'data', 'phones.raw.json'), JSON.stringify(phones, null, 1))
  console.error(`Scraped ${phones.length} phones -> data/phones.raw.json`)
}
