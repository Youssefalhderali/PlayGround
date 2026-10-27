import { t, getLang, brandLabel } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, pick, formatPrice, formatDate, whatsappLink, safeUrl } from "../utils.js";
import {
  pageHead, breadcrumb, verifiedBadge, qualityBadge, sourceList, notice,
  emptyState, btn, phonePriceLabel, faultCard, toolCard, firmwareRow
} from "../components.js";
import { firmwareSourceById } from "../data/index.js";

function compactPriceRows(rows) {
  if (!rows.length) return emptyState({ iconName: "screen", title: t("common.priceOnRequest"), desc: t("screens.notice") });
  return `<div class="table-wrap"><table>
    <thead><tr><th>${t("common.quality")}</th><th>${t("common.supplier")}</th><th>${t("common.city")}</th><th>${t("common.prices")}</th><th>${t("common.updated")}</th></tr></thead>
    <tbody>${rows.map((price) => `<tr>
      <td>${qualityBadge(price.quality)}</td>
      <td>${escapeHtml(price.supplierName || "—")}</td>
      <td>${escapeHtml(pick(price, "city", getLang()) || "—")}</td>
      <td class="price-cell">${escapeHtml(formatPrice(price.price, price.currency, getLang()))}<small> · ${escapeHtml(pick(price, "availability", getLang()))}</small></td>
      <td class="mono" style="font-size:10px">${escapeHtml(formatDate(price.updatedAt, getLang()))}</td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}

