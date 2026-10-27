window.BRXVihData = {
  categories: {
    iphone: { label: "صيانة آيفون", short: "آيفون", type: "repair" },
    android: { label: "صيانة أندرويد", short: "أندرويد", type: "repair" },
    laptop: { label: "صيانة لابتوب", short: "لابتوب", type: "repair" },
    software: { label: "أمن سيبراني وسوفت وير", short: "برمجيات وأمن", type: "service" },
    development: { label: "برمجة وتطوير", short: "تطوير", type: "service" }
  },

  serviceLabels: {
    screen: "شاشة",
    battery: "بطارية",
    charging: "منفذ شحن",
    camera: "كاميرا",
    back: "ظهر زجاجي",
    speaker: "سماعة",
    diagnostic: "تشخيص وفحص",
    keyboard: "لوحة مفاتيح",
    ssd: "ترقية SSD",
    ram: "ترقية RAM",
    thermal: "تنظيف + معجون حراري"
  },

  devices: {
    iphone: [
      { id: "ip16pm", brand: "Apple", model: "iPhone 16 Pro Max", year: "2024", warranty: "30 يوم", services: { screen: 215000, battery: 48000, charging: 28000, camera: 72000, back: 52000, diagnostic: 5000 } },
      { id: "ip16p", brand: "Apple", model: "iPhone 16 Pro", year: "2024", warranty: "30 يوم", services: { screen: 195000, battery: 45000, charging: 26000, camera: 68000, back: 48000, diagnostic: 5000 } },
      { id: "ip16", brand: "Apple", model: "iPhone 16", year: "2024", warranty: "30 يوم", services: { screen: 165000, battery: 42000, charging: 25000, camera: 60000, back: 42000, diagnostic: 5000 } },
      { id: "ip15pm", brand: "Apple", model: "iPhone 15 Pro Max", year: "2023", warranty: "30 يوم", services: { screen: 185000, battery: 42000, charging: 25000, camera: 65000, back: 45000, diagnostic: 5000 } },
      { id: "ip15", brand: "Apple", model: "iPhone 15", year: "2023", warranty: "30 يوم", services: { screen: 150000, battery: 38000, charging: 23000, camera: 55000, back: 38000, diagnostic: 5000 } },
      { id: "ip14pm", brand: "Apple", model: "iPhone 14 Pro Max", year: "2022", warranty: "30 يوم", services: { screen: 145000, battery: 38000, charging: 23000, camera: 58000, back: 40000, diagnostic: 5000 } },
      { id: "ip14", brand: "Apple", model: "iPhone 14", year: "2022", warranty: "30 يوم", services: { screen: 120000, battery: 34000, charging: 21000, camera: 50000, back: 34000, diagnostic: 5000 } },
      { id: "ip13pm", brand: "Apple", model: "iPhone 13 Pro Max", year: "2021", warranty: "30 يوم", services: { screen: 115000, battery: 32000, charging: 20000, camera: 48000, back: 32000, diagnostic: 5000 } },
      { id: "ip13", brand: "Apple", model: "iPhone 13", year: "2021", warranty: "30 يوم", services: { screen: 95000, battery: 30000, charging: 19000, camera: 42000, back: 28000, diagnostic: 5000 } },
      { id: "ip12", brand: "Apple", model: "iPhone 12", year: "2020", warranty: "30 يوم", services: { screen: 75000, battery: 26000, charging: 18000, camera: 36000, back: 24000, diagnostic: 5000 } },
      { id: "ip11", brand: "Apple", model: "iPhone 11", year: "2019", warranty: "30 يوم", services: { screen: 55000, battery: 22000, charging: 16000, camera: 30000, back: 20000, diagnostic: 5000 } },
      { id: "ipxr", brand: "Apple", model: "iPhone XR", year: "2018", warranty: "30 يوم", services: { screen: 45000, battery: 18000, charging: 15000, camera: 25000, back: 17000, diagnostic: 5000 } },
      { id: "ipse", brand: "Apple", model: "iPhone SE 2022", year: "2022", warranty: "30 يوم", services: { screen: 40000, battery: 16000, charging: 14000, camera: 22000, back: 15000, diagnostic: 5000 } }
    ],

    android: [
      { id: "s24u", brand: "Samsung", model: "Galaxy S24 Ultra", year: "2024", warranty: "30 يوم", services: { screen: 125000, battery: 28000, charging: 18000, camera: 55000, back: 35000, diagnostic: 5000 } },
      { id: "s23u", brand: "Samsung", model: "Galaxy S23 Ultra", year: "2023", warranty: "30 يوم", services: { screen: 98000, battery: 25000, charging: 17000, camera: 48000, back: 30000, diagnostic: 5000 } },
      { id: "s23", brand: "Samsung", model: "Galaxy S23", year: "2023", warranty: "30 يوم", services: { screen: 75000, battery: 22000, charging: 16000, camera: 38000, back: 26000, diagnostic: 5000 } },
      { id: "a54", brand: "Samsung", model: "Galaxy A54", year: "2023", warranty: "30 يوم", services: { screen: 45000, battery: 16000, charging: 12000, camera: 24000, back: 15000, diagnostic: 5000 } },
      { id: "a34", brand: "Samsung", model: "Galaxy A34", year: "2023", warranty: "30 يوم", services: { screen: 38000, battery: 14000, charging: 11000, camera: 20000, back: 13000, diagnostic: 5000 } },
      { id: "mi14", brand: "Xiaomi", model: "Xiaomi 14", year: "2024", warranty: "30 يوم", services: { screen: 85000, battery: 24000, charging: 15000, camera: 40000, back: 26000, diagnostic: 5000 } },
      { id: "rn13p", brand: "Xiaomi", model: "Redmi Note 13 Pro", year: "2024", warranty: "30 يوم", services: { screen: 38000, battery: 14000, charging: 10000, camera: 18000, back: 12000, diagnostic: 5000 } },
      { id: "r13c", brand: "Xiaomi", model: "Redmi 13C", year: "2023", warranty: "30 يوم", services: { screen: 22000, battery: 10000, charging: 8000, camera: 12000, back: 9000, diagnostic: 5000 } },
      { id: "p60p", brand: "Huawei", model: "P60 Pro", year: "2023", warranty: "30 يوم", services: { screen: 90000, battery: 26000, charging: 16000, camera: 45000, back: 28000, diagnostic: 5000 } },
      { id: "nova12", brand: "Huawei", model: "Nova 12", year: "2024", warranty: "30 يوم", services: { screen: 48000, battery: 16000, charging: 11000, camera: 24000, back: 15000, diagnostic: 5000 } },
      { id: "reno11", brand: "Oppo", model: "Reno 11", year: "2024", warranty: "30 يوم", services: { screen: 55000, battery: 18000, charging: 12000, camera: 26000, back: 16000, diagnostic: 5000 } },
      { id: "realme12p", brand: "Realme", model: "12 Pro", year: "2024", warranty: "30 يوم", services: { screen: 42000, battery: 15000, charging: 10000, camera: 22000, back: 13000, diagnostic: 5000 } },
      { id: "infinix40", brand: "Infinix", model: "Note 40", year: "2024", warranty: "30 يوم", services: { screen: 30000, battery: 12000, charging: 9000, camera: 16000, back: 10000, diagnostic: 5000 } },
      { id: "camon30", brand: "Tecno", model: "Camon 30", year: "2024", warranty: "30 يوم", services: { screen: 32000, battery: 13000, charging: 9000, camera: 17000, back: 11000, diagnostic: 5000 } },
      { id: "pixel8p", brand: "Google", model: "Pixel 8 Pro", year: "2023", warranty: "30 يوم", services: { screen: 95000, battery: 26000, charging: 16000, camera: 48000, back: 30000, diagnostic: 5000 } },
      { id: "nothing2", brand: "Nothing", model: "Phone (2)", year: "2023", warranty: "30 يوم", services: { screen: 52000, battery: 17000, charging: 11000, camera: 25000, back: 16000, diagnostic: 5000 } }
    ],

    laptop: [
      { id: "lap-standard", brand: "لابتوبات 14 – 15.6 بوصة", model: "لابتوب 14 – 15.6 بوصة", year: "جميع العلامات", warranty: "30 يوم", services: { screen: 55000, battery: 45000, keyboard: 30000, ssd: { price: 35000, warranty: "90 يوم" }, ram: { price: 22000, warranty: "90 يوم" }, thermal: { price: 12000, warranty: "14 يوم" }, charging: 20000, diagnostic: 5000 } },
      { id: "lap-gaming", brand: "لابتوبات ألعاب", model: "لابتوب ألعاب 15.6 – 17.3 بوصة", year: "جميع العلامات", warranty: "30 يوم", services: { screen: 75000, battery: 55000, keyboard: 38000, ssd: { price: 40000, warranty: "90 يوم" }, ram: { price: 26000, warranty: "90 يوم" }, thermal: { price: 15000, warranty: "14 يوم" }, charging: 25000, diagnostic: 5000 } },
      { id: "lap-premium", brand: "لابتوبات احترافية", model: "لابتوب احترافي / MacBook", year: "جميع العلامات", warranty: "30 يوم", services: { screen: 95000, battery: 75000, keyboard: 45000, ssd: { price: 45000, warranty: "90 يوم" }, ram: { price: 35000, warranty: "90 يوم" }, thermal: { price: 15000, warranty: "14 يوم" }, charging: 30000, diagnostic: 5000 } }
    ]
  },

  services: {
    software: [
      { id: "win-install", name: "تثبيت ويندوز + البرامج الأساسية", desc: "تثبيت نظيف مع التعريفات والبرامج الضرورية", price: 10000, warranty: "14 يوم" },
      { id: "mac-setup", name: "إعداد ماك / تحديث النظام", desc: "تحديث وتجهيز النظام مع الحسابات والإعدادات", price: 15000, warranty: "14 يوم" },
      { id: "data-recovery", name: "استعادة البيانات", desc: "محاولة استرجاع الملفات من وسائط تالفة أو محذوفة", price: 25000, warranty: "حسب الحالة", unit: "من" },
      { id: "virus-removal", name: "إزالة فيروسات وتحسين الأداء", desc: "فحص شامل وإزالة البرمجيات الضارة وتسريع الجهاز", price: 15000, warranty: "14 يوم" },
      { id: "backup", name: "إعداد نسخ احتياطي آمن", desc: "خطة نسخ احتياطي تلقائية ومشفرة لملفاتك", price: 20000, warranty: "14 يوم" },
      { id: "network", name: "إعداد شبكة وحماية أساسية", desc: "تهيئة الراوتر وتأمين الشبكة والأجهزة المتصلة", price: 25000, warranty: "30 يوم" },
      { id: "security-audit", name: "فحص أمني لموقع أو تطبيق", desc: "مراجعة الثغرات والإعدادات مع تقرير مفصل", price: 60000, warranty: "تقرير مفصل", unit: "من" },
      { id: "pentest", name: "اختبار اختراق تطبيق", desc: "اختبار عملي للثغرات مع خطة معالجة", price: 120000, warranty: "تقرير مفصل", unit: "من" },
      { id: "account-security", name: "تأمين الحسابات والهوية الرقمية", desc: "تفعيل التحقق بخطوتين ومراجعة الأمان", price: 25000, warranty: "30 يوم" },
      { id: "consult", name: "استشارة أمنية (ساعة)", desc: "جلسة مباشرة لمراجعة وضعك الأمني", price: 20000, warranty: "جلسة مباشرة" }
    ],

    development: [
      { id: "landing", name: "صفحة هبوط احترافية", desc: "صفحة سريعة ومتجاوبة مع نموذج تواصل", price: 80000, warranty: "30 يوم", unit: "من" },
      { id: "corporate", name: "موقع تعريفي 5 صفحات", desc: "هوية رقمية متكاملة مع تحسين محركات البحث", price: 180000, warranty: "60 يوم", unit: "من" },
      { id: "store", name: "متجر إلكتروني متكامل", desc: "إدارة منتجات وطلبات ومدفوعات", price: 350000, warranty: "90 يوم", unit: "من" },
      { id: "webapp", name: "تطبيق ويب مخصص", desc: "نظام مبني حسب احتياجك مع لوحة تحكم", price: 500000, warranty: "90 يوم", unit: "من" },
      { id: "api", name: "API / لوحة تحكم", desc: "واجهات برمجية آمنة ولوحة إدارة", price: 250000, warranty: "60 يوم", unit: "من" },
      { id: "seo", name: "تحسين محركات البحث الأساسي", desc: "تهيئة تقنية ومحتوى لتحسين الظهور", price: 45000, warranty: "30 يوم" },
      { id: "maintenance", name: "صيانة ودعم شهري للموقع", desc: "متابعة أمنية وتحديثات ودعم مستمر", price: 30000, warranty: "دعم مستمر", unit: "/شهر" }
    ]
  }
};
