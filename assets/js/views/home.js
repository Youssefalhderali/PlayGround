import { t, getLang, nf } from '../i18n.js'
import {
  store, settings, content, serviceTitle, serviceDesc, securityTitle,
  securityLevel, securityTopics, firmwareSourcesFor
} from '../data.js'
import { icon, esc } from '../ui.js'
import {
  serviceIcons, ticker, featuredPhones, phoneCard, articleCard,
  sortArticles, genericWa, waLink
} from '../shared.js'

export function homeView() {
  const services = (content().services || []).slice(0, 6)
  const brands = content().brands || []
  const articles = sortArticles(content().articles || []).slice(0, 3)
  const security = (content().securityModules || []).slice(0, 4)
  const fw = content().firmwareSources || []
  const totalBrands = store.brandGroups.size
  return `<div class="page">
    <section class="hero">
      <div class="shell">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">${esc(t('home.kicker'))}</p>
            <h1 class="hero-title"><span class="line">${esc(t('home.l1'))}</span><span class="line outline">${esc(t('home.l2'))}</span><span class="line">${esc(t('home.l3'))}</span></h1>
            <p class="hero-lead">${esc(t('home.lead'))}</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#/phones">${icon('smartphone')}${esc(t('home.ctaModels'))}</a>
              <a class="btn btn-ghost" href="${genericWa()}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('home.ctaWhatsApp'))}</a>
            </div>
            <form class="hero-search" id="hero-search" role="search">
              ${icon('search')}
              <input type="search" name="q" placeholder="${esc(t('home.searchPlaceholder'))}" aria-label="${esc(t('search.title'))}" autocomplete="off">
              <button class="btn btn-primary btn-sm" type="submit">${esc(t('home.searchBtn'))}</button>
            </form>
            <div class="hero-stats">
              <div class="hero-stat"><b>${nf(store.phones.length)}</b><span>${esc(t('home.statPhones'))}</span></div>
              <div class="hero-stat"><b>${nf(totalBrands)}</b><span>${esc(t('home.statBrands'))}</span></div>
              <div class="hero-stat"><b>${nf(fw.length)}</b><span>${esc(t('home.statSources'))}</span></div>
            </div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <div class="hero-visual-top"><span class="mono-label">${esc(t('home.panelTitle'))}</span><span class="mono-label">2026 / LIVE</span></div>
            <div class="device-stage">
              <span class="device-outline back"></span>
              <span class="device-outline"></span>
              <span class="device-screen"><span class="device-screen-inner">
                <span class="device-readout"><b>BRXVIH / INDEX</b>${nf(store.phones.length)} RECORDS<br>AR / EN</span>
                <span class="device-bottom-readout"><span>WHITE BLACK</span><span>YEMEN</span></span>
              </span></span>
            </div>
            <div class="hero-visual-foot"><span class="mono-label">${esc(t('home.panelSub'))}</span><span class="mono-label">${esc(t('home.panelFoot'))}</span></div>
          </div>
        </div>
      </div>
    </section>
    ${ticker()}
    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div class="section-head-main"><p class="eyebrow">${esc(t('home.servicesKicker'))}</p><h2 class="section-title">${esc(t('home.servicesTitle'))}</h2><p class="section-desc">${esc(t('home.servicesLead'))}</p></div>
          <span class="section-index"><b>01</b> / 08</span>
        </div>
        <div class="grid grid-3">
          ${services.map((service, index) => `<a class="card card-link service-card" href="#/services/${service.slug}">
            <span class="card-num">${String(index + 1).padStart(2, '0')}</span>
            <span class="card-icon">${icon(serviceIcons[service.slug] || 'spark')}</span>
            <h3>${esc(serviceTitle(service))}</h3>
            <p>${esc(serviceDesc(service))}</p>
            <div class="card-meta"><span class="mono-label">${esc(service.slug)}</span><span class="card-arrow">${icon('arrow-up-right')}</span></div>
          </a>`).join('')}
        </div>
        <div class="mt-3"><a class="text-link" href="#/services">${esc(t('viewAll'))} ${icon('arrow-left')}</a></div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div class="section-head-main"><p class="eyebrow">${esc(t('home.modelsKicker'))}</p><h2 class="section-title">${esc(t('home.modelsTitle'))}</h2><p class="section-desc">${esc(t('home.modelsLead'))}</p></div>
          <a class="text-link" href="#/phones">${esc(t('viewAll'))} ${icon('arrow-left')}</a>
        </div>
        <div class="phones-grid">${featuredPhones().map(phoneCard).join('')}</div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div class="section-head-main"><p class="eyebrow">${esc(t('home.brandsKicker'))}</p><h2 class="section-title">${esc(t('home.brandsTitle'))}</h2></div>
          <span class="section-index"><b>${nf(totalBrands)}</b> / BRANDS</span>
        </div>
        <div class="brand-grid">
          ${brands.slice(0, 18).map((brand) => {
            const count = store.brandGroups.get(brand.nameEn)?.length || 0
            return `<a class="brand-tile" href="#/phones?brand=${encodeURIComponent(brand.nameEn)}" style="--brand-color:${esc(brand.color)}">
              <i></i><b>${esc(getLang() === 'ar' ? brand.nameAr : brand.nameEn)}</b><span>${nf(count)} ${esc(t('phones.result'))} · ${esc(brand.series)}</span>
            </a>`
          }).join('')}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="split-panel">
          <div class="split-panel-side">
            <p class="eyebrow">${esc(t('home.firmwareKicker'))}</p>
            <h2 class="section-title" style="font-size:clamp(28px,3.6vw,48px)">${esc(t('home.firmwareTitle'))}</h2>
            <p class="section-desc">${esc(t('home.firmwareLead'))}</p>
            <a class="btn btn-primary btn-sm" href="#/firmware">${icon('download')}${esc(t('phone.firmwareCta'))}</a>
            <div class="stat-band" style="grid-template-columns:1fr 1fr">
              <div class="stat-cell"><b>${nf(fw.length)}</b><span>${esc(t('home.statSources'))}</span></div>
              <div class="stat-cell"><b>67</b><span>iPhone IDs</span></div>
            </div>
          </div>
          <div class="split-panel-main">
            <div class="feature-list">
              <div class="feature-row"><span class="num">01</span><div><b>${esc(t('firmware.verifyTitle'))}</b><small>${esc(t('firmware.verify2'))}</small></div>${icon('check')}</div>
              <div class="feature-row"><span class="num">02</span><div><b>${esc(t('firmware.tabIos'))}</b><small>ipsw.me · signed only</small></div>${icon('shield')}</div>
              <div class="feature-row"><span class="num">03</span><div><b>${esc(t('firmware.tabAndroid'))}</b><small>${nf(fw.length)} ${esc(t('home.statSources'))}</small></div>${icon('external')}</div>
              <div class="feature-row"><span class="num">04</span><div><b>${esc(t('firmware.verifyTitle'))}</b><small>${esc(t('firmware.sourceNote'))}</small></div>${icon('info')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div class="section-head-main"><p class="eyebrow">${esc(t('home.securityKicker'))}</p><h2 class="section-title">${esc(t('home.securityTitle'))}</h2><p class="section-desc">${esc(t('home.securityLead'))}</p></div>
          <a class="text-link" href="#/security">${esc(t('viewAll'))} ${icon('arrow-left')}</a>
        </div>
        <div class="security-grid">
          ${security.map((module) => `<a class="card card-link security-card" href="#/article/${module.article}">
            <span class="card-icon">${icon(module.icon || 'shield')}</span>
            <h3>${esc(securityTitle(module))}</h3>
            <div class="topic-list">${securityTopics(module).map((topic) => `<span>${esc(topic)}</span>`).join('')}</div>
            <div class="card-meta"><span class="mono-label">${esc(securityLevel(module))}</span><span class="card-arrow">${icon('arrow-up-right')}</span></div>
          </a>`).join('')}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div class="section-head-main"><p class="eyebrow">${esc(t('home.articlesKicker'))}</p><h2 class="section-title">${esc(t('home.articlesTitle'))}</h2><p class="section-desc">${esc(t('home.articlesLead'))}</p></div>
          <a class="text-link" href="#/articles">${esc(t('viewAll'))} ${icon('arrow-left')}</a>
        </div>
        <div class="grid grid-3">${articles.map(articleCard).join('')}</div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="grid grid-2">
          <div class="price-note">
            <span class="icon-box">${icon('tag')}</span>
            <div><p class="eyebrow">${esc(t('home.priceKicker'))}</p><h3 class="mt-1">${esc(t('home.priceTitle'))}</h3><p>${esc(t('home.priceDesc'))}</p><div class="mt-2"><a class="text-link" href="#/prices">${esc(t('home.priceCta'))} ${icon('arrow-left')}</a></div></div>
          </div>
          <div class="price-note">
            <span class="icon-box">${icon('whatsapp')}</span>
            <div><p class="eyebrow">08 / HELP</p><h3 class="mt-1">${esc(t('home.ctaTitle'))}</h3><p>${esc(t('home.ctaDesc'))}</p><div class="mt-2"><a class="btn btn-primary btn-sm" href="${genericWa()}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('home.ctaBtn'))}</a></div></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="shell">
        <div class="about-band">
          <div><p class="eyebrow">${esc(t('home.aboutKicker'))}</p><h2 class="section-title mt-2">${esc(t('home.aboutTitle'))}</h2></div>
          <div class="about-copy">
            <p>${esc(t('home.aboutP1'))}</p>
            <p>${esc(t('home.aboutP2'))}</p>
            <div class="about-points">
              <div class="about-point"><b>01</b>${esc(t('home.trustSources'))}</div>
              <div class="about-point"><b>02</b>${esc(t('home.trustData'))}</div>
              <div class="about-point"><b>03</b>${esc(t('home.trustLegal'))}</div>
              <div class="about-point"><b>04</b>${esc(t('home.trustLocal'))}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-flush">
      <div class="shell">
        <div class="price-note footer-cta">
          <div><h3 style="font-size:clamp(24px,3vw,38px)">${esc(t('contact.title'))}</h3><p>${esc(t('contact.lead'))}</p></div>
          <div class="hero-actions footer-cta-actions"><a class="btn btn-primary" href="${genericWa()}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(t('contact.whatsapp'))}</a><a class="btn" href="#/requests">${icon('clipboard')}${esc(t('requests.title'))}</a></div>
        </div>
      </div>
    </section>
  </div>`
}

export function bindHome(root) {
  const form = root.querySelector('#hero-search')
  form?.addEventListener('submit', (event) => {
    event.preventDefault()
    const q = String(new FormData(form).get('q') || '').trim()
    location.hash = q ? `#/phones?q=${encodeURIComponent(q)}` : '#/phones'
  })
}
