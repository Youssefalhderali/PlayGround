import { t, getLang, nf } from '../i18n.js'
import { store, settings, phoneBySlug } from '../data.js'
import { put, uid } from '../db.js'
import { icon, esc, pageHeader, breadcrumb, toast } from '../ui.js'
import { waLink, genericWa, hashFor } from '../shared.js'

function citiesOptions(selected = '') {
  return (settings().cities || []).map((city) => `<option value="${esc(city)}" ${city === selected ? 'selected' : ''}>${esc(city)}</option>`).join('')
}

function brandOptions(selected = '') {
  return [...store.brandGroups.keys()].sort((a, b) => a.localeCompare(b))
    .map((brand) => `<option value="${esc(brand)}" ${brand === selected ? 'selected' : ''}>${esc(brand)}</option>`).join('')
}

const FAULT_KEYS = ['screen', 'battery', 'charging', 'software', 'water', 'board', 'camera', 'other']

function prefill(params) {
  const phone = phoneBySlug(params.get('phone') || '')
  return {
    brand: phone?.brand || '',
    model: phone?.name || '',
    description: params.get('service') ? `${t('services.request')}: ${params.get('service')}\n` : ''
  }
}

export function requestsView(params) {
  const initial = prefill(params)
  const service = params.get('service') || ''
  return `<div class="page">
    ${pageHeader({
      kicker: t('requests.kicker'),
      title: t('requests.title'),
      lead: t('requests.lead'),
      side: `<p>${esc(t('requests.localNotice'))}</p><div class="notice mt-2">${icon('lock')}<span>${esc(t('requests.privacy'))}</span></div>`
    })}
    <div class="shell"><div class="section" style="padding-block-start:34px">
      <div class="request-layout">
        <div>
          <form class="form-card" id="request-form" novalidate>
            <div class="form-head"><span class="card-icon">${icon('clipboard')}</span><div><h2>${esc(t('requests.formTitle'))}</h2><p>${esc(t('requests.formDesc'))}</p></div></div>
            <div class="form-grid">
              <label class="field"><span class="field-label">${esc(t('requests.name'))} *</span><input class="input" name="name" required autocomplete="name" maxlength="80"></label>
              <label class="field"><span class="field-label">${esc(t('requests.phone'))} *</span><input class="input" name="phone" required inputmode="tel" autocomplete="tel" maxlength="30" placeholder="+967…"></label>
              <label class="field"><span class="field-label">${esc(t('requests.city'))}</span><select class="select" name="city"><option value="">—</option>${citiesOptions()}</select></label>
              <label class="field"><span class="field-label">${esc(t('requests.category'))} *</span><select class="select" name="faultType" required><option value="">${esc(t('requests.categoryPlaceholder'))}</option>${FAULT_KEYS.map((key) => `<option value="${key}">${esc(t(`requests.categories.${key}`))}</option>`).join('')}</select></label>
              <label class="field"><span class="field-label">${esc(t('requests.brand'))}</span><select class="select" name="brand"><option value="">—</option>${brandOptions(initial.brand)}</select></label>
              <label class="field"><span class="field-label">${esc(t('requests.model'))} *</span><input class="input" name="model" required maxlength="120" value="${esc(initial.model)}" placeholder="Galaxy S23 / iPhone 14 Pro…"></label>
              <label class="field span-2"><span class="field-label">${esc(t('requests.description'))} *</span><textarea class="textarea" name="description" rows="6" required maxlength="2000" placeholder="${esc(t('requests.descriptionPlaceholder'))}">${esc(initial.description)}</textarea></label>
              <label class="consent span-2"><input type="checkbox" name="consent" required><span>${esc(t('requests.consent'))}</span></label>
            </div>
            <div class="form-foot"><p class="hint">${esc(t('requests.localNotice'))}</p><button class="btn btn-primary" type="submit">${icon('clipboard')}${esc(t('requests.submit'))}</button></div>
            ${service ? `<input type="hidden" name="service" value="${esc(service)}">` : ''}
          </form>
          <div class="request-success" id="request-success" hidden></div>
        </div>
        <aside class="request-side">
          <div class="side-panel"><h3>${icon('layers')}${esc(t('requests.sideTitle'))}</h3><div class="source-list"><div class="source-item"><span><b class="mono">01</b> ${esc(t('requests.step1'))}</span></div><div class="source-item"><span><b class="mono">02</b> ${esc(t('requests.step2'))}</span></div><div class="source-item"><span><b class="mono">03</b> ${esc(t('requests.step3'))}</span></div></div></div>
          <div class="side-panel"><h3>${icon('alert')}${esc(t('requests.privacy'))}</h3><p>${esc(t('requests.localNotice'))}</p><a class="btn btn-sm" href="${genericWa()}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('whatsapp'))}</a></div>
          <div class="side-panel"><h3>${icon('shield')}${esc(t('security.defensive'))}</h3><p>${esc(t('security.defensiveText'))}</p></div>
        </aside>
      </div>
    </div></div>
  </div>`
}

function messageFor(row) {
  const lines = [
    `Brxvih — ${t('requests.ticket')}: ${row.ticket}`,
    `${t('requests.name')}: ${row.name}`,
    `${t('requests.phone')}: ${row.phone}`,
    row.city ? `${t('requests.city')}: ${row.city}` : '',
    `${t('requests.model')}: ${[row.brand, row.model].filter(Boolean).join(' ')}`,
    `${t('requests.category')}: ${t(`requests.categories.${row.faultType}`)}`,
    '',
    row.description,
    '',
    t('requests.localNotice')
  ].filter(Boolean)
  return lines.join('\n')
}

