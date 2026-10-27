import { useState } from 'react'
import { Save, X } from 'lucide-react'
import type { Article, ArticleCategory, Currency, FirmwareRecord, MaintenanceRequest, Phone, ScreenPrice, SparePart, Supplier } from '../types'
import { brands } from '../data/brands'
import { useStore } from '../lib/store'
import { Button, Field, Input, Select, Textarea } from './ui'
import { qualityLabel, requestStatusLabel } from '../lib/utils'

const currencies: Currency[] = ['YER', 'SAR', 'USD']
const qualities = ['original', 'service-pack', 'commercial', 'refurbished', 'used'] as const
const publishOptions = ['published', 'pending', 'draft', 'archived'] as const
const statusOptions = ['verified', 'review', 'on-request'] as const
const availOptions = ['in-stock', 'limited', 'on-request', 'out-of-stock'] as const
const articleCats: ArticleCategory[] = ['tutorial', 'fault', 'security', 'news']

function Actions({ onClose }: { onClose: () => void }) {
  const { t } = useStore()
  return <div className="admin-form-actions"><Button type="button" variant="ghost" onClick={onClose}><X size={15} />{t('common.cancel')}</Button><Button type="submit"><Save size={15} />{t('common.save')}</Button></div>
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label className="admin-check"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} /><span>{label}</span></label>
}

export function PhoneForm({ initial, onClose }: { initial: Phone; onClose: () => void }) {
  const { savePhone, toast, t, lang } = useStore()
  const [f, setF] = useState<Phone>(initial)
  const set = <K extends keyof Phone>(key: K, value: Phone[K]) => setF(prev => ({ ...prev, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.name.trim() || !f.brand) { toast(lang === 'ar' ? 'الاسم والشركة مطلوبان.' : 'Name and brand are required.', 'error'); return }
    const slug = f.slug || `${f.brand}-${f.name}`.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)/g, '')
    await savePhone({ ...f, slug, updatedAt: new Date().toISOString() })
    toast(t('admin.saved'))
    onClose()
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-section"><h4>{t('admin.formBasic')}</h4><div className="form-grid">
        <Field label={t('common.brand')} required><Select value={f.brand} onChange={e => set('brand', e.target.value)}>{brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}</Select></Field>
        <Field label={t('common.model')} required><Input value={f.name} onChange={e => set('name', e.target.value)} /></Field>
        <Field label={t('common.series')}><Input value={f.series} onChange={e => set('series', e.target.value)} /></Field>
        <Field label={t('common.modelNumber')}><Input value={f.modelNumber} onChange={e => set('modelNumber', e.target.value)} dir="ltr" /></Field>
        <Field label={t('common.codename')}><Input value={f.codename} onChange={e => set('codename', e.target.value)} dir="ltr" /></Field>
        <Field label={t('common.year')}><Input type="number" value={f.year ?? ''} onChange={e => set('year', e.target.value ? Number(e.target.value) : null)} /></Field>
      </div></div>
      <div className="admin-form-section"><h4>{t('admin.formSpecs')}</h4><div className="form-grid">
        <Field label={t('common.soc')}><Input value={f.soc} onChange={e => set('soc', e.target.value)} /></Field>
        <Field label={t('common.display')}><Input value={f.displayType} onChange={e => set('displayType', e.target.value)} /></Field>
        <Field label={t('common.display') + ' (' + (lang === 'ar' ? 'بوصة' : 'inch') + ')'}><Input type="number" step="0.01" value={f.displaySize ?? ''} onChange={e => set('displaySize', e.target.value ? Number(e.target.value) : '')} /></Field>
        <Field label={t('common.resolution')}><Input value={f.resolution} onChange={e => set('resolution', e.target.value)} dir="ltr" /></Field>
        <Field label={t('common.battery') + ' (mAh)'}><Input type="number" value={f.battery ?? ''} onChange={e => set('battery', e.target.value ? Number(e.target.value) : '')} /></Field>
        <Field label={t('common.charging') + ' (W)'}><Input type="number" value={f.charging ?? ''} onChange={e => set('charging', e.target.value ? Number(e.target.value) : '')} /></Field>
        <Field label={t('common.ram') + ' (GB, comma)'}><Input value={f.ram.join(', ')} onChange={e => set('ram', e.target.value.split(',').map(x => Number(x.trim())).filter(Boolean))} dir="ltr" /></Field>
        <Field label={t('common.storage') + ' (GB, comma)'}><Input value={f.storage.join(', ')} onChange={e => set('storage', e.target.value.split(',').map(x => Number(x.trim())).filter(Boolean))} dir="ltr" /></Field>
        <Field label={t('common.os')}><Input value={f.os} onChange={e => set('os', e.target.value)} /></Field>
        <Field label="IP"><Input value={f.ipRating} onChange={e => set('ipRating', e.target.value)} dir="ltr" /></Field>
      </div></div>
      <div className="admin-form-section"><h4>{t('admin.formPublish')}</h4><div className="form-grid">
        <Field label={t('admin.status')}><Select value={f.publishStatus} onChange={e => set('publishStatus', e.target.value as Phone['publishStatus'])}>{publishOptions.map(s => <option key={s} value={s}>{s}</option>)}</Select></Field>
        <Field label={t('admin.verification')}><Select value={f.verification || 'auto'} onChange={e => set('verification', e.target.value as Phone['verification'])}><option value="auto">auto</option><option value="dataset">dataset</option><option value="manual">manual</option></Select></Field>
        <Field label={lang === 'ar' ? 'رابط الصورة' : 'Image URL'}><Input value={f.image} onChange={e => set('image', e.target.value)} dir="ltr" /></Field>
        <Field label={lang === 'ar' ? 'نوع الاستخدام' : 'Use type'}><Input value={f.collection || ''} onChange={e => set('collection', e.target.value)} /></Field>
      </div>
      <Field label={lang === 'ar' ? 'المصادر (رابط في كل سطر)' : 'Sources (one URL per line)'}><Textarea rows={3} value={f.sources.join('\n')} onChange={e => set('sources', e.target.value.split('\n').map(x => x.trim()).filter(Boolean))} dir="ltr" /></Field>
      <Field label={t('phone.softwareNotes')}><Textarea rows={2} value={f.softwareNotes || ''} onChange={e => set('softwareNotes', e.target.value)} /></Field>
      <Field label={t('phone.repairNotes')}><Textarea rows={2} value={f.repairNotes || ''} onChange={e => set('repairNotes', e.target.value)} /></Field></div>
      <Actions onClose={onClose} />
    </form>
  )
}

