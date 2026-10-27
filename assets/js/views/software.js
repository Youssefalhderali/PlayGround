import { t } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon } from "../utils.js";
import { pageHead, sectionHead, notice, firmwareRow, toolCard, faultCard, ctaBand, btn, badge } from "../components.js";
import { firmwareSources } from "../data/index.js";

export function renderSoftware() {
  const steps = [1, 2, 3, 4].map((num) => `<div class="card card-pad">
    <span class="badge badge-accent">0${num}</span>
    <h3 style="margin-block:12px 6px">${escapeHtml(t(`software.step${num}`))}</h3>
    <p class="muted" style="font-size:13px;line-height:1.8">${escapeHtml(t(`software.step${num}Desc`))}</p>
  </div>`).join("");
  const firmware = list("firmware").slice(0, 8);
  const tools = list("tools").filter((tool) => tool.category === "flashing").slice(0, 6);
  const faults = list("faults").filter((fault) => fault.category === "software").slice(0, 6);

  return `${pageHead({
    eyebrow: "BRXVIH / SOFTWARE",
    title: t("software.title"),
    desc: t("software.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.software") }],
    meta: `<span class="badge badge-accent">${t("common.verified")}</span>`
  })}
  <section class="section-tight"><div class="container">
    ${notice(t("software.warning"), "warning", "alert")}
    <div class="grid grid-4" style="margin-block-start:18px">${steps}</div>
  </div></section>

  <section class="section section-alt"><div class="container">
    ${sectionHead({ eyebrow: "01 / ROMS", title: t("software.roms"), desc: t("firmware.desc"), href: "#/firmware", linkLabel: t("common.viewAll") })}
    <div class="grid grid-2">
      <div class="card card-pad">${firmware.map(firmwareRow).join("")}</div>
      <div class="card card-pad">
        <h3 style="margin-block-end:12px">${t("common.sources")}</h3>
        <div class="source-list">${firmwareSources.slice(0, 8).map((source) => `<a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${icon("external", "icon-xs")}<span>${escapeHtml(source.name)}</span></a>`).join("")}</div>
        <div class="divider"></div>
        <p class="form-note">${t("firmware.notice")}</p>
      </div>
    </div>
  </div></section>

  <section class="section"><div class="container">
    ${sectionHead({ eyebrow: "02 / TOOLS", title: t("software.tools"), desc: t("tools.desc"), href: "#/tools", linkLabel: t("common.viewAll") })}
    <div class="grid grid-3">${tools.map(toolCard).join("")}</div>
  </div></section>

  <section class="section section-alt"><div class="container">
    ${sectionHead({ eyebrow: "03 / FIXES", title: t("software.faults"), desc: t("faults.desc"), href: "#/faults", linkLabel: t("common.viewAll") })}
    <div class="grid grid-3">${faults.map(faultCard).join("")}</div>
  </div></section>

  ${ctaBand({
    title: t("programming.request"),
    text: t("software.warning"),
    primary: `<a class="btn btn-dark" href="#/request">${icon("message", "icon-xs")}<span>${t("nav.request")}</span></a>`,
    secondary: `<a class="btn btn-outline" href="#/tools">${t("nav.tools")}</a>`
  })}`;
}
