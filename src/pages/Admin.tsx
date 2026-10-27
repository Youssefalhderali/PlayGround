import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, AlertTriangle, ArrowLeft, BookOpen, CheckCircle2, ClipboardList, Database,
  Download, Eye, FileJson, HardDriveDownload, KeyRound, Layers, LockKeyhole, LogOut,
  PackageSearch, Pencil, Plus, RefreshCcw, Search, Settings as SettingsIcon, ShieldCheck,
  Smartphone, Trash2, Upload, Users, Wrench, XCircle,
} from 'lucide-react'
import { db } from '../lib/db'
import { useStore } from '../lib/store'
import { brands } from '../data/brands'
import { useSeo } from '../lib/hooks'
import { Badge, Button, EmptyState, Field, Input, Modal, Select, Textarea } from '../components/ui'
import { ArticleForm, FirmwareForm, PartForm, PhoneForm, PriceForm, RequestForm, SupplierForm } from '../components/admin-forms'
import { downloadBlob, formatDate, requestStatusLabel, requestStatusTone, requestToWhatsApp, ticketId, toCsv, uid } from '../lib/utils'
import type { Article, AuditEntry, FirmwareRecord, MaintenanceRequest, Phone, ScreenPrice, SparePart, Supplier, UploadedFile } from '../types'

type Tab = 'overview' | 'phones' | 'screens' | 'parts' | 'suppliers' | 'firmware' | 'articles' | 'requests' | 'review' | 'transfer' | 'settings' | 'audit'

const now = () => new Date().toISOString()

const basePhone = (): Phone => ({
  id: uid('ph'), slug: '', name: '', nameAr: '', brand: brands[0].name, series: '', collection: '',
  modelNumber: '', codename: '', year: new Date().getFullYear(), soc: '', cpu: '', gpu: '', process: '',
  displayType: '', displaySize: '', resolution: '', refresh: '', ppi: '', battery: '', charging: '',
  ram: [], storage: [], os: '', network: '', sim: '', wifi: '', bluetooth: '', usb: '', ipRating: '',
  weight: '', cameras: [], image: '', sources: [], sourceBrand: 'manual', verified: false, verification: 'manual',
  releaseDate: '', updatedAt: now(), publishStatus: 'draft', softwareNotes: '', repairNotes: '',
})
const basePrice = (): ScreenPrice => ({
  id: uid('sp'), phoneId: '', phoneName: '', brand: '', modelNumber: '', displayType: '', quality: 'service-pack',
  price: null, currency: 'YER', city: '', supplier: '', updatedAt: now(), availability: 'on-request',
  installPrice: null, status: 'review', publishStatus: 'pending', notes: '',
})
const basePart = (): SparePart => ({
  id: uid('part'), name: '', nameEn: '', category: 'شاشات', brands: [], quality: 'خدمة', price: null,
  currency: 'YER', city: '', supplier: '', availability: 'on-request', updatedAt: now(), status: 'review', publishStatus: 'pending',
})
const baseSupplier = (): Supplier => ({ id: uid('sup'), name: '', city: '', phone: '', whatsapp: '', specialties: [], verified: false, notes: '' })
const baseFirmware = (): FirmwareRecord => ({
  id: uid('fw'), brand: brands[0].name, modelName: '', modelNumber: '', region: 'Global', version: '',
  androidVersion: '', fileType: 'official', size: '', downloadUrl: '', sourceName: '', sourceUrl: '',
  updatedAt: now(), verified: false, status: 'review', publishStatus: 'pending', notes: '',
})
const baseArticle = (): Article => ({
  id: uid('art'), slug: '', category: 'tutorial', titleAr: '', titleEn: '', excerptAr: '', excerptEn: '',
  body: [{ heading: 'مقدمة', headingEn: 'Introduction', paragraphs: [''] }], tags: [], readMinutes: 5,
  date: new Date().toISOString().slice(0, 10), featured: false, publishStatus: 'draft', sources: [],
})

