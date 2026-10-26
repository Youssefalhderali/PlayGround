import type {
  ScreenPrice, SparePart, Supplier, FirmwareRecord, ToolItem, ServiceItem,
  FaultGuide, Settings, Article,
} from '../types'

export const seedVersion = 3

export const defaultSettings: Settings = {
  id: 'app',
  whatsapp: '+967777066424',
  displayName: 'brxvih | يوسف الهدار',
  rates: { USD: 1, SAR: 3.75, YER: 530 },
  ratesUpdatedAt: '2026-10-26',
  seedVersion,
  maintenanceMode: false,
}

export const seedScreenPrices: ScreenPrice[] = [
  {
    id: 'sp-demo-s24u', phoneId: 'samsung-galaxy-s24-ultra', phoneName: 'Galaxy S24 Ultra',
    brand: 'Samsung', modelNumber: 'SM-S928B', displayType: 'Dynamic AMOLED 2X',
    quality: 'original', price: 0, currency: 'YER', city: 'صنعاء', supplier: 'أدخل اسم المورد',
    updatedAt: '2026-10-26', availability: 'on-request', installPrice: 0,
    status: 'review', publishStatus: 'pending', notes: 'سجل توضيحي — عدّله أو احذفه قبل النشر. السعر غير معتمد.',
  },
  {
    id: 'sp-demo-a54', phoneId: 'samsung-galaxy-a54', phoneName: 'Galaxy A54',
    brand: 'Samsung', modelNumber: 'SM-A546B', displayType: 'Super AMOLED',
    quality: 'service-pack', price: 0, currency: 'YER', city: 'عدن', supplier: 'أدخل اسم المورد',
    updatedAt: '2026-10-26', availability: 'on-request', installPrice: 0,
    status: 'review', publishStatus: 'pending', notes: 'سجل توضيحي — السعر غير معتمد.',
  },
]

