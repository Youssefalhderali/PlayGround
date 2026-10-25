(function () {
  "use strict";

  const WHATSAPP_NUMBER = "967777066424";
  const PHONE_NUMBER = "+967777066424";
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("mainNav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const form = document.getElementById("requestForm");
  const successPanel = document.getElementById("formSuccess");
  const formCard = document.querySelector(".form-card");
  const toast = document.getElementById("toast");
  const requestType = document.getElementById("requestType");
  const details = document.getElementById("details");
  const charCount = document.getElementById("charCount");
  const referenceCode = document.getElementById("referenceCode");
  const whatsappSend = document.getElementById("whatsappSend");
  const copyRef = document.getElementById("copyRef");
  const newRequest = document.getElementById("newRequest");
  const copyPhone = document.getElementById("copyPhone");
  const localTime = document.getElementById("localTime");
  const availability = document.getElementById("availability");
  const whatsappFloat = document.querySelector(".whatsapp-float");
  let toastTimer;

  function setHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    if (whatsappFloat) whatsappFloat.classList.toggle("is-visible", window.scrollY > 360);
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    header.classList.remove("menu-visible");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "فتح القائمة");
  }

  function toggleMenu() {
    const isOpen = !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", isOpen);
    header.classList.toggle("menu-visible", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  async function copyText(text, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }
      showToast(successMessage || "تم النسخ بنجاح");
    } catch (error) {
      showToast("تعذّر النسخ تلقائياً. يمكنك تحديد الرقم ونسخه يدوياً.");
    }
  }

  function normalizeDigits(value) {
    return value
      .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
      .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
  }

  function setError(field, message) {
    const error = document.querySelector('[data-error-for="' + field.name + '"]');
    if (error) error.textContent = message;
    if (field.closest(".input-wrap")) field.closest(".input-wrap").classList.add("has-error");
    field.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    const error = document.querySelector('[data-error-for="' + field.name + '"]');
    if (error) error.textContent = "";
    if (field.closest(".input-wrap")) field.closest(".input-wrap").classList.remove("has-error");
    field.removeAttribute("aria-invalid");
  }

  function validateField(field) {
    const value = field.type === "checkbox" ? field.checked : field.value.trim();

    if (field.name === "name" && (!value || value.length < 2)) {
      return "يرجى كتابة الاسم الكامل (حرفان على الأقل).";
    }
    if (field.name === "phone") {
      const normalized = normalizeDigits(value);
      const digitCount = (normalized.match(/\d/g) || []).length;
      if (!normalized || !/^\+?[0-9\s\-()]+$/.test(normalized) || digitCount < 7 || digitCount > 15) {
        return "يرجى إدخال رقم هاتف صحيح مع رمز الدولة إن أمكن.";
      }
    }
    if (field.name === "requestType" && !value) {
      return "يرجى اختيار نوع الطلب.";
    }
    if (field.name === "subject" && (!value || value.length < 3)) {
      return "يرجى كتابة عنوان مختصر للطلب.";
    }
    if (field.name === "details" && (!value || value.length < 15)) {
      return "يرجى وصف الطلب بما لا يقل عن 15 حرفاً.";
    }
    if (field.name === "consent" && !value) {
      return "يجب الموافقة قبل تجهيز الطلب.";
    }
    return "";
  }

  function validateForm() {
    const fields = [
      form.elements.name,
      form.elements.phone,
      form.elements.requestType,
      form.elements.subject,
      form.elements.details,
      form.elements.consent
    ];
    let firstInvalid = null;

    fields.forEach((field) => {
      const message = validateField(field);
      if (message) {
        setError(field, message);
        if (!firstInvalid) firstInvalid = field;
      } else {
        clearError(field);
      }
    });

    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: true });
      const target = firstInvalid.closest(".field") || firstInvalid.closest(".consent");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }

  function buildReference() {
    const now = new Date();
    const date = [
      String(now.getFullYear()).slice(-2),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("");
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return "BRX-" + date + "-" + random;
  }

  function buildRequestMessage(reference) {
    const data = new FormData(form);
    const priority = data.get("priority") || "عادية";
    const text = [
      "طلب جديد عبر موقع brxvih",
      "الرقم المرجعي: " + reference,
      "--------------------------------",
      "الاسم: " + String(data.get("name")).trim(),
      "الهاتف: " + normalizeDigits(String(data.get("phone")).trim()),
      "نوع الطلب: " + String(data.get("requestType")),
      "الأولوية: " + String(priority),
      "العنوان: " + String(data.get("subject")).trim(),
      "--------------------------------",
      "التفاصيل:",
      String(data.get("details")).trim(),
      "--------------------------------",
      "أُرسل من موقع يوسف الهدار — brxvih"
    ].join("\n");
    return text;
  }

  function renderSuccess(reference, requestText) {
    referenceCode.textContent = reference;
    whatsappSend.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(requestText);
    form.hidden = true;
    successPanel.hidden = false;
    formCard.scrollIntoView({ behavior: "smooth", block: "center" });
    whatsappSend.focus({ preventScroll: true });
    window.open(whatsappSend.href, "_blank", "noopener");
  }

  function resetFormView() {
    form.reset();
    form.hidden = false;
    successPanel.hidden = true;
    charCount.textContent = "0";
    form.querySelectorAll(".field-error").forEach((error) => (error.textContent = ""));
    form.querySelectorAll(".has-error").forEach((field) => field.classList.remove("has-error"));
    form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
    whatsappSend.href = "https://wa.me/" + WHATSAPP_NUMBER;
    requestType.value = "";
    form.elements.name.focus({ preventScroll: true });
  }

  function updateClock() {
    if (!localTime || !availability) return;
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Aden",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).formatToParts(new Date());
      const hour = Number(parts.find((part) => part.type === "hour").value);
      const minute = parts.find((part) => part.type === "minute").value;
      const isOpen = hour >= 9 && hour < 21;
      localTime.textContent = String(hour).padStart(2, "0") + ":" + minute;
      localTime.title = "الوقت الحالي في اليمن";
      availability.innerHTML = "<i></i> " + (isOpen ? "متاح الآن" : "خارج ساعات العمل");
      availability.classList.toggle("is-off", !isOpen);
    } catch (error) {
      localTime.textContent = "09:00 — 21:00";
    }
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  navToggle.addEventListener("click", toggleMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("menu-open")) return;
    if (header.contains(event.target)) return;
    closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-35% 0px -58% 0px" }
    );
    sections.forEach((section) => spyObserver.observe(section));
  }

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        if (openItem === item) return;
        openItem.classList.remove("is-open");
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.querySelectorAll("[data-request-service]").forEach((button) => {
    button.addEventListener("click", () => {
      const service = button.getAttribute("data-request-service");
      requestType.value = service;
      clearError(requestType);
      document.getElementById("request").scrollIntoView({ behavior: "smooth", block: "start" });
      if (formCard) {
        setTimeout(() => {
          formCard.animate(
            [
              { boxShadow: "0 40px 80px -30px rgba(0,0,0,.55), 0 0 0 0 rgba(131,247,180,0)" },
              { boxShadow: "0 40px 80px -30px rgba(0,0,0,.55), 0 0 0 7px rgba(131,247,180,.25)" },
              { boxShadow: "0 40px 80px -30px rgba(0,0,0,.55), 0 0 0 0 rgba(131,247,180,0)" }
            ],
            { duration: 1200, easing: "ease-out" }
          );
        }, 500);
      }
    });
  });

  if (details) {
    details.addEventListener("input", () => {
      charCount.textContent = String(details.value.length);
    });
  }

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    const eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
    field.addEventListener(eventName, () => clearError(field));
    field.addEventListener("blur", () => {
      if (!field.name || field.type === "radio") return;
      const value = field.type === "checkbox" ? field.checked : field.value.trim();
      if (!value) return;
      const message = validateField(field);
      if (message) setError(field, message);
      else clearError(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    const reference = buildReference();
    const requestText = buildRequestMessage(reference);
    renderSuccess(reference, requestText);
  });

  newRequest.addEventListener("click", resetFormView);

  copyRef.addEventListener("click", () => {
    copyText(referenceCode.textContent, "تم نسخ الرقم المرجعي");
  });

  copyPhone.addEventListener("click", () => {
    copyText(copyPhone.getAttribute("data-phone") || PHONE_NUMBER, "تم نسخ رقم الهاتف");
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
  updateClock();
  setInterval(updateClock, 30000);
})();
