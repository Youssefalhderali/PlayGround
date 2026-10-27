import { t, nf, df, getLang, L } from './i18n.js'
import {
  store, settings, phoneBySlug, searchPhones, partLabel, qualityLabel,
  mergePrices, mergeSuppliers, publishedPrices, publishedSuppliers
} from './data.js'
import {
  getAll, put, remove, listPrices, listSuppliers, listRequests,
  hasPasscode, createPasscode, verifyPasscode, changePasscode,
  exportBackup, importBackup, clearLocalData, uid
} from './db.js'
import {
  icon, esc, toast, openModal, closeModal, confirmDialog, debounce,
  iconButton, emptyState, copyText, safeUrl
} from './ui.js'

let unlocked = false
try { unlocked = sessionStorage.getItem('brxvih.admin') === '1' } catch {}

const partTypes = ['screen', 'battery', 'charging_port', 'back_glass', 'camera', 'flex', 'speaker', 'other']
const qualities = ['genuine', 'oem', 'refurbished', 'aftermarket', 'used', 'pull']
const requestStatuses = ['new', 'contacted', 'progress', 'done', 'cancelled']

function setUnlocked(value) {
  unlocked = value
  try {
    if (value) sessionStorage.setItem('brxvih.admin', '1')
    else sessionStorage.removeItem('brxvih.admin')
  } catch {}
}

function loginView(firstRun = false) {
  if (firstRun) {
    return `<div class="admin-login">
      <a class="brand" href="#/"><span class="brand-symbol">B<span>×</span></span><span class="brand-word"><b>BRXVIH</b><small>WHITE BLACK</small></span></a>
      <p class="eyebrow">${esc(t('admin.kicker'))}</p>
      <h1 class="mt-2">${esc(t('admin.setupTitle'))}</h1>
      <p>${esc(t('admin.setupDesc'))}</p>
      <form data-admin-setup>
        <label class="field"><span class="field-label">${esc(t('admin.pass'))}</span><input class="input" type="password" name="pass" minlength="6" required autocomplete="new-password"></label>
        <label class="field"><span class="field-label">${esc(t('admin.passConfirm'))}</span><input class="input" type="password" name="confirm" minlength="6" required autocomplete="new-password"></label>
        <button class="btn btn-primary" type="submit">${esc(t('admin.setupTitle'))}</button>
        <small>${esc(t('admin.loginDesc'))}</small>
      </form>
    </div>`
  }
  return `<div class="admin-login">
    <a class="brand" href="#/"><span class="brand-symbol">B<span>×</span></span><span class="brand-word"><b>BRXVIH</b><small>WHITE BLACK</small></span></a>
    <p class="eyebrow">${esc(t('admin.kicker'))}</p>
    <h1 class="mt-2">${esc(t('admin.loginTitle'))}</h1>
    <p>${esc(t('admin.loginDesc'))}</p>
    <form data-admin-login>
      <label class="field"><span class="field-label">${esc(t('admin.pass'))}</span><input class="input" type="password" name="pass" required autocomplete="current-password"></label>
      <button class="btn btn-primary" type="submit">${esc(t('admin.unlock'))}</button>
      <small>${esc(t('admin.warning'))}</small>
    </form>
  </div>`
}

function statsView(priceRows, suppliers, requests) {
  const pending = requests.filter((row) => row.status === 'new').length
  return `<div class="admin-stats">
    <div class="admin-stat"><b>${nf(priceRows.length)}</b><span>${esc(t('admin.statPrices'))}</span></div>
    <div class="admin-stat"><b>${nf(suppliers.length)}</b><span>${esc(t('admin.statSuppliers'))}</span></div>
    <div class="admin-stat"><b>${nf(requests.length)}</b><span>${esc(t('admin.statRequests'))}</span></div>
    <div class="admin-stat"><b>${nf(pending)}</b><span>${esc(t('admin.statPending'))}</span></div>
  </div>`
}

function statusLabel(status) {
  const map = { new: 'statusNew', contacted: 'statusContacted', progress: 'statusProgress', done: 'statusDone', cancelled: 'statusCancelled' }
  return t(`admin.${map[status] || 'statusNew'}`)
}

