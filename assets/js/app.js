import { t, getLang, toggleLang, setLang, nf } from './i18n.js'
import { loadData, store, content, phoneBySlug, articleBySlug, articleTitle, articleExcerpt, serviceTitle, serviceDesc, toolDesc, normalize } from './data.js'
import { icon, esc, setMeta, toast, scrollToTop } from './ui.js'
import { hashFor, genericWa } from './shared.js'
import { renderAdmin } from './admin.js'
import { homeView, bindHome } from './views/home.js'
import { phonesView, bindPhones, phoneView, bindPhoneDetail, pricesView, bindPrices, partsView } from './views/catalog.js'
import { servicesView, serviceView, firmwareView, bindFirmware } from './views/services.js'
import { faultsView, securityView, toolsView, bindTools, articlesView, articleView, bindArticle, faqView } from './views/knowledge.js'
import { requestsView, bindRequests, contactView } from './views/contact.js'
import { searchPhones } from './data.js'

const app = document.getElementById('app')
const boot = document.getElementById('boot')
let ready = false
let renderToken = 0
let suppressScroll = false
let pendingFocus = ''
let searchResults = []
let selectedResult = -1

const NAV_ITEMS = [
  ['#/phones', 'nav.models', 'smartphone'],
  ['#/services', 'nav.services', 'wrench'],
  ['#/firmware', 'nav.firmware', 'download'],
  ['#/prices', 'nav.prices', 'tag'],
  ['#/faults', 'nav.faults', 'alert'],
  ['#/security', 'nav.security', 'shield'],
  ['#/articles', 'nav.articles', 'book']
]

const MOBILE_ITEMS = [
  ...NAV_ITEMS,
  ['#/tools', 'nav.tools', 'toolbox'],
  ['#/parts', 'nav.parts', 'battery'],
  ['#/requests', 'nav.requests', 'clipboard'],
  ['#/contact', 'nav.contact', 'message']
]

const QUICK_LINKS = [
  ['#/phones', 'search.phones'],
  ['#/prices', 'nav.prices'],
  ['#/firmware', 'nav.firmware'],
  ['#/faults', 'nav.faults'],
  ['#/articles', 'search.articles'],
  ['#/tools', 'search.tools'],
  ['#/requests', 'nav.requests'],
  ['#/contact', 'nav.contact']
]

function parseRoute() {
  const raw = (location.hash || '').replace(/^#/, '') || '/'
  const [rawPath, query = ''] = raw.split('?')
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
  return { path: decodeURI(path), params: new URLSearchParams(query) }
}

function brandBySlug(slug) {
  return (content().brands || []).find((brand) => brand.slug === slug) || null
}

function routeSection(path) {
  const first = path.split('/').filter(Boolean)[0] || ''
  if (first === 'brand' || first === 'phone') return 'phones'
  if (first === 'article') return 'articles'
  return first
}

function setActiveNav(path) {
  const active = routeSection(path)
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const isActive = link.dataset.nav === active
    link.classList.toggle('active', isActive)
    if (isActive) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })
}

function buildMobileNav() {
  const nav = document.getElementById('mobile-nav')
  if (!nav) return
  nav.innerHTML = MOBILE_ITEMS.map(([href, key, iconName]) => `<a href="${href}"><span>${esc(t(key))}</span><small>${icon(iconName)} ${esc(key.split('.')[1].toUpperCase())}</small></a>`).join('')
  const foot = document.getElementById('mobile-menu-foot')
  if (foot) foot.innerHTML = `<a class="btn btn-primary" href="${genericWa()}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('whatsapp'))}</a><p class="mono-label" style="text-align:center">BRXVIH · WHITE BLACK · ${esc(t('status'))}</p>`
}

