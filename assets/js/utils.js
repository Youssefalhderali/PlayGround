const CURRENCY_SYMBOLS = {
  YER: "ر.ي",
  SAR: "ر.س",
  USD: "$"
};

const ARABIC_MAP = {
  "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا",
  "ى": "ي", "ئ": "ي", "ؤ": "و", "ة": "ه", "ک": "ك", "ی": "ي",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9"
};

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

export function safeUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (raw.startsWith("#/") || raw.startsWith("./") || raw.startsWith("../")) return raw;
  try {
    const url = new URL(raw, window.location.href);
    if (["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) return raw;
  } catch {
    return "";
  }
  return "";
}

export function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱىئؤةکی]/g, (char) => ARABIC_MAP[char] || char)
    .replace(/[٠-٩]/g, (char) => ARABIC_MAP[char] || char)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function slugify(value) {
  return normalize(value).replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
}

export function uid(prefix = "id") {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

export function debounce(fn, wait = 180) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function pick(obj, base, lang = "ar") {
  if (!obj) return "";
  const suffix = lang === "ar" ? "Ar" : "En";
  const fallback = lang === "ar" ? "En" : "Ar";
  return obj[`${base}${suffix}`] || obj[`${base}${fallback}`] || obj[base] || "";
}

export function formatNumber(value, lang = "ar") {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat(lang === "ar" ? "ar-YE" : "en-US", {
    maximumFractionDigits: 2
  }).format(number);
}

export function formatPrice(amount, currency = "USD", lang = "ar") {
  if (amount === null || amount === undefined || amount === "") return lang === "ar" ? "حسب الطلب" : "On request";
  const number = Number(amount);
  if (!Number.isFinite(number)) return lang === "ar" ? "حسب الطلب" : "On request";
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const formatted = formatNumber(number, lang);
  return currency === "USD" ? `$${formatted}` : `${formatted} ${symbol}`;
}

export function convertCurrency(amount, from, to, rates) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return null;
  const fromRate = Number(rates?.[from]);
  const toRate = Number(rates?.[to]);
  if (!fromRate || !toRate) return null;
  return (value / fromRate) * toRate;
}

export function formatDate(value, lang = "ar") {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-YE" : "en-US", {
    year: "numeric", month: "short", day: "numeric"
  }).format(date);
}

export function formatRelative(value, lang = "ar") {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const diff = Math.round((date.getTime() - Date.now()) / 86400000);
  const rtf = new Intl.RelativeTimeFormat(lang === "ar" ? "ar" : "en", { numeric: "auto" });
  if (Math.abs(diff) < 30) return rtf.format(diff, "day");
  return formatDate(value, lang);
}

export function icon(name, className = "") {
  return `<svg class="icon${className ? ` ${className}` : ""}" aria-hidden="true" focusable="false"><use href="assets/img/icons.svg#${escapeAttr(name)}"></use></svg>`;
}

export function whatsappLink(message = "") {
  const base = "https://wa.me/967777066424";
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function on(target, event, handler, options) {
  target?.addEventListener(event, handler, options);
  return () => target?.removeEventListener(event, handler, options);
}

export function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadFile(filename, content, type = "application/json") {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function humanSize(bytes) {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1048576).toFixed(1)} MB`;
}

export function truncate(value, length = 120) {
  const text = String(value ?? "").trim();
  if (text.length <= length) return text;
  return `${text.slice(0, Math.max(0, length - 1)).trim()}…`;
}

export function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function parseQuery(search = "") {
  return new URLSearchParams(String(search).replace(/^\?/, ""));
}

export function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, value);
    }
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

export function isValidPhone(value) {
  return /^[+]?[\d\s()-]{7,20}$/.test(String(value || ""));
}

export function scrollToTop(behavior = "smooth") {
  window.scrollTo({ top: 0, behavior });
}

export function setMeta(name, content, attribute = "name") {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.append(element);
  }
  element.setAttribute("content", content);
}
