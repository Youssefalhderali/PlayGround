import { t } from './i18n.js'

export function icon(name, className = '') {
  return `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`
}

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char])
}

export function safeUrl(value) {
  const url = String(value || '').trim()
  return /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : ''
}

export function initials(name) {
  const letters = String(name || 'B').replace(/[^\p{L}\p{N}]/gu, ' ').trim().split(/\s+/).slice(0, 2)
  return letters.map((part) => [...part][0] || '').join('').toUpperCase() || 'B'
}

export function phoneVisual(phone, { lazy = true, size = 'card' } = {}) {
  const url = String(phone?.image_url || '')
  const hasImage = /^https:\/\//.test(url)
  const fallback = `<span class="phone-fallback" ${hasImage ? 'hidden' : ''}>${esc(initials(phone?.brand || phone?.name))}</span>`
  const image = hasImage
    ? `<img src="${esc(url)}" alt="${esc(phone.name)}" ${lazy ? 'loading="lazy"' : ''} decoding="async" referrerpolicy="no-referrer" data-phone-image>`
    : ''
  return `${image}${fallback}`
}

export function emptyState(iconName, title, desc, action = '') {
  return `<div class="empty">
    <span class="empty-icon">${icon(iconName)}</span>
    <h3>${esc(title)}</h3>
    ${desc ? `<p>${esc(desc)}</p>` : ''}
    ${action || ''}
  </div>`
}

export function toast(message, type = 'success') {
  const region = document.getElementById('toast-region')
  if (!region) return
  const node = document.createElement('div')
  node.className = `toast ${type === 'error' ? 'error' : ''}`
  node.innerHTML = `${icon(type === 'error' ? 'alert' : 'check')}<span>${esc(message)}</span>`
  region.append(node)
  window.setTimeout(() => {
    node.style.opacity = '0'
    node.style.transform = 'translateY(8px)'
    window.setTimeout(() => node.remove(), 220)
  }, 3600)
}

export function closeModal() {
  const root = document.getElementById('modal-root')
  if (!root) return
  root.hidden = true
  root.innerHTML = ''
  document.body.classList.remove('lock')
}

export function openModal({ title, body, foot = '', wide = false }) {
  const root = document.getElementById('modal-root')
  root.innerHTML = `<div class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-head"><h2 id="modal-title">${esc(title)}</h2><button class="icon-btn" type="button" data-close-modal aria-label="${t('close')}">${icon('close')}</button></div>
    <div class="modal-body">${body}</div>
    ${foot ? `<div class="modal-foot">${foot}</div>` : ''}
  </div>`
  root.hidden = false
  document.body.classList.add('lock')
  root.onclick = (event) => {
    if (event.target === root || event.target.closest('[data-close-modal]')) closeModal()
  }
  const focusTarget = root.querySelector('input:not([type=hidden]), select, textarea, button')
  window.setTimeout(() => focusTarget?.focus(), 40)
  return root
}

export function confirmDialog(message, { danger = true, confirmLabel = t('confirm') } = {}) {
  return new Promise((resolve) => {
    const root = openModal({
      title: t('confirm'),
      body: `<p class="modal-explain">${esc(message)}</p>`,
      foot: `<button class="btn btn-sm" type="button" data-cancel>${esc(t('cancel'))}</button><button class="btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}" type="button" data-confirm>${esc(confirmLabel)}</button>`
    })
    root.querySelector('[data-cancel]').onclick = () => { closeModal(); resolve(false) }
    root.querySelector('[data-confirm]').onclick = () => { closeModal(); resolve(true) }
  })
}

export async function copyText(text, message = t('copied')) {
  try {
    await navigator.clipboard.writeText(text)
    toast(message)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.append(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    toast(ok ? message : t('error'), ok ? 'success' : 'error')
    return ok
  }
}

export async function shareLink(title, text, url = location.href) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return
    } catch {}
  }
  await copyText(url, t('shareCopied'))
}

export function debounce(fn, wait = 180) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

export function setMeta(title, description = '') {
  document.title = title ? `${title} — Brxvih` : 'Brxvih — مرجع صيانة الهواتف والبرمجة'
  if (description) {
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.append(meta)
    }
    meta.content = description
  }
}

export function markdown(markdownText) {
  const source = String(markdownText || '')
  const headings = []
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const html = []
  let listType = null
  let inCode = false
  const closeList = () => {
    if (listType) { html.push(`</${listType}>`); listType = null }
  }
  const inline = (value) => esc(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (/^```/.test(line)) {
      closeList()
      inCode = !inCode
      html.push(inCode ? '<pre><code>' : '</code></pre>')
      continue
    }
    if (inCode) { html.push(`${esc(line)}\n`); continue }
    if (!line.trim()) { closeList(); continue }
    const heading = line.match(/^(#{2,4})\s+(.+)$/)
    if (heading) {
      closeList()
      const level = heading[1].length
      const id = `section-${headings.length + 1}`
      const text = heading[2].trim()
      headings.push({ id, text, level })
      html.push(`<h${level} id="${id}">${inline(text)}</h${level}>`)
      continue
    }
    const ordered = line.match(/^\d+[.)]\s+(.+)$/)
    if (ordered) {
      if (listType !== 'ol') { closeList(); html.push('<ol>'); listType = 'ol' }
      html.push(`<li>${inline(ordered[1])}</li>`)
      continue
    }
    const bullet = line.match(/^[-*]\s+(.+)$/)
    if (bullet) {
      if (listType !== 'ul') { closeList(); html.push('<ul>'); listType = 'ul' }
      html.push(`<li>${inline(bullet[1])}</li>`)
      continue
    }
    if (/^>\s?/.test(line)) {
      closeList()
      html.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`)
      continue
    }
    closeList()
    html.push(`<p>${inline(line)}</p>`)
  }
  closeList()
  if (inCode) html.push('</code></pre>')
  return { html: html.join(''), headings }
}

export function iconButton(label, iconName, attributes = '') {
  return `<button class="icon-btn" type="button" aria-label="${esc(label)}" ${attributes}>${icon(iconName)}</button>`
}

export function pageHeader({ kicker, title, lead, side = '', meta = '', breadcrumb = '' }) {
  return `<header class="page-head">
    <div class="shell">
      ${breadcrumb}
      <div class="page-head-row">
        <div>
          <p class="eyebrow">${esc(kicker)}</p>
          <h1 class="display">${esc(title)}</h1>
          ${meta ? `<div class="page-head-meta">${meta}</div>` : ''}
        </div>
        ${side ? `<div class="page-head-side">${side}</div>` : ''}
      </div>
    </div>
  </header>`
}

export function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="breadcrumb">${items.map((item, index) => {
    const content = item.href ? `<a href="${item.href}">${esc(item.label)}</a>` : `<span>${esc(item.label)}</span>`
    return `${index ? icon('chevron-left') : ''}${content}`
  }).join('')}</nav>`
}

export function scrollToTop(behavior = 'instant') {
  window.scrollTo({ top: 0, behavior })
}

export function focusMain() {
  const main = document.getElementById('app')
  main?.focus({ preventScroll: true })
}