function dashboardView(priceRows, suppliers, requests) {
  const rows = requests.slice(0, 6)
  return `${statsView(priceRows, suppliers, requests)}
    <div class="admin-warning"><b>${esc(t('localOnly'))}:</b> ${esc(t('admin.warning'))}</div>
    <section class="admin-section">
      <div class="admin-section-head"><h2>${esc(t('admin.recentRequests'))}</h2><a class="text-link" href="#/admin/requests">${esc(t('viewAll'))} ${icon(getLang() === 'ar' ? 'arrow-left' : 'arrow-right')}</a></div>
      ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>${esc(t('requests.ticket'))}</th><th>${esc(t('name'))}</th><th>${esc(t('model'))}</th><th>${esc(t('status'))}</th><th>${esc(t('date'))}</th></tr></thead><tbody>
        ${rows.map((row) => `<tr><td><b>${esc(row.ticket || row.id)}</b></td><td>${esc(row.name)}<span class="table-sub">${esc(row.phone)}</span></td><td>${esc(row.model || row.brand || '—')}</td><td><span class="pill">${esc(statusLabel(row.status))}</span></td><td>${esc(df(row.createdAt))}</td></tr>`).join('')}
      </tbody></table></div>` : `<div class="admin-empty">${esc(t('admin.noRequests'))}</div>`}
    </section>
    <section class="admin-section">
      <div class="admin-section-head"><h2>${esc(t('admin.publicSeed'))}</h2><div class="csv-actions"><button class="btn btn-sm" type="button" data-export-prices>${icon('download')}${esc(t('admin.exportPrices'))}</button></div></div>
      <p class="admin-note">${esc(t('admin.exportHint'))} <code>data/prices.json</code></p>
    </section>`
}

function priceRowsView(priceRows, suppliers) {
  if (!priceRows.length) {
    return `<div class="admin-empty">${esc(t('admin.noPrices'))}</div>`
  }
  return `<div class="table-wrap"><table>
    <thead><tr><th>${esc(t('model'))}</th><th>${esc(t('admin.partType'))}</th><th>${esc(t('admin.quality'))}</th><th>${esc(t('price'))}</th><th>${esc(t('city'))}</th><th>${esc(t('supplier'))}</th><th>${esc(t('updated'))}</th><th>${esc(t('actions'))}</th></tr></thead>
    <tbody>${priceRows.map((row) => {
      const phone = phoneBySlug(row.phoneSlug)
      return `<tr>
        <td><b>${esc(phone?.name || row.phoneName || row.phoneSlug)}</b><span class="table-sub">${esc(phone?.brand || '')}</span></td>
        <td>${esc(partLabel(row.partType))}<span class="table-sub">${esc(row.quality ? qualityLabel(row.quality) : '')}</span></td>
        <td>${row.verified ? `<span class="pill signal">${esc(t('verified'))}</span>` : `<span class="pill warn">${esc(t('unverified'))}</span>`}</td>
        <td><b>${esc(row.price)}</b> <span class="table-sub">${esc(row.currency || 'YER')}</span></td>
        <td>${esc(row.city || '—')}</td>
        <td>${esc(row.supplierName || suppliers.find((s) => s.id === row.supplierId)?.name || '—')}</td>
        <td>${esc(df(row.updatedAt))}</td>
        <td><div class="table-actions">${iconButton(t('edit'), 'edit', `data-edit-price="${esc(row.id)}"`)}${iconButton(t('delete'), 'trash', `data-delete-price="${esc(row.id)}"`)}</div></td>
      </tr>`
    }).join('')}</tbody>
  </table></div>`
}

function pricesView(priceRows, suppliers) {
  return `<div class="admin-toolbar">
      <div class="field" style="flex:1 1 280px"><label for="admin-price-search">${esc(t('search'))}</label><input class="input" id="admin-price-search" type="search" placeholder="${esc(t('admin.searchPhone'))}" data-price-search></div>
      <button class="btn btn-primary btn-sm" type="button" data-add-price>${icon('plus')}${esc(t('admin.addPrice'))}</button>
      <button class="btn btn-sm" type="button" data-export-prices>${icon('download')}${esc(t('admin.exportPrices'))}</button>
    </div>
    <div data-price-table>${priceRowsView(priceRows, suppliers)}</div>
    <p class="admin-note mt-2">${esc(t('admin.exportHint'))} <code>data/prices.json</code></p>`
}

function supplierRowsView(suppliers) {
  if (!suppliers.length) return `<div class="admin-empty">${esc(t('admin.noSuppliers'))}</div>`
  return `<div class="table-wrap"><table>
    <thead><tr><th>${esc(t('name'))}</th><th>${esc(t('phone'))}</th><th>${esc(t('city'))}</th><th>${esc(t('status'))}</th><th>${esc(t('notes'))}</th><th>${esc(t('actions'))}</th></tr></thead>
    <tbody>${suppliers.map((row) => `<tr>
      <td><b>${esc(row.name)}</b><span class="table-sub">${esc(row.id)}</span></td>
      <td dir="ltr">${esc(row.phone || '—')}</td>
      <td>${esc(row.city || '—')}</td>
      <td>${row.verified ? `<span class="pill signal">${esc(t('verified'))}</span>` : `<span class="pill">${esc(t('unverified'))}</span>`}</td>
      <td>${esc(row.notes || '—')}</td>
      <td><div class="table-actions">${iconButton(t('edit'), 'edit', `data-edit-supplier="${esc(row.id)}"`)}${iconButton(t('delete'), 'trash', `data-delete-supplier="${esc(row.id)}"`)}</div></td>
    </tr>`).join('')}</tbody>
  </table></div>`
}

function requestsView(requests) {
  const body = requests.length ? `<div class="table-wrap"><table>
    <thead><tr><th>${esc(t('requests.ticket'))}</th><th>${esc(t('name'))}</th><th>${esc(t('model'))}</th><th>${esc(t('requests.category'))}</th><th>${esc(t('status'))}</th><th>${esc(t('date'))}</th><th>${esc(t('actions'))}</th></tr></thead>
    <tbody>${requests.map((row) => `<tr>
      <td><b>${esc(row.ticket || row.id)}</b></td>
      <td>${esc(row.name)}<span class="table-sub" dir="ltr">${esc(row.phone)}</span></td>
      <td>${esc([row.brand, row.model].filter(Boolean).join(' '))}</td>
      <td>${esc(t(`requests.categories.${row.faultType}`))}</td>
      <td><select class="select status-select" data-request-status="${esc(row.id)}">${requestStatuses.map((status) => `<option value="${status}" ${row.status === status ? 'selected' : ''}>${esc(statusLabel(status))}</option>`).join('')}</select></td>
      <td>${esc(df(row.createdAt))}</td>
      <td><div class="table-actions">${iconButton(t('admin.openRequest'), 'eye', `data-open-request="${esc(row.id)}"`)}${iconButton(t('delete'), 'trash', `data-delete-request="${esc(row.id)}"`)}</div></td>
    </tr>`).join('')}</tbody>
  </table></div>` : `<div class="admin-empty">${esc(t('admin.noRequests'))}</div>`
  return `<div class="admin-toolbar"><div class="csv-actions"><button class="btn btn-sm" type="button" data-export-requests>${icon('download')}${esc(t('admin.exportCsv'))}</button></div></div>${body}
    <p class="admin-note mt-2">${esc(t('requests.localNotice'))}</p>`
}

function dataView() {
  return `<section class="admin-section">
    <div class="admin-section-head"><h2>${esc(t('admin.prices'))}</h2><div class="csv-actions"><button class="btn btn-sm" type="button" data-export-prices>${icon('download')}${esc(t('admin.exportPrices'))}</button></div></div>
    <p class="admin-note">${esc(t('admin.exportHint'))} <code>data/prices.json</code></p>
  </section>
  <section class="admin-section">
    <div class="admin-section-head"><h2>${esc(t('admin.exportBackup'))}</h2></div>
    <div class="csv-actions"><button class="btn btn-sm" type="button" data-export-backup>${icon('download')}${esc(t('admin.exportBackup'))}</button></div>
    <p class="admin-note mt-2">${esc(t('admin.importHint'))}</p>
    <div class="field mt-2"><label for="admin-import">${esc(t('admin.importBackup'))}</label><input class="input" id="admin-import" type="file" accept="application/json,.json" data-import-backup></div>
  </section>
  <section class="admin-section">
    <div class="admin-section-head"><h2>${esc(t('admin.resetData'))}</h2></div>
    <button class="btn btn-sm btn-danger" type="button" data-reset-data>${icon('trash')}${esc(t('admin.resetData'))}</button>
  </section>`
}

function settingsView() {
  return `<div class="admin-warning">${esc(t('admin.warning'))}</div>
    <section class="admin-section" style="max-width:560px">
      <div class="admin-section-head"><h2>${esc(t('admin.changePass'))}</h2></div>
      <form data-change-pass class="form-grid">
        <label class="field span-2"><span class="field-label">${esc(t('admin.currentPass'))}</span><input class="input" type="password" name="current" required autocomplete="current-password"></label>
        <label class="field span-2"><span class="field-label">${esc(t('admin.newPass'))}</span><input class="input" type="password" name="next" minlength="6" required autocomplete="new-password"></label>
        <button class="btn btn-primary btn-sm" type="submit">${esc(t('save'))}</button>
      </form>
    </section>`
}

function nav(route) {
  const items = [
    ['', 'dashboard', 'layers'],
    ['prices', 'prices', 'tag'],
    ['suppliers', 'suppliers', 'users'],
    ['requests', 'requests', 'clipboard'],
    ['data', 'data', 'database'],
    ['settings', 'settings', 'settings']
  ]
  return items.map(([key, label, iconName]) => {
    const href = key ? `#/admin/${key}` : '#/admin'
    return `<a href="${href}" class="${route === key ? 'active' : ''}">${icon(iconName)}<span>${esc(t(`admin.${label}`))}</span></a>`
  }).join('')
}