function AuthGate() {
  const { isFirstRun, setupAdmin, unlockAdmin, t, lang, toast } = useStore()
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const ar = lang === 'ar'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (isFirstRun) {
      if (pin.length < 6) { setError(t('admin.pinShort')); return }
      if (pin !== confirm) { setError(t('admin.pinMismatch')); return }
      setBusy(true)
      await setupAdmin(pin)
      toast(ar ? 'تم إنشاء رمز الإدارة.' : 'Admin PIN created.', 'success')
      setBusy(false)
    } else {
      setBusy(true)
      const ok = await unlockAdmin(pin)
      setBusy(false)
      if (!ok) setError(t('admin.wrongPin'))
    }
  }

  return (
    <div className="admin-auth container">
      <div className="auth-card">
        <span className="auth-icon"><LockKeyhole size={26} /></span>
        <div className="eyebrow">{isFirstRun ? t('admin.setupTitle') : t('admin.loginTitle')}</div>
        <h1>{isFirstRun ? (ar ? 'أنشئ رمزًا محليًا' : 'Create a local PIN') : (ar ? 'دخول لوحة التحكم' : 'Dashboard sign-in')}</h1>
        <p>{isFirstRun ? t('admin.setupLead') : (ar ? 'أدخل رمز الإدارة للمتابعة. الجلسة تنتهي عند إغلاق التبويب أو تسجيل الخروج.' : 'Enter the admin PIN to continue. The session ends when the tab closes or you sign out.')}</p>
        <form onSubmit={submit}>
          <Field label={t('admin.pin')} required><Input type="password" value={pin} onChange={e => setPin(e.target.value)} autoComplete="current-password" inputMode="numeric" autoFocus /></Field>
          {isFirstRun && <Field label={t('admin.pinConfirm')} required><Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" inputMode="numeric" /></Field>}
          {error && <div className="auth-error"><XCircle size={15} />{error}</div>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}><KeyRound size={17} />{isFirstRun ? t('admin.createPin') : t('admin.login')}</Button>
        </form>
        <div className="auth-note"><AlertTriangle size={15} /><p>{t('admin.localWarning')}</p></div>
        <Link to="/" className="text-link">{t('notfound.home')} <ArrowLeft size={13} /></Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, tone }: { label: string; value: number | string; icon: React.ReactNode; tone?: string }) {
  return <div className={`admin-stat ${tone || ''}`}><span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></div>
}

