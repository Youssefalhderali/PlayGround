import { t, getLang, brandLabel } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, buildQuery, safeUrl, formatDate } from "../utils.js";
import { pageHead, emptyState, notice, badge } from "../components.js";
import { brands, firmwareSources } from "../data/index.js";

export function renderFirmware(ctx) {
  const query = ctx.query;
  const q = (query.get("q") || "").toLowerCase();
  const brand = query.get("brand") || "all";
  const source = query.get("source") || "all";
  let rows = list("firmware");
  if (q) rows = rows.filter((row) => `${row.phoneName} ${row.model} ${row.version} ${row.region}`.toLowerCase().includes(q));
  if (brand !== "all") rows = rows.filter((row) => row.brand === brand);
  if (source !== "all") rows = rows.filter((row) => row.sourceId === source);
  const sources = [...new Map(list("firmware").map((row) => {
    const info = firmwareSources.find((item) => item.id === row.sourceId);
    return [row.sourceId, { value: row.sourceId, label: info?.name || row.sourceId }];
  })).values()];

  return `${pageHead({
    eyebrow: "BRXVIH / FIRMWARE",
    title: t("firmware.title"),
    desc: t("firmware.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.firmware") }],
    meta: `<span class="badge badge-accent">${t("firmware.count", { count: rows.length })}</span>`
  })}
  <section class="section-tight"><div class="container">
    ${notice(t("firmware.notice"), "warning", "alert")}
    <form class="filter-bar" data-firmware-filter style="margin-block-start:16px">
      <label class="filter-search">${icon("search")}<input type="search" name="q" value="${escapeHtml(query.get("q") || "")}" placeholder="${t("phones.searchPlaceholder")}"></label>
      <select class="select" name="brand" aria-label="${t("common.brand")}">
        <option value="all">${t("firmware.filterBrand")}</option>
        ${brands.map((item) => `<option value="${item.id}"${item.id === brand ? " selected" : ""}>${escapeHtml(brandLabel(item))}</option>`).join("")}
      </select>
      <select class="select" name="source" aria-label="${t("common.source")}">
        <option value="all">${t("firmware.filterSource")}</option>
        ${sources.map((item) => `<option value="${escapeHtml(item.value)}"${item.value === source ? " selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
      </select>
      <button class="btn btn-primary btn-sm" type="submit">${icon("filter", "icon-xs")}<span>${t("common.filter")}</span></button>
      <a class="btn btn-ghost btn-sm" href="#/firmware">${t("common.reset")}</a>
      <span class="filter-count">${t("firmware.count", { count: rows.length })}</span>
    </form>
    ${rows.length ? `<div class="table-wrap"><table>
      <thead><tr><th>${t("common.phones")}</th><th>${t("firmware.version")}</th><th>${t("firmware.region")}</th><th>${t("firmware.size")}</th><th>${t("common.source")}</th><th>${t("common.updated")}</th><th></th></tr></thead>
      <tbody>${rows.map((row) => {
        const info = firmwareSources.find((item) => item.id === row.sourceId);
        const url = safeUrl(info?.url || "");
        return `<tr>
          <td><a class="cell-title" href="#/phones/${encodeURIComponent(row.phoneSlug)}">${escapeHtml(row.phoneName)}</a><span class="cell-sub">${escapeHtml(row.brand?.toUpperCase() || "")} · ${escapeHtml(row.model || "")}</span></td>
          <td>${escapeHtml(row.version || "—")}<span class="cell-sub">${escapeHtml(row.type || "")}</span></td>
          <td>${escapeHtml(row.region || "—")}</td>
          <td class="mono" style="font-size:10px">${escapeHtml(row.size || t("firmware.sourceNote"))}</td>
          <td>${info ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(info.name)}</a>` : escapeHtml(row.sourceId)}</td>
          <td class="mono" style="font-size:10px">${escapeHtml(formatDate(row.updatedAt, getLang()))}</td>
          <td class="table-actions">${url ? `<a class="icon-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="${t("firmware.openSource")}">${icon("external", "icon-sm")}</a>` : ""}</td>
        </tr>`;
      }).join("")}</tbody>
    </table></div>` : emptyState({
      iconName: "download", title: t("common.noResults"), action: `<a class="btn btn-outline btn-sm" href="#/firmware">${t("common.reset")}</a>`
    })}
    <div class="section-head" style="margin-block-start:46px"><div class="section-head-copy"><p class="eyebrow">SOURCES</p><h2>${t("software.roms")}</h2><p>${t("firmware.desc")}</p></div></div>
    <div class="grid grid-3">${firmwareSources.slice(0, 12).map((item) => `<a class="card card-pad card-hover" href="${escapeHtml(safeUrl(item.url))}" target="_blank" rel="noopener">
      <div class="row between"><span class="firmware-icon">${icon("download")}</span>${badge(item.type === "official" ? "Official" : "Community", item.type === "official" ? "success" : "blue")}</div>
      <h3 style="margin-block:12px 5px;font-size:16px">${escapeHtml(getLang() === "ar" ? item.nameAr || item.name : item.name)}</h3>
      <p class="muted" style="font-size:12px;line-height:1.7">${escapeHtml(getLang() === "ar" ? item.descriptionAr : item.descriptionEn)}</p>
    </a>`).join("")}</div>
  </div></section>`;
}

export function mountFirmware(root) {
  const form = root.querySelector("[data-firmware-filter]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const query = buildQuery({ q: data.get("q")?.toString().trim(), brand: data.get("brand")?.toString(), source: data.get("source")?.toString() });
    window.location.hash = `#/firmware${query}`;
  });
  form.querySelectorAll("select").forEach((select) => select.addEventListener("change", () => form.requestSubmit()));
}
