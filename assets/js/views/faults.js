import { t, getLang } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, pick, buildQuery, whatsappLink } from "../utils.js";
import { pageHead, breadcrumb, faultCard, emptyState, notice, badge, btn, toolCard } from "../components.js";

const categoryLabels = {
  hardware: { ar: "عتاد", en: "Hardware" },
  software: { ar: "برمجيات", en: "Software" },
  power: { ar: "طاقة", en: "Power" },
  network: { ar: "شبكة", en: "Network" },
  security: { ar: "أمان", en: "Security" }
};

function categoryName(id, lang) {
  return categoryLabels[id]?.[lang] || id || "";
}

export function renderFaults(ctx) {
  const query = ctx.query;
  const q = (query.get("q") || "").toLowerCase();
  const category = query.get("category") || "all";
  const lang = getLang();
  let faults = list("faults");
  if (q) faults = faults.filter((fault) => `${pick(fault, "title", lang)} ${pick(fault, "summary", lang)} ${fault.category}`.toLowerCase().includes(q));
  if (category !== "all") faults = faults.filter((fault) => fault.category === category);
  const categories = [...new Set(list("faults").map((fault) => fault.category).filter(Boolean))];

  return `${pageHead({
    eyebrow: "BRXVIH / DIAGNOSTICS",
    title: t("faults.title"),
    desc: t("faults.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.faults") }],
    meta: `<span class="badge badge-accent">${t("faults.count", { count: faults.length })}</span>`
  })}
  <section class="section-tight"><div class="container">
    ${notice(t("faults.safetyNote"), "warning", "alert")}
    <div class="filter-tabs" style="margin-block:16px">
      <a class="filter-tab${category === "all" ? " is-active" : ""}" href="#/faults">${t("common.all")}</a>
      ${categories.map((id) => `<a class="filter-tab${category === id ? " is-active" : ""}" href="#/faults?category=${encodeURIComponent(id)}">${escapeHtml(categoryName(id, lang))}</a>`).join("")}
    </div>
    <form class="filter-bar" data-faults-filter>
      <label class="filter-search">${icon("search")}<input type="search" name="q" value="${escapeHtml(query.get("q") || "")}" placeholder="${t("faults.searchPlaceholder")}"></label>
      <select class="select" name="category" aria-label="${t("guides.category")}">
        <option value="all">${t("common.all")}</option>
        ${categories.map((id) => `<option value="${id}"${id === category ? " selected" : ""}>${escapeHtml(categoryName(id, lang))}</option>`).join("")}
      </select>
      <button class="btn btn-primary btn-sm" type="submit">${icon("filter", "icon-xs")}<span>${t("common.filter")}</span></button>
      <a class="btn btn-ghost btn-sm" href="#/faults">${t("common.reset")}</a>
      <span class="filter-count">${t("faults.count", { count: faults.length })}</span>
    </form>
    ${faults.length ? `<div class="grid grid-3">${faults.map(faultCard).join("")}</div>` : emptyState({
      iconName: "alert", title: t("common.noResults"), action: `<a class="btn btn-outline btn-sm" href="#/faults">${t("common.reset")}</a>`
    })}
  </div></section>`;
}

export function mountFaults(root) {
  const form = root.querySelector("[data-faults-filter]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const query = buildQuery({ q: data.get("q")?.toString().trim(), category: data.get("category")?.toString() });
    window.location.hash = `#/faults${query}`;
  });
  form.querySelector("select")?.addEventListener("change", () => form.requestSubmit());
}