export function renderPhone(ctx) {
  const lang = getLang();
  const slug = ctx.params.slug;
  const phone = list("phones").find((item) => item.slug === slug || item.id === slug);
  if (!phone) {
    return pageHead({
      title: t("phones.notFound"),
      desc: t("phones.notFoundDesc"),
      crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.phones"), href: "#/phones" }, { label: slug }]
    }) + `<section class="section"><div class="container">${emptyState({
      iconName: "smartphone", title: t("phones.notFound"), desc: t("phones.notFoundDesc"),
      action: btn(t("nav.phones"), "#/phones", { variant: "primary", size: "sm" })
    })}</div></section>`;
  }

  const name = lang === "ar" ? phone.nameAr || phone.name : phone.name;
  const brand = { id: phone.brand, name: phone.brand };
  const faults = list("faults").filter((fault) => (phone.issueIds || []).includes(fault.id));
  const tools = list("tools").filter((tool) => (phone.toolIds || []).includes(tool.id));
  const prices = list("prices").filter((price) => price.phoneSlug === (phone.slug || phone.id));
  const parts = list("parts").filter((part) => (phone.partTypes || []).includes(part.partType));
  const firmware = list("firmware").filter((entry) => entry.phoneSlug === (phone.slug || phone.id));
  const romSources = (phone.romSourceIds || []).map((id) => firmwareSourceById[id]).filter(Boolean);
  const waText = lang === "ar"
    ? `مرحباً BRXVIH، أحتاج صيانة/استفسار عن ${phone.name} (${phone.model}).`
    : `Hello BRXVIH, I need repair/advice for ${phone.name} (${phone.model}).`;

  return `<section class="phone-hero"><div class="container">
    ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("nav.phones"), href: "#/phones" }, { label: name }])}
    <div class="phone-hero-grid">
      <div class="phone-render" aria-hidden="true">
        <div class="phone-render-inner">
          <span class="brand-initial">${escapeHtml(phone.brand.charAt(0).toUpperCase())}</span>
          <span class="phone-model-tag">${escapeHtml(phone.model)}</span>
        </div>
      </div>
      <div class="phone-hero-copy">
        <p class="eyebrow">${escapeHtml(brandLabel(brand))} · ${escapeHtml(phone.series || "")}</p>
        <h1>${escapeHtml(name)}</h1>
        <p class="phone-alias">${escapeHtml(phone.name)} · ${escapeHtml(phone.model)} · ${escapeHtml(phone.codename)}</p>
        <div class="page-head-meta">
          ${verifiedBadge(phone.verified)}
          <span class="badge badge-blue">${escapeHtml(String(phone.year || ""))}</span>
          ${phone.featured ? `<span class="badge badge-accent">${t("home.featuredTitle")}</span>` : ""}
        </div>
        <p class="lead">${escapeHtml(pick(phone, "summary", lang) || t("phones.desc"))}</p>
        <div class="phone-actions">
          <a class="btn btn-primary" href="${whatsappLink(waText)}" target="_blank" rel="noopener">${icon("whatsapp", "icon-xs")}<span>${t("cta.whatsapp")}</span></a>
          <a class="btn btn-outline" href="#/request?model=${encodeURIComponent(phone.name)}&brand=${encodeURIComponent(phone.brand)}">${icon("message", "icon-xs")}<span>${t("phones.request")}</span></a>
          <a class="btn btn-ghost" href="#/screens?phone=${encodeURIComponent(phone.slug || phone.id)}">${icon("screen", "icon-xs")}<span>${phonePriceLabel(phone.slug || phone.id)}</span></a>
        </div>
        <div class="quick-specs">
          <div class="quick-spec">${icon("cpu")}<b>${escapeHtml(phone.chipset || "—")}</b><span>${t("common.chipset")}</span></div>
          <div class="quick-spec">${icon("screen")}<b>${escapeHtml(phone.display || "—")}</b><span>${t("common.display")}</span></div>
          <div class="quick-spec">${icon("battery")}<b>${escapeHtml(phone.battery || "—")}</b><span>${t("common.battery")}</span></div>
          <div class="quick-spec">${icon("database")}<b>${escapeHtml(phone.storage || "—")}</b><span>${t("common.storage")}</span></div>
        </div>
      </div>
    </div>
  </div></section>

  <section class="section-tight"><div class="container detail-layout">
    <div class="detail-main">
      <div class="detail-card card">
        <h2>${icon("smartphone")} ${t("phones.specs")}</h2>
        <div class="spec-table">
          <div class="spec-row"><span>${t("common.model")}</span><b>${escapeHtml(phone.model)}</b></div>
          <div class="spec-row"><span>${t("common.codename")}</span><b>${escapeHtml(phone.codename)}</b></div>
          <div class="spec-row"><span>${t("common.brand")}</span><b>${escapeHtml(brandLabel(brand))}</b></div>
          <div class="spec-row"><span>${t("common.series")}</span><b>${escapeHtml(phone.series || "—")}</b></div>
          <div class="spec-row"><span>${t("common.chipset")}</span><b>${escapeHtml(phone.chipset || "—")}</b></div>
          <div class="spec-row"><span>${t("common.display")}</span><b>${escapeHtml(phone.display || "—")}</b></div>
          <div class="spec-row"><span>${t("common.memory")}</span><b>${escapeHtml(phone.memory || "—")}</b></div>
          <div class="spec-row"><span>${t("common.storage")}</span><b>${escapeHtml(phone.storage || "—")}</b></div>
          <div class="spec-row"><span>${t("common.battery")}</span><b>${escapeHtml(phone.battery || "—")}</b></div>
          <div class="spec-row"><span>${t("common.os")}</span><b>${escapeHtml(phone.os || "—")}</b></div>
          <div class="spec-row full"><span>${t("common.notes")}</span><b>${escapeHtml(phone.software || "—")}</b></div>
        </div>
      </div>

      <div class="detail-card card">
        <h2>${icon("alert")} ${t("phones.issues")}</h2>
        ${faults.length
          ? `<div class="grid grid-2">${faults.map(faultCard).join("")}</div>`
          : `<p class="muted">${t("common.noResults")}</p>`}
      </div>

      <div class="detail-card card">
        <h2>${icon("screen")} ${t("phones.prices")}</h2>
        ${notice(t("screens.notice"), "info", "info")}
        <div style="margin-block-start:14px">${compactPriceRows(prices)}</div>
      </div>

      <div class="detail-card card">
        <h2>${icon("download")} ${t("phones.roms")}</h2>
        ${firmware.length ? firmware.map(firmwareRow).join("") : `<p class="muted">${t("firmware.notice")}</p>`}
        ${romSources.length ? `<div class="divider"></div><h3>${t("common.sources")}</h3>${sourceList(romSources.map((source) => ({ label: pick(source, "name", getLang()), url: source.url })))}` : ""}
      </div>

      <div class="detail-card card">
        <h2>${icon("tools")} ${t("phones.tools")}</h2>
        ${tools.length ? `<div class="grid grid-2">${tools.map(toolCard).join("")}</div>` : `<p class="muted">${t("common.noResults")}</p>`}
      </div>

      <div class="detail-card card">
        <h2>${icon("package")} ${t("phones.parts")}</h2>
        ${parts.length ? `<div class="grid grid-2">${parts.map((part) => `<a class="card card-pad card-hover" href="#/parts?type=${encodeURIComponent(part.partType)}">
          <span class="firmware-icon">${icon(part.icon || "package")}</span>
          <h3 style="margin-block:12px 5px">${escapeHtml(pick(part, "name", lang))}</h3>
          <p class="muted" style="font-size:12.5px">${escapeHtml(pick(part, "compatibility", lang))}</p>
        </a>`).join("")}</div>` : `<p class="muted">${t("common.noResults")}</p>`}
      </div>
    </div>

    <aside class="detail-side">
      <div class="side-cta">
        <p class="eyebrow" style="color:rgba(9,10,4,.6)">BRXVIH</p>
        <h3>${t("phones.request")}</h3>
        <p>${t("home.ctaText")}</p>
        <a class="btn btn-dark" href="${whatsappLink(waText)}" target="_blank" rel="noopener">${icon("whatsapp", "icon-xs")}<span>${t("cta.whatsapp")}</span></a>
        <a class="btn btn-outline" href="#/request?model=${encodeURIComponent(phone.name)}">${t("nav.request")}</a>
      </div>
      <div class="card card-pad">
        <h3 style="font-size:15px;margin-block-end:10px">${t("common.sources")}</h3>
        ${sourceList(phone.sources || [])}
        <div class="divider"></div>
        <div class="kv"><span>${t("common.updated")}</span><b>${escapeHtml(formatDate(phone.reviewedAt, getLang()))}</b></div>
        <div class="kv"><span>${t("common.codename")}</span><b>${escapeHtml(phone.codename)}</b></div>
      </div>
      <div class="card card-pad">
        <h3 style="font-size:15px;margin-block-end:10px">${t("common.parts")}</h3>
        <div class="chip-list">${(phone.partTypes || []).map((type) => `<a class="chip" href="#/parts?type=${encodeURIComponent(type)}">${escapeHtml(type)}</a>`).join("")}</div>
      </div>
    </aside>
  </div></section>`;
}