function Overview({ setTab }: { setTab: (tab: Tab) => void }) {
  const { data, t, lang } = useStore()
  const ar = lang === 'ar'
  const pending = [
    ...data.phones.filter(p => p.publishStatus === 'pending' || p.verification === 'auto'),
    ...data.screenPrices.filter(p => p.publishStatus === 'pending' || p.status === 'review'),
    ...data.spareParts.filter(p => p.publishStatus === 'pending'),
    ...data.articles.filter(p => p.publishStatus === 'pending'),
  ]
  const open = data.requests.filter(r => !['done', 'cancelled'].includes(r.status))
  const missing = data.phones.filter(p => !p.modelNumber).length
  return (
    <div className="admin-tab-panel">
      <div className="admin-stats">
        <StatCard label={t('admin.totalPhones')} value={data.phones.length} icon={<Smartphone size={20} />} />
        <StatCard label={t('admin.totalRequests')} value={data.requests.length} icon={<ClipboardList size={20} />} />
        <StatCard label={t('admin.openRequests')} value={open.length} icon={<Activity size={20} />} tone="accent" />
        <StatCard label={t('admin.pendingReview')} value={pending.length} icon={<AlertTriangle size={20} />} tone="warn" />
      </div>
      <div className="admin-two-col">
        <div className="admin-panel">
          <div className="admin-panel-head"><strong>{t('admin.recentRequests')}</strong><button className="text-link" onClick={() => setTab('requests')}>{t('common.viewAll')}</button></div>
          {data.requests.length === 0 ? <p className="muted">{t('admin.noData')}</p> : (
            <div className="admin-mini-list">
              {data.requests.slice().reverse().slice(0, 5).map(r => (
                <div className="admin-mini-row" key={r.id}>
                  <div><strong>{r.name}</strong><small dir="ltr">{r.ticket} · {r.brand} {r.model}</small></div>
                  <Badge tone={requestStatusTone(r.status)}>{requestStatusLabel(r.status, lang)}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="admin-panel">
          <div className="admin-panel-head"><strong>{t('admin.quickActions')}</strong></div>
          <div className="quick-grid">
            <button onClick={() => setTab('phones')}><Plus size={16} />{t('admin.addPhone')}</button>
            <button onClick={() => setTab('screens')}><Plus size={16} />{t('admin.addPrice')}</button>
            <button onClick={() => setTab('firmware')}><Plus size={16} />{t('admin.addFirmware')}</button>
            <button onClick={() => setTab('transfer')}><Download size={16} />{t('admin.exportJson')}</button>
          </div>
          <div className="health-list">
            <div><span>{ar ? 'موديلات بلا رقم موديل' : 'Models without a model number'}</span><strong>{missing}</strong></div>
            <div><span>{ar ? 'سجلات مراجعة آلية' : 'Auto-reviewed records'}</span><strong>{data.phones.filter(p => p.verification === 'auto').length}</strong></div>
            <div><span>{ar ? 'أسعار شاشات منشورة' : 'Published screen prices'}</span><strong>{data.screenPrices.filter(p => p.publishStatus === 'published' && p.status === 'verified').length}</strong></div>
            <div><span>{ar ? 'مصادر مسجلة' : 'Recorded sources'}</span><strong>{data.phones.reduce((a, p) => a + p.sources.length, 0)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const tone = status === 'published' ? 'ok' : status === 'pending' ? 'warn' : status === 'archived' ? 'muted' : 'info'
  return <Badge tone={tone}>{status}</Badge>
}

function PhonesTab() {
  const { data, t, lang, savePhone, deletePhone, toast } = useStore()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Phone | null>(null)
  const ar = lang === 'ar'
  const rows = useMemo(() => data.phones.filter(p => !query || `${p.brand} ${p.name} ${p.modelNumber} ${p.codename}`.toLowerCase().includes(query.toLowerCase())).slice().reverse(), [data.phones, query])
  const remove = async (p: Phone) => { if (confirm(`${t('admin.confirmDelete')} ${p.brand} ${p.name}`)) { await deletePhone(p.id); toast(t('admin.deleted')) } }
  const toggle = async (p: Phone) => { await savePhone({ ...p, publishStatus: p.publishStatus === 'published' ? 'draft' : 'published' }) }
  return (
    <div className="admin-tab-panel">
      <div className="admin-toolbar">
        <div className="admin-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('admin.searchTable')} /></div>
        <Button onClick={() => setEditing(basePhone())}><Plus size={16} />{t('admin.addPhone')}</Button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>{t('common.model')}</th><th>{t('common.modelNumber')}</th><th>{t('common.year')}</th><th>{t('admin.status')}</th><th>{t('admin.verification')}</th><th /></tr></thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id}>
                <td><strong>{p.brand} {p.name}</strong><small>{p.soc}</small></td>
                <td dir="ltr">{p.modelNumber || '—'}</td>
                <td>{p.year || '—'}</td>
                <td><StatusBadge status={p.publishStatus} /></td>
                <td>{p.verification || 'dataset'}</td>
                <td className="row-actions">
                  <button onClick={() => setEditing(p)} title={t('common.edit')}><Pencil size={15} /></button>
                  <button onClick={() => toggle(p)} title={p.publishStatus === 'published' ? t('admin.unpublish') : t('admin.publish')}>{p.publishStatus === 'published' ? <Eye size={15} /> : <CheckCircle2 size={15} />}</button>
                  <button className="danger" onClick={() => remove(p)} title={t('common.delete')}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="fineprint">{rows.length} {t('admin.rows')}</p>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id && data.phones.some(p => p.id === editing.id) ? t('common.edit') : t('admin.addPhone')} wide>
        {editing && <PhoneForm initial={editing} onClose={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}

function PricesTab() {
  const { data, t, lang, saveScreenPrice, deleteScreenPrice, toast } = useStore()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<ScreenPrice | null>(null)
  const rows = useMemo(() => data.screenPrices.filter(p => !query || `${p.phoneName} ${p.modelNumber} ${p.city} ${p.supplier}`.toLowerCase().includes(query.toLowerCase())).slice().reverse(), [data.screenPrices, query])
  const remove = async (r: ScreenPrice) => { if (confirm(t('admin.confirmDelete'))) { await deleteScreenPrice(r.id); toast(t('admin.deleted')) } }
  return (
    <div className="admin-tab-panel">
      <div className="admin-toolbar">
        <div className="admin-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('admin.searchTable')} /></div>
        <Button onClick={() => setEditing(basePrice())}><Plus size={16} />{t('admin.addPrice')}</Button>
      </div>
      {rows.length === 0 ? <EmptyState icon={<Layers size={24} />} title={t('admin.noData')} /> : (
        <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>{t('admin.phone')}</th><th>{t('common.quality')}</th><th>{t('common.price')}</th><th>{t('common.city')}</th><th>{t('common.status')}</th><th>{t('admin.status')}</th><th /></tr></thead>
          <tbody>{rows.map(r => (
            <tr key={r.id}>
              <td><strong>{r.phoneName || '—'}</strong><small dir="ltr">{r.modelNumber}</small></td>
              <td>{r.quality}</td>
              <td>{r.price ? `${r.price} ${r.currency}` : '—'}</td>
              <td>{r.city || '—'}</td>
              <td><Badge tone={r.status === 'verified' ? 'ok' : r.status === 'review' ? 'warn' : 'muted'}>{r.status}</Badge></td>
              <td><StatusBadge status={r.publishStatus} /></td>
              <td className="row-actions"><button onClick={() => setEditing(r)}><Pencil size={15} /></button><button className="danger" onClick={() => remove(r)}><Trash2 size={15} /></button></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
      <p className="fineprint">{rows.length} {t('admin.rows')}</p>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('admin.addPrice')} wide>{editing && <PriceForm initial={editing} onClose={() => setEditing(null)} />}</Modal>
    </div>
  )
}

function PartsTab() {
  const { data, t, saveSparePart, deleteSparePart, toast, lang } = useStore()
  const [editing, setEditing] = useState<SparePart | null>(null)
  const remove = async (r: SparePart) => { if (confirm(t('admin.confirmDelete'))) { await deleteSparePart(r.id); toast(t('admin.deleted')) } }
  return (
    <div className="admin-tab-panel">
      <div className="admin-toolbar"><span className="admin-count">{data.spareParts.length} {t('admin.rows')}</span><Button onClick={() => setEditing(basePart())}><Plus size={16} />{t('admin.addPart')}</Button></div>
      <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>{t('common.name')}</th><th>{t('parts.category')}</th><th>{t('common.price')}</th><th>{t('common.availability')}</th><th>{t('admin.status')}</th><th /></tr></thead>
        <tbody>{data.spareParts.slice().reverse().map(r => (
          <tr key={r.id}>
            <td><strong>{lang === 'ar' ? r.name : r.nameEn}</strong><small>{r.brands.slice(0, 4).join(', ')}</small></td>
            <td>{r.category}</td><td>{r.price ? `${r.price} ${r.currency}` : '—'}</td><td>{r.availability}</td>
            <td><StatusBadge status={r.publishStatus} /></td>
            <td className="row-actions"><button onClick={() => setEditing(r)}><Pencil size={15} /></button><button className="danger" onClick={() => remove(r)}><Trash2 size={15} /></button></td>
          </tr>
        ))}</tbody>
      </table></div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('admin.addPart')} wide>{editing && <PartForm initial={editing} onClose={() => setEditing(null)} />}</Modal>
    </div>
  )
}

function SuppliersTab() {
  const { data, t, deleteSupplier, toast } = useStore()
  const [editing, setEditing] = useState<Supplier | null>(null)
  const remove = async (r: Supplier) => { if (confirm(t('admin.confirmDelete'))) { await deleteSupplier(r.id); toast(t('admin.deleted')) } }
  return (
    <div className="admin-tab-panel">
      <div className="admin-toolbar"><span className="admin-count">{data.suppliers.length} {t('admin.rows')}</span><Button onClick={() => setEditing(baseSupplier())}><Plus size={16} />{t('common.add')}</Button></div>
      <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>{t('common.name')}</th><th>{t('common.city')}</th><th>{t('common.phone')}</th><th>{t('common.verified')}</th><th /></tr></thead>
        <tbody>{data.suppliers.map(r => (
          <tr key={r.id}><td><strong>{r.name}</strong><small>{r.specialties.join(' · ')}</small></td><td>{r.city}</td><td dir="ltr">{r.phone}</td><td>{r.verified ? <CheckCircle2 size={16} /> : '—'}</td>
            <td className="row-actions"><button onClick={() => setEditing(r)}><Pencil size={15} /></button><button className="danger" onClick={() => remove(r)}><Trash2 size={15} /></button></td></tr>
        ))}</tbody>
      </table></div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('admin.suppliers')}>{editing && <SupplierForm initial={editing} onClose={() => setEditing(null)} />}</Modal>
    </div>
  )
}

function FirmwareTab() {
  const { data, t, deleteFirmware, toast } = useStore()
  const [editing, setEditing] = useState<FirmwareRecord | null>(null)
  const remove = async (r: FirmwareRecord) => { if (confirm(t('admin.confirmDelete'))) { await deleteFirmware(r.id); toast(t('admin.deleted')) } }
  return (
    <div className="admin-tab-panel">
      <div className="admin-toolbar"><span className="admin-count">{data.firmware.length} {t('admin.rows')}</span><Button onClick={() => setEditing(baseFirmware())}><Plus size={16} />{t('admin.addFirmware')}</Button></div>
      <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>{t('common.brand')}</th><th>{t('common.model')}</th><th>{t('firmware.version')}</th><th>{t('common.status')}</th><th>{t('admin.status')}</th><th /></tr></thead>
        <tbody>{data.firmware.slice().reverse().map(r => (
          <tr key={r.id}><td>{r.brand}</td><td><strong>{r.modelName}</strong><small>{r.region}</small></td><td dir="ltr">{r.version}</td><td><Badge tone={r.status === 'verified' ? 'ok' : r.status === 'portal' ? 'info' : 'warn'}>{r.status}</Badge></td>
            <td><StatusBadge status={r.publishStatus} /></td><td className="row-actions"><button onClick={() => setEditing(r)}><Pencil size={15} /></button><button className="danger" onClick={() => remove(r)}><Trash2 size={15} /></button></td></tr>
        ))}</tbody>
      </table></div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('admin.addFirmware')} wide>{editing && <FirmwareForm initial={editing} onClose={() => setEditing(null)} />}</Modal>
    </div>
  )
}

function ArticlesTab() {
  const { data, t, lang, deleteArticle, toast } = useStore()
  const [editing, setEditing] = useState<Article | null>(null)
  const remove = async (r: Article) => { if (confirm(t('admin.confirmDelete'))) { await deleteArticle(r.id); toast(t('admin.deleted')) } }
  return (
    <div className="admin-tab-panel">
      <div className="admin-toolbar"><span className="admin-count">{data.articles.length} {t('admin.rows')}</span><Button onClick={() => setEditing(baseArticle())}><Plus size={16} />{t('admin.addArticle')}</Button></div>
      <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>{t('articles.title')}</th><th>{t('common.category')}</th><th>{t('common.date')}</th><th>{t('admin.status')}</th><th /></tr></thead>
        <tbody>{data.articles.slice().reverse().map(r => (
          <tr key={r.id}><td><strong>{lang === 'ar' ? r.titleAr : r.titleEn}</strong><small dir="ltr">/{r.slug}</small></td><td>{r.category}</td><td>{r.date}</td><td><StatusBadge status={r.publishStatus} /></td>
            <td className="row-actions"><button onClick={() => setEditing(r)}><Pencil size={15} /></button><button className="danger" onClick={() => remove(r)}><Trash2 size={15} /></button></td></tr>
        ))}</tbody>
      </table></div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('admin.addArticle')} wide>{editing && <ArticleForm initial={editing} onClose={() => setEditing(null)} />}</Modal>
    </div>
  )
}

function RequestsTab() {
  const { data, t, lang, updateRequest, deleteRequest, toast } = useStore()
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState<MaintenanceRequest | null>(null)
  const rows = data.requests.filter(r => !status || r.status === status).slice().reverse()
  const changeStatus = async (r: MaintenanceRequest, s: string) => { await updateRequest({ ...r, status: s as MaintenanceRequest['status'] }); toast(t('admin.saved')) }
  const remove = async (r: MaintenanceRequest) => { if (confirm(t('admin.confirmDelete'))) { await deleteRequest(r.id); toast(t('admin.deleted')) } }
  return (
    <div className="admin-tab-panel">
      <div className="admin-toolbar">
        <Select value={status} onChange={e => setStatus(e.target.value)} className="admin-filter"><option value="">{t('common.all')}</option>{(['new', 'review', 'in-progress', 'waiting-parts', 'done', 'cancelled'] as const).map(s => <option key={s} value={s}>{requestStatusLabel(s, lang)}</option>)}</Select>
        <span className="admin-count">{rows.length} {t('admin.rows')}</span>
      </div>
      {rows.length === 0 ? <EmptyState icon={<ClipboardList size={24} />} title={t('admin.noData')} text={lang === 'ar' ? 'ستظهر طلبات العملاء هنا بعد إرسالها من نموذج الطلب في هذا المتصفح.' : 'Customer requests will appear here after submission from the request form in this browser.'} /> : (
        <div className="admin-table-wrap"><table className="admin-table requests-table">
          <thead><tr><th>{t('requests.yourTicket')}</th><th>{t('common.name')}</th><th>{t('requests.device')}</th><th>{t('requests.service')}</th><th>{t('common.status')}</th><th /></tr></thead>
          <tbody>{rows.map(r => (
            <tr key={r.id}>
              <td><strong dir="ltr">{r.ticket}</strong><small>{formatDate(r.createdAt, lang)}</small></td>
              <td><strong>{r.name}</strong><small dir="ltr">{r.phone}</small></td>
              <td>{r.brand} {r.model}<small>{r.city}</small></td>
              <td>{r.serviceType}{r.priority === 'urgent' && <Badge tone="danger">urgent</Badge>}</td>
              <td><Select value={r.status} onChange={e => changeStatus(r, e.target.value)} className="status-select">{(['new', 'review', 'in-progress', 'waiting-parts', 'done', 'cancelled'] as const).map(s => <option key={s} value={s}>{requestStatusLabel(s, lang)}</option>)}</Select></td>
              <td className="row-actions">
                <button onClick={() => setEditing(r)} title={t('common.edit')}><Pencil size={15} /></button>
                <a href={requestToWhatsApp(r, lang)} target="_blank" rel="noopener noreferrer" title="WhatsApp"><ArrowLeft size={15} /></a>
                <button className="danger" onClick={() => remove(r)}><Trash2 size={15} /></button>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('admin.requests')} wide>{editing && <RequestForm initial={editing} onClose={() => setEditing(null)} />}</Modal>
    </div>
  )
}

function ReviewTab() {
  const { data, t, lang, savePhone, saveScreenPrice, saveSparePart, saveArticle, toast } = useStore()
  const ar = lang === 'ar'
  const phoneQueue = data.phones.filter(p => p.publishStatus === 'pending' || p.verification === 'auto')
  const priceQueue = data.screenPrices.filter(p => p.publishStatus === 'pending' || p.status === 'review')
  const partQueue = data.spareParts.filter(p => p.publishStatus === 'pending')
  const articleQueue = data.articles.filter(p => p.publishStatus === 'pending')
  const total = phoneQueue.length + priceQueue.length + partQueue.length + articleQueue.length
  return (
    <div className="admin-tab-panel">
      <div className="review-intro"><ShieldCheck size={20} /><p>{ar ? 'راجع المصدر والسعر قبل النشر. اعتماد سعر يتطلب رقمًا أكبر من صفر؛ وإلا يُنشر كـ«عند الطلب».' : 'Review the source and price before publishing. Approving a price requires a number above zero; otherwise it is published as “on request”.'}</p></div>
      {total === 0 ? <EmptyState icon={<CheckCircle2 size={24} />} title={t('admin.reviewEmpty')} /> : (
        <div className="review-queue">
          {phoneQueue.slice(0, 20).map(p => (
            <div className="queue-row" key={p.id}><Badge tone="warn">phone</Badge><div><strong>{p.brand} {p.name}</strong><small dir="ltr">{p.modelNumber || 'no model number'} · {p.sources.length} sources</small></div><Button size="sm" variant="outline" onClick={async () => { await savePhone({ ...p, verification: 'manual', verified: true, publishStatus: 'published' }); toast(t('admin.saved')) }}>{t('admin.approve')}</Button></div>
          ))}
          {priceQueue.map(p => (
            <div className="queue-row" key={p.id}><Badge tone="warn">price</Badge><div><strong>{p.phoneName} — {p.price ? `${p.price} ${p.currency}` : 'on request'}</strong><small>{p.quality} · {p.city || '—'} · {p.supplier || '—'}</small></div><Button size="sm" variant="outline" onClick={async () => { await saveScreenPrice({ ...p, status: p.price ? 'verified' : 'on-request', publishStatus: 'published' }); toast(t('admin.saved')) }}>{t('admin.approve')}</Button></div>
          ))}
          {partQueue.map(p => (
            <div className="queue-row" key={p.id}><Badge tone="warn">part</Badge><div><strong>{p.name}</strong><small>{p.category} · {p.price ? `${p.price} ${p.currency}` : '—'}</small></div><Button size="sm" variant="outline" onClick={async () => { await saveSparePart({ ...p, publishStatus: 'published' }); toast(t('admin.saved')) }}>{t('admin.approve')}</Button></div>
          ))}
          {articleQueue.map(p => (
            <div className="queue-row" key={p.id}><Badge tone="warn">article</Badge><div><strong>{ar ? p.titleAr : p.titleEn}</strong><small>{p.category} · {p.date}</small></div><Button size="sm" variant="outline" onClick={async () => { await saveArticle({ ...p, publishStatus: 'published' }); toast(t('admin.saved')) }}>{t('admin.approve')}</Button></div>
          ))}
        </div>
      )}
    </div>
  )
}

function TransferTab() {
  const { data, t, lang, createBackup, restoreBackup, resetAll, uploadFile, deleteStoredFile, downloadStoredFile, toast } = useStore()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const importRef = useRef<HTMLInputElement>(null)
  const ar = lang === 'ar'

  const loadFiles = async () => setFiles(await db.files.toArray())
  useEffect(() => { loadFiles() }, [])

  const exportJson = async () => {
    const payload = await createBackup()
    downloadBlob(JSON.stringify(payload, null, 2), `brxvih-backup-${new Date().toISOString().slice(0, 10)}.json`)
    toast(t('admin.csvExported'))
  }
  const exportCsv = () => {
    downloadBlob(toCsv(data.phones as unknown as Record<string, unknown>[]), 'brxvih-phones.csv', 'text/csv;charset=utf-8')
    toast(t('admin.csvExported'))
  }
  const importFile = async (file: File) => {
    if (!confirm(t('admin.importWarning'))) return
    try {
      const payload = JSON.parse(await file.text())
      await restoreBackup(payload)
      await loadFiles()
      toast(t('admin.imported'))
    } catch { toast(t('admin.importError'), 'error') }
  }
  const reset = async () => { if (confirm(t('admin.confirmReset')) && confirm(t('admin.resetWarning'))) { await resetAll(); await loadFiles(); toast(t('admin.saved')) } }
  const upload = async (file: File) => {
    try { await uploadFile(file); await loadFiles(); toast(t('admin.saved')) }
    catch (e) { toast(e instanceof Error && e.message === 'FILE_TOO_LARGE' ? t('admin.fileTooLarge') : t('admin.importError'), 'error') }
  }

  return (
    <div className="admin-tab-panel">
      <div className="transfer-grid">
        <div className="admin-panel"><div className="admin-panel-head"><strong>{t('admin.exportJson')}</strong></div><p>{ar ? 'نسخة كاملة من البيانات والملفات بصيغة JSON قابلة للاستيراد.' : 'A complete JSON backup of data and files, ready for import.'}</p><div className="inline-actions"><Button onClick={exportJson}><Download size={15} />JSON</Button><Button variant="outline" onClick={exportCsv}><FileJson size={15} />CSV</Button></div></div>
        <div className="admin-panel"><div className="admin-panel-head"><strong>{t('admin.importJson')}</strong></div><p>{t('admin.importWarning')}</p><Button variant="outline" onClick={() => importRef.current?.click()}><Upload size={15} />{t('admin.importJson')}</Button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={e => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = '' }} /></div>
        <div className="admin-panel"><div className="admin-panel-head"><strong>{t('admin.fileUpload')}</strong></div><p>{ar ? 'ملفات محلية للاستخدام الإداري (حتى 20 ميجابايت). لا تُنشر تلقائيًا.' : 'Local files for admin use (up to 20 MB). They are not published automatically.'}</p><Button variant="outline" onClick={() => inputRef.current?.click()}><Upload size={15} />{t('admin.attachFile')}</Button><input ref={inputRef} type="file" hidden onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }} /></div>
        <div className="admin-panel danger-panel"><div className="admin-panel-head"><strong>{t('admin.reset')}</strong></div><p>{t('admin.resetWarning')}</p><Button variant="outline" onClick={reset}><RefreshCcw size={15} />{t('admin.reset')}</Button></div>
      </div>
      <div className="admin-panel">
        <div className="admin-panel-head"><strong>{ar ? 'الملفات المحلية' : 'Local files'}</strong><span className="muted">{files.length}</span></div>
        {files.length === 0 ? <p className="muted">{t('admin.noData')}</p> : <div className="file-list">{files.map(f => (
          <div className="file-row" key={f.id}><HardDriveDownload size={17} /><div><strong>{f.name}</strong><small>{(f.size / 1024).toFixed(1)} KB · {f.createdAt.slice(0, 10)}</small></div><Button size="sm" variant="ghost" onClick={() => downloadStoredFile(f.id)}>{t('common.download')}</Button><button className="danger icon-btn" onClick={async () => { await deleteStoredFile(f.id); await loadFiles() }}><Trash2 size={15} /></button></div>
        ))}</div>}
      </div>
    </div>
  )
}

function SettingsTab() {
  const { data, t, lang, saveSettings, changePin, toast } = useStore()
  const ar = lang === 'ar'
  const [form, setForm] = useState({ displayName: data.settings.displayName, whatsapp: data.settings.whatsapp, maintenanceMode: data.settings.maintenanceMode, USD: data.settings.rates.USD, SAR: data.settings.rates.SAR, YER: data.settings.rates.YER })
  const [pin, setPin] = useState({ current: '', next: '', confirm: '' })
  const [pinMsg, setPinMsg] = useState('')

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveSettings({ displayName: form.displayName, whatsapp: form.whatsapp, maintenanceMode: form.maintenanceMode, rates: { USD: Number(form.USD), SAR: Number(form.SAR), YER: Number(form.YER) }, ratesUpdatedAt: new Date().toISOString().slice(0, 10) })
    toast(t('admin.saved'))
  }
  const updatePin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPinMsg('')
    if (pin.next.length < 6) { setPinMsg(t('admin.pinShort')); return }
    if (pin.next !== pin.confirm) { setPinMsg(t('admin.pinMismatch')); return }
    const ok = await changePin(pin.current, pin.next)
    if (!ok) { setPinMsg(t('admin.wrongPin')); return }
    setPin({ current: '', next: '', confirm: '' }); setPinMsg(ar ? 'تم تغيير الرمز.' : 'PIN changed.')
  }

  return (
    <div className="admin-tab-panel">
      <div className="admin-two-col">
        <form className="admin-panel" onSubmit={save}>
          <div className="admin-panel-head"><strong>{t('admin.settings')}</strong></div>
          <Field label={t('admin.displayName')}><Input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} /></Field>
          <Field label={t('admin.whatsappNumber')}><Input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} dir="ltr" /></Field>
          <div className="admin-form-section"><h4>{t('admin.rates')}</h4><p className="fineprint">{t('admin.ratesNote')}</p><div className="form-grid three">
            <Field label="USD"><Input type="number" step="0.01" value={form.USD} onChange={e => setForm(f => ({ ...f, USD: Number(e.target.value) }))} /></Field>
            <Field label="SAR"><Input type="number" step="0.01" value={form.SAR} onChange={e => setForm(f => ({ ...f, SAR: Number(e.target.value) }))} /></Field>
            <Field label="YER"><Input type="number" step="0.01" value={form.YER} onChange={e => setForm(f => ({ ...f, YER: Number(e.target.value) }))} /></Field>
          </div></div>
          <label className="admin-check"><input type="checkbox" checked={form.maintenanceMode} onChange={e => setForm(f => ({ ...f, maintenanceMode: e.target.checked }))} /><span>{t('admin.maintenanceMode')}</span></label>
          <Button type="submit"><CheckCircle2 size={15} />{t('common.save')}</Button>
        </form>
        <div className="admin-panel">
          <div className="admin-panel-head"><strong>{t('admin.adminPin')}</strong></div>
          <form onSubmit={updatePin}>
            <Field label={t('admin.currentPin')}><Input type="password" value={pin.current} onChange={e => setPin(p => ({ ...p, current: e.target.value }))} /></Field>
            <Field label={t('admin.newPin')}><Input type="password" value={pin.next} onChange={e => setPin(p => ({ ...p, next: e.target.value }))} /></Field>
            <Field label={t('admin.pinConfirm')}><Input type="password" value={pin.confirm} onChange={e => setPin(p => ({ ...p, confirm: e.target.value }))} /></Field>
            {pinMsg && <p className="fineprint">{pinMsg}</p>}
            <Button type="submit" variant="outline"><KeyRound size={15} />{t('admin.changePin')}</Button>
          </form>
          <div className="data-location"><Database size={15} /><div><small>{t('admin.dataLocation')}</small><strong>{t('admin.dataLocationValue')}</strong></div></div>
        </div>
      </div>
    </div>
  )
}

function AuditTab() {
  const { data, t, lang } = useStore()
  const rows = data.audit.slice().reverse()
  return (
    <div className="admin-tab-panel">
      {rows.length === 0 ? <EmptyState icon={<Activity size={24} />} title={t('admin.auditEmpty')} /> : (
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{t('common.date')}</th><th>{t('common.action')}</th><th>{t('common.entity')}</th><th>{t('common.notes')}</th></tr></thead>
          <tbody>{rows.map((a: AuditEntry) => <tr key={a.id}><td>{formatDate(a.at, lang)}</td><td><Badge tone={a.action === 'delete' ? 'danger' : a.action === 'create' ? 'ok' : 'muted'}>{a.action}</Badge></td><td>{a.entity}<small dir="ltr">{a.entityId}</small></td><td>{a.note || '—'}</td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  )
}

export default function Admin() {
  const { lang, t, adminUnlocked, lockAdmin, isFirstRun, ready } = useStore()
  const [tab, setTab] = useState<Tab>('overview')
  useSeo(t('admin.title'), t('admin.localWarning'))
  const ar = lang === 'ar'

  if (!ready) return <div className="container page-body"><p className="muted">{t('common.loading')}</p></div>
  if (isFirstRun || !adminUnlocked) return <AuthGate />

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: t('admin.overview'), icon: <Activity size={16} /> },
    { id: 'phones', label: t('admin.phones'), icon: <Smartphone size={16} /> },
    { id: 'screens', label: t('admin.screens'), icon: <Layers size={16} /> },
    { id: 'parts', label: t('admin.parts'), icon: <PackageSearch size={16} /> },
    { id: 'suppliers', label: t('admin.suppliers'), icon: <Users size={16} /> },
    { id: 'firmware', label: t('admin.firmware'), icon: <HardDriveDownload size={16} /> },
    { id: 'articles', label: t('admin.articles'), icon: <BookOpen size={16} /> },
    { id: 'requests', label: t('admin.requests'), icon: <ClipboardList size={16} /> },
    { id: 'review', label: t('admin.review'), icon: <ShieldCheck size={16} /> },
    { id: 'transfer', label: t('admin.transfer'), icon: <Database size={16} /> },
    { id: 'settings', label: t('admin.settings'), icon: <SettingsIcon size={16} /> },
    { id: 'audit', label: t('admin.audit'), icon: <Activity size={16} /> },
  ]

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-head">
          <div><span className="eyebrow"><span className="eyebrow-dot" />{ar ? 'جلسة محلية' : 'Local session'}</span><h1>{t('admin.title')}</h1><p className="muted">{t('admin.localWarning')}</p></div>
          <div className="inline-actions">
            <Link to="/" className="btn btn-ghost btn-sm">{ar ? 'عرض الموقع' : 'View site'} <ArrowLeft size={14} /></Link>
            <Button variant="outline" size="sm" onClick={lockAdmin}><LogOut size={14} />{t('admin.logout')}</Button>
          </div>
        </div>

        <div className="admin-tabs">
          {tabs.map(item => <button key={item.id} className={tab === item.id ? 'admin-tab active' : 'admin-tab'} onClick={() => setTab(item.id)}>{item.icon}{item.label}{item.id === 'review' ? '' : ''}</button>)}
        </div>

        {tab === 'overview' && <Overview setTab={setTab} />}
        {tab === 'phones' && <PhonesTab />}
        {tab === 'screens' && <PricesTab />}
        {tab === 'parts' && <PartsTab />}
        {tab === 'suppliers' && <SuppliersTab />}
        {tab === 'firmware' && <FirmwareTab />}
        {tab === 'articles' && <ArticlesTab />}
        {tab === 'requests' && <RequestsTab />}
        {tab === 'review' && <ReviewTab />}
        {tab === 'transfer' && <TransferTab />}
        {tab === 'settings' && <SettingsTab />}
        {tab === 'audit' && <AuditTab />}
      </div>
    </div>
  )
}
