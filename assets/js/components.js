import { t, getLang, brandLabel } from "./i18n.js";
import { escapeHtml, icon, pick, formatPrice, formatDate, formatNumber, truncate, safeUrl } from "./utils.js";
import { list } from "./db.js";
import { articleCategories, firmwareSourceById, qualities as seedQualities, requestStatuses as seedStatuses } from "./data/index.js";

function currentQualities() {
  return seedQualities;
}

export function qualityLabel(id) {
  const item = currentQualities().find((quality) => quality.id === id);
  return item ? pick(item, "name", getLang()) : id || "—";
}

export function qualityBadge(id) {
  const item = currentQualities().find((quality) => quality.id === id);
  return `<span class="badge badge-${item?.color || "blue"}">${escapeHtml(qualityLabel(id))}</span>`;
}

export function statusLabel(id) {
  const item = seedStatuses.find((status) => status.id === id);
  return item ? pick(item, "name", getLang()) : id || "—";
}

export function statusBadge(id) {
  const item = seedStatuses.find((status) => status.id === id);
  return `<span class="badge badge-${item?.color || "blue"}">${escapeHtml(statusLabel(id))}</span>`;
}

export function badge(text, variant = "accent", extra = "") {
  return `<span class="badge badge-${variant}${extra ? ` ${extra}` : ""}">${escapeHtml(text)}</span>`;
}

export function verifiedBadge(verified) {
  return verified
    ? `<span class="badge badge-success badge-dot">${t("common.verified")}</span>`
    : `<span class="badge badge-warning badge-dot">${t("common.unverified")}</span>`;
}

export function brandInitial(brand) {
  return String(brand?.name || "B").trim().charAt(0).toUpperCase();
}

export function btn(label, href, { variant = "primary", size = "", iconName = "", external = false, block = false, type = "link", attrs = "" } = {}) {
  const classes = `btn btn-${variant}${size ? ` btn-${size}` : ""}${block ? " btn-block" : ""}`;
  const iconHtml = iconName ? icon(iconName, "icon-xs") : "";
  const content = `${iconHtml}<span>${escapeHtml(label)}</span>`;
  if (type === "button") {
    return `<button class="${classes}" type="button" ${attrs}>${content}</button>`;
  }
  const target = external ? ` target="_blank" rel="noopener"` : "";
  return `<a class="${classes}" href="${escapeHtml(href)}"${target} ${attrs}>${content}</a>`;
}

export function breadcrumb(items = []) {
  return `<nav class="breadcrumb" aria-label="breadcrumb">${items.map((item, index) => {
    const label = escapeHtml(item.label);
    const separator = index < items.length - 1 ? `<span aria-hidden="true">/</span>` : "";
    return item.href && index < items.length - 1
      ? `<a href="${escapeHtml(item.href)}">${label}</a>${separator}`
      : `<span>${label}</span>${separator}`;
  }).join("")}</nav>`;
}

export function pageHead({ eyebrow = "", title, desc = "", meta = "", crumbs = [], className = "" }) {
  return `<section class="page-head ${className}">
    <div class="container">
      ${crumbs.length ? breadcrumb(crumbs) : ""}
      ${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
      <h1>${escapeHtml(title)}</h1>
      ${desc ? `<p>${escapeHtml(desc)}</p>` : ""}
      ${meta ? `<div class="page-head-meta">${meta}</div>` : ""}
    </div>
  </section>`;
}

export function sectionHead({ eyebrow = "", title, desc = "", href = "", linkLabel = "", center = false }) {
  return `<div class="section-head${center ? " center" : ""}">
    <div class="section-head-copy">
      ${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
      <h2>${escapeHtml(title)}</h2>
      ${desc ? `<p>${escapeHtml(desc)}</p>` : ""}
    </div>
    ${href ? btn(linkLabel || t("common.viewAll"), href, { variant: "outline", size: "sm", iconName: "arrow-left" }) : ""}
  </div>`;
}

