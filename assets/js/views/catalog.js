import { t, getLang, nf, df, money } from '../i18n.js'
import {
  store, settings, content, phoneBySlug, brandInfo, brandDisplay,
  firmwareSourcesFor, firmwareNote, articlesForPhone, relatedPhones,
  articleTitle, categoryLabel, mergePrices, partLabel, qualityLabel
} from '../data.js'
import { listPrices } from '../db.js'
import {
  icon, esc, phoneVisual, emptyState, pageHeader, breadcrumb, safeUrl,
  shareLink, copyText
} from '../ui.js'
import {
  hashFor, phoneCard, pagination, notFoundView, requestWa, waLink,
  articleRow, sortArticles
} from '../shared.js'

const PER_PAGE = 24

export function phonesView(params, overrideBrand = '') {
  const q = params.get('q') || ''
  const brand = overrideBrand || params.get('brand') || ''
  const year = params.get('year') || ''
  const sort = params.get('sort') || 'relevance'
  const page = Math.max(1, Number(params.get('page')) || 1)
  const query = String(q).toLowerCase().trim()
  const terms = query.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(/\s+/).filter(Boolean)
  let list = store.phones
  if (brand) list = list.filter((phone) => phone.brand === brand)
  if (year) list = list.filter((phone) => String(phone.release_year) === String(year))
  if (terms.length) {
    list = list.filter((phone) => {
      const text = `${phone.name} ${phone.brand} ${phone.series} ${phone.model_number} ${phone.chipset}`
        .toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^\p{L}\p{N}]+/gu, ' ')
      return terms.every((term) => text.includes(term))
    })
  }
  if (sort === 'newest') list = [...list].sort((a, b) => (Number(b.release_year) || 0) - (Number(a.release_year) || 0) || a.name.localeCompare(b.name))
  else if (sort === 'oldest') list = [...list].sort((a, b) => (Number(a.release_year) || 0) - (Number(b.release_year) || 0) || a.name.localeCompare(b.name))
  else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  const total = list.length
  const pages = Math.max(1, Math.ceil(total / PER_PAGE))
  const safePage = Math.min(page, pages)
  const rows = list.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const brandData = brandInfo(brand)
  const heading = overrideBrand ? (getLang() === 'ar' ? brandData.nameAr : brandData.nameEn) : t('phones.title')
  const lead = overrideBrand
    ? (getLang() === 'ar' ? `كل موديلات ${brandData.nameAr} في الفهرس، مع فلترة وبحث.` : `Every ${brandData.nameEn} model in the index, with search and filters.`)
    : t('phones.lead')
  const brands = [...store.brandGroups.keys()].sort((a, b) => a.localeCompare(b))
  const years = store.years.slice(0, 30)
  const pageParams = new URLSearchParams(params.toString())
  if (brand && !pageParams.get('brand')) pageParams.set('brand', brand)
  return `<div class="page">
    ${pageHeader({
      kicker: `MODEL INDEX / ${nf(store.phones.length)}`,
      title: heading,
      lead,
      side: `<p>${esc(t('phones.lead'))}</p><div class="page-head-meta"><span class="pill">${nf(total)} ${esc(t('phones.result'))}</span><span class="pill">${nf(store.brandGroups.size)} ${esc(t('home.statBrands'))}</span><span class="pill signal">${esc(t('source'))} · GSMArena</span></div>`
    })}
    <div class="shell">
      <form class="filters" id="phone-filters">
        <div class="field search-field"><label class="sr-only" for="phone-q">${esc(t('search'))}</label>${icon('search')}<input class="input" id="phone-q" name="q" type="search" value="${esc(q)}" placeholder="${esc(t('phones.searchPlaceholder'))}" autocomplete="off"></div>
        <label class="field"><span class="field-label">${esc(t('phones.brand'))}</span><select class="select" name="brand"><option value="">${esc(t('phones.allBrands'))}</option>${brands.map((name) => `<option value="${esc(name)}" ${name === brand ? 'selected' : ''}>${esc(brandDisplay(name))} (${nf(store.brandGroups.get(name)?.length || 0)})</option>`).join('')}</select></label>
        <label class="field"><span class="field-label">${esc(t('phones.year'))}</span><select class="select" name="year"><option value="">${esc(t('phones.allYears'))}</option>${years.map((value) => `<option value="${value}" ${String(value) === String(year) ? 'selected' : ''}>${value}</option>`).join('')}</select></label>
        <label class="field"><span class="field-label">${esc(t('sort'))}</span><select class="select" name="sort">
          <option value="relevance" ${sort === 'relevance' ? 'selected' : ''}>${esc(t('phones.sortRelevance'))}</option>
          <option value="newest" ${sort === 'newest' ? 'selected' : ''}>${esc(t('phones.sortNewest'))}</option>
          <option value="oldest" ${sort === 'oldest' ? 'selected' : ''}>${esc(t('phones.sortOldest'))}</option>
          <option value="name" ${sort === 'name' ? 'selected' : ''}>${esc(t('phones.sortName'))}</option>
        </select></label>
        <button class="btn btn-sm" type="submit">${esc(t('apply'))}</button>
      </form>
      <div class="results-bar"><span>${esc(t('showing'))} <b>${nf(rows.length)}</b> ${esc(t('of'))} <b>${nf(total)}</b> ${esc(t('phones.result'))}</span><div class="results-actions"><span class="mono-label">PAGE ${safePage} / ${pages}</span></div></div>
      ${rows.length
        ? `<div class="phones-grid">${rows.map(phoneCard).join('')}</div>${pagination(safePage, pages, pageParams, '/phones')}`
        : emptyState('search', t('phones.emptyTitle'), t('phones.emptyDesc'), `<a class="btn btn-sm" href="#/phones">${esc(t('phones.resetFilters'))}</a>`)}
    </div>
  </div>`
}

