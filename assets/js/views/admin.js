import { t, getLang } from "../i18n.js";
import {
  list, get, upsert, remove, resetAll, exportAll, importAll,
  exportBackupFile, exportCsv, isAdmin, login, logout, changePasscode,
  counts, updateRequestStatus, getSettings, saveSettings, COLLECTIONS
} from "../db.js";
import {
  escapeHtml, icon, formatNumber, formatDate, slugify, readFileAsText,
  humanSize, safeUrl
} from "../utils.js";
import { pageHead, badge, statusBadge, statusLabel, qualityBadge, emptyState, notice, btn } from "../components.js";
import { listMedia, saveMedia, deleteMedia } from "../media.js";
import { siteConfig, currencies } from "../data/index.js";

const collectionIcons = {
  phones: "smartphone", prices: "screen", parts: "package", suppliers: "truck",
  faults: "alert", tools: "tools", firmware: "download", articles: "book", requests: "message"
};

const tabs = [
  { id: "dashboard", icon: "grid" },
  ...COLLECTIONS.map((id) => ({ id, icon: collectionIcons[id] || "database" })),
  { id: "settings", icon: "settings" },
  { id: "backup", icon: "save" },
  { id: "media", icon: "camera" }
];

function notify(message, type = "ok") {
  window.dispatchEvent(new CustomEvent("brxvih:toast", { detail: { message, type } }));
}

