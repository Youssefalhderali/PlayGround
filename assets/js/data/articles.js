export const articleCategories = [
  { id: "repair", nameAr: "الصيانة", nameEn: "Repair", icon: "wrench" },
  { id: "software", nameAr: "السوفت وير", nameEn: "Software", icon: "download" },
  { id: "security", nameAr: "الأمن السيبراني", nameEn: "Cybersecurity", icon: "shield" },
  { id: "programming", nameAr: "البرمجة", nameEn: "Programming", icon: "code" },
  { id: "guide", nameAr: "أدلة ومعلومات", nameEn: "Guides", icon: "book" }
];

export const articles = [
  {
    id: "screen-quality-guide",
    slug: "screen-quality-guide",
    titleAr: "كيف تختار شاشة بديلة دون التضحية بالجودة",
    titleEn: "How to choose a replacement screen without sacrificing quality",
    excerptAr: "ليست كل الشاشات البديلة متساوية. تعرّف على الفرق بين الأصلية وService Pack والتجارية والمجددة، وكيف تختبر الشاشة قبل الدفع.",
    excerptEn: "Not all replacement screens are equal. Learn the difference between original, service pack, commercial, and refurbished panels, and how to test before paying.",
    category: "repair",
    icon: "screen",
    date: "2026-09-18",
    readTime: 7,
    featured: true,
    tags: ["شاشات", "قطع غيار", "جودة"],
    bodyAr: `
      <p>سوق شاشات الهواتف مليء بمصطلحات متشابهة لكنها تختلف في الجودة والسعر والعمر. قبل أن تدفع مقابل شاشة بديلة، من المهم أن تعرف بالضبط ما الذي تشتريه، وأن تختبره بطريقة واضحة.</p>
      <h2>المصطلحات الأساسية</h2>
      <ul>
        <li><strong>أصلية (Original):</strong> قطعة من نفس خط إنتاج الشركة المصنعة أو موردها المعتمد. غالباً الأعلى سعراً.</li>
        <li><strong>Service Pack:</strong> قطعة أصلية مخصصة لمراكز الخدمة، وقد تأتي بتغليف مختلف دون علبة تجزئة.</li>
        <li><strong>تجارية (Commercial / Aftermarket):</strong> شاشة مصنعة من طرف ثالث. الجودة تتفاوت كثيراً بين المصانع.</li>
        <li><strong>مجددة (Refurbished):</strong> شاشة أصلية أُعيد تجميعها أو تغيير طبقة الزجاج الخارجية. نجاحها يعتمد على مهارة الورشة.</li>
        <li><strong>مستعملة (Used):</strong> شاشة أصلية مفكوكة من جهاز آخر. قد تكون بحالة جيدة، لكن عمرها غير معروف.</li>
      </ul>
      <blockquote>السعر وحده ليس مؤشراً كافياً. الشاشة الرخيصة قد تكلفك أكثر عند استبدالها بعد شهر.</blockquote>
      <h2>ما الذي يجب فحصه قبل الشراء؟</h2>
      <ol>
        <li>مطابقة رقم الموديل بدقة، بما في ذلك نسخة 4G أو 5G.</li>
        <li>نوع الشاشة: OLED أو LCD، ولمعانها ومعدل تحديثها.</li>
        <li>وجود طبقة Oleophobic أو مقاومة للخدش.</li>
        <li>جودة الزجاج والحواف وعدم وجود فراغات.</li>
        <li>توافق البصمة تحت الشاشة إن كان الجهاز يدعمها.</li>
        <li>ضمان واضح على القطعة والتركيب.</li>
      </ol>
      <h2>اختبار سريع قبل التثبيت النهائي</h2>
      <p>اطلب تشغيل الشاشة قبل لصقها نهائياً. اختبر اللمس في الزوايا والوسط، والسطوع الكامل والمنخفض، والألوان على خلفية بيضاء وسوداء. جرّب البصمة والكاميرا الأمامية ومستشعر القرب. إن ظهرت خطوط أو بقع أو وميض، ارفض القطعة فوراً.</p>
      <h2>نصيحة عملية</h2>
      <p>لا تطلب من الفني تركيب شاشة بجودة غير معروفة دون توضيح النوع. من حقك معرفة ما إذا كانت أصلية أم تجارية، ومن حقك الحصول على فترة ضمان قصيرة على الأقل. الشفافية تحمي الطرفين.</p>
    `,
    bodyEn: `
      <p>The replacement screen market uses similar terms with very different quality, price, and lifespan. Before paying, know exactly what you are buying and test it clearly.</p>
      <h2>Key terms</h2>
      <ul>
        <li><strong>Original:</strong> from the manufacturer's production line or an approved supplier.</li>
        <li><strong>Service Pack:</strong> original part intended for service centers, often in different packaging.</li>
        <li><strong>Commercial / Aftermarket:</strong> third-party panel; quality varies widely.</li>
        <li><strong>Refurbished:</strong> original panel rebuilt or re-glassed; quality depends on the workshop.</li>
        <li><strong>Used:</strong> original panel pulled from another device; age is unknown.</li>
      </ul>
      <blockquote>Price alone is not enough. A cheap screen can cost more after a month.</blockquote>
      <h2>Check before buying</h2>
      <ol>
        <li>Exact model match, including 4G vs 5G.</li>
        <li>Panel type, brightness, and refresh rate.</li>
        <li>Oleophobic or scratch-resistant coating.</li>
        <li>Glass quality, edges, and fit.</li>
        <li>Under-display fingerprint support if applicable.</li>
        <li>A clear warranty on the part and installation.</li>
      </ol>
      <h2>Quick test before final installation</h2>
      <p>Power the screen before final adhesive. Test touch at edges and center, full and low brightness, and colors on white and black backgrounds. Test fingerprint, front camera, and proximity sensor. Reject any panel with lines, spots, or flicker.</p>
      <p>Ask the technician to state whether the panel is original, service pack, or commercial. Transparency protects both sides.</p>
    `,
    sources: [
      { label: "iFixit — Repair Guides", url: "https://www.ifixit.com/" },
      { label: "GSMArena — Display specs", url: "https://www.gsmarena.com/" }
    ]
  },
  {
    id: "samsung-odin-guide",
    slug: "samsung-odin-guide",
    titleAr: "دليل التفليش الآمن لهواتف سامسونج باستخدام Odin",
    titleEn: "Safe Samsung flashing guide with Odin",
    excerptAr: "خطوات عملية لاختيار الروم المناسب، التحقق من CSC، والتفليش دون فقدان البيانات — ومتى يجب التوقف.",
    excerptEn: "A practical workflow for choosing the right firmware, verifying CSC, and flashing without data loss — and when to stop.",
    category: "software",
    icon: "download",
    date: "2026-09-10",
    readTime: 9,
    featured: true,
    tags: ["Samsung", "Odin", "تفليش"],
    bodyAr: `
      <p>Odin أداة تفليش قوية، لكن معظم الأخطاء لا تأتي من الأداة نفسها بل من ملف خاطئ أو منطقة غير متوافقة أو انقطاع أثناء العملية. هذا الدليل يضعك على المسار الآمن.</p>
      <h2>قبل البدء</h2>
      <ul>
        <li>اعرف رقم الموديل الدقيق من <code>الإعدادات ← حول الهاتف</code>.</li>
        <li>اعرف CSC الحالي، فهو يحدد منطقة الروم.</li>
        <li>اشحن البطارية فوق 60%.</li>
        <li>استخدم كابل بيانات أصلي ومنفذ USB مباشر في اللوحة.</li>
        <li>خذ نسخة احتياطية كاملة، خصوصاً إن كنت ستستخدم ملف CSC.</li>
      </ul>
      <h2>أنواع ملفات الروم</h2>
      <p>ملف AP يحتوي النظام، وBL للبوتلودر، وCP للمودم، وCSC للمنطقة. ملف <code>HOME_CSC</code> يحافظ على البيانات عادة، بينما <code>CSC</code> قد يعيد ضبط الجهاز. لا تستخدم ملفاً من موديل آخر أبداً.</p>
      <h2>الخطوات</h2>
      <ol>
        <li>ثبّت تعريفات سامسونج USB وافتح Odin كمسؤول.</li>
        <li>أدخل الهاتف وضع Download Mode بالطريقة المناسبة لموديله.</li>
        <li>تأكد من ظهور الجهاز في Odin وأن المنفذ صحيح.</li>
        <li>اختر ملفات AP وBL وCP وCSC المطابقة.</li>
        <li>اترك الخيارات الافتراضية، ولا تفعّل NAND Erase أو Re-Partition دون سبب واضح.</li>
        <li>اضغط Start وانتظر حتى تظهر كلمة PASS.</li>
        <li>اترك الجهاز يقلع أول مرة؛ قد يستغرق عدة دقائق.</li>
      </ol>
      <blockquote>إن توقف Odin عند ملف معين، لا تفصل الكابل فوراً. اقرأ الرسالة أولاً، ثم أعد المحاولة بعد التحقق من الملف.</blockquote>
      <h2>بعد التفليش</h2>
      <p>تحقق من الإصدار وCSC، واختبر الشبكة والكاميرا والبصمة. إن ظهرت مشكلة في الشبكة، راجع إصدار المودم وملف CP. لا تكرر التفليش عشوائياً؛ كل محاولة تحمل خطراً.</p>
      <h2>متى تتوقف؟</h2>
      <p>إذا كان الجهاز لا يدخل Download Mode، أو يظهر خطأ في الذاكرة، أو يتوقف عند نفس النقطة مرتين، توقف وافحص العتاد. قد تكون المشكلة في التخزين أو اللوحة وليس في الروم.</p>
    `,
    bodyEn: `
      <p>Odin is powerful, but most failures come from a wrong file, incompatible region, or interrupted process — not the tool itself.</p>
      <h2>Before you start</h2>
      <ul>
        <li>Confirm the exact model number in <code>Settings → About phone</code>.</li>
        <li>Check the current CSC; it defines the firmware region.</li>
        <li>Charge above 60%.</li>
        <li>Use an original data cable and a direct rear USB port.</li>
        <li>Take a full backup, especially before using a CSC file.</li>
      </ul>
      <h2>Firmware file types</h2>
      <p>AP contains the system, BL the bootloader, CP the modem, and CSC the region. <code>HOME_CSC</code> usually keeps data, while <code>CSC</code> may factory reset. Never mix files from another model.</p>
      <h2>Steps</h2>
      <ol>
        <li>Install Samsung USB drivers and open Odin as administrator.</li>
        <li>Enter Download Mode using the method for your model.</li>
        <li>Confirm the device appears in Odin on the correct port.</li>
        <li>Select matching AP, BL, CP, and CSC files.</li>
        <li>Keep default options; avoid NAND Erase or Re-Partition without a clear reason.</li>
        <li>Press Start and wait for PASS.</li>
        <li>Let the phone boot; the first boot can take several minutes.</li>
      </ol>
      <blockquote>If Odin stalls, do not immediately unplug. Read the message, verify the file, then retry.</blockquote>
      <h2>After flashing</h2>
      <p>Verify build and CSC, then test network, camera, and fingerprint. If mobile network fails, check the modem/CP version. Do not flash repeatedly without diagnosis.</p>
      <h2>When to stop</h2>
      <p>If the phone cannot enter Download Mode, reports a storage error, or fails at the same point twice, stop and test the hardware. The issue may be storage or the board, not the ROM.</p>
    `,
    sources: [
      { label: "SamMobile — Firmware database", url: "https://www.sammobile.com/firmwares/" },
      { label: "Samsung Support", url: "https://www.samsung.com/levant/support/" }
    ]
  },
  {
    id: "hyperos-regions",
    slug: "hyperos-regions",
    titleAr: "فهم HyperOS وMIUI والمناطق قبل تحميل أي روم",
    titleEn: "Understanding HyperOS, MIUI, and regions before downloading a ROM",
    excerptAr: "لماذا لا يعمل روم Global على نسخة صينية؟ وكيف تختار الروم المناسب وتتجنب قفل Bootloader؟",
    excerptEn: "Why a Global ROM may not work on a Chinese unit, how to choose the right build, and how to avoid bootloader lock issues.",
    category: "software",
    icon: "layers",
    date: "2026-09-02",
    readTime: 6,
    tags: ["Xiaomi", "HyperOS", "MIUI"],
    bodyAr: `
      <p>هواتف شاومي وريد مي وبوكو تُبنى لمناطق مختلفة، وقد تختلف في النطاقات والشاشة والكاميرا وبعض القطع. لذلك لا يكفي اسم الهاتف؛ تحتاج رمز الموديل والمنطقة.</p>
      <h2>رموز مهمة</h2>
      <ul>
        <li><strong>MI:</strong> نسخة عالمية.</li>
        <li><strong>EU:</strong> السوق الأوروبي.</li>
        <li><strong>IN:</strong> الهند.</li>
        <li><strong>CN:</strong> الصين.</li>
        <li><strong>RU / ID / TW:</strong> روسيا وإندونيسيا وتايوان.</li>
      </ul>
      <p>تظهر هذه الرموز عادة في نهاية إصدار البناء، مثل <code>OS2.0.104.0.VNLMIXM</code>. الجزء الأخير لا يحدد المنطقة وحده؛ راجع المصدر الرسمي.</p>
      <h2>Fastboot أم Recovery؟</h2>
      <p>رومات Fastboot تُفليش عبر Mi Flash وتحتاج فك Bootloader. رومات Recovery تُثبّت عبر تطبيق التحديث أو Recovery وتكون مناسبة للتحديث العادي. لا تخلط بينهما.</p>
      <h2>Bootloader</h2>
      <p>فك Bootloader يمحو البيانات ويفعّل تحذيراً عند الإقلاع. انتظر المدة المطلوبة، واستخدم حسابك الشخصي فقط. لا تشترِ خدمة فك قفل من طرف ثالث بحساب مجهول.</p>
      <h2>قبل التحميل</h2>
      <ol>
        <li>طابق الموديل والاسم الرمزي (Codename).</li>
        <li>راجع نوع الروم (Fastboot/Recovery).</li>
        <li>تأكد من المنطقة وتوافق النطاقات.</li>
        <li>احتفظ بنسخة من الروم الحالي إن أمكن.</li>
        <li>لا تفلش ببطارية منخفضة.</li>
      </ol>
      <blockquote>الاسم التجاري وحده لا يكفي. POCO X6 Pro وRedmi K70E يتشاركان الكود duchamp، لكن ملفات السوق قد تختلف.</blockquote>
    `,
    bodyEn: `
      <p>Xiaomi, Redmi, and POCO devices are built for different regions and may differ in bands, display, camera, or parts. The marketing name is not enough; you need model and region.</p>
      <h2>Useful codes</h2>
      <ul>
        <li><strong>MI:</strong> Global</li>
        <li><strong>EU:</strong> Europe</li>
        <li><strong>IN:</strong> India</li>
        <li><strong>CN:</strong> China</li>
        <li><strong>RU / ID / TW:</strong> Russia, Indonesia, Taiwan</li>
      </ul>
      <p>These codes often appear at the end of the build, such as <code>OS2.0.104.0.VNLMIXM</code>. Always verify on the source page.</p>
      <h2>Fastboot vs Recovery</h2>
      <p>Fastboot ROMs flash via Mi Flash and require an unlocked bootloader. Recovery ROMs install through the updater or recovery. Do not mix formats.</p>
      <h2>Bootloader</h2>
      <p>Unlocking wipes data and shows a warning at boot. Wait the required period and use your own account. Avoid third-party unlock services with unknown accounts.</p>
      <h2>Before downloading</h2>
      <ol>
        <li>Match model and codename.</li>
        <li>Check Fastboot vs Recovery.</li>
        <li>Verify region and band compatibility.</li>
        <li>Keep a copy of the current ROM if possible.</li>
        <li>Never flash on a low battery.</li>
      </ol>
      <blockquote>The marketing name is not enough. POCO X6 Pro and Redmi K70E share the duchamp codename, but market files can differ.</blockquote>
    `,
    sources: [
      { label: "Xiaomi Firmware Updater", url: "https://xiaomifirmwareupdater.com/" },
      { label: "Xiaomi Support", url: "https://www.mi.com/global/support/" }
    ]
  },
  {
    id: "battery-charging-check",
    slug: "battery-charging-check",
    titleAr: "فحص البطارية ومنفذ الشحن قبل الاستبدال",
    titleEn: "Testing the battery and charging port before replacement",
    excerptAr: "كيف تفرّق بين بطارية متعبة ومنفذ متسخ وخلل في IC الشحن؟ خطوات تشخيص بسيطة قبل شراء قطعة.",
    excerptEn: "How to distinguish an aged battery from a dirty port or charging IC fault — simple diagnostics before buying a part.",
    category: "repair",
    icon: "battery",
    date: "2026-08-24",
    readTime: 5,
    tags: ["بطارية", "شحن", "تشخيص"],
    bodyAr: `
      <p>عندما لا يشحن الهاتف أو ينفد بسرعة، يميل كثيرون إلى استبدال البطارية مباشرة. لكن التشخيص الصحيح يوفر وقتاً ومالاً.</p>
      <h2>1. اعزل المشكلة</h2>
      <ul>
        <li>جرّب كابل وشاحناً آخرين معروفين.</li>
        <li>جرّب منفذاً آخر في الحائط أو بنك طاقة.</li>
        <li>أطفئ الهاتف واشحنه؛ هل يتغير السلوك؟</li>
        <li>حرّك الكابل بلطف؛ هل ينقطع الشحن؟</li>
      </ul>
      <h2>2. افحص المنفذ</h2>
      <p>استخدم ضوءاً وهواءً مضغوطاً. الوبر والأوساخ سبب شائع جداً. لا تدخل إبرة معدنية. إذا كان المنفذ يتحرك أو الكابل لا يثبت، فقد يحتاج استبدالاً.</p>
      <h2>3. افحص البطارية</h2>
      <p>راقب الانتفاخ، السخونة، والإغلاق المفاجئ عند نسبة معينة. استخدم أداة فحص موثوقة أو قائمة الخدمة إن توفرت. صحة منخفضة مع استنزاف واضح تعني استبدالاً.</p>
      <h2>4. افحص التيار</h2>
      <p>مقياس USB بسيط يوضح الجهد والتيار. شحن بطيء جداً مع كابل جيد قد يشير إلى IC شحن أو منفذ تالف، وليس بالضرورة بطارية.</p>
      <blockquote>لا تستبدل قطعتين معاً دون دليل. استبدل الأرجح فقط، ثم اختبر.</blockquote>
      <h2>5. بعد الاستبدال</h2>
      <p>نظّف المنفذ، استخدم لاصقاً مناسباً، واختبر الشحن السريع والحرارة. اطلب من العميل مراقبة أول دورة شحن كاملة.</p>
    `,
    bodyEn: `
      <p>When a phone will not charge or drains fast, many people replace the battery immediately. Correct diagnosis saves time and money.</p>
      <h2>1. Isolate the issue</h2>
      <ul>
        <li>Try another known-good cable and charger.</li>
        <li>Try another wall outlet or power bank.</li>
        <li>Charge while powered off; does behavior change?</li>
        <li>Wiggle the cable gently; does charging cut out?</li>
      </ul>
      <h2>2. Inspect the port</h2>
      <p>Use light and compressed air. Lint is a very common cause. Never insert a metal needle. If the port moves or the cable does not lock, replacement may be needed.</p>
      <h2>3. Inspect the battery</h2>
      <p>Look for swelling, heat, and shutdowns at a specific percentage. Use a trusted health tool or service menu. Low health plus obvious drain means replacement.</p>
      <h2>4. Measure current</h2>
      <p>A simple USB meter shows voltage and current. Very slow charging with a good cable may indicate a charging IC or port fault, not necessarily the battery.</p>
      <blockquote>Do not replace two parts without evidence. Replace the most likely one, then test.</blockquote>
      <h2>5. After replacement</h2>
      <p>Clean the port, use proper adhesive, and test fast charging and heat. Ask the customer to monitor the first full charge cycle.</p>
    `,
    sources: [
      { label: "iFixit — Battery replacement guides", url: "https://www.ifixit.com/" }
    ]
  },
  {
    id: "phishing-malware-protection",
    slug: "phishing-malware-protection",
    titleAr: "حماية هاتفك من التصيد والبرمجيات الخبيثة",
    titleEn: "Protecting your phone from phishing and malware",
    excerptAr: "علامات الروابط المشبوهة، صلاحيات التطبيقات الخطرة، وخطوات عملية لحماية الحسابات والبيانات.",
    excerptEn: "Signs of suspicious links, dangerous app permissions, and practical steps to protect accounts and data.",
    category: "security",
    icon: "shield",
    date: "2026-08-15",
    readTime: 8,
    featured: true,
    tags: ["تصيد", "برمجيات خبيثة", "حماية"],
    bodyAr: `
      <p>معظم اختراقات الهواتف لا تبدأ بثغرة معقدة، بل برابط أو تطبيق أو كلمة مرور ضعيفة. الحماية تبدأ من عادات بسيطة ومتكررة.</p>
      <h2>علامات رابط مشبوه</h2>
      <ul>
        <li>نطاق غريب أو أخطاء إملائية في اسم الموقع.</li>
        <li>طلب تسجيل الدخول أو رمز التحقق عبر رابط.</li>
        <li>عرض عاجل: "حسابك سيُغلق خلال ساعات".</li>
        <li>مرفق غير متوقع من شخص معروف.</li>
        <li>طلب تحويل مالي أو بيانات بطاقة.</li>
      </ul>
      <h2>صلاحيات تستحق الحذر</h2>
      <p>خدمة الوصول (Accessibility)، وإدارة الرسائل، وتثبيت تطبيقات غير معروفة، والوصول إلى كل الملفات. لا تمنحها إلا لتطبيق تعرفه وتثق به. تطبيق مصباح يدوي لا يحتاج قراءة رسائلك.</p>
      <h2>خطوات الحماية</h2>
      <ol>
        <li>فعّل التحقق بخطوتين عبر تطبيق مصادقة أو مفتاح أمان.</li>
        <li>استخدم كلمة مرور فريدة لكل حساب.</li>
        <li>ثبّت التحديثات الأمنية فور توفرها.</li>
        <li>راجع الأجهزة والجلسات النشطة في حسابك.</li>
        <li>لا تثبّت APK من مصادر غير موثوقة.</li>
        <li>خذ نسخة احتياطية مشفرة.</li>
      </ol>
      <h2>إذا شككت في اختراق</h2>
      <p>افصل الإنترنت، غيّر كلمات المرور من جهاز آخر موثوق، راجع صلاحيات التطبيقات، وافحص الجهاز. لا تحذف الأدلة قبل أخذ نسخة إن كانت هناك حاجة قانونية.</p>
      <blockquote>التحقق بخطوتين لا يمنع كل الهجمات، لكنه يقلل أثر كلمة المرور المسروقة بشكل كبير.</blockquote>
    `,
    bodyEn: `
      <p>Most phone compromises start with a link, an app, or a weak password — not a complex exploit. Protection starts with simple, repeatable habits.</p>
      <h2>Signs of a suspicious link</h2>
      <ul>
        <li>Strange domain or spelling mistakes.</li>
        <li>Login or verification code requested through a link.</li>
        <li>Urgent threats: "your account will close in hours".</li>
        <li>Unexpected attachment from a known contact.</li>
        <li>Requests for money or card data.</li>
      </ul>
      <h2>Risky permissions</h2>
      <p>Accessibility, SMS management, unknown app installation, and all-files access. Grant them only to apps you know and trust. A flashlight app does not need to read your messages.</p>
      <h2>Protection steps</h2>
      <ol>
        <li>Enable two-step verification with an authenticator or security key.</li>
        <li>Use a unique password per account.</li>
        <li>Install security updates promptly.</li>
        <li>Review active devices and sessions.</li>
        <li>Avoid APKs from untrusted sources.</li>
        <li>Keep encrypted backups.</li>
      </ol>
      <h2>If you suspect compromise</h2>
      <p>Disconnect from the internet, change passwords from another trusted device, review app permissions, and inspect the device. Preserve evidence if legal action may be needed.</p>
      <blockquote>Two-step verification does not stop every attack, but it greatly reduces the impact of a stolen password.</blockquote>
    `,
    sources: [
      { label: "Google Account Security", url: "https://myaccount.google.com/security" },
      { label: "Android Security", url: "https://source.android.com/docs/security" },
      { label: "Have I Been Pwned", url: "https://haveibeenpwned.com/" }
    ]
  },
  {
    id: "adb-fastboot-basics",
    slug: "adb-fastboot-basics",
    titleAr: "أساسيات ADB وFastboot للمبتدئين",
    titleEn: "ADB and Fastboot basics for beginners",
    excerptAr: "ما الفرق بين ADB وFastboot؟ الأوامر الآمنة، وكيف تتجنب مسح البيانات بالخطأ.",
    excerptEn: "What is the difference between ADB and Fastboot? Safe commands and how to avoid wiping data by mistake.",
    category: "programming",
    icon: "terminal",
    date: "2026-08-06",
    readTime: 6,
    tags: ["ADB", "Fastboot", "Android"],
    bodyAr: `
      <p>ADB وFastboot أداتان رسميتان من Android. ADB يعمل داخل النظام أو Recovery، بينما Fastboot يعمل في وضع البوتلودر. كلاهما قوي، وبعض أوامرهما لا رجعة فيه.</p>
      <h2>التجهيز</h2>
      <ol>
        <li>ثبّت Platform Tools من Google.</li>
        <li>فعّل خيارات المطور وتصحيح USB.</li>
        <li>وافق على بصمة الكمبيوتر على الهاتف.</li>
        <li>استخدم كابل بيانات جيداً.</li>
      </ol>
      <h2>أوامر ADB مفيدة</h2>
      <pre><code>adb devices
adb shell
adb shell dumpsys battery
adb logcat
adb pull /sdcard/DCIM
adb install app.apk</code></pre>
      <h2>أوامر Fastboot</h2>
      <pre><code>fastboot devices
fastboot getvar all
fastboot reboot
fastboot flash boot boot.img</code></pre>
      <blockquote>الأمر <code>fastboot flashing unlock</code> قد يمسح كل البيانات. لا تنفذه دون نسخة احتياطية وفهم للعواقب.</blockquote>
      <h2>أخطاء شائعة</h2>
      <ul>
        <li>تشغيل الأمر في الوضع الخطأ.</li>
        <li>استخدام ملف boot من موديل آخر.</li>
        <li>عدم تثبيت التعريفات.</li>
        <li>فصل الكابل أثناء الكتابة.</li>
      </ul>
      <p>اقرأ كل أمر قبل تنفيذه، واعمل على جهاز تملكه أو لديك إذن صريح بالعمل عليه.</p>
    `,
    bodyEn: `
      <p>ADB and Fastboot are official Android tools. ADB works inside the system or recovery; Fastboot works in bootloader mode. Both are powerful, and some commands are irreversible.</p>
      <h2>Setup</h2>
      <ol>
        <li>Install Google Platform Tools.</li>
        <li>Enable developer options and USB debugging.</li>
        <li>Approve the computer fingerprint on the phone.</li>
        <li>Use a good data cable.</li>
      </ol>
      <h2>Useful ADB commands</h2>
      <pre><code>adb devices
adb shell
adb shell dumpsys battery
adb logcat
adb pull /sdcard/DCIM
adb install app.apk</code></pre>
      <h2>Fastboot commands</h2>
      <pre><code>fastboot devices
fastboot getvar all
fastboot reboot
fastboot flash boot boot.img</code></pre>
      <blockquote><code>fastboot flashing unlock</code> may wipe all data. Do not run it without a backup and full understanding.</blockquote>
      <h2>Common mistakes</h2>
      <ul>
        <li>Running a command in the wrong mode.</li>
        <li>Using a boot image from another model.</li>
        <li>Missing drivers.</li>
        <li>Unplugging during a write.</li>
      </ul>
      <p>Read every command before running it, and only work on devices you own or are authorized to service.</p>
    `,
    sources: [
      { label: "Android Developers — ADB", url: "https://developer.android.com/tools/adb" },
      { label: "Android Developers — Fastboot", url: "https://developer.android.com/tools/fastboot" }
    ]
  },
  {
    id: "data-recovery-first-steps",
    slug: "data-recovery-first-steps",
    titleAr: "استعادة البيانات من هاتف لا يعمل: ما يجب فعله أولاً",
    titleEn: "Data recovery from a dead phone: what to do first",
    excerptAr: "كل دقيقة وكل كتابة على الجهاز قد تقلل فرص الاستعادة. دليل عملي للتعامل مع البيانات الثمينة.",
    excerptEn: "Every minute and every write can reduce recovery chances. A practical guide for valuable data.",
    category: "repair",
    icon: "database",
    date: "2026-07-28",
    readTime: 6,
    tags: ["بيانات", "استعادة", "نسخ احتياطي"],
    bodyAr: `
      <p>عندما يتوقف الهاتف عن العمل، أول رد فعل كثيرين هو التفليش أو إعادة الضبط. إذا كانت البيانات مهمة، فهذا قد يكون أسوأ ما تفعله.</p>
      <h2>قاعدة ذهبية</h2>
      <blockquote>توقف عن الكتابة على الجهاز. لا تثبّت تطبيقات، لا تسجل دخول، ولا تفلش قبل محاولة الاستخراج.</blockquote>
      <h2>تحقق من النسخ الاحتياطي أولاً</h2>
      <ul>
        <li>Google Drive أو iCloud.</li>
        <li>نسخة على الكمبيوتر.</li>
        <li>تطبيق نسخ احتياطي استخدمته سابقاً.</li>
        <li>صور أو ملفات أرسلتها لنفسك.</li>
      </ul>
      <h2>إذا كان الجهاز يقلع</h2>
      <p>جرّب وضع Safe Mode، واربطه بالكمبيوتر لنسخ الصور والملفات. لا تحدّث النظام قبل النسخ.</p>
      <h2>إذا كان لا يقلع</h2>
      <p>قد يحتاج فني إلى فك الجهاز أو استخدام أدوات متخصصة. لا تفلش قبل استشارة مختص إن كانت البيانات حساسة. بعض خدمات الاستعادة تقدم تقييماً قبل الدفع.</p>
      <h2>بعد الاستعادة</h2>
      <p>غيّر كلمات المرور إذا شككت في اختراق، وفعّل نسخاً احتياطياً منتظماً، واحتفظ بنسخة خارج الجهاز.</p>
    `,
    bodyEn: `
      <p>When a phone stops working, many people flash or factory reset immediately. If the data matters, that may be the worst move.</p>
      <h2>Golden rule</h2>
      <blockquote>Stop writing to the device. Do not install apps, sign in, or flash before attempting extraction.</blockquote>
      <h2>Check backups first</h2>
      <ul>
        <li>Google Drive or iCloud.</li>
        <li>A copy on a computer.</li>
        <li>A backup app you used before.</li>
        <li>Files you sent to yourself.</li>
      </ul>
      <h2>If it boots</h2>
      <p>Try safe mode and connect to a computer to copy photos and files. Do not update the system before copying.</p>
      <h2>If it does not boot</h2>
      <p>A technician may need to open it or use specialized tools. Do not flash before consulting a specialist if the data is sensitive. Reputable recovery services assess before charging.</p>
      <h2>After recovery</h2>
      <p>Change passwords if compromise is suspected, enable regular backups, and keep a copy off the device.</p>
    `,
    sources: [
      { label: "Google — Back up or restore data", url: "https://support.google.com/android/answer/2819582" },
      { label: "Apple — Back up iPhone", url: "https://support.apple.com/en-us/108366" }
    ]
  },
  {
    id: "authorized-pentesting",
    slug: "authorized-pentesting",
    titleAr: "اختبار الاختراق المصرح به: القواعد والأخلاقيات",
    titleEn: "Authorized penetration testing: rules and ethics",
    excerptAr: "ما الفرق بين الاختبار الأمني والاختراق؟ كيف تحصل على إذن مكتوب وتحدد النطاق وتحمي البيانات؟",
    excerptEn: "What separates security testing from hacking? How to get written authorization, define scope, and protect data.",
    category: "security",
    icon: "key",
    date: "2026-07-19",
    readTime: 7,
    tags: ["اختبار اختراق", "أخلاقيات", "أمن"],
    bodyAr: `
      <p>اختبار الاختراق عمل دفاعي يهدف إلى اكتشاف نقاط الضعف قبل المهاجمين. بدون إذن مكتوب ونطاق واضح، يتحول النشاط إلى مخالفة قانونية.</p>
      <h2>قبل أي اختبار</h2>
      <ul>
        <li>إذن مكتوب من مالك النظام.</li>
        <li>تحديد الأصول والنطاق والاستثناءات.</li>
        <li>نافذة زمنية متفق عليها.</li>
        <li>جهة اتصال للطوارئ.</li>
        <li>خطة للتعامل مع البيانات الحساسة.</li>
        <li>اتفاقية سرية وعدم إفصاح.</li>
      </ul>
      <h2>مبادئ أساسية</h2>
      <ol>
        <li>لا تختبر ما لا تملك إذناً به.</li>
        <li>لا تسبب ضرراً أو تعطيلاً للخدمة.</li>
        <li>لا تجمع بيانات أكثر من اللازم.</li>
        <li>وثّق كل خطوة.</li>
        <li>أبلغ عن الثغرات بطريقة مسؤولة.</li>
      </ol>
      <h2>بيئات التدريب</h2>
      <p>استخدم مختبرات آمنة مثل OWASP MASTG وDVWA وJuice Shop. لا تتدرّب على أنظمة حقيقية دون إذن.</p>
      <blockquote>المهارة بدون أخلاقيات خطر. الهدف هو حماية المستخدمين، لا إثبات القدرة على الاختراق.</blockquote>
      <h2>الإبلاغ</h2>
      <p>اكتب تقريراً يوضح الثغرة والأثر وخطوات الإعادة والإصلاح المقترح. لا تنشر التفاصيل قبل معالجة المشكلة.</p>
    `,
    bodyEn: `
      <p>Penetration testing is defensive work intended to find weaknesses before attackers do. Without written permission and a clear scope, it becomes a legal violation.</p>
      <h2>Before testing</h2>
      <ul>
        <li>Written authorization from the system owner.</li>
        <li>Defined assets, scope, and exclusions.</li>
        <li>An agreed time window.</li>
        <li>An emergency contact.</li>
        <li>A plan for sensitive data.</li>
        <li>A confidentiality agreement.</li>
      </ul>
      <h2>Core principles</h2>
      <ol>
        <li>Never test what you are not authorized to test.</li>
        <li>Do not cause damage or service disruption.</li>
        <li>Collect no more data than necessary.</li>
        <li>Document every step.</li>
        <li>Report vulnerabilities responsibly.</li>
      </ol>
      <h2>Training environments</h2>
      <p>Use safe labs such as OWASP MASTG, DVWA, and Juice Shop. Do not practice on real systems without permission.</p>
      <blockquote>Skill without ethics is dangerous. The goal is protecting users, not proving you can break in.</blockquote>
      <h2>Reporting</h2>
      <p>Write a report covering the issue, impact, reproduction steps, and a suggested fix. Do not publish details before remediation.</p>
    `,
    sources: [
      { label: "OWASP MASTG", url: "https://mas.owasp.org/MASTG/" },
      { label: "OWASP Juice Shop", url: "https://owasp.org/www-project-juice-shop/" }
    ]
  },
  {
    id: "mobsf-analysis",
    slug: "mobsf-analysis",
    titleAr: "تحليل تطبيق Android مشبوه باستخدام MobSF",
    titleEn: "Analyzing a suspicious Android app with MobSF",
    excerptAr: "خطوات دفاعية لفحص APK: الصلاحيات، الاتصالات، التوقيع، والمكتبات — دون تشغيله على هاتفك الشخصي.",
    excerptEn: "Defensive APK inspection: permissions, network endpoints, signature, and libraries — without running it on your personal phone.",
    category: "security",
    icon: "bug",
    date: "2026-07-10",
    readTime: 7,
    tags: ["MobSF", "APK", "تحليل"],
    bodyAr: `
      <p>قد يصلك تطبيق مشبوه عبر واتساب أو رابط. بدلاً من تثبيته، يمكن فحصه في بيئة معزولة باستخدام أدوات مثل MobSF.</p>
      <h2>تجهيز بيئة آمنة</h2>
      <ul>
        <li>جهاز افتراضي أو حاوية معزولة.</li>
        <li>عدم تسجيل الدخول بحسابات شخصية.</li>
        <li>تعطيل الشبكة إن لم تكن بحاجة إليها.</li>
        <li>الاحتفاظ بنسخة من APK دون تشغيله.</li>
      </ul>
      <h2>ما الذي تفحصه؟</h2>
      <ol>
        <li>الصلاحيات الخطرة: SMS، Accessibility، Device Admin.</li>
        <li>الروابط والنطاقات المضمنة.</li>
        <li>توقيع التطبيق وهل تم إعادة توقيعه.</li>
        <li>المكتبات الأصلية والاتصالات المشفرة.</li>
        <li>الأنشطة والخدمات التي تعمل في الخلفية.</li>
        <li>أي طلب تثبيت تطبيقات أخرى.</li>
      </ol>
      <h2>تفسير النتائج</h2>
      <p>وجود صلاحية خطرة لا يعني بالضرورة خبثاً، لكنه يستدعي سؤالاً: لماذا يحتاجها التطبيق؟ راقب الاتصالات غير المتوقعة والصلاحيات غير المرتبطة بوظيفته.</p>
      <blockquote>لا ترفع APK يحتوي بيانات شخصية إلى خدمات عامة. استخدم بيئة معزولة وأدوات محلية.</blockquote>
      <h2>بعد التحليل</h2>
      <p>احذف الملف بأمان، وثّق النتائج، وأبلغ الجهة المعنية إن كان التطبيق يستهدف مستخدمين آخرين. لا تعِد نشر التطبيق الخبيث.</p>
    `,
    bodyEn: `
      <p>A suspicious app may arrive through WhatsApp or a link. Instead of installing it, inspect it in an isolated environment with tools such as MobSF.</p>
      <h2>Prepare a safe environment</h2>
      <ul>
        <li>A virtual machine or isolated container.</li>
        <li>No personal account sign-in.</li>
        <li>Disable networking if not needed.</li>
        <li>Keep a copy of the APK without running it.</li>
      </ul>
      <h2>What to inspect</h2>
      <ol>
        <li>Dangerous permissions: SMS, Accessibility, Device Admin.</li>
        <li>Embedded URLs and domains.</li>
        <li>App signature and whether it was re-signed.</li>
        <li>Native libraries and encrypted traffic.</li>
        <li>Background activities and services.</li>
        <li>Requests to install other apps.</li>
      </ol>
      <h2>Interpreting results</h2>
      <p>A dangerous permission is not proof of malice, but it raises a question: why does the app need it? Watch for unexpected endpoints and permissions unrelated to its function.</p>
      <blockquote>Do not upload APKs containing personal data to public services. Use an isolated environment and local tools.</blockquote>
      <h2>After analysis</h2>
      <p>Delete the file securely, document findings, and notify the relevant party if it targets other users. Do not redistribute malware.</p>
    `,
    sources: [
      { label: "MobSF Documentation", url: "https://mobsf.github.io/Mobile-Security-Framework-MobSF/" },
      { label: "OWASP MASTG", url: "https://mas.owasp.org/MASTG/" }
    ]
  },
  {
    id: "display-specs-explained",
    slug: "display-specs-explained",
    titleAr: "كيف تقرأ مواصفات الشاشة: الدقة ومعدل التحديث والسطوع",
    titleEn: "How to read display specs: resolution, refresh rate, and brightness",
    excerptAr: "الدقة وحدها لا تحدد جودة الشاشة. فهم النوع والسطوع ومعدل التحديث يساعدك على الاختيار والمقارنة.",
    excerptEn: "Resolution alone does not define display quality. Understanding panel type, brightness, and refresh rate helps you compare.",
    category: "guide",
    icon: "screen",
    date: "2026-06-30",
    readTime: 5,
    tags: ["شاشة", "مواصفات", "شراء"],
    bodyAr: `
      <p>عند مقارنة هواتف أو شاشات بديلة، تظهر أرقام كثيرة. إليك ما يعنيه كل رقم فعلياً.</p>
      <h2>نوع اللوحة</h2>
      <ul>
        <li><strong>OLED/AMOLED:</strong> أسود عميق، تباعد عالٍ، وألوان مشبعة. قد تحتاج عناية أكبر من الاحتراق.</li>
        <li><strong>LCD/IPS:</strong> سطوع جيد وتكلفة أقل، لكن الأسود ليس عميقاً.</li>
        <li><strong>LTPO:</strong> يخفض معدل التحديث تلقائياً لتوفير الطاقة.</li>
      </ul>
      <h2>الدقة</h2>
      <p>1080p كافية لمعظم الهواتف، و1440p أدق لكنها تستهلك طاقة أكبر. الدقة المنخفضة 720p مناسبة للأجهزة الاقتصادية، لكن كثافة البكسل تقل.</p>
      <h2>معدل التحديث</h2>
      <p>60Hz أساسي، و90Hz/120Hz يجعل التمرير أنعم. الألعاب تستفيد من 120Hz أو أكثر، لكن البطارية تستهلك أسرع.</p>
      <h2>السطوع</h2>
      <p>ابحث عن السطوع النموذجي وليس الذروة فقط. السطوع العالي يساعد في الشمس، لكن الحرارة قد تخفضه تلقائياً.</p>
      <blockquote>شاشة بديلة بنفس الدقة قد تكون أقل سطوعاً وأسوأ في الألوان. الأرقام لا تحكي القصة كاملة.</blockquote>
    `,
    bodyEn: `
      <p>Comparing phones or replacement panels involves many numbers. Here is what they actually mean.</p>
      <h2>Panel type</h2>
      <ul>
        <li><strong>OLED/AMOLED:</strong> deep blacks, high contrast, saturated colors. More care needed regarding burn-in.</li>
        <li><strong>LCD/IPS:</strong> good brightness and lower cost, but blacks are not as deep.</li>
        <li><strong>LTPO:</strong> dynamically lowers refresh rate to save power.</li>
      </ul>
      <h2>Resolution</h2>
      <p>1080p suits most phones; 1440p is sharper but uses more power. 720p fits budget devices but has lower pixel density.</p>
      <h2>Refresh rate</h2>
      <p>60Hz is basic; 90Hz/120Hz makes scrolling smoother. Games benefit from 120Hz+, but battery drain increases.</p>
      <h2>Brightness</h2>
      <p>Look at typical brightness, not only peak. High brightness helps outdoors, but heat may throttle it.</p>
      <blockquote>A replacement panel with the same resolution may be dimmer and have worse colors. Numbers do not tell the whole story.</blockquote>
    `,
    sources: [
      { label: "GSMArena — Phone specifications", url: "https://www.gsmarena.com/" }
    ]
  },
  {
    id: "water-damage-first-aid",
    slug: "water-damage-first-aid",
    titleAr: "سقوط الهاتف في الماء: خطوات فورية وأخطاء شائعة",
    titleEn: "Phone dropped in water: immediate steps and common mistakes",
    excerptAr: "لا تشحنه ولا تستخدم الأرز. ما يجب فعله خلال الدقائق الأولى، ومتى تحتاج إلى فني.",
    excerptEn: "Do not charge it and do not use rice. What to do in the first minutes and when to see a technician.",
    category: "repair",
    icon: "droplet",
    date: "2026-06-21",
    readTime: 5,
    tags: ["ماء", "تلف", "إسعافات"],
    bodyAr: `
      <p>مقاومة الماء ليست ضماناً دائماً، والماء المالح أو المشروبات أكثر خطراً من الماء العذب. التصرف السريع يقلل التلف.</p>
      <h2>افعل فوراً</h2>
      <ol>
        <li>أخرج الهاتف من الماء وأطفئه إن كان يعمل.</li>
        <li>افصل الشاحن والكابل.</li>
        <li>أزل الحافظة وبطاقة SIM إن أمكن.</li>
        <li>جفف الخارج بقطعة ناعمة.</li>
        <li>ضعه في مكان جاف جيد التهوية.</li>
        <li>اتجه لفني في أقرب وقت.</li>
      </ol>
      <h2>لا تفعل</h2>
      <ul>
        <li>لا تشحنه.</li>
        <li>لا تستخدم مجفف شعر ساخناً.</li>
        <li>لا تضع الأرز؛ الغبار قد يدخل المنافذ.</li>
        <li>لا تهز الجهاز بقوة.</li>
        <li>لا تفترض أن الهاتف سليم لأنه يعمل.</li>
      </ul>
      <h2>لماذا الفحص مهم؟</h2>
      <p>التآكل قد يبدأ بعد أيام. تنظيف اللوحة بالكحول الإيزوبروبيلي أو حمام موجات فوق صوتية في ورشة متخصصة يمنع أضراراً لاحقة.</p>
      <blockquote>إذا كان الهاتف يعمل بعد الماء، فهذا لا يعني أن الخطر انتهى. الأملاح قد تسبب تآكلاً صامتاً.</blockquote>
    `,
    bodyEn: `
      <p>Water resistance is not a permanent guarantee, and salt water or sugary drinks are more dangerous than fresh water. Fast action reduces damage.</p>
      <h2>Do immediately</h2>
      <ol>
        <li>Remove the phone from water and power it off if running.</li>
        <li>Unplug the charger and cable.</li>
        <li>Remove the case and SIM tray if possible.</li>
        <li>Dry the outside with a soft cloth.</li>
        <li>Place it in a dry, ventilated area.</li>
        <li>See a technician as soon as possible.</li>
      </ol>
      <h2>Do not</h2>
      <ul>
        <li>Do not charge it.</li>
        <li>Do not use a hot hair dryer.</li>
        <li>Do not use rice; dust can enter the ports.</li>
        <li>Do not shake it hard.</li>
        <li>Do not assume it is fine because it turns on.</li>
      </ul>
      <h2>Why inspection matters</h2>
      <p>Corrosion can start days later. Cleaning the board with isopropyl alcohol or ultrasonic cleaning at a specialist shop prevents later failures.</p>
      <blockquote>A working phone after water does not mean the risk is over. Salts can cause silent corrosion.</blockquote>
    `,
    sources: [
      { label: "iFixit — Water damage guides", url: "https://www.ifixit.com/" }
    ]
  },
  {
    id: "safe-phone-disposal",
    slug: "safe-phone-disposal",
    titleAr: "التخلص الآمن من الهاتف القديم وحماية بياناتك",
    titleEn: "Safely disposing of an old phone while protecting your data",
    excerptAr: "قبل بيع الهاتف أو إعادة تدويره: نسخ احتياطي، تشفير، مسح آمن، وإزالة الحسابات بشكل صحيح.",
    excerptEn: "Before selling or recycling: backup, encryption, secure wipe, and proper account removal.",
    category: "security",
    icon: "trash",
    date: "2026-06-12",
    readTime: 5,
    tags: ["بيانات", "بيع", "إعادة تدوير"],
    bodyAr: `
      <p>الهاتف القديم يحتوي صوراً ورسائل وحسابات. إعادة الضبط وحدها قد لا تكفي إذا لم تُزل الحسابات وتشفّر البيانات.</p>
      <h2>قبل المسح</h2>
      <ol>
        <li>خذ نسخة احتياطية وتحقق من فتحها.</li>
        <li>انقل الصور والملفات إلى جهاز آخر.</li>
        <li>أزل بطاقة SIM وبطاقة التخزين.</li>
        <li>سجّل خروجك من الحسابات المهمة.</li>
      </ol>
      <h2>المسح الصحيح</h2>
      <ul>
        <li><strong>Android:</strong> إعدادات ← النظام ← إعادة ضبط المصنع، مع إزالة حساب Google أولاً.</li>
        <li><strong>iPhone:</strong> الإعدادات ← عام ← نقل أو إعادة ضبط ← محو المحتوى والإعدادات، مع إيقاف Find My.</li>
        <li>فعّل التشفير قبل المسح إن كان متاحاً.</li>
      </ul>
      <h2>بعد المسح</h2>
      <p>أعد تشغيل الجهاز وتأكد من ظهور شاشة الترحيب، لا حسابك. إذا كنت تبيع الجهاز، وثّق عملية المسح.</p>
      <blockquote>البيانات قد تبقى قابلة للاستعادة من ذاكرة غير مشفرة. التشفير قبل المسح يقلل الخطر.</blockquote>
      <h2>إعادة التدوير</h2>
      <p>استخدم مراكز إعادة تدوير معتمدة. لا ترمِ البطاريات في القمامة العادية.</p>
    `,
    bodyEn: `
      <p>An old phone holds photos, messages, and accounts. A factory reset alone may not be enough if accounts are not removed and data was not encrypted.</p>
      <h2>Before wiping</h2>
      <ol>
        <li>Back up and verify the backup opens.</li>
        <li>Move photos and files to another device.</li>
        <li>Remove the SIM and storage card.</li>
        <li>Sign out of important accounts.</li>
      </ol>
      <h2>Proper wipe</h2>
      <ul>
        <li><strong>Android:</strong> Settings → System → Factory reset, after removing the Google account.</li>
        <li><strong>iPhone:</strong> Settings → General → Transfer or Reset → Erase All Content and Settings, after turning off Find My.</li>
        <li>Enable encryption before wiping where available.</li>
      </ul>
      <h2>After wiping</h2>
      <p>Reboot and confirm you see the welcome screen, not your account. If selling, document the wipe.</p>
      <blockquote>Data may remain recoverable from unencrypted storage. Encrypting before wiping reduces risk.</blockquote>
      <h2>Recycling</h2>
      <p>Use certified recycling centers. Never throw batteries in regular trash.</p>
    `,
    sources: [
      { label: "Google — Reset your Android device", url: "https://support.google.com/android/answer/6088915" },
      { label: "Apple — Erase iPhone", url: "https://support.apple.com/en-us/108931" }
    ]
  },
  {
    id: "screen-types-compared",
    slug: "screen-types-compared",
    titleAr: "الفرق بين الشاشة الأصلية والتجارية والمجددة",
    titleEn: "Original vs commercial vs refurbished screens",
    excerptAr: "مقارنة عملية للسطوع والألوان واللمس والعمر الافتراضي، وكيف تحدد النوع قبل الشراء.",
    excerptEn: "A practical comparison of brightness, color, touch, and lifespan — and how to identify the type before buying.",
    category: "guide",
    icon: "layers",
    date: "2026-06-03",
    readTime: 6,
    tags: ["شاشات", "أسعار", "جودة"],
    bodyAr: `
      <p>عند طلب شاشة بديلة، قد يعرض عليك المورد عدة خيارات بفروق سعرية كبيرة. هذا ما تعنيه غالباً.</p>
      <h2>جدول مقارنة</h2>
      <ul>
        <li><strong>أصلية:</strong> أفضل توافق وألوان، سعر أعلى، توفر أقل.</li>
        <li><strong>Service Pack:</strong> جودة قريبة من الأصلية، تغليف خدمة، سعر متوسط إلى مرتفع.</li>
        <li><strong>تجارية عالية الجودة:</strong> توافق جيد، سطوع أقل قليلاً، سعر متوسط.</li>
        <li><strong>تجارية اقتصادية:</strong> سعر منخفض، ألوان وسطوع أضعف، عمر أقل.</li>
        <li><strong>مجددة:</strong> تعتمد على جودة الورشة؛ قد تكون ممتازة أو سيئة.</li>
      </ul>
      <h2>كيف تفحص؟</h2>
      <ol>
        <li>قارن السطوع الأقصى والأدنى.</li>
        <li>اعرض خلفية بيضاء وسوداء.</li>
        <li>اختبر اللمس في الزوايا.</li>
        <li>جرّب البصمة تحت الشاشة.</li>
        <li>افحص الحواف والفراغات.</li>
        <li>اسأل عن الضمان.</li>
      </ol>
      <blockquote>اطلب دائماً تحديد النوع في الفاتورة. الوضوح يحمي حقك.</blockquote>
      <h2>هل تستحق الأصلية؟</h2>
      <p>للأجهزة الرائدة التي تستخدمها يومياً، غالباً نعم. للأجهزة الاقتصادية، قد تكون شاشة تجارية جيدة خياراً منطقياً إذا كانت ضمن ميزانيتك.</p>
    `,
    bodyEn: `
      <p>When ordering a replacement screen, a supplier may offer several options with large price differences. Here is what they usually mean.</p>
      <h2>Comparison</h2>
      <ul>
        <li><strong>Original:</strong> best fit and color, higher price, lower availability.</li>
        <li><strong>Service Pack:</strong> near-original quality, service packaging, mid-to-high price.</li>
        <li><strong>High-quality commercial:</strong> good fit, slightly lower brightness, mid price.</li>
        <li><strong>Budget commercial:</strong> low price, weaker color and brightness, shorter life.</li>
        <li><strong>Refurbished:</strong> depends on the workshop; can be excellent or poor.</li>
      </ul>
      <h2>How to inspect</h2>
      <ol>
        <li>Compare maximum and minimum brightness.</li>
        <li>Show a white and a black background.</li>
        <li>Test touch at the corners.</li>
        <li>Test the under-display fingerprint.</li>
        <li>Inspect edges and gaps.</li>
        <li>Ask about the warranty.</li>
      </ol>
      <blockquote>Always require the type to be stated on the invoice. Clarity protects your rights.</blockquote>
      <h2>Is original worth it?</h2>
      <p>For a daily-driver flagship, often yes. For budget devices, a good commercial panel can be a sensible choice within your budget.</p>
    `,
    sources: [
      { label: "iFixit — Parts and guides", url: "https://www.ifixit.com/" }
    ]
  },
  {
    id: "essential-repair-tools",
    slug: "essential-repair-tools",
    titleAr: "أدوات الصيانة الأساسية لأي فني مبتدئ",
    titleEn: "Essential repair tools for a beginner technician",
    excerptAr: "قائمة أدوات لا غنى عنها، من المفكات ومحطات الهواء الساخن إلى أدوات الحماية من الكهرباء الساكنة.",
    excerptEn: "A must-have toolkit, from screwdrivers and hot-air stations to ESD protection.",
    category: "guide",
    icon: "tools",
    date: "2026-05-25",
    readTime: 6,
    tags: ["أدوات", "صيانة", "مبتدئين"],
    bodyAr: `
      <p>لا تحتاج إلى ورشة ضخمة للبدء، لكن أدوات رديئة تسبب خدوشاً وتلفاً. ابدأ بمجموعة صغيرة عالية الجودة.</p>
      <h2>الأساسيات</h2>
      <ul>
        <li>مفكات دقيقة بمقاسات Phillips وPentalobe وTorx.</li>
        <li>أدوات فتح بلاستيكية (Spudger) وملاقط.</li>
        <li>سوار أرضي مضاد للكهرباء الساكنة (ESD).</li>
        <li>سخان شاشة أو مسدس حراري بتحكم في الحرارة.</li>
        <li>مقياس USB لفحص الشحن.</li>
        <li>مكبرة أو عدسة مضيئة.</li>
        <li>لاصق مناسب للشاشات والبطاريات.</li>
      </ul>
      <h2>للمستوى المتقدم</h2>
      <ul>
        <li>محطة هواء ساخن بتحكم دقيق.</li>
        <li>محطة لحام وميكروسكوب.</li>
        <li>مزود طاقة ومنظمات جهد.</li>
        <li>حمام موجات فوق صوتية للوحات.</li>
        <li>أدوات قياس واستمرارية.</li>
      </ul>
      <h2>قواعد السلامة</h2>
      <ol>
        <li>افصل البطارية قبل العمل.</li>
        <li>لا تسخن البطارية مباشرة.</li>
        <li>اعمل في مكان جيد التهوية.</li>
        <li>نظّم البراغي حسب المكان.</li>
        <li>لا تستخدم القوة الزائدة.</li>
      </ol>
      <blockquote>الأداة الجيدة لا تجعل الفني ماهراً، لكن الأداة السيئة تجعل الخطأ أسهل.</blockquote>
    `,
    bodyEn: `
      <p>You do not need a huge workshop to start, but poor tools cause scratches and damage. Begin with a small, high-quality set.</p>
      <h2>Essentials</h2>
      <ul>
        <li>Precision screwdrivers in Phillips, Pentalobe, and Torx sizes.</li>
        <li>Plastic pry tools (spudgers) and tweezers.</li>
        <li>ESD wrist strap.</li>
        <li>Screen heater or temperature-controlled hot air.</li>
        <li>USB meter for charging tests.</li>
        <li>Magnifier or illuminated loupe.</li>
        <li>Proper adhesive for screens and batteries.</li>
      </ul>
      <h2>Advanced</h2>
      <ul>
        <li>Precision hot-air station.</li>
        <li>Soldering station and microscope.</li>
        <li>Power supply and voltage regulators.</li>
        <li>Ultrasonic cleaner for boards.</li>
        <li>Measurement and continuity tools.</li>
      </ul>
      <h2>Safety rules</h2>
      <ol>
        <li>Disconnect the battery before work.</li>
        <li>Never heat the battery directly.</li>
        <li>Work in a ventilated area.</li>
        <li>Organize screws by location.</li>
        <li>Do not use excessive force.</li>
      </ol>
      <blockquote>Good tools do not make a technician skilled, but bad tools make mistakes easier.</blockquote>
    `,
    sources: [
      { label: "iFixit — Toolkits", url: "https://www.ifixit.com/Store/Tools" }
    ]
  }
];

export const articleById = Object.fromEntries(articles.map((article) => [article.id, article]));