export function renderFault(ctx) {
  const lang = getLang();
  const fault = list("faults").find((item) => item.id === ctx.params.slug);
  if (!fault) {
    return pageHead({
      title: t("faults.notFound"),
      desc: t("faults.desc"),
      crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.faults"), href: "#/faults" }, { label: ctx.params.slug }]
    }) + `<section class="section"><div class="container">${emptyState({
      iconName: "alert", title: t("faults.notFound"), action: btn(t("nav.faults"), "#/faults", { variant: "primary", size: "sm" })
    })}</div></section>`;
  }
  const phones = list("phones").filter((phone) => (phone.issueIds || []).includes(fault.id)).slice(0, 6);
  const parts = list("parts").filter((part) => (fault.relatedParts || []).includes(part.partType));
  const tools = list("tools").filter((tool) => ["diagnostic", "flashing"].includes(tool.category)).slice(0, 3);
  const steps = lang === "ar" ? fault.stepsAr : fault.stepsEn;
  const waText = lang === "ar"
    ? `مرحباً BRXVIH، لدي عطل: ${fault.titleAr}. أحتاج تشخيصاً.`
    : `Hello BRXVIH, I have a fault: ${fault.titleEn}. I need diagnosis.`;

  return `<section class="page-head"><div class="container">
    ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("nav.faults"), href: "#/faults" }, { label: pick(fault, "title", lang) }])}
    <div class="row" style="align-items:flex-start;gap:18px">
      <span class="fault-icon" style="width:60px;height:60px;border-radius:16px">${icon(fault.icon || "alert", "icon-lg")}</span>
      <div>
        <p class="eyebrow">${escapeHtml(categoryName(fault.category, lang))} · ${escapeHtml(t("common.diagnosis"))}</p>
        <h1>${escapeHtml(pick(fault, "title", lang))}</h1>
        <p>${escapeHtml(pick(fault, "summary", lang))}</p>
        <div class="page-head-meta">
          ${badge(categoryName(fault.category, lang), "accent")}
          ${badge(`${t("common.difficulty") || "Difficulty"}: ${fault.difficulty || 2}/5`, "blue")}
          ${fault.urgent ? badge("Urgent", "danger") : ""}
        </div>
      </div>
    </div>
  </div></section>

  <section class="section-tight"><div class="container detail-layout">
    <div class="detail-main">
      <div class="detail-card card">
        <h2>${icon("eye")} ${t("common.symptoms")}</h2>
        <ul class="prose" style="max-width:none">${(fault.symptoms || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h2 style="margin-block-start:24px">${icon("search")} ${t("common.causes")}</h2>
        <ul class="prose" style="max-width:none">${(fault.causes || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      <div class="detail-card card">
        <h2>${icon("tools")} ${t("common.steps")}</h2>
        <ol class="prose" style="max-width:none">${(steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        ${(fault.dont || []).length ? `<div class="notice danger" style="margin-block-start:18px">${icon("alert")}<div><strong>${t("common.dont")}:</strong><ul style="margin-block-start:6px;padding-inline-start:18px">${fault.dont.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></div>` : ""}
      </div>
      <div class="detail-card card">
        <h2>${icon("package")} ${t("common.parts")}</h2>
        ${parts.length ? `<div class="grid grid-2">${parts.map((part) => `<a class="card card-pad card-hover" href="#/parts?type=${encodeURIComponent(part.partType)}">
          <span class="firmware-icon">${icon(part.icon || "package")}</span>
          <h3 style="margin-block:12px 5px">${escapeHtml(pick(part, "name", lang))}</h3>
          <p class="muted" style="font-size:12.5px">${escapeHtml(pick(part, "compatibility", lang))}</p>
        </a>`).join("")}</div>` : `<p class="muted">${t("parts.notice")}</p>`}
      </div>
      ${phones.length ? `<div class="detail-card card"><h2>${icon("smartphone")} ${t("faults.relatedPhones")}</h2><div class="grid grid-2">${phones.map((phone) => `<a class="card card-pad card-hover" href="#/phones/${encodeURIComponent(phone.slug || phone.id)}"><span class="phone-brand"><span class="phone-brand-mark">${escapeHtml(phone.brand.charAt(0).toUpperCase())}</span>${escapeHtml(phone.brand)}</span><h3 style="margin-block:10px 4px">${escapeHtml(lang === "ar" ? phone.nameAr || phone.name : phone.name)}</h3><p class="phone-sub">${escapeHtml(phone.model)}</p></a>`).join("")}</div></div>` : ""}
      ${tools.length ? `<div class="detail-card card"><h2>${icon("tools")} ${t("faults.relatedTools")}</h2><div class="grid grid-3">${tools.map(toolCard).join("")}</div></div>` : ""}
    </div>
    <aside class="detail-side">
      <div class="side-cta">
        <p class="eyebrow" style="color:rgba(9,10,4,.6)">DIAGNOSTIC</p>
        <h3>${t("faults.safetyNote")}</h3>
        <p>${t("home.ctaText")}</p>
        <a class="btn btn-dark" href="${whatsappLink(waText)}" target="_blank" rel="noopener">${icon("whatsapp", "icon-xs")}<span>${t("cta.whatsapp")}</span></a>
      </div>
      <div class="card card-pad">
        <h3 style="font-size:15px;margin-block-end:10px">${t("faults.relatedTools")}</h3>
        <div class="chip-list">${(fault.tools || []).map((tool) => `<span class="chip">${escapeHtml(tool)}</span>`).join("")}</div>
        <div class="divider"></div>
        <div class="kv"><span>${t("common.safety")}</span><b>${escapeHtml(fault.safety || "—")}</b></div>
      </div>
      <div class="card card-pad">
        <h3 style="font-size:15px;margin-block-end:10px">${t("nav.request")}</h3>
        <p class="muted" style="font-size:12px;line-height:1.7">${t("request.desc")}</p>
        <a class="btn btn-primary btn-sm btn-block" href="#/request?fault=${encodeURIComponent(fault.id)}" style="margin-block-start:10px">${t("request.title")}</a>
      </div>
    </aside>
  </div></section>`;
}
