import { t, getLang, brandLabel } from "../i18n.js";
import { list, addRequest } from "../db.js";
import { escapeHtml, icon, whatsappLink, isValidPhone } from "../utils.js";
import { pageHead, notice, requestSummary, badge } from "../components.js";
import { brands, cities } from "../data/index.js";

function brandOptions(selected) {
  return `<option value="">${t("common.optional")}</option>${brands.map((brand) => `<option value="${brand.id}"${brand.id === selected ? " selected" : ""}>${escapeHtml(brandLabel(brand))}</option>`).join("")}`;
}

function cityOptions(selected) {
  return `<option value="">${t("common.optional")}</option>${cities.map((city) => `<option value="${escapeHtml(city)}"${city === selected ? " selected" : ""}>${escapeHtml(city)}</option>`).join("")}`;
}

function faultOptions(selected) {
  const lang = getLang();
  return `<option value="">${t("common.optional")}</option>${list("faults").map((fault) => {
    const label = lang === "ar" ? fault.titleAr : fault.titleEn;
    return `<option value="${escapeHtml(fault.id)}"${fault.id === selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("")}`;
}

export function renderRequest(ctx) {
  const query = ctx.query;
  const selectedBrand = query.get("brand") || "";
  const selectedFault = query.get("fault") || "";
  const selectedModel = query.get("model") || "";
  const part = query.get("part") || "";
  const initial = {
    name: "",
    phone: "",
    brand: selectedBrand,
    model: selectedModel,
    fault: selectedFault,
    city: "",
    faultText: part ? `استفسار عن قطعة: ${part}` : "",
    notes: ""
  };

  return `${pageHead({
    eyebrow: "BRXVIH / REQUEST",
    title: t("request.title"),
    desc: t("request.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.request") }],
    meta: `<span class="badge badge-accent">${t("common.diagnosis")}</span>`
  })}
  <section class="section-tight"><div class="container contact-grid">
    <div class="contact-card card">
      <h2 style="font-size:20px">${t("request.summary")}</h2>
      <div data-request-summary>${requestSummary(initial)}</div>
      <div class="divider"></div>
      ${notice(t("request.whatsappNote"), "info", "info")}
      <div class="contact-item">${icon("whatsapp")}<div><b>${t("contact.whatsapp")}</b><a href="${whatsappLink(t("whatsapp.message"))}" target="_blank" rel="noopener">+967 777 066 424</a></div></div>
      <div class="contact-item">${icon("clock")}<div><b>${t("contact.hours")}</b><span>${t("contact.hoursValue")}</span></div></div>
    </div>
    <form class="card card-pad" data-request-form novalidate>
      <div class="form-grid">
        <div class="form-field">
          <label for="req-name">${t("request.name")} <span class="req">*</span></label>
          <input class="input" id="req-name" name="name" value="${escapeHtml(initial.name)}" placeholder="${t("request.name")}" required autocomplete="name">
        </div>
        <div class="form-field">
          <label for="req-phone">${t("request.phone")} <span class="req">*</span></label>
          <input class="input" id="req-phone" name="phone" value="${escapeHtml(initial.phone)}" placeholder="+967 7XX XXX XXX" required inputmode="tel" autocomplete="tel" dir="ltr">
        </div>
        <div class="form-field">
          <label for="req-brand">${t("request.brand")}</label>
          <select id="req-brand" name="brand">${brandOptions(initial.brand)}</select>
        </div>
        <div class="form-field">
          <label for="req-model">${t("request.model")}</label>
          <input class="input" id="req-model" name="model" value="${escapeHtml(initial.model)}" placeholder="Galaxy S24 Ultra / SM-S928B">
        </div>
        <div class="form-field">
          <label for="req-fault">${t("request.fault")} <span class="req">*</span></label>
          <select id="req-fault" name="fault">${faultOptions(initial.fault)}</select>
        </div>
        <div class="form-field">
          <label for="req-city">${t("request.city")}</label>
          <select id="req-city" name="city">${cityOptions(initial.city)}</select>
        </div>
        <div class="form-field full">
          <label for="req-fault-text">${t("request.faultPlaceholder")} <span class="req">*</span></label>
          <textarea class="textarea" id="req-fault-text" name="faultText" placeholder="${t("request.faultPlaceholder")}" required>${escapeHtml(initial.faultText)}</textarea>
        </div>
        <div class="form-field full">
          <label for="req-notes">${t("request.notes")}</label>
          <textarea class="textarea" id="req-notes" name="notes" placeholder="${t("common.optional")}">${escapeHtml(initial.notes)}</textarea>
        </div>
        <div class="form-field full">
          <label class="check-row"><input type="checkbox" name="consent" required> <span>${t("request.consent")}</span></label>
        </div>
      </div>
      <div class="form-status" data-form-status role="status"></div>
      <div class="row" style="margin-block-start:18px">
        <button class="btn btn-primary" type="submit">${icon("whatsapp", "icon-xs")}<span>${t("request.submit")}</span></button>
        <a class="btn btn-ghost" href="#/contact">${t("nav.contact")}</a>
      </div>
      <p class="form-note" style="margin-block-start:10px">${t("contact.note")}</p>
    </form>
  </div></section>`;
}

function readForm(form) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    brand: String(data.get("brand") || ""),
    model: String(data.get("model") || "").trim(),
    fault: String(data.get("fault") || ""),
    faultText: String(data.get("faultText") || "").trim(),
    city: String(data.get("city") || ""),
    notes: String(data.get("notes") || "").trim()
  };
}

function updateSummary(root, data) {
  const target = root.querySelector("[data-request-summary]");
  if (!target) return;
  const fault = list("faults").find((item) => item.id === data.fault);
  const lang = getLang();
  target.innerHTML = requestSummary({
    name: data.name,
    phone: data.phone,
    brand: data.brand ? brandLabel(brands.find((brand) => brand.id === data.brand) || { id: data.brand }) : "",
    model: data.model,
    city: data.city,
    fault: fault ? (lang === "ar" ? fault.titleAr : fault.titleEn) : data.faultText
  });
}

export function mountRequest(root) {
  const form = root.querySelector("[data-request-form]");
  if (!form) return;
  const status = form.querySelector("[data-form-status]");
  const refresh = () => updateSummary(root, readForm(form));
  form.addEventListener("input", refresh);
  form.addEventListener("change", refresh);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = readForm(form);
    const consent = form.querySelector("[name=consent]")?.checked;
    if (!data.name || !data.phone || !data.faultText || !isValidPhone(data.phone) || !consent) {
      status.className = "form-status is-visible err";
      status.textContent = t("request.error");
      return;
    }
    const fault = list("faults").find((item) => item.id === data.fault);
    const lang = getLang();
    const message = [
      "BRXVIH — طلب صيانة / Repair request",
      `${t("common.name")}: ${data.name}`,
      `${t("common.phone")}: ${data.phone}`,
      `${t("common.brand")}: ${data.brand || "—"}`,
      `${t("common.model")}: ${data.model || "—"}`,
      `${t("request.fault")}: ${fault ? (lang === "ar" ? fault.titleAr : fault.titleEn) : data.faultText}`,
      `${t("common.city")}: ${data.city || "—"}`,
      `${t("common.notes")}: ${data.notes || "—"}`,
      "",
      "أوافق على التواصل بخصوص هذا الطلب."
    ].join("\n");
    addRequest({
      ...data,
      fault: fault ? fault.id : data.faultText
    });
    updateSummary(root, data);
    status.className = "form-status is-visible ok";
    status.textContent = t("request.success");
    window.open(whatsappLink(message), "_blank", "noopener");
  });
}