export function PriceForm({ initial, onClose }: { initial: ScreenPrice; onClose: () => void }) {
  const { data, saveScreenPrice, toast, t, lang } = useStore()
  const [f, setF] = useState<ScreenPrice>(initial)
  const set = <K extends keyof ScreenPrice>(key: K, value: ScreenPrice[K]) => setF(prev => ({ ...prev, [key]: value }))
  const pickPhone = (id: string) => {
    const p = data.phones.find(x => x.id === id)
    if (!p) return
    setF(prev => ({ ...prev, phoneId: p.id, phoneName: p.name, brand: p.brand, modelNumber: p.modelNumber, displayType: p.displayType }))
  }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.phoneId) { toast(lang === 'ar' ? 'اختر هاتفًا.' : 'Select a phone.', 'error'); return }
    await saveScreenPrice({ ...f, updatedAt: new Date().toISOString() })
    toast(t('admin.saved')); onClose()
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="form-grid">
        <Field label={t('admin.phone')} required><Select value={f.phoneId} onChange={e => pickPhone(e.target.value)}><option value="">—</option>{data.phones.map(p => <option key={p.id} value={p.id}>{p.brand} {p.name}</option>)}</Select></Field>
        <Field label={t('common.quality')}><Select value={f.quality} onChange={e => set('quality', e.target.value as ScreenPrice['quality'])}>{qualities.map(q => <option key={q} value={q}>{qualityLabel(q, lang)}</option>)}</Select></Field>
        <Field label={t('common.price')} hint={lang === 'ar' ? 'اتركه فارغًا للطلب' : 'Leave empty for on-request'}><Input type="number" value={f.price ?? ''} onChange={e => set('price', e.target.value ? Number(e.target.value) : null)} /></Field>
        <Field label={t('common.currency')}><Select value={f.currency} onChange={e => set('currency', e.target.value as Currency)}>{currencies.map(c => <option key={c}>{c}</option>)}</Select></Field>
        <Field label={t('common.install')}><Input type="number" value={f.installPrice ?? ''} onChange={e => set('installPrice', e.target.value ? Number(e.target.value) : null)} /></Field>
        <Field label={t('common.city')}><Input value={f.city} onChange={e => set('city', e.target.value)} /></Field>
        <Field label={t('common.supplier')}><Input value={f.supplier} onChange={e => set('supplier', e.target.value)} /></Field>
        <Field label={t('common.availability')}><Select value={f.availability} onChange={e => set('availability', e.target.value as ScreenPrice['availability'])}>{availOptions.map(a => <option key={a}>{a}</option>)}</Select></Field>
        <Field label={t('common.status')}><Select value={f.status} onChange={e => set('status', e.target.value as ScreenPrice['status'])}>{statusOptions.map(s => <option key={s}>{s}</option>)}</Select></Field>
        <Field label={t('admin.status')}><Select value={f.publishStatus} onChange={e => set('publishStatus', e.target.value as ScreenPrice['publishStatus'])}>{publishOptions.map(s => <option key={s}>{s}</option>)}</Select></Field>
        <Field label={t('common.updated')}><Input type="date" value={f.updatedAt.slice(0, 10)} onChange={e => set('updatedAt', e.target.value)} /></Field>
      </div>
      <Field label={t('common.notes')}><Textarea rows={2} value={f.notes || ''} onChange={e => set('notes', e.target.value)} /></Field>
      <Actions onClose={onClose} />
    </form>
  )
}