function buildFooter() {
  const container = document.getElementById('footer-cols')
  if (!container) return
  const cols = [
    ['INDEX', [['#/phones', 'nav.models'], ['#/brand/samsung', 'Samsung'], ['#/brand/apple', 'Apple'], ['#/brand/xiaomi', 'Xiaomi']]],
    ['SERVICE', [['#/services', 'nav.services'], ['#/firmware', 'nav.firmware'], ['#/prices', 'nav.prices'], ['#/parts', 'nav.parts']]],
    ['KNOWLEDGE', [['#/faults', 'nav.faults'], ['#/security', 'nav.security'], ['#/articles', 'nav.articles'], ['#/tools', 'nav.tools']]]
  ]
  container.innerHTML = cols.map(([heading, links]) => `<div class="footer-col"><h3>${esc(heading)}</h3>${links.map(([href, key]) => `<a href="${href}">${esc(key.includes('.') ? t(key) : key)}</a>`).join('')}</div>`).join('')
}

function buildSearchQuick() {
  const quick = document.getElementById('search-quick')
  if (!quick) return
  quick.innerHTML = QUICK_LINKS.map(([href, key]) => `<a href="${href}">${esc(t(key))}</a>`).join('')
}

function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n)
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder))
  })
  const langButton = document.querySelector('#toggle-lang span')
  if (langButton) langButton.textContent = getLang() === 'ar' ? 'EN' : 'ع'
  const themeButton = document.getElementById('toggle-theme')
  if (themeButton) {
    const light = document.documentElement.dataset.theme === 'light'
    themeButton.setAttribute('aria-label', light ? t('theme.dark') : t('theme.light'))
  }
  document.getElementById('year').textContent = new Date().getFullYear()
}

function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  try { localStorage.setItem('brxvih.theme', next) } catch {}
  const themeButton = document.getElementById('toggle-theme')
  if (themeButton) themeButton.setAttribute('aria-label', next === 'light' ? t('theme.dark') : t('theme.light'))
}

function setupChrome() {
  const searchOverlay = document.getElementById('search-overlay')
  const mobileMenu = document.getElementById('mobile-menu')
  const menuButton = document.getElementById('open-menu')

  const syncLock = () => {
    const locked = !searchOverlay?.hidden || !mobileMenu?.hidden
    document.body.classList.toggle('lock', Boolean(locked))
  }

  const openSearch = () => {
    if (!searchOverlay) return
    if (mobileMenu) mobileMenu.hidden = true
    searchOverlay.hidden = false
    syncLock()
    const input = document.getElementById('global-search')
    input?.focus()
    input?.select()
  }
  const closeSearch = () => {
    if (!searchOverlay) return
    searchOverlay.hidden = true
    syncLock()
  }
  const openMenu = () => {
    if (!mobileMenu) return
    if (searchOverlay) searchOverlay.hidden = true
    mobileMenu.hidden = false
    menuButton?.setAttribute('aria-expanded', 'true')
    syncLock()
    mobileMenu.querySelector('a,button')?.focus()
  }
  const closeMenu = () => {
    if (!mobileMenu) return
    mobileMenu.hidden = true
    menuButton?.setAttribute('aria-expanded', 'false')
    syncLock()
  }

  document.getElementById('open-search')?.addEventListener('click', openSearch)
  document.getElementById('close-search')?.addEventListener('click', closeSearch)
  document.getElementById('open-menu')?.addEventListener('click', openMenu)
  document.getElementById('close-menu')?.addEventListener('click', closeMenu)
  mobileMenu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu()
  })
  searchOverlay?.addEventListener('click', (event) => {
    if (event.target === searchOverlay) closeSearch()
  })

  document.getElementById('toggle-theme')?.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light')
  })
  document.getElementById('toggle-lang')?.addEventListener('click', () => {
    toggleLang()
    applyStaticTranslations()
    buildFooter()
    buildMobileNav()
    buildSearchQuick()
    closeMenu()
    closeSearch()
    renderRoute({ preserveScroll: true })
  })

  document.getElementById('to-top')?.addEventListener('click', () => scrollToTop('smooth'))
  window.addEventListener('scroll', () => {
    document.getElementById('to-top')?.classList.toggle('show', window.scrollY > 700)
    document.getElementById('site-header')?.classList.toggle('condensed', window.scrollY > 30)
  }, { passive: true })

  document.addEventListener('keydown', (event) => {
    const target = event.target
    const typing = target instanceof HTMLElement && (target.matches('input,textarea,select') || target.isContentEditable)
    if ((event.key === '/' && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault()
      openSearch()
      return
    }
    if (event.key === 'Escape') {
      if (!searchOverlay?.hidden) { closeSearch(); return }
      if (!mobileMenu?.hidden) { closeMenu(); return }
    }
    if (!searchOverlay?.hidden && searchResults.length) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        selectedResult = event.key === 'ArrowDown'
          ? (selectedResult + 1) % searchResults.length
          : (selectedResult - 1 + searchResults.length) % searchResults.length
        paintSelectedResult()
      } else if (event.key === 'Enter' && selectedResult >= 0) {
        event.preventDefault()
        const item = searchResults[selectedResult]
        closeSearch()
        location.hash = item.href
      }
    }
  })

  const searchInput = document.getElementById('global-search')
  let searchTimer
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => runSearch(searchInput.value), 140)
  })
  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && selectedResult < 0 && searchInput.value.trim()) {
      event.preventDefault()
      closeSearch()
      location.hash = hashFor('/phones', { q: searchInput.value.trim() })
    }
  })

  buildSearchQuick()
  buildFooter()
  applyStaticTranslations()
}

