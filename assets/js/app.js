import { initI18n, getLang, toggleLang, t, applyStaticI18n } from "./i18n.js";
import { loadDB, list } from "./db.js";
import { startRouter, parseHash } from "./router.js";
import { globalSearch } from "./search.js";
import {
  escapeHtml, icon, debounce, qs, qsa, storageGet, storageSet,
  setMeta, scrollToTop, formatNumber
} from "./utils.js";
import { siteConfig } from "./data/index.js";

import * as homeView from "./views/home.js";
import * as phonesView from "./views/phones.js";
import * as phoneView from "./views/phone.js";
import * as screensView from "./views/screens.js";
import * as partsView from "./views/parts.js";
import * as firmwareView from "./views/firmware.js";
import * as toolsView from "./views/tools.js";
import * as faultsView from "./views/faults.js";
import * as guidesView from "./views/guides.js";
import * as softwareView from "./views/software.js";
import * as programmingView from "./views/programming.js";
import * as securityView from "./views/security.js";
import * as repairView from "./views/repair.js";
import * as requestView from "./views/request.js";
import * as contactView from "./views/contact.js";
import * as adminView from "./views/admin.js";
import * as searchView from "./views/search.js";
import * as notFoundView from "./views/notFound.js";

const routes = [
  { path: "/", view: homeView, render: "renderHome", mount: "mountHome", titleKey: "seo.home" },
  { path: "/phones", view: phonesView, render: "renderPhones", mount: "mountPhones", titleKey: "seo.phones" },
  { path: "/phones/:slug", view: phoneView, render: "renderPhone", titleKey: "seo.phones" },
  { path: "/screens", view: screensView, render: "renderScreens", mount: "mountScreens", titleKey: "seo.screens" },
  { path: "/parts", view: partsView, render: "renderParts", mount: "mountParts", titleKey: "seo.parts" },
  { path: "/firmware", view: firmwareView, render: "renderFirmware", mount: "mountFirmware", titleKey: "seo.firmware" },
  { path: "/tools", view: toolsView, render: "renderTools", mount: "mountTools", titleKey: "seo.tools" },
  { path: "/faults", view: faultsView, render: "renderFaults", mount: "mountFaults", titleKey: "seo.faults" },
  { path: "/faults/:slug", view: faultsView, render: "renderFault", titleKey: "seo.faults" },
  { path: "/guides", view: guidesView, render: "renderGuides", mount: "mountGuides", titleKey: "seo.guides" },
  { path: "/guides/:slug", view: guidesView, render: "renderArticle", mount: "mountArticle", titleKey: "seo.guides" },
  { path: "/software", view: softwareView, render: "renderSoftware", titleKey: "seo.software" },
  { path: "/programming", view: programmingView, render: "renderProgramming", titleKey: "seo.programming" },
  { path: "/security", view: securityView, render: "renderSecurity", titleKey: "seo.security" },
  { path: "/repair", view: repairView, render: "renderRepair", titleKey: "seo.repair" },
  { path: "/request", view: requestView, render: "renderRequest", mount: "mountRequest", titleKey: "seo.request" },
  { path: "/contact", view: contactView, render: "renderContact", mount: "mountContact", titleKey: "seo.contact" },
  { path: "/admin", view: adminView, render: "renderAdmin", mount: "mountAdmin", titleKey: "seo.admin" },
  { path: "/search", view: searchView, render: "renderSearch", mount: "mountSearch", titleKey: "search.title" },
  { path: "*", view: notFoundView, render: "renderNotFound", titleKey: "error.title" }
];

const navTargets = {
  home: "/", phones: "/phones", screens: "/screens", software: "/software",
  repair: "/repair", security: "/security", guides: "/guides"
};

const megaPaths = ["/parts", "/firmware", "/tools", "/programming", "/faults", "/request", "/contact", "/admin"];

function setupTheme() {
  const stored = storageGet("brxvih.theme");
  const theme = stored === "light" || stored === "dark" ? stored : "dark";
  document.documentElement.dataset.theme = theme;
  qs("#themeBtn")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    storageSet("brxvih.theme", next);
    const meta = document.head.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#070707" : "#f4f4ef");
  });
}

function closeMenus() {
  const mobile = qs("#mobileNav");
  const menuBtn = qs("#menuBtn");
  const mega = qs("#megaMenu");
  const megaBtn = qs("#megaBtn");
  if (mobile) mobile.hidden = true;
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  if (mega) mega.hidden = true;
  if (megaBtn) megaBtn.setAttribute("aria-expanded", "false");
}

