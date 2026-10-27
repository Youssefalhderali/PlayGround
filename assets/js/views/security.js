import { t, getLang } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, pick, safeUrl } from "../utils.js";
import { pageHead, sectionHead, notice, ctaBand, badge, toolCard } from "../components.js";
import { securityTopics, securityLabs } from "../data/index.js";

export function renderSecurity() {
  const lang = getLang();
  const tools = list("tools").filter((tool) => tool.category === "security").slice(0, 6);
  const checklist = [1, 2, 3, 4, 5, 6].map((num) => `<li>${escapeHtml(t(`security.check${num}`))}</li>`).join("");

  return `${pageHead({
    eyebrow: "BRXVIH / SECURITY",
    title: t("security.title"),
    desc: t("security.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.security") }],
    meta: `<span class="badge badge-accent">${t("common.verified")}</span>`
  })}
  <section class="section-tight"><div class="container">
    ${notice(t("security.notice"), "danger", "shield")}
    <div class="grid grid-3" style="margin-block-start:18px">
      ${securityTopics.map((topic) => `<article class="card card-pad card-hover">
        <span class="firmware-icon">${icon(topic.icon)}</span>
        <h3 style="margin-block:14px 6px;font-size:18px">${escapeHtml(pick(topic, "title", lang))}</h3>
        <p class="muted" style="font-size:13px;line-height:1.8">${escapeHtml(pick(topic, "desc", lang))}</p>
      </article>`).join("")}
    </div>
  </div></section>

  <section class="section section-alt"><div class="container split">
    <div class="panel">
      <p class="eyebrow">CHECKLIST</p>
      <h2 style="font-size:clamp(24px,3vw,34px)">${t("security.checklist")}</h2>
      <ol class="prose" style="max-width:none;margin-block-start:16px">${checklist}</ol>
      <div class="row" style="margin-block-start:18px">${badge(t("security.title"), "accent")}${badge("Android · iOS · Network", "blue")}</div>
    </div>
    <div class="panel panel-dark">
      <p class="eyebrow">LABS</p>
      <h2 style="font-size:clamp(24px,3vw,34px)">${t("security.labs")}</h2>
      <div class="source-list" style="margin-block-start:14px">
        ${securityLabs.map((lab) => `<a class="source-link" href="${escapeHtml(safeUrl(lab.url))}" target="_blank" rel="noopener">${icon(lab.icon || "external", "icon-xs")}<span><b>${escapeHtml(lab.name)}</b> — ${escapeHtml(pick(lab, "desc", lang))}</span></a>`).join("")}
      </div>
    </div>
  </div></section>

  <section class="section"><div class="container">
    ${sectionHead({ eyebrow: "TOOLS", title: t("nav.tools"), desc: t("tools.desc"), href: "#/tools", linkLabel: t("common.viewAll") })}
    <div class="grid grid-3">${tools.length ? tools.map(toolCard).join("") : `<p class="muted">${t("common.noResults")}</p>`}</div>
  </div></section>

  ${ctaBand({
    title: t("home.ctaTitle"),
    text: t("security.notice"),
    primary: `<a class="btn btn-dark" href="#/contact">${icon("shield", "icon-xs")}<span>${t("nav.contact")}</span></a>`,
    secondary: `<a class="btn btn-outline" href="#/guides?category=security">${t("nav.guides")}</a>`
  })}`;
}