export function statGrid(items = []) {
  return `<div class="stat-grid">${items.map((item) => `<div class="stat">
    ${item.icon ? icon(item.icon) : ""}
    <strong>${escapeHtml(item.value)}</strong>
    <span>${escapeHtml(item.label)}</span>
  </div>`).join("")}</div>`;
}

export function chip(text, href = "") {
  const content = escapeHtml(text);
  return href
    ? `<a class="chip" href="${escapeHtml(href)}">${content}</a>`
    : `<span class="chip">${content}</span>`;
}

export function sourceList(sources = []) {
  const valid = sources.filter((source) => source?.url && safeUrl(source.url));
  if (!valid.length) return "";
  return `<div class="source-list">${valid.map((source) => `<a class="source-link" href="${escapeHtml(safeUrl(source.url))}" target="_blank" rel="noopener">
    ${icon("external", "icon-xs")}
    <span>${escapeHtml(source.label || source.url)}</span>
  </a>`).join("")}</div>`;
}

export function notice(text, variant = "", iconName = "info") {
  return `<div class="notice${variant ? ` ${variant}` : ""}">
    ${icon(iconName)}
    <div>${text}</div>
  </div>`;
}

export function emptyState({ iconName = "search", title, desc = "", action = "" }) {
  return `<div class="empty-state">
    <div class="empty-icon">${icon(iconName)}</div>
    <h3>${escapeHtml(title)}</h3>
    ${desc ? `<p>${escapeHtml(desc)}</p>` : ""}
    ${action}
  </div>`;
}

export function kv(label, value) {
  return `<div class="kv"><span>${escapeHtml(label)}</span><b>${value}</b></div>`;
}

export function phonePriceLabel(phoneSlug) {
  const rows = list("prices").filter((price) => price.phoneSlug === phoneSlug);
  const amounts = rows.map((row) => Number(row.price)).filter((value) => Number.isFinite(value));
  if (!amounts.length) return t("common.priceOnRequest");
  const min = Math.min(...amounts);
  const currency = rows.find((row) => Number.isFinite(Number(row.price)))?.currency || "USD";
  return `${t("common.from")} ${formatPrice(min, currency, getLang())}`;
}

export function phoneCard(phone) {
  const lang = getLang();
  const brand = phone.brand || "";
  const name = lang === "ar" ? phone.nameAr || phone.name : phone.name;
  const href = `#/phones/${encodeURIComponent(phone.slug || phone.id)}`;
  const price = phonePriceLabel(phone.slug || phone.id);
  return `<article class="card card-hover phone-card reveal">
    <div class="phone-card-top">
      <span class="phone-brand">
        <span class="phone-brand-mark">${escapeHtml(brandInitial({ name: brand }))}</span>
        ${escapeHtml(brandLabel({ id: brand }))}
      </span>
      <span class="badge badge-blue">${escapeHtml(String(phone.year || ""))}</span>
    </div>
    <div class="phone-card-body">
      <h3><a href="${href}">${escapeHtml(name)}</a></h3>
      <p class="phone-sub">${escapeHtml(phone.model || "")}${phone.codename && phone.codename !== "غير معلن" ? ` · ${escapeHtml(phone.codename)}` : ""}</p>
      <div class="chip-list" style="margin-block-start:12px">
        ${chip(phone.chipset || "—")}
        ${chip(phone.display?.split("·")[0] || "—")}
      </div>
    </div>
    <div class="phone-card-foot">
      <span class="phone-price"><span>${t("screens.title")}</span><b>${escapeHtml(price)}</b></span>
      ${icon("arrow-left", "icon-sm")}
    </div>
  </article>`;
}

export function brandTile(brand) {
  const count = list("phones").filter((phone) => phone.brand === brand.id).length;
  return `<a class="card card-hover brand-tile" href="#/phones?brand=${encodeURIComponent(brand.id)}">
    <span class="brand-name">
      <span class="brand-initial">${escapeHtml(brandInitial(brand))}</span>
      <span><b>${escapeHtml(brandLabel(brand))}</b><span>${escapeHtml(brand.name)}</span></span>
    </span>
    <span class="count">${formatNumber(count, getLang())}</span>
  </a>`;
}

