import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock3, MapPin, MessageCircle, Phone, Send, ShieldCheck, Smartphone } from 'lucide-react'
import { useStore } from '../lib/store'
import { useSeo } from '../lib/hooks'
import { Badge, Button, Field, Input, PageHero, Textarea } from '../components/ui'
import { whatsappLink } from '../lib/utils'

export default function Contact() {
  const { t, lang, data } = useStore()
  const [form, setForm] = useState({ name: '', phone: '', model: '', message: '' })
  const [error, setError] = useState('')
  useSeo(t('contact.title'), t('contact.lead'))
  const ar = lang === 'ar'

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || form.message.trim().length < 10) {
      setError(t('contact.formError'))
      return
    }
    setError('')
    const text = ar
      ? `مرحبًا brxvih،\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالجهاز: ${form.model || 'غير محدد'}\nالرسالة: ${form.message}`
      : `Hello brxvih,\nName: ${form.name}\nPhone: ${form.phone}\nDevice: ${form.model || 'n/a'}\nMessage: ${form.message}`
    window.open(whatsappLink(text, data.settings.whatsapp), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <PageHero
        eyebrow={ar ? 'تواصل مباشر' : 'Direct contact'}
        title={t('contact.title')}
        lead={t('contact.lead')}
        icon={<MessageCircle size={26} />}
        meta={<><Badge tone="lime" dot>{t('contact.available')}</Badge><Badge tone="muted">{t('contact.locationValue')}</Badge></>}
      />
      <div className="container page-body">
        <div className="contact-grid">
          <a className="contact-card wa" href={whatsappLink(ar ? 'مرحبًا brxvih، لدي استفسار حول صيانة جهاز.' : 'Hello brxvih, I have a repair question.')} target="_blank" rel="noopener noreferrer">
            <span className="contact-icon"><MessageCircle size={22} /></span>
            <div><small>{t('contact.whatsapp')}</small><strong>+967 777 066 424</strong><p>{t('contact.whatsappLead')}</p></div>
            <ArrowLeft size={18} />
          </a>
          <a className="contact-card" href="tel:+967777066424">
            <span className="contact-icon"><Phone size={22} /></span>
            <div><small>{t('contact.call')}</small><strong dir="ltr">+967 777 066 424</strong><p>{t('contact.callLead')}</p></div>
            <ArrowLeft size={18} />
          </a>
          <div className="contact-card">
            <span className="contact-icon"><MapPin size={22} /></span>
            <div><small>{t('contact.location')}</small><strong>{t('contact.locationValue')}</strong><p>{t('contact.locationLead')}</p></div>
          </div>
          <div className="contact-card">
            <span className="contact-icon"><Clock3 size={22} /></span>
            <div><small>{t('contact.hours')}</small><strong>{t('contact.hoursValue')}</strong><p>{t('contact.hoursLead')}</p></div>
          </div>
        </div>

        <div className="contact-layout">
          <form className="contact-form" onSubmit={send}>
            <div className="contact-form-head">
              <Badge tone="muted">{t('contact.quickMessage')}</Badge>
              <h2>{t('contact.formTitle')}</h2>
              <p>{t('contact.formLead')}</p>
            </div>
            <div className="form-grid">
              <Field label={t('common.name')} required><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={ar ? 'الاسم' : 'Your name'} /></Field>
              <Field label={t('common.phone')} required><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+967 7xx xxx xxx" dir="ltr" inputMode="tel" /></Field>
            </div>
            <Field label={`${t('requests.device')} (${t('common.optional')})`}><Input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder={ar ? 'الطراز أو رقم الموديل' : 'Model or model number'} /></Field>
            <Field label={t('contact.message')} required><Textarea rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder={t('contact.messagePlaceholder')} /></Field>
            {error && <span className="field-error">{error}</span>}
            <Button type="submit" size="lg"><Send size={16} />{t('contact.sendWhatsapp')}</Button>
            <p className="fineprint"><ShieldCheck size={13} />{t('contact.formNote')}</p>
          </form>

          <aside className="contact-side">
            <div className="contact-side-card">
              <span className="csc-icon"><Smartphone size={20} /></span>
              <h3>{t('contact.beforeTitle')}</h3>
              <ul>{[1, 2, 3, 4].map(n => <li key={n}>{t(`contact.before${n}` as never)}</li>)}</ul>
            </div>
            <div className="contact-side-card accent">
              <h3>{t('contact.boundaryTitle')}</h3>
              <p>{t('contact.boundaryLead')}</p>
              <Link to="/cybersecurity" className="text-link">{t('nav.cyber')} <ArrowLeft size={13} /></Link>
            </div>
            <div className="contact-side-card">
              <h3>{t('contact.requestsTitle')}</h3>
              <p>{t('contact.requestsLead')}</p>
              <Link to="/requests" className="btn btn-outline btn-sm">{t('nav.requests')} <ArrowLeft size={13} /></Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
