import { t, getLang } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, formatNumber, pick, whatsappLink } from "../utils.js";
import {
  phoneCard, brandTile, serviceCard, sectionHead, statGrid, priceTable,
  faultCard, toolCard, firmwareRow, articleCard, notice, ctaBand, badge, btn
} from "../components.js";
import { brands, services, faqs, stats } from "../data/index.js";

function heroStats() {
  const values = {
    phones: list("phones").length,
    brands: brands.length,
    faults: list("faults").length,
    tools: list("tools").length
  };
  return stats.map((stat) => `<div class="hero-stat">
    <strong>${formatNumber(values[stat.key], getLang())}+</strong>
    <span>${escapeHtml(t(`home.stat${stat.key.charAt(0).toUpperCase()}${stat.key.slice(1)}`))}</span>
  </div>`).join("");
}

function deviceMockup() {
  return `<div class="hero-phone-wrap">
    <div class="device-stage">
      <div class="device-scan" aria-hidden="true"></div>
      <div class="device" aria-hidden="true">
        <div class="device-screen">
          <span class="device-notch"></span>
          <p class="device-brand">BRXVIH LAB</p>
          <p class="device-time">10:24</p>
          <p class="device-date">${escapeHtml(new Date().toISOString().slice(0, 10))}</p>
          <div class="device-rings">
            <span class="device-ring"><span>CPU</span></span>
            <span class="device-ring"><span>PWR</span></span>
            <span class="device-ring"><span>NET</span></span>
          </div>
          <div class="device-card"><b>DIAGNOSTIC</b><i>98%</i></div>
          <div class="device-bar"></div>
          <div class="device-card"><b>FIRMWARE</b><i>VERIFIED</i></div>
          <div class="device-bar"></div>
        </div>
      </div>
      <div class="device-float f1"><b>iFixit</b><small>${t("common.reference")}</small></div>
      <div class="device-float f2"><b>${formatNumber(list("phones").length, getLang())}</b><small>${t("home.statPhones")}</small></div>
      <div class="device-float f3"><b>BRXVIH</b><small>YEMEN · +967</small></div>
    </div>
  </div>`;
}

function brandStrip() {
  const items = [...brands, ...brands].map((brand) => `<a class="marquee-item" href="#/phones?brand=${encodeURIComponent(brand.id)}">${escapeHtml(brand.name)}</a>`).join("");
  return `<div class="brand-strip">
    <div class="container brand-strip-inner">
      <span class="brand-strip-label">${t("home.brandsTitle")}</span>
      <div class="marquee"><div class="marquee-track">${items}</div></div>
    </div>
  </div>`;
}

function faqList() {
  const lang = getLang();
  return `<div class="issue-list">${faqs.map((faq) => `<details class="issue">
    <summary>${icon("info", "icon-xs")}<span>${escapeHtml(pick(faq, "q", lang))}</span></summary>
    <div class="issue-body">${escapeHtml(pick(faq, "a", lang))}</div>
  </details>`).join("")}</div>`;
}

