export const suppliers = [
  {
    id: "brxvih",
    name: "BRXVIH",
    nameAr: "BRXVIH — يوسف الهدار",
    nameEn: "BRXVIH — Yousef Al-Haddar",
    type: "service",
    city: "اليمن",
    country: "اليمن",
    phone: "+967777066424",
    whatsapp: "967777066424",
    url: "",
    verified: true,
    noteAr: "خدمة صيانة وتوريد قطع. الأسعار المحلية تُضاف بعد الفحص والتحقق من القطعة.",
    noteEn: "Repair and parts service. Local prices are added after inspection and part verification.",
    reviewedAt: "2026-10-27"
  },
  {
    id: "ifixit",
    name: "iFixit",
    nameAr: "iFixit",
    nameEn: "iFixit",
    type: "reference",
    city: "دولي",
    country: "الولايات المتحدة",
    phone: "",
    whatsapp: "",
    url: "https://www.ifixit.com/",
    verified: true,
    noteAr: "مورد عالمي مرجعي لقطع وأدلة الصيانة. الأسعار بالدولار قبل الشحن والجمارك، وليست سعر السوق اليمني.",
    noteEn: "Global reference supplier for parts and repair guides. Prices are in USD before shipping and customs, not Yemeni market prices.",
    reviewedAt: "2026-10-27"
  }
];

export const supplierById = Object.fromEntries(suppliers.map((supplier) => [supplier.id, supplier]));
