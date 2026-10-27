import { t } from "../i18n.js";
import { icon } from "../utils.js";
import { pageHead, emptyState, btn } from "../components.js";

export function renderNotFound() {
  return `${pageHead({
    eyebrow: "404",
    title: t("error.title"),
    desc: t("error.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: "404" }]
  })}
  <section class="section"><div class="container">
    ${emptyState({
      iconName: "alert",
      title: t("error.title"),
      desc: t("error.desc"),
      action: `<div class="row" style="justify-content:center">${btn(t("error.home"), "#/", { variant: "primary", size: "sm", iconName: "home" })}${btn(t("error.search"), "#/search", { variant: "outline", size: "sm", iconName: "search" })}</div>`
    })}
    <div class="grid grid-3" style="margin-block-start:22px">
      <a class="card card-pad card-hover" href="#/phones"><span class="firmware-icon">${icon("smartphone")}</span><h3 style="margin-block:12px 4px">${t("nav.phones")}</h3><p class="muted" style="font-size:12px">${t("phones.desc")}</p></a>
      <a class="card card-pad card-hover" href="#/faults"><span class="firmware-icon">${icon("alert")}</span><h3 style="margin-block:12px 4px">${t("nav.faults")}</h3><p class="muted" style="font-size:12px">${t("faults.desc")}</p></a>
      <a class="card card-pad card-hover" href="#/contact"><span class="firmware-icon">${icon("message")}</span><h3 style="margin-block:12px 4px">${t("nav.contact")}</h3><p class="muted" style="font-size:12px">${t("contact.desc")}</p></a>
    </div>
  </div></section>`;
}
