(function () {
  "use strict";

  var cfg = window.BRXVihConfig || {};
  var data = window.BRXVihData || { categories: {}, devices: {}, services: {}, serviceLabels: {} };
  var root = document.documentElement;
  var currency = cfg.currency || "ر.ي";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var priceFormatter = new Intl.NumberFormat("en-US");

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function formatPrice(value) {
    return priceFormatter.format(Number(value) || 0);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(value) {
    return String(value == null ? "" : value)
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/[\u064B-\u0652]/g, "")
      .trim();
  }

  function toWesternDigits(value) {
    return String(value == null ? "" : value)
      .replace(/[٠-٩]/g, function (digit) {
        return String("٠١٢٣٤٥٦٧٨٩".indexOf(digit));
      })
      .replace(/[۰-۹]/g, function (digit) {
        return String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit));
      });
  }

  function getDevice(category, modelId) {
    var list = data.devices[category] || [];
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === modelId) return list[i];
    }
    return null;
  }

  function normalizeService(service, fallbackWarranty) {
    if (typeof service === "number") {
      return { price: service, warranty: fallbackWarranty || "30 يوم", unit: "" };
    }
    return {
      price: Number(service.price) || 0,
      warranty: service.warranty || fallbackWarranty || "30 يوم",
      unit: service.unit || ""
    };
  }

  function serviceName(key) {
    return (data.serviceLabels && data.serviceLabels[key]) || key;
  }

  var icon = function (name, className) {
    return '<svg class="icon ' + (className || "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  };

  /* Theme */
  var themeToggle = $("#theme-toggle");

  function applyTheme(theme, persist) {
    var isDark = theme !== "light";
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    root.style.colorScheme = isDark ? "dark" : "light";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"
      );
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#060910" : "#f3f7fd");
    if (persist) {
      try {
        localStorage.setItem("brxvih-theme", isDark ? "dark" : "light");
      } catch (error) {
        /* storage unavailable */
      }
    }
  }

  applyTheme(root.getAttribute("data-theme") || "dark", false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
  }

  /* Header, menu, scroll UI */
  var header = $("#site-header");
  var backTop = $("#back-top");
  var nav = $("#site-nav");
  var menuToggle = $("#menu-toggle");

  function updateScrollUI() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
    if (backTop) backTop.classList.toggle("is-visible", window.scrollY > 700);
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح القائمة");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = menuToggle.getAttribute("aria-expanded") !== "true";
      nav.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    });

    $$(".nav-link", nav).forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Active navigation */
  var sections = $$("main section[id]");
  var navLinks = $$(".nav-link");

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* Reveal on scroll */
  var revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -4% 0px" }
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* Service card pointer glow */
  $$(".service-card").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      if (event.pointerType === "touch") return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width) * 100 + "%");
      card.style.setProperty("--my", ((event.clientY - rect.top) / rect.height) * 100 + "%");
    });
  });

  /* Toast */
  var toast = $("#toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3400);
  }

  /* WhatsApp links */
  var waNumber = String(cfg.whatsappNumber || "").replace(/\D/g, "");
  var waBase = waNumber ? "https://wa.me/" + waNumber : "https://wa.me/";
  var genericWaText = encodeURIComponent("مرحبًا يوسف، أرغب بالاستفسار عن خدمات Brxvih.");

  $$("[data-wa]").forEach(function (link) {
    link.href = waBase + "?text=" + genericWaText;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  /* Pricing */
  var priceBody = $("#price-body");
  var priceTable = $(".price-table");
  var priceEmpty = $("#price-empty");
  var priceCount = $("#price-count");
  var searchInput = $("#price-search");
  var tabs = $$(".pricing-tabs .tab");
  var pricingState = { category: "iphone", query: "" };

  var modelCount = Object.keys(data.devices).reduce(function (total, key) {
    return total + (data.devices[key] || []).length;
  }, 0);
  var modelCountEl = $("[data-model-count]");
  if (modelCountEl) modelCountEl.textContent = modelCount + "+";

  function matchesQuery(text) {
    if (!pricingState.query) return true;
    return normalizeText(text).indexOf(pricingState.query) !== -1;
  }

  function repairRows(category) {
    return (data.devices[category] || []).filter(function (device) {
      var searchable = device.model + " " + device.brand + " " + device.year + " " + Object.keys(device.services).map(serviceName).join(" ");
      return matchesQuery(searchable);
    });
  }

  function serviceRows() {
    var groups = [
      { key: "software", label: "أمن سيبراني وسوفت وير" },
      { key: "development", label: "برمجة وتطوير" }
    ];
    var rows = [];
    groups.forEach(function (group) {
      (data.services[group.key] || []).forEach(function (service) {
        if (!matchesQuery(service.name + " " + service.desc + " " + group.label)) return;
        rows.push({
          category: group.key,
          group: group.label,
          service: service
        });
      });
    });
    return rows;
  }

  function repairRowHtml(device, category, showCategory) {
    var chips = "";
    Object.keys(device.services).forEach(function (key) {
      var info = normalizeService(device.services[key], device.warranty);
      chips +=
        '<button class="price-chip" type="button" data-quote-category="' +
        escapeHtml(category) +
        '" data-model="' +
        escapeHtml(device.id) +
        '" data-service="' +
        escapeHtml(key) +
        '">' +
        escapeHtml(serviceName(key)) +
        " <b>" +
        formatPrice(info.price) +
        "</b>" +
        (info.unit ? '<span class="unit">' + escapeHtml(info.unit) + "</span>" : "") +
        "</button>";
    });

    var meta = device.brand + " · " + device.year;
    if (showCategory && data.categories[category]) {
      meta += " · " + data.categories[category].short;
    }

    return (
      "<tr>" +
      '<td class="device-cell" data-label="الجهاز"><strong>' +
      escapeHtml(device.model) +
      "</strong><span>" +
      escapeHtml(meta) +
      "</span></td>" +
      '<td data-label="الخدمات والأسعار"><div class="price-cell">' +
      chips +
      "</div></td>" +
      '<td data-label="الضمان"><span class="warranty-pill">' +
      icon("shield") +
      escapeHtml(device.warranty) +
      "</span></td>" +
      '<td class="action-cell" data-label=""><button class="row-cta" type="button" data-quote-category="' +
      escapeHtml(category) +
      '" data-model="' +
      escapeHtml(device.id) +
      '" data-service="' +
      escapeHtml(Object.keys(device.services)[0]) +
      '">اطلب ' +
      icon("arrow") +
      "</button></td>" +
      "</tr>"
    );
  }

  function serviceRowHtml(row) {
    var service = row.service;
    var prefix = service.unit === "من" ? "من " : "";
    var suffix = service.unit === "/شهر" ? " / شهر" : "";
    return (
      "<tr>" +
      '<td class="device-cell" data-label="الخدمة"><strong>' +
      escapeHtml(service.name) +
      "</strong><span>" +
      escapeHtml(row.group) +
      "</span></td>" +
      '<td data-label="الوصف والسعر"><p class="service-desc">' +
      escapeHtml(service.desc) +
      '</p><span class="price-tag"><b>' +
      prefix +
      formatPrice(service.price) +
      "</b><span>" +
      currency +
      suffix +
      "</span></span></td>" +
      '<td data-label="الضمان"><span class="warranty-pill">' +
      icon("shield") +
      escapeHtml(service.warranty) +
      "</span></td>" +
      '<td class="action-cell" data-label=""><button class="row-cta" type="button" data-quote-category="' +
      escapeHtml(row.category) +
      '" data-model="" data-service="' +
      escapeHtml(service.id) +
      '">اطلب ' +
      icon("arrow") +
      "</button></td>" +
      "</tr>"
    );
  }

  function renderPricing() {
    if (!priceBody) return;
    var html = "";
    var countText = "";
    var hasRows = false;
    var isSearching = pricingState.query !== "";
    var current = data.categories[pricingState.category] || { type: "repair" };
    var repairCount = 0;

    tabs.forEach(function (tab) {
      var active = !isSearching && tab.getAttribute("data-category") === pricingState.category;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (!isSearching && current.type === "service") {
      var services = serviceRows();
      services.forEach(function (row) {
        html += serviceRowHtml(row);
        hasRows = true;
      });
      countText = services.length + " خدمة";
    } else {
      var categories = isSearching ? ["iphone", "android", "laptop"] : [pricingState.category];
      var totalServices = 0;

      categories.forEach(function (category) {
        var devices = repairRows(category);
        repairCount += devices.length;
        devices.forEach(function (device) {
          Object.keys(device.services).forEach(function () {
            totalServices += 1;
          });
          html += repairRowHtml(device, category, isSearching);
          hasRows = true;
        });
      });

      if (isSearching) {
        var serviceResults = serviceRows();
        serviceResults.forEach(function (row) {
          html += serviceRowHtml(row);
          hasRows = true;
        });
        countText = repairCount + serviceResults.length + " نتيجة في جميع الفئات";
      } else {
        countText = repairCount + " موديل · " + totalServices + " خدمة";
      }
    }

    priceBody.innerHTML = html;
    if (priceCount) priceCount.textContent = hasRows ? countText : "لا نتائج";
    if (priceTable) priceTable.hidden = !hasRows;
    if (priceEmpty) priceEmpty.hidden = hasRows;
  }

  function setPricingCategory(category) {
    if (!data.categories[category]) return;
    pricingState.category = category;
    pricingState.query = "";
    if (searchInput) searchInput.value = "";
    renderPricing();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setPricingCategory(tab.getAttribute("data-category"));
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      pricingState.query = normalizeText(searchInput.value);
      renderPricing();
    });
  }

  $$("[data-tab-target]").forEach(function (link) {
    link.addEventListener("click", function () {
      setPricingCategory(link.getAttribute("data-tab-target"));
    });
  });

  /* Quote builder */
  var quoteForm = $("#quote-form");
  var qCategory = $("#q-category");
  var qModel = $("#q-model");
  var qModelField = $("#q-model-field");
  var qService = $("#q-service");
  var qName = $("#q-name");
  var qPhone = $("#q-phone");
  var qNotes = $("#q-notes");
  var quoteSummary = $("#quote-summary");
  var sumTitle = $("#sum-title");
  var sumPrice = $("#sum-price");
  var sumUnit = quoteSummary ? $(".summary-price small", quoteSummary) : null;
  var sumCategory = $("#sum-category");
  var sumModel = $("#sum-model");
  var sumWarranty = $("#sum-warranty");
  var copyButton = $("#copy-summary");

  function categoryOrder() {
    return ["iphone", "android", "laptop", "software", "development"];
  }

  function populateCategories() {
    if (!qCategory) return;
    qCategory.innerHTML = categoryOrder()
      .filter(function (key) {
        return data.categories[key];
      })
      .map(function (key) {
        return '<option value="' + escapeHtml(key) + '">' + escapeHtml(data.categories[key].label) + "</option>";
      })
      .join("");
  }

  function updateModelOptions(category, preferredModel) {
    if (!qModel || !qModelField) return;
    var meta = data.categories[category];
    var isRepair = meta && meta.type === "repair";

    if (!isRepair) {
      qModelField.hidden = true;
      qModel.required = false;
      qModel.innerHTML = "";
      return;
    }

    qModelField.hidden = false;
    qModel.required = true;
    qModel.innerHTML = (data.devices[category] || [])
      .map(function (device) {
        return '<option value="' + escapeHtml(device.id) + '">' + escapeHtml(device.model) + "</option>";
      })
      .join("");

    if (preferredModel && getDevice(category, preferredModel)) {
      qModel.value = preferredModel;
    } else if (qModel.options.length) {
      qModel.selectedIndex = 0;
    }
  }

  function populateServices(category, preferredService) {
    if (!qService) return;
    var meta = data.categories[category];
    var options = [];

    if (meta && meta.type === "repair") {
      var device = getDevice(category, qModel ? qModel.value : "");
      if (device) {
        Object.keys(device.services).forEach(function (key) {
          var info = normalizeService(device.services[key], device.warranty);
          options.push({
            value: key,
            name: serviceName(key),
            price: info.price,
            warranty: info.warranty,
            unit: info.unit
          });
        });
      }
    } else {
      (data.services[category] || []).forEach(function (service) {
        options.push({
          value: service.id,
          name: service.name,
          price: service.price,
          warranty: service.warranty,
          unit: service.unit || ""
        });
      });
    }

    qService.innerHTML = options
      .map(function (option) {
        var prefix = option.unit === "من" ? "من " : "";
        var suffix = option.unit === "/شهر" ? " / شهر" : "";
        return (
          '<option value="' +
          escapeHtml(option.value) +
          '" data-name="' +
          escapeHtml(option.name) +
          '" data-price="' +
          option.price +
          '" data-warranty="' +
          escapeHtml(option.warranty) +
          '" data-unit="' +
          escapeHtml(option.unit) +
          '">' +
          escapeHtml(option.name) +
          " — " +
          prefix +
          formatPrice(option.price) +
          " " +
          currency +
          suffix +
          "</option>"
        );
      })
      .join("");

    if (preferredService) {
      var exists = options.some(function (option) {
        return option.value === preferredService;
      });
      if (exists) qService.value = preferredService;
    }
  }

  function getQuoteState() {
    var category = qCategory ? qCategory.value : "iphone";
    var meta = data.categories[category] || {};
    var option = qService && qService.selectedOptions ? qService.selectedOptions[0] : null;
    var device = meta.type === "repair" && qModel ? getDevice(category, qModel.value) : null;

    return {
      category: category,
      categoryLabel: meta.label || "—",
      type: meta.type || "service",
      device: device,
      option: option,
      name: option ? option.getAttribute("data-name") || option.textContent.split(" — ")[0] : "",
      price: option ? Number(option.getAttribute("data-price")) || 0 : 0,
      warranty: option ? option.getAttribute("data-warranty") || "—" : "—",
      unit: option ? option.getAttribute("data-unit") || "" : ""
    };
  }

  function updateSummary(flash) {
    var state = getQuoteState();
    if (!sumTitle || !sumPrice) return;

    if (!state.option) {
      sumTitle.textContent = "اختر خدمة للبدء";
      sumPrice.textContent = "—";
      if (sumUnit) sumUnit.textContent = currency;
      if (sumCategory) sumCategory.textContent = state.categoryLabel;
      if (sumModel) sumModel.textContent = "—";
      if (sumWarranty) sumWarranty.textContent = "—";
      return;
    }

    var title = state.type === "repair" && state.device
      ? state.device.model + " · " + state.name
      : state.name;

    sumTitle.textContent = title;
    sumPrice.textContent = (state.unit === "من" ? "من " : "") + formatPrice(state.price);
    if (sumUnit) sumUnit.textContent = currency + (state.unit === "/شهر" ? " / شهر" : "");
    if (sumCategory) sumCategory.textContent = state.categoryLabel;
    if (sumModel) sumModel.textContent = state.type === "repair" && state.device ? state.device.model : "خدمة رقمية";
    if (sumWarranty) sumWarranty.textContent = state.warranty;

    if (flash && quoteSummary) {
      quoteSummary.classList.remove("is-updated");
      void quoteSummary.offsetWidth;
      quoteSummary.classList.add("is-updated");
    }
  }

  function selectQuote(category, modelId, serviceKey, shouldScroll) {
    if (!data.categories[category] || !qCategory) return;
    qCategory.value = category;
    updateModelOptions(category, modelId);
    populateServices(category, serviceKey);
    updateSummary(true);

    if (shouldScroll !== false) {
      var target = $("#quote");
      if (target) {
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }
    }
  }

  if (qCategory) {
    populateCategories();
    qCategory.value = "iphone";
    updateModelOptions("iphone");
    populateServices("iphone");
    updateSummary(false);

    qCategory.addEventListener("change", function () {
      updateModelOptions(qCategory.value);
      populateServices(qCategory.value);
      updateSummary(true);
    });
  }

  if (qModel) {
    qModel.addEventListener("change", function () {
      populateServices(qCategory.value);
      updateSummary(true);
    });
  }

  if (qService) {
    qService.addEventListener("change", function () {
      updateSummary(true);
    });
  }

  if (priceBody) {
    priceBody.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-service]");
      if (!trigger) return;
      var category = trigger.getAttribute("data-quote-category") || pricingState.category;
      var model = trigger.getAttribute("data-model") || "";
      var service = trigger.getAttribute("data-service");
      selectQuote(category, model, service, true);
    });
  }

  $$("[data-preset-category]").forEach(function (link) {
    link.addEventListener("click", function () {
      var category = link.getAttribute("data-preset-category");
      var service = link.getAttribute("data-preset-service") || "";
      selectQuote(category, "", service, true);
    });
  });

  function buildSummaryLines() {
    var state = getQuoteState();
    var lines = ["طلب خدمة من موقع Brxvih", "----------------------------"];
    lines.push("الخدمة: " + state.categoryLabel);
    if (state.type === "repair" && state.device) {
      lines.push("الجهاز: " + state.device.model);
    }
    lines.push("الطلب: " + (state.name || "—"));
    if (state.option) {
      var priceLine = (state.unit === "من" ? "من " : "") + formatPrice(state.price) + " " + currency;
      if (state.unit === "/شهر") priceLine += " / شهر";
      lines.push("السعر التقديري: " + priceLine);
      lines.push("الضمان: " + state.warranty);
    }
    var name = qName ? qName.value.trim() : "";
    var phone = qPhone ? toWesternDigits(qPhone.value.trim()) : "";
    var notes = qNotes ? qNotes.value.trim() : "";
    if (name) lines.push("الاسم: " + name);
    if (phone) lines.push("الهاتف: " + phone);
    if (notes) lines.push("ملاحظات: " + notes);
    lines.push("", "أُرسل هذا الملخص من حاسبة الطلب في موقع Brxvih.");
    return lines;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return fallbackCopy(text); }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  if (copyButton) {
    copyButton.addEventListener("click", function () {
      copyText(buildSummaryLines().join("\n")).then(function (ok) {
        showToast(ok ? "تم نسخ ملخص الطلب." : "تعذر النسخ تلقائيًا، جرّب تحديد النص يدويًا.");
      });
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var state = getQuoteState();
      var name = qName ? qName.value.trim() : "";
      var phoneRaw = qPhone ? toWesternDigits(qPhone.value.trim()) : "";
      var validPhone = /^\+?[0-9][0-9\s()-]{5,}$/.test(phoneRaw);

      if (!state.option) {
        showToast("يرجى اختيار الخدمة المطلوبة أولًا.");
        if (qService) qService.focus();
        return;
      }
      if (!name) {
        showToast("يرجى إدخال الاسم.");
        if (qName) qName.focus();
        return;
      }
      if (!validPhone) {
        showToast("يرجى إدخال رقم تواصل صحيح.");
        if (qPhone) qPhone.focus();
        return;
      }

      var message = buildSummaryLines().join("\n");
      var url = waBase + "?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener,noreferrer");
      showToast("تم تجهيز طلبك. أكمل الإرسال في واتساب.");
    });
  }

  /* Initial pricing render */
  renderPricing();
})();
