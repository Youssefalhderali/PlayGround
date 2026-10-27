export const tools = [
  {
    id: "odin", name: "Odin", category: "flashing", platform: "Windows",
    purposeAr: "أداة تفليش هواتف سامسونج عبر وضع Download Mode.",
    purposeEn: "Samsung flashing utility for Download Mode.",
    license: "official", price: "مجاني", url: "https://www.sammobile.com/firmwares/",
    warningAr: "استخدم إصداراً متوافقاً مع الموديل وملفاً أصلياً. لا تفلش CSC من منطقة مختلفة دون فهم.",
    brandIds: ["samsung"], verified: true
  },
  {
    id: "samfw", name: "SamFw Tool", category: "flashing", platform: "Windows",
    purposeAr: "أداة مساعدة لإدارة رومات سامسونج وCSC وبعض وظائف الصيانة.",
    purposeEn: "Samsung firmware, CSC, and service utility.",
    license: "freemium", price: "مجاني / ميزات مدفوعة", url: "https://samfw.com/",
    warningAr: "بعض الوظائف قد تكون غير رسمية؛ استخدمها فقط على جهاز تملكه.",
    brandIds: ["samsung"], verified: true
  },
  {
    id: "mi-flash", name: "Mi Flash Tool", category: "flashing", platform: "Windows",
    purposeAr: "تفليش هواتف شاومي وريد مي وبوكو عبر Fastboot ROM.",
    purposeEn: "Fastboot flashing for Xiaomi, Redmi, and POCO.",
    license: "official", price: "مجاني", url: "https://xiaomifirmwareupdater.com/",
    warningAr: "تأكد من نوع الروم (Fastboot وليس Recovery) ومن فك Bootloader.",
    brandIds: ["xiaomi", "redmi", "poco"], verified: true
  },
  {
    id: "xiaomi-tool", name: "XiaoMiTool V2", category: "flashing", platform: "Windows / macOS / Linux",
    purposeAr: "أداة مفتوحة لإدارة رومات شاومي وتثبيت التحديثات.",
    purposeEn: "Open utility for Xiaomi ROM management and updates.",
    license: "free", price: "مجاني", url: "https://www.xiaomitool.com/V2/",
    warningAr: "استخدمها مع ملفات رسمية فقط.",
    brandIds: ["xiaomi", "redmi", "poco"], verified: true
  },
  {
    id: "sp-flash", name: "SP Flash Tool", category: "flashing", platform: "Windows / Linux",
    purposeAr: "تفليش أجهزة MediaTek عبر ملفات Scatter.",
    purposeEn: "MediaTek flashing using scatter files.",
    license: "official", price: "مجاني", url: "https://spflashtool.com/",
    warningAr: "اختيار ملف Scatter خاطئ قد يوقف الجهاز. لا تستخدم وضع Format All إلا بعد نسخ احتياطي.",
    brandIds: ["tecno", "infinix", "itel", "oppo", "vivo", "realme", "zte", "nubia", "nokia", "motorola"],
    verified: true
  },
  {
    id: "qfil", name: "QFIL", category: "flashing", platform: "Windows",
    purposeAr: "تفليش أجهزة Qualcomm عبر وضع EDL وملفات Firehose.",
    purposeEn: "Qualcomm EDL flashing with Firehose files.",
    license: "official", price: "مجاني", url: "https://qpsttool.com/",
    warningAr: "وضع EDL قد يحتاج تفويضاً. لا تشارك ملفات Firehose محمية بحقوق.",
    brandIds: ["qualcomm"], verified: true
  },
  {
    id: "qpst", name: "QPST", category: "diagnostic", platform: "Windows",
    purposeAr: "أدوات Qualcomm للتشخيص وإدارة أجهزة EDL.",
    purposeEn: "Qualcomm diagnostic and EDL device tools.",
    license: "official", price: "مجاني", url: "https://qpsttool.com/",
    warningAr: "أدوات متقدمة؛ لا تغيّر إعدادات الشبكة دون معرفة.",
    brandIds: ["qualcomm"], verified: true
  },
  {
    id: "unlocktool", name: "UnlockTool", category: "unlock", platform: "Windows",
    purposeAr: "أداة مدفوعة لوظائف فك القفل وإدارة الأجهزة المصرح بها.",
    purposeEn: "Paid unlock and device service suite for authorized use.",
    license: "paid", price: "اشتراك مدفوع", url: "https://unlocktool.net/",
    warningAr: "لا تستخدمها لتجاوز FRP أو فك قفل جهاز لا تملكه.",
    brandIds: [], verified: true
  },
  {
    id: "chimera", name: "Chimera Tool", category: "unlock", platform: "Windows",
    purposeAr: "أداة مدفوعة لخدمات البرمجة والتفليش المتقدمة.",
    purposeEn: "Paid advanced programming and flashing suite.",
    license: "paid", price: "اشتراك مدفوع", url: "https://chimeratool.com/",
    warningAr: "التزم بالقوانين المحلية وملكية الجهاز.",
    brandIds: [], verified: true
  },
  {
    id: "tft", name: "TFT Unlock Tool", category: "unlock", platform: "Windows",
    purposeAr: "أداة مدفوعة لخدمات الصيانة والبرمجة المصرح بها.",
    purposeEn: "Paid repair and programming suite for authorized service.",
    license: "paid", price: "اشتراك مدفوع", url: "https://www.tft-unlock.com/",
    warningAr: "لا تُستخدم لتجاوز الحماية أو تعديل IMEI.",
    brandIds: [], verified: true
  },
  {
    id: "adb-fastboot", name: "ADB & Fastboot", category: "development", platform: "Windows / macOS / Linux",
    purposeAr: "أدوات Android الرسمية للتشخيص وتثبيت الحزم والتفليش.",
    purposeEn: "Official Android tools for diagnostics, packages, and flashing.",
    license: "official", price: "مجاني", url: "https://developer.android.com/tools/adb",
    warningAr: "أوامر fastboot قد تمسح البيانات. اقرأ الأمر قبل تنفيذه.",
    brandIds: ["all"], verified: true
  },
  {
    id: "android-flash-tool", name: "Android Flash Tool", category: "flashing", platform: "Web",
    purposeAr: "أداة Google الرسمية لتفليش أجهزة Pixel بصور رسمية.",
    purposeEn: "Google's official web flasher for Pixel factory images.",
    license: "official", price: "مجاني", url: "https://flash.android.com/",
    warningAr: "يتطلب متصفح Chromium وكابل بيانات موثوقاً.",
    brandIds: ["google"], verified: true
  },
  {
    id: "heimdall", name: "Heimdall", category: "flashing", platform: "Windows / macOS / Linux",
    purposeAr: "بديل مفتوح المصدر لتفليش أجهزة سامسونج.",
    purposeEn: "Open-source Samsung flashing alternative.",
    license: "free", price: "مجاني", url: "https://github.com/Benjamin-Dobell/Heimdall",
    warningAr: "واجهة سطر أوامر؛ استخدم ملفات Pit/Rom مطابقة.",
    brandIds: ["samsung"], verified: true
  },
  {
    id: "itunes", name: "Finder / iTunes", category: "flashing", platform: "macOS / Windows",
    purposeAr: "استعادة وتحديث أجهزة iPhone/iPad عبر Apple الرسمي.",
    purposeEn: "Official Apple restore and update utility.",
    license: "official", price: "مجاني", url: "https://support.apple.com/iphone",
    warningAr: "قد تمسح الاستعادة البيانات إذا لم تكن هناك نسخة احتياطية.",
    brandIds: ["apple"], verified: true
  },
  {
    id: "3utools", name: "3uTools", category: "diagnostic", platform: "Windows",
    purposeAr: "أداة شائعة لعرض معلومات iPhone وإدارة النسخ والملفات.",
    purposeEn: "Popular iPhone info, backup, and file utility.",
    license: "free", price: "مجاني", url: "https://www.3u.com/",
    warningAr: "ليست أداة رسمية من Apple؛ لا تشارك بيانات Apple ID.",
    brandIds: ["apple"], verified: true
  },
  {
    id: "dfu", name: "DFU Restore", category: "flashing", platform: "macOS / Windows",
    purposeAr: "وضع الاستعادة العميق لأجهزة Apple عبر Finder/iTunes.",
    purposeEn: "Deep restore mode for Apple devices using Finder/iTunes.",
    license: "official", price: "مجاني", url: "https://support.apple.com/iphone",
    warningAr: "استخدمه فقط عند فشل الاستعادة العادية.",
    brandIds: ["apple"], verified: true
  },
  {
    id: "rsd-lite", name: "Motorola RSA / RSD Lite", category: "flashing", platform: "Windows",
    purposeAr: "أدوات Motorola الرسمية للاستعادة والتفليش.",
    purposeEn: "Official Motorola rescue and flashing tools.",
    license: "official", price: "مجاني", url: "https://www.motorola.com/global/en/support",
    warningAr: "استخدم ملفاً مطابقاً للموديل والمنطقة.",
    brandIds: ["motorola"], verified: true
  },
  {
    id: "lgup", name: "LGUP", category: "flashing", platform: "Windows",
    purposeAr: "أداة تفليش أجهزة LG (غير مدعومة رسمياً بعد إيقاف القسم).",
    purposeEn: "LG flashing utility (community-supported after LG exit).",
    license: "free", price: "مجاني", url: "https://www.lg.com/global/support",
    warningAr: "قد تحتاج DLL مطابقاً للموديل. الدعم الرسمي منتهي.",
    brandIds: ["lg"], verified: true
  },
  {
    id: "huawei-firmware", name: "Huawei Firmware Finder", category: "flashing", platform: "Windows / Web",
    purposeAr: "أداة مجتمعية للبحث عن إصدارات EMUI/HarmonyOS الرسمية.",
    purposeEn: "Community tool for finding official EMUI/HarmonyOS builds.",
    license: "free", price: "مجاني", url: "https://professorjtj.github.io/",
    warningAr: "ليست أداة رسمية؛ تحقق من التوقيع والمنطقة.",
    brandIds: ["huawei"], verified: true
  },
  {
    id: "honor-suite", name: "Honor Suite", category: "diagnostic", platform: "Windows",
    purposeAr: "أداة Honor لإدارة النسخ الاحتياطي والتحديثات.",
    purposeEn: "Honor backup and update utility.",
    license: "official", price: "مجاني", url: "https://www.honor.com/global/support/",
    warningAr: "تحقق من توافق الموديل مع الإصدار.",
    brandIds: ["honor"], verified: true
  },
  {
    id: "msm-download", name: "MSM Download Tool", category: "flashing", platform: "Windows",
    purposeAr: "أداة Qualcomm لاستعادة بعض أجهزة OnePlus في وضع EDL.",
    purposeEn: "Qualcomm EDL restore utility for supported OnePlus devices.",
    license: "official", price: "مجاني", url: "https://www.oneplus.com/global/support",
    warningAr: "الملفات غير متاحة لكل الموديلات؛ لا تستخدم ملفاً من جهاز آخر.",
    brandIds: ["oneplus"], verified: true
  },
  {
    id: "scrcpy", name: "scrcpy", category: "diagnostic", platform: "Windows / macOS / Linux",
    purposeAr: "عرض والتحكم في شاشة Android عبر USB/Wi-Fi دون Root.",
    purposeEn: "Display and control Android over USB/Wi-Fi without root.",
    license: "free", price: "مجاني", url: "https://github.com/Genymobile/scrcpy",
    warningAr: "يتطلب تفعيل تصحيح USB؛ لا تستخدمه على أجهزة لا تملكها.",
    brandIds: ["all"], verified: true
  },
  {
    id: "magisk", name: "Magisk", category: "development", platform: "Android",
    purposeAr: "إدارة Root نظامية وتعديلات على أجهزة Android.",
    purposeEn: "Systemless root and modifications for Android.",
    license: "free", price: "مجاني", url: "https://github.com/topjohnwu/Magisk",
    warningAr: "Root قد يبطل الضمان ويكسر تطبيقات البنوك. استخدمه على مسؤوليتك.",
    brandIds: ["all"], verified: true
  },
  {
    id: "twrp", name: "TWRP", category: "development", platform: "Android",
    purposeAr: "Recovery مخصص للنسخ الاحتياطي والتثبيت.",
    purposeEn: "Custom recovery for backup and installation.",
    license: "free", price: "مجاني", url: "https://twrp.me/",
    warningAr: "لا يوجد Recovery رسمي لكل موديل؛ تحقق من التوافق.",
    brandIds: ["all"], verified: true
  },
  {
    id: "wireshark", name: "Wireshark", category: "security", platform: "Windows / macOS / Linux",
    purposeAr: "تحليل حركة الشبكة لأغراض تعليمية ودفاعية.",
    purposeEn: "Network traffic analysis for education and defense.",
    license: "free", price: "مجاني", url: "https://www.wireshark.org/",
    warningAr: "لا تلتقط حركة شبكة لا تملك إذناً بتحليلها.",
    brandIds: [], verified: true
  },
  {
    id: "mobsf", name: "MobSF", category: "security", platform: "Web / Docker",
    purposeAr: "تحليل تطبيقات Android/iOS بحثاً عن مشاكل أمنية.",
    purposeEn: "Static and dynamic security analysis for mobile apps.",
    license: "free", price: "مجاني", url: "https://mobsf.github.io/Mobile-Security-Framework-MobSF/",
    warningAr: "حلّل فقط تطبيقات تملكها أو لديك إذن بتحليلها.",
    brandIds: [], verified: true
  },
  {
    id: "frida", name: "Frida", category: "security", platform: "Windows / macOS / Linux",
    purposeAr: "أداة تحليل ديناميكي للتطبيقات في بيئات اختبار مصرح بها.",
    purposeEn: "Dynamic instrumentation for authorized test environments.",
    license: "free", price: "مجاني / ميزات مدفوعة", url: "https://frida.re/",
    warningAr: "لا تستخدمها لتجاوز حماية تطبيقات لا تملكها.",
    brandIds: [], verified: true
  },
  {
    id: "ghidra", name: "Ghidra", category: "security", platform: "Windows / macOS / Linux",
    purposeAr: "أداة هندسة عكسية مفتوحة من NSA لتحليل الملفات التنفيذية.",
    purposeEn: "Open-source reverse engineering suite from NSA.",
    license: "free", price: "مجاني", url: "https://ghidra-sre.org/",
    warningAr: "التحليل الدفاعي فقط؛ احترم حقوق الملكية.",
    brandIds: [], verified: true
  },
  {
    id: "apktool", name: "Apktool", category: "development", platform: "Windows / macOS / Linux",
    purposeAr: "فك وإعادة بناء تطبيقات APK لأغراض التطوير والتحليل.",
    purposeEn: "Decompile and rebuild APKs for development and analysis.",
    license: "free", price: "مجاني", url: "https://apktool.org/",
    warningAr: "لا تعِد نشر تطبيقات لا تملك حقوقها.",
    brandIds: [], verified: true
  },
  {
    id: "jadx", name: "JADX", category: "security", platform: "Windows / macOS / Linux",
    purposeAr: "فك كود Dalvik/Java لتحليل التطبيقات.",
    purposeEn: "Decompile Dalvik/Java for app analysis.",
    license: "free", price: "مجاني", url: "https://github.com/skylot/jadx",
    warningAr: "استخدمها في التحليل الدفاعي فقط.",
    brandIds: [], verified: true
  },
  {
    id: "virustotal", name: "VirusTotal", category: "security", platform: "Web",
    purposeAr: "فحص الملفات والروابط عبر محركات أمنية متعددة.",
    purposeEn: "Multi-engine file and URL scanning.",
    license: "freemium", price: "مجاني / API مدفوع", url: "https://www.virustotal.com/",
    warningAr: "لا ترفع ملفات تحتوي بيانات شخصية أو أسراراً.",
    brandIds: [], verified: true
  },
  {
    id: "hibp", name: "Have I Been Pwned", category: "security", platform: "Web",
    purposeAr: "التحقق من تسرب البريد الإلكتروني أو كلمة المرور.",
    purposeEn: "Check whether an email or password appeared in a breach.",
    license: "free", price: "مجاني", url: "https://haveibeenpwned.com/",
    warningAr: "لا ترفع كلمات مرور حقيقية إلى مواقع غير موثوقة.",
    brandIds: [], verified: true
  },
  {
    id: "owasp-mastg", name: "OWASP MASTG", category: "security", platform: "Web",
    purposeAr: "دليل اختبار أمان تطبيقات الهاتف المحمول.",
    purposeEn: "Mobile application security testing guide.",
    license: "free", price: "مجاني", url: "https://mas.owasp.org/MASTG/",
    warningAr: "استخدم الاختبار على تطبيقات مصرح بها فقط.",
    brandIds: [], verified: true
  }
];

export const toolById = Object.fromEntries(tools.map((tool) => [tool.id, tool]));
export const toolCategories = [
  { id: "flashing", nameAr: "التفليش", nameEn: "Flashing", icon: "download" },
  { id: "unlock", nameAr: "البرمجة والفتح", nameEn: "Unlock", icon: "key" },
  { id: "diagnostic", nameAr: "التشخيص", nameEn: "Diagnostics", icon: "activity" },
  { id: "development", nameAr: "التطوير", nameEn: "Development", icon: "code" },
  { id: "security", nameAr: "الأمن", nameEn: "Security", icon: "shield" }
];
