import { t, getLang } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, pick, buildQuery } from "../utils.js";
import { pageHead, partCard, emptyState, notice, supplierCard, ctaBand } from "../components.js";
import { suppliers } from "../data/index.js";

export function renderParts(ctx) {
  const query = ctx.query;
  const q = (query.get("q") || "").toLowerCase();
  const type = query.get("type") || "all";
  const lang = getLang();
  let parts = list("parts");
  if (q) parts = parts.filter((part) => `${pick(part, "name", lang)} ${pick(part, "desc", lang)} ${part.partType}`.toLowerCase().includes(q));
  if (type !== "all") parts = parts.filter((part) => part.partType === type);
  const types = [...new Map(list("parts").map((part) => [part.partType, { value: part.partType, label: pick(part, "name", lang) }])).values()];

  return `${pageHead({
    eyebrow: "BRXVIH / PARTS",
    title: t("parts.title"),
    desc: t("parts.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.parts") }],
    meta: `<span class="badge badge-accent">${t("parts.count", { count: parts.length })}</span>`
  })}
  <section class="section-tight"><div class="container">
    ${notice(t("parts.notice"), "info", "package")}
    <form class="filter-bar" data-parts-filter style="margin-block-start:16px">
      <label class="filter-search">${icon("search")}<input type="search" name="q" value="${escapeHtml(query.get("q") || "")}" placeholder="${t("phones.searchPlaceholder")}"></label>
      <select class="select" name="type" aria-label="${t("parts.filterType")}">
        <option value="all">${t("parts.filterType")}</option>
        ${types.map((item) => `<option value="${escapeHtml(item.value)}"${item.value === type ? " selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
      </select>
      <button class="btn btn-primary btn-sm" type="submit">${icon("filter", "icon-xs")}<span>${t("common.filter")}</span></button>
      <a class="btn btn-ghost btn-sm" href="#/parts">${t("common.reset")}</a>
      <span class="filter-count">${t("parts.count", { count: parts.length })}</span>
    </form>
    ${parts.length ? `<div class="grid grid-3">${parts.map(partCard).join("")}</div>` : emptyState({
      iconName: "package", title: t("common.noResults"), action: `<a class="btn btn-outline btn-sm" href="#/parts">${t("common.reset")}</a>`
    })}
    <div class="section-head" style="margin-block-start:48px">
      <div class="section-head-copy"><p class="eyebrow">SUPPLIERS</p><h2>${t("common.suppliers")}</h2></div>
    </div>
    <div class="grid grid-3">${suppliers.map(supplierCard).join("")}</div>
  </div></section>
  ${ctaBand({
    title: t("parts.request"),
    text: t("parts.notice"),
    primary: `<a class="btn btn-dark" href="#/request">${icon("message", "icon-xs")}<span>${t("nav.request")}</span></a>`,
    secondary: `<a class="btn btn-outline" href="#/contact">${t("nav.contact")}</a>`
  })}`;
}

export function mountParts(root) {
  const form = root.querySelector("[data-parts-filter]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const query = buildQuery({ q: data.get("q")?.toString().trim(), type: data.get("type")?.toString() });
    window.location.hash = `#/parts${query}`;
  });
  form.querySelector("select")?.addEventListener("change", () => form.requestSubmit());
}
