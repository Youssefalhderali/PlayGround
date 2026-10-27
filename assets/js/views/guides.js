import { t, getLang } from "../i18n.js";
import { list } from "../db.js";
import { escapeHtml, icon, pick, buildQuery, formatDate, whatsappLink } from "../utils.js";
import { pageHead, breadcrumb, articleCard, emptyState, sourceList, badge, btn, notice } from "../components.js";
import { articleCategories } from "../data/index.js";

function categoryName(id, lang) {
  const category = articleCategories.find((item) => item.id === id);
  return category ? pick(category, "name", lang) : id || "";
}

export function renderGuides(ctx) {
  const query = ctx.query;
  const q = (query.get("q") || "").toLowerCase();
  const category = query.get("category") || "all";
  const lang = getLang();
  let articles = list("articles");
  if (q) articles = articles.filter((article) => `${pick(article, "title", lang)} ${pick(article, "excerpt", lang)} ${(article.tags || []).join(" ")}`.toLowerCase().includes(q));
  if (category !== "all") articles = articles.filter((article) => article.category === category);
  articles.sort((a, b) => String(b.date).localeCompare(String(a.date)));

  return `${pageHead({
    eyebrow: "BRXVIH / JOURNAL",
    title: t("guides.title"),
    desc: t("guides.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.guides") }],
    meta: `<span class="badge badge-accent">${t("guides.count", { count: articles.length })}</span>`
  })}
  <section class="section-tight"><div class="container">
    <div class="filter-tabs" style="margin-block-end:16px">
      <a class="filter-tab${category === "all" ? " is-active" : ""}" href="#/guides">${t("common.all")}</a>
      ${articleCategories.map((item) => `<a class="filter-tab${category === item.id ? " is-active" : ""}" href="#/guides?category=${encodeURIComponent(item.id)}">${escapeHtml(pick(item, "name", lang))}</a>`).join("")}
    </div>
    <form class="filter-bar" data-guides-filter>
      <label class="filter-search">${icon("search")}<input type="search" name="q" value="${escapeHtml(query.get("q") || "")}" placeholder="${t("guides.searchPlaceholder")}"></label>
      <select class="select" name="category" aria-label="${t("guides.category")}">
        <option value="all">${t("common.all")}</option>
        ${articleCategories.map((item) => `<option value="${item.id}"${item.id === category ? " selected" : ""}>${escapeHtml(pick(item, "name", lang))}</option>`).join("")}
      </select>
      <button class="btn btn-primary btn-sm" type="submit">${icon("filter", "icon-xs")}<span>${t("common.filter")}</span></button>
      <a class="btn btn-ghost btn-sm" href="#/guides">${t("common.reset")}</a>
      <span class="filter-count">${t("guides.count", { count: articles.length })}</span>
    </form>
    ${articles.length ? `<div class="article-grid">${articles.map(articleCard).join("")}</div>` : emptyState({
      iconName: "book", title: t("common.noResults"), action: `<a class="btn btn-outline btn-sm" href="#/guides">${t("common.reset")}</a>`
    })}
  </div></section>`;
}

export function mountGuides(root) {
  const form = root.querySelector("[data-guides-filter]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const query = buildQuery({ q: data.get("q")?.toString().trim(), category: data.get("category")?.toString() });
    window.location.hash = `#/guides${query}`;
  });
  form.querySelector("select")?.addEventListener("change", () => form.requestSubmit());
}

function addHeadingIds(html) {
  let index = 0;
  return String(html || "").replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (match, attrs, text) => {
    const id = `sec-${index}`;
    index += 1;
    const cleanAttrs = attrs ? attrs.replace(/\sid="[^"]*"/, "") : "";
    return `<h2${cleanAttrs} id="${id}">${text}</h2>`;
  });
}

function extractToc(html) {
  const items = [];
  String(html || "").replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (match, attrs, text) => {
    const idMatch = String(attrs || "").match(/id="([^"]+)"/);
    const label = String(text).replace(/<[^>]+>/g, "").trim();
    if (idMatch && label) items.push({ id: idMatch[1], label });
    return match;
  });
  return items;
}