export function bindPhones(root, { onNavigate } = {}) {
  const form = root.querySelector('#phone-filters')
  if (!form) return
  const apply = ({ fromInput = false } = {}) => {
    const data = new FormData(form)
    const next = {}
    for (const key of ['q', 'brand', 'year', 'sort']) {
      const value = String(data.get(key) || '').trim()
      if (key === 'sort' && value === 'relevance') continue
      if (value) next[key] = value
    }
    const hash = hashFor('/phones', next)
    onNavigate?.(hash, { preserveScroll: fromInput, focus: fromInput ? '#phone-q' : '' })
  }
  form.addEventListener('submit', (event) => { event.preventDefault(); apply() })
  form.querySelectorAll('select').forEach((select) => select.addEventListener('change', () => apply()))
  const search = form.querySelector('#phone-q')
  let timer
  search?.addEventListener('input', () => {
    clearTimeout(timer)
    timer = setTimeout(() => apply({ fromInput: true }), 380)
  })
}

function specValue(value) {
  return esc(value).replace(/\n/g, '<br>')
}

function specGroups(phone) {
  const groups = [
    ['phone.overview', [
      [t('brand'), brandDisplay(phone.brand)],
      [t('phone.modelNumber'), phone.model_number],
      [t('phone.codename'), phone.codename],
      [t('phone.announced'), phone.announced],
      [t('phone.status'), phone.status],
      [t('phone.launchPrice'), phone.launch_price_text],
      [t('colors'), phone.colors]
    ]],
    ['phone.display', [
      [t('phone.display'), phone.display_type],
      ['Size', phone.display_size],
      ['Resolution', phone.display_resolution],
      ['Protection', phone.display_protection],
      ['Refresh', phone.display_refresh]
    ]],
    ['phone.performance', [
      ['Chipset', phone.chipset],
      ['CPU', phone.cpu],
      ['GPU', phone.gpu],
      ['RAM / Storage', phone.memory],
      [t('phone.software'), phone.os]
    ]],
    ['phone.camera', [
      [t('phone.camera'), phone.camera_main],
      ['Selfie', phone.camera_selfie]
    ]],
    ['phone.battery', [
      [t('battery'), phone.battery],
      ['Charging', phone.charging]
    ]],
    ['phone.connectivity', [
      ['Network', phone.network],
      ['SIM', phone.sim],
      ['NFC', phone.nfc],
      ['USB', phone.usb]
    ]],
    ['phone.body', [
      [t('phone.body'), phone.body]
    ]],
    ['phone.extras', [
      [t('phone.software'), phone.software_info],
      ['Firmware', phone.firmware_notes],
      ['Common faults', phone.common_faults],
      ['Repair', phone.repair_methods],
      ['Parts', phone.compatible_parts]
    ]]
  ]
  return groups.map(([titleKey, rows], index) => {
    const filtered = rows.filter(([, value]) => value && String(value).trim())
    if (!filtered.length) return ''
    return `<details class="spec-group" ${index < 2 ? 'open' : ''}>
      <summary><span>${esc(t(titleKey))}</span>${icon('chevron-down')}</summary>
      <dl class="spec-list">${filtered.map(([label, value]) => `<div class="spec-row"><dt>${esc(label)}</dt><dd>${specValue(value)}</dd></div>`).join('')}</dl>
    </details>`
  }).join('')
}

