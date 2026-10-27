export const siteConfig = {
  brand: "BRXVIH",
  name: "brxvih",
  realName: "يوسف الهدار",
  displayName: "brxvih | يوسف الهدار",
  phone: "+967777066424",
  phoneDisplay: "+967 777 066 424",
  whatsapp: "967777066424",
  location: "اليمن",
  siteUrl: "https://omgithub.com/Youssefalhderali/PlayGround/",
  email: "",
  social: {
    whatsapp: "https://wa.me/967777066424",
    github: "https://github.com/Youssefalhderali"
  }
};

export const currencies = [
  { code: "YER", nameAr: "ريال يمني", nameEn: "Yemeni Rial", symbol: "ر.ي" },
  { code: "SAR", nameAr: "ريال سعودي", nameEn: "Saudi Riyal", symbol: "ر.س" },
  { code: "USD", nameAr: "دولار أمريكي", nameEn: "US Dollar", symbol: "$" }
];

export const exchangeDefaults = {
  base: "USD",
  rates: { USD: 1, SAR: 3.75, YER: 530 },
  updatedAt: "2026-10-27",
  noteAr: "أسعار تحويل تقريبية للعرض فقط. تختلف حسب المدينة والسوق؛ حدّثها من لوحة التحكم.",
  noteEn: "Approximate display conversion rates. Market rates vary by city; update them in the admin panel."
};

export const cities = [
  "صنعاء", "عدن", "تعز", "الحديدة", "إب", "حضرموت", "المكلا", "ذمار",
  "حجة", "صعدة", "مأرب", "البيضاء", "دولي"
];

export const qualities = [
  { id: "original", nameAr: "أصلية", nameEn: "Original", color: "success" },
  { id: "service-pack", nameAr: "Service Pack", nameEn: "Service Pack", color: "blue" },
  { id: "commercial", nameAr: "تجارية", nameEn: "Commercial", color: "warning" },
  { id: "refurbished", nameAr: "مجددة", nameEn: "Refurbished", color: "blue" },
  { id: "used", nameAr: "مستعملة", nameEn: "Used", color: "danger" }
];

export const requestStatuses = [
  { id: "new", nameAr: "جديد", nameEn: "New", color: "accent" },
  { id: "review", nameAr: "قيد المراجعة", nameEn: "In review", color: "warning" },
  { id: "contacted", nameAr: "تم التواصل", nameEn: "Contacted", color: "blue" },
  { id: "completed", nameAr: "مكتمل", nameEn: "Completed", color: "success" },
  { id: "cancelled", nameAr: "ملغي", nameEn: "Cancelled", color: "danger" }
];