export const seedSpareParts: SparePart[] = [
  { id: 'part-screen-oled', name: 'شاشة OLED أصلية', nameEn: 'Original OLED display', category: 'شاشات', brands: ['Samsung', 'Apple', 'Google', 'OnePlus'], quality: 'أصلية', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-screen-ips', name: 'شاشة IPS تجارية', nameEn: 'Commercial IPS display', category: 'شاشات', brands: ['Redmi', 'Xiaomi', 'POCO', 'TECNO', 'Infinix', 'itel'], quality: 'تجارية', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-battery', name: 'بطارية بديلة معتمدة', nameEn: 'Certified replacement battery', category: 'بطاريات', brands: ['Samsung', 'Xiaomi', 'Huawei', 'OPPO', 'vivo'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-charging-port', name: 'منفذ شحن Type-C', nameEn: 'USB-C charging port', category: 'منافذ شحن', brands: ['Samsung', 'Xiaomi', 'OPPO', 'vivo', 'realme', 'Motorola'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-charging-flex', name: 'فليكس شحن', nameEn: 'Charging flex cable', category: 'فليكسات', brands: ['Samsung', 'Redmi', 'Xiaomi', 'TECNO', 'Infinix'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-rear-camera', name: 'كاميرا خلفية', nameEn: 'Rear camera module', category: 'كاميرات', brands: ['Samsung', 'Xiaomi', 'Huawei', 'OPPO', 'vivo', 'Apple'], quality: 'أصلية/خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-front-camera', name: 'كاميرا أمامية', nameEn: 'Front camera module', category: 'كاميرات', brands: ['Samsung', 'Xiaomi', 'OPPO', 'vivo', 'TECNO'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-back-glass', name: 'غطاء خلفي زجاجي', nameEn: 'Glass back cover', category: 'هياكل', brands: ['Samsung', 'Apple', 'Xiaomi', 'OPPO', 'vivo', 'realme'], quality: 'أصلية/تجارية', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-lcd-frame', name: 'شاشة مع إطار', nameEn: 'Display with frame', category: 'شاشات', brands: ['Samsung', 'Redmi', 'Xiaomi', 'OPPO', 'vivo'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-speaker', name: 'سماعة داخلية', nameEn: 'Earpiece speaker', category: 'صوتيات', brands: ['Samsung', 'Xiaomi', 'Huawei', 'OPPO'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-loudspeaker', name: 'مكبر صوت', nameEn: 'Loudspeaker', category: 'صوتيات', brands: ['Samsung', 'Redmi', 'Xiaomi', 'TECNO', 'Infinix'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-vibration', name: 'موتور اهتزاز', nameEn: 'Vibration motor', category: 'مكونات داخلية', brands: ['Samsung', 'Xiaomi', 'OPPO', 'vivo', 'realme'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-power-button', name: 'زر طاقة', nameEn: 'Power button flex', category: 'فليكسات', brands: ['Samsung', 'Xiaomi', 'Huawei', 'OPPO'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-volume', name: 'فليكس أزرار الصوت', nameEn: 'Volume button flex', category: 'فليكسات', brands: ['Samsung', 'Xiaomi', 'Huawei', 'OPPO'], quality: 'خدمة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-sim-tray', name: 'درج الشريحة', nameEn: 'SIM tray', category: 'مكونات داخلية', brands: ['Samsung', 'Xiaomi', 'OPPO', 'vivo', 'Motorola'], quality: 'أصلية/تجارية', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
  { id: 'part-motherboard', name: 'لوحة أم', nameEn: 'Motherboard', category: 'لوحات أم', brands: ['Samsung', 'Xiaomi', 'Huawei', 'OPPO', 'Apple'], quality: 'أصلية مسحوبة', price: null, currency: 'YER', city: 'حسب المدينة', supplier: 'WHITE BLACK', availability: 'on-request', updatedAt: '2026-10-26', status: 'on-request', publishStatus: 'published' },
]

export const seedSuppliers: Supplier[] = [
  { id: 'sup-brxvih', name: 'WHITE BLACK — brxvih', city: 'اليمن', phone: '+967777066424', whatsapp: '+967777066424', specialties: ['قطع غيار', 'شاشات', 'صيانة', 'سوفت وير'], verified: true, notes: 'المورد الرسمي للمنصة. الأسعار والتوفر يتم تأكيدهما قبل الطلب.' },
]

const portals: Array<[string, string, string, string]> = [
  ['Samsung', 'Samsung Galaxy', 'Samsung Support', 'https://www.samsung.com/ae/support/'],
  ['Redmi', 'Redmi / Xiaomi', 'Xiaomi Support', 'https://www.mi.com/global/support/'],
  ['Xiaomi', 'Xiaomi Series', 'Xiaomi Support', 'https://www.mi.com/global/support/'],
  ['POCO', 'POCO Series', 'POCO Support', 'https://www.poco.net/global/support/'],
  ['Huawei', 'Huawei', 'Huawei Support', 'https://consumer.huawei.com/en/support/'],
  ['Honor', 'Honor', 'Honor Support', 'https://www.honor.com/global/support/'],
  ['OPPO', 'OPPO', 'OPPO Support', 'https://www.oppo.com/en/support/'],
  ['vivo', 'vivo', 'vivo Support', 'https://www.vivo.com/en/support/'],
  ['realme', 'realme', 'realme Support', 'https://www.realme.com/global/support/'],
  ['OnePlus', 'OnePlus', 'OnePlus Support', 'https://www.oneplus.com/support'],
  ['Apple', 'iPhone', 'Apple Support', 'https://support.apple.com/iphone'],
  ['TECNO', 'TECNO', 'TECNO Support', 'https://www.tecno-mobile.com/support/'],
  ['Infinix', 'Infinix', 'Infinix Support', 'https://www.infinixmobility.com/'],
  ['itel', 'itel', 'itel Support', 'https://www.itel-mobile.com/support/'],
  ['ZTE', 'ZTE', 'ZTE Support', 'https://www.ztedevices.com/en/support/'],
  ['Nubia', 'Nubia', 'Nubia Support', 'https://www.nubia.com/en/support'],
  ['Motorola', 'Motorola', 'Motorola Support', 'https://www.motorola.com/us/support'],
  ['Nokia', 'Nokia', 'Nokia Support', 'https://www.nokia.com/phones/en_int/support'],
  ['LG', 'LG', 'LG Support', 'https://www.lg.com/global/support'],
  ['Google', 'Google Pixel', 'Google Pixel Support', 'https://support.google.com/pixelphone'],
]

export const seedFirmware: FirmwareRecord[] = [
  ...portals.map(([brand, model, source, url]): FirmwareRecord => ({
    id: `fw-portal-${brand.toLowerCase()}`, brand, modelName: model, modelNumber: 'حسب الطراز',
    region: 'حسب المنطقة', version: 'آخر إصدار رسمي', androidVersion: '—', fileType: 'بوابة تحديث رسمية',
    size: '—', downloadUrl: url, sourceName: source, sourceUrl: url,
    updatedAt: '2026-10-26', verified: true, status: 'portal', publishStatus: 'published',
    notes: 'بوابة رسمية للبحث عن تحديثات الطراز. لم يتم تخزين ملف روم غير متحقق منه.',
  })),
  {
    id: 'fw-pixel-factory', brand: 'Google', modelName: 'Google Pixel', modelNumber: 'حسب الطراز',
    region: 'Global', version: 'Factory Images / OTA', androidVersion: 'حسب الإصدار', fileType: 'صور مصنع رسمية',
    size: 'حسب الملف', downloadUrl: 'https://developers.google.com/android/images', sourceName: 'Android Developers',
    sourceUrl: 'https://developers.google.com/android/images', updatedAt: '2026-10-26', verified: true,
    status: 'verified', publishStatus: 'published', notes: 'صور المصنع الرسمية لأجهزة Pixel. تحقق من الطراز والمنطقة قبل التثبيت.',
  },
  {
    id: 'fw-samsung-sammobile', brand: 'Samsung', modelName: 'Samsung Galaxy', modelNumber: 'حسب الطراز',
    region: 'Multi', version: 'Firmware index', androidVersion: 'حسب الإصدار', fileType: 'فهرس رومات',
    size: 'حسب الملف', downloadUrl: 'https://www.sammobile.com/firmware/', sourceName: 'SamMobile',
    sourceUrl: 'https://www.sammobile.com/firmware/', updatedAt: '2026-10-26', verified: true,
    status: 'verified', publishStatus: 'published', notes: 'فهرس مجتمعي معروف لرومات سامسونج. تحقق من CSC والطراز قبل التفليش.',
  },
]

export const tools: ToolItem[] = [
  { id: 'tool-odin', name: 'Odin', category: 'software', descAr: 'أداة تفليش رومات سامسونج على أنظمة ويندوز. استخدم إصدارًا متوافقًا مع طرازك وتأكد من ملفات AP/BL/CP/CSC.', descEn: 'Windows flashing utility for Samsung firmware. Match the tool version and AP/BL/CP/CSC files to your exact model.', platform: 'Windows', risk: 'high', url: 'https://samfw.com/', sourceName: 'SamFW community index' },
  { id: 'tool-miflash', name: 'Mi Flash Tool', category: 'software', descAr: 'أداة رسمية من Xiaomi لتفليش Fastboot ROM. لا تستخدمها إلا مع روم مطابق للطراز والمنطقة.', descEn: 'Xiaomi fastboot flashing utility. Only use firmware matched to the exact model and region.', platform: 'Windows', risk: 'high', url: 'https://www.mi.com/global/support/', sourceName: 'Xiaomi Support' },
  { id: 'tool-spflash', name: 'SP Flash Tool', category: 'software', descAr: 'أداة MediaTek لكتابة صور الفلاش. خطأ في اختيار ملف preloader قد يجعل الجهاز غير قابل للإقلاع.', descEn: 'MediaTek flash image writer. A wrong preloader can brick the device.', platform: 'Windows / Linux', risk: 'high', url: 'https://www.hovatek.com/', sourceName: 'Hovatek guides' },
  { id: 'tool-qfil', name: 'QFIL', category: 'software', descAr: 'أداة Qualcomm Flash Image Loader لوضع EDL. تتطلب ملفات firehose موثوقة وصلاحيات صيانة.', descEn: 'Qualcomm EDL flashing tool requiring trusted firehose files and repair authorization.', platform: 'Windows', risk: 'high', url: 'https://www.hovatek.com/', sourceName: 'Hovatek guides' },
  { id: 'tool-qpst', name: 'QPST', category: 'software', descAr: 'حزمة Qualcomm لتشخيص وبرمجة أجهزة تعتمد على شرائح Qualcomm. للاستخدام المتقدم فقط.', descEn: 'Qualcomm diagnostic and programming suite for advanced repair work.', platform: 'Windows', risk: 'high', url: 'https://www.hovatek.com/', sourceName: 'Hovatek guides' },
  { id: 'tool-adb', name: 'Android Platform Tools', category: 'software', descAr: 'حزمة ADB وFastboot الرسمية من Google. أساسية للتشخيص، النسخ الاحتياطي، وتثبيت التحديثات.', descEn: 'Official Google ADB and Fastboot package for diagnostics, backups, and updates.', platform: 'Windows / macOS / Linux', risk: 'low', url: 'https://developer.android.com/tools/releases/platform-tools', sourceName: 'Android Developers' },
  { id: 'tool-unlocktool', name: 'UnlockTool', category: 'software', descAr: 'أداة تجارية متعددة الوظائف للصيانة والبرمجة. استخدمها فقط على أجهزة تملكها أو لديك تصريح بخدمتها.', descEn: 'Commercial multi-brand service tool. Use only on devices you own or are authorized to service.', platform: 'Windows', risk: 'high', url: 'https://unlocktool.net/', sourceName: 'UnlockTool' },
  { id: 'tool-twrp', name: 'TWRP Recovery', category: 'software', descAr: 'ريكفري مخصص مفتوح المصدر. توفر البناء الرسمي يختلف حسب الطراز، والبناء الخاطئ قد يعطل الجهاز.', descEn: 'Open-source custom recovery. Official builds vary by model; an incorrect build can break boot.', platform: 'Android', risk: 'high', url: 'https://twrp.me/', sourceName: 'TWRP' },
  { id: 'tool-magisk', name: 'Magisk', category: 'software', descAr: 'أداة rooting شائعة. تجذر الجهاز قد يلغي الضمان ويكسر تطبيقات البنوك والحماية.', descEn: 'Popular rooting solution. Rooting can void warranty and break banking or integrity checks.', platform: 'Android', risk: 'high', url: 'https://github.com/topjohnwu/Magisk', sourceName: 'GitHub — topjohnwu' },
  { id: 'tool-7zip', name: '7-Zip', category: 'software', descAr: 'أداة مفتوحة المصدر لفك وضغط الأرشيفات. تحقق دائمًا من تجزئة الملف (MD5/SHA) بعد فك الضغط.', descEn: 'Open-source archive utility. Always verify MD5/SHA hashes after extraction.', platform: 'Windows / Linux', risk: 'low', url: 'https://www.7-zip.org/', sourceName: '7-Zip' },
  { id: 'tool-hw-screwdriver', name: 'طقم مفكات دقيقة', category: 'hardware', descAr: 'مفكات Torx وPentalobe وPhillips عالية الجودة. استخدم مقاسًا مطابقًا لتجنب تلف المسامير.', descEn: 'Quality Torx, Pentalobe, and Phillips drivers. Use the exact size to avoid stripped screws.', platform: 'ورشة', risk: 'medium', url: '', sourceName: 'WHITE BLACK' },
  { id: 'tool-hw-hotplate', name: 'سخان شاشة / Hot Plate', category: 'hardware', descAr: 'لفك الغراء الحراري بدرجة مضبوطة. الحرارة الزائدة تتلف الشاشة والبطارية.', descEn: 'Controlled heat to soften display adhesive. Excess heat damages panels and batteries.', platform: 'ورشة', risk: 'high', url: '', sourceName: 'WHITE BLACK' },
  { id: 'tool-hw-suction', name: 'شفاطة شاشة + أدوات فتح', category: 'hardware', descAr: 'أدوات فتح بلاستيكية ومعدنية رقيقة لفصل الشاشة دون إتلاف الإطار أو الكابلات.', descEn: 'Suction cup and thin pry tools to separate displays without damaging frames or cables.', platform: 'ورشة', risk: 'medium', url: '', sourceName: 'WHITE BLACK' },
  { id: 'tool-hw-usb', name: 'USB Power Meter', category: 'diagnostic', descAr: 'قياس الجهد والتيار أثناء الشحن لتشخيص منفذ الشحن والبطارية والشاحن.', descEn: 'Measures voltage and current while charging to diagnose ports, batteries, and chargers.', platform: 'ورشة', risk: 'low', url: '', sourceName: 'WHITE BLACK' },
  { id: 'tool-hw-multimeter', name: 'ملتيميتر رقمي', category: 'diagnostic', descAr: 'فحص الاستمرارية والجهد وقصر الدوائر. استخدمه لفهم مسار الطاقة قبل استبدال القطع.', descEn: 'Continuity, voltage, and short-circuit testing before replacing parts.', platform: 'ورشة', risk: 'medium', url: '', sourceName: 'WHITE BLACK' },
]

export const services: ServiceItem[] = [
  { id: 'svc-screen', titleAr: 'استبدال الشاشات', titleEn: 'Display replacement', descAr: 'تشخيص دقيق للعرض واللمس، وتركيب شاشة أصلية أو خدمة أو تجارية حسب الميزانية مع اختبار كامل.', descEn: 'Accurate display and touch diagnostics with original, service-pack, or commercial options.', icon: 'smartphone', duration: '45–120 دقيقة', featuresAr: ['فحص اللمس والعرض', 'خيارات جودة متعددة', 'ضمان تركيب', 'اختبار بعد الإصلاح'], featuresEn: ['Touch and display test', 'Multiple quality tiers', 'Installation warranty', 'Post-repair testing'] },
  { id: 'svc-battery', titleAr: 'استبدال البطاريات', titleEn: 'Battery replacement', descAr: 'قياس صحة البطارية ودورات الشحن، واستبدالها ببطارية مناسبة مع فحص دائرة الشحن.', descEn: 'Battery health and cycle diagnostics, replacement, and charging circuit inspection.', icon: 'battery', duration: '30–60 دقيقة', featuresAr: ['فحص صحة البطارية', 'فحص الشحن السريع', 'بطاريات معتمدة', 'تدوير آمن للبطاريات'], featuresEn: ['Battery health check', 'Fast-charge testing', 'Certified batteries', 'Safe disposal'] },
  { id: 'svc-software', titleAr: 'سوفت وير وتفليش', titleEn: 'Software and flashing', descAr: 'إصلاح أعطال النظام، إعادة التعيين، التفليش برومات رسمية، ومعالجة مشاكل التحديث دون كسر الحماية.', descEn: 'System repair, resets, official firmware flashing, and update recovery without bypassing protections.', icon: 'terminal', duration: '30–180 دقيقة', featuresAr: ['نسخ احتياطي أولاً', 'رومات رسمية فقط', 'التحقق من الطراز', 'تقرير ما بعد الصيانة'], featuresEn: ['Backup first', 'Official firmware only', 'Model verification', 'Post-service report'] },
  { id: 'svc-data', titleAr: 'استعادة البيانات', titleEn: 'Data recovery', descAr: 'محاولة استعادة الصور والملفات من أجهزة تعمل أو متعطلة، مع توضيح احتمالات النجاح قبل البدء.', descEn: 'Recovery attempts for photos and files from working or failed devices, with realistic expectations.', icon: 'database', duration: 'حسب الحالة', featuresAr: ['تقييم أولي', 'عدم وعد بنسبة مضمونة', 'خصوصية كاملة', 'تسليم آمن'], featuresEn: ['Initial assessment', 'No guaranteed outcome', 'Full privacy', 'Secure handover'] },
  { id: 'svc-diagnostic', titleAr: 'تشخيص الأعطال', titleEn: 'Fault diagnostics', descAr: 'تشخيص منهجي للأعطال الكهربائية، الحرارية، وأعطال البرمجيات قبل استبدال أي قطعة.', descEn: 'Systematic diagnosis of electrical, thermal, and software faults before replacing parts.', icon: 'activity', duration: '20–90 دقيقة', featuresAr: ['قياس كهربائي', 'فحص حراري', 'اختبار مكونات', 'تقرير واضح'], featuresEn: ['Electrical testing', 'Thermal inspection', 'Component testing', 'Clear report'] },
  { id: 'svc-security', titleAr: 'تأمين الجهاز', titleEn: 'Device security', descAr: 'مراجعة إعدادات الحماية، تحديث النظام، ضبط الحسابات، وتقليل سطح الهجوم دون أدوات تخمين أو كسر.', descEn: 'Security settings review, updates, account hardening, and attack-surface reduction.', icon: 'shield', duration: '30–60 دقيقة', featuresAr: ['تحديثات أمنية', 'مراجعة الصلاحيات', 'حماية الحسابات', 'نصائح عملية'], featuresEn: ['Security updates', 'Permission review', 'Account protection', 'Practical guidance'] },
]

export const faultGuides: FaultGuide[] = [
  { id: 'fault-bootloop', titleAr: 'الهاتف يعيد التشغيل باستمرار', titleEn: 'Phone stuck in a boot loop', deviceType: 'أندرويد / آيفون', symptoms: ['إعادة تشغيل متكررة', 'توقف عند شعار الشركة', 'سخونة أثناء الإقلاع'], causes: ['تحديث فاشل', 'تعارض تطبيقات', 'امتلاء التخزين', 'عطل في البطارية أو اللوحة'], difficulty: 'intermediate', risk: 'medium', tools: ['كمبيوتر', 'كابل موثوق', 'أداة النسخ الاحتياطي'], steps: ['افصل الشاحن واترك الجهاز يبرد.', 'جرّب الإقلاع في وضع Safe Mode لإزالة آخر تطبيق.', 'تحقق من مساحة التخزين إن كان الإقلاع ممكنًا.', 'اعمل نسخة احتياطية قبل أي إجراء متقدم.', 'استخدم استرداد النظام الرسمي أو رومًا مطابقًا للطراز.', 'إن استمر العطل، افصل البطارية واختبر دارة الطاقة مع فني مؤهل.'] },
  { id: 'fault-battery', titleAr: 'نقص البطارية السريع', titleEn: 'Fast battery drain', deviceType: 'أندرويد / آيفون', symptoms: ['انخفاض حاد دون استخدام', 'حرارة غير طبيعية', 'إغلاق مفاجئ عند 20–30%'], causes: ['بطارية متدهورة', 'تطبيق يستهلك في الخلفية', 'شحن غير مناسب', 'مشكلة في اللوحة'], difficulty: 'beginner', risk: 'low', tools: ['إعدادات البطارية', 'تطبيق قياس صحة البطارية'], steps: ['راجع استهلاك البطارية لكل تطبيق.', 'قلل مزامنة الحسابات والإشعارات غير الضرورية.', 'اختبر الشحن بشاحن أصلي أو معتمد.', 'افحص صحة البطارية ودورات الشحن عبر التشخيص.', 'إن كانت الصحة منخفضة أو منتفخة، استبدل البطارية فورًا.', 'لا تستخدم بطارية منتفخة أو تلحمها بنفسك.'] },
  { id: 'fault-charging', titleAr: 'لا يشحن أو الشحن متقطع', titleEn: 'Not charging or intermittent charging', deviceType: 'أندرويد', symptoms: ['لا يظهر مؤشر الشحن', 'يشحن عند تحريك الكابل', 'شحن بطيء جدًا'], causes: ['كابل أو شاحن تالف', 'غبار في المنفذ', 'فليكس شحن تالف', 'عطل في IC الشحن'], difficulty: 'intermediate', risk: 'medium', tools: ['كابل آخر', 'USB Power Meter', 'فرشاة تنظيف', 'ملتيميتر'], steps: ['جرّب كابلًا وشاحنًا معروفين ومساحة نظيفة.', 'افحص المنفذ ضوئيًا ونظفه بلطف دون أدوات معدنية.', 'قس الجهد والتيار باستخدام USB Power Meter.', 'أعد تشغيل الجهاز وجرّب شحنًا في وضع إيقاف التشغيل.', 'إن ظهر تيار منخفض جدًا، افحص فليكس الشحن ثم دائرة IC.', 'استبدال IC الشحن يتطلب محطة لحام خبيرة.'] },
  { id: 'fault-touch', titleAr: 'اللمس لا يعمل أو يهتز', titleEn: 'Touch not working or ghost touches', deviceType: 'أندرويد / آيفون', symptoms: ['أجزاء لا تستجيب', 'لمس عشوائي', 'خطوط على الشاشة'], causes: ['شاشة متضررة', 'كابل شاشة غير مثبت', 'ضغط على الإطار', 'سوفت وير'], difficulty: 'intermediate', risk: 'high', tools: ['اختبار اللمس', 'مفكات دقيقة', 'شفاطة'], steps: ['أعد تشغيل الجهاز وجرّب اختبار اللمس.', 'أزل واقي الشاشة إن كان مشوهًا أو مضغوطًا.', 'تحقق من عدم وجود ضغط على الغطاء أو الإطار.', 'افحص كابل الشاشة بعد فتح الجهاز بحذر.', 'استبدل الشاشة عند وجود تلف واضح في الطبقة اللمسية.', 'لا تسخّن الشاشة أكثر من اللازم أثناء الفك.'] },
  { id: 'fault-water', titleAr: 'الجهاز تعرض للماء', titleEn: 'Water-damaged phone', deviceType: 'أندرويد / آيفون', symptoms: ['لا يعمل', 'شاشة مشوشة', 'صوت ضعيف', 'شحن غير طبيعي'], causes: ['تسرب سائل', 'تآكل الأطراف', 'تماس كهربائي'], difficulty: 'advanced', risk: 'high', tools: ['مفكات', 'حمام أولتراسونيك', 'كحول أيزوبروبيل', 'فرشاة'], steps: ['أطفئ الجهاز ولا تشحنه إطلاقًا.', 'لا تستخدم مجفف الشعر الساخن ولا الأرز.', 'افتح الجهاز وافصل البطارية إن أمكن.', 'أزل التآكل بمحلول تنظيف إلكتروني مناسب.', 'جفف اللوحة بالكامل قبل إعادة الطاقة.', 'قد تحتاج اللوحة إلى إصلاح متخصص. تحقق من البيانات لاحقًا.'] },
  { id: 'fault-overheat', titleAr: 'ارتفاع حرارة الهاتف', titleEn: 'Phone overheating', deviceType: 'أندرويد / آيفون', symptoms: ['سخونة عند الاستخدام العادي', 'خفض سطوع تلقائي', 'بطء وأعطال'], causes: ['تطبيق خلفي معطل', 'شحن سريع أثناء اللعب', 'بطارية متدهورة', 'مشكلة في اللوحة'], difficulty: 'beginner', risk: 'medium', tools: ['إعدادات النظام', 'مراقب الحرارة'], steps: ['أغلق التطبيقات الثقيلة وراقب الحرارة.', 'أزل الغطاء السميك أثناء الشحن أو الألعاب.', 'أوقف الشحن السريع مؤقتًا.', 'حدّث النظام والتطبيقات.', 'افحص البطارية واللوحة إن كانت السخونة موضعية.', 'لا تبرّد الجهاز في الثلاجة أو الماء.'] },
  { id: 'fault-nosignal', titleAr: 'لا توجد شبكة أو شريحة', titleEn: 'No network or SIM detected', deviceType: 'أندرويد / آيفون', symptoms: ['لا خدمة', 'شريحة غير موجودة', 'انقطاع المكالمات'], causes: ['شريحة تالفة', 'درج شريحة', 'برنامج modem', 'عطل في اللوحة'], difficulty: 'intermediate', risk: 'medium', tools: ['شريحة بديلة', 'كابل', 'إعدادات الشبكة'], steps: ['أعد تركيب الشريحة وتأكد من اتجاهها.', 'جرّب شريحة أخرى في نفس الجهاز.', 'أعد ضبط شبكة الجوال (قد تحذف APN).', 'حدّث النظام وتحقق من إعدادات المشغل.', 'افحص درج الشريحة والهوائي.', 'إذا فشل كل ذلك، افحص دائرة الشبكة مع فني.'] },
  { id: 'fault-camera', titleAr: 'الكاميرا سوداء أو غير واضحة', titleEn: 'Camera black or blurry', deviceType: 'أندرويد / آيفون', symptoms: ['شاشة سوداء', 'ضباب', 'عدم تركيز', 'اهتزاز'], causes: ['غبار أو رطوبة', 'زجاج الكاميرا متضرر', 'تطبيق الكاميرا', 'وحدة كاميرا'], difficulty: 'intermediate', risk: 'medium', tools: ['قماش مناسب', 'اختبار الكاميرا', 'مفكات'], steps: ['نظّف العدسة بقطعة ميكروفايبر.', 'أعد تشغيل الجهاز وامسح بيانات تطبيق الكاميرا.', 'جرّب تطبيق كاميرا آخر لاستبعاد البرمجيات.', 'افحص زجاج الكاميرا بحثًا عن شقوق أو ضباب داخلي.', 'استبدل وحدة الكاميرا إن كانت تالفة.', 'تعامل مع الرطوبة في ورشة متخصصة.'] },
  { id: 'fault-storage', titleAr: 'التخزين ممتلئ أو بطيء', titleEn: 'Storage full or slow', deviceType: 'أندرويد / آيفون', symptoms: ['تحذير مساحة', 'تعذر تحديث التطبيقات', 'بطء عام'], causes: ['وسائط مكررة', 'تطبيقات ثقيلة', 'ملفات مؤقتة', 'فشل في التخزين'], difficulty: 'beginner', risk: 'low', tools: ['إعدادات التخزين', 'نسخة احتياطية'], steps: ['راجع التخزين حسب النوع والتطبيق.', 'انقل الصور إلى نسخة احتياطية موثوقة.', 'امسح ذاكرة التطبيقات المؤقتة.', 'أزل التطبيقات غير المستخدمة.', 'لا تملأ التخزين بالكامل؛ اترك مساحة للنظام.', 'إن ظهرت أخطاء قراءة/كتابة، افحص ذاكرة التخزين.'] },
  { id: 'fault-wifi', titleAr: 'مشاكل الواي فاي والبلوتوث', titleEn: 'Wi-Fi and Bluetooth issues', deviceType: 'أندرويد / آيفون', symptoms: ['لا يرى الشبكات', 'انقطاع متكرر', 'بطء', 'عدم اقتران'], causes: ['تعارض إعدادات', 'تحديث ناقص', 'تداخل شبكات', 'عطل هوائي'], difficulty: 'beginner', risk: 'low', tools: ['إعدادات الشبكة', 'راوتر آخر'], steps: ['أعد تشغيل الهاتف والراوتر.', 'انسَ الشبكة وأعد الاقتران.', 'أعد ضبط إعدادات الشبكة.', 'اختبر شبكة أخرى (2.4GHz/5GHz).', 'حدّث النظام.', 'إن كان العطل في الهوائي أو اللوحة، يحتاج فحصًا فنيًا.'] },
]

export const articles: Article[] = [
  {
    id: 'art-odin', slug: 'samsung-odin-safe-flash', category: 'tutorial', featured: true, publishStatus: 'published',
    titleAr: 'دليل التفليش الآمن لسامسونج باستخدام Odin', titleEn: 'Safe Samsung flashing with Odin',
    excerptAr: 'خطوات عملية للتحقق من الطراز، نسخ البيانات، وتفليش روم رسمي متوافق دون فقدان IMEI أو كسر الحماية.',
    excerptEn: 'A practical workflow to verify model, back up data, and flash a matching official firmware without losing IMEI or protections.',
    readMinutes: 9, date: '2026-10-20', tags: ['Samsung', 'Odin', 'تفليش', 'روم رسمي'],
    body: [
      { heading: 'قبل أي شيء: اعرف طرازك بدقة', headingEn: 'First: identify the exact model', paragraphs: ['افتح الإعدادات ← حول الهاتف، أو أدخل *#1234#، أو اقرأ رقم SM-xxxx على العلبة. لا تعتمد على الاسم التجاري فقط؛ فقد تحمل السلسلة نفسها عدة أرقام طراز بمناطق مختلفة.', 'تحقق من CSC/المنطقة من إعدادات البرنامج الثابت. روم لمنطقة مختلفة قد يعمل، لكنه قد يسبب مشاكل في الشبكة أو المكالمات أو التحديثات.'], list: ['لا تفليش جهازًا لا تملكه أو لا تملك تصريحًا بخدمته.', 'لا تستخدم ملفات من مواقع غير معروفة.', 'تأكد من بطارية 50% على الأقل ومن كابل بيانات سليم.'] },
      { heading: 'نسخة احتياطية قابلة للاستعادة', headingEn: 'Recoverable backup', paragraphs: ['انسخ الصور والفيديو والمستندات إلى حاسوب أو تخزين خارجي. لا تعتمد على نسخة سحابية وحدها إذا كانت الشبكة ضعيفة. سجّل إعدادات Google وWhatsApp وتحقق من اكتمال الاستعادة.', 'بعض الأدوات تمسح البيانات عند التفليش. اسأل نفسك: هل لدى صاحب الجهاز نسخة مؤكدة؟ إن كانت الإجابة لا، توقف.'] },
      { heading: 'تحميل الملفات الصحيحة', headingEn: 'Download the right files', paragraphs: ['يحتاج التفليش عادة إلى ملفات AP وBL وCP وCSC. استخدم CSC العادي للحفاظ على البيانات عندما يكون ذلك مناسبًا، وCSC_HOME أو الملف الذي يمسح البيانات فقط عند الحاجة إلى إصلاح جذري.', 'تحقق من تجزئة الملف إن توفرت. حجم غير منطقي أو أرشيف تالف يعني توقفًا فوريًا.'] },
      { heading: 'التفليش والتحقق', headingEn: 'Flash and verify', paragraphs: ['ثبّت تعريفات Samsung USB، افتح Odin، وضع الجهاز في Download Mode، وأضف الملفات في خاناتها الصحيحة. لا تضع ملفًا في خانة خاطئة لمجرد أنها فارغة.', 'انتظر رسالة PASS. سيعيد الجهاز التشغيل وقد يستغرق الإقلاع الأول دقائق. بعد الإقلاع اختبر الشبكة، الكاميرا، الصوت، والبصمة، ثم تحقق من حالة IMEI.'] },
      { heading: 'عند الفشل', headingEn: 'If it fails', paragraphs: ['إذا توقف Odin، لا تفصل الكابل فورًا. أعد المحاولة بكابل ومنفذ USB مختلفين، وبإصدار Odin متوافق. إذا ظهرت شاشة سوداء أو رسالة تحديث فاشل، أعد الدخول إلى Download Mode وجرّب رومًا رسميًا مطابقًا.', 'لا تستخدم ملفات PIT أو إصلاحات عشوائية قبل فهم سبب الفشل. التدخل غير المدروس قد يحول عطلًا بسيطًا إلى فقدان بيانات أو جهاز غير قابل للإقلاع.'] },
    ],
  },
  {
    id: 'art-backup', slug: 'phone-backup-checklist', category: 'tutorial', featured: true, publishStatus: 'published',
    titleAr: 'قائمة نسخ احتياطي قبل أي صيانة', titleEn: 'Pre-repair backup checklist',
    excerptAr: 'ما الذي يجب نسخه قبل الصيانة، وكيف تتحقق من أن النسخة قابلة للاستعادة فعلًا؟',
    excerptEn: 'What to back up before repair and how to prove the backup can actually be restored.',
    readMinutes: 6, date: '2026-10-18', tags: ['نسخ احتياطي', 'بيانات', 'صيانة'],
    body: [
      { heading: 'الملفات الشخصية أولًا', headingEn: 'Personal files first', paragraphs: ['ابدأ بالصور والفيديو والمستندات والتسجيلات الصوتية. انسخها إلى حاسوب ثم إلى قرص خارجي أو سحابة. لا تنسخ إلى نفس الهاتف أو إلى بطاقة SD داخل الجهاز فقط.'] },
      { heading: 'التطبيقات وحساباتها', headingEn: 'Apps and accounts', paragraphs: ['تحقق من نسخة WhatsApp إن كانت مهمة، وسجّل الدخول إلى حسابات البريد والصور. بعض التطبيقات لا تستعيد بياناتها من النسخة السحابية، لذا صدّر البيانات المهمة يدويًا.'] },
      { heading: 'التحقق من الاستعادة', headingEn: 'Verify restoration', paragraphs: ['افتح بعض الملفات من النسخة على جهاز آخر. عدد الملفات وحجم المجلدات يجب أن يكونا منطقيين. النسخة التي لم تُختبر ليست ضمانًا؛ إنها مجرد أمل.'] },
      { heading: 'ما لا يجب نسخه', headingEn: 'What not to copy', paragraphs: ['لا تنسخ بيانات البنوك أو الرموز السرية إلى تطبيقات ملاحظات غير مشفرة. لا تشارك نسخة كاملة تحتوي على صور خاصة مع طرف ثالث دون اتفاق واضح على الحذف.'] },
    ],
  },
  {
    id: 'art-screen', slug: 'screen-replacement-quality', category: 'tutorial', featured: false, publishStatus: 'published',
    titleAr: 'كيف تفرّق بين أنواع الشاشات قبل الاستبدال؟', titleEn: 'Original vs service-pack vs commercial screens',
    excerptAr: 'الأصلي والخدمة والتجاري والمجدّد والمستعمل: الفرق في الجودة والسعر والضمان، وكيف تختار بوعي.',
    excerptEn: 'Original, service-pack, commercial, refurbished, and used panels: quality, price, warranty, and how to choose.',
    readMinutes: 7, date: '2026-10-14', tags: ['شاشات', 'قطع غيار', 'جودة'],
    body: [
      { heading: 'الأصلي ليس دائمًا متاحًا', headingEn: 'Original is not always available', paragraphs: ['الشاشة الأصلية تأتي من نفس سلسلة التوريد أو بمواصفات المصنع. قد تكون مكلفة وقد يصعب تأمينها للطرازات القديمة. اطلب من الفني توضيح المصدر قبل الدفع.'] },
      { heading: 'Service Pack وCommercial', headingEn: 'Service pack and commercial', paragraphs: ['Service Pack غالبًا قطعة مصنع مخصصة للصيانة، بجودة قريبة من الأصلية. Commercial أو aftermarket تختلف في السطوع والألوان ومعدل التحديث واللمس. الفرق قد لا يظهر في أول يوم، لكنه يظهر في الاستخدام الطويل.'] },
      { heading: 'المجدّد والمستعمل', headingEn: 'Refurbished and used', paragraphs: ['الشاشة المجددة قد تكون أصلية أُعيد تجميعها بزجاج جديد. المستعملة تأتي من جهاز آخر وقد تحمل خدوشًا أو عمرًا استهلاكيًا. لا تُسلّم جهازك قبل توضيح نوع الشاشة وضمان التركيب.'] },
      { heading: 'اختبار بعد التركيب', headingEn: 'Post-install test', paragraphs: ['اختبر اللمس في كل الزوايا، السطوع، الألوان، مستشعر القرب، والكاميرا الأمامية. التقط صورة قبل وبعد. لا تدفع كامل المبلغ قبل أن ترى النتيجة وتفهم مدة الضمان.'] },
    ],
  },
  {
    id: 'art-water', slug: 'water-damage-first-aid', category: 'tutorial', featured: false, publishStatus: 'published',
    titleAr: 'الإسعاف الأولي للهاتف المبلل', titleEn: 'First aid for a wet phone',
    excerptAr: 'ما تفعله وما لا تفعله في أول دقائق، ولماذا الأرز ليس حلًا.',
    excerptEn: 'What to do and avoid in the first minutes, and why rice is not a repair.',
    readMinutes: 5, date: '2026-10-10', tags: ['ماء', 'أعطال', 'صيانة'],
    body: [
      { heading: 'أطفئ ولا تشحن', headingEn: 'Power off, do not charge', paragraphs: ['افصل أي كابل فورًا. لا تحاول الشحن لمعرفة إن كان يعمل. الماء مع الكهرباء يصنع تآكلًا وتماسًا قد يتلف اللوحة.'] },
      { heading: 'لا حرارة ولا أرز', headingEn: 'No heat, no rice', paragraphs: ['مجفف الشعر الساخن يدفع الرطوبة إلى الداخل ويذيب مواد لاصقة. الأرز لا يسحب الرطوبة من داخل اللوحة، وقد يدخل الغبار والحبيبات.'] },
      { heading: 'التنظيف المتخصص', headingEn: 'Professional cleaning', paragraphs: ['أفضل فرصة تكون بفتح الجهاز وفصل البطارية وتنظيف اللوحة بمحلول إلكتروني مناسب وحمام أولتراسونيك عند الحاجة. هذا عمل فني، وليس تجربة منزلية.'] },
      { heading: 'البيانات', headingEn: 'Data', paragraphs: ['إذا كان الجهاز لا يقلع بعد التنظيف، فقد تكون البيانات قابلة للاستخراج من الذاكرة بطرق متخصصة. لا تكرر محاولات الشحن قبل فحص الدائرة.'] },
    ],
  },
  {
    id: 'art-battery', slug: 'battery-health-guide', category: 'tutorial', featured: false, publishStatus: 'published',
    titleAr: 'حماية البطارية: عادات تزيد عمرها', titleEn: 'Battery care that actually helps',
    excerptAr: 'الشحن الجزئي، الحرارة، الشواحن، ودورات التفريغ: ما يهم فعلًا وما هو خرافة.',
    excerptEn: 'Partial charging, heat, chargers, and discharge cycles: what matters and what is a myth.',
    readMinutes: 6, date: '2026-10-06', tags: ['بطارية', 'شحن', 'نصائح'],
    body: [
      { heading: 'الحرارة هي العدو', headingEn: 'Heat is the enemy', paragraphs: ['لا تترك الهاتف تحت الشمس أو على لوحة سيارة، ولا تشحنه بغطاء سميك أثناء اللعب. الحرارة المتكررة تسرّع تدهور الخلايا أكثر من أي عادة أخرى.'] },
      { heading: 'الشحن بين 20 و85', headingEn: 'Charge between 20 and 85', paragraphs: ['لا تحتاج إلى تفريغ البطارية بالكامل. الشحن الجزئي مناسب لبطاريات الليثيوم. الشحن السريع ليس خطرًا بحد ذاته إذا كان النظام والشاحن معتمدين.'] },
      { heading: 'الشاحن والكابل', headingEn: 'Charger and cable', paragraphs: ['استخدم شاحنًا معتمدًا وكابلًا سليمًا. الشواحن الرخيصة قد تسبب شحنًا غير مستقر أو حرارة. لا تستخدم محولاً لا يحمل مواصفات واضحة.'] },
      { heading: 'متى تستبدل؟', headingEn: 'When to replace', paragraphs: ['إذا انخفضت السعة بشكل ملحوظ، أو ظهر إغلاق مفاجئ، أو انتفاخ في الغطاء، استبدل البطارية. لا تفتح بطارية منتفخة ولا تضغطها.'] },
    ],
  },
  {
    id: 'art-2fa', slug: 'account-hardening-2fa', category: 'security', featured: true, publishStatus: 'published',
    titleAr: 'تأمين حساباتك: 2FA بدون فخاخ', titleEn: 'Account hardening: 2FA without the traps',
    excerptAr: 'كيف تختار طريقة تحقق ثانية قوية، وتتجنب فقدان الوصول أو سرقة الرموز.',
    excerptEn: 'Choose a strong second factor and avoid lockout or code theft.',
    readMinutes: 8, date: '2026-10-22', tags: ['أمان', '2FA', 'حسابات'],
    body: [
      { heading: 'الرمز عبر SMS ليس الأقوى', headingEn: 'SMS codes are not the strongest', paragraphs: ['SMS أفضل من لا شيء، لكنه معرض لتبديل الشريحة وهجمات الاعتراض. إن كان الحساب يدعم تطبيق مصادقة أو مفتاح أمان، فاستخدمه.'] },
      { heading: 'احفظ رموز الاستعادة', headingEn: 'Store recovery codes', paragraphs: ['أنشئ رموز استعادة واحفظها خارج الهاتف، في مكان موثوق. إن فقدت الهاتف، ستحتاجها أكثر من أي وقت. لا تحفظها في ملاحظات غير مشفرة.'] },
      { heading: 'لا تشارك الرمز', headingEn: 'Never share the code', paragraphs: ['لا يوجد دعم شرعي يطلب رمز 2FA أو كلمة المرور عبر مكالمة أو واتساب. أي طلب كهذا هو تصيد. اقطع الاتصال وافتح الموقع بنفسك.'] },
      { heading: 'أجهزة متعددة', headingEn: 'Multiple devices', paragraphs: ['سجّل جهازًا احتياطيًا للمصادقة، وراجع الأجهزة النشطة. احذف الجلسات القديمة، وفعّل تنبيهات تسجيل الدخول.'] },
    ],
  },
  {
    id: 'art-phishing', slug: 'phishing-on-whatsapp', category: 'security', featured: false, publishStatus: 'published',
    titleAr: 'التصيد عبر واتساب: كيف تكتشفه قبل النقر؟', titleEn: 'WhatsApp phishing: spot it before you tap',
    excerptAr: 'رسائل «جائزة» و«تحديث واتساب» وروابط الحسابات المسروقة: علامات واضحة وخطوات احتواء.',
    excerptEn: 'Prize messages, fake WhatsApp updates, and stolen-account links: clear signs and containment steps.',
    readMinutes: 6, date: '2026-10-12', tags: ['تصيد', 'واتساب', 'أمان'],
    body: [
      { heading: 'الاستعجال والسرية', headingEn: 'Urgency and secrecy', paragraphs: ['الرسائل التي تطلب إجراءً فوريًا أو تحذرك من حذف حسابك غالبًا تصيد. لا تضغط رابطًا من رسالة غير متوقعة، حتى لو جاءت من صديق — قد يكون حسابه مخترقًا.'] },
      { heading: 'تحقق من النطاق', headingEn: 'Check the domain', paragraphs: ['اقرأ عنوان الرابط قبل فتحه. النطاقات المشابهة مثل whatsapp-verify.example ليست الموقع الرسمي. لا تدخل رمز التحقق في أي صفحة وصلت إليها من رابط.'] },
      { heading: 'إن ضغطت', headingEn: 'If you tapped', paragraphs: ['أغلق الصفحة، غيّر كلمة المرور من جهاز موثوق، وسجّل خروج جميع الأجهزة. راجع الأجهزة المرتبطة في إعدادات واتساب وفعّل التحقق بخطوتين. أخبر من أرسل الرابط إن كان حسابه مخترقًا.'] },
      { heading: 'الإبلاغ', headingEn: 'Report', paragraphs: ['أبلغ عن الرابط داخل التطبيق، وامسح الرسالة. إن كانت بيانات بنكية قد أُدخلت، اتصل بالبنك فورًا.'] },
    ],
  },
  {
    id: 'art-android', slug: 'android-security-baseline', category: 'security', featured: false, publishStatus: 'published',
    titleAr: 'خط أساس أمني لهاتف أندرويد', titleEn: 'Android security baseline',
    excerptAr: 'إعدادات لا تستغرق 20 دقيقة وتقلل مخاطر الاختراق والسرقة بشكل ملموس.',
    excerptEn: 'Settings that take 20 minutes and measurably reduce compromise and theft risk.',
    readMinutes: 7, date: '2026-10-08', tags: ['أندرويد', 'أمان', 'إعدادات'],
    body: [
      { heading: 'القفل والتحديثات', headingEn: 'Lock and updates', paragraphs: ['استخدم رمزًا قويًا أو بصمة مع رقم احتياطي. لا تستخدم نمطًا بسيطًا. ثبّت تحديثات الأمان شهريًا إن كانت متاحة، وراجع إصدار الأمان في الإعدادات.'] },
      { heading: 'الصلاحيات', headingEn: 'Permissions', paragraphs: ['راجع التطبيقات التي تملك الوصول إلى الموقع والميكروفون والكاميرا وسجل المكالمات. أزل الوصول عن التطبيقات التي لا تحتاجه.'] },
      { heading: 'التثبيت من مصادر آمنة', headingEn: 'Safe installation', paragraphs: ['ابقَ على Play Store أو F-Droid. لا تثبت APK من روابط عشوائية. تعطيل «تثبيت التطبيقات غير المعروفة» عند عدم الحاجة.'] },
      { heading: 'السرقة', headingEn: 'Theft', paragraphs: ['فعّل «اعثر على جهازي»، وسجّل بصمة الجهاز، واحفظ IMEI. فعّل قفلًا لا يسمح بإيقاف الشبكة دون كلمة مرور إن كان النظام يدعم ذلك.'] },
    ],
  },
  {
    id: 'art-pentest', slug: 'authorized-mobile-testing', category: 'security', featured: false, publishStatus: 'published',
    titleAr: 'اختبار اختراق التطبيقات: الحدود القانونية والأخلاقية', titleEn: 'Mobile pentesting: legal and ethical boundaries',
    excerptAr: 'ما يسمح به الاختبار المصرح، وكيف تحمي نفسك قانونيًا قبل لمس أي تطبيق.',
    excerptEn: 'What authorized testing allows and how to protect yourself legally before touching an app.',
    readMinutes: 8, date: '2026-10-04', tags: ['اختبار اختراق', 'قانون', 'أخلاق'],
    body: [
      { heading: 'التصريح المكتوب أولًا', headingEn: 'Written authorization first', paragraphs: ['لا تختبر تطبيقًا أو شبكة لا تملكها دون تصريح مكتوب يحدد النطاق والتوقيت والأصول المسموح بها. «أريد اختبار أمان موقعك» في محادثة لا يكفي.'] },
      { heading: 'بيئة آمنة', headingEn: 'Safe environment', paragraphs: ['استخدم أجهزة وبيانات وهمية، ولا تلمس بيانات مستخدمين حقيقيين. استخدم مختبرات مثل OWASP MASVS وMSTG للتعلّم، وتطبيقات تدريب مخصصة.'] },
      { heading: 'لا تعطّل الخدمة', headingEn: 'Do not disrupt', paragraphs: ['تجنب هجمات الحرمان من الخدمة والاختبار على الإنتاج دون موافقة. أي اكتشاف ثغرة يجب أن يُبلغ عنه بشكل مسؤول وليس استغلاله.'] },
      { heading: 'احتفظ بالأدلة', headingEn: 'Keep evidence', paragraphs: ['سجّل النطاق والتواريخ والإصدارات والنتائج. احمِ الأدلة، ولا تنشر تفاصيل قابلة للاستغلال قبل الإصلاح.'] },
    ],
  },
  {
    id: 'art-malware', slug: 'android-malware-defense', category: 'security', featured: false, publishStatus: 'published',
    titleAr: 'تحليل البرمجيات الخبيثة على أندرويد — دفاعيًا', titleEn: 'Android malware analysis — defensive',
    excerptAr: 'كيف تفهم سلوك تطبيق مشبوه وأنت في بيئة معزولة، دون تشغيله على جهازك الشخصي.',
    excerptEn: 'Understand suspicious app behavior in an isolated lab without running it on your personal phone.',
    readMinutes: 9, date: '2026-09-30', tags: ['برمجيات خبيثة', 'تحليل', 'مختبر'],
    body: [
      { heading: 'عزل قبل التحليل', headingEn: 'Isolate first', paragraphs: ['استخدم جهازًا مخصصًا أو محاكيًا بلا حسابات شخصية، وشبكة معزولة. لا تمنح التطبيق صلاحيات حقيقية، ولا تسجل الدخول إلى خدماتك.'] },
      { heading: 'البصمة والصلاحيات', headingEn: 'Hashes and permissions', paragraphs: ['احسب SHA-256 للملف، وافحص اسم الحزمة والتوقيع. راجع الصلاحيات المطلوبة: تطبيق مصباح لا يحتاج قراءة الرسائل أو إمكانية الوصول.'] },
      { heading: 'السلوك الشبكي', headingEn: 'Network behavior', paragraphs: ['راقب الاتصالات الصادرة في بيئة معزولة. النطاقات المشبوهة أو الاتصال بعد بدء التشغيل مباشرة يستحقان فحصًا. لا تتفاعل مع خوادم المهاجم.'] },
      { heading: 'الاستجابة', headingEn: 'Response', paragraphs: ['إن كان الجهاز مصابًا، افصل الشبكة، غيّر كلمات المرور من جهاز آخر، وأعد تثبيت النظام من مصدر رسمي. لا تعتمد على «تنظيف» يدوي غير موثوق.'] },
    ],
  },
  {
    id: 'art-imei', slug: 'imei-repair-ethics', category: 'security', featured: false, publishStatus: 'published',
    titleAr: 'لماذا لا نقدم تغيير IMEI أو تجاوز الحسابات؟', titleEn: 'Why we do not change IMEI or bypass accounts',
    excerptAr: 'سياسة واضحة: نحمي الأجهزة والبيانات، ولا نساعد في إخفاء هوية جهاز مسروق أو تجاوز حماية.',
    excerptEn: 'A clear policy: protect devices and data, never help conceal a stolen device or bypass locks.',
    readMinutes: 3, date: '2026-09-28', tags: ['سياسة', 'IMEI', 'أخلاق'],
    body: [
      { heading: 'حدود الخدمة', headingEn: 'Service boundaries', paragraphs: ['نقدم تشخيصًا وإصلاحًا ماديًا وبرمجيًا مشروعًا. لا نغيّر IMEI، ولا نتجاوز قفل حساب أو حماية FRP/iCloud، ولا نساعد في فك جهاز مسروق.'] },
      { heading: 'إثبات الملكية', headingEn: 'Proof of ownership', paragraphs: ['قد نطلب إثبات ملكية أو فاتورة قبل بعض خدمات البرمجة. هذا يحمي العملاء ويحمي المنصة من إساءة الاستخدام.'] },
      { heading: 'البديل المسموح', headingEn: 'Legitimate alternatives', paragraphs: ['إذا كان الجهاز مقفلًا بحسابك، استخدم مسارات الاسترداد الرسمية من الشركة. إن نسيت كلمة المرور، اتبع استرداد الحساب الرسمي.'] },
    ],
  },
  {
    id: 'art-charging', slug: 'charging-port-service', category: 'fault', featured: false, publishStatus: 'published',
    titleAr: 'منفذ الشحن: تنظيف أم استبدال؟', titleEn: 'Charging port: clean or replace?',
    excerptAr: 'أسباب توقف الشحن الشائعة، وطريقة تشخيص آمنة قبل استبدال أي قطعة.',
    excerptEn: 'Common charging failures and a safe diagnostic path before replacing parts.',
    readMinutes: 5, date: '2026-09-26', tags: ['شحن', 'منفذ', 'أعطال'],
    body: [
      { heading: 'ابدأ بالأبسط', headingEn: 'Start simple', paragraphs: ['جرّب كابلًا وشاحنًا آخرين في مقبس مختلف. نظف المنفذ بلطف بفرشاة ناعمة أو ضوء. الغبار المضغوط سبب شائع جدًا.'] },
      { heading: 'قياس التيار', headingEn: 'Measure current', paragraphs: ['استخدم USB Power Meter لمعرفة إن كان الهاتف يسحب طاقة. جهد موجود وتيار صفر يشير إلى مشكلة في المسار أو الحماية.'] },
      { heading: 'الاستبدال', headingEn: 'Replacement', paragraphs: ['إذا كان الفليكس أو المنفذ تالفًا، فاستبداله أرخص من اللوحة. لكن لا تستبدل اللوحة قبل فحص IC الشحن والملفات.'] },
    ],
  },
  {
    id: 'art-refurb', slug: 'buying-used-phone', category: 'tutorial', featured: false, publishStatus: 'published',
    titleAr: 'فحص هاتف مستعمل قبل الشراء', titleEn: 'Inspecting a used phone before buying',
    excerptAr: 'قائمة فحص سريعة للشاشة والبطارية والكاميرات والشبكة وحالة الحساب.',
    excerptEn: 'A quick checklist for display, battery, cameras, network, and account status.',
    readMinutes: 6, date: '2026-09-22', tags: ['شراء', 'فحص', 'مستعمل'],
    body: [
      { heading: 'الحساب والقفل', headingEn: 'Account and lock', paragraphs: ['تأكد من تسجيل خروج حساب Apple/Google أو من نقل الملكية بشكل صحيح. جهاز مقفل بحساب ليس صفقة.'] },
      { heading: 'الشاشة واللمس', headingEn: 'Display and touch', paragraphs: ['افتح صورة بيضاء وأخرى سوداء لفحص البقع والخطوط. اختبر اللمس في الأطراف، ومستشعر القرب، والسطوع التلقائي.'] },
      { heading: 'البطارية والصحة', headingEn: 'Battery health', paragraphs: ['اطلب فحص صحة البطارية إن كان النظام يدعمه. راقب السخونة والانخفاض المفاجئ.'] },
      { heading: 'الشبكة والكاميرات', headingEn: 'Network and cameras', paragraphs: ['جرّب شريحة ومكالمة وواي فاي وبلوتوث. افتح كل الكاميرات وسجّل فيديو بصوت. افحص السماعات والميكروفون.'] },
    ],
  },
  {
    id: 'art-social', slug: 'social-engineering-basics', category: 'security', featured: false, publishStatus: 'published',
    titleAr: 'هندسة اجتماعية: عندما يكون الخطر شخصًا', titleEn: 'Social engineering: when the threat is a person',
    excerptAr: 'كيف تحمي نفسك من مكالمات «الدعم» التي تطلب رموزك أو تثبيت تطبيق بعيد.',
    excerptEn: 'Protect yourself from support calls that ask for codes or remote-access apps.',
    readMinutes: 5, date: '2026-09-18', tags: ['هندسة اجتماعية', 'احتيال', 'أمان'],
    body: [
      { heading: 'لا دعم يطلب كلمة المرور', headingEn: 'No real support asks for passwords', paragraphs: ['البنك أو الشركة لا تطلب كلمة المرور أو رمز 2FA. أي طلب كهذا احتيال.'] },
      { heading: 'تطبيقات الوصول البعيد', headingEn: 'Remote access apps', paragraphs: ['لا تثبت تطبيق وصول بعيد بناءً على مكالمة. إن كنت تحتاج دعمًا، ابدأ أنت الاتصال من رقم رسمي.'] },
      { heading: 'التحقق المزدوج', headingEn: 'Double-check', paragraphs: ['قبل تحويل أي مبلغ، اتصل بالشخص على رقم تعرفه مسبقًا. الصوت يمكن تقليده، والصورة يمكن سرقتها.'] },
    ],
  },
]

export const articleCategories = {
  tutorial: { ar: 'شروحات تقنية', en: 'Tutorials' },
  fault: { ar: 'أعطال وحلول', en: 'Faults & fixes' },
  security: { ar: 'أمن سيبراني', en: 'Cybersecurity' },
  news: { ar: 'أخبار', en: 'News' },
} as const