export function serviceCard(service) {
  const lang = getLang();
  return `<a class="card card-hover service-card" href="${escapeHtml(service.href)}">
    <span class="service-icon">${icon(service.icon)}</span>
    <span class="badge badge-accent" style="align-self:flex-start">${escapeHtml(service.num)}</span>
    <h3>${escapeHtml(pick(service, "title", lang))}</h3>
    <p>${escapeHtml(pick(service, "desc", lang))}</p>
    <span class="service-link">${t("common.details")} ${icon("arrow-left", "icon-xs")}</span>
  </a>`;
}

export function priceTable(rows) {
  if (!rows.length) return emptyState({ iconName: "screen", title: t("screens.noResults") });
  return `<div class="table-wrap"><table>
    <thead><tr>
      <th>${t("common.phones")}</th>
      <th>${t("common.quality")}</th>
      <th>${t("common.supplier")}</th>
      <th>${t("common.city")}</th>
      <th>${t("common.prices")}</th>
      <th>${t("common.updated")}</th>
      <th></th>
    </tr></thead>
    <tbody>${rows.map((price) => {
      const href = `#/screens?phone=${encodeURIComponent(price.phoneSlug)}`;
      return `<tr>
        <td><a class="cell-title" href="${href}">${escapeHtml(price.phoneName)}</a><span class="cell-sub">${escapeHtml(price.brand?.toUpperCase() || "")} · ${escapeHtml(price.phoneSlug)}</span></td>
        <td>${qualityBadge(price.quality)}</td>
        <td>${escapeHtml(price.supplierName || "")}${price.reference ? `<span class="cell-sub">${t("screens.referenceNote")}</span>` : ""}</td>
        <td>${escapeHtml(pick(price, "city", getLang()) || "—")}</td>
        <td class="price-cell">${escapeHtml(formatPrice(price.price, price.currency, getLang()))}<small> · ${escapeHtml(pick(price, "availability", getLang()))}</small></td>
        <td class="mono" style="font-size:10px">${escapeHtml(formatDate(price.updatedAt, getLang()))}</td>
        <td class="table-actions">${price.sourceUrl ? `<a class="icon-btn" href="${escapeHtml(safeUrl(price.sourceUrl))}" target="_blank" rel="noopener" aria-label="${t("screens.source")}">${icon("external", "icon-sm")}</a>` : ""}</td>
      </tr>`;
    }).join("")}</tbody>
  </table></div>`;
}

export function priceLegend() {
  return `<div class="price-legend">${currentQualities().map((quality) => `<span><i style="background:var(--${quality.color === "success" ? "success" : quality.color === "danger" ? "danger" : quality.color === "warning" ? "warning" : "blue"})"></i>${escapeHtml(pick(quality, "name", getLang()))}</span>`).join("")}</div>`;
}

export function partCard(part) {
  const lang = getLang();
  return `<article class="card card-pad card-hover">
    <div class="row between" style="align-items:flex-start">
      <span class="firmware-icon">${icon(part.icon || "package")}</span>
      ${verifiedBadge(part.verified)}
    </div>
    <h3 style="margin-block:14px 6px;font-size:18px">${escapeHtml(pick(part, "name", lang))}</h3>
    <p class="muted" style="font-size:13px;line-height:1.8">${escapeHtml(pick(part, "desc", lang))}</p>
    <div class="kv" style="margin-block-start:12px"><span>${t("parts.compatibility")}</span><b>${escapeHtml(pick(part, "compatibility", lang))}</b></div>
    <div class="chip-list" style="margin-block:14px">${(part.qualityOptions || []).map((quality) => qualityBadge(quality)).join("")}</div>
    <a class="btn btn-outline btn-sm btn-block" href="#/request?part=${encodeURIComponent(part.id)}">${icon("message", "icon-xs")}<span>${t("parts.request")}</span></a>
  </article>`;
}

export function faultCard(fault) {
  const lang = getLang();
  return `<a class="card card-hover fault-card" href="#/faults/${encodeURIComponent(fault.id)}">
    <span class="fault-icon">${icon(fault.icon || "alert")}</span>
    <span style="min-width:0">
      <h3>${escapeHtml(pick(fault, "title", lang))}</h3>
      <p>${escapeHtml(truncate(pick(fault, "summary", lang), 130))}</p>
      <span class="badge badge-${fault.urgent ? "danger" : "accent"}">${escapeHtml(fault.category || "hardware")}</span>
    </span>
  </a>`;
}

export function toolCard(tool) {
  const lang = getLang();
  return `<article class="card card-pad card-hover">
    <div class="row between" style="align-items:flex-start">
      <span class="firmware-icon">${icon("tools")}</span>
      <span class="badge badge-blue">${escapeHtml(tool.category || "")}</span>
    </div>
    <h3 style="margin-block:14px 6px;font-size:18px">${escapeHtml(tool.name)}</h3>
    <p class="muted" style="font-size:13px;line-height:1.8">${escapeHtml(pick(tool, "purpose", lang))}</p>
    <div class="kv" style="margin-block-start:12px"><span>${t("tools.platform")}</span><b>${escapeHtml(tool.platform || "—")}</b></div>
    <div class="kv"><span>${t("tools.license")}</span><b>${escapeHtml(tool.price || tool.license || "—")}</b></div>
    <div class="row" style="margin-block-start:14px">
      ${tool.url ? `<a class="btn btn-outline btn-sm" href="${escapeHtml(safeUrl(tool.url))}" target="_blank" rel="noopener">${icon("external", "icon-xs")}<span>${t("tools.open")}</span></a>` : ""}
      ${tool.warningAr ? `<span class="badge badge-warning">${icon("alert", "icon-xs")}</span>` : ""}
    </div>
  </article>`;
}

export function firmwareRow(entry) {
  const source = firmwareSourceById[entry.sourceId];
  const url = entry.sourceUrl || source?.url || "";
  return `<div class="firmware-row">
    <span class="firmware-icon">${icon("download")}</span>
    <span class="fw-copy">
      <b>${escapeHtml(entry.phoneName || entry.name)}</b>
      <span>${escapeHtml(entry.brand?.toUpperCase() || "")} · ${escapeHtml(entry.model || "")} · ${escapeHtml(entry.region || "")}</span>
    </span>
    ${url ? `<a class="icon-btn" href="${escapeHtml(safeUrl(url))}" target="_blank" rel="noopener" aria-label="${t("firmware.openSource")}">${icon("external", "icon-sm")}</a>` : ""}
  </div>`;
}

export function articleCard(article) {
  const lang = getLang();
  const category = articleCategories.find((item) => item.id === article.category);
  return `<a class="card card-hover article-card" href="#/guides/${encodeURIComponent(article.id)}">
    <div class="article-cover">
      ${icon(article.icon || category?.icon || "book")}
      <span class="badge badge-accent">${escapeHtml(category ? pick(category, "name", lang) : article.category)}</span>
    </div>
    <div class="article-body">
      <h3>${escapeHtml(pick(article, "title", lang))}</h3>
      <p>${escapeHtml(truncate(pick(article, "excerpt", lang), 140))}</p>
      <div class="article-meta">
        <span>${escapeHtml(formatDate(article.date, getLang()))}</span>
        <span>${escapeHtml(t("guides.readTime", { count: article.readTime || 5 }))}</span>
      </div>
    </div>
  </a>`;
}

export function supplierCard(supplier) {
  const lang = getLang();
  return `<article class="card card-pad">
    <div class="row between" style="align-items:flex-start">
      <span class="brand-initial">${escapeHtml(brandInitial(supplier))}</span>
      ${verifiedBadge(supplier.verified)}
    </div>
    <h3 style="margin-block:14px 6px">${escapeHtml(pick(supplier, "name", lang))}</h3>
    <p class="muted" style="font-size:12.5px;line-height:1.75">${escapeHtml(pick(supplier, "note", lang))}</p>
    <div class="kv"><span>${t("common.city")}</span><b>${escapeHtml(supplier.city || "—")}</b></div>
    <div class="row" style="margin-block-start:14px">
      ${supplier.url ? `<a class="btn btn-outline btn-sm" href="${escapeHtml(safeUrl(supplier.url))}" target="_blank" rel="noopener">${icon("external", "icon-xs")}<span>${escapeHtml(supplier.name)}</span></a>` : ""}
      ${supplier.whatsapp ? `<a class="btn btn-primary btn-sm" href="https://wa.me/${escapeHtml(supplier.whatsapp)}" target="_blank" rel="noopener">${icon("whatsapp", "icon-xs")}<span>${t("cta.whatsapp")}</span></a>` : ""}
    </div>
  </article>`;
}

export function contactItem(iconName, title, value, href = "") {
  const content = href
    ? `<a href="${escapeHtml(href)}"${href.startsWith("http") ? ` target="_blank" rel="noopener"` : ""}>${escapeHtml(value)}</a>`
    : `<span>${escapeHtml(value)}</span>`;
  return `<div class="contact-item">${icon(iconName)}<div><b>${escapeHtml(title)}</b>${content}</div></div>`;
}

export function ctaBand({ title, text, primary, secondary }) {
  return `<section class="section"><div class="container"><div class="cta-band">
    ${icon("smartphone", "cta-mark")}
    <p class="eyebrow">BRXVIH</p>
    <h2>${escapeHtml(title)}</h2>
    <p>${escapeHtml(text)}</p>
    <div class="row">${primary || ""}${secondary || ""}</div>
  </div></div></section>`;
}

export function field({
  label, name, type = "text", value = "", placeholder = "", required = false,
  full = false, options = null, rows = 4, hint = "", attrs = "", min, max, step
}) {
  const id = `field-${name}`;
  const requiredAttr = required ? " required" : "";
  const minAttr = min !== undefined ? ` min="${escapeHtml(min)}"` : "";
  const maxAttr = max !== undefined ? ` max="${escapeHtml(max)}"` : "";
  const stepAttr = step !== undefined ? ` step="${escapeHtml(step)}"` : "";
  let control;
  if (type === "textarea") {
    control = `<textarea class="textarea" id="${id}" name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder)}"${requiredAttr} ${attrs}>${escapeHtml(value)}</textarea>`;
  } else if (type === "select") {
    const listOptions = (options || []).map((option) => {
      const optionValue = typeof option === "string" ? option : option.value;
      const optionLabel = typeof option === "string" ? option : option.label;
      return `<option value="${escapeHtml(optionValue)}"${String(optionValue) === String(value) ? " selected" : ""}>${escapeHtml(optionLabel)}</option>`;
    }).join("");
    control = `<select id="${id}" name="${escapeHtml(name)}"${requiredAttr} ${attrs}>${listOptions}</select>`;
  } else {
    control = `<input class="input" id="${id}" name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}"${requiredAttr}${minAttr}${maxAttr}${stepAttr} ${attrs}>`;
  }
  return `<div class="form-field${full ? " full" : ""}">
    <label for="${id}">${escapeHtml(label)}${required ? ` <span class="req">*</span>` : ""}</label>
    ${control}
    ${hint ? `<small>${escapeHtml(hint)}</small>` : ""}
  </div>`;
}

export function requestSummary(data) {
  return `<div class="request-summary">
    ${kv(t("common.name"), escapeHtml(data.name || "—"))}
    ${kv(t("common.phone"), escapeHtml(data.phone || "—"))}
    ${kv(t("common.brand"), escapeHtml(data.brand || "—"))}
    ${kv(t("common.model"), escapeHtml(data.model || "—"))}
    ${kv(t("common.city"), escapeHtml(data.city || "—"))}
    ${kv(t("common.faults"), escapeHtml(data.fault || "—"))}
  </div>`;
}

export function articleMeta(article) {
  const category = articleCategories.find((item) => item.id === article.category);
  return `<div class="page-head-meta">
    ${category ? badge(pick(category, "name", getLang()), "accent") : ""}
    ${badge(formatDate(article.date, getLang()), "blue")}
    ${badge(t("guides.readTime", { count: article.readTime || 5 }), "blue")}
  </div>`;
}