function setupHeader() {
  const menuBtn = qs("#menuBtn");
  const mobile = qs("#mobileNav");
  const megaBtn = qs("#megaBtn");
  const mega = qs("#megaMenu");

  menuBtn?.addEventListener("click", () => {
    const open = mobile.hidden;
    closeMenus();
    mobile.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  megaBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = mega.hidden;
    closeMenus();
    mega.hidden = !open;
    megaBtn.setAttribute("aria-expanded", String(open));
  });

  mobile?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenus();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenus();
      closeSearch();
    }
  });
}

function updateActiveNav(path) {
  qsa("[data-nav]").forEach((link) => {
    const target = navTargets[link.dataset.nav];
    const active = target && (target === "/" ? path === "/" : path === target || path.startsWith(`${target}/`));
    link.classList.toggle("is-active", Boolean(active));
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  qs("#megaBtn")?.classList.toggle("is-active", megaPaths.some((target) => path === target || path.startsWith(`${target}/`)));
}

function toast(message, type = "ok") {
  const stack = qs("#toastStack");
  if (!stack) return;
  const element = document.createElement("div");
  element.className = `toast ${type}`;
  element.innerHTML = `${icon(type === "err" ? "alert" : "check", "icon-sm")}<span>${escapeHtml(message)}</span>`;
  stack.append(element);
  setTimeout(() => {
    element.classList.add("leaving");
    setTimeout(() => element.remove(), 220);
  }, 3200);
}

function setupToast() {
  window.addEventListener("brxvih:toast", (event) => toast(event.detail?.message || "", event.detail?.type || "ok"));
  window.addEventListener("brxvih:storage-error", () => toast(t("common.error"), "err"));
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    qsa(".reveal").forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  qsa(".reveal:not(.is-visible)").forEach((element) => observer.observe(element));
}

let searchFocusIndex = -1;

function openSearch() {
  const overlay = qs("#searchOverlay");
  if (!overlay) return;
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  const input = qs("#globalSearchInput");
  setTimeout(() => input?.focus(), 20);
}

function closeSearch() {
  const overlay = qs("#searchOverlay");
  if (!overlay || overlay.hidden) return;
  overlay.hidden = true;
  document.body.style.overflow = "";
  qs("#searchBtn")?.focus();
}

function searchResultHtml(results, query) {
  if (!query) return `<p class="search-hint">${t("search.hint")}</p>`;
  if (!results.length) return `<p class="search-hint">${t("search.noResults")}</p>`;
  const groups = new Map();
  results.forEach((result) => {
    if (!groups.has(result.type)) groups.set(result.type, []);
    groups.get(result.type).push(result);
  });
  return [...groups.entries()].map(([type, items]) => {
    const labelKey = {
      phone: "search.groupPhones", fault: "search.groupFaults", tool: "search.groupTools",
      firmware: "search.groupFirmware", article: "search.groupGuides", price: "search.groupPrices", part: "search.groupParts"
    }[type];
    return `<p class="search-group-label">${t(labelKey || type)}</p>${items.map((item) => `<a class="search-result" href="${escapeHtml(item.href)}" data-search-result>
      <span class="search-result-icon">${icon(item.icon)}</span>
      <span class="search-result-copy"><b>${escapeHtml(item.title)}</b><span>${escapeHtml(item.subtitle)}</span></span>
      <span class="badge badge-accent">${escapeHtml(item.badge)}</span>
    </a>`).join("")}`;
  }).join("");
}

function renderSearchResults(query) {
  const container = qs("#globalSearchResults");
  if (!container) return;
  searchFocusIndex = -1;
  const results = globalSearch(query, { lang: getLang(), limit: 12 });
  container.innerHTML = searchResultHtml(results, query);
  container.querySelectorAll("[data-search-result]").forEach((result) => {
    result.addEventListener("click", closeSearch);
  });
}

function setupSearch() {
  const overlay = qs("#searchOverlay");
  const input = qs("#globalSearchInput");
  const form = qs("#globalSearchForm");
  const results = qs("#globalSearchResults");
  if (!overlay || !input) return;

  qs("#searchBtn")?.addEventListener("click", openSearch);
  qs("#searchClose")?.addEventListener("click", closeSearch);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeSearch();
  });

  const run = debounce(() => renderSearchResults(input.value.trim()), 120);
  input.addEventListener("input", run);
  input.addEventListener("keydown", (event) => {
    const items = qsa("[data-search-result]", results);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      searchFocusIndex = Math.min(items.length - 1, searchFocusIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      searchFocusIndex = Math.max(0, searchFocusIndex - 1);
    } else if (event.key === "Enter" && searchFocusIndex >= 0 && items[searchFocusIndex]) {
      event.preventDefault();
      items[searchFocusIndex].click();
      return;
    }
    items.forEach((item, index) => item.classList.toggle("is-focus", index === searchFocusIndex));
    if (searchFocusIndex >= 0) items[searchFocusIndex]?.scrollIntoView({ block: "nearest" });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    closeSearch();
    window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName;
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(tag) && !document.activeElement?.isContentEditable) {
      event.preventDefault();
      openSearch();
    }
  });
}

