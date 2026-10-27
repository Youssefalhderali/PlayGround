import { t, getLang, nf } from '../i18n.js'
import {
  store, content, articleBySlug, articleTitle, articleExcerpt, articleBody,
  securityTitle, securityLevel, securityTopics, toolDesc, faq
} from '../data.js'
import { icon, esc, safeUrl, pageHeader, breadcrumb, emptyState, markdown, shareLink } from '../ui.js'
import {
  articleCard, articleRow, articleDate, sortArticles, categoryIcons, categoryOrder,
  hashFor, genericWa
} from '../shared.js'

const FAULT_KINDS = {
  display: { icon: 'display', slugs: ['screen-replacement', 'touch-issues', 'black-screen'] },
  power: { icon: 'battery', slugs: ['battery-health', 'charging-port', 'overheating'] },
  software: { icon: 'cpu', slugs: ['bootloop'] },
  board: { icon: 'code', slugs: ['black-screen', 'overheating'] },
  water: { icon: 'shield', slugs: ['water-damage'] }
}

function categoryCount(category) {
  return (content().articles || []).filter((article) => article.category === category).length
}

export function faultsView(params) {
  const kind = params.get('kind') || ''
  const articles = sortArticles((content().articles || []).filter((article) => article.category === 'maintenance'))
  const filtered = kind && FAULT_KINDS[kind]
    ? articles.filter((article) => FAULT_KINDS[kind].slugs.includes(article.slug))
    : articles
  const cards = Object.entries(FAULT_KINDS).map(([key, value]) => {
    const primary = articles.find((article) => value.slugs.includes(article.slug))
    const title = t(`faults.${key}`)
    return `<a class="card card-link fault-card ${kind === key ? 'is-active' : ''}" href="${primary ? hashFor(`/faults`, { kind: key }) : genericWa()}">
      <span class="card-num">${String(store.phones.length).slice(0, 2)}</span>
      <span class="card-icon">${icon(value.icon)}</span>
      <h3>${esc(title)}</h3>
      <p>${esc(t('faults.lead'))}</p>
      <div class="card-meta"><span class="mono-label">${nf(value.slugs.length)} ${esc(t('articles.guides'))}</span><span class="card-arrow">${icon('arrow-up-right')}</span></div>
    </a>`
  }).join('')
  return `<div class="page">
    ${pageHeader({ kicker: t('faults.kicker'), title: t('faults.title'), lead: t('faults.lead'), meta: `<span class="pill signal">${esc(t('faults.safety'))}</span><span class="pill">${nf(articles.length)} ${esc(t('faults.guides'))}</span><a class="pill" href="${genericWa()}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('faults.ask'))}</a>` })}
    <div class="shell"><div class="section" style="padding-block-start:34px">
      <div class="notice warn mb-3">${icon('alert')}<span><b>${esc(t('faults.safety'))}:</b> ${esc(t('faults.safetyText'))}</span></div>
      <div class="section-subhead"><h2>${esc(t('faults.categories'))}</h2><a class="text-link" href="#/faults">${esc(t('faults.all'))} ${icon('arrow-left')}</a></div>
      <div class="grid grid-3">${cards}</div>
      <div class="section-subhead mt-3"><h2>${esc(kind && FAULT_KINDS[kind] ? t(`faults.${kind}`) : t('faults.guides'))}</h2><span class="pill">${nf(filtered.length)}</span></div>
      <div class="article-list">${filtered.length ? filtered.map(articleRow).join('') : emptyState('book', t('articles.noResults'), '', `<a class="btn btn-sm" href="#/faults">${esc(t('faults.all'))}</a>`)}</div>
    </div></div>
  </div>`
}

export function securityView() {
  const modules = content().securityModules || []
  return `<div class="page">
    ${pageHeader({ kicker: t('security.kicker'), title: t('security.title'), lead: t('security.lead'), side: `<p>${esc(t('security.defensiveText'))}</p><span class="pill signal mt-2">${icon('shield')}${esc(t('security.defensive'))}</span>` })}
    <div class="shell"><div class="section" style="padding-block-start:38px">
      <div class="section-subhead"><h2>${esc(t('security.modules'))}</h2><span class="pill">${nf(modules.length)}</span></div>
      <div class="grid grid-2">${modules.map((module) => `<a class="card card-link security-card" href="${module.article ? hashFor(`/article/${module.article}`) : '#/security'}"><span class="card-icon">${icon(module.icon || 'shield')}</span><div class="security-top"><h3>${esc(securityTitle(module))}</h3><span class="pill">${esc(securityLevel(module))}</span></div><div class="tag-list">${securityTopics(module).map((topic) => `<span class="mini-tag">${esc(topic)}</span>`).join('')}</div><div class="card-meta"><span class="mono-label">${esc(t('security.topics'))}</span><span class="card-arrow">${icon('arrow-up-right')}</span></div></a>`).join('')}</div>
      <div class="grid grid-2 mt-3">
        <div class="card"><span class="card-icon">${icon('check')}</span><h3>${esc(t('security.guidelines'))}</h3><div class="source-list">${[1, 2, 3, 4].map((index) => `<div class="source-item"><span>${esc(t(`security.guide${index}`))}</span>${icon('check')}</div>`).join('')}</div></div>
        <div class="card"><span class="card-icon">${icon('alert')}</span><h3>${esc(t('security.defensive'))}</h3><p>${esc(t('security.defensiveText'))}</p><div class="notice mt-2">${icon('shield')}<span>${esc(t('security.guide1'))}</span></div></div>
      </div>
    </div></div>
  </div>`
}

export function toolsView(params) {
  const category = params.get('category') || ''
  const risk = params.get('risk') || ''
  const tools = (content().tools || []).filter((tool) => (!category || tool.category === category) && (!risk || tool.risk === risk))
  const categories = ['software', 'hardware']
  return `<div class="page">
    ${pageHeader({ kicker: t('tools.kicker'), title: t('tools.title'), lead: t('tools.lead'), meta: `<span class="pill">${nf((content().tools || []).length)} ${esc(t('tools.all'))}</span><span class="pill warn">${esc(t('tools.disclaimer'))}</span>` })}
    <div class="shell"><div class="section" style="padding-block-start:34px">
      <div class="tabs">
        <a class="tab-btn ${!category ? 'active' : ''}" href="#/tools">${esc(t('tools.all'))}</a>
        ${categories.map((name) => `<a class="tab-btn ${category === name ? 'active' : ''}" href="${hashFor('/tools', { category: name })}">${esc(t(`tools.${name}`))}</a>`).join('')}
      </div>
      <div class="admin-toolbar" style="margin-block:14px">
        <label class="field"><span class="field-label">${esc(t('tools.risk'))}</span><select class="select" id="tool-risk"><option value="">${esc(t('all'))}</option>${['high', 'medium', 'low'].map((level) => `<option value="${level}" ${risk === level ? 'selected' : ''}>${esc(t(`tools.${level}`))}</option>`).join('')}</select></label>
        <span class="pill">${nf(tools.length)} ${esc(t('results'))}</span>
      </div>
      <div class="tools-grid">${tools.length ? tools.map((tool) => `<article class="tool-card"><div class="tool-top"><span class="risk-badge ${esc(tool.risk)}">${esc(t(`tools.${tool.risk}`))}</span><span class="pill">${esc(tool.platform || '—')}</span></div><h3>${esc(tool.name)}</h3><p>${esc(toolDesc(tool))}</p><div class="tool-foot"><span>${esc(tool.free ? t('tools.free') : t('tools.paid'))} · ${esc(tool.category === 'hardware' ? t('tools.hardware') : t('tools.software'))}</span>${tool.url ? `<a class="text-link" href="${esc(safeUrl(tool.url))}" target="_blank" rel="noopener">${icon('external')}${esc(t('source'))}</a>` : ''}</div><div class="tool-source">${esc(tool.source || '')}</div></article>`).join('') : emptyState('toolbox', t('noResults'), '', `<a class="btn btn-sm" href="#/tools">${esc(t('reset'))}</a>`)}</div>
      <div class="notice warn mt-3">${icon('alert')}<span>${esc(t('tools.disclaimer'))}</span></div>
    </div></div>
  </div>`
}

export function bindTools(root, { onNavigate } = {}) {
  root.querySelector('#tool-risk')?.addEventListener('change', (event) => {
    const category = new URLSearchParams(location.hash.split('?')[1] || '').get('category') || ''
    onNavigate?.(hashFor('/tools', { category, risk: event.target.value }))
  })
}

export function articlesView(params) {
  const category = params.get('category') || ''
  const all = sortArticles(content().articles || [])
  const list = category ? all.filter((article) => article.category === category) : all
  const counts = Object.fromEntries(categoryOrder.map((name) => [name, categoryCount(name)]))
  return `<div class="page">
    ${pageHeader({ kicker: t('articles.kicker'), title: t('articles.title'), lead: t('articles.lead'), meta: `<span class="pill">${nf(all.length)} ${esc(t('articles.all'))}</span><span class="pill">${nf(categoryOrder.length)} ${esc(t('category'))}</span>` })}
    <div class="shell"><div class="section" style="padding-block-start:34px">
      <div class="tabs">
        <a class="tab-btn ${!category ? 'active' : ''}" href="#/articles">${esc(t('articles.all'))} (${nf(all.length)})</a>
        ${categoryOrder.map((name) => `<a class="tab-btn ${category === name ? 'active' : ''}" href="${hashFor('/articles', { category: name })}">${esc(t(`articles.${name}`))} (${nf(counts[name] || 0)})</a>`).join('')}
      </div>
      ${list.length ? `<div class="grid grid-3 mt-3">${list.map(articleCard).join('')}</div>` : emptyState('book', t('articles.noResults'), '', `<a class="btn btn-sm" href="#/articles">${esc(t('articles.all'))}</a>`)}
      <div class="notice mt-3">${icon('info')}<span>${esc(t('articles.disclaimer'))}</span></div>
    </div></div>
  </div>`
}

export function articleView(slug) {
  const article = articleBySlug(slug)
  if (!article) return ''
  const parsed = markdown(articleBody(article))
  const toc = parsed.headings.filter((heading) => heading.level <= 3)
  const related = sortArticles((content().articles || []).filter((item) => item.slug !== slug && item.category === article.category)).slice(0, 3)
  return `<div class="page">
    <div class="shell">
      ${breadcrumb([{ label: t('home'), href: '#/' }, { label: t('articles.title'), href: '#/articles' }, { label: articleTitle(article) }])}
      <div class="article-layout">
        <article class="article-main">
          <header class="article-head">
            <span class="category-tag">${esc(t(`articles.${article.category}`))}</span>
            <h1 class="display">${esc(articleTitle(article))}</h1>
            <p class="lead article-lead">${esc(articleExcerpt(article))}</p>
            <div class="article-meta"><span>${icon('calendar')}${esc(articleDate(article))}</span><span>${icon('clock')}${nf(article.readMinutes || 3)} ${esc(t('minutes'))}</span><span>${icon('user')}${esc(t('articles.author'))} Brxvih</span></div>
          </header>
          <div class="article-body prose">${parsed.html}</div>
          <div class="article-foot"><button class="btn btn-sm" type="button" data-share-article="${esc(article.slug)}">${icon('share')}${esc(t('articles.share'))}</button><a class="btn btn-sm" href="${genericWa()}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('contact.title'))}</a></div>
          <div class="notice warn mt-3">${icon('alert')}<span>${esc(t('articles.disclaimer'))}</span></div>
        </article>
        <aside class="article-aside article-side">
          ${toc.length ? `<nav class="side-panel article-toc"><h3>${icon('list')}${esc(t('articles.toc'))}</h3><div class="source-list">${toc.map((heading) => `<a class="source-item" href="#${heading.id}" data-toc-link="${heading.id}"><span style="padding-inline-start:${(heading.level - 2) * 12}px">${esc(heading.text)}</span></a>`).join('')}</div></nav>` : ''}
          <div class="side-panel"><h3>${icon('book')}${esc(t('articles.related'))}</h3>${related.length ? `<div class="source-list">${related.map((item) => `<a class="source-item" href="${hashFor(`/article/${item.slug}`)}"><span>${esc(articleTitle(item))}<small>${esc(t(`articles.${item.category}`))}</small></span>${icon('arrow-up-right')}</a>`).join('')}</div>` : `<p>${esc(t('articles.noResults'))}</p>`}</div>
          <div class="side-panel cta-panel"><span class="card-icon">${icon('wrench')}</span><h3>${esc(t('requestRepair'))}</h3><p>${esc(t('contact.lead'))}</p><a class="btn btn-primary btn-sm" href="#/requests">${icon('clipboard')}${esc(t('requestRepair'))}</a></div>
        </aside>
      </div>
    </div>
  </div>`
}

export function bindArticle(root, slug) {
  const article = articleBySlug(slug)
  root.querySelector('[data-share-article]')?.addEventListener('click', () => {
    if (article) shareLink(articleTitle(article), articleExcerpt(article))
  })
  root.querySelectorAll('[data-toc-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      document.getElementById(link.dataset.tocLink)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}

export function faqView() {
  const faqs = content().faqs || []
  return `<div class="page">
    ${pageHeader({ kicker: 'FAQ / SUPPORT', title: getLang() === 'ar' ? 'أسئلة شائعة.' : 'Common questions.', lead: getLang() === 'ar' ? 'إجابات مباشرة عن الأسعار والخصوصية والضمان والطلبات.' : 'Straight answers about pricing, privacy, warranty and requests.' })}
    <div class="shell"><div class="section" style="padding-block-start:34px"><div class="faq-list">${faqs.map((entry) => { const item = faq(entry); return `<details class="faq-item"><summary><span>${esc(item.q)}</span>${icon('chevron-down')}</summary><p>${esc(item.a)}</p></details>` }).join('')}</div></div></div>
  </div>`
}
