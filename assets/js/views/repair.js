import { t, getLang } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, pick, whatsappLink } from "../utils.js";
import { pageHead, sectionHead, notice, ctaBand, faultCard, badge } from "../components.js";
import { repairServices } from "../data/index.js";

export function renderRepair() {
  const lang = getLang();
  const faults = list("faults").slice(0, 6);
  const process = [1, 2, 3, 4].map((num) => `<div class="card card-pad">
    <span class="badge badge-accent">0${num}</span>
    <h3 style="margin-block:12px 6px">${escapeHtml(t(`repair.process${num}`))}</h3>
    <p class="muted" style="font-size:13px;line-height:1.8">${escapeHtml(t(`repair.process${num}Desc`))}</p>
  </div>`).join("");

  return `${pageHead({
    eyebrow: "BRXVIH / REPAIR",
    title: t("repair.title"),
    desc: t("repair.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.repair") }],
    meta: `<span class="badge badge-accent">${t("common.diagnosis")}</span>`
  })}
  <section class="section-tight"><div class="container">
    ${notice(t("screens.notice"), "info", "info")}
    <div class="grid grid-3" style="margin-block-start:18px">
      ${repairServices.map((service) => `<article class="card card-pad card-hover">
        <div class="row between" style="align-items:flex-start">
          <span class="firmware-icon">${icon(service.icon)}</span>
          ${badge(pick(service, "time", lang), "blue")}
        </div>
        <h3 style="margin-block:14px 6px;font-size:18px">${escapeHtml(pick(service, "title", lang))}</h3>
        <p class="muted" style="font-size:13px;line-height:1.8">${escapeHtml(pick(service, "desc", lang))}</p>
        <div class="kv" style="margin-block-start:12px"><span>${t("common.prices")}</span><b>${escapeHtml(pick(service, "price", lang))}</b></div>
      </article>`).join("")}
    </div>
  </div></section>

  <section class="section section-alt"><div class="container">
    ${sectionHead({ eyebrow: "PROCESS", title: t("repair.process"), desc: t("request.desc") })}
    <div class="grid grid-4">${process}</div>
  </div></section>

  <section class="section"><div class="container">
    ${sectionHead({ eyebrow: "FAULTS", title: t("home.faultsTitle"), desc: t("faults.desc"), href: "#/faults", linkLabel: t("common.viewAll") })}
    <div class="grid grid-3">${faults.map(faultCard).join("")}</div>
  </div></section>

  ${ctaBand({
    title: t("repair.request"),
    text: t("home.ctaText"),
    primary: `<a class="btn btn-dark" href="#/request">${icon("message", "icon-xs")}<span>${t("nav.request")}</span></a>`,
    secondary: `<a class="btn btn-outline" href="${whatsappLink(t("whatsapp.message"))}" target="_blank" rel="noopener">${icon("whatsapp", "icon-xs")}<span>${t("cta.whatsapp")}</span></a>`
  })}`;
}