export function PartForm({ initial, onClose }: { initial: SparePart; onClose: () => void }) {
  const { saveSparePart, toast, t } = useStore()
  const [f, setF] = useState<SparePart>(initial)
  const set = <K extends keyof SparePart>(key: K, value: SparePart[K]) => setF(prev => ({ ...prev, [key]: value }))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveSparePart({ ...f, updatedAt: new Date().toISOString() })
    toast(t('admin.saved')); onClose()
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="form-grid">
        <Field label={t('common.name') + ' (AR)'} required><Input value={f.name} onChange={e => set('name', e.target.value)} /></Field>
        <Field label={t('common.name') + ' (EN)'}><Input value={f.nameEn} onChange={e => set('nameEn', e.target.value)} /></Field>
        <Field label={t('parts.category')}><Input value={f.category} onChange={e => set('category', e.target.value)} /></Field>
        <Field label={t('common.quality')}><Input value={f.quality} onChange={e => set('quality', e.target.value)} /></Field>
        <Field label={t('common.price')}><Input type="number" value={f.price ?? ''} onChange={e => set('price', e.target.value ? Number(e.target.value) : null)} /></Field>
        <Field label={t('common.currency')}><Select value={f.currency} onChange={e => set('currency', e.target.value as Currency)}>{currencies.map(c => <option key={c}>{c}</option>)}</Select></Field>
        <Field label={t('common.city')}><Input value={f.city} onChange={e => set('city', e.target.value)} /></Field>
        <Field label={t('common.supplier')}><Input value={f.supplier} onChange={e => set('supplier', e.target.value)} /></Field>
        <Field label={t('common.availability')}><Select value={f.availability} onChange={e => set('availability', e.target.value as SparePart['availability'])}>{availOptions.map(a => <option key={a}>{a}</option>)}</Select></Field>
        <Field label={t('common.status')}><Select value={f.status} onChange={e => set('status', e.target.value as SparePart['status'])}>{statusOptions.map(s => <option key={s}>{s}</option>)}</Select></Field>
        <Field label={t('admin.status')}><Select value={f.publishStatus} onChange={e => set('publishStatus', e.target.value as SparePart['publishStatus'])}>{publishOptions.map(s => <option key={s}>{s}</option>)}</Select></Field>
        <Field label={t('admin.verification')}><Input value={f.brands.join(', ')} onChange={e => set('brands', e.target.value.split(',').map(x => x.trim()).filter(Boolean))} /></Field>
      </div>
      <Field label={t('common.notes')}><Textarea rows={2} value={f.notes || ''} onChange={e => set('notes', e.target.value)} /></Field>
      <Actions onClose={onClose} />
    </form>
  )
}