function refresh() {
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

function loginView() {
  return `<section class="section-tight"><div class="container"><div class="admin-login">
    <div class="card admin-login-card">
      <div class="admin-lock">${icon("lock", "icon-lg")}</div>
      <h1>${t("admin.loginTitle")}</h1>
      <p>${t("admin.loginDesc")}</p>
      <form data-admin-login>
        <div class="form-field">
          <label for="admin-passcode">${t("admin.passcode")}</label>
          <input class="input" id="admin-passcode" name="passcode" type="password" required autocomplete="current-password" autofocus>
        </div>
        <div class="form-status" data-login-status role="status"></div>
        <button class="btn btn-primary btn-block" type="submit" style="margin-block-start:14px">${icon("lock", "icon-xs")}<span>${t("admin.login")}</span></button>
      </form>
      <p class="form-note" style="margin-block-start:14px">${t("admin.loginDesc")}</p>
    </div>
  </div></div></section>`;
}

function sidebar(tab) {
  return `<aside class="admin-side">
    <div class="admin-user">
      <span class="avatar">YH</span>
      <div><b>BRXVIH</b><span>${t("admin.title")}</span></div>
    </div>
    <nav class="admin-nav" aria-label="${t("admin.title")}">
      ${tabs.map((item) => `<button type="button" class="${tab === item.id ? "is-active" : ""}" data-admin-tab="${item.id}">
        ${icon(item.icon, "icon-xs")}
        <span>${escapeHtml(item.id === "dashboard" || ["settings", "backup", "media"].includes(item.id) ? t(`admin.${item.id === "dashboard" ? "dashboard" : item.id}`) : t(`admin.collection.${item.id}`))}</span>
        ${COLLECTIONS.includes(item.id) ? `<span class="count">${formatNumber(list(item.id), getLang())}</span>` : ""}
      </button>`).join("")}
    </nav>
    <button class="btn btn-outline btn-sm" type="button" data-admin-logout>${icon("log-out", "icon-xs")}<span>${t("admin.logout")}</span></button>
  </aside>`;
}

function dashboard() {
  const dataCounts = counts();
  const requests = list("requests").slice(0, 5);
  return `<div class="admin-head">
    <div><h1>${t("admin.dashboard")}</h1><p>${t("admin.loginDesc")}</p></div>
    <div class="admin-toolbar">
      <button class="btn btn-primary btn-sm" type="button" data-admin-tab="phones">${icon("plus", "icon-xs")}<span>${t("admin.addRecord")}</span></button>
      <button class="btn btn-outline btn-sm" type="button" data-admin-tab="backup">${icon("save", "icon-xs")}<span>${t("admin.backup")}</span></button>
    </div>
  </div>
  <div class="admin-stats">
    <div class="admin-stat">${icon("smartphone")}<strong>${formatNumber(dataCounts.phones, getLang())}</strong><span>${t("admin.collection.phones")}</span></div>
    <div class="admin-stat">${icon("screen")}<strong>${formatNumber(dataCounts.prices, getLang())}</strong><span>${t("admin.collection.prices")}</span></div>
    <div class="admin-stat">${icon("message")}<strong>${formatNumber(dataCounts.requests, getLang())}</strong><span>${t("admin.collection.requests")}</span></div>
    <div class="admin-stat">${icon("book")}<strong>${formatNumber(dataCounts.articles, getLang())}</strong><span>${t("admin.collection.articles")}</span></div>
  </div>
  <div class="admin-panel">
    <div class="admin-panel-head"><h2>${t("admin.collection.requests")}</h2><button class="btn btn-ghost btn-sm" type="button" data-admin-tab="requests">${t("common.viewAll")}</button></div>
    <div class="admin-panel-body">
      ${requests.length ? `<div class="admin-list">${requests.map((request) => `<div class="admin-row">
        <span class="avatar" style="width:32px;height:32px;border-radius:50%;background:var(--accent-soft);color:var(--accent-text);display:grid;place-items:center;font-size:10px">${escapeHtml(String(request.name || "?").charAt(0))}</span>
        <div><b>${escapeHtml(request.name)}</b><span>${escapeHtml(request.model || request.fault)} · ${escapeHtml(formatDate(request.createdAt, getLang()))}</span></div>
        ${statusBadge(request.status)}
      </div>`).join("")}</div>` : `<p class="muted">${t("admin.noRequests")}</p>`}
    </div>
  </div>
  <div class="grid grid-3">
    ${COLLECTIONS.slice(0, 6).map((collection) => `<button class="card card-pad card-hover" type="button" data-admin-tab="${collection}" style="text-align:start">
      <span class="firmware-icon">${icon(collectionIcons[collection] || "database")}</span>
      <h3 style="margin-block:12px 4px;font-size:16px">${t(`admin.collection.${collection}`)}</h3>
      <p class="muted" style="font-size:12px">${t("admin.records", { count: dataCounts[collection] })}</p>
    </button>`).join("")}
  </div>`;
}

function recordTitle(collection, record) {
  const lang = getLang();
  if (collection === "phones") return lang === "ar" ? record.nameAr || record.name : record.name;
  if (collection === "prices") return `${record.phoneName || "—"} — ${record.quality || ""}`;
  if (collection === "parts") return lang === "ar" ? record.nameAr || record.nameEn : record.nameEn || record.nameAr;
  if (collection === "suppliers") return lang === "ar" ? record.nameAr || record.name : record.nameEn || record.name;
  if (collection === "faults") return lang === "ar" ? record.titleAr || record.titleEn : record.titleEn || record.titleAr;
  if (collection === "tools") return record.name;
  if (collection === "firmware") return record.phoneName || record.name;
  if (collection === "articles") return lang === "ar" ? record.titleAr || record.titleEn : record.titleEn || record.titleAr;
  if (collection === "requests") return record.name;
  return record.name || record.title || record.id;
}

function recordSub(collection, record) {
  if (collection === "phones") return `${record.brand || ""} · ${record.model || ""}`;
  if (collection === "prices") return `${record.supplierName || ""} · ${record.city || ""}`;
  if (collection === "parts") return `${record.partType || ""} · ${record.availability || ""}`;
  if (collection === "suppliers") return `${record.city || ""} · ${record.type || ""}`;
  if (collection === "faults") return `${record.category || ""} · ${record.difficulty || ""}/5`;
  if (collection === "tools") return `${record.category || ""} · ${record.platform || ""}`;
  if (collection === "firmware") return `${record.brand || ""} · ${record.model || ""}`;
  if (collection === "articles") return `${record.category || ""} · ${formatDate(record.date, getLang())}`;
  if (collection === "requests") return `${record.phone || ""} · ${formatDate(record.createdAt, getLang())}`;
  return record.id;
}

function recordExtra(collection, record) {
  if (collection === "prices") return `${record.currency || ""} ${record.price ?? "—"}`;
  if (collection === "phones") return String(record.year || "");
  if (collection === "faults") return record.urgent ? badge("Urgent", "danger") : badge(record.category || "", "blue");
  if (collection === "tools") return badge(record.price || record.license || "", "blue");
  if (collection === "requests") return statusBadge(record.status);
  return record.verified === false ? badge(t("common.unverified"), "warning") : badge(t("common.verified"), "success");
}

function collectionPanel(collection) {
  const items = list(collection);
  const lang = getLang();
  return `<div class="admin-head">
    <div><h1>${t(`admin.collection.${collection}`)}</h1><p>${t("admin.records", { count: items.length })}</p></div>
    <div class="admin-toolbar">
      <button class="btn btn-primary btn-sm" type="button" data-add-record="${collection}">${icon("plus", "icon-xs")}<span>${t("admin.addRecord")}</span></button>
      <button class="btn btn-outline btn-sm" type="button" data-export-csv="${collection}">${icon("download", "icon-xs")}<span>${t("admin.exportCsv")}</span></button>
    </div>
  </div>
  <div class="admin-panel">
    <div class="admin-panel-head">
      <label class="filter-search" style="max-width:320px">${icon("search")}<input type="search" data-record-search placeholder="${t("admin.searchRecords")}"></label>
      <span class="filter-count">${t("admin.records", { count: items.length })}</span>
    </div>
    ${items.length ? `<div class="admin-table-wrap"><table class="admin-table">
      <thead><tr><th>ID</th><th>${t("common.name")}</th><th>${t("common.details")}</th><th>${t("common.status")}</th><th></th></tr></thead>
      <tbody>${items.map((record) => `<tr data-record-row data-search-text="${escapeHtml(`${record.id} ${recordTitle(collection, record)} ${recordSub(collection, record)}`)}">
        <td><span class="mono" style="font-size:9px">${escapeHtml(record.id)}</span></td>
        <td><span class="cell-title">${escapeHtml(recordTitle(collection, record))}</span><span class="cell-sub">${escapeHtml(recordSub(collection, record))}</span></td>
        <td>${recordExtra(collection, record)}</td>
        <td>${collection === "requests" ? `<select class="select" style="height:32px;font-size:10px" data-request-status="${escapeHtml(record.id)}">
          ${["new", "review", "contacted", "completed", "cancelled"].map((status) => `<option value="${status}"${record.status === status ? " selected" : ""}>${escapeHtml(statusLabel(status))}</option>`).join("")}
        </select>` : (record.verified === false ? badge(t("common.unverified"), "warning") : badge(t("common.verified"), "success"))}</td>
        <td class="table-actions">
          <button class="icon-btn" type="button" data-edit-record="${collection}" data-record-id="${escapeHtml(record.id)}" aria-label="${t("common.edit")}">${icon("edit", "icon-sm")}</button>
          <button class="icon-btn" type="button" data-delete-record="${collection}" data-record-id="${escapeHtml(record.id)}" aria-label="${t("common.delete")}">${icon("trash", "icon-sm")}</button>
        </td>
      </tr>`).join("")}</tbody>
    </table></div>` : `<div class="admin-panel-body">${emptyState({ iconName: collectionIcons[collection] || "database", title: t("admin.noData"), action: `<button class="btn btn-primary btn-sm" type="button" data-add-record="${collection}">${t("admin.addRecord")}</button>` })}</div>`}
  </div>`;
}

function settingsPanel() {
  const settings = getSettings();
  const config = { ...siteConfig, ...(settings.siteConfig || {}) };
  const rates = { ...(settings.exchange?.rates || {}) };
  return `<div class="admin-head"><div><h1>${t("admin.settings")}</h1><p>${t("admin.exchangeNote")}</p></div></div>
  <form class="admin-panel" data-admin-settings>
    <div class="admin-panel-head"><h2>${t("admin.settings")}</h2></div>
    <div class="admin-panel-body">
      <div class="form-grid">
        <div class="form-field"><label>${t("common.name")}</label><input class="input" name="brand" value="${escapeHtml(config.brand || "")}"></div>
        <div class="form-field"><label>${t("admin.title")}</label><input class="input" name="displayName" value="${escapeHtml(config.displayName || "")}"></div>
        <div class="form-field"><label>${t("common.phone")}</label><input class="input" name="phone" value="${escapeHtml(config.phone || "")}" dir="ltr"></div>
        <div class="form-field"><label>WhatsApp</label><input class="input" name="whatsapp" value="${escapeHtml(config.whatsapp || "")}" dir="ltr"></div>
        <div class="form-field"><label>${t("contact.location")}</label><input class="input" name="location" value="${escapeHtml(config.location || "")}"></div>
        <div class="form-field"><label>URL</label><input class="input" name="siteUrl" value="${escapeHtml(config.siteUrl || "")}" dir="ltr"></div>
        <div class="form-field"><label>YER / USD</label><input class="input" name="yer" type="number" step="0.01" value="${escapeHtml(rates.YER || "")}"></div>
        <div class="form-field"><label>SAR / USD</label><input class="input" name="sar" type="number" step="0.01" value="${escapeHtml(rates.SAR || "")}"></div>
        <div class="form-field full"><label>${t("admin.exchangeNote")}</label><textarea class="textarea" name="exchangeNote" rows="3">${escapeHtml(settings.exchange?.noteAr || "")}</textarea></div>
      </div>
      <div class="form-status" data-settings-status role="status"></div>
      <div class="row" style="margin-block-start:16px"><button class="btn btn-primary" type="submit">${icon("save", "icon-xs")}<span>${t("common.save")}</span></button></div>
    </div>
  </form>
  <form class="admin-panel" data-passcode-form>
    <div class="admin-panel-head"><h2>${t("admin.passcodeChange")}</h2></div>
    <div class="admin-panel-body">
      <div class="form-grid">
        <div class="form-field"><label>${t("admin.currentPasscode")}</label><input class="input" name="current" type="password" autocomplete="current-password" required></div>
        <div class="form-field"><label>${t("admin.newPasscode")}</label><input class="input" name="next" type="password" autocomplete="new-password" required minlength="8"></div>
      </div>
      <div class="form-status" data-passcode-status role="status"></div>
      <div class="row" style="margin-block-start:16px"><button class="btn btn-outline" type="submit">${icon("lock", "icon-xs")}<span>${t("admin.passcodeChange")}</span></button></div>
    </div>
  </form>`;
}

function backupPanel() {
  const data = exportAll();
  return `<div class="admin-head"><div><h1>${t("admin.backup")}</h1><p>${t("admin.exchangeNote")}</p></div></div>
  <div class="admin-panel">
    <div class="admin-panel-head"><h2>JSON</h2></div>
    <div class="admin-panel-body">
      <p class="muted" style="font-size:12px">${t("admin.mediaNote")}</p>
      <div class="row" style="margin-block-start:14px">
        <button class="btn btn-primary btn-sm" type="button" data-export-all>${icon("download", "icon-xs")}<span>${t("admin.exportAll")}</span></button>
        <button class="btn btn-outline btn-sm" type="button" data-import-all>${icon("upload", "icon-xs")}<span>${t("admin.importAll")}</span></button>
        <button class="btn btn-danger btn-sm" type="button" data-reset-all>${icon("trash", "icon-xs")}<span>${t("admin.reset")}</span></button>
        <input type="file" accept="application/json,.json" data-import-file hidden>
      </div>
      <div class="divider"></div>
      <div class="grid grid-2">
        <div class="request-summary">${Object.entries(data.collections).map(([name, items]) => `<div class="kv"><span>${t(`admin.collection.${name}`)}</span><b>${items.length}</b></div>`).join("")}</div>
        <div class="admin-list">
          ${COLLECTIONS.map((collection) => `<div class="admin-row"><b>${t(`admin.collection.${collection}`)}</b><span>${t("admin.records", { count: list(collection).length })}</span><button class="icon-btn" type="button" data-export-csv="${collection}" aria-label="${t("admin.exportCsv")}">${icon("download", "icon-sm")}</button></div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;
}

function mediaPanel() {
  return `<div class="admin-head"><div><h1>${t("admin.media")}</h1><p>${t("admin.mediaNote")}</p></div></div>
  <div class="admin-panel">
    <div class="admin-panel-head"><h2>${t("admin.mediaUpload")}</h2><span class="badge badge-blue">IndexedDB</span></div>
    <div class="admin-panel-body">
      ${notice(t("admin.mediaNote"), "info", "database")}
      <label class="admin-drop" style="display:block;margin-block-start:14px;cursor:pointer">
        ${icon("upload", "icon-lg")}
        <span>${t("admin.mediaUpload")}</span>
        <input type="file" accept="image/*" data-media-upload multiple hidden>
      </label>
      <div class="grid grid-3" data-media-list style="margin-block-start:16px"></div>
    </div>
  </div>`;
}

export function renderAdmin(ctx) {
  if (!isAdmin()) return loginView();
  const tab = ctx.query.get("tab") || "dashboard";
  const activeTab = tabs.some((item) => item.id === tab) ? tab : "dashboard";
  let main;
  if (activeTab === "dashboard") main = dashboard();
  else if (activeTab === "settings") main = settingsPanel();
  else if (activeTab === "backup") main = backupPanel();
  else if (activeTab === "media") main = mediaPanel();
  else main = collectionPanel(activeTab);
  return `<section class="section-tight"><div class="container admin-shell">
    ${sidebar(activeTab)}
    <div class="admin-main">${main}</div>
  </div></section>`;
}

function templateFor(collection) {
  const templates = {
    phones: {
      name: "", nameAr: "", brand: "samsung", series: "", model: "", codename: "",
      year: new Date().getFullYear(), chipset: "", display: "", resolution: "", battery: "",
      memory: "", storage: "", os: "", software: "", issueIds: [], partTypes: [], romSourceIds: [],
      toolIds: [], sources: [], verified: false, featured: false, notes: ""
    },
    prices: {
      phoneSlug: "", phoneName: "", brand: "", partType: "screen", quality: "commercial",
      price: null, currency: "USD", city: "اليمن", country: "اليمن", supplierId: "brxvih",
      supplierName: "BRXVIH", sourceUrl: "", availability: "", installPrice: null,
      reference: false, verified: false, updatedAt: new Date().toISOString().slice(0, 10),
      notesAr: "", notesEn: ""
    },
    parts: {
      partType: "", nameAr: "", nameEn: "", descAr: "", descEn: "", icon: "package",
      qualityOptions: [], compatibilityAr: "", compatibilityEn: "", price: null, currency: null,
      availability: "", supplierId: "brxvih", priceVerified: false, verified: false, notesAr: "", notesEn: ""
    },
    suppliers: {
      name: "", nameAr: "", nameEn: "", type: "service", city: "", country: "اليمن",
      phone: "", whatsapp: "", url: "", verified: false, noteAr: "", noteEn: ""
    },
    faults: {
      titleAr: "", titleEn: "", icon: "alert", category: "hardware", difficulty: 2, urgent: false,
      summaryAr: "", summaryEn: "", symptoms: [], causes: [], stepsAr: [], stepsEn: [],
      dont: [], tools: [], relatedParts: [], safety: ""
    },
    tools: {
      name: "", category: "flashing", platform: "Windows", purposeAr: "", purposeEn: "",
      license: "official", price: "", url: "", warningAr: "", brandIds: [], verified: false
    },
    firmware: {
      phoneSlug: "", phoneName: "", brand: "", model: "", version: "", region: "",
      size: "", type: "Firmware", sourceId: "", sourceUrl: "", updatedAt: new Date().toISOString().slice(0, 10),
      verified: false, notes: ""
    },
    articles: {
      titleAr: "", titleEn: "", excerptAr: "", excerptEn: "", category: "repair", icon: "book",
      date: new Date().toISOString().slice(0, 10), readTime: 5, featured: false, tags: [],
      bodyAr: "", bodyEn: "", sources: []
    },
    requests: {
      name: "", phone: "", brand: "", model: "", fault: "", city: "", notes: "",
      status: "new", source: "manual"
    }
  };
  return { ...(templates[collection] || { name: "" }) };
}

function editorField(key, value, isNew) {
  const kind = Array.isArray(value) || (value && typeof value === "object") ? "json" : typeof value;
  const label = escapeHtml(key);
  if (kind === "boolean") {
    return `<label class="check-row" style="padding:8px 0"><input type="checkbox" name="${escapeHtml(key)}" data-kind="boolean"${value ? " checked" : ""}> <span>${label}</span></label>`;
  }
  if (kind === "json") {
    return `<div class="form-field full"><label>${label}</label><textarea class="textarea" name="${escapeHtml(key)}" data-kind="json" rows="4" dir="ltr">${escapeHtml(JSON.stringify(value, null, 2))}</textarea></div>`;
  }
  if (kind === "number") {
    return `<div class="form-field"><label>${label}</label><input class="input" type="number" step="any" name="${escapeHtml(key)}" data-kind="number" value="${escapeHtml(value ?? "")}"></div>`;
  }
  const long = String(value || "").length > 90 || String(value || "").includes("\n");
  return `<div class="form-field${long ? " full" : ""}"><label>${label}</label>${long
    ? `<textarea class="textarea" name="${escapeHtml(key)}" data-kind="string" rows="4">${escapeHtml(value || "")}</textarea>`
    : `<input class="input" name="${escapeHtml(key)}" data-kind="string" value="${escapeHtml(value || "")}"${key === "id" && !isNew ? " readonly" : ""}>`}</div>`;
}

function openEditor(collection, record, isNew) {
  const base = record || templateFor(collection);
  const keys = Object.keys(base).filter((key) => !["updatedAt", "createdAt"].includes(key));
  const title = isNew ? t("admin.addRecord") : t("admin.editRecord");
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
    <div class="modal-head"><h2>${escapeHtml(title)} — ${escapeHtml(t(`admin.collection.${collection}`))}</h2><button class="icon-btn" type="button" data-close-modal aria-label="${t("common.close")}">${icon("x", "icon-sm")}</button></div>
    <form data-record-form>
      <div class="modal-body"><div class="form-grid">${keys.map((key) => editorField(key, base[key], isNew)).join("")}</div></div>
      <div class="modal-foot"><button class="btn btn-ghost" type="button" data-close-modal>${t("common.cancel")}</button><button class="btn btn-primary" type="submit">${icon("save", "icon-xs")}<span>${t("common.save")}</span></button></div>
    </form>
  </div>`;
  document.body.append(overlay);
  const close = () => overlay.remove();
  overlay.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", close));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  overlay.querySelector("[data-record-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const next = {};
    overlay.querySelectorAll("[data-kind]").forEach((input) => {
      const kind = input.dataset.kind;
      const key = input.name;
      try {
        if (kind === "json") next[key] = JSON.parse(input.value || "null");
        else if (kind === "boolean") next[key] = input.checked;
        else if (kind === "number") next[key] = input.value === "" ? null : Number(input.value);
        else next[key] = input.value;
      } catch {
        next[key] = input.value;
      }
    });
    if (collection === "phones") {
      if (!next.slug) next.slug = `${next.brand || "phone"}-${slugify(next.name || next.nameAr || "model")}`;
      if (!next.id) next.id = next.slug;
    }
    if (collection === "requests" && !next.id) next.id = `req-${Date.now().toString(36)}`;
    upsert(collection, next);
    close();
    notify(t("admin.saved"));
    refresh();
  });
}

async function renderMediaList(container) {
  const records = await listMedia();
  if (!records.length) {
    container.innerHTML = `<p class="muted" style="grid-column:1/-1">${t("admin.noData")}</p>`;
    return;
  }
  container.innerHTML = records.map((record) => `<div class="card" style="overflow:hidden">
    <img src="${escapeHtml(record.dataUrl)}" alt="${escapeHtml(record.name)}" style="width:100%;height:150px;object-fit:cover;border-block-end:1px solid var(--line)">
    <div class="card-pad" style="padding:12px">
      <b style="font-size:12px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(record.name)}</b>
      <span class="mono" style="font-size:9px;color:var(--muted)">${escapeHtml(humanSize(record.size))} · ${escapeHtml(formatDate(record.createdAt, getLang()))}</span>
      <div class="row" style="margin-block-start:8px">
        <button class="btn btn-danger btn-sm" type="button" data-media-delete="${escapeHtml(record.id)}">${icon("trash", "icon-xs")}<span>${t("common.delete")}</span></button>
      </div>
    </div>
  </div>`).join("");
  container.querySelectorAll("[data-media-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm(t("admin.deleteConfirm"))) return;
      await deleteMedia(button.dataset.mediaDelete);
      notify(t("admin.deleted"));
      renderMediaList(container);
    });
  });
}

export function mountAdmin(root, ctx) {
  const loginForm = root.querySelector("[data-admin-login]");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = loginForm.querySelector("[data-login-status]");
      const passcode = new FormData(loginForm).get("passcode")?.toString() || "";
      const ok = await login(passcode);
      if (!ok) {
        status.className = "form-status is-visible err";
        status.textContent = t("admin.wrong");
        return;
      }
      refresh();
    });
    return;
  }

  root.querySelector("[data-admin-logout]")?.addEventListener("click", () => {
    logout();
    window.location.hash = "#/admin";
    refresh();
  });

  root.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.hash = `#/admin?tab=${encodeURIComponent(button.dataset.adminTab)}`;
    });
  });

  const search = root.querySelector("[data-record-search]");
  search?.addEventListener("input", () => {
    const value = search.value.trim().toLowerCase();
    root.querySelectorAll("[data-record-row]").forEach((row) => {
      row.style.display = row.dataset.searchText.toLowerCase().includes(value) ? "" : "none";
    });
  });

  root.querySelectorAll("[data-add-record]").forEach((button) => {
    button.addEventListener("click", () => openEditor(button.dataset.addRecord, null, true));
  });

  root.querySelectorAll("[data-edit-record]").forEach((button) => {
    button.addEventListener("click", () => {
      const collection = button.dataset.editRecord;
      const record = get(collection, button.dataset.recordId);
      if (record) openEditor(collection, record, false);
    });
  });

  root.querySelectorAll("[data-delete-record]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm(t("admin.deleteConfirm"))) return;
      remove(button.dataset.deleteRecord, button.dataset.recordId);
      notify(t("admin.deleted"));
      refresh();
    });
  });

  root.querySelectorAll("[data-request-status]").forEach((select) => {
    select.addEventListener("change", () => {
      updateRequestStatus(select.dataset.requestStatus, select.value);
      notify(t("admin.saved"));
      refresh();
    });
  });

  root.querySelectorAll("[data-export-csv]").forEach((button) => {
    button.addEventListener("click", () => {
      if (exportCsv(button.dataset.exportCsv)) notify(t("common.download"));
      else notify(t("admin.noData"), "err");
    });
  });

  const settingsForm = root.querySelector("[data-admin-settings]");
  settingsForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(settingsForm);
    const status = settingsForm.querySelector("[data-settings-status]");
    saveSettings({
      siteConfig: {
        brand: data.get("brand")?.toString(),
        displayName: data.get("displayName")?.toString(),
        phone: data.get("phone")?.toString(),
        whatsapp: data.get("whatsapp")?.toString(),
        location: data.get("location")?.toString(),
        siteUrl: data.get("siteUrl")?.toString()
      },
      exchange: {
        rates: {
          ...getSettings().exchange?.rates,
          YER: Number(data.get("yer")) || 0,
          SAR: Number(data.get("sar")) || 0
        },
        noteAr: data.get("exchangeNote")?.toString()
      }
    });
    status.className = "form-status is-visible ok";
    status.textContent = t("admin.saved");
    notify(t("admin.saved"));
  });

  const passcodeForm = root.querySelector("[data-passcode-form]");
  passcodeForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(passcodeForm);
    const status = passcodeForm.querySelector("[data-passcode-status]");
    const result = await changePasscode(data.get("current")?.toString(), data.get("next")?.toString());
    status.className = `form-status is-visible ${result.ok ? "ok" : "err"}`;
    status.textContent = result.ok ? t("admin.passcodeChanged") : t("admin.wrong");
    if (result.ok) passcodeForm.reset();
  });

  root.querySelector("[data-export-all]")?.addEventListener("click", () => {
    exportBackupFile();
    notify(t("common.download"));
  });

  const importButton = root.querySelector("[data-import-all]");
  const importFile = root.querySelector("[data-import-file]");
  importButton?.addEventListener("click", () => importFile?.click());
  importFile?.addEventListener("change", async () => {
    const file = importFile.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await readFileAsText(file));
      if (!importAll(payload)) throw new Error("invalid");
      notify(t("admin.imported"));
      refresh();
    } catch {
      notify(t("admin.importError"), "err");
    }
  });

  root.querySelector("[data-reset-all]")?.addEventListener("click", () => {
    if (!confirm(t("admin.resetConfirm"))) return;
    resetAll();
    notify(t("admin.deleted"));
    refresh();
  });

  const mediaInput = root.querySelector("[data-media-upload]");
  const mediaList = root.querySelector("[data-media-list]");
  if (mediaList) renderMediaList(mediaList);
  mediaInput?.addEventListener("change", async () => {
    const files = [...(mediaInput.files || [])];
    for (const file of files) {
      try {
        await saveMedia(file);
      } catch {
        notify(t("common.error"), "err");
      }
    }
    mediaInput.value = "";
    if (mediaList) renderMediaList(mediaList);
    notify(t("admin.saved"));
  });
}
