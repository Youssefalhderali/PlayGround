import { t } from "../i18n.js";
import { escapeHtml, icon, whatsappLink } from "../utils.js";
import { pageHead, contactItem, notice, ctaBand } from "../components.js";
import { siteConfig } from "../data/index.js";

export function renderContact() {
  return `${pageHead({
    eyebrow: "BRXVIH / CONTACT",
    title: t("contact.title"),
    desc: t("contact.desc"),
    crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.contact") }],
    meta: `<span class="badge badge-accent">+967 777 066 424</span>`
  })}
  <section class="section-tight"><div class="container contact-grid">
    <div class="contact-card card">
      <h2 style="font-size:20px">${t("contact.title")}</h2>
      ${contactItem("whatsapp", t("contact.whatsapp"), "+967 777 066 424", whatsappLink(t("whatsapp.message")))}
      ${contactItem("phone", t("contact.phone"), "+967 777 066 424", "tel:+967777066424")}
      ${contactItem("map-pin", t("contact.location"), t("contact.locationValue"))}
      ${contactItem("clock", t("contact.hours"), t("contact.hoursValue"))}
      <div class="divider"></div>
      ${notice(t("contact.note"), "warning", "shield")}
      <div class="row">
        <a class="btn btn-primary" href="${whatsappLink(t("whatsapp.message"))}" target="_blank" rel="noopener">${icon("whatsapp", "icon-xs")}<span>${t("cta.whatsapp")}</span></a>
        <a class="btn btn-outline" href="#/request">${icon("message", "icon-xs")}<span>${t("nav.request")}</span></a>
      </div>
    </div>
    <form class="card card-pad" data-contact-form>
      <h2 style="font-size:20px;margin-block-end:16px">${t("contact.formTitle")}</h2>
      <div class="form-grid">
        <div class="form-field">
          <label for="contact-name">${t("common.name")} <span class="req">*</span></label>
          <input class="input" id="contact-name" name="name" required autocomplete="name">
        </div>
        <div class="form-field">
          <label for="contact-phone">${t("common.phone")}</label>
          <input class="input" id="contact-phone" name="phone" inputmode="tel" autocomplete="tel" dir="ltr">
        </div>
        <div class="form-field full">
          <label for="contact-subject">${t("contact.subject")}</label>
          <input class="input" id="contact-subject" name="subject" placeholder="${t("contact.subject")}">
        </div>
        <div class="form-field full">
          <label for="contact-message">${t("common.message")} <span class="req">*</span></label>
          <textarea class="textarea" id="contact-message" name="message" required placeholder="${t("request.faultPlaceholder")}"></textarea>
        </div>
      </div>
      <div class="form-status" data-contact-status role="status"></div>
      <div class="row" style="margin-block-start:16px">
        <button class="btn btn-primary" type="submit">${icon("whatsapp", "icon-xs")}<span>${t("contact.send")}</span></button>
      </div>
      <p class="form-note" style="margin-block-start:10px">${t("contact.note")}</p>
    </form>
  </div></section>
  ${ctaBand({
    title: t("home.ctaTitle"),
    text: t("home.ctaText"),
    primary: `<a class="btn btn-dark" href="#/request">${icon("message", "icon-xs")}<span>${t("nav.request")}</span></a>`,
    secondary: `<a class="btn btn-outline" href="${whatsappLink(t("whatsapp.message"))}" target="_blank" rel="noopener">${t("cta.whatsapp")}</a>`
  })}`;
}

export function mountContact(root) {
  const form = root.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    const status = form.querySelector("[data-contact-status]");
    if (!name || !message) {
      status.className = "form-status is-visible err";
      status.textContent = t("request.error");
      return;
    }
    const text = [
      "BRXVIH — رسالة / Message",
      `${t("common.name")}: ${name}`,
      `${t("common.phone")}: ${phone || "—"}`,
      `${t("contact.subject")}: ${subject || "—"}`,
      "",
      message
    ].join("\n");
    status.className = "form-status is-visible ok";
    status.textContent = t("common.success");
    window.open(whatsappLink(text), "_blank", "noopener");
  });
}