function runSearch(query) {
  const box = document.getElementById('search-results')
  if (!box) return
  const q = normalize(query)
  selectedResult = -1
  searchResults = []
  if (!q) {
    box.innerHTML = `<div class="search-hint"><p class="mono-label">QUICK ACCESS</p><div class="quick-links" id="search-quick"></div></div>`
    buildSearchQuick()
    return
  }
  const phones = searchPhones(query, 6)
  const services = (content().services || []).filter((service) => normalize(`${serviceTitle(service)} ${serviceDesc(service)} ${service.slug}`).includes(q)).slice(0, 4)
  const articles = (content().articles || []).filter((article) => normalize(`${articleTitle(article)} ${articleExcerpt(article)} ${(article.tags || []).join(' ')}`).includes(q)).slice(0, 5)
  const tools = (content().tools || []).filter((tool) => normalize(`${tool.name} ${toolDesc(tool)} ${tool.platform}`).includes(q)).slice(0, 4)
  const groups = []
  for (const phone of phones) {
    groups.push({ kind: 'PHONE', icon: 'smartphone', href: hashFor(`/phone/${phone.slug}`), title: phone.name, sub: `${phone.brand} · ${phone.release_year || ''}` })
  }
  for (const service of services) {
    groups.push({ kind: 'SERVICE', icon: 'wrench', href: hashFor(`/services/${service.slug}`), title: serviceTitle(service), sub: serviceDesc(service) })
  }
  for (const article of articles) {
    groups.push({ kind: 'GUIDE', icon: 'book', href: hashFor(`/article/${article.slug}`), title: articleTitle(article), sub: articleExcerpt(article) })
  }
  for (const tool of tools) {
    groups.push({ kind: 'TOOL', icon: 'toolbox', href: '#/tools', title: tool.name, sub: `${tool.platform} · ${tool.source || ''}` })
  }
  searchResults = groups
  if (!groups.length) {
    box.innerHTML = `<div class="search-hint"><div class="empty"><span class="empty-icon">${icon('search')}</span><h3>${esc(t('noResults'))}</h3><p>${esc(t('search.empty'))}</p></div></div>`
    return
  }
  const rows = groups.map((item, index) => `<a class="search-result" href="${item.href}" data-search-index="${index}"><span class="sr-icon">${icon(item.icon)}</span><span><b>${esc(item.title)}</b><small>${esc(item.sub)}</small></span><span class="sr-kind">${esc(item.kind)}</span></a>`).join('')
  box.innerHTML = `<div class="search-group"><h3>${nf(groups.length)} RESULTS</h3>${rows}</div>`
  box.querySelectorAll('.search-result').forEach((link) => {
    link.addEventListener('click', () => closeSearch())
  })
}

