import { t, getLang } from "../i18n.js";
import { list, getSettings, convertPrice } from "../db.js";
import { escapeHtml, icon, formatPrice, formatDate, buildQuery, safeUrl } from "../utils.js";
import { pageHead, emptyState, qualityBadge, qualityLabel, notice, priceLegend, supplierCard, badge } from "../components.js";
import { currencies, suppliers } from "../data/index.js";

function priceRow(price, displayCurrency, lang) {
  const converted = displayCurrency && displayCurrency !== price.currency
    ? convertPrice(price.price, price.currency, displayCurrency)
    : null;
  return `<tr>
    <td><a class="cell-title" href="#/screens?phone=${encodeURIComponent(price.phoneSlug)}">${escapeHtml(price.phoneName)}</a><span class="cell-sub">${escapeHtml(price.brand?.toUpperCase() || "")} · ${escapeHtml(price.phoneSlug)}</span></td>
    <td>${qualityBadge(price.quality)}</td>
    <td>${escapeHtml(price.supplierName || "—")}${price.reference ? `<span class="cell-sub">${t("screens.referenceNote")}</span>` : ""}</td>
    <td>${escapeHtml(pick(price, "city", lang) || "—")}</td>
    <td class="price-cell">${escapeHtml(formatPrice(price.price, price.currency, lang))}<small> · ${escapeHtml(pick(price, "availability", lang))}</small>${converted !== null ? `<small>≈ ${escapeHtml(formatPrice(converted, displayCurrency, lang))}</small>` : ""}</td>
    <td class="mono" style="font-size:10px">${escapeHtml(formatDate(price.updatedAt, lang))}</td>
    <td class="table-actions">
      ${price.sourceUrl ? `<a class="icon-btn" href="${escapeHtml(safeUrl(price.sourceUrl))}" target="_blank" rel="noopener" aria-label="${t("screens.source")}">${icon("external", "icon-sm")}</a>` : ""}
      <a class="icon-btn" href="#/request?part=${encodeURIComponent(price.phoneSlug)}" aria-label="${t("screens.requestQuote")}">${icon("message", "icon-sm")}</a>
    </td>
  </tr>`;
}

function options(values, selected, allLabel) {
  return [`<option value="all">${escapeHtml(allLabel)}</option>`, ...values.map((item) => {
    const value = typeof item === "string" ? item : item.value;
    const label = typeof item === "string" ? item : item.label;
    return `<option value="${escapeHtml(value)}"${String(value) === String(selected) ? " selected" : ""}>${escapeHtml(label)}</option>`;
  })].join("");
}

export function renderScreens(ctx) {
  const query = ctx.query;
  const q = (query.get("q") || "").toLowerCase();
  const phone = query.get("phone") || "all";
  const quality = query.get("quality") || "all";
  const city = query.get("city") || "all";
  const currency = query.get("currency") || "";
  const sort = query.get("sort") || "low";
  let rows = list("prices");
  if (q) rows = rows.filter((row) => `${row.phoneName} ${row.supplierName} ${row.notesAr}`.toLowerCase().includes(q));
  if (phone !== "all") rows = rows.filter((row) => row.phoneSlug === phone);
  if (quality !== "all") rows = rows.filter((row) => row.quality === quality);
  if (city !== "all") rows = rows.filter((row) => row.city === city);
  rows = rows.filter((row) => Number.isFinite(Number(row.price)));
  rows.sort((a, b) => sort === "high" ? Number(b.price) - Number(a.price) : Number(a.price) - Number(b.price));
  const phoneOptions = [...new Map(list("prices").map((row) => [row.phoneSlug, { value: row.phoneSlug, label: row.phoneName }])).values()];
  const cities = [...new Set(list("prices").map((row) => row.city).filter(Boolean))];
  const qualityOptions = [...new Set(list("prices").map((row) => row.quality).filter(Boolean))];
  const lang = getLang();

  return `${pageHead({
    eyebrow: "BRXVIH / PRICES",
    title: t("screens.title"),
    desc: t("screens.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.screens") }],
    meta: `<span class="badge badge-accent">${t("screens.count", { count: rows.length })}</span>${badge(t("screens.referenceNote"), "blue")}`
  })}
  <section class="section-tight"><div class="container">
    ${notice(t("screens.notice"), "info", "info")}
    <div style="margin-block:16px">${priceLegend()}</div>
    <form class="filter-bar" data-screens-filter>
      <label class="filter-search">${icon("search")}<input type="search" name="q" value="${escapeHtml(query.get("q") || "")}" placeholder="${t("phones.searchPlaceholder")}"></label>
      <select class="select" name="phone" aria-label="${t("screens.filterPhone")}">${options(phoneOptions, phone, t("screens.filterPhone"))}</select>
      <select class="select" name="quality" aria-label="${t("screens.filterQuality")}">${options(qualityOptions.map((value) => ({ value, label: qualityLabel(value) })), quality, t("screens.filterQuality"))}</select>
      <select class="select" name="city" aria-label="${t("screens.filterCity")}">${options(cities, city, t("screens.filterCity"))}</select>
      <select class="select" name="currency" aria-label="${t("common.currency")}">${options(currencies.map((item) => ({ value: item.code, label: `${item.code} — ${getLang() === "ar" ? item.nameAr : item.nameEn}` })), currency, t("common.currency"))}</select>
      <select class="select" name="sort" aria-label="${t("common.sort")}">${options([{ value: "low", label: t("common.priceLow") }, { value: "high", label: t("common.priceHigh") }], sort, t("common.sort"))}</select>
      <button class="btn btn-primary btn-sm" type="submit">${icon("filter", "icon-xs")}<span>${t("common.filter")}</span></button>
      <a class="btn btn-ghost btn-sm" href="#/screens">${t("common.reset")}</a>
      <span class="filter-count">${t("screens.count", { count: rows.length })}</span>
    </form>
    ${currency ? `<p class="form-note" style="margin-block-end:12px">${escapeHtml(getSettings().exchange?.noteAr || "")} ${escapeHtml(t("common.updated"))}: ${escapeHtml(getSettings().exchange?.updatedAt || "")}</p>` : ""}
    ${rows.length ? `<div class="table-wrap"><table>
      <thead><tr>
        <th>${t("common.phones")}</th><th>${t("common.quality")}</th><th>${t("common.supplier")}</th>
        <th>${t("common.city")}</th><th>${t("common.prices")}</th><th>${t("common.updated")}</th><th></th>
      </tr></thead>
      <tbody>${rows.map((row) => priceRow(row, currency, lang)).join("")}</tbody>
    </table></div>` : emptyState({ iconName: "screen", title: t("screens.noResults"), action: `<a class="btn btn-outline btn-sm" href="#/screens">${t("common.reset")}</a>` })}
    <div class="grid grid-3" style="margin-block-start:26px">${suppliers.map(supplierCard).join("")}</div>
  </div></section>`;
}

export function mountScreens(root) {
  const form = root.querySelector("[data-screens-filter]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const query = buildQuery({
      q: data.get("q")?.toString().trim(),
      phone: data.get("phone")?.toString(),
      quality: data.get("quality")?.toString(),
      city: data.get("city")?.toString(),
      currency: data.get("currency")?.toString(),
      sort: data.get("sort")?.toString()
    });
    window.location.hash = `#/screens${query}`;
  });
  form.querySelectorAll("select").forEach((select) => select.addEventListener("change", () => form.requestSubmit()));
}
