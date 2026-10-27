import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, ClipboardList, Clock3, Info, MessageCircle, Phone,
  Search, ShieldCheck, Ticket, Wrench,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { brands } from '../data/brands'
import { services } from '../data/seed'
import { useSeo } from '../lib/hooks'
import { Badge, Button, Field, Input, PageHero, Select, Textarea } from '../components/ui'
import { phoneDisplayName } from '../lib/phone'
import { requestStatusLabel, requestStatusTone, requestToWhatsApp, ticketId } from '../lib/utils'
import type { MaintenanceRequest } from '../types'

const initial = { name: '', phone: '', city: '', brand: '', model: '', serviceType: 'تشخيص الأعطال', priority: 'normal' as 'normal' | 'urgent', contactMethod: 'whatsapp', description: '', consent: false }

export default function Requests() {
  const { data, t, lang, addRequest, trackRequest, toast } = useStore()
  const [params] = useSearchParams()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<MaintenanceRequest | null>(null)
  const [track, setTrack] = useState({ ticket: '', phone: '' })
  const [tracked, setTracked] = useState<MaintenanceRequest | null | 'none'>(null)
  useSeo(t('requests.title'), t('requests.lead'))
  const ar = lang === 'ar'

  const phoneParam = params.get('phone')
  const selectedPhone = useMemo(() => data.phones.find(p => p.id === phoneParam), [data.phones, phoneParam])
  const serviceParam = params.get('service')

  useEffect(() => {
    setForm(f => {
      const next = { ...f }
      if (selectedPhone) { next.brand = selectedPhone.brand; next.model = `${selectedPhone.name}${selectedPhone.modelNumber ? ` (${selectedPhone.modelNumber})` : ''}` }
      if (serviceParam) {
        const match = services.find(s => s.titleEn.toLowerCase() === serviceParam.toLowerCase() || s.id === serviceParam)
        next.serviceType = match ? (ar ? match.titleAr : match.titleEn) : serviceParam === 'screen' ? (ar ? 'استبدال الشاشات' : 'Display replacement') : serviceParam === 'software' ? (ar ? 'سوفت وير وتفليش' : 'Software and flashing') : serviceParam === 'security' ? (ar ? 'تأمين الجهاز' : 'Device security') : serviceParam
      }
      const issue = params.get('issue')
      if (issue) next.description = ar ? `وصف المشكلة: ${issue}\n` : `Issue: ${issue}\n`
      return next
    })
  }, [selectedPhone, serviceParam, ar, params])

  const serviceOptions = [
    ...services.map(s => ar ? s.titleAr : s.titleEn),
    ar ? 'برمجة / تفليش' : 'Programming / flashing',
    ar ? 'استعادة بيانات' : 'Data recovery',
    ar ? 'استشارة فنية' : 'Technical consultation',
    ar ? 'أخرى' : 'Other',
  ]

  const update = (key: keyof typeof initial, value: string | boolean) => {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (form.name.trim().length < 2) e.name = t('requests.errName')
    if (form.phone.replace(/\D/g, '').length < 7) e.phone = t('requests.errPhone')
    if (!form.city.trim()) e.city = t('requests.errCity')
    if (!form.brand) e.brand = t('requests.errBrand')
    if (!form.model.trim()) e.model = t('requests.errModel')
    if (form.description.trim().length < 15) e.description = t('requests.errDescription')
    if (!form.consent) e.consent = t('requests.errConsent')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate() || submitting) return
    setSubmitting(true)
    try {
      const row = await addRequest({ ...form, serviceType: form.serviceType.trim() })
      setCreated(row)
      setTrack({ ticket: row.ticket, phone: row.phone })
      toast(t('requests.createdToast'), 'success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      toast(t('requests.createError'), 'error')
    } finally { setSubmitting(false) }
  }

  const doTrack = (ev: React.FormEvent) => {
    ev.preventDefault()
    const found = trackRequest(track.ticket, track.phone)
    setTracked(found || 'none')
  }

  const reset = () => { setCreated(null); setForm(initial); setErrors({}) }

  if (created) {
    return (
      <>
        <PageHero eyebrow={ar ? 'تم الحفظ محليًا' : 'Saved locally'} title={t('requests.successTitle')} lead={t('requests.successLead')} icon={<CheckCircle2 size={26} />} />
        <div className="container page-body">
          <div className="request-success">
            <span className="rs-icon"><CheckCircle2 size={30} /></span>
            <h2>{t('requests.successHeading')}</h2>
            <p>{t('requests.successText')}</p>
            <div className="ticket-box">
              <span>{t('requests.yourTicket')}</span>
              <strong dir="ltr">{created.ticket}</strong>
              <small>{t('requests.keepTicket')}</small>
            </div>
            <div className="rs-summary">
              <div><small>{t('common.name')}</small><strong>{created.name}</strong></div>
              <div><small>{t('common.phone')}</small><strong dir="ltr">{created.phone}</strong></div>
              <div><small>{t('requests.device')}</small><strong>{created.brand} {created.model}</strong></div>
              <div><small>{t('requests.service')}</small><strong>{created.serviceType}</strong></div>
              <div><small>{t('common.status')}</small><Badge tone={requestStatusTone(created.status)}>{requestStatusLabel(created.status, lang)}</Badge></div>
            </div>
            <div className="rs-notice"><Info size={16} /><p>{t('requests.localNotice')}</p></div>
            <div className="inline-actions">
              <a className="btn btn-wa btn-lg" href={requestToWhatsApp(created, lang)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />{t('requests.sendWhatsapp')}</a>
              <Button variant="outline" size="lg" onClick={reset}>{t('requests.newRequest')}</Button>
            </div>
            <p className="fineprint">{t('requests.whatsappHint')}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHero
        eyebrow={ar ? 'طلب منظم' : 'Structured request'}
        title={t('requests.title')}
        lead={t('requests.lead')}
        icon={<ClipboardList size={26} />}
        meta={<><Badge tone="lime" dot>{ar ? 'رد بشري' : 'Human reply'}</Badge><Badge tone="muted">{ar ? 'لا دفع قبل التأكيد' : 'No payment before confirmation'}</Badge></>}
      />
      <div className="container page-body">
        <div className="request-layout">
          <form className="request-form" onSubmit={submit} noValidate>
            <div className="form-section">
              <div className="form-section-head"><span>01</span><div><strong>{t('requests.contactInfo')}</strong><small>{t('requests.contactInfoLead')}</small></div></div>
              <div className="form-grid">
                <Field label={t('common.name')} error={errors.name} required><Input value={form.name} onChange={e => update('name', e.target.value)} placeholder={ar ? 'الاسم الكامل' : 'Full name'} autoComplete="name" /></Field>
                <Field label={t('common.phone')} error={errors.phone} required hint={ar ? 'واتساب مفضل' : 'WhatsApp preferred'}><Input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+967 7xx xxx xxx" dir="ltr" inputMode="tel" autoComplete="tel" /></Field>
                <Field label={t('common.city')} error={errors.city} required><Input value={form.city} onChange={e => update('city', e.target.value)} placeholder={ar ? 'صنعاء، عدن، تعز…' : 'Sanaa, Aden, Taiz…'} /></Field>
                <Field label={t('requests.contactMethod')}><Select value={form.contactMethod} onChange={e => update('contactMethod', e.target.value)}><option value="whatsapp">{t('common.whatsapp')}</option><option value="call">{t('common.call')}</option><option value="either">{ar ? 'أي منهما' : 'Either'}</option></Select></Field>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-head"><span>02</span><div><strong>{t('requests.deviceInfo')}</strong><small>{t('requests.deviceInfoLead')}</small></div></div>
              <div className="form-grid">
                <Field label={t('common.brand')} error={errors.brand} required><Select value={form.brand} onChange={e => update('brand', e.target.value)}><option value="">{t('requests.selectBrand')}</option>{brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}</Select></Field>
                <Field label={`${t('common.model')} / ${t('common.modelNumber')}`} error={errors.model} required><Input value={form.model} onChange={e => update('model', e.target.value)} placeholder={ar ? 'مثال: Galaxy A54 — SM-A546B' : 'e.g. Galaxy A54 — SM-A546B'} /></Field>
                <Field label={t('requests.service')} required><Select value={form.serviceType} onChange={e => update('serviceType', e.target.value)}>{serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}</Select></Field>
                <Field label={t('requests.priority')}><div className="priority-switch"><button type="button" className={form.priority === 'normal' ? 'active' : ''} onClick={() => update('priority', 'normal')}><Clock3 size={14} />{t('requests.normal')}</button><button type="button" className={form.priority === 'urgent' ? 'active urgent' : ''} onClick={() => update('priority', 'urgent')}>{t('requests.urgent')}</button></div></Field>
              </div>
              <Field label={t('requests.description')} error={errors.description} required hint={t('requests.descriptionHint')}>
                <Textarea rows={5} value={form.description} onChange={e => update('description', e.target.value)} placeholder={ar ? 'اكتب الأعراض، متى بدأت، وما جربته. اذكر إن كان الجهاز مبللًا أو سقط أو فُتح سابقًا.' : 'Describe symptoms, when they started, and what you tried. Mention liquid, drops, or previous repairs.'} />
              </Field>
            </div>

            <div className="form-section">
              <div className="form-section-head"><span>03</span><div><strong>{t('requests.confirm')}</strong><small>{t('requests.confirmLead')}</small></div></div>
              <label className={`consent ${errors.consent ? 'has-error' : ''}`}>
                <input type="checkbox" checked={form.consent} onChange={e => update('consent', e.target.checked)} />
                <span><strong>{t('requests.consent')}</strong><small>{t('requests.consentLead')}</small></span>
              </label>
              {errors.consent && <span className="field-error">{errors.consent}</span>}
              <div className="form-note"><ShieldCheck size={15} />{t('requests.privacyNote')}</div>
              <Button type="submit" size="lg" className="submit-btn" disabled={submitting}>{submitting ? t('common.sending') : t('requests.submit')}<ArrowLeft size={16} /></Button>
            </div>
          </form>

          <aside className="request-side">
            <div className="side-panel track-panel">
              <strong><Ticket size={16} />{t('requests.trackTitle')}</strong>
              <p>{t('requests.trackLead')}</p>
              <form onSubmit={doTrack}>
                <Input value={track.ticket} onChange={e => setTrack(s => ({ ...s, ticket: e.target.value }))} placeholder={t('requests.ticketPlaceholder')} dir="ltr" />
                <Input value={track.phone} onChange={e => setTrack(s => ({ ...s, phone: e.target.value }))} placeholder={t('common.phone')} dir="ltr" inputMode="tel" />
                <Button type="submit" variant="outline" size="md" className="w-full"><Search size={15} />{t('requests.trackButton')}</Button>
              </form>
              {tracked === 'none' && <div className="track-result none"><Info size={15} />{t('requests.notFound')}</div>}
              {tracked && tracked !== 'none' && (
                <div className="track-result">
                  <div className="track-result-head"><strong dir="ltr">{tracked.ticket}</strong><Badge tone={requestStatusTone(tracked.status)}>{requestStatusLabel(tracked.status, lang)}</Badge></div>
                  <div className="track-row"><span>{t('requests.device')}</span><strong>{tracked.brand} {tracked.model}</strong></div>
                  <div className="track-row"><span>{t('common.updated')}</span><strong>{new Date(tracked.updatedAt).toLocaleDateString(ar ? 'ar-YE' : 'en-GB')}</strong></div>
                  <a className="btn btn-wa btn-sm" href={requestToWhatsApp(tracked, lang)} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} />{t('requests.followWhatsapp')}</a>
                </div>
              )}
            </div>

            <div className="side-panel">
              <strong><Wrench size={16} />{t('requests.whatNext')}</strong>
              <div className="next-steps">
                {[1, 2, 3, 4].map(n => <div key={n}><span>{n}</span><p>{t(`requests.next${n}` as never)}</p></div>)}
              </div>
            </div>

            <div className="side-panel side-contact">
              <strong>{t('requests.preferTalk')}</strong>
              <p>{t('requests.preferTalkLead')}</p>
              <a href="tel:+967777066424" className="btn btn-outline btn-sm" dir="ltr"><Phone size={14} />+967 777 066 424</a>
              <Link to="/contact" className="text-link">{t('nav.contact')} <ArrowLeft size={13} /></Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