function shellView(route, priceRows, suppliers, requests) {
  const titles = { '': 'dashboard', prices: 'prices', suppliers: 'suppliers', requests: 'requests', data: 'data', settings: 'settings' }
  let content = ''
  if (route === 'prices') content = pricesView(priceRows, suppliers)
  else if (route === 'suppliers') content = `<div class="admin-toolbar"><button class="btn btn-primary btn-sm" type="button" data-add-supplier>${icon('plus')}${esc(t('admin.addSupplier'))}</button></div>${supplierRowsView(suppliers)}`
  else if (route === 'requests') content = requestsView(requests)
  else if (route === 'data') content = dataView()
  else if (route === 'settings') content = settingsView()
  else content = dashboardView(priceRows, suppliers, requests)
  return `<div class="admin-shell">
    <aside class="admin-side">
      <p class="mono-label">CONTROL ROOM</p>
      <nav class="admin-nav">${nav(route)}</nav>
      <div class="admin-side-foot">
        <button class="btn btn-sm" type="button" data-lock>${icon('lock')}${esc(t('admin.lock'))}</button>
        <a class="btn btn-sm" href="#/">${icon('arrow-left')}${esc(t('home'))}</a>
      </div>
    </aside>
    <div class="admin-main">
      <div class="admin-head">
        <div><p class="eyebrow">${esc(t('admin.kicker'))}</p><h1>${esc(t(`admin.${titles[route] || 'dashboard'}`))}</h1><p>${esc(t('admin.warning'))}</p></div>
        <div class="admin-head-actions"><button class="btn btn-sm" type="button" data-lock>${icon('lock')}${esc(t('admin.lock'))}</button></div>
      </div>
      ${statsView(priceRows, suppliers, requests)}
      ${content}
    </div>
  </div>`
}