function paintSelectedResult() {
  document.querySelectorAll('.search-result').forEach((node) => {
    node.classList.toggle('selected', Number(node.dataset.searchIndex) === selectedResult)
  })
  const selected = document.querySelector('.search-result.selected')
  selected?.scrollIntoView({ block: 'nearest' })
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay')
  if (!overlay) return
  overlay.hidden = true
  document.body.classList.toggle('lock', false)
}

function navigate(hash, { preserveScroll = false, focus = '' } = {}) {
  if (preserveScroll) suppressScroll = true
  if (focus) pendingFocus = focus
  if (location.hash === hash) {
    renderRoute({ preserveScroll: true })
    return
  }
  location.hash = hash
}

async function renderRoute({ preserveScroll = false } = {}) {
  if (!ready) return
  const token = ++renderToken
  const { path, params } = parseRoute()
  const segments = path.split('/').filter(Boolean)
  const root = segments[0] || ''
  let html = ''
  let binder = null
  let title = t('nav.home')
  let description = t('footer.tagline')

  if (!root) {
    html = homeView()
    binder = () => bindHome(app)
  } else if (root === 'phones') {
    html = phonesView(params)
    binder = () => bindPhones(app, { onNavigate: navigate })
    title = t('phones.title')
    description = t('phones.lead')
  } else if (root === 'brand' && segments[1]) {
    const brand = brandBySlug(segments[1])
    if (!brand) html = notFound()
    else {
      html = phonesView(params, brand.nameEn)
      binder = () => bindPhones(app, { onNavigate: navigate })
      title = brand.nameEn
    }
  } else if (root === 'phone' && segments[1]) {
    const phone = phoneBySlug(segments[1])
    if (!phone) html = notFound()
    else {
      html = await phoneView(segments[1])
      binder = () => bindPhoneDetail(app, segments[1])
      title = phone.name
      description = `${phone.brand} ${phone.name} — ${phone.chipset || ''}`
    }
  } else if (root === 'prices') {
    html = pricesView()
    binder = () => bindPrices(app)
    title = t('prices.title')
    description = t('prices.lead')
  } else if (root === 'services') {
    if (segments[1]) {
      html = serviceView(segments[1])
      if (!html) html = notFound()
      else {
        const service = (content().services || []).find((item) => item.slug === segments[1])
        title = service ? serviceTitle(service) : t('services.title')
        description = service ? serviceDesc(service) : ''
      }
    } else {
      html = servicesView()
      title = t('services.title')
      description = t('services.lead')
    }
  } else if (root === 'firmware') {
    html = firmwareView(params)
    binder = () => bindFirmware(app)
    title = t('firmware.title')
    description = t('firmware.lead')
  } else if (root === 'faults') {
    html = faultsView(params)
    title = t('faults.title')
    description = t('faults.lead')
  } else if (root === 'security') {
    html = securityView()
    title = t('security.title')
    description = t('security.lead')
  } else if (root === 'tools') {
    html = toolsView(params)
    binder = () => bindTools(app, { onNavigate: navigate })
    title = t('tools.title')
    description = t('tools.lead')
  } else if (root === 'articles') {
    html = articlesView(params)
    title = t('articles.title')
    description = t('articles.lead')
  } else if (root === 'article' && segments[1]) {
    const article = articleBySlug(segments[1])
    if (!article) html = notFound()
    else {
      html = articleView(segments[1])
      binder = () => bindArticle(app, segments[1])
      title = articleTitle(article)
      description = articleExcerpt(article)
    }
  } else if (root === 'requests') {
    html = requestsView(params)
    binder = () => bindRequests(app, params)
    title = t('requests.title')
    description = t('requests.lead')
  } else if (root === 'contact') {
    html = contactView()
    title = t('contact.title')
    description = t('contact.lead')
  } else if (root === 'faq') {
    html = faqView()
    title = getLang() === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'
  } else if (root === 'parts') {
    html = partsView()
    title = t('parts.title')
    description = t('parts.lead')
  } else if (root === 'admin') {
    setActiveNav(path)
    setMeta(t('admin.title'), t('admin.loginDesc'))
    await renderAdmin(app, segments[1] || '')
    if (token !== renderToken) return
    if (!preserveScroll) scrollToTop()
    if (pendingFocus) {
      const selector = pendingFocus
      pendingFocus = ''
      requestAnimationFrame(() => document.querySelector(selector)?.focus())
    }
    return
  } else {
    html = notFound()
  }

  if (token !== renderToken) return
  app.innerHTML = html
  setActiveNav(path)
  setMeta(title, description)
  if (binder) {
    try { binder() } catch (error) { console.error(error) }
  }
  if (!preserveScroll) scrollToTop()
  if (pendingFocus) {
    const selector = pendingFocus
    pendingFocus = ''
    requestAnimationFrame(() => {
      const field = document.querySelector(selector)
      if (field) {
        field.focus()
        if (field.setSelectionRange) field.setSelectionRange(field.value.length, field.value.length)
      }
    })
  }
}

