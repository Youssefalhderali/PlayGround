import { list } from "./db.js";
import { normalize, pick, truncate } from "./utils.js";

function scoreFields(fields, tokens) {
  let score = 0;
  let matched = 0;
  tokens.forEach((token) => {
    let tokenMatched = false;
    fields.forEach(([value, weight]) => {
      const text = normalize(value);
      if (!text) return;
      if (text === token) {
        score += weight * 3;
        tokenMatched = true;
      } else if (text.startsWith(token)) {
        score += weight * 2;
        tokenMatched = true;
      } else if (text.includes(token)) {
        score += weight;
        tokenMatched = true;
      }
    });
    if (tokenMatched) matched += 1;
  });
  if (!matched) return 0;
  return score + (matched === tokens.length ? 12 : 0);
}

export function phoneSearchFields(phone, lang = "ar") {
  const brand = phone.brand || "";
  return [
    [phone.name, 8],
    [phone.nameAr, 7],
    [phone.model, 7],
    [phone.codename, 6],
    [brand, 4],
    [phone.series, 3],
    [phone.chipset, 2],
    [phone.display, 1],
    [phone.os, 1],
    [pick(phone, "summary", lang), 1]
  ];
}

export function filterPhones({ q = "", brand = "all", year = "all", series = "all", sort = "name" } = {}) {
  const tokens = normalize(q).split(" ").filter(Boolean);
  let phones = list("phones");
  if (brand !== "all") phones = phones.filter((phone) => phone.brand === brand);
  if (year !== "all") phones = phones.filter((phone) => String(phone.year) === String(year));
  if (series !== "all") phones = phones.filter((phone) => phone.series === series);
  if (tokens.length) {
    phones = phones
      .map((phone) => ({ phone, score: scoreFields(phoneSearchFields(phone), tokens) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.phone);
  }
  if (sort === "newest") phones.sort((a, b) => Number(b.year) - Number(a.year));
  else if (sort === "oldest") phones.sort((a, b) => Number(a.year) - Number(b.year));
  else phones.sort((a, b) => String(a.name).localeCompare(String(b.name), "en"));
  return phones;
}

export function globalSearch(query, { lang = "ar", limit = 12 } = {}) {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];
  const results = [];

  list("phones").forEach((phone) => {
    const score = scoreFields(phoneSearchFields(phone, lang), tokens);
    if (score > 0) {
      results.push({
        type: "phone",
        icon: "smartphone",
        title: lang === "ar" ? phone.nameAr || phone.name : phone.name,
        subtitle: `${phone.brand.toUpperCase()} · ${phone.model} · ${phone.codename}`,
        href: `#/phones/${phone.slug || phone.id}`,
        badge: lang === "ar" ? "هاتف" : "Phone",
        score: score + 10
      });
    }
  });

  list("faults").forEach((fault) => {
    const score = scoreFields([
      [pick(fault, "title", lang), 7],
      [pick(fault, "desc", lang), 3],
      [pick(fault, "symptoms", lang), 2],
      [fault.id, 2]
    ], tokens);
    if (score > 0) {
      results.push({
        type: "fault",
        icon: "alert",
        title: pick(fault, "title", lang),
        subtitle: truncate(pick(fault, "desc", lang), 80),
        href: `#/faults/${fault.id}`,
        badge: lang === "ar" ? "عطل" : "Fault",
        score
      });
    }
  });

  list("tools").forEach((tool) => {
    const score = scoreFields([
      [tool.name, 6],
      [pick(tool, "desc", lang), 3],
      [tool.category, 2],
      [tool.platform, 1]
    ], tokens);
    if (score > 0) {
      results.push({
        type: "tool",
        icon: "tools",
        title: tool.name,
        subtitle: `${tool.category} · ${tool.platform}`,
        href: `#/tools?q=${encodeURIComponent(tool.name)}`,
        badge: lang === "ar" ? "أداة" : "Tool",
        score
      });
    }
  });

  list("firmware").forEach((entry) => {
    const score = scoreFields([
      [entry.name, 6],
      [entry.model, 4],
      [entry.brand, 3],
      [pick(entry, "notes", lang), 1]
    ], tokens);
    if (score > 0) {
      results.push({
        type: "firmware",
        icon: "download",
        title: entry.name,
        subtitle: `${entry.brand.toUpperCase()} · ${entry.model || entry.region}`,
        href: `#/firmware?brand=${encodeURIComponent(entry.brand)}`,
        badge: lang === "ar" ? "Firmware" : "Firmware",
        score
      });
    }
  });

  list("articles").forEach((article) => {
    const score = scoreFields([
      [pick(article, "title", lang), 7],
      [pick(article, "excerpt", lang), 3],
      [pick(article, "category", lang), 2],
      [pick(article, "body", lang), 1]
    ], tokens);
    if (score > 0) {
      results.push({
        type: "article",
        icon: "book",
        title: pick(article, "title", lang),
        subtitle: pick(article, "excerpt", lang),
        href: `#/guides/${article.id}`,
        badge: lang === "ar" ? "شرح" : "Guide",
        score
      });
    }
  });

  list("prices").forEach((price) => {
    const score = scoreFields([
      [price.phoneName, 6],
      [price.supplierName, 2],
      [price.quality, 1]
    ], tokens);
    if (score > 0) {
      results.push({
        type: "price",
        icon: "screen",
        title: `${price.phoneName} — ${price.quality}`,
        subtitle: `${price.supplierName} · ${price.currency} ${price.price}`,
        href: `#/screens?phone=${encodeURIComponent(price.phoneSlug)}`,
        badge: lang === "ar" ? "سعر" : "Price",
        score
      });
    }
  });

  list("parts").forEach((part) => {
    const score = scoreFields([
      [pick(part, "name", lang), 5],
      [pick(part, "desc", lang), 2],
      [part.partType, 2]
    ], tokens);
    if (score > 0) {
      results.push({
        type: "part",
        icon: part.icon || "package",
        title: pick(part, "name", lang),
        subtitle: pick(part, "compatibility", lang),
        href: `#/parts?type=${encodeURIComponent(part.partType)}`,
        badge: lang === "ar" ? "قطعة" : "Part",
        score
      });
    }
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function highlight(text, query) {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (!tokens.length) return text;
  const escaped = String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const pattern = tokens
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return escaped.replace(new RegExp(`(${pattern})`, "gi"), "<mark>$1</mark>");
}