function successMarkup(row) {
  const message = messageFor(row)
  return `<div class="form-card success-card"><span class="success-icon">${icon('check')}</span><p class="eyebrow">${esc(t('requests.saved'))}</p><h2>${esc(t('requests.ticket'))} <span class="mono">${esc(row.ticket)}</span></h2><p>${esc(t('requests.savedDesc'))}</p><div class="ticket-box"><span>${esc(row.ticket)}</span><button class="text-link" type="button" data-copy-ticket>${icon('copy')}${esc(t('copy'))}</button></div><div class="detail-actions"><a class="btn btn-primary" href="${waLink(message)}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('requests.sendWhatsApp'))}</a><button class="btn" type="button" id="new-request">${icon('plus')}${esc(t('requests.newRequest'))}</button></div><p class="admin-note mt-2">${esc(t('requests.localNotice'))}</p></div>`
}

export function bindRequests(root, params) {
  const form = root.querySelector('#request-form')
  const success = root.querySelector('#request-success')
  if (!form || !success) return
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!form.reportValidity()) {
      toast(t('requests.requiredError'), 'error')
      return
    }
    const data = new FormData(form)
    const now = new Date()
    const stamp = now.toISOString().slice(2, 10).replace(/-/g, '')
    const ticket = `BRX-${stamp}-${uid().slice(-4).toUpperCase()}`
    const row = {
      id: uid('req_'),
      ticket,
      name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      city: String(data.get('city') || '').trim(),
      brand: String(data.get('brand') || '').trim(),
      model: String(data.get('model') || '').trim(),
      faultType: String(data.get('faultType') || 'other'),
      description: String(data.get('description') || '').trim(),
      service: String(data.get('service') || '').trim(),
      status: 'new',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }
    if (!row.name || !row.phone || !row.model || !row.description) {
      toast(t('requests.requiredError'), 'error')
      return
    }
    try {
      await put('requests', row)
    } catch {
      toast(t('error'), 'error')
      return
    }
    form.hidden = true
    success.hidden = false
    success.innerHTML = successMarkup(row)
    success.querySelector('[data-copy-ticket]')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(row.ticket); toast(t('copied')) } catch { toast(row.ticket) }
    })
    success.querySelector('#new-request')?.addEventListener('click', () => {
      form.reset()
      const initial = prefill(params)
      form.elements.model.value = initial.model
      form.elements.brand.value = initial.brand
      success.hidden = true
      success.innerHTML = ''
      form.hidden = false
      form.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    success.scrollIntoView({ behavior: 'smooth', block: 'start' })
    toast(t('requests.saved'))
  })
}

export function contactView() {
  const data = settings()
  const phone = data.phone || '+967777066424'
  const email = data.email || 'contact@brxvih.com'
  return `<div class="page">
    ${pageHeader({ kicker: t('contact.kicker'), title: t('contact.title'), lead: t('contact.lead'), side: `<p>${esc(t('contact.note'))}</p><div class="detail-actions mt-2"><a class="btn btn-primary btn-sm" href="${genericWa()}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('contact.whatsapp'))}</a><a class="btn btn-sm" href="tel:${esc(phone.replace(/[^\d+]/g, ''))}">${icon('phone')}${esc(t('contact.phone'))}</a></div>` })}
    <div class="shell"><div class="section" style="padding-block-start:34px">
      <div class="grid grid-3">
        <a class="card card-link contact-card" href="${genericWa()}" target="_blank" rel="noopener"><span class="card-icon">${icon('whatsapp')}</span><p class="mono-label">${esc(t('contact.whatsapp'))}</p><h3>${esc(data.whatsapp || '967777066424')}</h3><p>${esc(t('contact.whatsappValue'))}</p><div class="card-meta"><span class="signal-text">${icon('arrow-up-right')}</span></div></a>
        <a class="card card-link contact-card" href="tel:${esc(phone.replace(/[^\d+]/g, ''))}"><span class="card-icon">${icon('phone')}</span><p class="mono-label">${esc(t('contact.phone'))}</p><h3 dir="ltr">${esc(phone)}</h3><p>${esc(t('contact.hoursValue'))}</p><div class="card-meta"><span>${esc(t('contact.hours'))}</span></div></a>
        <a class="card card-link contact-card" href="mailto:${esc(email)}"><span class="card-icon">${icon('message')}</span><p class="mono-label">${esc(t('contact.email'))}</p><h3 dir="ltr">${esc(email)}</h3><p>${esc(t('contact.locationValue'))}</p><div class="card-meta"><span>${esc(t('contact.location'))}</span></div></a>
      </div>
      <div class="grid grid-2 mt-3">
        <div class="side-panel"><h3>${icon('clock')}${esc(t('contact.hours'))}</h3><p>${esc(t('contact.hoursValue'))}</p><p class="mt-2">${esc(data.country || 'اليمن')} · ${esc(t('contact.locationValue'))}</p></div>
        <div class="side-panel"><h3>${icon('alert')}${esc(t('security.defensive'))}</h3><p>${esc(t('contact.note'))}</p><a class="btn btn-primary btn-sm" href="#/requests">${icon('clipboard')}${esc(t('contact.requestCta'))}</a><a class="btn btn-sm" href="#/phones">${icon('smartphone')}${esc(t('contact.modelCta'))}</a></div>
      </div>
    </div></div>
  </div>`
}