export function SupplierForm({ initial, onClose }: { initial: Supplier; onClose: () => void }) {
  const { saveSupplier, toast, t } = useStore()
  const [f, setF] = useState<Supplier>(initial)
  const set = <K extends keyof Supplier>(key: K, value: Supplier[K]) => setF(prev => ({ ...prev, [key]: value }))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveSupplier(f)
    toast(t('admin.saved')); onClose()
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="form-grid">
        <Field label={t('common.name')} required><Input value={f.name} onChange={e => set('name', e.target.value)} /></Field>
        <Field label={t('common.city')}><Input value={f.city} onChange={e => set('city', e.target.value)} /></Field>
        <Field label={t('common.phone')}><Input value={f.phone} onChange={e => set('phone', e.target.value)} dir="ltr" /></Field>
        <Field label={t('common.whatsapp')}><Input value={f.whatsapp} onChange={e => set('whatsapp', e.target.value)} dir="ltr" /></Field>
        <Field label={t('parts.categories')}><Input value={f.specialties.join(', ')} onChange={e => set('specialties', e.target.value.split(',').map(x => x.trim()).filter(Boolean))} /></Field>
      </div>
      <Check label={t('common.verified')} checked={f.verified} onChange={v => set('verified', v)} />
      <Field label={t('common.notes')}><Textarea rows={2} value={f.notes || ''} onChange={e => set('notes', e.target.value)} /></Field>
      <Actions onClose={onClose} />
    </form>
  )
}

export function FirmwareForm({ initial, onClose }: { initial: FirmwareRecord; onClose: () => void }) {
  const { data, saveFirmware, toast, t } = useStore()
  const [f, setF] = useState<FirmwareRecord>(initial)
  const set = <K extends keyof FirmwareRecord>(key: K, value: FirmwareRecord[K]) => setF(prev => ({ ...prev, [key]: value }))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveFirmware({ ...f, updatedAt: new Date().toISOString() })
    toast(t('admin.saved')); onClose()
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="form-grid">
        <Field label={t('common.brand')} required><Select value={f.brand} onChange={e => set('brand', e.target.value)}>{brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}</Select></Field>
        <Field label={t('common.model')}><Input value={f.modelName} onChange={e => set('modelName', e.target.value)} /></Field>
        <Field label={t('common.modelNumber')}><Input value={f.modelNumber} onChange={e => set('modelNumber', e.target.value)} dir="ltr" /></Field>
        <Field label={t('firmware.version')}><Input value={f.version} onChange={e => set('version', e.target.value)} dir="ltr" /></Field>
        <Field label={t('firmware.region')}><Input value={f.region} onChange={e => set('region', e.target.value)} dir="ltr" /></Field>
        <Field label="Android"><Input value={f.androidVersion} onChange={e => set('androidVersion', e.target.value)} dir="ltr" /></Field>
        <Field label={t('firmware.size')}><Input value={f.size} onChange={e => set('size', e.target.value)} dir="ltr" /></Field>
        <Field label={t('firmware.fileType')}><Input value={f.fileType} onChange={e => set('fileType', e.target.value)} /></Field>
        <Field label={t('firmware.source')}><Input value={f.sourceName} onChange={e => set('sourceName', e.target.value)} /></Field>
        <Field label={t('common.status')}><Select value={f.status} onChange={e => set('status', e.target.value as FirmwareRecord['status'])}><option value="portal">portal</option><option value="verified">verified</option><option value="review">review</option></Select></Field>
        <Field label={t('admin.status')}><Select value={f.publishStatus} onChange={e => set('publishStatus', e.target.value as FirmwareRecord['publishStatus'])}>{publishOptions.map(s => <option key={s}>{s}</option>)}</Select></Field>
        <Field label="URL"><Input value={f.downloadUrl} onChange={e => set('downloadUrl', e.target.value)} dir="ltr" /></Field>
      </div>
      <Field label={t('common.notes')}><Textarea rows={2} value={f.notes || ''} onChange={e => set('notes', e.target.value)} /></Field>
      <Actions onClose={onClose} />
    </form>
  )
}