export async function phoneView(slug) {
  const phone = phoneBySlug(slug)
  if (!phone) return notFoundView()
  let localPrices = []
  try { localPrices = await listPrices() } catch {}
  const prices = mergePrices(localPrices).filter((row) => row.phoneSlug === phone.slug && row.verified)
  const fw = firmwareSourcesFor(phone.brand)
  const relatedArticles = articlesForPhone(phone)
  const fallbackArticles = sortArticles((content().articles || []).filter((article) => article.category === 'maintenance')).slice(0, 2)
  const guides = relatedArticles.length ? relatedArticles : fallbackArticles
  const related = relatedPhones(phone, 4)
  const info = brandInfo(phone.brand)
  const tags = String(phone.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean)
  const quality = Number(phone.verified) === 1 ? 'verified' : 'partial'
  return `<div class="page">
    <div class="shell">
      ${breadcrumb([
        { label: t('home'), href: '#/' },
        { label: t('phones.title'), href: '#/phones' },
        { label: brandDisplay(phone.brand), href: hashFor('/phones', { brand: phone.brand }) },
        { label: phone.name }
      ])}
      <div class="detail-grid">
        <div>
          <div class="detail-media">
            <span class="pill solid detail-media-tag">${esc(phone.release_year || '—')}</span>
            ${phoneVisual(phone, { lazy: false, size: 'detail' })}
            <div class="detail-media-src"><span>${esc(t('source'))}: ${esc(phone.source_name || 'GSMArena')}</span><span>${esc(phone.slug)}</span></div>
          </div>
          <div class="side-panel">
            <h3>${icon('info')}${esc(t('phone.dataQuality'))}</h3>
            <p>${esc(quality === 'verified' ? t('phone.verified') : t('phone.partial'))} · ${esc(t('source'))}: ${esc(phone.source_name || 'GSMArena')}.</p>
            ${phone.source_url ? `<p class="small"><a class="text-link" href="${esc(safeUrl(phone.source_url))}" target="_blank" rel="noopener">${esc(t('phone.source'))} ${icon('external')}</a></p>` : ''}
            <div class="mt-2"><button class="text-link" type="button" data-share-phone="${esc(phone.slug)}">${icon('share')} ${esc(t('phone.share'))}</button></div>
          </div>
        </div>
        <div class="detail-main">
          <p class="eyebrow">${esc(brandDisplay(phone.brand))} · ${esc(phone.series || info.series || '')}</p>
          <h1 class="detail-title mt-2">${esc(phone.name)}</h1>
          <div class="detail-sub">
            <span>${esc(phone.announced || phone.release_year || '')}</span><span class="dot-sep"></span>
            <span>${esc(phone.chipset ? String(phone.chipset).slice(0, 58) : t('phone.partial'))}</span><span class="dot-sep"></span>
            <span class="pill ${quality === 'verified' ? 'signal' : ''}">${esc(quality === 'verified' ? t('phone.verified') : t('phone.partial'))}</span>
          </div>
          <div class="detail-actions">
            <a class="btn btn-primary" href="${requestWa(phone)}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('phone.askAbout'))}</a>
            <a class="btn" href="${hashFor('/requests', { phone: phone.slug })}">${icon('clipboard')}${esc(t('requestRepair'))}</a>
          </div>
          <div class="mt-3">
            ${phone.common_faults ? `<div class="notice warn mb-2">${icon('alert')}<span><b>${esc(t('faults.safety'))}:</b> ${esc(phone.common_faults)}</span></div>` : ''}
            <div class="spec-groups">${specGroups(phone)}</div>
          </div>
          <div class="side-panel">
            <h3>${icon('tag')}${esc(t('phone.priceTitle'))}</h3>
            ${prices.length
              ? `<div class="table-wrap mt-2"><table><thead><tr><th>${esc(t('prices.tablePart'))}</th><th>${esc(t('prices.tableQuality'))}</th><th>${esc(t('prices.tablePrice'))}</th><th>${esc(t('prices.tableCity'))}</th><th>${esc(t('prices.tableSupplier'))}</th></tr></thead><tbody>${prices.slice(0, 8).map((row) => `<tr><td>${esc(partLabel(row.partType))}</td><td>${esc(qualityLabel(row.quality))}</td><td><b>${esc(money(row.price, row.currency))}</b></td><td>${esc(row.city || '—')}</td><td>${esc(row.supplierName || '—')}</td></tr>`).join('')}</tbody></table></div>`
              : `<p>${esc(t('phone.priceEmptyDesc'))}</p><div class="notice mt-2">${icon('info')}<span>${esc(t('phone.priceEmpty'))}</span></div>`}
            <a class="btn btn-sm" href="${waLink(getLang() === 'ar' ? `مرحباً، أريد عرض سعر لـ ${phone.name} (${phone.slug}).` : `Hello, I need a price quote for ${phone.name} (${phone.slug}).`)}" target="_blank" rel="noopener">${icon('message')}${esc(t('phone.requestQuote'))}</a>
          </div>
          <div class="side-panel">
            <h3>${icon('download')}${esc(t('phone.firmwareTitle'))}</h3>
            ${fw.length
              ? `<div class="source-list">${fw.map((source) => `<a class="source-item" href="${esc(safeUrl(source.url))}" target="_blank" rel="noopener"><span>${esc(source.name)}<small>${esc(firmwareNote(source))}</small></span>${icon('external')}</a>`).join('')}</div>`
              : `<p>${esc(t('phone.firmwareEmpty'))}</p>`}
            <a class="btn btn-sm" href="#/firmware">${icon('download')}${esc(t('phone.firmwareCta'))}</a>
          </div>
          <div class="side-panel">
            <h3>${icon('alert')}${esc(t('phone.guidesTitle'))}</h3>
            ${guides.length
              ? `<div class="source-list">${guides.map((article) => `<a class="source-item" href="${hashFor(`/article/${article.slug}`)}"><span>${esc(articleTitle(article))}<small>${esc(categoryLabel(article.category))} · ${esc(nf(article.readMinutes || 3))} ${esc(t('minutes'))}</small></span>${icon('arrow-up-right')}</a>`).join('')}</div>`
              : `<p>${esc(t('phone.guidesEmpty'))}</p>`}
          </div>
          ${tags.length ? `<div class="tag-list mt-3">${tags.map((tag) => `<span class="pill">${esc(tag)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    ${related.length ? `<section class="related-section"><div class="shell"><div class="section-subhead"><h2>${esc(t('phone.related'))}</h2><a class="text-link" href="#/phones">${esc(t('viewAll'))} ${icon('arrow-left')}</a></div><div class="phones-grid">${related.map(phoneCard).join('')}</div></div></section>` : ''}
  </div>`
}

export function bindPhoneDetail(root, slug) {
  const phone = phoneBySlug(slug)
  root.querySelector('[data-share-phone]')?.addEventListener('click', () => {
    if (phone) shareLink(phone.name, `${phone.brand} · ${phone.name}`)
  })
}

export function pricesView() {
  return `<div class="page">
    ${pageHeader({
      kicker: t('prices.kicker'),
      title: t('prices.title'),
      lead: t('prices.lead'),
      meta: `<span class="pill signal">${esc(t('prices.verified'))}</span><span class="pill">${esc(t('prices.tableUpdated'))}</span><span class="pill">AR · EN</span>`
    })}
    <div class="shell"><div class="section" style="padding-block-start:34px">
      <div class="price-banner"><div><strong>${esc(t('prices.policyTitle'))}</strong><p>${esc(t('prices.policy'))}</p></div><a class="btn btn-sm" href="${waLink(getLang() === 'ar' ? 'مرحباً، أريد عرض سعر شاشة/قطعة.' : 'Hello, I need a screen/part price quote.')}" target="_blank" rel="noopener">${icon('message')}${esc(t('prices.requestQuote'))}</a></div>
      <div id="price-public"><div class="fw-loading"><span class="loader-ring"></span><span>${esc(t('loading'))}</span></div></div>
      <div class="price-note mt-3"><span class="icon-box">${icon('info')}</span><div><h3>${esc(t('prices.note'))}</h3><p>${esc(t('prices.policy'))}</p></div></div>
    </div></div>
  </div>`
}

function priceTable(rows, cities) {
  if (!rows.length) {
    return `<div class="price-empty"><span class="empty-icon">${icon('tag')}</span><span class="big">—</span><h3>${esc(t('prices.emptyTitle'))}</h3><p>${esc(t('prices.emptyDesc'))}</p><a class="btn btn-primary btn-sm" href="${waLink(getLang() === 'ar' ? 'مرحباً، أريد عرض سعر شاشة/قطعة.' : 'Hello, I need a screen/part price quote.')}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('prices.requestQuote'))}</a></div>`
  }
  return `<div class="admin-toolbar" style="margin-block-end:12px">
      <label class="field"><span class="field-label">${esc(t('prices.filterCity'))}</span><select class="select" id="price-city-filter"><option value="">${esc(t('prices.allCities'))}</option>${cities.map((city) => `<option value="${esc(city)}">${esc(city)}</option>`).join('')}</select></label>
      <label class="field"><span class="field-label">${esc(t('prices.tablePart'))}</span><select class="select" id="price-part-filter"><option value="">${esc(t('prices.allParts'))}</option>${[...new Set(rows.map((row) => row.partType))].map((type) => `<option value="${esc(type)}">${esc(partLabel(type))}</option>`).join('')}</select></label>
      <span class="pill">${nf(rows.length)} ${esc(t('prices.found'))}</span>
    </div>
    <div class="table-wrap"><table><thead><tr><th>${esc(t('prices.tablePhone'))}</th><th>${esc(t('prices.tablePart'))}</th><th>${esc(t('prices.tableQuality'))}</th><th>${esc(t('prices.tablePrice'))}</th><th>${esc(t('prices.tableCity'))}</th><th>${esc(t('prices.tableSupplier'))}</th><th>${esc(t('prices.tableUpdated'))}</th></tr></thead><tbody>
      ${rows.map((row) => {
        const phone = phoneBySlug(row.phoneSlug)
        return `<tr data-price-row data-city="${esc(row.city || '')}" data-part="${esc(row.partType || '')}"><td><a href="${hashFor(`/phone/${row.phoneSlug}`)}"><b>${esc(phone?.name || row.phoneName || row.phoneSlug)}</b><span class="table-sub">${esc(phone?.brand || '')}</span></a></td><td>${esc(partLabel(row.partType))}</td><td>${esc(qualityLabel(row.quality))}</td><td><b>${esc(money(row.price, row.currency))}</b></td><td>${esc(row.city || '—')}</td><td>${esc(row.supplierName || '—')}</td><td>${esc(df(row.updatedAt))}</td></tr>`
      }).join('')}
    </tbody></table></div>`
}

export async function bindPrices(root) {
  let local = []
  try { local = await listPrices() } catch {}
  const rows = mergePrices(local).filter((row) => row.verified)
  const cities = [...new Set(rows.map((row) => row.city).filter(Boolean))]
  const target = root.querySelector('#price-public')
  if (!target) return
  target.innerHTML = priceTable(rows, cities)
  const cityFilter = target.querySelector('#price-city-filter')
  const partFilter = target.querySelector('#price-part-filter')
  const apply = () => {
    const city = cityFilter?.value || ''
    const part = partFilter?.value || ''
    target.querySelectorAll('[data-price-row]').forEach((row) => {
      row.hidden = Boolean((city && row.dataset.city !== city) || (part && row.dataset.part !== part))
    })
  }
  cityFilter?.addEventListener('change', apply)
  partFilter?.addEventListener('change', apply)
}

export function partsView() {
  const parts = [
    ['display', 'screen', 'parts.screen', 'parts.screenDesc'],
    ['battery', 'battery', 'parts.battery', 'parts.batteryDesc'],
    ['charging_port', 'cpu', 'parts.port', 'parts.portDesc'],
    ['camera', 'eye', 'parts.camera', 'parts.cameraDesc'],
    ['back_glass', 'layers', 'parts.glass', 'parts.glassDesc'],
    ['flex', 'code', 'parts.flex', 'parts.flexDesc']
  ]
  return `<div class="page">
    ${pageHeader({ kicker: t('parts.kicker'), title: t('parts.title'), lead: t('parts.lead'), side: `<p>${esc(t('parts.note'))}</p>` })}
    <div class="shell"><div class="section" style="padding-block-start:34px">
      <div class="grid grid-3">${parts.map(([type, iconName, titleKey, descKey]) => `<a class="card card-link" href="${waLink(getLang() === 'ar' ? `مرحباً، أريد طلب ${t(titleKey)} لموديل معين.` : `Hello, I need ${t(titleKey)} for a specific model.`)}" target="_blank" rel="noopener"><span class="card-icon">${icon(iconName)}</span><h3>${esc(t(titleKey))}</h3><p>${esc(t(descKey))}</p><div class="card-meta"><span class="mono-label">${esc(type)}</span><span class="card-arrow">${icon('arrow-up-right')}</span></div></a>`).join('')}</div>
      <div class="price-note mt-3"><span class="icon-box">${icon('alert')}</span><div><h3>${esc(t('parts.noteTitle'))}</h3><p>${esc(t('parts.note'))}</p><div class="mt-2"><a class="text-link" href="#/prices">${esc(t('parts.pricesCta'))} ${icon('arrow-left')}</a></div></div></div>
    </div></div>
  </div>`
}