export const services = [
  {
    num: "01", icon: "wrench", href: "#/repair",
    titleAr: "صيانة الهواتف", titleEn: "Phone repair",
    descAr: "تشخيص وإصلاح الشاشة والبطارية والشحن والماء والأعطال اللوحية بخطوات موثقة.",
    descEn: "Diagnosis and repair for screens, batteries, charging, water damage, and board faults."
  },
  {
    num: "02", icon: "download", href: "#/software",
    titleAr: "السوفت وير والتفليش", titleEn: "Software & flashing",
    descAr: "رومات رسمية، أدوات تفليش، وإرشادات آمنة لكل شركة وموديل.",
    descEn: "Official ROM sources, flashing tools, and safe guidance per brand and model."
  },
  {
    num: "03", icon: "code", href: "#/programming",
    titleAr: "البرمجة", titleEn: "Programming",
    descAr: "فك Bootloader، روت، ريكفري مخصص، وإصلاح برمجي بضوابط قانونية.",
    descEn: "Bootloader unlock, root, custom recovery, and lawful software repair."
  },
  {
    num: "04", icon: "shield", href: "#/security",
    titleAr: "الأمن السيبراني", titleEn: "Cybersecurity",
    descAr: "حماية الحسابات والبيانات، أمن Android والشبكات، وتحليل دفاعي للبرمجيات الخبيثة.",
    descEn: "Account and data protection, Android and network security, and defensive malware analysis."
  },
  {
    num: "05", icon: "tools", href: "#/tools",
    titleAr: "أدوات الصيانة", titleEn: "Repair tools",
    descAr: "دليل Odin وSP Flash وQFIL وMi Flash وأدوات التشخيص والأمن مع روابط المصادر.",
    descEn: "Guide to Odin, SP Flash, QFIL, Mi Flash, diagnostics, and security tools with source links."
  },
  {
    num: "06", icon: "file", href: "#/firmware",
    titleAr: "ملفات Firmware", titleEn: "Firmware library",
    descAr: "فهرس مصادر رومات رسمية حسب الشركة والموديل والمنطقة، دون روابط وهمية.",
    descEn: "Index of official firmware sources by brand, model, and region — no fake links."
  },
  {
    num: "07", icon: "smartphone", href: "#/phones",
    titleAr: "جميع موديلات الهواتف", titleEn: "All phone models",
    descAr: "قاعدة بيانات قابلة للبحث بالاسم أو رقم الموديل أو الاسم الرمزي.",
    descEn: "Searchable database by name, model number, or codename."
  },
  {
    num: "08", icon: "screen", href: "#/screens",
    titleAr: "أسعار الشاشات", titleEn: "Screen prices",
    descAr: "أسعار أصلية وتجارية ومجددة، بالعملة والمدينة والمورد وتاريخ التحديث.",
    descEn: "Original, commercial, and refurbished prices by currency, city, supplier, and date."
  },
  {
    num: "09", icon: "package", href: "#/parts",
    titleAr: "قطع الغيار", titleEn: "Spare parts",
    descAr: "بطاريات ومنافذ شحن وزجاج كاميرا وقطع نادرة مع حالة التوفر.",
    descEn: "Batteries, charging ports, camera glass, and rare parts with availability."
  },
  {
    num: "10", icon: "alert", href: "#/faults",
    titleAr: "أعطال الهواتف وحلولها", titleEn: "Faults & solutions",
    descAr: "أعراض وأسباب وخطوات إصلاح وأدوات لكل عطل شائع.",
    descEn: "Symptoms, causes, repair steps, and tools for common faults."
  },
  {
    num: "11", icon: "book", href: "#/guides",
    titleAr: "شروحات ودروس تقنية", titleEn: "Guides & tutorials",
    descAr: "مقالات عربية وإنجليزية في الصيانة والسوفت وير والأمن.",
    descEn: "Arabic and English articles on repair, software, and security."
  },
  {
    num: "12", icon: "message", href: "#/request",
    titleAr: "طلبات الصيانة", titleEn: "Repair requests",
    descAr: "أرسل الموديل والعطل عبر نموذج منظم، ويصل الطلب مباشرة إلى واتساب.",
    descEn: "Submit a structured model and fault request that opens directly in WhatsApp."
  },
  {
    num: "13", icon: "mail", href: "#/contact",
    titleAr: "التواصل معنا", titleEn: "Contact us",
    descAr: "واتساب مباشر، هاتف، وموقع الخدمة. استشارة أولية قبل الإصلاح.",
    descEn: "Direct WhatsApp, phone, and service location. Initial consultation before repair."
  }
];

export const repairServices = [
  {
    icon: "screen", titleAr: "استبدال الشاشة", titleEn: "Screen replacement",
    descAr: "شاشات أصلية وتجارية ومجددة مع اختبار كامل قبل التثبيت.",
    descEn: "Original, commercial, and refurbished panels with full testing before installation.",
    timeAr: "30–90 دقيقة", timeEn: "30–90 min", priceAr: "حسب القطعة والموديل", priceEn: "Part and model dependent"
  },
  {
    icon: "battery", titleAr: "بطارية ومنفذ شحن", titleEn: "Battery & charging port",
    descAr: "تشخيص البطارية والمنفذ وIC الشحن قبل الاستبدال.",
    descEn: "Battery, port, and charging IC diagnosis before replacement.",
    timeAr: "20–60 دقيقة", timeEn: "20–60 min", priceAr: "حسب القطعة", priceEn: "Part dependent"
  },
  {
    icon: "droplet", titleAr: "تنظيف بعد الماء", titleEn: "Water damage cleaning",
    descAr: "تفكيك وتجفيف وتنظيف اللوحة من التآكل مع تقييم الأضرار.",
    descEn: "Teardown, drying, and corrosion cleaning with damage assessment.",
    timeAr: "2–24 ساعة", timeEn: "2–24 hours", priceAr: "حسب الحالة", priceEn: "Condition dependent"
  },
  {
    icon: "cpu", titleAr: "صيانة لوحية", titleEn: "Board-level repair",
    descAr: "فحص دوائر الطاقة والشحن والتخزين في الحالات المتقدمة.",
    descEn: "Power, charging, and storage circuit diagnostics for advanced cases.",
    timeAr: "حسب التشخيص", timeEn: "Diagnosis dependent", priceAr: "بعد التقييم", priceEn: "After assessment"
  },
  {
    icon: "download", titleAr: "سوفت وير وتفليش", titleEn: "Software & flashing",
    descAr: "إصلاح Bootloop وفشل التحديث واستعادة النظام الأصلي.",
    descEn: "Bootloop, failed update, and stock system recovery.",
    timeAr: "30–120 دقيقة", timeEn: "30–120 min", priceAr: "حسب الحالة", priceEn: "Condition dependent"
  },
  {
    icon: "database", titleAr: "استعادة بيانات", titleEn: "Data recovery",
    descAr: "محاولة استخراج البيانات قبل أي تفليش أو إعادة ضبط.",
    descEn: "Data extraction attempts before any flash or factory reset.",
    timeAr: "حسب الحالة", timeEn: "Condition dependent", priceAr: "بعد التقييم", priceEn: "After assessment"
  }
];

