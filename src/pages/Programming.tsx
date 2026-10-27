import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowUpLeft, CheckCircle2, Code2, DatabaseBackup, HardDriveDownload,
  KeyRound, Laptop, MessageCircle, ShieldCheck, Smartphone, Terminal, XCircle,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { useSeo } from '../lib/hooks'
import { Badge, PageHero, SectionHeader } from '../components/ui'
import { whatsappLink } from '../lib/utils'

export default function Programming() {
  const { t, lang } = useStore()
  useSeo(t('prog.title'), t('prog.lead'))
  const ar = lang === 'ar'

  const services = [
    { icon: Terminal, title: ar ? 'إصلاح النظام' : 'System repair', desc: ar ? 'معالجة التوقف عند الشعار، أخطاء التحديث، وتعطل التطبيقات الأساسية بإجراءات رسمية.' : 'Fixing boot loops, update errors, and core app failures with official procedures.', tag: 'software' },
    { icon: HardDriveDownload, title: ar ? 'تفليش رسمي' : 'Official flashing', desc: ar ? 'اختيار روم مطابق للطراز والمنطقة (CSC) مع التحقق من السلامة قبل الكتابة.' : 'Selecting firmware matched to the model and region, with integrity checks first.', tag: 'firmware' },
    { icon: DatabaseBackup, title: ar ? 'نسخ واستعادة' : 'Backup and restore', desc: ar ? 'نسخ قابل للاستعادة قبل أي تغيير، مع توضيح ما يمكن نسخه وما لا يمكن.' : 'Recoverable backups before any change, with clear limits on what can be copied.', tag: 'data' },
    { icon: KeyRound, title: ar ? 'تهيئة الجهاز' : 'Device setup', desc: ar ? 'ضبط الحسابات والتحديثات والصلاحيات بعد الإصلاح أو الشراء.' : 'Configuring accounts, updates, and permissions after repair or purchase.', tag: 'setup' },
    { icon: Smartphone, title: ar ? 'تشخيص برمجي' : 'Software diagnostics', desc: ar ? 'قراءة سجلات الأخطاء وفصل عطل البرنامج عن عطل العتاد.' : 'Reading error logs and separating software faults from hardware faults.', tag: 'diagnostic' },
    { icon: ShieldCheck, title: ar ? 'تحصين ما بعد الإصلاح' : 'Post-repair hardening', desc: ar ? 'إغلاق الصلاحيات الزائدة وتأمين الحساب من دون كسر حماية.' : 'Reducing excessive permissions and securing the account without bypasses.', tag: 'security' },
  ]

  const boundaries = [
    { ok: false, title: ar ? 'تغيير IMEI' : 'IMEI modification', desc: ar ? 'غير قانوني وغير معروض. لا نغيّر هوية الجهاز.' : 'Illegal and not offered. We do not change device identity.' },
    { ok: false, title: ar ? 'تجاوز FRP / iCloud' : 'FRP / iCloud bypass', desc: ar ? 'لا نتجاوز قفل ملكية. نطلب إثبات الملكية ونستخدم مسار الاسترداد الرسمي.' : 'We do not bypass ownership locks. We require proof of ownership and use official recovery.' },
    { ok: false, title: ar ? 'أجهزة مسروقة' : 'Stolen devices', desc: ar ? 'نرفض الخدمة عند وجود شبهة. مصلحة الضحية أولًا.' : 'We refuse service on suspicion. The victim’s interest comes first.' },
    { ok: true, title: ar ? 'إصلاح مملوك' : 'Owned-device repair', desc: ar ? 'نعم، بعد التحقق من الملكية وتوثيق الحالة في التذكرة.' : 'Yes, after ownership verification and documenting the condition on the ticket.' },
  ]

  const steps = [1, 2, 3, 4, 5, 6].map(n => ({ t: t(`prog.step${n}t` as never), d: t(`prog.step${n}d` as never) }))

  return (
    <>
      <PageHero
        eyebrow={ar ? 'مختبر برمجي' : 'Software lab'}
        title={t('prog.title')}
        lead={t('prog.lead')}
        icon={<Code2 size={26} />}
        meta={<><Badge tone="lime" dot>{ar ? 'رومات رسمية فقط' : 'Official firmware only'}</Badge><Badge tone="muted">Android · Windows</Badge></>}
      />
      <div className="container page-body">
        <div className="prog-grid">
          {services.map(s => (
            <div className="prog-card reveal" key={s.title}>
              <span className="prog-icon"><s.icon size={21} /></span>
              <span className="prog-tag">{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <section className="prog-method">
          <SectionHeader eyebrow={ar ? 'الطريقة' : 'Method'} title={t('prog.methodTitle')} lead={t('prog.methodLead')} />
          <div className="prog-steps">
            {steps.map((s, i) => (
              <div className="prog-step" key={i}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div><strong>{s.t}</strong><p>{s.d}</p></div>
              </div>
            ))}
          </div>
        </section>

        <div className="boundary-grid">
          {boundaries.map(b => (
            <div className={`boundary-card ${b.ok ? 'ok' : 'no'}`} key={b.title}>
              {b.ok ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
              <div><strong>{b.title}</strong><p>{b.desc}</p></div>
            </div>
          ))}
        </div>

        <div className="backup-banner">
          <span className="backup-icon"><DatabaseBackup size={23} /></span>
          <div><strong>{t('prog.backupTitle')}</strong><p>{t('prog.backupLead')}</p></div>
          <Link to="/articles/phone-backup-checklist" className="btn btn-outline btn-sm">{t('prog.backupGuide')} <ArrowUpLeft size={14} /></Link>
        </div>

        <div className="prog-links">
          <Link to="/firmware" className="prog-link"><HardDriveDownload size={19} /><div><strong>{t('nav.firmware')}</strong><p>{ar ? 'رومات وبوابات رسمية مع تحذيرات.' : 'Firmware and official portals with warnings.'}</p></div><ArrowLeft size={16} /></Link>
          <Link to="/tools" className="prog-link"><Laptop size={19} /><div><strong>{t('nav.tools')}</strong><p>{ar ? 'أدوات ويندوز وأندرويد المناسبة.' : 'Suitable Windows and Android tools.'}</p></div><ArrowLeft size={16} /></Link>
          <Link to="/cybersecurity" className="prog-link"><ShieldCheck size={19} /><div><strong>{t('nav.cyber')}</strong><p>{ar ? 'حماية الجهاز بعد البرمجة.' : 'Protect the device after servicing.'}</p></div><ArrowLeft size={16} /></Link>
        </div>

        <div className="detail-cta">
          <div><Terminal size={22} /><div><strong>{t('prog.ctaTitle')}</strong><p>{t('prog.ctaLead')}</p></div></div>
          <div className="inline-actions">
            <Link to="/requests?service=software" className="btn btn-primary btn-md">{t('nav.requests')} <ArrowLeft size={15} /></Link>
            <a href={whatsappLink(ar ? 'مرحبًا brxvih، أحتاج خدمة برمجية. الجهاز: ... المشكلة: ...' : 'Hello brxvih, I need software service. Device: ... Issue: ...')} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-md"><MessageCircle size={16} />{t('common.whatsapp')}</a>
          </div>
        </div>
      </div>
    </>
  )
}
