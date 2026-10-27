import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react'
import { useStore } from '../lib/store'
import { useSeo } from '../lib/hooks'
import { Badge, PageHero } from '../components/ui'

interface Section { title: string; paragraphs: string[]; list?: string[] }
interface LegalCopy { title: string; lead: string; updated: string; sections: Section[] }

function LegalPage({ copy, eyebrow, icon }: { copy: LegalCopy; eyebrow: string; icon: React.ReactNode }) {
  const { lang, t } = useStore()
  useSeo(copy.title, copy.lead)
  return (
    <>
      <PageHero eyebrow={eyebrow} title={copy.title} lead={copy.lead} icon={icon} meta={<><Badge tone="muted">{t('legal.updated')}: {copy.updated}</Badge><Badge tone="lime">{t('legal.plain')}</Badge></>} />
      <div className="container page-body legal-body">
        <div className="legal-grid">
          <aside className="legal-toc">
            <strong>{t('legal.contents')}</strong>
            {copy.sections.map((s, i) => <a key={i} href={`#legal-${i}`}>{s.title}</a>)}
            <div className="legal-contact"><span>{t('legal.questions')}</span><Link to="/contact" className="text-link">{t('nav.contact')} <ArrowLeft size={13} /></Link></div>
          </aside>
          <article className="legal-content">
            {copy.sections.map((s, i) => (
              <section key={i} id={`legal-${i}`}>
                <span className="legal-num">{String(i + 1).padStart(2, '0')}</span>
                <h2>{s.title}</h2>
                {s.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
                {s.list && <ul>{s.list.map(item => <li key={item}>{item}</li>)}</ul>}
              </section>
            ))}
            <p className="fineprint">{lang === 'ar' ? 'هذه الصياغة مبسطة وليست استشارة قانونية. تُحدّث عند تغير الخدمة أو المتطلبات.' : 'This wording is simplified and is not legal advice. It is updated when the service or requirements change.'}</p>
          </article>
        </div>
      </div>
    </>
  )
}

const privacyAr: LegalCopy = {
  title: 'سياسة الخصوصية', lead: 'ما نجمعه، وأين يُخزَّن، وكيف تتحكم به — بلا وعود فضفاضة.', updated: '26 أكتوبر 2026',
  sections: [
    { title: 'لا حساب سحابي ولا خادم للمستخدمين', paragraphs: ['brxvih موقع ثابت يعمل في متصفحك. لا يوجد تسجيل دخول للمستخدمين، ولا نرسل بياناتك إلى خادم تابع لنا. طلبات الصيانة التي تنشئها تُحفظ في قاعدة بيانات المتصفح (IndexedDB) على جهازك.', 'لأن الطلب محلي، فإن مسح بيانات المتصفح أو تغيير الجهاز يفقد الطلب. أرسل نسخة واتساب واحتفظ برقم التذكرة.'] },
    { title: 'بيانات تُحفظ على جهازك', paragraphs: ['نحفظ محليًا: لغة الواجهة، السمة، طلباتك، وحالة جلسة لوحة التحكم. لوحة التحكم محلية أيضًا ومحمية برقم PIN مخزّن كتجزئة SHA-256 مع ملح عشوائي، وليست مصادقة خادم متعدد المستخدمين.'], list: ['localStorage: اللغة، السمة، جلسة الإدارة.', 'sessionStorage: فتح لوحة التحكم خلال الجلسة.', 'IndexedDB: بيانات الكتالوج والطلبات والملفات التي ترفعها إداريًا.', 'Cache Storage: ملفات التطبيق للعمل دون اتصال.'] },
    { title: 'واتساب والاتصال', paragraphs: ['عند الضغط على إرسال واتساب، يفتح تطبيق أو موقع واتساب برسالة تحتوي بيانات الطلب التي كتبتها. تخضع تلك المحادثة لسياسة واتساب، وليست مخزنة في الموقع.', 'الاتصال الهاتفي يستخدم تطبيق الهاتف في جهازك.'] },
    { title: 'ملفات خارجية وخطوط', paragraphs: ['قد تُحمّل خطوط Google Fonts وصور من Wikimedia Commons أو مواقع الشركات عند العرض. هذه الطلبات تكشف عنوان IP للمزوّد وفق سياساته. لا نستخدم تحليلات إعلانية أو ملفات تتبع تسويقية في هذه النسخة.'] },
    { title: 'حقوقك والتحكم', paragraphs: ['يمكنك حذف طلب من لوحة التحكم المحلية، أو مسح بيانات الموقع من إعدادات المتصفح. للتصحيح أو طلب حذف نسخة أرسلتها عبر واتساب، راسلنا على الرقم الظاهر.', 'لا نطلب بيانات حساسة مثل كلمات المرور أو رموز OTP أو صور هوية. لا ترسلها عبر النموذج أو واتساب.'] },
    { title: 'الأطفال والاحتفاظ', paragraphs: ['الخدمة موجّهة للفنيين والمستخدمين البالغين. لا نجمع بيانات أطفال عمدًا. نحتفظ بالطلبات المحلية حتى تحذفها أو تمسح بيانات المتصفح.'] },
  ],
}

const privacyEn: LegalCopy = {
  title: 'Privacy policy', lead: 'What we collect, where it is stored, and how you control it — without vague promises.', updated: '26 October 2026',
  sections: [
    { title: 'No cloud account and no user server', paragraphs: ['brxvih is a static site that runs in your browser. There is no user login and we do not send your data to a server operated by us. Repair requests you create are stored in the browser database (IndexedDB) on your device.', 'Because the request is local, clearing browser data or changing devices loses it. Send a WhatsApp copy and keep the ticket number.'] },
    { title: 'Data stored on your device', paragraphs: ['We store locally: interface language, theme, your requests, and the admin session state. The admin dashboard is local too, protected by a PIN stored as a salted SHA-256 hash. It is not multi-user server authentication.'], list: ['localStorage: language, theme, admin session.', 'sessionStorage: dashboard unlock during the session.', 'IndexedDB: catalogue data, requests, and admin-uploaded files.', 'Cache Storage: app files for offline use.'] },
    { title: 'WhatsApp and calls', paragraphs: ['When you press send on WhatsApp, WhatsApp opens with a message containing the request details you wrote. That conversation is governed by WhatsApp’s policy and is not stored on this site.', 'Phone calls use your device’s phone app.'] },
    { title: 'External files and fonts', paragraphs: ['Google Fonts and images from Wikimedia Commons or manufacturer sites may load when displayed. Those requests expose your IP address to the provider under its policies. We do not use advertising analytics or marketing trackers in this version.'] },
    { title: 'Your rights and control', paragraphs: ['You can delete a request from the local dashboard or clear site data in your browser settings. For corrections or deletion of a copy you sent via WhatsApp, contact the number shown.', 'We never need passwords, OTP codes, or ID photos. Do not send them through the form or WhatsApp.'] },
    { title: 'Children and retention', paragraphs: ['The service is intended for technicians and adult users. We do not knowingly collect children’s data. Local requests remain until you delete them or clear browser data.'] },
  ],
}

const termsAr: LegalCopy = {
  title: 'شروط الاستخدام', lead: 'حدود الخدمة، مسؤوليات الطرفين، وسياسة الأسعار والضمان — بوضوح.', updated: '26 أكتوبر 2026',
  sections: [
    { title: 'طبيعة المحتوى', paragraphs: ['brxvih مرجع تقني ومنصة طلب خدمة. المعلومات والمواصفات والأسعار تُعرض لأغراض المعلومات والتنسيق، وقد تتغير أو تحتوي خطأً. لا تُعد الأسعار عرضًا ملزمًا حتى يؤكدها فريق الخدمة كتابيًا.'] },
    { title: 'الملكية والتصريح', paragraphs: ['لا نخدم جهازًا إلا إذا أكدت ملكيته أو حيازتك المشروعة وتصريحك بإصلاحه. نحتفظ بحق رفض أي طلب دون تفسير، خصوصًا عند الاشتباه بسرقة أو احتيال.'] },
    { title: 'الخدمات غير المتاحة', paragraphs: ['لا نقدم تغيير IMEI، تجاوز FRP أو iCloud، فك قفل ملكية، اختراق حسابات، أو أي عمل غير قانوني. الطلبات من هذا النوع تُرفض.'], list: ['لا نضمن استعادة بيانات لم تُنسخ مسبقًا.', 'لا نضمن نتيجة إصلاح عتاد متضرر مائيًا أو كهربائيًا بشكل كامل.', 'قد يؤدي التفليش أو فتح الجهاز إلى فقدان بيانات أو ضمان الشركة.'] },
    { title: 'الأسعار والدفع', paragraphs: ['الأسعار الموثّقة فقط تُعرض كأرقام. غيرها يبقى «عند الطلب». بعد الفحص نرسل نطاق سعر وخيارات جودة، ولا يبدأ العمل المدفوع دون موافقتك. أي تغيير في النطاق يتطلب موافقة جديدة.', 'قد تختلف الأسعار حسب المدينة والمورد وتوفر القطعة وسعر الصرف. تحويل العملات استرشادي.'] },
    { title: 'الضمان والمسؤولية', paragraphs: ['الضمان يقتصر على التركيب ويُحدد في التذكرة. لا يغطي الكسر أو الماء أو فتح الجهاز لدى طرف آخر أو سوء الاستخدام. المسؤولية محدودة بقيمة الخدمة المدفوعة، ولا تشمل الأضرار غير المباشرة أو فقدان الأرباح.', 'أنت مسؤول عن النسخ الاحتياطي وعن إزالة الحسابات الحساسة قبل التسليم عند الحاجة.'] },
    { title: 'الملكية الفكرية والاستخدام', paragraphs: ['العلامات التجارية مملوكة لأصحابها. بيانات المواصفات مستمدة من مصادر مجتمعية ورسمية مع حفظ روابط المصادر، وتخضع لشروط كل مصدر. صور Wikimedia تخضع لترخيصها المعلن.', 'لا يجوز إعادة نشر قاعدة البيانات كمنتج تجاري دون مراجعة تراخيص المصادر الأصلية. الاقتباس مع الإشارة إلى brxvih والمصدر مسموح.'] },
    { title: 'التعديلات والقانون', paragraphs: ['قد نحدّث هذه الشروط مع تغير الخدمة. استمرارك في الاستخدام يعني قبول النسخة المنشورة. تُفسَّر الشروط وفق القوانين المعمول بها في اليمن، مع السعي لحل ودي قبل أي إجراء.'] },
  ],
}

const termsEn: LegalCopy = {
  title: 'Terms of use', lead: 'Service boundaries, responsibilities, and the pricing and warranty policy — clearly.', updated: '26 October 2026',
  sections: [
    { title: 'Nature of the content', paragraphs: ['brxvih is a technical reference and service-request platform. Information, specifications, and prices are shown for information and coordination. They may change or contain errors. A price is not a binding offer until the service team confirms it in writing.'] },
    { title: 'Ownership and authorization', paragraphs: ['We only service a device after you confirm ownership or lawful possession and authorize repair. We may refuse any request, especially where theft or fraud is suspected.'] },
    { title: 'Services not offered', paragraphs: ['We do not offer IMEI changes, FRP or iCloud bypass, ownership-lock removal, account hacking, or any unlawful work. Such requests are refused.'], list: ['We cannot guarantee recovery of data that was not backed up.', 'We cannot guarantee full repair of liquid- or electrically-damaged hardware.', 'Flashing or opening a device may cause data loss or void the manufacturer warranty.'] },
    { title: 'Prices and payment', paragraphs: ['Only verified prices are shown as numbers. Others remain “on request”. After diagnosis we send a price range and quality options, and paid work does not start without your approval. Any change in scope requires fresh approval.', 'Prices may vary by city, supplier, part availability, and exchange rate. Currency conversion is indicative.'] },
    { title: 'Warranty and liability', paragraphs: ['Warranty is limited to installation and is stated on the ticket. It excludes drops, liquid, third-party opening, or misuse. Liability is limited to the amount paid for the service and excludes indirect damages or lost profits.', 'You are responsible for backups and for removing sensitive accounts before handover where needed.'] },
    { title: 'Intellectual property and use', paragraphs: ['Trademarks belong to their owners. Specification data is derived from community and official sources with source links preserved, and remains subject to each source’s terms. Wikimedia images remain under their stated licenses.', 'Do not republish the database as a commercial product without reviewing the original source licenses. Quotation with attribution to brxvih and the source is permitted.'] },
    { title: 'Changes and law', paragraphs: ['We may update these terms as the service changes. Continued use means acceptance of the published version. These terms are interpreted under applicable law in Yemen, with an attempt at amicable resolution first.'] },
  ],
}

export function Privacy() {
  const { lang } = useStore()
  return <LegalPage copy={lang === 'ar' ? privacyAr : privacyEn} eyebrow={lang === 'ar' ? 'ثقة' : 'Trust'} icon={<ShieldCheck size={26} />} />
}

export function Terms() {
  const { lang } = useStore()
  return <LegalPage copy={lang === 'ar' ? termsAr : termsEn} eyebrow={lang === 'ar' ? 'اتفاق واضح' : 'Clear agreement'} icon={<FileText size={26} />} />
}