export const securityTopics = [
  {
    icon: "smartphone", titleAr: "حماية الهواتف", titleEn: "Phone protection",
    descAr: "إعدادات القفل والتشفير والتحقق بخطوتين والنسخ الاحتياطي.",
    descEn: "Lock settings, encryption, two-step verification, and backups."
  },
  {
    icon: "lock", titleAr: "أمن Android", titleEn: "Android security",
    descAr: "التحديثات، صلاحيات التطبيقات، Play Protect، وإدارة الحسابات.",
    descEn: "Updates, app permissions, Play Protect, and account management."
  },
  {
    icon: "network", titleAr: "أمن الشبكات", titleEn: "Network security",
    descAr: "شبكات Wi-Fi العامة، VPN، وتحليل حركة الشبكة دفاعياً.",
    descEn: "Public Wi-Fi, VPNs, and defensive network traffic analysis."
  },
  {
    icon: "database", titleAr: "حماية البيانات", titleEn: "Data protection",
    descAr: "التشفير، النسخ الاحتياطي، وإدارة الوصول إلى الملفات.",
    descEn: "Encryption, backups, and file access management."
  },
  {
    icon: "bug", titleAr: "تحليل البرمجيات الخبيثة", titleEn: "Malware analysis",
    descAr: "فحص APK في بيئة معزولة وفهم الصلاحيات والاتصالات — دفاعياً.",
    descEn: "Isolated APK inspection, permissions, and endpoints — defensive only."
  },
  {
    icon: "key", titleAr: "اختبار اختراق مصرح به", titleEn: "Authorized pentesting",
    descAr: "النطاق، الإذن المكتوب، والتوثيق والإبلاغ المسؤول.",
    descEn: "Scope, written authorization, documentation, and responsible disclosure."
  },
  {
    icon: "eye", titleAr: "اكتشاف الثغرات", titleEn: "Vulnerability discovery",
    descAr: "مراجعة الإعدادات والصلاحيات وتقارير الأمان المعروفة.",
    descEn: "Configuration and permission review plus known security advisories."
  },
  {
    icon: "users", titleAr: "حماية الحسابات", titleEn: "Account protection",
    descAr: "كلمات مرور فريدة، مصادقة ثنائية، ومراجعة الجلسات النشطة.",
    descEn: "Unique passwords, two-factor authentication, and active session review."
  },
  {
    icon: "terminal", titleAr: "مختبرات تعليمية آمنة", titleEn: "Safe learning labs",
    descAr: "OWASP MASTG وMobSF وJuice Shop وبيئات اختبار معزولة.",
    descEn: "OWASP MASTG, MobSF, Juice Shop, and isolated test environments."
  }
];

export const securityLabs = [
  { name: "OWASP MASTG", descAr: "دليل اختبار أمان تطبيقات الهاتف", descEn: "Mobile app security testing guide", url: "https://mas.owasp.org/MASTG/", icon: "book" },
  { name: "MobSF", descAr: "تحليل ثابت وديناميكي للتطبيقات", descEn: "Static and dynamic app analysis", url: "https://mobsf.github.io/Mobile-Security-Framework-MobSF/", icon: "bug" },
  { name: "OWASP Juice Shop", descAr: "تطبيق تدريب على ثغرات الويب", descEn: "Web vulnerability training app", url: "https://owasp.org/www-project-juice-shop/", icon: "shield" },
  { name: "Have I Been Pwned", descAr: "فحص تسرب البريد وكلمات المرور", descEn: "Check email and password breaches", url: "https://haveibeenpwned.com/", icon: "eye" },
  { name: "Android Security Bulletin", descAr: "نشرات ثغرات Android الشهرية", descEn: "Monthly Android security bulletins", url: "https://source.android.com/docs/security/bulletin", icon: "alert" },
  { name: "Wireshark", descAr: "تحليل حركة الشبكة", descEn: "Network traffic analysis", url: "https://www.wireshark.org/", icon: "network" }
];