function updateLanguageUi() {
  const label = qs("#langLabel");
  if (label) label.textContent = getLang() === "ar" ? "EN" : "ع";
  applyStaticI18n();
  if (!qs("#searchOverlay")?.hidden) renderSearchResults(qs("#globalSearchInput")?.value.trim() || "");
}

function setupLanguage() {
  qs("#langBtn")?.addEventListener("click", () => {
    toggleLang();
    updateLanguageUi();
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

function metaFor(ctx) {
  const route = ctx.route;
  let title = route?.titleKey ? t(route.titleKey) : t("seo.home");
  let desc = route?.titleKey ? t(`${route.titleKey}Desc`) : t("seo.homeDesc");
  if (desc === `${route?.titleKey}Desc`) desc = t("seo.homeDesc");

  if (route?.path === "/phones/:slug") {
    const phone = list("phones").find((item) => item.slug === ctx.params.slug || item.id === ctx.params.slug);
    if (phone) {
      title = `${getLang() === "ar" ? phone.nameAr || phone.name : phone.name} — BRXVIH`;
      desc = phone.summaryAr || phone.summaryEn || desc;
    }
  }
  if (route?.path === "/faults/:slug") {
    const fault = list("faults").find((item) => item.id === ctx.params.slug);
    if (fault) {
      title = `${getLang() === "ar" ? fault.titleAr : fault.titleEn} — BRXVIH`;
      desc = getLang() === "ar" ? fault.summaryAr : fault.summaryEn;
    }
  }
  if (route?.path === "/guides/:slug") {
    const article = list("articles").find((item) => item.id === ctx.params.slug || item.slug === ctx.params.slug);
    if (article) {
      title = `${getLang() === "ar" ? article.titleAr : article.titleEn} — BRXVIH`;
      desc = getLang() === "ar" ? article.excerptAr : article.excerptEn;
    }
  }
  if (route?.path === "/search") {
    const q = ctx.query.get("q");
    title = q ? `${q} — ${t("search.title")} | BRXVIH` : `${t("search.title")} | BRXVIH`;
    desc = t("search.hint");
  }
  return { title, desc };
}

function renderRoute(ctx) {
  const main = qs("#main");
  if (!main) return;
  closeMenus();
  updateActiveNav(ctx.path);
  const { title, desc } = metaFor(ctx);
  document.title = title;
  setMeta("description", desc);
  setMeta("og:title", title, "property");
  setMeta("og:description", desc, "property");
  setMeta("twitter:title", title);
  setMeta("twitter:description", desc);

  let html = "";
  try {
    html = ctx.route?.view?.[ctx.route.render]?.(ctx) || "";
  } catch (error) {
    console.error(error);
    html = `<section class="section"><div class="container"><div class="notice danger">${icon("alert")}<div>${escapeHtml(t("common.error"))}</div></div></div></section>`;
  }
  main.innerHTML = html;
  if (ctx.route?.view?.[ctx.route.mount]) {
    try {
      ctx.route.view[ctx.route.mount](main, ctx);
    } catch (error) {
      console.error(error);
    }
  }
  setupReveal();
  scrollToTop("auto");
}

function boot() {
  initI18n();
  try {
    loadDB();
  } catch (error) {
    console.error(error);
  }
  setupTheme();
  setupHeader();
  setupToast();
  setupSearch();
  setupLanguage();
  updateLanguageUi();
  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  startRouter({ routes, onRoute: renderRoute });
  const initial = parseHash();
  if (initial.path === "/" && !initial.query.toString()) {
    updateActiveNav("/");
  }
}

boot();
