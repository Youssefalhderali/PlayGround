import { brandById } from "./brands.js";

const gsmSearch = (name) =>
  `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(name)}`;

const toolsByBrand = {
  samsung: ["odin", "samfw", "adb-fastboot"],
  xiaomi: ["mi-flash", "xiaomi-tool", "adb-fastboot"],
  redmi: ["mi-flash", "xiaomi-tool", "adb-fastboot"],
  poco: ["mi-flash", "xiaomi-tool", "adb-fastboot"],
  huawei: ["huawei-firmware", "adb-fastboot"],
  honor: ["honor-suite", "adb-fastboot"],
  oppo: ["sp-flash", "adb-fastboot"],
  vivo: ["sp-flash", "adb-fastboot"],
  realme: ["sp-flash", "adb-fastboot"],
  oneplus: ["adb-fastboot", "msm-download"],
  apple: ["itunes", "3utools", "dfu"],
  tecno: ["sp-flash", "adb-fastboot"],
  infinix: ["sp-flash", "adb-fastboot"],
  itel: ["sp-flash", "adb-fastboot"],
  zte: ["sp-flash", "adb-fastboot"],
  nubia: ["sp-flash", "adb-fastboot"],
  motorola: ["rsd-lite", "adb-fastboot"],
  nokia: ["sp-flash", "adb-fastboot"],
  lg: ["lgup", "adb-fastboot"],
  google: ["adb-fastboot", "android-flash-tool"]
};