export function renderHome() {
  const phones = list("phones");
  const featured = phones.filter((phone) => phone.featured).slice(0, 6);
  const faults = list("faults").slice(0, 6);
  const articles = list("articles").slice(0, 6);
  const tools = list("tools").slice(0, 6);
  const firmware = list("firmware").slice(0, 6);
  const prices = list("prices").slice(0, 6);

  return `<section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${t("home.eyebrow")}</p>
        <h1>
          <span class="line">${t("home.title1")}</span>
          <span class="line"><span class="hl">${t("home.title2")}</span></span>
          <span class="line">${t("home.titleAccent")}</span>
        </h1>
        <p class="hero-lead">${t("home.lead")}</p>
        <form class="search-box hero-search" data-search-form role="search">
          ${icon("search")}
          <input type="search" name="q" placeholder="${t("home.searchPlaceholder")}" aria-label="${t("common.search")}" autocomplete="off">
          <button class="btn btn-primary btn-sm" type="submit">${t("common.search")}</button>
        </form>
        <div class="hero-tags">
          <span>${t("home.tags")}</span>
          <a href="#/phones?q=Galaxy%20S24%20Ultra">${t("home.tag1")}</a>
          <a href="#/phones?q=iPhone%2015%20Pro%20Max">${t("home.tag2")}</a>
          <a href="#/phones?q=Redmi%20Note%2013">${t("home.tag3")}</a>
          <a href="#/faults?q=bootloop">${t("home.tag4")}</a>
        </div>
        <div class="hero-stats">${heroStats()}</div>
      </div>
      ${deviceMockup()}
    </div>
  </section>
  ${brandStrip()}

  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: "01 / SERVICES", title: t("home.servicesTitle"), desc: t("home.servicesDesc"), href: "#/repair", linkLabel: t("nav.repair") })}
      <div class="grid grid-4">${services.slice(0, 8).map(serviceCard).join("")}</div>
      <div class="grid grid-4" style="margin-block-start:18px">${services.slice(8).map(serviceCard).join("")}</div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <div class="section-head-copy">
          <p class="eyebrow">02 / DEVICES</p>
          <h2>${t("home.featuredTitle")}</h2>
          <p>${t("home.featuredDesc")}</p>
        </div>
        ${btn(t("common.viewAll"), "#/phones", { variant: "outline", size: "sm", iconName: "arrow-left" })}
      </div>
      <div class="phone-grid">${featured.map(phoneCard).join("")}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div class="section-head-copy">
          <p class="eyebrow">03 / PRICES</p>
          <h2>${t("home.screensTitle")}</h2>
          <p>${t("home.screensDesc")}</p>
        </div>
        ${btn(t("screens.compare"), "#/screens", { variant: "outline", size: "sm", iconName: "arrow-left" })}
      </div>
      ${notice(t("screens.notice"), "info", "info")}
      <div style="margin-block-start:18px">${priceTable(prices)}</div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-tools">
        <div>
          ${sectionHead({ eyebrow: "04 / FIRMWARE", title: t("home.toolsTitle"), desc: t("home.toolsDesc"), href: "#/tools", linkLabel: t("common.viewAll") })}
          <div class="card card-pad">
            <div class="tool-mini-list">${tools.map((tool) => `<a class="tool-mini" href="#/tools?q=${encodeURIComponent(tool.name)}">
              <span class="tool-mini-icon">${icon("tools", "icon-sm")}</span>
              <span class="tool-mini-copy"><b>${escapeHtml(tool.name)}</b><span>${escapeHtml(tool.platform)} · ${escapeHtml(tool.category)}</span></span>
              <span class="badge badge-blue">${escapeHtml(tool.price || "")}</span>
            </a>`).join("")}</div>
          </div>
        </div>
        <div>
          ${sectionHead({ eyebrow: "05 / ROMS", title: t("home.guidesTitle"), desc: t("home.guidesDesc"), href: "#/guides", linkLabel: t("common.viewAll") })}
          <div class="card card-pad">
            ${firmware.map(firmwareRow).join("")}
            <div class="row" style="margin-block-start:16px">
              <a class="btn btn-outline btn-sm" href="#/firmware">${icon("download", "icon-xs")}<span>${t("nav.firmware")}</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({ eyebrow: "06 / FAULTS", title: t("home.faultsTitle"), desc: t("home.faultsDesc"), href: "#/faults", linkLabel: t("common.viewAll") })}
      <div class="grid grid-3">${faults.map(faultCard).join("")}</div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      ${sectionHead({ eyebrow: "07 / GUIDES", title: t("home.guidesTitle"), desc: t("home.guidesDesc"), href: "#/guides", linkLabel: t("common.viewAll") })}
      <div class="article-grid">${articles.map(articleCard).join("")}</div>
    </div>
  </section>

  <section class="section">
    <div class="container split">
      <div class="panel">
        <p class="eyebrow">08 / BRANDS</p>
        <h2 style="font-size:clamp(24px,3vw,36px)">${t("home.brandsTitle")}</h2>
        <p class="muted" style="margin-block:10px 18px">${t("home.brandsDesc")}</p>
        <div class="grid grid-2">${brands.slice(0, 8).map(brandTile).join("")}</div>
        <div class="row" style="margin-block-start:18px">${btn(t("common.viewAll"), "#/phones", { variant: "outline", size: "sm" })}</div>
      </div>
      <div class="panel panel-accent">
        <p class="eyebrow">09 / SUPPORT</p>
        <h2 style="font-size:clamp(24px,3vw,36px)">${t("home.ctaTitle")}</h2>
        <p style="margin-block:10px 18px">${t("home.ctaText")}</p>
        <div class="row">
          <a class="btn btn-dark" href="#/request">${icon("message", "icon-xs")}<span>${t("home.ctaButton")}</span></a>
          <a class="btn btn-outline" href="${whatsappLink(t("whatsapp.message"))}" target="_blank" rel="noopener">${icon("whatsapp", "icon-xs")}<span>${t("cta.whatsapp")}</span></a>
        </div>
        <div class="divider" style="background:rgba(9,10,4,.15)"></div>
        <div class="row between"><span class="badge badge-solid">BRXVIH</span><span class="mono" style="font-size:10px">+967 777 066 424</span></div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head center">
        <div class="section-head-copy">
          <p class="eyebrow center">10 / FAQ</p>
          <h2>${t("common.faq")}</h2>
          <p>${t("home.ctaText")}</p>
        </div>
      </div>
      <div style="max-width:820px;margin-inline:auto">${faqList()}</div>
    </div>
  </section>

  ${ctaBand({
    title: t("home.ctaTitle"),
    text: t("home.ctaText"),
    primary: `<a class="btn btn-dark" href="#/request">${icon("message", "icon-xs")}<span>${t("home.ctaButton")}</span></a>`,
    secondary: `<a class="btn btn-outline" href="#/contact">${icon("phone", "icon-xs")}<span>${t("nav.contact")}</span></a>`
  })}`;
}

export function mountHome(root) {
  root.querySelector("[data-search-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q")?.toString().trim() || "";
    window.location.hash = `#/phones${query ? `?q=${encodeURIComponent(query)}` : ""}`;
  });
}
