import { t, getLang } from "../i18n.js";
import { escapeHtml, icon } from "../utils.js";
import { globalSearch } from "../search.js";
import { pageHead, emptyState, notice } from "../components.js";

const groupLabels = {
  phone: "search.groupPhones",
  fault: "search.groupFaults",
  tool: "search.groupTools",
  firmware: "search.groupFirmware",
  article: "search.groupGuides",
  price: "search.groupPrices",
  part: "search.groupParts"
};

export function renderSearch(ctx) {
  const q = ctx.query.get("q") || "";
  const results = q ? globalSearch(q, { lang: getLang(), limit: 40 }) : [];
  const groups = new Map();
  results.forEach((result) => {
    if (!groups.has(result.type)) groups.set(result.type, []);
    groups.get(result.type).push(result);
  });

  return `${pageHead({
    eyebrow: "BRXVIH / SEARCH",
    title: t("search.title"),
    desc: q ? `${q} — ${t("search.results")} (${results.length})` : t("search.hint"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("common.search") }]
  })}
  <section class="section-tight"><div class="container">
    <form class="filter-bar" data-search-page-form>
      <label class="filter-search">${icon("search")}<input type="search" name="q" value="${escapeHtml(q)}" placeholder="${t("search.placeholder")}" autofocus></label>
      <button class="btn btn-primary btn-sm" type="submit">${t("common.search")}</button>
    </form>
    ${!q ? notice(t("search.hint"), "info", "search") : ""}
    ${q && !results.length ? emptyState({ iconName: "search", title: t("search.noResults"), desc: t("phones.noResults") }) : ""}
    ${[...groups.entries()].map(([type, items]) => `<div style="margin-block-end:24px">
      <p class="search-group-label">${escapeHtml(t(groupLabels[type] || type))} · ${items.length}</p>
      <div class="grid grid-2">${items.map((item) => `<a class="card card-pad card-hover" href="${escapeHtml(item.href)}">
        <div class="row between" style="align-items:flex-start">
          <span class="search-result-icon">${icon(item.icon)}</span>
          <span class="badge badge-accent">${escapeHtml(item.badge)}</span>
        </div>
        <h3 style="margin-block:12px 5px;font-size:16px">${escapeHtml(item.title)}</h3>
        <p class="muted" style="font-size:12px;line-height:1.7">${escapeHtml(item.subtitle)}</p>
      </a>`).join("")}</div>
    </div>`).join("")}
  </div></section>`;
}

export function mountSearch(root) {
  root.querySelector("[data-search-page-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q")?.toString().trim() || "";
    window.location.hash = `#/search${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  });
}
