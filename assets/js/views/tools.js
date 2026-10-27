import { t, getLang } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, buildQuery, pick } from "../utils.js";
import { pageHead, toolCard, emptyState, notice, badge } from "../components.js";
import { toolCategories } from "../data/index.js";

export function renderTools(ctx) {
  const query = ctx.query;
  const q = (query.get("q") || "").toLowerCase();
  const category = query.get("category") || "all";
  const lang = getLang();
  let tools = list("tools");
  if (q) tools = tools.filter((tool) => `${tool.name} ${pick(tool, "purpose", lang)} ${tool.platform} ${tool.category}`.toLowerCase().includes(q));
  if (category !== "all") tools = tools.filter((tool) => tool.category === category);

  return `${pageHead({
    eyebrow: "BRXVIH / TOOLS",
    title: t("tools.title"),
    desc: t("tools.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.tools") }],
    meta: `<span class="badge badge-accent">${t("tools.count", { count: tools.length })}</span>`
  })}
  <section class="section-tight"><div class="container">
    ${notice(t("firmware.notice"), "warning", "alert")}
    <div class="filter-tabs" style="margin-block:16px">
      <a class="filter-tab${category === "all" ? " is-active" : ""}" href="#/tools">${t("common.all")}</a>
      ${toolCategories.map((item) => `<a class="filter-tab${category === item.id ? " is-active" : ""}" href="#/tools?category=${encodeURIComponent(item.id)}">${escapeHtml(pick(item, "name", lang))}</a>`).join("")}
    </div>
    <form class="filter-bar" data-tools-filter>
      <label class="filter-search">${icon("search")}<input type="search" name="q" value="${escapeHtml(query.get("q") || "")}" placeholder="${t("phones.searchPlaceholder")}"></label>
      <select class="select" name="category" aria-label="${t("tools.filterCategory")}">
        <option value="all">${t("tools.filterCategory")}</option>
        ${toolCategories.map((item) => `<option value="${item.id}"${item.id === category ? " selected" : ""}>${escapeHtml(pick(item, "name", lang))}</option>`).join("")}
      </select>
      <button class="btn btn-primary btn-sm" type="submit">${icon("filter", "icon-xs")}<span>${t("common.filter")}</span></button>
      <a class="btn btn-ghost btn-sm" href="#/tools">${t("common.reset")}</a>
      <span class="filter-count">${t("tools.count", { count: tools.length })}</span>
    </form>
    ${tools.length ? `<div class="grid grid-3">${tools.map(toolCard).join("")}</div>` : emptyState({
      iconName: "tools", title: t("common.noResults"), action: `<a class="btn btn-outline btn-sm" href="#/tools">${t("common.reset")}</a>`
    })}
    <div class="notice warning" style="margin-block-start:24px">${icon("alert")}<div><strong>${t("common.safety")}:</strong> ${t("software.warning")}</div></div>
  </div></section>`;
}

export function mountTools(root) {
  const form = root.querySelector("[data-tools-filter]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const query = buildQuery({ q: data.get("q")?.toString().trim(), category: data.get("category")?.toString() });
    window.location.hash = `#/tools${query}`;
  });
  form.querySelector("select")?.addEventListener("change", () => form.requestSubmit());
}
