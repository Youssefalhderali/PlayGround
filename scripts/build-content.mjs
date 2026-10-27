import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const settings = {
  siteName: 'Brxvih',
  displayName: 'brxvih | يوسف الهدار',
  alias: 'brxvih',
  realName: 'يوسف الهدار',
  brandName: 'WHITE BLACK',
  phone: '+967777066424',
  whatsapp: '967777066424',
  country: 'اليمن',
  email: 'contact@brxvih.com',
  cities: ['صنعاء', 'عدن', 'تعز', 'الحديدة', 'إب', 'المكلا', 'مأرب', 'حجة', 'ذمار', 'صعدة'],
  currencies: [
    { code: 'YER', nameAr: 'ريال يمني', nameEn: 'Yemeni Rial', symbol: 'ر.ي', decimals: 0 },
    { code: 'SAR', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal', symbol: 'ر.س', decimals: 2 },
    { code: 'USD', nameAr: 'دولار أمريكي', nameEn: 'US Dollar', symbol: '$', decimals: 2 },
  ],
  rates: { YER: null, SAR: null, USD: 1 },
  priceNotice: 'الأسعار المعروضة تُدار من لوحة التحكم وتُربط بمورد معتمد وتاريخ تحديث. لا نعرض أي سعر لم يتم إدخاله والتحقق منه. الأسعار الحالية فارغة حتى تتم إضافة عروض موردين حقيقية.',
  hero: {
    kicker: 'WHITE BLACK · YEMEN',
    title: 'مرجعك التقني لصيانة الهواتف وبرمجتها',
    subtitle: 'مواصفات موديلات، رومات رسمية، أعطال وحلول، أسعار شاشات وقطع غيار، وأمن سيبراني دفاعي — في منصة واحدة.',
  },
}

const brands = [
  ['Samsung','سامسونج','samsung','#1428A0','Galaxy'],
  ['Redmi','ريدمي','redmi','#FF6900','Note · A'],
  ['Xiaomi','شاومي','xiaomi','#FF6900','Xiaomi Series'],
  ['POCO','بوكو','poco','#F5C518','X · F · M · C'],
  ['Huawei','هواوي','huawei','#CF0A2C','Pura · Mate · nova'],
  ['Honor','هونر','honor','#00A9E0','Magic · X · N'],
  ['OPPO','أوبو','oppo','#1D7A46','Find · Reno · A'],
  ['Vivo','فيفو','vivo','#415FFF','X · V · Y · iQOO'],
  ['Realme','ريلمي','realme','#FFC915','GT · Number · C'],
  ['OnePlus','ون بلس','oneplus','#F5010C','Number · Nord'],
  ['Apple iPhone','آبل آيفون','apple-iphone','#8E8E93','iPhone · SE'],
  ['TECNO','تكنو','tecno','#0066B3','Phantom · Camon · Spark'],
  ['Infinix','إنفينكس','infinix','#FF6A00','Zero · Note · Hot'],
  ['itel','آيتل','itel','#0099CC','S · A · P · Zeno'],
  ['ZTE','زد تي إي','zte','#0055A5','Axon · Blade'],
  ['Nubia','نوبيا','nubia','#E60012','Z · Neo · RedMagic'],
  ['Motorola','موتورولا','motorola','#5C92FA','Edge · Razr · G'],
  ['Nokia','نوكيا','nokia','#124191','X · G · C'],
  ['LG','إل جي','lg','#A50034','Velvet · Wing · K'],
  ['Google Pixel','جوجل بكسل','google-pixel','#4285F4','Pixel · Fold'],
  ['ASUS','أسوس','asus','#1A1A1A','ROG Phone · Zenfone'],
  ['Nothing','ناثينج','nothing','#111111','Phone'],
  ['Sony','سوني','sony','#111111','Xperia'],
  ['iQOO','آيكو','iqoo','#FF6A00','Z · Neo'],
  ['TCL','تي سي إل','tcl','#E60012','TCL'],
  ['Meizu','مييزو','meizu','#00A0E9','Meizu'],
  ['Lenovo','لينوفو','lenovo','#E2231A','Lenovo'],
].map(([nameEn,nameAr,slug,color,series]) => ({ nameEn, nameAr, slug, color, series }))

const services = [
  { slug:'repair', icon:'wrench', titleAr:'صيانة الهواتف', titleEn:'Phone Repair', descAr:'تشخيص دقيق وإصلاح أعطال الشاشة، البطارية، الشحن، الصوت، واللوحة الأم بأدوات مناسبة.', descEn:'Accurate diagnosis and repair for display, battery, charging, audio and board-level faults.' },
  { slug:'software', icon:'cpu', titleAr:'السوفت وير والتفليش', titleEn:'Software & Flashing', descAr:'مسارات رسمية لتحديث الأنظمة، استعادة الأجهزة المتوقفة، والتفليش الآمن بملفات مطابقة.', descEn:'Official update paths, recovery of bootlooping devices, and safe flashing with matching files.' },
  { slug:'programming', icon:'code', titleAr:'البرمجة', titleEn:'Programming', descAr:'حلول برمجية مخصصة: أدوات فنيين، أتمتة، واجهات API، ولوحات تحكم.', descEn:'Custom software: technician tools, automation, APIs and dashboards.' },
  { slug:'cybersecurity', icon:'shield', titleAr:'الأمن السيبراني', titleEn:'Cybersecurity', descAr:'محتوى دفاعي لحماية الأجهزة والحسابات والشبكات، مع مختبرات تعليمية آمنة.', descEn:'Defensive guidance for devices, accounts and networks, with safe learning labs.' },
  { slug:'tools', icon:'toolbox', titleAr:'أدوات الصيانة', titleEn:'Repair Tools', descAr:'دليل الأدوات والبرامج المعتمدة وأساليب استخدامها دون إتلاف الجهاز.', descEn:'A guide to trusted hardware and software tools and how to use them safely.' },
  { slug:'firmware', icon:'download', titleAr:'ملفات Firmware', titleEn:'Firmware Library', descAr:'روابط رسمية وموثوقة، مع تطابق الموديل والمنطقة والإصدار قبل أي تحميل.', descEn:'Official and trusted sources with model, region and version matching before download.' },
  { slug:'models', icon:'smartphone', titleAr:'موديلات الهواتف', titleEn:'Phone Models', descAr:'قاعدة بيانات واسعة للمواصفات والأسماء الرمزية وأرقام الموديلات.', descEn:'A broad database of specifications, codenames and model numbers.' },
  { slug:'screens', icon:'display', titleAr:'أسعار الشاشات', titleEn:'Screen Prices', descAr:'أسعار من موردين معتمدين، بأنواعها الأصلية والتجارية والمجددة والمستعملة.', descEn:'Prices from verified suppliers across original, aftermarket, refurbished and used grades.' },
  { slug:'parts', icon:'battery', titleAr:'قطع الغيار', titleEn:'Spare Parts', descAr:'توافق القطع وبدائلها ومصادر التوريد، مع تنبيهات الجودة.', descEn:'Part compatibility, alternatives and sourcing with quality warnings.' },
  { slug:'faults', icon:'alert', titleAr:'أعطال الهواتف وحلولها', titleEn:'Faults & Fixes', descAr:'أدلة تشخيص خطوة بخطوة للأعطال الشائعة، مع أسبابها وطرق الوقاية.', descEn:'Step-by-step diagnosis for common faults, their causes and prevention.' },
  { slug:'guides', icon:'book', titleAr:'شروحات ودروس تقنية', titleEn:'Guides & Tutorials', descAr:'شروحات مبسطة للفنيين والمستخدمين، مبنية على ممارسات آمنة.', descEn:'Clear tutorials for technicians and users based on safe practice.' },
  { slug:'requests', icon:'clipboard', titleAr:'طلبات الصيانة', titleEn:'Repair Requests', descAr:'أرسل تفاصيل العطل، احصل على رقم تذكرة، وتابع حالة الطلب.', descEn:'Submit fault details, receive a ticket number and track the request.' },
  { slug:'contact', icon:'message', titleAr:'التواصل معنا', titleEn:'Contact', descAr:'واتساب مباشر وهاتف للاستشارة الفنية وحجز موعد الصيانة.', descEn:'Direct WhatsApp and phone for technical advice and repair bookings.' },
]

const tools = [
  { name:'Odin3', category:'software', platform:'Windows', descAr:'أداة تفليش أجهزة سامسونج بملفات AP/BL/CP/CSC الرسمية. استخدم إصداراً موثوقاً وملفاً مطابقاً للموديل.', descEn:'Samsung flashing tool for official AP/BL/CP/CSC packages. Use a trusted build and matching firmware.', url:'https://www.sammobile.com/', source:'SamMobile (مجتمعي)', free:true, risk:'high' },
  { name:'Mi Flash Tool', category:'software', platform:'Windows', descAr:'أداة رسمية من شاومي لتفليش أجهزة Redmi وXiaomi. لا تستخدمها مع bootloader مقفل دون مسار رسمي.', descEn:'Official Xiaomi flashing tool for Redmi and Xiaomi devices. Do not use with a locked bootloader outside official paths.', url:'https://www.mi.com/global/support/', source:'Xiaomi', free:true, risk:'high' },
  { name:'SP Flash Tool', category:'software', platform:'Windows/Linux', descAr:'أداة MediaTek لكتابة الصور. خطأ في اختيار scatter يمكن أن يجعل الجهاز غير قابل للإقلاع.', descEn:'MediaTek image flashing tool. A wrong scatter file can brick the device.', url:'https://spflashtool.com/', source:'مجتمعي', free:true, risk:'high' },
  { name:'QFIL / QPST', category:'software', platform:'Windows', descAr:'أدوات Qualcomm للطوارئ واستعادة أجهزة EDL. مخصصة للفنيين وملفات firehose الموثوقة.', descEn:'Qualcomm emergency and EDL recovery tools for technicians using trusted firehose files.', url:'https://www.qualcomm.com/', source:'Qualcomm', free:true, risk:'high' },
  { name:'ADB & Fastboot', category:'software', platform:'All', descAr:'أدوات Android الرسمية للتشخيص والنسخ الاحتياطي وتثبيت تحديثات المصنع.', descEn:'Official Android tools for diagnostics, backup and factory image installation.', url:'https://developer.android.com/tools/releases/platform-tools', source:'Google', free:true, risk:'medium' },
  { name:'3uTools', category:'software', platform:'Windows', descAr:'أداة شاملة لأجهزة iPhone: فحص، نسخ احتياطي، وإدارة ملفات. بعض الوظائف قد تكون غير رسمية.', descEn:'All-in-one iPhone utility for diagnostics, backup and file management. Some features are unofficial.', url:'https://www.3u.com/', source:'3uTools', free:true, risk:'medium' },
  { name:'UnlockTool', category:'software', platform:'Windows', descAr:'منصة مدفوعة للفنيين. استخدمها فقط على أجهزة تملكها أو لديك تفويض كتابي بإصلاحها.', descEn:'Paid technician platform. Use only on devices you own or are authorized in writing to service.', url:'https://unlocktool.net/', source:'UnlockTool', free:false, risk:'high' },
  { name:'Multimeter', category:'hardware', platform:'—', descAr:'قياس الجهد والاستمرارية والتماس. أساسي قبل تغيير أي قطعة.', descEn:'Measures voltage, continuity and shorts. Essential before replacing any part.', url:'', source:'—', free:false, risk:'low' },
  { name:'Precision Screwdriver Set', category:'hardware', platform:'—', descAr:'رؤوس Torx, Phillips, Pentalobe ومغناطيسية مناسبة. تجنب الإفراط في الشد.', descEn:'Magnetic Torx, Phillips and Pentalobe bits. Avoid over-tightening.', url:'', source:'—', free:false, risk:'low' },
  { name:'Suction Cup & Opening Picks', category:'hardware', platform:'—', descAr:'لفصل الشاشات اللاصقة دون كسر الإطار أو الكابل.', descEn:'Separates adhesive displays without cracking frames or cables.', url:'', source:'—', free:false, risk:'low' },
  { name:'Heat Mat / Hot Plate', category:'hardware', platform:'—', descAr:'تسخين منظم لفك اللاصق. تحكم بالحرارة لتجنب تلف البطارية والشاشة.', descEn:'Controlled heating for adhesive removal. Regulate temperature to protect battery and display.', url:'', source:'—', free:false, risk:'medium' },
  { name:'USB Power Meter', category:'hardware', platform:'—', descAr:'قياس سحب التيار والجهد لتشخيص الشحن بسرعة.', descEn:'Measures current draw and voltage for fast charging diagnostics.', url:'', source:'—', free:false, risk:'low' },
  { name:'Anti-static Mat & Wrist Strap', category:'hardware', platform:'—', descAr:'حماية اللوحة من التفريغ الكهروستاتيكي أثناء العمل.', descEn:'Protects boards from electrostatic discharge during repairs.', url:'', source:'—', free:false, risk:'low' },
  { name:'Stereo Microscope', category:'hardware', platform:'—', descAr:'ضروري لأعمال اللوحة الدقيقة وإعادة لحام الموصلات.', descEn:'Essential for micro-soldering and connector rework.', url:'', source:'—', free:false, risk:'low' },
  { name:'Ultrasonic Cleaner', category:'hardware', platform:'—', descAr:'تنظيف اللوحات بعد تلف السوائل. تُفك القطع الحساسة وتُجفف بالكامل أولاً.', descEn:'Cleans boards after liquid damage. Remove sensitive parts and dry completely first.', url:'', source:'—', free:false, risk:'medium' },
  { name:'OCA Laminating Machine', category:'hardware', platform:'—', descAr:'إعادة لصق الزجاج بالشاشة. يحتاج تدريباً لتجنب الفقاعات.', descEn:'Re-laminates glass to display. Requires training to avoid bubbles.', url:'', source:'—', free:false, risk:'medium' },
  { name:'Frija / SamFirm', category:'software', platform:'Windows', descAr:'أدوات مساعدة لتنزيل firmware سامسونج حسب CSC والموديل. تحقق من المصدر.', descEn:'Helper tools to download Samsung firmware by model and CSC. Verify the source.', url:'https://www.sammobile.com/', source:'مجتمعي', free:true, risk:'medium' },
  { name:'7-Zip', category:'software', platform:'All', descAr:'لفك ضغط حزم firmware بأمان مع التحقق من checksum.', descEn:'Safely extracts firmware packages and verifies checksums.', url:'https://www.7-zip.org/', source:'7-Zip', free:true, risk:'low' },
]

const firmwareSources = [
  { brand:'Samsung', name:'Samsung Support', url:'https://www.samsung.com/ye/support/', type:'official', noteAr:'الدعم الرسمي والتحديثات عبر OTA وSmart Switch.', noteEn:'Official support, OTA updates and Smart Switch.' },
  { brand:'Samsung', name:'SamMobile Firmware', url:'https://www.sammobile.com/firmwares/', type:'trusted', noteAr:'أرشيف firmware حسب الموديل والمنطقة. تحقق من CSC قبل التحميل.', noteEn:'Firmware archive by model and region. Verify CSC before downloading.' },
  { brand:'Xiaomi', name:'Xiaomi Support', url:'https://www.mi.com/global/support/', type:'official', noteAr:'أدوات وتحديثات MIUI/HyperOS الرسمية.', noteEn:'Official MIUI/HyperOS updates and tools.' },
  { brand:'Redmi', name:'Xiaomi Firmware Updater', url:'https://xiaomifirmwareupdater.com/', type:'trusted', noteAr:'أرشيف رومات Recovery/Fastboot. تأكد من الاسم الرمزي للموديل.', noteEn:'Recovery/Fastboot ROM archive. Confirm the device codename.' },
  { brand:'POCO', name:'Xiaomi Firmware Updater', url:'https://xiaomifirmwareupdater.com/', type:'trusted', noteAr:'رومات POCO الرسمية مع الاسم الرمزي والمنطقة.', noteEn:'Official POCO ROMs with codename and region.' },
  { brand:'Apple iPhone', name:'Apple Restore Guide', url:'https://support.apple.com/iphone/restore', type:'official', noteAr:'استخدم Finder أو Apple Devices لاستعادة iPhone وتحديثه.', noteEn:'Use Finder or Apple Devices to restore and update iPhone.' },
  { brand:'Apple iPhone', name:'ipsw.me', url:'https://ipsw.me/', type:'trusted', noteAr:'أرشيف IPSW موقّع. القسم أدناه يحتوي ملفات حقيقية مسحوبة من واجهة ipsw.me.', noteEn:'Signed IPSW archive. The section below includes real files fetched from the ipsw.me API.' },
  { brand:'Huawei', name:'Huawei Support', url:'https://consumer.huawei.com/en/support/', type:'official', noteAr:'تحديثات EMUI/HarmonyOS وأدوات eRecovery.', noteEn:'EMUI/HarmonyOS updates and eRecovery tools.' },
  { brand:'Honor', name:'Honor Support', url:'https://www.honor.com/global/support/', type:'official', noteAr:'تحديثات MagicOS الرسمية.', noteEn:'Official MagicOS updates.' },
  { brand:'OPPO', name:'OPPO Support', url:'https://www.oppo.com/en/support/', type:'official', noteAr:'تحديثات ColorOS وأدوات الاستعادة.', noteEn:'ColorOS updates and recovery tools.' },
  { brand:'Vivo', name:'Vivo Support', url:'https://www.vivo.com/en/support/', type:'official', noteAr:'تحديثات Funtouch OS وOriginOS.', noteEn:'Funtouch OS and OriginOS updates.' },
  { brand:'Realme', name:'Realme Support', url:'https://www.realme.com/global/support/', type:'official', noteAr:'تحديثات realme UI.', noteEn:'realme UI updates.' },
  { brand:'OnePlus', name:'OnePlus Support', url:'https://www.oneplus.com/support', type:'official', noteAr:'تحديثات OxygenOS وأدوات الاستعادة.', noteEn:'OxygenOS updates and recovery tools.' },
  { brand:'TECNO', name:'TECNO Support', url:'https://www.tecno-mobile.com/support/', type:'official', noteAr:'تحديثات HiOS.', noteEn:'HiOS updates.' },
  { brand:'Infinix', name:'Infinix Support', url:'https://www.infinixmobility.com/support', type:'official', noteAr:'تحديثات XOS.', noteEn:'XOS updates.' },
  { brand:'itel', name:'itel Support', url:'https://www.itel-mobile.com/support/', type:'official', noteAr:'تحديثات وأدوات الاستعادة.', noteEn:'Updates and recovery tools.' },
  { brand:'ZTE', name:'ZTE Support', url:'https://www.ztedevices.com/en/support/', type:'official', noteAr:'تحديثات MyOS وRedMagic OS.', noteEn:'MyOS and RedMagic OS updates.' },
  { brand:'Nubia', name:'Nubia Support', url:'https://www.nubia.com/', type:'official', noteAr:'تحديثات RedMagic OS.', noteEn:'RedMagic OS updates.' },
  { brand:'Motorola', name:'Motorola Support', url:'https://www.motorola.com/us/support', type:'official', noteAr:'أدوات Rescue and Smart Assistant.', noteEn:'Rescue and Smart Assistant tools.' },
  { brand:'Nokia', name:'Nokia Support', url:'https://www.nokia.com/phones/en_int/support', type:'official', noteAr:'تحديثات Android وأدوات الاستعادة.', noteEn:'Android updates and recovery tools.' },
  { brand:'LG', name:'LG Support', url:'https://www.lg.com/us/support', type:'official', noteAr:'دعم أجهزة LG القديمة وأدوات الجسر.', noteEn:'Legacy LG support and bridge tools.' },
  { brand:'Google Pixel', name:'Google Factory Images', url:'https://developers.google.com/android/images', type:'official', noteAr:'صور المصنع الرسمية وأداة Pixel Repair.', noteEn:'Official factory images and Pixel Repair tool.' },
]

const securityModules = [
  { titleAr:'حماية جهاز Android', titleEn:'Android device hardening', levelAr:'أساسي', levelEn:'Basic', icon:'shield', article:'android-security', topicsAr:['التحديثات','الأذونات','قفل الشاشة','Play Protect'], topicsEn:['Updates','Permissions','Screen lock','Play Protect'] },
  { titleAr:'الحسابات والمصادقة', titleEn:'Accounts & authentication', levelAr:'أساسي', levelEn:'Basic', icon:'key', article:'account-2fa', topicsAr:['2FA','Passkeys','كلمات المرور','الاسترداد'], topicsEn:['2FA','Passkeys','Passwords','Recovery'] },
  { titleAr:'تحليل التطبيقات المشبوهة', titleEn:'Suspicious app analysis', levelAr:'متوسط', levelEn:'Intermediate', icon:'bug', article:'malware-defense', topicsAr:['المؤشرات','الأذونات','العزل','الإزالة'], topicsEn:['Indicators','Permissions','Isolation','Removal'] },
  { titleAr:'أمن الشبكات وWi-Fi', titleEn:'Network & Wi-Fi security', levelAr:'متوسط', levelEn:'Intermediate', icon:'wifi', article:'wifi-security', topicsAr:['WPA3','الراوتر','شبكة الضيوف','VPN'], topicsEn:['WPA3','Router','Guest network','VPN'] },
  { titleAr:'الاحتيال والتصيد', titleEn:'Fraud & phishing', levelAr:'أساسي', levelEn:'Basic', icon:'fish', article:'otp-phishing', topicsAr:['OTP','واتساب','انتحال الهوية','التحقق'], topicsEn:['OTP','WhatsApp','Impersonation','Verification'] },
  { titleAr:'النسخ الاحتياطي', titleEn:'Backup & recovery', levelAr:'أساسي', levelEn:'Basic', icon:'database', article:'backup-restore', topicsAr:['3-2-1','التشفير','الاختبار','الاستعادة'], topicsEn:['3-2-1','Encryption','Testing','Restore'] },
  { titleAr:'اختبار الاختراق المصرح', titleEn:'Authorized penetration testing', levelAr:'متقدم', levelEn:'Advanced', icon:'target', article:'pentest-ethics', topicsAr:['التفويض','النطاق','القانون','التقرير'], topicsEn:['Authorization','Scope','Law','Reporting'] },
  { titleAr:'مختبرات تعليمية آمنة', titleEn:'Safe learning labs', levelAr:'متوسط', levelEn:'Intermediate', icon:'flask', article:'pentest-ethics', topicsAr:['أجهزة معزولة','بيئات افتراضية','قانوني'], topicsEn:['Isolated devices','Virtual labs','Legal'] },
]

const faqs = [
  { qAr:'هل الأسعار المعروضة حقيقية؟', aAr:'لا نعرض أي سعر لم يُدخله مورد معتمد مع تاريخ تحديث. قاعدة الأسعار تبدأ فارغة، وتُملأ من لوحة التحكم. أي سعر يظهر سيكون مرتبطاً بمورد ومدينة وتاريخ.', qEn:'Do you show real prices?', aEn:'We only display prices entered by a verified supplier with an update date. The price database starts empty and is managed from the dashboard.' },
  { qAr:'هل يمكنني تحميل روم لأي موديل؟', aAr:'نوفر بوابات رسمية وموثوقة فقط. يجب مطابقة الموديل والمنطقة والاسم الرمزي ورقم الإصدار قبل التحميل. لا نستضيف ملفات مجهولة المصدر.', qEn:'Can I download firmware for any model?', aEn:'We link only official or trusted portals. Match model, region, codename and version before downloading. We do not host anonymous files.' },
  { qAr:'هل تقدمون تجاوز FRP أو فك حماية الأجهزة المسروقة؟', aAr:'لا. نساعد المالك الشرعي فقط عبر مسارات رسمية. تجاوز حماية الملكية غير قانوني وغير مدعوم.', qEn:'Do you bypass FRP or locked stolen devices?', aEn:'No. We help legitimate owners through official recovery paths only. Bypassing ownership protection is unlawful and unsupported.' },
  { qAr:'كيف أضيف سعر شاشة؟', aAr:'من لوحة التحكم > أسعار الشاشات > إضافة سعر. اختر الموديل والجودة والعملة والمدينة والمورد، ثم أدخل سعر الشاشة وسعر التركيب. يظهر السعر مباشرة بعد الحفظ.', qEn:'How do I add a screen price?', aEn:'From the dashboard, open Screen Prices, add a record with model, grade, currency, city, supplier and installation fee. It goes live immediately.' },
  { qAr:'هل البيانات محفوظة على السيرفر؟', aAr:'هذه النسخة تعمل بقاعدة بيانات محلية داخل المتصفح (IndexedDB) لتعمل على الاستضافة الثابتة. يمكن تصدير كل البيانات واستيرادها من لوحة التحكم. للاستخدام متعدد الفنيين يمكن ربط API مركزي.', qEn:'Is data stored on a server?', aEn:'This build uses a browser-side IndexedDB database so it works on static hosting. Export and import are available in the dashboard. A central API can be connected for multi-technician use.' },
  { qAr:'كيف أتابع طلب الصيانة؟', aAr:'بعد الإرسال تحصل على رقم تذكرة. ابحث به في صفحة طلبات الصيانة. في هذه النسخة يمكنك أيضاً إرسال الطلب مباشرة عبر واتساب.', qEn:'How do I track a repair request?', aEn:'You receive a ticket number after submitting. Search it on the Repair Requests page. You can also send details directly via WhatsApp.' },
  { qAr:'هل المحتوى الأمني تعليمي؟', aAr:'نعم، كل المحتوى دفاعي وتعليمي. لا نقدم خطوات للوصول غير المصرح به. أي اختبار اختراق يتطلب تفويضاً كتابياً ونطاقاً محدداً.', qEn:'Is the security content educational?', aEn:'Yes, all content is defensive and educational. We do not provide unauthorized access steps. Any penetration test requires written authorization and scope.' },
  { qAr:'كيف أتواصل معك؟', aAr:'واتساب أو هاتف: +967777066424. الاسم المعروض: brxvih | يوسف الهدار.', qEn:'How do I contact you?', aEn:'WhatsApp or phone: +967777066424. Display name: brxvih | Youssef Al-Haddar.' },
]

const articles = [
  {
    slug:'screen-replacement', category:'maintenance', featured:true, cover:'screen',
    titleAr:'استبدال شاشة الهاتف بأمان: الدليل الكامل', titleEn:'Safe phone screen replacement: the complete guide',
    excerptAr:'من تشخيص العطل إلى اختيار القطعة وإعادة التجميع. خطوات عملية تحمي اللوحة والكابلات وتضمن نتيجة نظيفة.',
    excerptEn:'From fault diagnosis to part selection and reassembly. Practical steps that protect the board and cables.',
    tags:['شاشة','صيانة','قطع غيار'],
    bodyAr:`## قبل أن تفتح الجهاز
أوقف الجهاز وافصله عن الشاحن. إذا كانت الشاشة مكسورة أو اللمس غير منتظم، خذ نسخة احتياطية فوراً إن أمكن. سجّل ملاحظاتك: هل الصورة سوداء مع صوت يعمل؟ هل هناك بقعة ضوء؟ هذه التفاصيل تحدد إن كان العطل في الشاشة أم في اللوحة.

## الأدوات الصحيحة
تحتاج مفكات دقيقة، كأس شفط، أدوات فتح بلاستيكية، مسخن أو وسادة حرارية، ومقياس جهد. لا تستخدم أدوات معدنية لرفع الشاشة؛ فهي تخدش الإطار وقد تثقب البطارية. البس سواراً مضاداً للكهرباء الساكنة.

## خطوات الفك
1. سخّن الإطار بلطف (حوالي 60–80°م حسب الطراز) لتحرير اللاصق.
2. أدخل أداة الفتح من الحافة وتحرك ببطء حول المحيط.
3. ارفع الشاشة كالكتاب وافتحها من الجهة الصحيحة، ثم افصل كابل البطارية أولاً قبل أي كابل آخر.
4. افصل كابلات الشاشة واللمس بحذر، ولا تسحب الكابل بأكمله من المنتصف.

## اختيار الشاشة
الشاشة الأصلية Service Pack هي الأدق لوناً وسطوعاً لكنها الأغلى. شاشات OEM بجودة قريبة، والتجارية تتفاوت كثيراً. المجددة قد تكون أصلية مع زجاج جديد، والمستعملة تعتمد على حالتها. اسأل المورد عن الضمان، درجة السطوع، ودعم اللمس المتعدد.

## إعادة التجميع والاختبار
نظّف بقايا اللاصق، ثبّت الشاشة الجديدة، وأعد توصيل الكابلات قبل إغلاق الجهاز. شغّل الجهاز واختبر اللمس، السطوع، مستشعر القرب، والكاميرا الأمامية. لا تغلق الجهاز نهائياً قبل الاختبار. استخدم شريط لاصق مناسباً وأعد براغيها بالقوة الصحيحة.

## تحذير
إذا لاحظت انتفاخ البطارية أو رائحة كيميائية، توقف فوراً وضع الجهاز في مكان آمن. لا تحاول تسخين بطارية منتفخة.`,
    bodyEn:`## Before opening
Power off and disconnect the charger. If the screen is broken, back up immediately if possible. Note whether audio still works, whether there is a light spot, and whether touch is intermittent. These details separate a display fault from a board fault.

## Right tools
Use precision screwdrivers, a suction cup, plastic opening picks, a controlled heat source and a multimeter. Never pry with metal; it scratches frames and can puncture the battery. Wear an anti-static strap.

## Removal
1. Warm the frame gently (roughly 60–80°C depending on model).
2. Slide a pick around the edge to cut the adhesive.
3. Open the display like a book and disconnect the battery first.
4. Release display and digitizer flex cables carefully, never yank them.

## Choosing a panel
A genuine service-pack panel offers the best color and touch accuracy but costs more. OEM-grade panels are close; aftermarket quality varies widely. Refurbished panels may use genuine glass; used panels depend on condition. Ask for warranty, brightness and multi-touch support.

## Reassembly
Clean old adhesive, connect cables, power on and test touch, brightness, proximity and front camera before sealing. Use proper adhesive and torque screws carefully.

## Warning
If the battery is swollen or smells chemical, stop and isolate the device. Do not heat a swollen battery.`,
  },
  {
    slug:'charging-port', category:'maintenance', featured:true, cover:'charge',
    titleAr:'الهاتف لا يشحن؟ تشخيص منفذ الشحن خطوة بخطوة', titleEn:'Phone not charging? Step-by-step charging port diagnosis',
    excerptAr:'قبل تغيير المنفذ، افحص الكابل والشاحن والبطارية وسحب التيار. معظم حالات عدم الشحن ليست عطلاً في المنفذ.',
    excerptEn:'Before replacing the port, check the cable, charger, battery and current draw. Most charging faults are not the port.',
    tags:['شحن','بطارية','منفذ USB'],
    bodyAr:`## ابدأ بالأسهل
جرّب كابل وشاحن معروفين، ونظّف المنفذ من الغبار بفرشاة ناعمة أو عود خشبي. لا تستخدم إبرة معدنية؛ فقد تقصر أطراف VBUS. افحص وجود أوساخ مضغوطة باستخدام كاميرا مكبرة.

## قياس سحب التيار
استخدم مقياس USB لمعرفة الجهد والتيار. جهاز لا يسحب شيئاً قد يكون منفصلاً أو به عطل في IC الشحن. جهاز يسحب تياراً كبيراً مع حرارة قد يشير إلى تماس في اللوحة.

## عزل السبب
- جرّب شاحناً آخر ومنفذاً آخر.
- أقلع الجهاز في وضع آمن أو أطفئه: هل يتغير السلوك؟
- افحص البطارية: جهد منخفض جداً قد يمنع الإقلاع.
- راقب مرونة الكابل أثناء تحريكه: تغير التيار يعني كابل أو منفذ مهترئ.

## استبدال المنفذ
المنفذ قطعة منفصلة في معظم الهواتف، لكن بعض الطرز تلحمه مباشرة باللوحة. يحتاج استبدال المنفذ الملحوم إلى محطة لحام ومهارة. لا تسخن بشكل مفرط قرب البطارية أو الشاشة. استخدم تدفقاً مناسباً ونظف البقايا.

## متى يكون العطل في اللوحة؟
إذا كان المنفذ جديداً والتيار لا يمر، فقد يكون IC الشحن أو مسار VBUS أو ملف الشحن اللاسلكي. هذه أعمال لوحة تحتاج مخططاً وميكروسكوباً. لا تستبدل قطعاً عشوائياً.

## وقاية
افصل الشاحن من الطرف وليس من الكابل فقط، وتجنب الشواحن الرخيصة غير المعتمدة، ونظف المنفذ دورياً.`,
    bodyEn:`## Start simple
Test a known-good cable and charger. Clean lint with a soft brush or wooden pick, never a metal needle. Inspect the port with a magnifier.

## Measure current
A USB power meter shows voltage and current. Zero draw may mean a disconnected port or a charging IC fault. High current with heat may indicate a board short.

## Isolate
Try another outlet, charger and cable. Boot in safe mode or power off and observe. Check battery voltage. Wiggle the cable gently; changing current points to a worn cable or port.

## Port replacement
Most phones use a separate port board; some are soldered. Soldered replacement needs a hot station and skill. Do not overheat near the battery or display.

## Board-level faults
A new port with no current can mean a charging IC, VBUS trace or wireless charging coil issue. Use a schematic and microscope; avoid random part swaps.

## Prevention
Unplug by the connector, avoid uncertified chargers and clean the port periodically.`,
  },
  {
    slug:'water-damage', category:'maintenance', featured:true, cover:'water',
    titleAr:'سقط الهاتف في الماء: ما تفعله في أول 24 ساعة', titleEn:'Phone fell in water: what to do in the first 24 hours',
    excerptAr:'لا تضعه في الأرز. افصل الطاقة، فكك ما يمكن فكه، واغسل اللوحة بسائل إلكتروني مناسب ثم جففها بالكامل.',
    excerptEn:'Do not use rice. Cut power, disassemble what you can, clean the board with a proper electronic solvent and dry it completely.',
    tags:['ماء','تلف السوائل','لوحة أم'],
    bodyAr:`## فوراً
أخرج الجهاز من الماء، أطفئه إن كان يعمل، وافصل الشاحن. لا تضغط الأزرار كثيراً ولا تشحنه. إذا كان الهاتف مطفأً، لا تشغله «للتجربة». الماء مع الكهرباء يصنع تآكلاً سريعاً.

## لا ترسله للأرز
الأرز لا يزيل الأملاح ولا يصل إلى داخل الموصلات. قد يمتص بعض الرطوبة السطحية لكنه يترك التآكل يستمر. لا تستخدم مجفف الشعر الساخن؛ الحرارة تدفع الماء أعمق وتضر الشاشة والبطارية.

## التفكيك والتنظيف
افصل البطارية أولاً. انزع الشاشة واللوحة إن أمكن، وانزع الكاميرات والموصلات. افحص التآكل حول IC الطاقة والموصلات. استخدم منظفاً إلكترونياً (Isopropyl 99% أو محلول مخصص) وفرشاة ناعمة، ثم حمام موجات فوق صوتية للوحة بعد إزالة القطع الحساسة إذا كانت لديك الخبرة.

## التجفيف
جفف بالهواء المضغوط البارد، ثم ضع اللوحة في صندوق تجفيف معتدل الحرارة (40–50°م) أو أمام مروحة لساعات. لا تضعها في الفرن. تأكد من جفاف كل الموصلات قبل إعادة التجميع.

## بعد الإصلاح
اختبر الشحن، الصوت، الكاميرا، الشبكة، واللمس. قد تظهر أعطال متأخرة بعد أيام بسبب التآكل. أخبر العميل بذلك بوضوح. الوقاية: حافظة مقاومة للماء وعدم الشحن بيد مبللة.`,
    bodyEn:`## Immediately
Remove the phone from water, power it off and disconnect charging. Do not press buttons repeatedly or plug it in. Do not power on "to test".

## Skip the rice myth
Rice does not remove salts or reach connectors. Hot air pushes moisture deeper and damages the display and battery.

## Disassemble and clean
Disconnect the battery first. Remove the display, board, cameras and connectors where possible. Inspect corrosion around power ICs and connectors. Clean with 99% isopropyl or a proper electronic cleaner and a soft brush. Use an ultrasonic bath only with experience.

## Dry
Use cool compressed air, then a warm drying box (40–50°C) or fan for hours. Never bake it. Ensure connectors are dry before reassembly.

## After repair
Test charging, audio, cameras, network and touch. Corrosion can cause delayed faults; explain this to the customer.`,
  },
  {
    slug:'battery-health', category:'maintenance', cover:'battery',
    titleAr:'بطارية الهاتف: متى تستبدلها وكيف تحافظ عليها؟', titleEn:'Phone battery: when to replace it and how to care for it',
    excerptAr:'علامات تدهور البطارية، قراءة تقرير الصحة، وطرق شحن تقلل التآكل وتحمي الجهاز.',
    excerptEn:'Battery degradation signs, reading health reports, and charging habits that reduce wear.',
    tags:['بطارية','شحن','عمر الجهاز'],
    bodyAr:`## علامات التدهور
انخفاض مفاجئ من 30% إلى 0%، انتفاخ خلفي، سخونة غير معتادة أثناء الشحن، أو إغلاق الجهاز عند الحمل العالي. هذه علامات تستدعي فحص البطارية واللوحة.

## قراءة الصحة
في Android استخدم تقرير النظام أو تطبيقاً موثوقاً يعرض دورات الشحن وسعة التصميم. في iPhone افتح الإعدادات > البطارية > صحة البطارية. النسبة وحدها لا تكفي؛ راقب السلوك الفعلي.

## عادات الشحن
حافظ على الشحن بين 20% و85% عندما يكون ذلك ممكناً. تجنب الحرارة العالية أثناء الشحن، ولا تترك الجهاز على الشاحن في جو حار. الشحن السريع آمن مع شاحن معتمد؛ المشكلة في الحرارة والجودة الرديئة.

## الاستبدال
استخدم بطارية بعلامة تجارية واضحة وسعة مطابقة. لا تثق ببطاريات «سعة أعلى» رخيصة. افصل البطارية أولاً، ولا تثقبها. بعد الاستبدال، افحص الشحن والاستنزاف لأيام.

## السلامة
البطارية المنتفخة خطر حريق. لا تضغطها ولا تشحنها. ضعها في حاوية معدنية بعيداً عن المواد القابلة للاشتعال وسلّمها لمركز إعادة تدوير.`,
    bodyEn:`## Signs of wear
Sudden drops from 30% to 0%, a swollen back, unusual heat while charging, or shutdowns under load. These require battery and board inspection.

## Reading health
On Android, use system reports or a trusted app for cycle count and design capacity. On iPhone, open Settings > Battery > Battery Health. The percentage alone is not enough; observe real behavior.

## Charging habits
Keep charge between 20% and 85% when practical. Avoid heat while charging; do not leave the phone charging in a hot environment. Fast charging is safe with certified chargers; heat and poor quality are the problem.

## Replacement
Use a clearly branded battery with matching capacity. Distrust cheap "higher capacity" cells. Disconnect first and never puncture. Test charging and drain for a few days.

## Safety
A swollen battery is a fire risk. Do not compress or charge it. Place it in a metal container away from flammables and take it to recycling.`,
  },
  {
    slug:'bootloop', category:'software', featured:true, cover:'boot',
    titleAr:'الجهاز يعيد التشغيل باستمرار بعد تحديث؟ خيارات آمنة', titleEn:'Phone bootloops after an update? Safe recovery options',
    excerptAr:'افصل السبب بين تطبيق وذاكرة وتحديث، ثم اختر المسار الرسمي المناسب دون فقدان بياناتك.',
    excerptEn:'Separate app, storage and update causes, then choose the right official path without losing data.',
    tags:['bootloop','تحديث','سوفت وير'],
    bodyAr:`## افهم النمط
هل يتوقف عند شعار الشركة؟ هل يصل إلى شاشة القفل ثم يعيد التشغيل؟ هل بدأ بعد تحديث أو تثبيت تطبيق؟ النمط يحدد المسار. اترك الجهاز يبرد وتأكد أن البطارية كافية.

## وضع الآمن
على Android، اضغط مطولاً على زر الطاقة ثم اضغط مطولاً على «إعادة التشغيل» للدخول إلى الوضع الآمن. إذا استقر الجهاز، فالتطبيق الأخير هو السبب. احذفه وأعد التشغيل. على iPhone، جرّب إعادة التشغيل القسري وتحديث النظام.

## مساحة التخزين
امتلاء التخزين قد يمنع الإقلاع. إذا وصلت إلى النظام، احذف الملفات غير الضرورية. لا تحذف ملفات النظام.

## التحديث الرسمي
استخدم OTA أو أداة الشركة الرسمية. لا تفلّش رومات مجهولة. إذا فشل التحديث، يمكن استعادة صورة المصنع لكن هذا قد يمسح البيانات. خذ نسخة احتياطية إن أمكن.

## متى يكون عطلاً في اللوحة؟
إذا تكرر الاهتزاز أو التسخين دون إقلاع، أو ظهر الجهاز في وضع EDL، فقد يكون هناك عطل في الذاكرة أو مسار الطاقة. توقف عن المحاولات العشوائية وافحص اللوحة.

## بعد التعافي
حدّث التطبيقات، افحص التخزين، وثبّت نسخة احتياطية دورية. لا تعيد تثبيت التطبيق المشبوه.`,
    bodyEn:`## Understand the pattern
Does it stop at the logo, reach the lock screen, or restart after an update or app install? Let it cool and ensure enough battery.

## Safe mode
On Android, long-press power then long-press Restart for safe mode. If stable, the last app is the cause. On iPhone, force restart and update iOS.

## Storage
A full disk can block boot. Delete only personal files, never system files.

## Official update
Use OTA or the vendor tool. Do not flash unknown ROMs. A factory image may wipe data; back up first if possible.

## Board-level
Repeated vibration or heat without boot, or EDL mode, may indicate storage or power path failure. Stop random attempts and inspect the board.

## After recovery
Update apps, check storage and keep regular backups. Do not reinstall the suspect app.`,
  },
  {
    slug:'black-screen', category:'maintenance', cover:'black',
    titleAr:'شاشة سوداء والهاتف يعمل: كيف تحدد العطل؟', titleEn:'Black screen but phone works: how to locate the fault',
    excerptAr:'اختبارات سريعة تفرق بين الشاشة واللمس واللوحة، قبل إنفاقك على قطعة غير مطلوبة.',
    excerptEn:'Quick tests that separate display, digitizer and board faults before buying an unnecessary part.',
    tags:['شاشة سوداء','تشخيص','لوحة'],
    bodyAr:`## أصوات واهتزاز
اتصل بالجهاز من رقم آخر. إذا رنّ واهتز، فالنظام يعمل على الأرجح. جرّب الضغط على زر الطاقة مرتين أو استخدام المساعد الصوتي. هذا يفرق بين جهاز ميت وشاشة مطفأة.

## اختبار الضوء
سلّط ضوءاً قوياً على الشاشة بزاوية. إذا رأيت صورة خافتة، فقد يكون الإضاءة الخلفية أو مسارها. إذا لم ترَ شيئاً، فقد تكون الشاشة أو كابلها.

## كابل الشاشة
أعد توصيل كابل الشاشة بعد فصل البطارية. افحص الموصل بحثاً عن تآكل أو انحناء. لا تصلح الكابل بالضغط العشوائي.

## اختبار خارجي
بعض الأجهزة تدعم عرضاً خارجياً عبر USB-C. إذا ظهرت الصورة، فالشاشة الداخلية هي المشكلة غالباً. هذا ليس اختباراً نهائياً لكنه مفيد.

## اللوحة
إذا كانت الشاشة الجديدة لا تعمل أيضاً، فقد تكون مشكلة في IC العرض أو مسار الطاقة. توقف عن استبدال الشاشات وافحص اللوحة بمخطط.

## ملاحظة
لا تفترض أن السواد يعني شاشة تالفة. التشخيص الخاطئ يستهلك وقت العميل ويزيد التكلفة.`,
    bodyEn:`## Sound and vibration
Call the phone from another device. If it rings and vibrates, the system is likely alive. Try the voice assistant. This separates a dead phone from a dark display.

## Flashlight test
Shine a strong light at an angle. A faint image suggests backlight or its circuit. No image suggests display or flex cable.

## Display cable
Reconnect the display flex after disconnecting the battery. Inspect for corrosion or bent pins; do not crush the connector.

## External output
Some phones support USB-C display output. If an image appears externally, the internal panel is likely faulty.

## Board
If a known-good panel also fails, suspect display IC or power rails. Stop swapping panels and use a schematic.

## Note
Black screen does not always mean a dead panel. Misdiagnosis wastes time and money.`,
  },
  {
    slug:'screen-types', category:'prices', cover:'grades',
    titleAr:'أنواع شاشات الهواتف: أصلي، تجاري، مجدد، ومستعمل', titleEn:'Phone screen grades: original, aftermarket, refurbished and used',
    excerptAr:'ما الفرق الحقيقي بين درجات الشاشات؟ وكيف تسعّر الشاشة والتركيب بعدل وشفافية؟',
    excerptEn:'What really separates screen grades, and how to price panel and installation fairly.',
    tags:['شاشة','أسعار','جودة'],
    bodyAr:`## الأصلية Service Pack
تأتي من الشركة المصنعة أو مورد معتمد، بطبقة أصلية ودعم لمس متعدد وسطوع مطابق. السعر الأعلى مقابل أقل مخاطرة. تحقق من العبوة والملصقات والضمان.

## OEM / تجاري عالي الجودة
مصنّعة في نفس خطوط الإنتاج غالباً لكن دون علامة خدمة رسمية. الجودة تتفاوت بين دفعات. اسأل عن الضمان ومعدل الاستبدال.

## المجددة
شاشة أصلية أعيد لصق زجاجها أو تغيير طبقة اللمس. قد تكون ممتازة إذا نفذت بآلة OCA، لكن الفقاعات أو اللمس غير المستقر يظهران لاحقاً. اطلب اختباراً قبل الدفع.

## المستعملة
قطعة من جهاز آخر. حالتها تعتمد على الاستخدام. افحص الخدوش، البقع، واللمس. لا توجد ضمانات طويلة عادة.

## كيف نعرض السعر؟
كل سعر يجب أن يحمل: الموديل، رقمه، جودة الشاشة، العملة، المدينة، المورد، تاريخ التحديث، التوفر، سعر الشاشة، سعر التركيب، والمجموع. بدون هذه البيانات لا نعتبره سعراً موثوقاً.

## نصيحة للعميل
لا تطلب «أرخص شاشة» فقط. اسأل عن الضمان، السطوع، واللمس، وتكلفة التركيب. الشاشة الرخيصة قد تكلف أكثر على المدى القصير.`,
    bodyEn:`## Genuine service pack
Comes from the manufacturer or an authorized supplier with original coating, multi-touch and brightness. Higher price, lower risk. Verify packaging and warranty.

## OEM / premium aftermarket
Often produced on similar lines without official service branding. Quality varies by batch. Ask for warranty and return rate.

## Refurbished
Genuine panel with new glass or touch layer. Excellent if laminated properly, but bubbles or unstable touch can appear later. Test before paying.

## Used
Pulled from another device. Condition varies. Inspect scratches, spots and touch. Usually no long warranty.

## Price presentation
Every price needs model, model number, grade, currency, city, supplier, update date, availability, panel price, installation and total. Without these, it is not a verified price.

## Advice
Do not shop on price alone. Ask about warranty, brightness, touch and installation cost.`,
  },
  {
    slug:'odin-guide', category:'software', cover:'flash',
    titleAr:'تفليش سامسونج بـ Odin: المسار الرسمي الآمن', titleEn:'Flashing Samsung with Odin: the safe official path',
    excerptAr:'مطابقة CSC والموديل، النسخ الاحتياطي، وخطوات التفليش والتحقق بعد الإقلاع.',
    excerptEn:'Match CSC and model, back up, flash, and verify after boot.',
    tags:['Odin','سامسونج','تفليش'],
    bodyAr:`## هل تحتاج التفليش؟
التفليش ليس حلاً لكل عطل. جرّب إعادة التشغيل، مسح بيانات التطبيق، والوضع الآمن أولاً. إذا كان الجهاز يعمل، فالتحديث عبر OTA أو Smart Switch أأمن.

## جهّز الملفات
حمّل firmware المطابق للموديل والمنطقة (CSC) من مصدر موثوق. تحقق من اسم الملف والنسخة. لا تخلط ملفات AP من موديل آخر. افصل حساب Google/سامسونج إن كنت ستمسح البيانات، وخذ نسخة احتياطية.

## Odin
استخدم إصدار Odin موثوقاً. افتحه كمسؤول، ضع AP/BL/CP/CSC في الحقول الصحيحة. لا تضع HOME_CSC إذا أردت مسحاً كاملاً. تأكد من أن Odin يتعرف على الجهاز، ثم ابدأ. لا تفصل الكابل حتى تظهر PASS.

## بعد التفليش
سيقلع الجهاز ببطء في أول مرة. انتظر. تحقق من الإصدار وCSC والحساسات والشبكة. إذا لم يقلع، أعد المحاولة بحزمة كاملة قبل أي تصرف آخر.

## تحذيرات
التفليش يمسح البيانات غالباً، وقد يفشل إذا كانت البطارية منخفضة أو الكابل غير مستقر. لا تستخدم Odin على جهاز لا تملكه. لا تفلّش رومات معدلة لأجهزة مملوكة لغيرك.

## مسار بديل
إذا فشل Odin، استخدم Samsung Smart Switch أو مركز خدمة رسمي. العطل في الذاكرة أو اللوحة لا يُحل بالتفليش.`,
    bodyEn:`## Do you need it?
Flashing is not a cure-all. Try restart, clearing app data and safe mode. If the phone boots, OTA or Smart Switch is safer.

## Prepare files
Download firmware matching model and CSC from a trusted source. Verify the package. Never mix AP files from another model. Back up and remove accounts if wiping.

## Odin
Use a trusted Odin build. Load AP/BL/CP/CSC correctly. Use HOME_CSC only when you want to preserve data. Wait for PASS; do not unplug early.

## After flash
First boot is slow. Verify build, CSC, sensors and network. If it fails, retry a full package before anything else.

## Warnings
Flashing often wipes data and can fail with low battery or an unstable cable. Never flash a device you do not own.`,
  },
  {
    slug:'firmware-sources', category:'software', cover:'firmware',
    titleAr:'كيف تختار ملف Firmware مطابقاً وآمناً؟', titleEn:'How to choose matching, safe firmware',
    excerptAr:'الموديل والمنطقة والاسم الرمزي والإصدار والتحقق من السلامة: قائمة تحقق قبل التنزيل.',
    excerptEn:'Model, region, codename, version and integrity: a pre-download checklist.',
    tags:['Firmware','رومات','تحميل'],
    bodyAr:`## ابدأ من البوابة الرسمية
الشركة المصنعة هي المصدر الأول. إذا لم توفر ملفاً مباشراً، فابحث عن أرشيف موثوق يذكر المصدر بوضوح. لا تثق بروابط مختصرة أو ملفات مرفوعة على مواقع إعلانات.

## طابق خمسة عناصر
1. الموديل التجاري.
2. رقم الموديل (مثل SM-S928B أو CPH1234).
3. المنطقة/CSC.
4. الاسم الرمزي للجهاز.
5. الإصدار ورقم البناء.

اختلاف واحد قد يؤدي إلى جهاز لا يقلع. لا تفلّش بناءً على الاسم التجاري فقط.

## تحقق من السلامة
قارن الحجم وchecksum إن توفر. افحص الحزمة بأداة مكافحة فيروسات. لا تشغّل ملفات exe من مصدر مجهول. استخدم متصفحاً محدثاً وروابط HTTPS.

## احتفظ بنسخة
احتفظ بالملف الأصلي وبنسخة من بياناتك. سجّل الإصدار السابق حتى تستطيع الرجوع إذا لزم. بعض الأجهزة تمنع الرجوع (anti-rollback).

## لا تدفع مقابل «روم مدفوع» مجهول
الرومات الرسمية مجانية عادة. المدفوع قد يكون مجرد إعادة تغليف. إذا دفعت، فاطلب إثبات المصدر والضمان.

## مسؤولية
لا تنزّل أو تفلّش firmware لجهاز لا تملكه أو لا تملك تفويضاً بإصلاحه.`,
    bodyEn:`## Start official
The manufacturer is the first source. If no direct file exists, use a trusted archive that clearly cites its source. Avoid short links and ad-heavy uploads.

## Match five things
1. Marketing model.
2. Model number (e.g., SM-S928B, CPH1234).
3. Region/CSC.
4. Device codename.
5. Version and build number.

One mismatch can brick the phone. Never flash by marketing name alone.

## Integrity
Compare size and checksum when available. Scan the package. Do not run executables from unknown sources. Use HTTPS and an updated browser.

## Keep a copy
Keep the original package and your data. Record the previous version for rollback. Some devices enforce anti-rollback.

## Do not pay for unknown "premium ROMs"
Official firmware is usually free. Paid files may be repackaged. Ask for source proof and warranty.`,
  },
  {
    slug:'android-security', category:'security', featured:true, cover:'security',
    titleAr:'10 إعدادات تحمي هاتف Android فعلياً', titleEn:'10 Android settings that actually protect you',
    excerptAr:'خطوات عملية للحماية اليومية: التحديثات، الأذونات، القفل، التشفير، والنسخ الاحتياطي.',
    excerptEn:'Practical daily protection: updates, permissions, lock screen, encryption and backup.',
    tags:['Android','حماية','خصوصية'],
    bodyAr:`## 1. التحديثات
ثبّت تحديثات النظام والأمن. التحديث يؤخر الثغرات المعروفة؛ لا تؤجله لأشهر. فعّل التحديث التلقائي عبر Wi-Fi.

## 2. قفل قوي
استخدم PIN من 6 أرقام أو أكثر، أو كلمة مرور، مع بصمة كطبقة إضافية. تجنب الأنماط البسيطة. اجعل مهلة القفل قصيرة.

## 3. التحقق بخطوتين
فعّل 2FA على حساب Google وكل حساب مهم. استخدم تطبيق مصادقة أو Passkey بدلاً من SMS عندما يكون ذلك متاحاً.

## 4. راجع الأذونات
افتح إعدادات > الخصوصية > مدير الأذونات. اسحب الموقع والميكروفون والكاميرا من التطبيقات التي لا تحتاجها. راجع «الوصول إلى الاستخدام» و«إمكانية الوصول» بانتظام.

## 5. Play Protect
اترك Play Protect مفعّلاً. لا تثبّت APK من مصادر مجهولة. إذا كنت مضطراً، افحصه في VirusTotal واعرف مطوّره.

## 6. التشفير
الأجهزة الحديثة مشفرة افتراضياً. لا تعطّل التشفير. احمِ نسخك الاحتياطية بكلمة مرور قوية.

## 7. Find My Device
فعّل العثور على جهازي وامسح الجهاز عن بُعد. اختبر الوظيفة قبل أن تحتاجها.

## 8. شبكة آمنة
تجنب Wi-Fi العام للبنوك. استخدم VPN موثوقاً أو شبكة الهاتف. عطّل الاتصال التلقائي بالشبكات المفتوحة.

## 9. نسخ احتياطي
خذ نسخة دورية مشفرة. لا تحتفظ بالنسخة الوحيدة على الهاتف.

## 10. راجع الحسابات
أزل الأجهزة القديمة من حساب Google، وراجع التطبيقات التي تملك وصولاً. أغلق الجلسات غير المعروفة.`,
    bodyEn:`## 1. Updates
Install system and security updates promptly. Enable automatic updates on Wi-Fi.

## 2. Strong lock
Use a 6+ digit PIN or password, with biometrics as an extra layer. Keep lock timeout short.

## 3. Two-factor
Enable 2FA on Google and important accounts. Prefer an authenticator or passkey over SMS where available.

## 4. Permissions
Audit location, microphone, camera, usage access and accessibility. Revoke what is not needed.

## 5. Play Protect
Keep it enabled. Avoid unknown APK sources. If unavoidable, scan and identify the developer.

## 6. Encryption
Modern devices are encrypted by default. Do not disable it. Protect backups with a strong password.

## 7. Find My Device
Enable remote locate and erase, and test it before you need it.

## 8. Network
Avoid public Wi-Fi for banking. Use a trusted VPN or mobile data and disable auto-join.

## 9. Backup
Keep encrypted backups; never rely on the phone as the only copy.

## 10. Account audit
Remove old devices and review third-party access. End unknown sessions.`,
  },
  {
    slug:'account-2fa', category:'security', featured:true, cover:'auth',
    titleAr:'حماية الحسابات: 2FA وPasskeys والصمود أمام SIM Swap', titleEn:'Account protection: 2FA, passkeys and SIM-swap resilience',
    excerptAr:'كيف تحمي حساباتك عندما تصبح الرسائل القصيرة غير كافية؟',
    excerptEn:'How to protect accounts when SMS is no longer enough.',
    tags:['2FA','حسابات','كلمات مرور','SIM Swap'],
    bodyAr:`## كلمة مرور فريدة لكل حساب
استخدم مدير كلمات مرور. لا تعِد استخدام كلمة المرور بين الخدمات. فعّل التنبيهات عند تسجيل الدخول من جهاز جديد.

## اختر 2FA الأقوى
Passkey أو مفتاح أمان مادي هو الأفضل، ثم تطبيق مصادقة (TOTP). الرسائل القصيرة أضعف لأنها عرضة لـ SIM Swap والاعتراض. إذا كان SMS فقط، فاطلب من المشغل قفل SIM بكلمة سر.

## احفظ رموز الاسترداد
احفظ رموز الاسترداد في مكان آمن غير متصل. لا تحفظها في نفس الجهاز. اختبر استرداد الحساب.

## احذر التصيد
لا تدخل كلمة المرور أو رمز 2FA من رابط في رسالة. افتح الموقع يدوياً. لا تشارك رمزاً مع أي شخص، حتى لو قال إنه من الدعم الفني.

## SIM Swap
فعّل قفل SIM/PIN لدى المشغل، وراقب فقدان الشبكة المفاجئ. إذا اختفت الشبكة ثم عادت دون سبب، اتصل بالمشغل فوراً.

## استجابة سريعة
إذا شككت في اختراق: غيّر كلمة المرور من جهاز موثوق، أنهِ الجلسات، راجع الأجهزة، وأبلغ الخدمة. لا تحذف الأدلة قبل الحفظ.`,
    bodyEn:`## Unique passwords
Use a password manager. Never reuse passwords. Enable new-device alerts.

## Strongest 2FA
Passkeys or a hardware key are best, then TOTP authenticator. SMS is weaker due to SIM swap and interception. If SMS is the only option, set a carrier SIM PIN.

## Recovery codes
Store recovery codes offline, separate from the device. Test account recovery.

## Phishing
Never enter credentials or 2FA codes from a message link. Navigate manually. Never share a code, even with "support".

## SIM swap
Set a SIM PIN, watch for sudden signal loss, and contact the carrier if it returns without explanation.

## Respond fast
If compromised: change password from a trusted device, end sessions, review devices and report. Preserve evidence.`,
  },
  {
    slug:'malware-defense', category:'security', cover:'malware',
    titleAr:'كيف تكتشف تطبيقاً خبيثاً على هاتفك؟', titleEn:'How to spot a malicious app on your phone',
    excerptAr:'علامات التحذير، فحص الأذونات، العزل، والإزالة الآمنة دون فقدان بياناتك.',
    excerptEn:'Warning signs, permission audit, isolation and safe removal without losing data.',
    tags:['برمجيات خبيثة','أذونات','Android'],
    bodyAr:`## علامات تحذير
ظهور إعلانات فوق التطبيقات، بطارية تنفد بسرعة غير معتادة، بيانات تتوقف، حرارة أثناء الخمول، اشتراكات لم توافق عليها، أو تطبيق يطلب «إمكانية الوصول» دون سبب. لا تعتمد على علامة واحدة.

## افحص الأذونات
افتح إعدادات > التطبيقات > الأذونات. التطبيق البسيط الذي يطلب SMS أو إمكانية الوصول أو تثبيت تطبيقات أخرى يستحق الشك. راجع «التطبيقات غير المعروفة».

## اعزل قبل الحذف
أوقف اتصال البيانات، وأقلع في الوضع الآمن. إذا اختفت الأعراض، فالتطبيق الخارجي هو السبب. احذف آخر التطبيقات المثبتة. لا تحذف تطبيق نظام.

## الإزالة
أزل التطبيق من الإعدادات. في الحالات العنيدة، أعد ضبط المصنع بعد نسخ احتياطي للصور وجهات الاتصال فقط. لا تستعد تطبيقاً مشبوهاً من نسخة احتياطية.

## بعد الإزالة
غيّر كلمات المرور للحسابات المهمة، راجع الجلسات، وافحص الأجهزة المرتبطة. راقب البنك إن كان التطبيق يملك وصولاً.

## للمختبرين
حلّل عينة APK في بيئة معزولة، وليس على هاتفك الشخصي. استخدم أدوات مثل MobSF للإحصاء الساكن، واعتمد على تفويض قبل أي اختبار.`,
    bodyEn:`## Warning signs
Overlay ads, unexplained battery drain, data spikes, idle heat, unapproved subscriptions, or accessibility access for a simple app. No single sign is proof.

## Audit permissions
Review SMS, accessibility, install-unknown-apps and device admin. Check unknown apps.

## Isolate
Disable data, boot safe mode. If symptoms vanish, a third-party app is involved. Remove recent installs. Never delete system apps.

## Remove
Uninstall from Settings. If stubborn, factory reset after backing up only photos and contacts. Do not restore the suspect app.

## After removal
Change important passwords, review sessions and linked devices, and monitor banking if exposed.

## For analysts
Analyze APK samples in an isolated lab, never on your daily phone. Use tools such as MobSF for static triage, with authorization.`,
  },
  {
    slug:'wifi-security', category:'security', cover:'wifi',
    titleAr:'أمن Wi-Fi: إعدادات الراوتر وحماية الأجهزة', titleEn:'Wi-Fi security: router and device hardening',
    excerptAr:'WPA3، تحديث الراوتر، شبكة ضيوف، وDNS موثوق. خطوات تقلل الهجمات على شبكتك.',
    excerptEn:'WPA3, router updates, guest network and trusted DNS. Steps that reduce attacks.',
    tags:['Wi-Fi','شبكات','راوتر'],
    bodyAr:`## غيّر الافتراضيات
غيّر كلمة مرور لوحة الراوتر واسم الشبكة الافتراضي. لا تستخدم اسم عائلتك أو رقم هاتفك. عطّل WPS وUPnP إن لم تحتجهما. عطّل إدارة الراوتر من الإنترنت.

## استخدم WPA3
اختر WPA3 أو WPA2/WPA3 Mixed. تجنب WEP وWPA القديم. كلمة المرور طويلة وفريدة. لا تشاركها في مجموعات مفتوحة.

## حدّث الراوتر
ثبّت تحديثات firmware من موقع الشركة. إذا انتهى دعم الراوتر، استبدله. راقب الأجهزة المتصلة بانتظام.

## شبكة ضيوف
افصل الضيوف والأجهزة الذكية في شبكة ضيوف معزولة. لا تمنحهم وصولاً إلى أجهزة الشبكة الرئيسية.

## DNS وHTTPS
استخدم DNS موثوقاً (مثل Cloudflare أو Google) إن أردت. فعّل HTTPS-only في المتصفح. VPN موثوق للشبكات العامة.

## للأجهزة المحمولة
أوقف الاتصال التلقائي بالشبكات المفتوحة، وامسح الشبكات القديمة. عند استخدام شبكة عامة، تجنب الخدمات الحساسة أو استخدم بيانات الهاتف.

## إذا شككت
غيّر كلمة مرور Wi-Fi وكلمة مرور الراوتر، وأعد تشغيله، وافحص الأجهزة الجديدة. راقب السجلات إن كانت متاحة.`,
    bodyEn:`## Change defaults
Change the admin password and SSID. Do not use family names or phone numbers. Disable WPS and UPnP if unused. Disable remote administration.

## Use WPA3
Choose WPA3 or WPA2/WPA3 mixed. Avoid WEP and legacy WPA. Use a long unique passphrase.

## Update
Install router firmware from the vendor. Replace unsupported routers. Review connected devices regularly.

## Guest network
Isolate guests and smart devices on a guest network. Do not give them access to main devices.

## DNS and HTTPS
Use trusted DNS if desired. Enable HTTPS-only mode. Use a trusted VPN on public networks.

## Mobile devices
Disable auto-join for open networks and forget old ones. Avoid sensitive services on public Wi-Fi or use mobile data.

## If suspicious
Change Wi-Fi and admin passwords, reboot, inspect new devices and review logs.`,
  },
  {
    slug:'otp-phishing', category:'security', cover:'phish',
    titleAr:'لا تشارك رمز OTP: سيناريوهات احتيال شائعة', titleEn:'Never share an OTP: common fraud scenarios',
    excerptAr:'انتحال الدعم الفني، استنساخ واتساب، ورسائل الشحن. كيف تتحقق وتحمي حساباتك؟',
    excerptEn:'Fake support, WhatsApp cloning and delivery scams. How to verify and protect accounts.',
    tags:['تصيد','OTP','واتساب','احتيال'],
    bodyAr:`## القاعدة الأساسية
رمز OTP مفتاح حسابك. لا تشاركه مع أي شخص، بما في ذلك من يقول إنه من الشركة أو البنك أو الدعم. الشركة لا تطلب الرمز عبر مكالمة أو واتساب.

## انتحال الدعم
قد يستخدم المهاجم صورة شعار ورقماً مزيفاً ويقول إن جهازك مخترق. لا تثبّت تطبيقاً بناءً على مكالمة. لا تمنح «إمكانية الوصول». أغلق المكالمة واتصل بالرقم الرسمي بنفسك.

## استنساخ واتساب
إذا وصلت رسالة «رمز التحقق» دون طلب، فلا تشاركه. فعّل التحقق بخطوتين في واتساب، وقيّد من يمكنه إضافتك للمجموعات. راجع الأجهزة المرتبطة.

## رسائل الشحن والجوائز
الروابط القصيرة قد تنقل إلى صفحات تسجيل دخول مزيفة. لا تدخل بياناتك. تتبع الشحنة من موقع الشركة الرسمي.

## إذا وقعت في الفخ
غيّر كلمة المرور فوراً، أنهِ الجلسات، وأبلغ الخدمة. راقب الحساب البنكي. لا تحذف المحادثات قبل حفظها كدليل.

## توعية
علّم من حولك أن OTP لا يُشارك أبداً. الاحتيال يعتمد على الاستعجال والخوف؛ خذ وقتك وتحقق.`,
    bodyEn:`## The rule
An OTP is the key to your account. Never share it with anyone, including "support", your bank or a company. They will not ask for it.

## Fake support
Attackers spoof logos and numbers and claim your device is hacked. Do not install apps from a call or grant accessibility. Hang up and call the official number.

## WhatsApp cloning
If a verification code arrives unexpectedly, do not share it. Enable two-step verification, restrict group adds and review linked devices.

## Delivery and prize scams
Short links may lead to fake login pages. Enter nothing. Track shipments on the official site.

## If tricked
Change passwords, end sessions, report to the provider and monitor banking. Preserve evidence.

## Awareness
Teach others that OTPs are never shared. Fraud depends on urgency and fear; slow down and verify.`,
  },
  {
    slug:'backup-restore', category:'guides', cover:'backup',
    titleAr:'النسخ الاحتياطي قبل الصيانة: خطة 3-2-1', titleEn:'Backup before repair: the 3-2-1 plan',
    excerptAr:'ماذا تنسخ؟ أين تحفظه؟ وكيف تختبر الاستعادة قبل أن تحتاجها؟',
    excerptEn:'What to copy, where to keep it, and how to test restore before you need it.',
    tags:['نسخ احتياطي','بيانات','صيانة'],
    bodyAr:`## قبل أي صيانة
اسأل: هل البيانات قابلة للاستعادة؟ الشاشة المكسورة قد تمنع اللمس؛ استخدم كابل OTG أو خدمة سحابية أو أداة رسمية. لا تعتمد على أن الجهاز سيعمل بعد الإصلاح.

## ماذا تنسخ؟
جهات الاتصال، الصور، الرسائل المهمة، المصادقة الثنائية، محفظة المفاتيح، إعدادات التطبيقات، وملفات العمل. لا تنسَ رموز الاسترداد للحسابات.

## خطة 3-2-1
احتفظ بثلاث نسخ، على وسيطين مختلفين، ونسخة خارج الموقع. مثال: هاتف + كمبيوتر + سحابة مشفرة. لا تضع كل النسخ على نفس الجهاز.

## التشفير
استخدم نسخة مشفرة بكلمة مرور قوية. احفظ كلمة المرور في مكان منفصل. النسخة غير المشفرة على قرص قد تكون خطراً.

## اختبر الاستعادة
استعد ملفاً واحداً على جهاز آخر للتأكد. النسخة التي لم تُختبر ليست نسخة موثوقة. تحقق من تواريخ الملفات وحجمها.

## بعد الصيانة
امسح الجهاز القديم إذا بعته، وفعّل المصادقة على الحسابات. راجع الأجهزة المرتبطة وأزل غير المستخدم.`,
    bodyEn:`## Before repair
Ask whether data is recoverable. A broken touchscreen may block access; use OTG, cloud or an official tool. Do not assume the phone will boot after repair.

## What to copy
Contacts, photos, important messages, 2FA, password manager, app settings and work files. Include account recovery codes.

## 3-2-1
Three copies, two media types, one off-site. Example: phone, computer and encrypted cloud. Never keep every copy on one device.

## Encryption
Use an encrypted backup with a strong password stored separately. An unencrypted disk backup is a risk.

## Test restore
Restore one file to another device. An untested backup is not a backup. Verify dates and sizes.

## After service
Wipe a device before selling and re-enable account protection. Review and remove unused linked devices.`,
  },
  {
    slug:'pentest-ethics', category:'security', cover:'ethics',
    titleAr:'اختبار الاختراق المصرح به: الحدود والقواعد', titleEn:'Authorized penetration testing: boundaries and rules',
    excerptAr:'التفويض المكتوب، تحديد النطاق، حماية البيانات، والتقرير المسؤول. تعلم دون تجاوز القانون.',
    excerptEn:'Written authorization, scope, data protection and responsible reporting. Learn without breaking the law.',
    tags:['اختبار اختراق','أخلاقيات','قانون'],
    bodyAr:`## التفويض أولاً
لا تختبر نظاماً لا تملكه أو لا تملك تفويضاً كتابياً صريحاً بذلك. يجب أن يحدد التفويض الأصول والنطاق والتوقيت والاتصال وجهة الطوارئ. الموافقة الشفهية لا تكفي في معظم الحالات.

## النطاق
حدد الأجهزة والشبكات والتطبيقات المسموح بها، وما هو خارج النطاق. لا توسع النطاق أثناء العمل دون موافقة. استخدم بيئة اختبار معزولة عندما تتعلم.

## حماية البيانات
قد تصل إلى بيانات حساسة. لا تنسخها أو تنشرها. استخدم أقل قدر من الوصول، وشفر النتائج، وأتلف البيانات بعد التقرير.

## المنهجية المسؤولة
اجمع المعلومات، حلل السطح، اختبر بتحكم، ووثّق الأدلة. لا تستخدم هجمات تخريبية أو حجب خدمة. توقف عند اكتشاف بيانات شخصية أو ضرر محتمل.

## الإبلاغ
اكتب تقريراً واضحاً: الملخص، الخطورة، خطوات الاستغلال (بما يكفي للإصلاح)، الأدلة، والإصلاح المقترح. أبلغ المالك قبل النشر.

## التعلم الآمن
استخدم مختبرات افتراضية وأجهزة تملكها. اقرأ القوانين المحلية. الشهادة والتفويض لا يبرران الوصول غير المصرح به.`,
    bodyEn:`## Authorization first
Never test a system you do not own without explicit written permission. The authorization should define assets, scope, timing, contacts and emergency procedures. Verbal consent is usually not enough.

## Scope
Define allowed devices, networks and applications, and what is out of scope. Do not expand scope without approval. Use isolated labs for learning.

## Data protection
You may encounter sensitive data. Do not copy or publish it. Use least access, encrypt findings and destroy data after reporting.

## Responsible method
Recon, analyze, test with control, document evidence. Do not use destructive or denial-of-service attacks. Stop on personal data or likely harm.

## Reporting
Write a clear report: summary, severity, reproduction (enough to fix), evidence and remediation. Notify the owner before publication.

## Safe learning
Use virtual labs and devices you own. Read local laws. Certification or authorization never justifies unauthorized access.`,
  },
  {
    slug:'repair-tools', category:'guides', cover:'tools',
    titleAr:'أدوات الفني الأساسية: ما تحتاجه فعلاً', titleEn:'Essential technician tools: what you actually need',
    excerptAr:'قائمة أدوات للمبتدئ والمحترف، مع أولويات الشراء وتجنب الأدوات التي تضر أكثر مما تنفع.',
    excerptEn:'A tool list for beginners and pros, with buying priorities and tools that do more harm than good.',
    tags:['أدوات','صيانة','ورشة'],
    bodyAr:`## البداية
مفكات دقيقة مغناطيسية، كأس شفط، أدوات فتح بلاستيكية، ملقط، فرشاة، وسوار مضاد للكهرباء. لا تبدأ بأدوات رخيصة جداً؛ الرؤوس التالفة تدمر البراغي.

## القياس
مقياس متعدد جيد ومقياس USB للتيار. هذان يختصران ساعات من التخمين. تعلم قراءة الجهد والاستمرارية والتماس.

## الحرارة
وسادة أو مسدس حراري بتحكم، ليس مجفف شعر. الحرارة الزائدة تلف الشاشة والبطارية. استخدم مقياس حرارة إن أمكن.

## اللوحة
محطة لحام، ميكروسكوب، تدفق لحام، وقصدير. لا تبدأ بأعمال اللوحة قبل التدريب على أجهزة قديمة. التلف في اللوحة مكلف.

## البرمجيات
استخدم أدوات رسمية حيث أمكن. احتفظ بنسخة من التعريفات والأدوات. افحص أي أداة بماسح فيروسات. لا تشغّل أدوات مقرصنة.

## التنظيم
صنّف البراغي، صوّر أثناء الفك، وسمّ الكابلات. سجل كل جهاز ورقم تذكرة. النظافة والتنظيم يقللان الأخطاء.

## ما لا تحتاجه
مجفف شعر ساخن، إبر معدنية، لاصق عشوائي، بطاريات رخيصة مجهولة، وبرامج تجاوز الحماية.`,
    bodyEn:`## Starting kit
Precision magnetic screwdrivers, suction cup, plastic picks, tweezers, brush and anti-static strap. Avoid very cheap bits; stripped heads damage screws.

## Measurement
A good multimeter and USB power meter save hours of guessing. Learn voltage, continuity and short detection.

## Heat
A controlled heating mat or heat gun, not a hair dryer. Excess heat damages displays and batteries.

## Board work
Soldering station, microscope, flux and solder. Do not start board work before practicing on scrap devices.

## Software
Use official tools where possible. Keep installers and drivers. Scan every tool. Never run cracked software.

## Organization
Sort screws, photograph disassembly and label cables. Log each device and ticket. Cleanliness reduces mistakes.

## Avoid
Hot hair dryers, metal needles, random glue, unknown batteries and lock-bypass software.`,
  },
  {
    slug:'overheating', category:'maintenance', cover:'heat',
    titleAr:'الهاتف يسخن: الأسباب والفحص الآمن', titleEn:'Phone overheating: causes and safe diagnosis',
    excerptAr:'حرارة أثناء الشحن أو اللعب أو الخمول. كيف تفرق بين السلوك الطبيعي والعطل؟',
    excerptEn:'Heat while charging, gaming or idle. How to distinguish normal behavior from a fault.',
    tags:['حرارة','بطارية','أداء'],
    bodyAr:`## طبيعي أم عطل؟
الحرارة المعتدلة أثناء الشحن السريع أو الألعاب طبيعية. الحرارة العالية أثناء الخمول، أو سخونة مكانية محددة قرب الكاميرا أو منفذ الشحن، تستدعي الفحص. راقب الحرارة بعد إغلاق كل التطبيقات.

## الأسباب الشائعة
تطبيق في الخلفية، شاحن غير معتمد، بطارية متدهورة، غبار في المنفذ، لعبة ثقيلة، أو ضوء شمس مباشر. ابدأ بالأسهل: أغلق التطبيقات، جرّب شاحناً آخر، وانزع الحافظة.

## التشخيص
افحص استهلاك البطارية حسب التطبيق. أقلع في الوضع الآمن. راقب التيار أثناء الشحن. إذا بقيت الحرارة مع إيقاف الشحن، فقد يكون هناك تسريب في اللوحة أو بطارية.

## البطارية
البطارية المنتفخة أو الساخنة خطر. لا تستمر في استخدامها. أوقف الشحن وافحصها. استبدلها بقطعة موثوقة.

## الوقاية
لا تشحن تحت الوسادة، تجنب الحرارة المباشرة، استخدم شاحناً معتمداً، ونظف المنفذ. لا تستخدم التبريد المفاجئ (ثلج) على جهاز ساخن.

## متى تتوقف؟
إذا ظهرت رائحة، دخان، أو انتفاخ، أوقف الاستخدام واعزل الجهاز في مكان آمن. لا تحاول فتح بطارية منتفخة.`,
    bodyEn:`## Normal or fault?
Moderate heat during fast charging or gaming is normal. High idle heat, or a hot spot near the camera or charging port, needs inspection.

## Common causes
Background apps, uncertified chargers, degraded battery, lint in the port, heavy games or direct sun. Start simple: close apps, try another charger, remove the case.

## Diagnosis
Check battery use by app, boot safe mode, measure charging current. Heat while not charging may indicate a board leak or battery issue.

## Battery
A swollen or hot battery is dangerous. Stop using it, disconnect charging and replace with a trusted part.

## Prevention
Do not charge under a pillow, avoid direct heat, use certified chargers and clean the port. Never apply ice to a hot phone.

## Stop if
You see odor, smoke or swelling. Isolate the device and do not open a swollen battery.`,
  },
  {
    slug:'touch-issues', category:'maintenance', cover:'touch',
    titleAr:'اللمس لا يستجيب: تشخيص البصمة والكابل والشاشة', titleEn:'Touch not responding: digitizer, cable and panel diagnosis',
    excerptAr:'هل العطل في الحماية أم الكابل أم الشاشة؟ اختبارات مرتبة قبل الاستبدال.',
    excerptEn:'Is it the protector, cable or panel? Ordered tests before replacement.',
    tags:['لمس','شاشة','تشخيص'],
    bodyAr:`## ابدأ بالسطح
أزل واقي الشاشة والجراب. نظف الشاشة بقطعة ناعمة. جرّب اللمس في مناطق مختلفة. إذا كان العطل في منطقة محددة، فقد يكون ضغطاً أو تلفاً موضعياً. لا تستخدم الماء.

## الحماية
بعض واقيات الشاشة الرخيصة تقلل الحساسية. جرّب بدونها. إذا عاد اللمس، فالمشكلة في الواقي.

## إعادة التشغيل والوضع الآمن
أعد التشغيل. إذا كان العطل يظهر مع تطبيق معين، فقد يكون التطبيق. في الوضع الآمن، إذا عمل اللمس، فابحث عن تطبيق يستهلك الموارد.

## الكابل والموصل
إذا كان اللمس متقطعاً أو يظهر شريط، فقد يكون كابل الشاشة غير مثبت. افصل البطارية وأعد توصيل الكابل. افحص التآكل. لا تضغط بقوة.

## الشاشة
إذا كانت الصورة سليمة واللمس لا يعمل، فقد يكون الديجيتال أو طبقة اللمس. إذا كانت الصورة واللمس معاً لا يعملان، فافحص كابل الشاشة واللوحة.

## بعد الاستبدال
اختبر اللمس في كل الشاشة، الحواف، والزوايا. اختبر اللمس المتعدد إن أمكن. لا تغلق الجهاز قبل الاختبار.`,
    bodyEn:`## Start at the surface
Remove the screen protector and case. Clean gently. Test touch in different areas. A specific dead zone may indicate pressure or local damage. Do not use water.

## Protector
Cheap protectors can reduce sensitivity. Test without one.

## Restart and safe mode
Restart. If the issue appears with one app, suspect the app. In safe mode, if touch works, look for a resource-heavy app.

## Cable and connector
Intermittent touch or a stripe suggests a loose display flex. Disconnect the battery and reseat it. Inspect corrosion; do not force it.

## Panel
If the image is fine but touch fails, the digitizer may be faulty. If both fail, inspect the display flex and board.

## After replacement
Test the full surface, edges and corners, and multi-touch where supported. Seal only after testing.`,
  },
  {
    slug:'price-guide', category:'prices', cover:'pricing',
    titleAr:'كيف تُسعّر الشاشات وقطع الغيار بعدل؟', titleEn:'How to price screens and parts fairly',
    excerptAr:'منهجية تسعير شفافة تشمل الجودة والمورد والتركيب والضمان، وتحديث الأسعار دون تضليل.',
    excerptEn:'A transparent pricing method covering grade, supplier, installation and warranty.',
    tags:['أسعار','شاشات','قطع غيار','موردين'],
    bodyAr:`## السعر ليس رقماً واحداً
السعر العادل يبدأ من تكلفة القطعة، يضاف إليها التركيب والمخاطرة والضمان. الشاشة الأصلية تختلف عن التجارية، والمدينة تؤثر في التوريد. لا تقارن سعرين دون معرفة الجودة والضمان.

## مكونات السعر
- سعر القطعة من المورد.
- سعر التركيب (وقت الفني والمخاطرة).
- الضمان ومدة الاستبدال.
- تكلفة الشحن والجمارك إن وجدت.
- هامش تشغيل معقول.

## شفافية البيانات
كل سعر في المنصة يجب أن يرتبط بمدينة ومورد وتاريخ تحديث وحالة توفر. الأسعار القديمة تُوسم بتاريخها ولا تُعرض كأنها حديثة. إذا لم يوجد سعر موثق، نعرض «غير متوفر» بدلاً من رقم وهمي.

## الموردون
تحقق من هوية المورد، سجل الاستبدال، وضمان الدفعة. اطلب عينة قبل الطلب الكبير. وثّق الاتفاق. لا تبنِ سمعة على قطعة مجهولة.

## العملات
أدخل السعر بالعملة الأصلية (YER/SAR/USD). لا تحوّل تلقائياً دون سعر صرف محدد من الإدارة. اعرض العملة بوضوح.

## التحديث
راجع الأسعار دورياً، خاصة الشاشات سريعة التغير. أرشف السعر القديم. أبلغ العميل بأي تغيير قبل بدء الإصلاح.

## الخلاصة
السعر العادل يبني الثقة. الرخص غير المبرر يضر بالجودة، والمبالغة تضر بالسمعة.`,
    bodyEn:`## Price is not one number
A fair price starts with part cost, then installation, risk and warranty. Genuine and aftermarket panels differ, and city affects supply. Never compare prices without grade and warranty.

## Components
- Supplier part cost.
- Installation labor and risk.
- Warranty and replacement term.
- Shipping and customs where applicable.
- Reasonable operating margin.

## Data transparency
Every price must carry city, supplier, update date and availability. Old prices are dated and never presented as current. If no verified price exists, show "unavailable", not a fabricated number.

## Suppliers
Verify identity, return history and batch warranty. Order a sample before bulk. Document the agreement. Do not build a reputation on unknown parts.

## Currencies
Enter the original currency (YER/SAR/USD). Do not auto-convert without an admin-defined rate. Display the currency clearly.

## Updates
Review prices regularly, especially displays. Archive the old price. Tell the customer before work begins.

## Bottom line
Fair pricing builds trust. Unjustified cheapness hurts quality; overpricing hurts reputation.`,
  },
]

// Normalise article fields used by the UI
for (const a of articles) {
  a.readMinutes = Math.max(3, Math.round((a.bodyAr.length + a.bodyEn.length) / 2200))
  a.published_at = '2026-10-01'
  a.status = 'published'
}
const content = { settings, brands, services, tools, firmwareSources, securityModules, faqs, articles, dataSources: [
  { name:'GSMArena', url:'https://www.gsmarena.com/', note:'المواصفات الأساسية وروابط الصور ونماذج الأجهزة.' },
  { name:'ipsw.me API', url:'https://ipsw.me/', note:'ملفات iOS الموقعة الواردة في قسم Firmware.' },
  { name:'sksalapur/gsmarena-scraper', url:'https://github.com/sksalapur/gsmarena-scraper', note:'مجموعة بيانات GSMArena مرخصة MIT (2026-04).' },
  { name:'rinehartwang1979/phone-specs-api', url:'https://github.com/rinehartwang1979/phone-specs-api', note:'إثراء أنواع الشاشات والأسعار المرجعية لبعض الموديلات.' },
  { name:'foykes/gsm-arena-dataset', url:'https://github.com/foykes/gsm-arena-dataset', note:'بيانات موديلات 2018–2021 مع نوع الشاشة والبطارية.' },
] }
writeFileSync(join(root, 'data', 'content.json'), JSON.stringify(content, null, 1))
console.log('content', { articles: articles.length, services: services.length, tools: tools.length, brands: brands.length, firmwareSources: firmwareSources.length })
