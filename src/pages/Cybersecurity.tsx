import { Link } from 'react-router-dom'
import {
  AlertOctagon, ArrowLeft, ArrowUpLeft, CheckCircle2, Fingerprint, KeyRound,
  LockKeyhole, MessageCircle, Radio, ShieldCheck, Smartphone, Wifi, XCircle,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { useSeo } from '../lib/hooks'
import { Badge, PageHero, SectionHeader } from '../components/ui'
import { ArticleCard } from '../components/cards'

export default function Cybersecurity() {
  const { data, t, lang } = useStore()
  useSeo(t('cyber.title'), t('cyber.lead'))
  const ar = lang === 'ar'

  const pillars = [
    { icon: LockKeyhole, title: t('cyber.rule1'), desc: t('cyber.rule1d') },
    { icon: Fingerprint, title: t('cyber.rule2'), desc: t('cyber.rule2d') },
    { icon: Radio, title: t('cyber.rule3'), desc: t('cyber.rule3d') },
    { icon: Wifi, title: t('cyber.rule4'), desc: t('cyber.rule4d') },
    { icon: KeyRound, title: ar ? 'مدير كلمات مرور' : 'Password manager', desc: ar ? 'كلمات فريدة لكل حساب، ومصادقة ثنائية عبر تطبيق لا عبر SMS فقط.' : 'Unique passwords per account and app-based two-factor authentication, not SMS alone.' },
    { icon: Smartphone, title: ar ? 'تحديثات فورية' : 'Prompt updates', desc: ar ? 'ثبّت تحديثات النظام والتطبيقات الأمنية؛ أكثر الاختراقات تستغل ثغرات قديمة.' : 'Install system and app security updates; most compromises exploit old vulnerabilities.' },
  ]

  const checklist = Array.from({ length: 8 }, (_, i) => t(`cyber.check${i + 1}` as never))
  const emergency = [1, 2, 3, 4, 5].map(n => t(`cyber.emergency${n}` as never))
  const articles = data.articles.filter(a => a.publishStatus === 'published' && a.category === 'security').slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow={ar ? 'حماية دفاعية' : 'Defensive security'}
        title={t('cyber.title')}
        lead={t('cyber.lead')}
        icon={<ShieldCheck size={26} />}
        meta={<><Badge tone="lime" dot>{ar ? 'لا اختراق ولا تجاوز' : 'No hacking or bypasses'}</Badge><Badge tone="muted">{ar ? 'للأجهزة المملوكة' : 'Owned devices only'}</Badge></>}
      />
      <div className="container page-body">
        <div className="cyber-hero-note">
          <ShieldCheck size={22} />
          <p>{t('cyber.boundary')}</p>
        </div>

        <div className="cyber-grid">
          {pillars.map((p, i) => (
            <div className="cyber-card" key={i}>
              <span className="cyber-icon"><p.icon size={20} /></span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <section className="cyber-split">
          <div className="cyber-checklist">
            <SectionHeader eyebrow={ar ? 'قائمة قصيرة' : 'Short checklist'} title={t('cyber.checklistTitle')} />
            {checklist.map((c, i) => <div className="cyber-check" key={i}><span>{String(i + 1).padStart(2, '0')}</span><p>{c}</p><CheckCircle2 size={15} /></div>)}
          </div>
          <div className="cyber-emergency">
            <Badge tone="danger">{ar ? 'إذا شككت باختراق' : 'If compromise is suspected'}</Badge>
            <h2>{t('cyber.emergencyTitle')}</h2>
            <p>{t('cyber.emergencyLead')}</p>
            <div className="emergency-steps">
              {emergency.map((e, i) => <div key={i}><span>{i + 1}</span><p>{e}</p></div>)}
            </div>
            <Link to="/requests?service=security" className="btn btn-primary btn-md">{t('cyber.requestHelp')} <ArrowLeft size={15} /></Link>
          </div>
        </section>

        <section className="phish-band">
          <AlertOctagon size={24} />
          <div><strong>{t('cyber.phishTitle')}</strong><p>{t('cyber.phishLead')}</p></div>
          <div className="phish-tags">
            <span><XCircle size={13} />{ar ? 'روابط اختصار غامضة' : 'Opaque short links'}</span>
            <span><XCircle size={13} />{ar ? 'طلبات OTP' : 'OTP requests'}</span>
            <span><XCircle size={13} />{ar ? 'تطبيقات APK خارجية' : 'Side-loaded APKs'}</span>
          </div>
        </section>

        {articles.length > 0 && (
          <section className="cyber-articles">
            <SectionHeader title={t('cyber.articles')} eyebrow={ar ? 'اقرأ أكثر' : 'Read more'} actions={<Link to="/articles?category=security" className="btn btn-outline btn-sm">{t('common.viewAll')} <ArrowLeft size={14} /></Link>} />
            <div className="article-grid">{articles.map(a => <ArticleCard key={a.id} article={a} />)}</div>
          </section>
        )}

        <div className="detail-cta">
          <div><MessageCircle size={22} /><div><strong>{t('cyber.ctaTitle')}</strong><p>{t('cyber.ctaLead')}</p></div></div>
          <div className="inline-actions">
            <Link to="/requests?service=security" className="btn btn-primary btn-md">{t('cyber.requestHelp')} <ArrowLeft size={15} /></Link>
            <Link to="/articles?category=security" className="btn btn-outline btn-md">{t('cyber.articles')} <ArrowUpLeft size={15} /></Link>
          </div>
        </div>
      </div>
    </>
  )
}