const romsByBrand = {
  samsung: ["sammobile", "samsung-support"],
  xiaomi: ["xiaomifirmwareupdater", "xiaomi-support"],
  redmi: ["xiaomifirmwareupdater", "xiaomi-support"],
  poco: ["xiaomifirmwareupdater", "poco-support"],
  huawei: ["huawei-support", "firmware-finder"],
  honor: ["honor-support"],
  oppo: ["oppo-support"],
  vivo: ["vivo-support"],
  realme: ["realme-support"],
  oneplus: ["oneplus-support"],
  apple: ["ipsw"],
  tecno: ["tecno-support"],
  infinix: ["infinix-support"],
  itel: ["itel-support"],
  zte: ["zte-support"],
  nubia: ["nubia-support"],
  motorola: ["motorola-support"],
  nokia: ["nokia-support"],
  lg: ["lg-support"],
  google: ["google-factory-images"]
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

function makePhone(data) {
  const brand = brandById[data.brand];
  const slug = `${data.brand}-${slugify(data.name)}`;
  return {
    id: slug,
    slug,
    name: data.name,
    nameAr: data.nameAr || data.name,
    brand: data.brand,
    series: data.series || brand.series[0],
    model: data.model,
    codename: data.codename || "غير معلن",
    year: data.year,
    chipset: data.chipset,
    display: data.display,
    resolution: data.resolution,
    battery: data.battery,
    memory: data.memory,
    storage: data.storage,
    os: data.os,
    software: data.software || "راجع إصدار البناء والمنطقة في إعدادات الهاتف قبل التفليش.",
    issueIds: data.issueIds || ["screen-crack", "battery-drain", "charging-port", "bootloop", "overheat"],
    partTypes: data.partTypes || ["screen", "battery", "charging-port", "back-cover"],
    romSourceIds: data.romSourceIds || romsByBrand[data.brand] || [data.brand],
    toolIds: data.toolIds || toolsByBrand[data.brand] || ["adb-fastboot"],
    sources: data.sources || [
      { label: `GSMArena — بحث ${data.name}`, url: gsmSearch(data.name) },
      { label: `${brand.name} — الدعم الرسمي`, url: brand.support }
    ],
    verified: data.verified !== false,
    featured: Boolean(data.featured),
    reviewedAt: data.reviewedAt || "2026-10-27",
    notes: data.notes || "",
    summaryAr: data.summaryAr || "",
    summaryEn: data.summaryEn || ""
  };
}

export const phones = [
  /* ---------------- Samsung ---------------- */
  makePhone({
    brand: "samsung", name: "Galaxy S24 Ultra", nameAr: "جالكسي S24 ألترا", series: "Galaxy S",
    model: "SM-S928B", codename: "e3q", year: 2024, chipset: "Snapdragon 8 Gen 3",
    display: "6.8 بوصة LTPO AMOLED 2X · 120Hz", resolution: "1440 × 3120",
    battery: "5000 mAh · شحن 45W", memory: "12GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 14 · One UI 6.1",
    software: "إصدار عالمي B · تحديثات OTA · فك Bootloader عبر خيار OEM",
    featured: true,
    summaryAr: "أفضل تجربة Galaxy في التصوير والذكاء الاصطناعي، مع قلم S Pen وشاشة مسطحة مضادة للانعكاس.",
    summaryEn: "Samsung's flagship with S Pen, a flat anti-reflective display, and advanced Galaxy AI features."
  }),
  makePhone({
    brand: "samsung", name: "Galaxy S24", nameAr: "جالكسي S24", series: "Galaxy S",
    model: "SM-S921B", codename: "e1q", year: 2024, chipset: "Exynos 2400 (عالمي) / Snapdragon 8 Gen 3 (أمريكا)",
    display: "6.2 بوصة Dynamic AMOLED 2X · 120Hz", resolution: "1080 × 2340",
    battery: "4000 mAh · شحن 25W", memory: "8GB RAM", storage: "128GB / 256GB / 512GB",
    os: "Android 14 · One UI 6.1",
    software: "منطقة عالمية B · تحقق من معالج الجهاز قبل اختيار الروم",
    featured: true
  }),
  makePhone({
    brand: "samsung", name: "Galaxy S23 Ultra", nameAr: "جالكسي S23 ألترا", series: "Galaxy S",
    model: "SM-S918B", codename: "dm3q", year: 2023, chipset: "Snapdragon 8 Gen 2 for Galaxy",
    display: "6.8 بوصة Dynamic AMOLED 2X · 120Hz", resolution: "1440 × 3088",
    battery: "5000 mAh · شحن 45W", memory: "8GB / 12GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 13 · One UI 5.1 (قابل للترقية)",
    software: "إصدار عالمي B · روم OXM متعدد المناطق شائع",
    featured: true
  }),
  makePhone({
    brand: "samsung", name: "Galaxy S23 FE", nameAr: "جالكسي S23 FE", series: "Galaxy S",
    model: "SM-S711B", codename: "r11s", year: 2023, chipset: "Exynos 2200",
    display: "6.4 بوصة Dynamic AMOLED 2X · 120Hz", resolution: "1080 × 2340",
    battery: "4500 mAh · شحن 25W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · One UI 5.1",
    software: "إصدار عالمي B · تحقق من CSC قبل التفليش"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy S21 FE 5G", nameAr: "جالكسي S21 FE", series: "Galaxy S",
    model: "SM-G990B", codename: "r9q", year: 2022, chipset: "Exynos 2100",
    display: "6.4 بوصة Dynamic AMOLED 2X · 120Hz", resolution: "1080 × 2340",
    battery: "4500 mAh · شحن 25W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 12 · One UI 4",
    software: "إصدار عالمي B · دعم رسمي حتى Android 14"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy A55 5G", nameAr: "جالكسي A55", series: "Galaxy A",
    model: "SM-A556B", codename: "a55x", year: 2024, chipset: "Exynos 1480",
    display: "6.6 بوصة Super AMOLED · 120Hz", resolution: "1080 × 2340",
    battery: "5000 mAh · شحن 25W", memory: "8GB / 12GB RAM", storage: "128GB / 256GB",
    os: "Android 14 · One UI 6.1",
    software: "إصدار عالمي B · 4 تحديثات Android رئيسية",
    featured: true
  }),
  makePhone({
    brand: "samsung", name: "Galaxy A35 5G", nameAr: "جالكسي A35", series: "Galaxy A",
    model: "SM-A356B", codename: "a35x", year: 2024, chipset: "Exynos 1380",
    display: "6.6 بوصة Super AMOLED · 120Hz", resolution: "1080 × 2340",
    battery: "5000 mAh · شحن 25W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 14 · One UI 6.1",
    software: "إصدار عالمي B · تحقق من إصدار البوتلودر"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy A54 5G", nameAr: "جالكسي A54", series: "Galaxy A",
    model: "SM-A546B", codename: "a54x", year: 2023, chipset: "Exynos 1380",
    display: "6.4 بوصة Super AMOLED · 120Hz", resolution: "1080 × 2340",
    battery: "5000 mAh · شحن 25W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · One UI 5.1",
    software: "إصدار عالمي B · روم OXM شائع في المنطقة"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy A25 5G", nameAr: "جالكسي A25", series: "Galaxy A",
    model: "SM-A256B", codename: "a25x", year: 2023, chipset: "Exynos 1280",
    display: "6.5 بوصة Super AMOLED · 120Hz", resolution: "1080 × 2340",
    battery: "5000 mAh · شحن 25W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 14 · One UI 6",
    software: "إصدار عالمي B · تحقق من CSC"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy A15", nameAr: "جالكسي A15", series: "Galaxy A",
    model: "SM-A155F", codename: "a15", year: 2023, chipset: "MediaTek Helio G99",
    display: "6.5 بوصة Super AMOLED · 90Hz", resolution: "1080 × 2340",
    battery: "5000 mAh · شحن 25W", memory: "4GB / 6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 14 · One UI 6",
    software: "إصدار F عالمي · تحقق من دعم 4G فقط"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy A14", nameAr: "جالكسي A14", series: "Galaxy A",
    model: "SM-A145F", codename: "a14", year: 2023, chipset: "MediaTek Helio G80",
    display: "6.6 بوصة PLS LCD · 90Hz", resolution: "1080 × 2408",
    battery: "5000 mAh · شحن 15W", memory: "4GB / 6GB RAM", storage: "64GB / 128GB",
    os: "Android 13 · One UI 5",
    software: "إصدار F عالمي · 4G فقط"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy M14 5G", nameAr: "جالكسي M14", series: "Galaxy M",
    model: "SM-M146B", codename: "m14x", year: 2023, chipset: "Exynos 1330",
    display: "6.6 بوصة PLS LCD · 90Hz", resolution: "1080 × 2408",
    battery: "6000 mAh · شحن 25W", memory: "4GB / 6GB RAM", storage: "128GB",
    os: "Android 13 · One UI 5",
    software: "إصدار M · تحقق من دعم الشبكات المحلية"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy Z Flip 5", nameAr: "جالكسي Z فليب 5", series: "Galaxy Z",
    model: "SM-F731B", codename: "b5", year: 2023, chipset: "Snapdragon 8 Gen 2 for Galaxy",
    display: "6.7 بوصة Dynamic AMOLED 2X · 120Hz + شاشة خارجية 3.4 بوصة", resolution: "1080 × 2640",
    battery: "3700 mAh · شحن 25W", memory: "8GB RAM", storage: "256GB / 512GB",
    os: "Android 13 · One UI 5.1.1",
    software: "إصدار عالمي B · حساسية المفصلة والفيلم الداخلي",
    partTypes: ["screen", "inner-screen", "hinge", "battery", "charging-port", "back-cover"],
    issueIds: ["screen-crack", "fold-hinge", "battery-drain", "charging-port", "bootloop", "overheat"]
  }),
  makePhone({
    brand: "samsung", name: "Galaxy Z Fold 5", nameAr: "جالكسي Z فولد 5", series: "Galaxy Z",
    model: "SM-F946B", codename: "q5", year: 2023, chipset: "Snapdragon 8 Gen 2 for Galaxy",
    display: "7.6 بوصة Dynamic AMOLED 2X · 120Hz + خارجية 6.2 بوصة", resolution: "1812 × 2176",
    battery: "4400 mAh · شحن 25W", memory: "12GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 13 · One UI 5.1.1",
    software: "إصدار عالمي B · روم OXM · حساسية المفصلة",
    partTypes: ["inner-screen", "screen", "hinge", "battery", "charging-port", "back-cover"],
    issueIds: ["fold-hinge", "screen-crack", "battery-drain", "charging-port", "bootloop", "overheat"]
  }),
  makePhone({
    brand: "samsung", name: "Galaxy Note 20 Ultra", nameAr: "جالكسي نوت 20 ألترا", series: "Galaxy Note",
    model: "SM-N986B", codename: "c2q", year: 2020, chipset: "Exynos 990",
    display: "6.9 بوصة Dynamic AMOLED 2X · 120Hz", resolution: "1440 × 3088",
    battery: "4500 mAh · شحن 25W", memory: "12GB RAM", storage: "256GB / 512GB",
    os: "Android 10 · One UI 2.5 (قابل للترقية)",
    software: "إصدار عالمي B · تحديثات أمنية متوقفة تدريجياً"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy S20 FE", nameAr: "جالكسي S20 FE", series: "Galaxy S",
    model: "SM-G780F", codename: "r8s", year: 2020, chipset: "Exynos 990",
    display: "6.5 بوصة Super AMOLED · 120Hz", resolution: "1080 × 2400",
    battery: "4500 mAh · شحن 25W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 10 · One UI 2.5",
    software: "إصدار F عالمي · تحقق من إصدار اللمس بعد التحديث",
    issueIds: ["screen-crack", "touch-issues", "battery-drain", "charging-port", "bootloop", "overheat"]
  }),
  makePhone({
    brand: "samsung", name: "Galaxy A52s 5G", nameAr: "جالكسي A52s", series: "Galaxy A",
    model: "SM-A528B", codename: "a52sxq", year: 2021, chipset: "Snapdragon 778G",
    display: "6.5 بوصة Super AMOLED · 120Hz", resolution: "1080 × 2400",
    battery: "4500 mAh · شحن 25W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 11 · One UI 3.1",
    software: "إصدار عالمي B · روم OXM"
  }),
  makePhone({
    brand: "samsung", name: "Galaxy A32", nameAr: "جالكسي A32", series: "Galaxy A",
    model: "SM-A325F", codename: "a32", year: 2021, chipset: "MediaTek Helio G80",
    display: "6.4 بوصة Super AMOLED · 90Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 15W", memory: "4GB / 6GB / 8GB RAM", storage: "64GB / 128GB",
    os: "Android 11 · One UI 3",
    software: "إصدار F عالمي · 4G فقط"
  }),

  /* ---------------- Xiaomi ---------------- */
  makePhone({
    brand: "xiaomi", name: "Xiaomi 14 Ultra", nameAr: "شاومي 14 ألترا", series: "Xiaomi Series",
    model: "24030PN60G", codename: "aurora", year: 2024, chipset: "Snapdragon 8 Gen 3",
    display: "6.73 بوصة LTPO AMOLED · 120Hz", resolution: "1440 × 3200",
    battery: "5300 mAh · شحن 90W", memory: "12GB / 16GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 14 · HyperOS",
    software: "روم عالمي (MI) · فك Bootloader عبر Mi Unlock وانتظار المدة",
    featured: true,
    summaryAr: "كاميرا Leica رباعية وفتحة عدسة متغيرة، مع شاشة 2K وشحن سريع.",
    summaryEn: "Leica quad-camera flagship with a variable aperture, 2K display, and 90W charging."
  }),
  makePhone({
    brand: "xiaomi", name: "Xiaomi 14", nameAr: "شاومي 14", series: "Xiaomi Series",
    model: "23127PN0CG", codename: "houji", year: 2023, chipset: "Snapdragon 8 Gen 3",
    display: "6.36 بوصة LTPO AMOLED · 120Hz", resolution: "1200 × 2670",
    battery: "4610 mAh · شحن 90W", memory: "8GB / 12GB / 16GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 14 · HyperOS",
    software: "روم عالمي · تحقق من إصدار HyperOS والمنطقة",
    featured: true
  }),
  makePhone({
    brand: "xiaomi", name: "Xiaomi 13", nameAr: "شاومي 13", series: "Xiaomi Series",
    model: "2211133G", codename: "fuxi", year: 2022, chipset: "Snapdragon 8 Gen 2",
    display: "6.36 بوصة AMOLED · 120Hz", resolution: "1080 × 2400",
    battery: "4500 mAh · شحن 67W", memory: "8GB / 12GB RAM", storage: "128GB / 256GB / 512GB",
    os: "Android 13 · MIUI 14",
    software: "روم عالمي · ترقية HyperOS متاحة حسب المنطقة"
  }),
  makePhone({
    brand: "xiaomi", name: "Xiaomi Mi 11", nameAr: "شاومي مي 11", series: "Mi Series",
    model: "M2011K2G", codename: "venus", year: 2021, chipset: "Snapdragon 888",
    display: "6.81 بوصة AMOLED · 120Hz", resolution: "1440 × 3200",
    battery: "4600 mAh · شحن 55W", memory: "8GB / 12GB RAM", storage: "128GB / 256GB",
    os: "Android 11 · MIUI 12",
    software: "روم عالمي · تحقق من مشكلة Wi-Fi الشائعة قبل الشراء"
  }),

  /* ---------------- Redmi ---------------- */
  makePhone({
    brand: "redmi", name: "Redmi Note 13 Pro 5G", nameAr: "ريد مي نوت 13 برو 5G", series: "Redmi Note",
    model: "2312DRA50G", codename: "garnet", year: 2024, chipset: "Snapdragon 7s Gen 2",
    display: "6.67 بوصة AMOLED · 120Hz", resolution: "1220 × 2712",
    battery: "5100 mAh · شحن 67W", memory: "8GB / 12GB RAM", storage: "128GB / 256GB / 512GB",
    os: "Android 13 · MIUI 14",
    software: "روم عالمي · تحقق من إصدار HyperOS والمنطقة",
    featured: true
  }),
  makePhone({
    brand: "redmi", name: "Redmi Note 13", nameAr: "ريد مي نوت 13", series: "Redmi Note",
    model: "23124RA7EO", codename: "sapphire", year: 2024, chipset: "MediaTek Helio G99",
    display: "6.67 بوصة AMOLED · 120Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 33W", memory: "6GB / 8GB / 12GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · MIUI 14",
    software: "روم عالمي · 4G فقط"
  }),
  makePhone({
    brand: "redmi", name: "Redmi Note 12", nameAr: "ريد مي نوت 12", series: "Redmi Note",
    model: "22111317G", codename: "tapas", year: 2023, chipset: "Snapdragon 685",
    display: "6.67 بوصة AMOLED · 120Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 33W", memory: "4GB / 6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 12 · MIUI 14",
    software: "روم عالمي · 4G فقط"
  }),
  makePhone({
    brand: "redmi", name: "Redmi Note 10 Pro", nameAr: "ريد مي نوت 10 برو", series: "Redmi Note",
    model: "M2101K6G", codename: "sweet", year: 2021, chipset: "Snapdragon 732G",
    display: "6.67 بوصة AMOLED · 120Hz", resolution: "1080 × 2400",
    battery: "5020 mAh · شحن 33W", memory: "6GB / 8GB RAM", storage: "64GB / 128GB",
    os: "Android 11 · MIUI 12",
    software: "روم عالمي · شائع في الصيانة وإعادة التفليش"
  }),
  makePhone({
    brand: "redmi", name: "Redmi 13C", nameAr: "ريد مي 13C", series: "Redmi Number",
    model: "23108RN04Y", codename: "gale", year: 2023, chipset: "MediaTek Helio G85",
    display: "6.74 بوصة IPS LCD · 90Hz", resolution: "720 × 1600",
    battery: "5000 mAh · شحن 18W", memory: "4GB / 6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · MIUI 14",
    software: "روم عالمي · 4G فقط"
  }),
  makePhone({
    brand: "redmi", name: "Redmi 12", nameAr: "ريد مي 12", series: "Redmi Number",
    model: "23053RN02A", codename: "fire", year: 2023, chipset: "MediaTek Helio G88",
    display: "6.79 بوصة IPS LCD · 90Hz", resolution: "1080 × 2460",
    battery: "5000 mAh · شحن 18W", memory: "4GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · MIUI 14",
    software: "روم عالمي · 4G فقط"
  }),
  makePhone({
    brand: "redmi", name: "Redmi Note 9", nameAr: "ريد مي نوت 9", series: "Redmi Note",
    model: "M2003J15SC", codename: "merlin", year: 2020, chipset: "MediaTek Helio G85",
    display: "6.53 بوصة IPS LCD", resolution: "1080 × 2340",
    battery: "5020 mAh · شحن 18W", memory: "3GB / 4GB / 6GB RAM", storage: "64GB / 128GB",
    os: "Android 10 · MIUI 11",
    software: "روم عالمي · 4G فقط · شائع في الصيانة"
  }),

  /* ---------------- POCO ---------------- */
  makePhone({
    brand: "poco", name: "POCO F6", nameAr: "بوكو F6", series: "POCO F",
    model: "24069PC21G", codename: "peridot", year: 2024, chipset: "Snapdragon 8s Gen 3",
    display: "6.67 بوصة AMOLED · 120Hz", resolution: "1220 × 2712",
    battery: "5000 mAh · شحن 90W", memory: "8GB / 12GB RAM", storage: "256GB / 512GB",
    os: "Android 14 · HyperOS",
    software: "روم عالمي · تحقق من إصدار HyperOS قبل التفليش",
    featured: true
  }),
  makePhone({
    brand: "poco", name: "POCO F5", nameAr: "بوكو F5", series: "POCO F",
    model: "23049PCD8G", codename: "marble", year: 2023, chipset: "Snapdragon 7+ Gen 2",
    display: "6.67 بوصة AMOLED · 120Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 67W", memory: "8GB / 12GB RAM", storage: "256GB",
    os: "Android 13 · MIUI 14",
    software: "روم عالمي · HyperOS متاح حسب المنطقة"
  }),
  makePhone({
    brand: "poco", name: "POCO X6 Pro 5G", nameAr: "بوكو X6 برو", series: "POCO X",
    model: "2311DRK48G", codename: "duchamp", year: 2024, chipset: "MediaTek Dimensity 8300 Ultra",
    display: "6.67 بوصة AMOLED · 120Hz", resolution: "1220 × 2712",
    battery: "5000 mAh · شحن 67W", memory: "8GB / 12GB RAM", storage: "256GB / 512GB",
    os: "Android 14 · HyperOS",
    software: "روم عالمي · نفس خط Redmi K70E الصيني",
    featured: true
  }),
  makePhone({
    brand: "poco", name: "POCO X3 NFC", nameAr: "بوكو X3 NFC", series: "POCO X",
    model: "M2007J20CG", codename: "surya", year: 2020, chipset: "Snapdragon 732G",
    display: "6.67 بوصة IPS LCD · 120Hz", resolution: "1080 × 2400",
    battery: "5160 mAh · شحن 33W", memory: "6GB / 8GB RAM", storage: "64GB / 128GB",
    os: "Android 10 · MIUI 12",
    software: "روم عالمي · شائع في الصيانة · تحقق من إصدار اللمس"
  }),

  /* ---------------- Huawei ---------------- */
  makePhone({
    brand: "huawei", name: "Huawei P60 Pro", nameAr: "هواوي P60 برو", series: "P Series",
    model: "MNA-LX9", codename: "mondrian", year: 2023, chipset: "Snapdragon 8+ Gen 1 4G",
    display: "6.67 بوصة LTPO OLED · 120Hz", resolution: "1220 × 2700",
    battery: "4815 mAh · شحن 88W", memory: "8GB / 12GB RAM", storage: "256GB / 512GB",
    os: "Android 13 · EMUI 13.1 (بدون خدمات Google)",
    software: "إصدار عالمي · لا يدعم Google Play افتراضياً · تحقق من إصدار EMUI",
    featured: true
  }),
  makePhone({
    brand: "huawei", name: "Huawei Mate 60 Pro", nameAr: "هواوي ميت 60 برو", series: "Mate Series",
    model: "ALN-AL00", codename: "ALN", year: 2023, chipset: "Kirin 9000S",
    display: "6.82 بوصة LTPO OLED · 120Hz", resolution: "1260 × 2720",
    battery: "5000 mAh · شحن 88W", memory: "12GB RAM", storage: "256GB / 512GB / 1TB",
    os: "HarmonyOS 4.0",
    software: "إصدار صيني · تحقق من توافق الشبكات والخدمات قبل الاستيراد"
  }),
  makePhone({
    brand: "huawei", name: "Huawei Nova 11 Pro", nameAr: "هواوي نوفا 11 برو", series: "Nova Series",
    model: "GOA-LX9", codename: "Gloria", year: 2023, chipset: "Snapdragon 778G 4G",
    display: "6.78 بوصة OLED · 120Hz", resolution: "1200 × 2652",
    battery: "4500 mAh · شحن 100W", memory: "8GB RAM", storage: "256GB / 512GB",
    os: "HarmonyOS 3.0",
    software: "إصدار عالمي · بدون خدمات Google · تحقق من إصدار HarmonyOS"
  }),
  makePhone({
    brand: "huawei", name: "Huawei P30 Pro", nameAr: "هواوي P30 برو", series: "P Series",
    model: "VOG-L29", codename: "Vogue", year: 2019, chipset: "Kirin 980",
    display: "6.47 بوصة OLED", resolution: "1080 × 2340",
    battery: "4200 mAh · شحن 40W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB / 512GB",
    os: "Android 9 · EMUI 9.1",
    software: "إصدار عالمي · تحديثات أمنية قد تكون متوقفة",
    partTypes: ["screen", "battery", "charging-port", "back-cover", "camera-glass"],
    issueIds: ["screen-crack", "battery-drain", "charging-port", "bootloop", "camera-blur", "water-damage"]
  }),

  /* ---------------- Honor ---------------- */
  makePhone({
    brand: "honor", name: "Honor Magic5 Pro", nameAr: "هونر ماجيك 5 برو", series: "Magic Series",
    model: "PGT-N19", codename: "Piaget", year: 2023, chipset: "Snapdragon 8 Gen 2",
    display: "6.81 بوصة LTPO OLED · 120Hz", resolution: "1312 × 2848",
    battery: "5100 mAh · شحن 66W", memory: "12GB RAM", storage: "256GB / 512GB",
    os: "Android 13 · MagicOS 7.1",
    software: "إصدار عالمي · خدمات Google متاحة حسب المنطقة",
    featured: true
  }),
  makePhone({
    brand: "honor", name: "Honor 90", nameAr: "هونر 90", series: "Number Series",
    model: "REA-NX9", codename: "Real", year: 2023, chipset: "Snapdragon 7 Gen 1 Accelerated",
    display: "6.7 بوصة AMOLED · 120Hz", resolution: "1200 × 2664",
    battery: "5000 mAh · شحن 66W", memory: "8GB / 12GB RAM", storage: "256GB / 512GB",
    os: "Android 13 · MagicOS 7.1",
    software: "إصدار عالمي · تحقق من خدمات Google"
  }),
  makePhone({
    brand: "honor", name: "Honor X9b", nameAr: "هونر X9b", series: "X Series",
    model: "ALI-NX1", codename: "Ali", year: 2023, chipset: "Snapdragon 6 Gen 1",
    display: "6.78 بوصة AMOLED · 120Hz", resolution: "1200 × 2652",
    battery: "5800 mAh · شحن 35W", memory: "8GB / 12GB RAM", storage: "256GB",
    os: "Android 13 · MagicOS 7.2",
    software: "إصدار عالمي · شاشة مقاومة للسقوط حسب تسويق الشركة"
  }),

  /* ---------------- OPPO ---------------- */
  makePhone({
    brand: "oppo", name: "OPPO Find X6 Pro", nameAr: "أوبو فايند X6 برو", series: "Find X",
    model: "PGEM10", codename: "غير معلن", year: 2023, chipset: "Snapdragon 8 Gen 2",
    display: "6.82 بوصة LTPO3 AMOLED · 120Hz", resolution: "1440 × 3168",
    battery: "5000 mAh · شحن 100W", memory: "12GB / 16GB RAM", storage: "256GB / 512GB",
    os: "Android 13 · ColorOS 13.1",
    software: "إصدار صيني/عالمي حسب السوق · تحقق من إصدار ColorOS",
    featured: true
  }),
  makePhone({
    brand: "oppo", name: "OPPO Reno 11 5G", nameAr: "أوبو رينو 11", series: "Reno",
    model: "CPH2599", codename: "غير معلن", year: 2023, chipset: "MediaTek Dimensity 8200",
    display: "6.7 بوصة AMOLED · 120Hz", resolution: "1080 × 2412",
    battery: "5000 mAh · شحن 67W", memory: "8GB / 12GB RAM", storage: "256GB",
    os: "Android 14 · ColorOS 14",
    software: "إصدار عالمي · تحقق من رقم الموديل CPH2599"
  }),
  makePhone({
    brand: "oppo", name: "OPPO Reno 8", nameAr: "أوبو رينو 8", series: "Reno",
    model: "CPH2359", codename: "غير معلن", year: 2022, chipset: "MediaTek Dimensity 1300",
    display: "6.4 بوصة AMOLED · 90Hz", resolution: "1080 × 2400",
    battery: "4500 mAh · شحن 80W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 12 · ColorOS 12.1",
    software: "إصدار عالمي · تحقق من إصدار ColorOS"
  }),
  makePhone({
    brand: "oppo", name: "OPPO A78", nameAr: "أوبو A78", series: "A Series",
    model: "CPH2565", codename: "غير معلن", year: 2023, chipset: "Snapdragon 680",
    display: "6.43 بوصة AMOLED · 90Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 67W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · ColorOS 13.1",
    software: "إصدار عالمي · 4G فقط"
  }),
  makePhone({
    brand: "oppo", name: "OPPO A58", nameAr: "أوبو A58", series: "A Series",
    model: "CPH2577", codename: "غير معلن", year: 2023, chipset: "MediaTek Helio G85",
    display: "6.72 بوصة IPS LCD · 90Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 33W", memory: "6GB / 8GB RAM", storage: "128GB",
    os: "Android 13 · ColorOS 13.1",
    software: "إصدار عالمي · 4G فقط"
  }),

  /* ---------------- vivo ---------------- */
  makePhone({
    brand: "vivo", name: "vivo X100 Pro", nameAr: "فيفو X100 برو", series: "X Series",
    model: "V2324A", codename: "غير معلن", year: 2023, chipset: "MediaTek Dimensity 9300",
    display: "6.78 بوصة LTPO AMOLED · 120Hz", resolution: "1260 × 2800",
    battery: "5400 mAh · شحن 100W", memory: "12GB / 16GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 14 · OriginOS 4 / Funtouch 14",
    software: "إصدار صيني/عالمي حسب السوق · تحقق من Funtouch",
    featured: true
  }),
  makePhone({
    brand: "vivo", name: "vivo V29 5G", nameAr: "فيفو V29", series: "V Series",
    model: "V2250", codename: "غير معلن", year: 2023, chipset: "Snapdragon 778G",
    display: "6.78 بوصة AMOLED · 120Hz", resolution: "1260 × 2800",
    battery: "4600 mAh · شحن 80W", memory: "8GB / 12GB RAM", storage: "256GB / 512GB",
    os: "Android 13 · Funtouch 13",
    software: "إصدار عالمي · تحقق من رقم الموديل"
  }),
  makePhone({
    brand: "vivo", name: "vivo Y36", nameAr: "فيفو Y36", series: "Y Series",
    model: "V2247", codename: "غير معلن", year: 2023, chipset: "MediaTek Dimensity 6020",
    display: "6.64 بوصة IPS LCD · 90Hz", resolution: "1080 × 2388",
    battery: "5000 mAh · شحن 44W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · Funtouch 13",
    software: "إصدار عالمي · 5G حسب النسخة"
  }),
  makePhone({
    brand: "vivo", name: "vivo Y27 5G", nameAr: "فيفو Y27 5G", series: "Y Series",
    model: "V2244", codename: "غير معلن", year: 2023, chipset: "MediaTek Dimensity 6020",
    display: "6.64 بوصة IPS LCD · 90Hz", resolution: "1080 × 2388",
    battery: "5000 mAh · شحن 15W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · Funtouch 13",
    software: "إصدار عالمي · تحقق من دعم 5G المحلي"
  }),

  /* ---------------- realme ---------------- */
  makePhone({
    brand: "realme", name: "realme GT 5 Pro", nameAr: "ريلمي GT 5 برو", series: "GT Series",
    model: "RMX3888", codename: "غير معلن", year: 2023, chipset: "Snapdragon 8 Gen 3",
    display: "6.78 بوصة LTPO AMOLED · 144Hz", resolution: "1264 × 2780",
    battery: "5400 mAh · شحن 100W", memory: "12GB / 16GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 14 · realme UI 5",
    software: "إصدار صيني/عالمي حسب السوق · تحقق من RMX3888",
    featured: true
  }),
  makePhone({
    brand: "realme", name: "realme 12 Pro+ 5G", nameAr: "ريلمي 12 برو بلس", series: "Number Series",
    model: "RMX3820", codename: "غير معلن", year: 2024, chipset: "Snapdragon 7s Gen 2",
    display: "6.7 بوصة AMOLED · 120Hz", resolution: "1080 × 2412",
    battery: "5000 mAh · شحن 67W", memory: "8GB / 12GB RAM", storage: "128GB / 256GB / 512GB",
    os: "Android 14 · realme UI 5",
    software: "إصدار عالمي · تحقق من رقم الموديل"
  }),
  makePhone({
    brand: "realme", name: "realme C55", nameAr: "ريلمي C55", series: "C Series",
    model: "RMX3710", codename: "غير معلن", year: 2023, chipset: "MediaTek Helio G88",
    display: "6.72 بوصة IPS LCD · 90Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 33W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · realme UI 4",
    software: "إصدار عالمي · 4G فقط"
  }),
  makePhone({
    brand: "realme", name: "realme Narzo 60 Pro 5G", nameAr: "ريلمي نارزو 60 برو", series: "Narzo",
    model: "RMX3771", codename: "غير معلن", year: 2023, chipset: "MediaTek Dimensity 7050",
    display: "6.7 بوصة AMOLED · 120Hz", resolution: "1080 × 2412",
    battery: "5000 mAh · شحن 67W", memory: "8GB / 12GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · realme UI 4",
    software: "إصدار هندي/عالمي حسب السوق"
  }),

  /* ---------------- OnePlus ---------------- */
  makePhone({
    brand: "oneplus", name: "OnePlus 12", nameAr: "ون بلس 12", series: "OnePlus Flagship",
    model: "CPH2581", codename: "waffle", year: 2024, chipset: "Snapdragon 8 Gen 3",
    display: "6.82 بوصة LTPO AMOLED · 120Hz", resolution: "1440 × 3168",
    battery: "5400 mAh · شحن 100W", memory: "12GB / 16GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 14 · OxygenOS 14",
    software: "إصدار عالمي · تحقق من CPH2581 وإصدار OxygenOS",
    featured: true
  }),
  makePhone({
    brand: "oneplus", name: "OnePlus 11", nameAr: "ون بلس 11", series: "OnePlus Flagship",
    model: "CPH2449", codename: "salami", year: 2023, chipset: "Snapdragon 8 Gen 2",
    display: "6.7 بوصة LTPO3 AMOLED · 120Hz", resolution: "1440 × 3216",
    battery: "5000 mAh · شحن 100W", memory: "8GB / 16GB RAM", storage: "128GB / 256GB / 512GB",
    os: "Android 13 · OxygenOS 13",
    software: "إصدار عالمي · تحقق من إصدار البناء"
  }),
  makePhone({
    brand: "oneplus", name: "OnePlus Nord 3", nameAr: "ون بلس نورد 3", series: "Nord",
    model: "CPH2493", codename: "غير معلن", year: 2023, chipset: "MediaTek Dimensity 9000",
    display: "6.74 بوصة AMOLED · 120Hz", resolution: "1240 × 2772",
    battery: "5000 mAh · شحن 80W", memory: "8GB / 16GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · OxygenOS 13.1",
    software: "إصدار عالمي · تحقق من رقم الموديل"
  }),
  makePhone({
    brand: "oneplus", name: "OnePlus Nord CE 3 Lite", nameAr: "ون بلس نورد CE 3 لايت", series: "Nord CE",
    model: "CPH2467", codename: "غير معلن", year: 2023, chipset: "Snapdragon 695",
    display: "6.72 بوصة IPS LCD · 120Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 67W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · OxygenOS 13.1",
    software: "إصدار عالمي · 5G حسب المنطقة"
  }),

  /* ---------------- Apple ---------------- */
  makePhone({
    brand: "apple", name: "iPhone 15 Pro Max", nameAr: "آيفون 15 برو ماكس", series: "iPhone Pro Max",
    model: "A2849 / A3105 / A3106 / A3108", codename: "D84", year: 2023, chipset: "Apple A17 Pro",
    display: "6.7 بوصة Super Retina XDR OLED · 120Hz", resolution: "1290 × 2796",
    battery: "4441 mAh · شحن 20W", memory: "8GB RAM", storage: "256GB / 512GB / 1TB",
    os: "iOS 17",
    software: "تحقق من رقم الموديل والمنطقة · لا يوجد تفليش يدوي · استخدم Finder/iTunes",
    featured: true,
    summaryAr: "إطار تيتانيوم، منفذ USB-C، ومعالج A17 Pro. من أكثر الأجهزة طلباً في الصيانة.",
    summaryEn: "Titanium flagship with USB-C and the A17 Pro chip, widely requested for repair."
  }),
  makePhone({
    brand: "apple", name: "iPhone 14", nameAr: "آيفون 14", series: "iPhone",
    model: "A2882 / A2649 / A2881 / A2884", codename: "D27", year: 2022, chipset: "Apple A15 Bionic",
    display: "6.1 بوصة Super Retina XDR OLED", resolution: "1170 × 2532",
    battery: "3279 mAh · شحن 20W", memory: "6GB RAM", storage: "128GB / 256GB / 512GB",
    os: "iOS 16",
    software: "تحقق من رقم الموديل · استخدم Finder/iTunes للاستعادة",
    partTypes: ["screen", "battery", "charging-port", "back-glass", "camera-glass", "face-id"],
    issueIds: ["screen-crack", "battery-drain", "charging-port", "bootloop", "camera-blur", "water-damage"]
  }),
  makePhone({
    brand: "apple", name: "iPhone 13", nameAr: "آيفون 13", series: "iPhone",
    model: "A2633 / A2482 / A2631 / A2634", codename: "D16", year: 2021, chipset: "Apple A15 Bionic",
    display: "6.1 بوصة Super Retina XDR OLED", resolution: "1170 × 2532",
    battery: "3240 mAh · شحن 20W", memory: "4GB RAM", storage: "128GB / 256GB / 512GB",
    os: "iOS 15",
    software: "تحقق من رقم الموديل · استخدم Finder/iTunes للاستعادة",
    partTypes: ["screen", "battery", "charging-port", "back-glass", "camera-glass", "face-id"],
    issueIds: ["screen-crack", "battery-drain", "charging-port", "bootloop", "camera-blur", "water-damage"]
  }),
  makePhone({
    brand: "apple", name: "iPhone 12", nameAr: "آيفون 12", series: "iPhone",
    model: "A2402 / A2172 / A2403 / A2404", codename: "D53g", year: 2020, chipset: "Apple A14 Bionic",
    display: "6.1 بوصة Super Retina XDR OLED", resolution: "1170 × 2532",
    battery: "2815 mAh · شحن 20W", memory: "4GB RAM", storage: "64GB / 128GB / 256GB",
    os: "iOS 14",
    software: "تحقق من رقم الموديل · استخدم Finder/iTunes للاستعادة",
    partTypes: ["screen", "battery", "charging-port", "back-glass", "camera-glass", "face-id"],
    issueIds: ["screen-crack", "battery-drain", "charging-port", "bootloop", "camera-blur", "water-damage"]
  }),
  makePhone({
    brand: "apple", name: "iPhone 11", nameAr: "آيفون 11", series: "iPhone",
    model: "A2221 / A2111 / A2223", codename: "N104", year: 2019, chipset: "Apple A13 Bionic",
    display: "6.1 بوصة Liquid Retina IPS LCD", resolution: "828 × 1792",
    battery: "3110 mAh · شحن 18W", memory: "4GB RAM", storage: "64GB / 128GB / 256GB",
    os: "iOS 13",
    software: "تحقق من رقم الموديل · استخدم Finder/iTunes للاستعادة",
    partTypes: ["screen", "battery", "charging-port", "back-glass", "camera-glass", "face-id"],
    issueIds: ["screen-crack", "battery-drain", "charging-port", "bootloop", "camera-blur", "water-damage"]
  }),

  /* ---------------- TECNO ---------------- */
  makePhone({
    brand: "tecno", name: "TECNO Camon 30 Pro 5G", nameAr: "تكنو كامون 30 برو", series: "Camon",
    model: "CL8", codename: "CL8-OP", year: 2024, chipset: "MediaTek Dimensity 8200 Ultimate",
    display: "6.78 بوصة AMOLED · 144Hz", resolution: "1080 × 2436",
    battery: "5000 mAh · شحن 70W", memory: "12GB RAM", storage: "256GB / 512GB",
    os: "Android 14 · HiOS 14",
    software: "إصدار عالمي · تحقق من CL8 وإصدار HiOS",
    featured: true
  }),
  makePhone({
    brand: "tecno", name: "TECNO Camon 20 Pro 5G", nameAr: "تكنو كامون 20 برو", series: "Camon",
    model: "CK8n", codename: "CK8n", year: 2023, chipset: "MediaTek Dimensity 8050",
    display: "6.67 بوصة AMOLED · 120Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 33W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · HiOS 13",
    software: "إصدار عالمي · تحقق من CK8n"
  }),
  makePhone({
    brand: "tecno", name: "TECNO Pova 6 Pro 5G", nameAr: "تكنو بوفا 6 برو", series: "Pova",
    model: "LI9", codename: "LI9", year: 2024, chipset: "MediaTek Dimensity 6080",
    display: "6.78 بوصة AMOLED · 120Hz", resolution: "1080 × 2436",
    battery: "6000 mAh · شحن 70W", memory: "8GB / 12GB RAM", storage: "256GB",
    os: "Android 14 · HiOS 14",
    software: "إصدار عالمي · تحقق من LI9"
  }),

  /* ---------------- Infinix ---------------- */
  makePhone({
    brand: "infinix", name: "Infinix Note 40 Pro 5G", nameAr: "إنفينكس نوت 40 برو", series: "Note",
    model: "X6851", codename: "X6851-OP", year: 2024, chipset: "MediaTek Dimensity 7020",
    display: "6.78 بوصة AMOLED · 120Hz", resolution: "1080 × 2436",
    battery: "5000 mAh · شحن 45W", memory: "8GB / 12GB RAM", storage: "256GB",
    os: "Android 14 · XOS 14",
    software: "إصدار عالمي · تحقق من X6851 وإصدار XOS",
    featured: true
  }),
  makePhone({
    brand: "infinix", name: "Infinix Zero 30 5G", nameAr: "إنفينكس زيرو 30", series: "Zero",
    model: "X6731", codename: "غير معلن", year: 2023, chipset: "MediaTek Dimensity 8020",
    display: "6.78 بوصة AMOLED · 144Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 68W", memory: "12GB RAM", storage: "256GB",
    os: "Android 13 · XOS 13",
    software: "إصدار عالمي · تحقق من X6731"
  }),
  makePhone({
    brand: "infinix", name: "Infinix Hot 40 Pro", nameAr: "إنفينكس هوت 40 برو", series: "Hot",
    model: "X6837", codename: "غير معلن", year: 2023, chipset: "MediaTek Helio G99",
    display: "6.78 بوصة IPS LCD · 120Hz", resolution: "1080 × 2460",
    battery: "5000 mAh · شحن 33W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · XOS 13",
    software: "إصدار عالمي · 4G فقط"
  }),

  /* ---------------- itel ---------------- */
  makePhone({
    brand: "itel", name: "itel P55 5G", nameAr: "آيتل P55 5G", series: "P Series",
    model: "P661N", codename: "غير معلن", year: 2024, chipset: "MediaTek Dimensity 6080",
    display: "6.6 بوصة IPS LCD · 90Hz", resolution: "720 × 1612",
    battery: "5000 mAh · شحن 18W", memory: "6GB RAM", storage: "128GB",
    os: "Android 13 · itel OS 13",
    software: "إصدار عالمي · تحقق من دعم 5G المحلي"
  }),

  /* ---------------- ZTE / Nubia ---------------- */
  makePhone({
    brand: "zte", name: "ZTE Axon 50 Ultra", nameAr: "زد تي إي أكسون 50 ألترا", series: "Axon",
    model: "A2023PG", codename: "غير معلن", year: 2023, chipset: "Snapdragon 8+ Gen 1",
    display: "6.73 بوصة AMOLED · 120Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 80W", memory: "12GB RAM", storage: "256GB / 512GB",
    os: "Android 13 · MyOS 13",
    software: "إصدار صيني/عالمي حسب السوق · تحقق من A2023PG"
  }),
  makePhone({
    brand: "nubia", name: "Nubia Z60 Ultra", nameAr: "نوبيا Z60 ألترا", series: "Z Series",
    model: "NX721J", codename: "غير معلن", year: 2023, chipset: "Snapdragon 8 Gen 3",
    display: "6.8 بوصة AMOLED · 120Hz", resolution: "1116 × 2480",
    battery: "6000 mAh · شحن 80W", memory: "12GB / 16GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 14 · MyOS 14",
    software: "إصدار صيني/عالمي حسب السوق · تحقق من NX721J",
    featured: true
  }),
  makePhone({
    brand: "nubia", name: "Nubia Red Magic 9 Pro", nameAr: "نوبيا ريد ماجيك 9 برو", series: "Red Magic",
    model: "NX769J", codename: "غير معلن", year: 2023, chipset: "Snapdragon 8 Gen 3",
    display: "6.8 بوصة AMOLED · 120Hz", resolution: "1116 × 2480",
    battery: "6500 mAh · شحن 80W", memory: "12GB / 16GB RAM", storage: "256GB / 512GB / 1TB",
    os: "Android 14 · RedMagic OS 9",
    software: "إصدار صيني/عالمي حسب السوق · تحقق من NX769J"
  }),

  /* ---------------- Motorola ---------------- */
  makePhone({
    brand: "motorola", name: "Motorola Edge 40 Pro", nameAr: "موتورولا إيدج 40 برو", series: "Edge",
    model: "XT2301-4", codename: "غير معلن", year: 2023, chipset: "Snapdragon 8 Gen 2",
    display: "6.67 بوصة OLED · 165Hz", resolution: "1080 × 2400",
    battery: "4600 mAh · شحن 125W", memory: "12GB RAM", storage: "256GB / 512GB",
    os: "Android 13 · My UX",
    software: "إصدار عالمي · تحقق من XT2301-4",
    featured: true
  }),
  makePhone({
    brand: "motorola", name: "Motorola Edge 50 Pro", nameAr: "موتورولا إيدج 50 برو", series: "Edge",
    model: "XT2403-2", codename: "غير معلن", year: 2024, chipset: "Snapdragon 7 Gen 3",
    display: "6.7 بوصة pOLED · 144Hz", resolution: "1220 × 2712",
    battery: "4500 mAh · شحن 125W", memory: "12GB RAM", storage: "512GB",
    os: "Android 14 · My UX",
    software: "إصدار عالمي · تحقق من XT2403-2"
  }),
  makePhone({
    brand: "motorola", name: "Moto G84 5G", nameAr: "موتو G84", series: "Moto G",
    model: "XT2347-2", codename: "غير معلن", year: 2023, chipset: "Snapdragon 695",
    display: "6.55 بوصة pOLED · 120Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 30W", memory: "8GB / 12GB RAM", storage: "256GB",
    os: "Android 13 · My UX",
    software: "إصدار عالمي · تحقق من XT2347-2"
  }),
  makePhone({
    brand: "motorola", name: "Moto G54 5G", nameAr: "موتو G54", series: "Moto G",
    model: "XT2343-3", codename: "غير معلن", year: 2023, chipset: "MediaTek Dimensity 7020",
    display: "6.5 بوصة IPS LCD · 120Hz", resolution: "1080 × 2400",
    battery: "5000 mAh · شحن 15W", memory: "8GB / 12GB RAM", storage: "128GB / 256GB",
    os: "Android 13 · My UX",
    software: "إصدار عالمي · تحقق من XT2343-3"
  }),

  /* ---------------- Nokia ---------------- */
  makePhone({
    brand: "nokia", name: "Nokia X30 5G", nameAr: "نوكيا X30", series: "X Series",
    model: "TA-1450", codename: "غير معلن", year: 2022, chipset: "Snapdragon 695",
    display: "6.43 بوصة AMOLED · 90Hz", resolution: "1080 × 2400",
    battery: "4200 mAh · شحن 33W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 12",
    software: "إصدار عالمي · تحديثات Android One · تحقق من TA-1450"
  }),
  makePhone({
    brand: "nokia", name: "Nokia G42 5G", nameAr: "نوكيا G42", series: "G Series",
    model: "TA-1581", codename: "غير معلن", year: 2023, chipset: "Snapdragon 480+",
    display: "6.56 بوصة IPS LCD · 90Hz", resolution: "720 × 1612",
    battery: "5000 mAh · شحن 20W", memory: "6GB / 8GB RAM", storage: "128GB / 256GB",
    os: "Android 13",
    software: "إصدار عالمي · شاشة قابلة للإصلاح حسب تصميم Nokia"
  }),
  makePhone({
    brand: "nokia", name: "Nokia C32", nameAr: "نوكيا C32", series: "C Series",
    model: "TA-1534", codename: "غير معلن", year: 2023, chipset: "Unisoc SC9863A1",
    display: "6.5 بوصة IPS LCD", resolution: "720 × 1600",
    battery: "5000 mAh · شحن 10W", memory: "3GB / 4GB RAM", storage: "64GB / 128GB",
    os: "Android 13",
    software: "إصدار عالمي · 4G فقط"
  }),

  /* ---------------- LG ---------------- */
  makePhone({
    brand: "lg", name: "LG Velvet 5G", nameAr: "إل جي فيلفيت", series: "Velvet",
    model: "LM-G900", codename: "غير معلن", year: 2020, chipset: "Snapdragon 765G",
    display: "6.8 بوصة P-OLED", resolution: "1080 × 2460",
    battery: "4300 mAh · شحن 25W", memory: "6GB / 8GB RAM", storage: "128GB",
    os: "Android 10",
    software: "إصدار عالمي · دعم رسمي منتهي · تحقق من LM-G900"
  }),
  makePhone({
    brand: "lg", name: "LG Wing 5G", nameAr: "إل جي وينج", series: "Wing",
    model: "LM-F100", codename: "غير معلن", year: 2020, chipset: "Snapdragon 765G",
    display: "6.8 بوصة P-OLED دوّار + 3.9 بوصة", resolution: "1080 × 2460",
    battery: "4000 mAh · شحن 25W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 10",
    software: "إصدار عالمي · قطعة الشاشة الدوارة نادرة · تحقق من LM-F100",
    partTypes: ["screen", "swivel-screen", "battery", "charging-port", "back-cover"],
    issueIds: ["screen-crack", "hinge", "battery-drain", "charging-port", "bootloop", "overheat"]
  }),
  makePhone({
    brand: "lg", name: "LG V60 ThinQ 5G", nameAr: "إل جي V60", series: "V Series",
    model: "LM-V600", codename: "غير معلن", year: 2020, chipset: "Snapdragon 865",
    display: "6.8 بوصة P-OLED", resolution: "1080 × 2460",
    battery: "5000 mAh · شحن 25W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 10",
    software: "إصدار عالمي · دعم رسمي منتهي · تحقق من LM-V600"
  }),

  /* ---------------- Google Pixel ---------------- */
  makePhone({
    brand: "google", name: "Google Pixel 8 Pro", nameAr: "جوجل بكسل 8 برو", series: "Pixel Pro",
    model: "GC3VE", codename: "husky", year: 2023, chipset: "Google Tensor G3",
    display: "6.7 بوصة LTPO OLED · 120Hz", resolution: "1344 × 2992",
    battery: "5050 mAh · شحن 30W", memory: "12GB RAM", storage: "128GB / 256GB / 512GB / 1TB",
    os: "Android 14",
    software: "صور رسمية من Google · فك Bootloader مدعوم · تحقق من GC3VE",
    featured: true
  }),
  makePhone({
    brand: "google", name: "Google Pixel 8", nameAr: "جوجل بكسل 8", series: "Pixel",
    model: "GKWS6", codename: "shiba", year: 2023, chipset: "Google Tensor G3",
    display: "6.2 بوصة OLED · 120Hz", resolution: "1080 × 2400",
    battery: "4575 mAh · شحن 27W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 14",
    software: "صور رسمية من Google · 7 سنوات تحديثات · تحقق من GKWS6"
  }),
  makePhone({
    brand: "google", name: "Google Pixel 7 Pro", nameAr: "جوجل بكسل 7 برو", series: "Pixel Pro",
    model: "GE2AE", codename: "cheetah", year: 2022, chipset: "Google Tensor G2",
    display: "6.7 بوصة LTPO OLED · 120Hz", resolution: "1440 × 3120",
    battery: "5000 mAh · شحن 23W", memory: "12GB RAM", storage: "128GB / 256GB / 512GB",
    os: "Android 13",
    software: "صور رسمية من Google · تحقق من GE2AE"
  }),
  makePhone({
    brand: "google", name: "Google Pixel 7", nameAr: "جوجل بكسل 7", series: "Pixel",
    model: "GVU6C", codename: "panther", year: 2022, chipset: "Google Tensor G2",
    display: "6.3 بوصة OLED · 90Hz", resolution: "1080 × 2400",
    battery: "4355 mAh · شحن 20W", memory: "8GB RAM", storage: "128GB / 256GB",
    os: "Android 13",
    software: "صور رسمية من Google · تحقق من GVU6C"
  }),
  makePhone({
    brand: "google", name: "Google Pixel 6a", nameAr: "جوجل بكسل 6a", series: "Pixel A",
    model: "GX7AS", codename: "bluejay", year: 2022, chipset: "Google Tensor",
    display: "6.1 بوصة OLED · 60Hz", resolution: "1080 × 2400",
    battery: "4410 mAh · شحن 18W", memory: "6GB RAM", storage: "128GB",
    os: "Android 12",
    software: "صور رسمية من Google · تحقق من GX7AS"
  })
];

export const phoneById = Object.fromEntries(phones.map((phone) => [phone.id, phone]));

export function phonesByBrand(brandId) {
  return phones.filter((phone) => phone.brand === brandId);
}