export function renderArticle(ctx) {
  const lang = getLang();
  const article = list("articles").find((item) => item.id === ctx.params.slug || item.slug === ctx.params.slug);
  if (!article) {
    return pageHead({
      title: t("guides.notFound"),
      desc: t("guides.desc"),
      crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.guides"), href: "#/guides" }, { label: ctx.params.slug }]
    }) + `<section class="section"><div class="container">${emptyState({
      iconName: "book", title: t("guides.notFound"), action: btn(t("nav.guides"), "#/guides", { variant: "primary", size: "sm" })
    })}</div></section>`;
  }
  const body = addHeadingIds(lang === "ar" ? article.bodyAr : article.bodyEn);
  const toc = extractToc(body);
  const related = list("articles").filter((item) => item.id !== article.id && item.category === article.category).slice(0, 3);
  const shareUrl = `${window.location.origin}${window.location.pathname}#/guides/${article.id}`;
  const shareText = `${pick(article, "title", lang)} — BRXVIH`;

  return `<section class="page-head"><div class="container">
    ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("nav.guides"), href: "#/guides" }, { label: pick(article, "title", lang) }])}
    <p class="eyebrow">${escapeHtml(categoryName(article.category, lang))}</p>
    <h1>${escapeHtml(pick(article, "title", lang))}</h1>
    <p>${escapeHtml(pick(article, "excerpt", lang))}</p>
    <div class="page-head-meta">
      ${badge(categoryName(article.category, lang), "accent")}
      ${badge(formatDate(article.date, lang), "blue")}
      ${badge(t("guides.readTime", { count: article.readTime || 5 }), "blue")}
    </div>
  </div></section>

  <section class="section-tight"><div class="container article-layout">
    <article class="prose">
      ${body}
      ${(article.tags || []).length ? `<div class="divider"></div><div class="chip-list">${article.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      <div class="divider"></div>
      <div class="row between" style="flex-wrap:wrap">
        <span class="muted" style="font-size:11px">${t("common.updated")}: ${escapeHtml(formatDate(article.date, lang))}</span>
        <div class="row">
          <a class="btn btn-outline btn-sm" href="${whatsappLink(`${shareText}\n${shareUrl}`)}" target="_blank" rel="noopener">${icon("whatsapp", "icon-xs")}<span>${t("common.share")}</span></a>
          <button class="btn btn-ghost btn-sm" type="button" data-copy-link data-link="${escapeHtml(shareUrl)}">${icon("copy", "icon-xs")}<span>${t("common.copy")}</span></button>
        </div>
      </div>
    </article>
    <aside class="article-side">
      ${toc.length ? `<nav class="card toc"><h3>${t("guides.toc")}</h3>${toc.map((item) => `<a href="#${item.id}" data-toc-link="${item.id}">${escapeHtml(item.label)}</a>`).join("")}</nav>` : ""}
      <div class="card card-pad">
        <h3 style="font-size:15px;margin-block-end:10px">${t("common.sources")}</h3>
        ${sourceList(article.sources || [])}
      </div>
      <div class="side-cta">
        <h3>${t("home.ctaTitle")}</h3>
        <p>${t("home.ctaText")}</p>
        <a class="btn btn-dark" href="#/request">${t("nav.request")}</a>
      </div>
    </aside>
  </div></section>

  ${related.length ? `<section class="section section-alt"><div class="container">
    <div class="section-head"><div class="section-head-copy"><p class="eyebrow">RELATED</p><h2>${t("common.related")}</h2></div>${btn(t("common.viewAll"), "#/guides", { variant: "outline", size: "sm" })}</div>
    <div class="article-grid">${related.map(articleCard).join("")}</div>
  </div></section>` : ""}`;
}

export function mountArticle(root) {
  root.querySelector("[data-copy-link]")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(button.dataset.link || "");
      button.querySelector("span").textContent = t("common.copied");
    } catch {
      button.querySelector("span").textContent = t("common.error");
    }
  });
  root.querySelectorAll("[data-toc-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.getElementById(link.dataset.tocLink);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