function notFound() {
  return `<div class="page"><div class="shell" style="padding-block:100px"><div class="empty"><span class="empty-icon">${icon('alert')}</span><h3>${esc(getLang() === 'ar' ? 'الصفحة غير موجودة' : 'Page not found')}</h3><p>${esc(getLang() === 'ar' ? 'الرابط غير صحيح أو أُزيل.' : 'The link is incorrect or was removed.')}</p><a class="btn btn-sm" href="#/">${esc(t('home'))}</a></div></div></div>`
}

function bindGlobalImageFallback() {
  document.addEventListener('error', (event) => {
    const image = event.target
    if (!(image instanceof HTMLImageElement) || !image.matches('[data-phone-image]')) return
    image.hidden = true
    const fallback = image.nextElementSibling
    if (fallback?.classList.contains('phone-fallback')) fallback.hidden = false
  }, true)
}

async function start() {
  bindGlobalImageFallback()
  setupChrome()
  try {
    await loadData()
    document.getElementById('top-phone')?.setAttribute('href', `tel:${(content().settings?.phone || '+967777066424').replace(/[^\d+]/g, '')}`)
    document.querySelectorAll('.nav-wa, .utility-links a[target="_blank"]').forEach((link) => { link.href = genericWa() })
    buildFooter()
    buildMobileNav()
    ready = true
    boot?.classList.add('done')
    setTimeout(() => boot?.remove(), 700)
    if (!location.hash) history.replaceState(null, '', '#/')
    await renderRoute()
  } catch (error) {
    console.error(error)
    ready = true
    boot?.classList.add('done')
    app.innerHTML = `<div class="page"><div class="shell" style="padding-block:100px"><div class="empty"><span class="empty-icon">${icon('database')}</span><h3>${esc(t('serverError'))}</h3><p>${esc(getLang() === 'ar' ? 'تعذر تحميل ملفات البيانات. تأكد من تشغيل الموقع عبر خادم محلي أو GitHub Pages.' : 'Could not load the data files. Make sure the site is served over HTTP or GitHub Pages.')}</p><button class="btn btn-sm" type="button" onclick="location.reload()">${esc(t('retry'))}</button></div></div></div>`
    toast(t('serverError'), 'error')
  }
}

window.addEventListener('hashchange', () => {
  const preserve = suppressScroll
  suppressScroll = false
  renderRoute({ preserveScroll: preserve })
})

start()
