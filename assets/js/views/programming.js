import { t, getLang } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, pick, whatsappLink } from "../utils.js";
import { pageHead, sectionHead, notice, ctaBand, badge, toolCard, faultCard } from "../components.js";
import { programmingServices } from "../data/index.js";

export function renderProgramming() {
  const lang = getLang();
  const tools = list("tools").filter((tool) => ["unlock", "development"].includes(tool.category)).slice(0, 6);
  const faults = list("faults").filter((fault) => ["software", "security"].includes(fault.category)).slice(0, 3);
  const requirements = [1, 2, 3, 4].map((num) => `<li>${escapeHtml(t(`programming.req${num}`))}</li>`).join("");

  return `${pageHead({
    eyebrow: "BRXVIH / PROGRAMMING",
    title: t("programming.title"),
    desc: t("programming.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.programming") }],
    meta: `<span class="badge badge-accent">${t("common.verified")}</span>`
  })}
  <section class="section-tight"><div class="container">
    ${notice(t("programming.notice"), "danger", "shield")}
    <div class="grid grid-3" style="margin-block-start:18px">
      ${programmingServices.map((service) => `<article class="card card-pad card-hover">
        <span class="firmware-icon">${icon(service.icon)}</span>
        <h3 style="margin-block:14px 6px;font-size:18px">${escapeHtml(pick(service, "title", lang))}</h3>
        <p class="muted" style="font-size:13px;line-height:1.8">${escapeHtml(pick(service, "desc", lang))}</p>
      </article>`).join("")}
    </div>
  </div></section>

  <section class="section section-alt"><div class="container split">
    <div class="panel">
      <p class="eyebrow">REQUIREMENTS</p>
      <h2 style="font-size:clamp(24px,3vw,34px)">${t("programming.requirements")}</h2>
      <ol class="prose" style="max-width:none;margin-block-start:16px">${requirements}</ol>
      <div class="row" style="margin-block-start:18px">
        <a class="btn btn-primary" href="#/request">${icon("message", "icon-xs")}<span>${t("programming.request")}</span></a>
        <a class="btn btn-outline" href="${whatsappLink(t("whatsapp.message"))}" target="_blank" rel="noopener">${icon("whatsapp", "icon-xs")}<span>${t("cta.whatsapp")}</span></a>
      </div>
    </div>
    <div class="panel panel-accent">
      <p class="eyebrow">ETHICS</p>
      <h2 style="font-size:clamp(24px,3vw,34px)">${t("security.title")}</h2>
      <p style="margin-block:10px 16px">${t("security.notice")}</p>
      <div class="chip-list">
        ${badge(t("common.verified"), "solid")}
        ${badge(t("common.safety"), "solid")}
        ${badge("BRXVIH", "solid")}
      </div>
    </div>
  </div></section>

  <section class="section"><div class="container">
    ${sectionHead({ eyebrow: "TOOLS", title: t("nav.tools"), desc: t("tools.desc"), href: "#/tools", linkLabel: t("common.viewAll") })}
    <div class="grid grid-3">${tools.map(toolCard).join("")}</div>
  </div></section>

  <section class="section section-alt"><div class="container">
    ${sectionHead({ eyebrow: "FIXES", title: t("software.faults"), desc: t("faults.desc"), href: "#/faults", linkLabel: t("common.viewAll") })}
    <div class="grid grid-3">${faults.map(faultCard).join("")}</div>
  </div></section>

  ${ctaBand({
    title: t("programming.request"),
    text: t("programming.notice"),
    primary: `<a class="btn btn-dark" href="#/request">${icon("message", "icon-xs")}<span>${t("nav.request")}</span></a>`,
    secondary: `<a class="btn btn-outline" href="#/contact">${t("nav.contact")}</a>`
  })}`;
}
