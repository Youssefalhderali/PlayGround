import { t, getLang, brandLabel } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, formatNumber, buildQuery } from "../utils.js";
import { filterPhones } from "../search.js";
import { pageHead, phoneCard, emptyState, btn } from "../components.js";
import { brands } from "../data/index.js";

function options(values, selected, allLabel) {
  return [`<option value="all">${escapeHtml(allLabel)}</option>`, ...values.map((item) => {
    const value = typeof item === "string" ? item : item.value;
    const label = typeof item === "string" ? item : item.label;
    return `<option value="${escapeHtml(value)}"${String(value) === String(selected) ? " selected" : ""}>${escapeHtml(label)}</option>`;
  })].join("");
}

export function renderPhones(ctx) {
  const query = ctx.query;
  const q = query.get("q") || "";
  const brand = query.get("brand") || "all";
  const year = query.get("year") || "all";
  const series = query.get("series") || "all";
  const sort = query.get("sort") || "name";
  const allPhones = list("phones");
  const years = [...new Set(allPhones.map((phone) => String(phone.year)).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
  const seriesList = [...new Set(allPhones
    .filter((phone) => brand === "all" || phone.brand === brand)
    .map((phone) => phone.series)
    .filter(Boolean))].sort();
  const results = filterPhones({ q, brand, year, series, sort });
  const activeBrand = brands.find((item) => item.id === brand);

  const tabs = `<div class="filter-tabs" style="margin-block-end:14px">
    <a class="filter-tab${brand === "all" ? " is-active" : ""}" href="#/phones">${t("common.all")}</a>
    ${brands.map((item) => `<a class="filter-tab${brand === item.id ? " is-active" : ""}" href="#/phones?brand=${encodeURIComponent(item.id)}">${escapeHtml(brandLabel(item))}</a>`).join("")}
  </div>`;

  return `${pageHead({
    eyebrow: "BRXVIH / DEVICES",
    title: activeBrand ? `${t("phones.title")} — ${brandLabel(activeBrand)}` : t("phones.title"),
    desc: t("phones.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.phones") }],
    meta: `<span class="badge badge-accent">${t("phones.count", { count: formatNumber(results.length, getLang()) })}</span>`
  })}
  <section class="section-tight"><div class="container">
    ${tabs}
    <form class="filter-bar" data-phones-filter>
      <label class="filter-search">${icon("search")}<input type="search" name="q" value="${escapeHtml(q)}" placeholder="${t("phones.searchPlaceholder")}" autocomplete="off"></label>
      <select class="select" name="brand" aria-label="${t("phones.filterBrand")}">${options(brands.map((item) => ({ value: item.id, label: brandLabel(item) })), brand, t("phones.filterBrand"))}</select>
      <select class="select" name="year" aria-label="${t("phones.filterYear")}">${options(years, year, t("phones.filterYear"))}</select>
      <select class="select" name="series" aria-label="${t("phones.filterSeries")}">${options(seriesList, series, t("phones.filterSeries"))}</select>
      <select class="select" name="sort" aria-label="${t("common.sort")}">${options([
        { value: "name", label: t("common.nameAsc") },
        { value: "newest", label: t("common.newest") },
        { value: "oldest", label: t("common.oldest") }
      ], sort, t("common.sort"))}</select>
      <button class="btn btn-primary btn-sm" type="submit">${icon("filter", "icon-xs")}<span>${t("common.filter")}</span></button>
      <a class="btn btn-ghost btn-sm" href="#/phones">${t("common.reset")}</a>
      <span class="filter-count">${t("phones.count", { count: formatNumber(results.length, getLang()) })}</span>
    </form>
    ${results.length
      ? `<div class="phone-grid">${results.map(phoneCard).join("")}</div>`
      : emptyState({ iconName: "search", title: t("phones.noResults"), action: btn(t("common.reset"), "#/phones", { variant: "outline", size: "sm" }) })}
  </div></section>`;
}

export function mountPhones(root) {
  const form = root.querySelector("[data-phones-filter]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const query = buildQuery({
      q: data.get("q")?.toString().trim(),
      brand: data.get("brand")?.toString(),
      year: data.get("year")?.toString(),
      series: data.get("series")?.toString(),
      sort: data.get("sort")?.toString()
    });
    window.location.hash = `#/phones${query}`;
  });
  form.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => form.requestSubmit());
  });
}