export function ArticleForm({ initial, onClose }: { initial: Article; onClose: () => void }) {
  const { saveArticle, toast, t, lang } = useStore()
  const [f, setF] = useState<Article>(initial)
  const [body, setBody] = useState(() => JSON.stringify(initial.body, null, 2))
  const set = <K extends keyof Article>(key: K, value: Article[K]) => setF(prev => ({ ...prev, [key]: value }))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    let parsed: Article['body']
    try { parsed = JSON.parse(body) } catch { toast(lang === 'ar' ? 'صيغة JSON للمحتوى غير صحيحة.' : 'Article body JSON is invalid.', 'error'); return }
    await saveArticle({ ...f, body: parsed })
    toast(t('admin.saved')); onClose()
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="form-grid">
        <Field label={t('articles.title') + ' (AR)'} required><Input value={f.titleAr} onChange={e => set('titleAr', e.target.value)} /></Field>
        <Field label={t('articles.title') + ' (EN)'}><Input value={f.titleEn} onChange={e => set('titleEn', e.target.value)} /></Field>
        <Field label="Slug"><Input value={f.slug} onChange={e => set('slug', e.target.value)} dir="ltr" /></Field>
        <Field label={t('common.category')}><Select value={f.category} onChange={e => set('category', e.target.value as ArticleCategory)}>{articleCats.map(c => <option key={c}>{c}</option>)}</Select></Field>
        <Field label={t('common.date')}><Input type="date" value={f.date} onChange={e => set('date', e.target.value)} /></Field>
        <Field label={t('common.minutes')}><Input type="number" value={f.readMinutes} onChange={e => set('readMinutes', Number(e.target.value))} /></Field>
        <Field label={t('common.tags')}><Input value={f.tags.join(', ')} onChange={e => set('tags', e.target.value.split(',').map(x => x.trim()).filter(Boolean))} /></Field>
        <Field label={t('admin.status')}><Select value={f.publishStatus} onChange={e => set('publishStatus', e.target.value as Article['publishStatus'])}>{publishOptions.map(s => <option key={s}>{s}</option>)}</Select></Field>
      </div>
      <Field label={t('articles.excerpt') + ' (AR)'}><Textarea rows={2} value={f.excerptAr} onChange={e => set('excerptAr', e.target.value)} /></Field>
      <Field label={t('articles.excerpt') + ' (EN)'}><Textarea rows={2} value={f.excerptEn} onChange={e => set('excerptEn', e.target.value)} /></Field>
      <Check label={t('articles.featured')} checked={f.featured} onChange={v => set('featured', v)} />
      <Field label={lang === 'ar' ? 'محتوى المقال (JSON)' : 'Article body (JSON)'} hint="[{ heading, headingEn, paragraphs[], list[] }]"><Textarea rows={8} value={body} onChange={e => setBody(e.target.value)} dir="ltr" className="mono" /></Field>
      <Actions onClose={onClose} />
    </form>
  )
}

export function RequestForm({ initial, onClose }: { initial: MaintenanceRequest; onClose: () => void }) {
  const { updateRequest, toast, t } = useStore()
  const [f, setF] = useState<MaintenanceRequest>(initial)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateRequest(f)
    toast(t('admin.saved')); onClose()
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-readonly">
        <div><small>{t('requests.yourTicket')}</small><strong dir="ltr">{f.ticket}</strong></div>
        <div><small>{t('common.name')}</small><strong>{f.name}</strong></div>
        <div><small>{t('common.phone')}</small><strong dir="ltr">{f.phone}</strong></div>
        <div><small>{t('requests.device')}</small><strong>{f.brand} {f.model}</strong></div>
        <div><small>{t('requests.service')}</small><strong>{f.serviceType}</strong></div>
        <div><small>{t('common.status')}</small><strong>{requestStatusLabel(f.status, 'ar')}</strong></div>
      </div>
      <p className="admin-description">{f.description}</p>
      <div className="form-grid">
        <Field label={t('common.status')}><Select value={f.status} onChange={e => setF(prev => ({ ...prev, status: e.target.value as MaintenanceRequest['status'] }))}>{(['new', 'review', 'in-progress', 'waiting-parts', 'done', 'cancelled'] as const).map(s => <option key={s} value={s}>{requestStatusLabel(s, 'ar')} / {s}</option>)}</Select></Field>
        <Field label={t('requests.priority')}><Select value={f.priority} onChange={e => setF(prev => ({ ...prev, priority: e.target.value as 'normal' | 'urgent' }))}><option value="normal">normal</option><option value="urgent">urgent</option></Select></Field>
      </div>
      <Field label={t('admin.requestNotes')}><Textarea rows={4} value={f.notes || ''} onChange={e => setF(prev => ({ ...prev, notes: e.target.value }))} /></Field>
      <Actions onClose={onClose} />
    </form>
  )
}