export const programmingServices = [
  {
    icon: "key", titleAr: "فك Bootloader", titleEn: "Bootloader unlock",
    descAr: "للأجهزة التي تدعم الفك رسمياً فقط، مع توضيح أثر مسح البيانات.",
    descEn: "Only for officially supported devices, with clear data-wipe implications."
  },
  {
    icon: "code", titleAr: "تثبيت روم مخصص", titleEn: "Custom ROM installation",
    descAr: "بعد التحقق من التوافق والنسخ الاحتياطي، ولأجهزة يملكها العميل.",
    descEn: "After compatibility checks and backup, for customer-owned devices."
  },
  {
    icon: "shield", titleAr: "Root وإدارة الصلاحيات", titleEn: "Root & permission management",
    descAr: "خيارات Root نظامية مع تحذير من أثرها على البنوك والضمان.",
    descEn: "Systemless root options with warnings about banking apps and warranty."
  },
  {
    icon: "refresh", titleAr: "إصلاح Bootloop", titleEn: "Bootloop repair",
    descAr: "تشخيص السبب ومحاولة استعادة النظام دون فقدان البيانات.",
    descEn: "Cause diagnosis and system recovery attempts without data loss."
  },
  {
    icon: "database", titleAr: "استعادة بيانات", titleEn: "Data recovery",
    descAr: "أولوية للبيانات قبل أي تفليش أو إعادة ضبط.",
    descEn: "Data-first approach before any flash or reset."
  },
  {
    icon: "activity", titleAr: "تحسين الأداء", titleEn: "Performance tuning",
    descAr: "مراجعة التطبيقات والذاكرة والحرارة دون وعود مبالغ فيها.",
    descEn: "App, memory, and thermal review without exaggerated promises."
  }
];

export const faqs = [
  {
    qAr: "هل الأسعار المعروضة نهائية؟",
    qEn: "Are the displayed prices final?",
    aAr: "الأسعار المرجعية العالمية تُعرض كمصدر فقط، وليست سعر السوق اليمني. أسعار الشاشات المحلية تُضاف من لوحة التحكم بعد التحقق، ويظهر تاريخ التحديث والمورد. السعر النهائي يعتمد على الفحص والقطعة.",
    aEn: "Global reference prices are shown as a source only, not as Yemeni market prices. Local prices are added from the admin panel after verification, with update date and supplier. The final price depends on inspection and part."
  },
  {
    qAr: "هل تقومون بتجاوز FRP أو تغيير IMEI؟",
    qEn: "Do you bypass FRP or change IMEI?",
    aAr: "لا. نقدم فقط استرداد الحساب الرسمي أو المساعدة بإثبات الملكية. تغيير IMEI أو تجاوز الحماية دون ملكية قد يكون مخالفاً للقانون.",
    aEn: "No. We only provide official account recovery or help with proof of ownership. Changing IMEI or bypassing protection without ownership may be illegal."
  },
  {
    qAr: "هل الملفات مستضافة على الموقع؟",
    qEn: "Are firmware files hosted on the site?",
    aAr: "لا. BRXVIH يفهرس مصادر رسمية أو مجتمعية موثوقة. لا ننشئ روابط وهمية، ونوضح متى يكون الملف خارج الموقع.",
    aEn: "No. BRXVIH indexes trusted official or community sources. We do not create fake links and we state when a file is external."
  },
  {
    qAr: "كيف أضيف سعر شاشة أو مورداً؟",
    qEn: "How do I add a screen price or supplier?",
    aAr: "من لوحة التحكم بعد إدخال رمز الدخول. يمكنك إضافة السعر والمورد والمدينة والعملة وحالة التوفر، ثم مراجعته قبل النشر.",
    aEn: "From the admin panel after entering the access code. Add price, supplier, city, currency, and availability, then review before publishing."
  },
  {
    qAr: "هل البيانات مضمونة 100%؟",
    qEn: "Is the data 100% guaranteed?",
    aAr: "نراجع البيانات ونربطها بالمصادر، لكن المواصفات قد تختلف حسب المنطقة أو الإصدار. تحقق دائماً من المصدر الرسمي قبل التفليش أو الشراء.",
    aEn: "We review data and link sources, but specifications can vary by region or revision. Always verify with the official source before flashing or buying."
  },
  {
    qAr: "هل يمكن طلب صيانة عن بُعد؟",
    qEn: "Can I request remote repair?",
    aAr: "نعم للاستشارة والتشخيص الأولي عبر واتساب. الأعمال التي تتطلب فك الجهاز تحتاج تنسيقاً حضورياً أو إرسال الجهاز.",
    aEn: "Yes for consultation and initial diagnosis via WhatsApp. Work requiring disassembly needs in-person coordination or shipping."
  }
];

export const stats = [
  { key: "phones", labelAr: "موديل هاتف", labelEn: "phone models", icon: "smartphone" },
  { key: "brands", labelAr: "علامة تجارية", labelEn: "brands", icon: "grid" },
  { key: "faults", labelAr: "عطل وحل", labelEn: "fault guides", icon: "alert" },
  { key: "tools", labelAr: "أداة صيانة", labelEn: "repair tools", icon: "tools" }
];