function download(filename, content, type = 'application/json') {
  const blob = new Blob([content], { type: `${type};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function priceModal(row, suppliers) {
  const editing = Boolean(row)
  const data = row || {}
  const phone = phoneBySlug(data.phoneSlug)
  const cityOptions = (settings().cities || []).map((city) => `<option value="${esc(city)}"></option>`).join('')
  const supplierOptions = suppliers.map((supplier) => `<option value="${esc(supplier.name)}"></option>`).join('')
  const currencies = settings().currencies || [{ code: 'YER' }, { code: 'SAR' }, { code: 'USD' }]
  const root = openModal({
    title: t(editing ? 'admin.editPrice' : 'admin.addPrice'),
    body: `<form id="price-form" class="form-grid">
      <input type="hidden" name="id" value="${esc(data.id || '')}">
      <input type="hidden" name="phoneSlug" value="${esc(data.phoneSlug || '')}">
      <div class="field span-2">
        <label for="price-phone-search">${esc(t('admin.phoneSlug'))}</label>
        <input class="input" id="price-phone-search" name="phoneLabel" value="${esc(phone?.name || data.phoneName || '')}" placeholder="${esc(t('admin.searchPhone'))}" autocomplete="off" required>
        <div class="picker-list" id="price-phone-results"></div>
      </div>
      <label class="field"><span class="field-label">${esc(t('admin.partType'))}</span><select class="select" name="partType" required>${partTypes.map((type) => `<option value="${type}" ${data.partType === type ? 'selected' : ''}>${esc(partLabel(type))}</option>`).join('')}</select></label>
      <label class="field"><span class="field-label">${esc(t('admin.quality'))}</span><select class="select" name="quality" required>${qualities.map((quality) => `<option value="${quality}" ${data.quality === quality ? 'selected' : ''}>${esc(qualityLabel(quality))}</option>`).join('')}</select></label>
      <label class="field"><span class="field-label">${esc(t('price'))}</span><input class="input" name="price" type="number" min="0" step="0.01" value="${esc(data.price ?? '')}" required></label>
      <label class="field"><span class="field-label">${esc(t('currency'))}</span><select class="select" name="currency">${currencies.map((currency) => `<option value="${esc(currency.code)}" ${((data.currency || 'YER') === currency.code) ? 'selected' : ''}>${esc(currency.code)}</option>`).join('')}</select></label>
      <label class="field"><span class="field-label">${esc(t('city'))}</span><input class="input" name="city" list="admin-cities" value="${esc(data.city || '')}" required><datalist id="admin-cities">${cityOptions}</datalist></label>
      <label class="field"><span class="field-label">${esc(t('supplier'))}</span><input class="input" name="supplierName" list="admin-suppliers" value="${esc(data.supplierName || '')}" required><datalist id="admin-suppliers">${supplierOptions}</datalist></label>
      <label class="field span-2"><span class="field-label">${esc(t('notes'))} (${esc(t('optional'))})</span><textarea class="textarea" name="notes" rows="3">${esc(data.notes || '')}</textarea></label>
      <label class="checkbox span-2"><input type="checkbox" name="verified" ${data.verified ? 'checked' : ''}><span>${esc(t('admin.verifiedSupplier'))}</span></label>
    </form>`,
    foot: `<button class="btn btn-sm" type="button" data-close-modal>${esc(t('cancel'))}</button><button class="btn btn-sm btn-primary" type="submit" form="price-form">${esc(t('save'))}</button>`
  })
  const search = root.querySelector('#price-phone-search')
  const results = root.querySelector('#price-phone-results')
  const hidden = root.querySelector('[name="phoneSlug"]')
  const renderResults = debounce(() => {
    const query = search.value.trim()
    if (!query) { results.innerHTML = ''; return }
    const found = searchPhones(query, 6)
    results.innerHTML = found.length ? found.map((item) => `<button class="picker-option" type="button" data-pick-phone="${esc(item.slug)}"><span>${esc(item.name)}<br><small>${esc(item.brand)} · ${esc(item.release_year || '')}</small></span>${icon('plus')}</button>`).join('') : ''
  }, 120)
  search.addEventListener('input', () => { hidden.value = ''; renderResults() })
  results.addEventListener('click', (event) => {
    const button = event.target.closest('[data-pick-phone]')
    if (!button) return
    const found = phoneBySlug(button.dataset.pickPhone)
    if (!found) return
    hidden.value = found.slug
    search.value = found.name
    results.innerHTML = ''
  })
  root.querySelector('#price-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!hidden.value && !data.phoneSlug) { toast(t('admin.searchPhone'), 'error'); return }
    const formData = new FormData(event.currentTarget)
    const supplierName = String(formData.get('supplierName') || '').trim()
    const supplier = suppliers.find((item) => item.name.toLowerCase() === supplierName.toLowerCase())
    const rowData = {
      id: formData.get('id') || uid('PRC'),
      phoneSlug: formData.get('phoneSlug'),
      phoneName: phoneBySlug(formData.get('phoneSlug'))?.name || search.value,
      partType: formData.get('partType'),
      quality: formData.get('quality'),
      price: Number(formData.get('price')),
      currency: formData.get('currency'),
      city: String(formData.get('city') || '').trim(),
      supplierId: supplier?.id || '',
      supplierName,
      verified: formData.get('verified') === 'on',
      notes: String(formData.get('notes') || '').trim(),
      updatedAt: new Date().toISOString()
    }
    if (!rowData.phoneSlug || !Number.isFinite(rowData.price)) { toast(t('error'), 'error'); return }
    await put('prices', rowData)
    closeModal()
    toast(t('admin.saveDone'))
    await renderAdmin(document.getElementById('app'), 'prices')
  })
}

function supplierModal(row) {
  const editing = Boolean(row)
  const data = row || {}
  const cityOptions = (settings().cities || []).map((city) => `<option value="${esc(city)}"></option>`).join('')
  const root = openModal({
    title: t(editing ? 'admin.editSupplier' : 'admin.addSupplier'),
    body: `<form id="supplier-form" class="form-grid">
      <input type="hidden" name="id" value="${esc(data.id || '')}">
      <label class="field span-2"><span class="field-label">${esc(t('name'))}</span><input class="input" name="name" value="${esc(data.name || '')}" required autocomplete="organization"></label>
      <label class="field"><span class="field-label">${esc(t('phone'))}</span><input class="input" name="phone" dir="ltr" value="${esc(data.phone || '')}" placeholder="+967…" autocomplete="tel"></label>
      <label class="field"><span class="field-label">${esc(t('city'))}</span><input class="input" name="city" list="supplier-cities" value="${esc(data.city || '')}"><datalist id="supplier-cities">${cityOptions}</datalist></label>
      <label class="field span-2"><span class="field-label">${esc(t('notes'))} (${esc(t('optional'))})</span><textarea class="textarea" name="notes" rows="3">${esc(data.notes || '')}</textarea></label>
      <label class="checkbox span-2"><input type="checkbox" name="verified" ${data.verified ? 'checked' : ''}><span>${esc(t('verified'))}</span></label>
    </form>`,
    foot: `<button class="btn btn-sm" type="button" data-close-modal>${esc(t('cancel'))}</button><button class="btn btn-sm btn-primary" type="submit" form="supplier-form">${esc(t('save'))}</button>`
  })
  root.querySelector('#supplier-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const rowData = {
      id: formData.get('id') || uid('SUP'),
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      notes: String(formData.get('notes') || '').trim(),
      verified: formData.get('verified') === 'on',
      updatedAt: new Date().toISOString()
    }
    if (!rowData.name) return
    await put('suppliers', rowData)
    closeModal()
    toast(t('admin.saveDone'))
    await renderAdmin(document.getElementById('app'), 'suppliers')
  })
}

function requestModal(row) {
  const whatsapp = String(row.phone || '').replace(/[^\d]/g, '')
  const waText = encodeURIComponent(`${t('requests.ticket')}: ${row.ticket || row.id}\n${row.name} — ${row.model || ''}\n${row.description || ''}`)
  openModal({
    title: `${t('requests.ticket')} ${row.ticket || row.id}`,
    body: `<div class="form-grid">
      <div class="field"><span class="field-label">${esc(t('name'))}</span><div class="selected-phone">${esc(row.name)}</div></div>
      <div class="field"><span class="field-label">${esc(t('phone'))}</span><div class="selected-phone" dir="ltr">${esc(row.phone)}</div></div>
      <div class="field"><span class="field-label">${esc(t('city'))}</span><div class="selected-phone">${esc(row.city || '—')}</div></div>
      <div class="field"><span class="field-label">${esc(t('model'))}</span><div class="selected-phone">${esc([row.brand, row.model].filter(Boolean).join(' ') || '—')}</div></div>
      <div class="field"><span class="field-label">${esc(t('requests.category'))}</span><div class="selected-phone">${esc(t(`requests.categories.${row.faultType}`))}</div></div>
      <div class="field"><span class="field-label">${esc(t('status'))}</span><div class="selected-phone">${esc(statusLabel(row.status))}</div></div>
      <div class="field span-2"><span class="field-label">${esc(t('requests.description'))}</span><div class="selected-phone" style="display:block;line-height:1.7">${esc(row.description || '—')}</div></div>
    </div>
    ${whatsapp ? `<a class="btn btn-sm btn-primary mt-3" href="https://wa.me/${esc(whatsapp)}?text=${waText}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('requests.sendWhatsApp'))}</a>` : ''}`,
    foot: `<button class="btn btn-sm" type="button" data-close-modal>${esc(t('close'))}</button>`
  })
}

function publicPriceExport(priceRows, suppliers) {
  const rows = priceRows.filter((row) => row.verified)
  return JSON.stringify({
    app: 'Brxvih',
    schema: 1,
    updatedAt: new Date().toISOString(),
    note: 'Verified supplier prices only. Deploy as data/prices.json.',
    suppliers: suppliers.map((supplier) => ({ ...supplier })),
    prices: rows.map((row) => ({ ...row }))
  }, null, 2)
}

async function bindShell(container, route) {
  const [priceRowsRaw, suppliers, requests] = await Promise.all([listPrices(), listSuppliers(), listRequests()])
  const priceRows = mergePrices(priceRowsRaw)
  const allSuppliers = mergeSuppliers(suppliers)

  const refresh = () => renderAdmin(container, route)
  container.querySelectorAll('[data-lock]').forEach((button) => button.addEventListener('click', () => {
    setUnlocked(false)
    renderAdmin(container, '')
  }))

  container.querySelectorAll('[data-add-price]').forEach((button) => button.addEventListener('click', () => priceModal(null, allSuppliers)))
  container.querySelectorAll('[data-add-supplier]').forEach((button) => button.addEventListener('click', () => supplierModal(null)))
  container.querySelectorAll('[data-export-prices]').forEach((button) => button.addEventListener('click', () => {
    download('prices.json', publicPriceExport(priceRows, allSuppliers))
    toast(t('admin.exportDone'))
  }))
  container.querySelectorAll('[data-edit-price]').forEach((button) => button.addEventListener('click', () => {
    const row = priceRows.find((item) => item.id === button.dataset.editPrice)
    if (row) priceModal(row, allSuppliers)
  }))
  container.querySelectorAll('[data-delete-price]').forEach((button) => button.addEventListener('click', async () => {
    if (!(await confirmDialog(t('admin.deleteConfirm')))) return
    await remove('prices', button.dataset.deletePrice)
    toast(t('admin.deleteDone'))
    refresh()
  }))
  container.querySelectorAll('[data-edit-supplier]').forEach((button) => button.addEventListener('click', () => {
    const row = allSuppliers.find((item) => item.id === button.dataset.editSupplier)
    if (row) supplierModal(row)
  }))
  container.querySelectorAll('[data-delete-supplier]').forEach((button) => button.addEventListener('click', async () => {
    if (!(await confirmDialog(t('admin.deleteConfirm')))) return
    await remove('suppliers', button.dataset.deleteSupplier)
    toast(t('admin.deleteDone'))
    refresh()
  }))
  container.querySelectorAll('[data-open-request]').forEach((button) => button.addEventListener('click', () => {
    const row = requests.find((item) => item.id === button.dataset.openRequest)
    if (row) requestModal(row)
  }))
  container.querySelectorAll('[data-delete-request]').forEach((button) => button.addEventListener('click', async () => {
    if (!(await confirmDialog(t('admin.deleteConfirm')))) return
    await remove('requests', button.dataset.deleteRequest)
    toast(t('admin.deleteDone'))
    refresh()
  }))
  container.querySelectorAll('[data-request-status]').forEach((select) => select.addEventListener('change', async () => {
    const row = requests.find((item) => item.id === select.dataset.requestStatus)
    if (!row) return
    await put('requests', { ...row, status: select.value, updatedAt: new Date().toISOString() })
    toast(t('admin.saveDone'))
  }))

  const priceSearch = container.querySelector('[data-price-search]')
  if (priceSearch) {
    priceSearch.addEventListener('input', debounce(() => {
      const query = priceSearch.value.trim().toLowerCase()
      const filtered = query
        ? priceRows.filter((row) => `${row.phoneName || ''} ${row.phoneSlug} ${row.supplierName || ''} ${row.city || ''}`.toLowerCase().includes(query))
        : priceRows
      const table = container.querySelector('[data-price-table]')
      if (table) table.innerHTML = priceRowsView(filtered, allSuppliers)
      bindRowActions(container, filtered, allSuppliers, requests, refresh)
    }, 120))
  }

  container.querySelectorAll('[data-export-backup]').forEach((button) => button.addEventListener('click', async () => {
    download(`brxvih-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(await exportBackup(), null, 2))
    toast(t('admin.exportDone'))
  }))
  container.querySelectorAll('[data-export-requests]').forEach((button) => button.addEventListener('click', () => {
    const header = ['ticket', 'createdAt', 'name', 'phone', 'city', 'brand', 'model', 'faultType', 'description', 'status']
    const csv = [header, ...requests.map((row) => header.map((key) => row[key] ?? ''))].map((line) => line.map(csvCell).join(',')).join('\n')
    download(`brxvih-requests-${new Date().toISOString().slice(0, 10)}.csv`, `\ufeff${csv}`, 'text/csv')
  }))
  const importInput = container.querySelector('[data-import-backup]')
  if (importInput) importInput.addEventListener('change', async () => {
    const file = importInput.files?.[0]
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      await importBackup(data, { replace: true })
      toast(t('admin.importDone'))
      refresh()
    } catch {
      toast(t('admin.importError'), 'error')
    }
  })
  container.querySelectorAll('[data-reset-data]').forEach((button) => button.addEventListener('click', async () => {
    if (!(await confirmDialog(t('admin.resetConfirm')))) return
    await clearLocalData()
    toast(t('admin.resetDone'))
    refresh()
  }))
  const passForm = container.querySelector('[data-change-pass]')
  if (passForm) passForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = new FormData(passForm)
    const ok = await changePasscode(String(data.get('current')), String(data.get('next')))
    if (!ok) { toast(t('admin.wrong'), 'error'); return }
    passForm.reset()
    toast(t('admin.passChanged'))
  })
}

