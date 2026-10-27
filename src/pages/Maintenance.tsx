import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, ArrowLeft, BatteryCharging, CheckCircle2, ClipboardList, Database,
  MessageCircle, ShieldCheck, Smartphone, Terminal, Timer, Wrench, XCircle,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { services } from '../data/seed'
import { useSeo } from '../lib/hooks'
import { Badge, PageHero, SectionHeader } from '../components/ui'
import { whatsappLink } from '../lib/utils'

const iconMap: Record<string, typeof Smartphone> = { smartphone: Smartphone, battery: BatteryCharging, terminal: Terminal, database: Database, activity: Activity, shield: ShieldCheck }

const faqs = [
  { qAr: 'هل تحددون السعر قبل البدء؟', aAr: 'نعم. بعد التشخيص نرسل نطاقًا واضحًا وخيارات الجودة. لا نبدأ عملًا مدفوعًا دون موافقتك، وأي تغيير يتطلب تأكيدًا جديدًا.', qEn: 'Do you confirm the price before starting?', aEn: 'Yes. After diagnosis we send a clear range and quality options. We do not start paid work without approval, and any change requires fresh confirmation.' },
  { qAr: 'هل تفقد البيانات أثناء الصيانة؟', aAr: 'ليس بالضرورة، لكن بعض أعطال اللوحة أو التفليش قد تتطلب مسحًا. نطلب نسخة احتياطية قبل أي إجراء برمجي، ولا نضمن استعادة بيانات لم تكن منسوخة.', qEn: 'Will data be lost during repair?', aEn: 'Not necessarily, but some board or firmware faults may require a wipe. We ask for a backup before any software work and cannot guarantee data that was never backed up.' },
  { qAr: 'ما مدة الضمان؟', aAr: 'تختلف حسب القطعة والعمل: عادة من 7 إلى 30 يومًا على التركيب فقط، ولا يغطي الكسر أو الماء أو فتح الجهاز لدى طرف آخر. التفاصيل تُكتب في التذكرة.', qEn: 'What is the warranty period?', aEn: 'It depends on the part and job: usually 7–30 days on installation only. It does not cover drops, liquid, or third-party opening. Details are written on the ticket.' },
  { qAr: 'هل تصلحون أجهزة مملوكة لغيركم؟', aAr: 'نخدم الجهاز فقط بعد التحقق من الملكية أو وجود تفويض واضح. لا ننفذ تغيير IMEI أو تجاوز FRP/iCloud أو أي خدمة تتطلب جهازًا مسروقًا.', qEn: 'Do you service devices owned by someone else?', aEn: 'Only after ownership or explicit authorization is verified. We do not change IMEI, bypass FRP/iCloud, or service stolen devices.' },
]

export default function Maintenance() {
  const { t, lang } = useStore()
  const [open, setOpen] = useState(0)
  useSeo(t('maint.title'), t('maint.lead'))

  const steps = [1, 2, 3, 4, 5].map(n => ({ t: t(`maint.step${n}t` as never), d: t(`maint.step${n}d` as never) }))

  return (
    <>
      <PageHero
        eyebrow={lang === 'ar' ? 'خدمة صيانة منظمة' : 'Structured repair service'}
        title={t('maint.title')}
        lead={t('maint.lead')}
        icon={<Wrench size={26} />}
        meta={<><Badge tone="lime" dot>{t('maint.accepting')}</Badge><Badge tone="muted">WHITE BLACK · {t('contact.locationValue')}</Badge></>}
      />
      <div className="container page-body">
        <div className="service-grid">
          {services.map(s => {
            const Icon = iconMap[s.icon] || Wrench
            return (
              <div className="service-card reveal" key={s.id}>
                <div className="service-card-head"><span className="service-icon"><Icon size={20} /></span><Badge tone="muted"><Timer size={12} />{s.duration}</Badge></div>
                <h3>{lang === 'ar' ? s.titleAr : s.titleEn}</h3>
                <p>{lang === 'ar' ? s.descAr : s.descEn}</p>
                <ul>{(lang === 'ar' ? s.featuresAr : s.featuresEn).map(f => <li key={f}><CheckCircle2 size={13} />{f}</li>)}</ul>
                <Link to={`/requests?service=${encodeURIComponent(s.titleEn)}`} className="btn btn-outline btn-sm">{t('maint.bookService')} <ArrowLeft size={14} /></Link>
              </div>
            )
          })}
        </div>

        <section className="maint-process">
          <SectionHeader eyebrow={lang === 'ar' ? 'المسار' : 'Workflow'} title={t('maint.processTitle')} lead={t('maint.processLead')} />
          <div className="process-timeline">
            {steps.map((s, i) => (
              <div className="timeline-item" key={i}>
                <span className="timeline-num">{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{s.t}</h3><p>{s.d}</p></div>
              </div>
            ))}
          </div>
        </section>

        <div className="maint-split">
          <div className="maint-panel">
            <Badge tone="ok">{t('maint.warrantyTitle')}</Badge>
            <h2>{t('maint.warrantyHeading')}</h2>
            <p>{t('maint.warrantyLead')}</p>
            <div className="warranty-list">
              {[1, 2, 3, 4].map(n => <div key={n}><CheckCircle2 size={15} /><span>{t(`maint.warranty${n}` as never)}</span></div>)}
              <div className="no"><XCircle size={15} /><span>{t('maint.warrantyExclude')}</span></div>
            </div>
          </div>
          <div className="maint-panel prep">
            <Badge tone="muted">{t('maint.prepareTitle')}</Badge>
            <h2>{t('maint.prepareHeading')}</h2>
            <p>{t('maint.prepareLead')}</p>
            <div className="prep-list">
              {[1, 2, 3, 4].map(n => <div key={n}><span className="prep-num">{n}</span><span>{t(`maint.prepare${n}` as never)}</span></div>)}
            </div>
          </div>
        </div>

        <section className="faq-section">
          <SectionHeader eyebrow={lang === 'ar' ? 'أسئلة متكررة' : 'FAQ'} title={t('maint.faqTitle')} />
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className={`faq-item ${open === i ? 'open' : ''}`} key={i}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  <span>{lang === 'ar' ? f.qAr : f.qEn}</span>
                  <span className="faq-plus">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <p>{lang === 'ar' ? f.aAr : f.aEn}</p>}
              </div>
            ))}
          </div>
        </section>

        <div className="detail-cta">
          <div><ClipboardList size={22} /><div><strong>{t('maint.ctaTitle')}</strong><p>{t('maint.ctaLead')}</p></div></div>
          <div className="inline-actions">
            <Link to="/requests" className="btn btn-primary btn-md">{t('nav.requests')} <ArrowLeft size={15} /></Link>
            <a href={whatsappLink(lang === 'ar' ? 'مرحبًا brxvih، أرغب بحجز صيانة. الجهاز: ... المشكلة: ...' : 'Hello brxvih, I would like to book a repair. Device: ... Issue: ...')} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-md"><MessageCircle size={16} />{t('common.whatsapp')}</a>
          </div>
        </div>
      </div>
    </>
  )
}