function bindRowActions(container, priceRows, suppliers, requests, refresh) {
  container.querySelectorAll('[data-edit-price]').forEach((button) => button.addEventListener('click', () => {
    const row = priceRows.find((item) => item.id === button.dataset.editPrice)
    if (row) priceModal(row, suppliers)
  }))
  container.querySelectorAll('[data-delete-price]').forEach((button) => button.addEventListener('click', async () => {
    if (!(await confirmDialog(t('admin.deleteConfirm')))) return
    await remove('prices', button.dataset.deletePrice)
    toast(t('admin.deleteDone'))
    refresh()
  }))
}

export async function renderAdmin(container, route = '') {
  const firstRun = !(await hasPasscode())
  if (!firstRun && !unlocked) {
    container.innerHTML = loginView(false)
    const form = container.querySelector('[data-admin-login]')
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const pass = String(new FormData(form).get('pass') || '')
      if (!(await verifyPasscode(pass))) { toast(t('admin.wrong'), 'error'); form.reset(); return }
      setUnlocked(true)
      await renderAdmin(container, route)
    })
    return
  }
  if (firstRun) {
    container.innerHTML = loginView(true)
    const form = container.querySelector('[data-admin-setup]')
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const data = new FormData(form)
      const pass = String(data.get('pass') || '')
      const confirm = String(data.get('confirm') || '')
      if (pass.length < 6) { toast(t('admin.short'), 'error'); return }
      if (pass !== confirm) { toast(t('admin.mismatch'), 'error'); return }
      await createPasscode(pass)
      setUnlocked(true)
      await renderAdmin(container, route)
    })
    return
  }

  const [prices, suppliers, requests] = await Promise.all([listPrices(), listSuppliers(), listRequests()])
  const mergedPrices = mergePrices(prices)
  const mergedSuppliers = mergeSuppliers(suppliers)
  container.innerHTML = shellView(route, mergedPrices, mergedSuppliers, requests)
  await bindShell(container, route)
}

export function lockAdmin() {
  setUnlocked(false)
}
