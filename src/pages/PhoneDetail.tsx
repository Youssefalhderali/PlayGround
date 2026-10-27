import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowUpLeft, BatteryCharging, Camera, CheckCircle2, ChevronLeft,
  ClipboardList, Cpu, ExternalLink, FileWarning, HardDriveDownload, Info,
  MemoryStick, MessageCircle, MonitorSmartphone, ScanSearch, ShieldCheck, Smartphone, Wrench,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { brandOf, compatibleParts, faultsForPhone, firmwareForPhone, phoneDisplayName, phoneShortName, specRows } from '../lib/phone'
import { availabilityLabel, formatPrice, qualityLabel, whatsappLink } from '../lib/utils'
import { useSeo } from '../lib/hooks'
import { Badge, BrandMark, Button, Card, DeviceVisual, EmptyState, SectionHeader } from '../components/ui'
import { FaultCard, PartCard, PhoneCard } from '../components/cards'
import { NotFound } from './NotFound'

export default function PhoneDetail() {
  const { id } = useParams()
  const { data, t, lang } = useStore()
  const phone = data.phones.find(p => p.id === id || p.slug === id)

  useSeo(
    phone ? `${phoneDisplayName(phone)} — ${t('phone.specs')}` : t('common.notFound'),
    phone ? `${phoneDisplayName(phone)}: ${phone.soc}, ${phone.displaySize}" ${phone.displayType}, ${phone.battery} mAh. ${t('phone.seoLead')}` : undefined,
  )

  const brand = phone ? brandOf(phone.brand) : undefined
  const faults = useMemo(() => phone ? faultsForPhone(phone) : [], [phone])
  const parts = useMemo(() => phone ? compatibleParts(data.spareParts, phone) : [], [data.spareParts, phone])
  const firmware = useMemo(() => phone ? firmwareForPhone(data.firmware, phone) : [], [data.firmware, phone])
  const prices = useMemo(() => phone ? data.screenPrices.filter(p => p.phoneId === phone.id && p.publishStatus === 'published') : [], [data.screenPrices, phone])
  const verifiedPrices = prices.filter(p => p.status === 'verified' && p.price)
  const related = useMemo(() => phone ? data.phones.filter(p => p.publishStatus === 'published' && p.id !== phone.id && (p.brand === phone.brand)).slice(0, 4) : [], [data.phones, phone])

  if (!phone) return <NotFound />

  const displayName = phoneDisplayName(phone)
  const requestUrl = `/requests?phone=${encodeURIComponent(phone.id)}&service=screen`
  const waText = lang === 'ar'
    ? `مرحبًا brxvih،\nالجهاز: ${displayName}\nرقم الموديل: ${phone.modelNumber || 'غير محدد'}\nالخدمة المطلوبة: ...\nالمشكلة: ...`
    : `Hello brxvih,\nDevice: ${displayName}\nModel: ${phone.modelNumber || 'n/a'}\nService needed: ...\nIssue: ...`
  const specs = specRows(phone)

  return (
    <div className="phone-detail">
      <div className="container">
        <nav className="breadcrumbs" aria-label="breadcrumb">
          <Link to="/">{t('nav.home')}</Link><ChevronLeft size={13} />
          <Link to="/phones">{t('nav.phones')}</Link><ChevronLeft size={13} />
          <Link to={`/phones?brand=${encodeURIComponent(phone.brand)}`}>{phone.brand}</Link><ChevronLeft size={13} />
          <span>{phoneShortName(phone)}</span>
        </nav>

        <section className="device-hero">
          <div className="device-hero-visual">
            <div className="device-hero-glow" style={{ background: brand?.accent }} aria-hidden />
            <DeviceVisual name={phoneShortName(phone)} brandName={brand?.name || phone.brand} image={phone.image} accent={brand?.accent} />
            <div className="device-hero-tags">
              <span><ShieldCheck size={14} />{phone.verification === 'manual' ? t('common.verified') : t('common.autoVerified')}</span>
              <span>{phone.year || '—'}</span>
            </div>
          </div>
          <div className="device-hero-info">
            <div className="device-brandline">
              <BrandMark brand={brand || phone.brand} size={40} />
              <div><span>{phone.brand}</span><small>{phone.series}</small></div>
              <Badge tone={phone.verification === 'manual' ? 'ok' : 'muted'}>{phone.verification === 'manual' ? t('common.verified') : t('common.autoVerified')}</Badge>
            </div>
            <h1>{phoneShortName(phone)}</h1>
            <p className="device-sub">{displayName}</p>
            <div className="device-ids">
              <div><small>{t('common.modelNumber')}</small><strong dir="ltr">{phone.modelNumber || '—'}</strong></div>
              <div><small>{t('common.codename')}</small><strong dir="ltr">{phone.codename || '—'}</strong></div>
              <div><small>{t('common.year')}</small><strong>{phone.year || '—'}</strong></div>
            </div>
            <div className="device-chips">
              <span><Cpu size={14} />{phone.soc || '—'}</span>
              <span><MonitorSmartphone size={14} />{phone.displaySize ? `${phone.displaySize}"` : '—'} {phone.refresh ? `· ${phone.refresh}Hz` : ''}</span>
              <span><BatteryCharging size={14} />{phone.battery ? `${phone.battery} mAh` : '—'}</span>
              <span><MemoryStick size={14} />{phone.ram.length ? `${phone.ram.join('/')} GB` : '—'}</span>
              <span><Camera size={14} />{phone.cameras[0] || '—'}</span>
            </div>
            <div className="device-actions">
              <Link to={requestUrl} className="btn btn-primary btn-lg"><ClipboardList size={18} />{t('phone.requestService')}</Link>
              <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg"><MessageCircle size={18} />{t('common.whatsapp')}</a>
              <Link to={`/screens?q=${encodeURIComponent(phoneShortName(phone))}`} className="btn btn-outline btn-lg"><ScanSearch size={17} />{t('phone.screenPrice')}</Link>
            </div>
            <div className="device-note">
              <Info size={15} />
              <span>{lang === 'ar' ? 'الأسعار المعروضة موثّقة أو «عند الطلب». لا نعرض سعرًا تقديريًا كأنه نهائي.' : 'Prices are verified or “on request”. No estimate is presented as final.'}</span>
            </div>
          </div>
        </section>

        <section className="detail-section">
          <SectionHeader title={t('phone.specs')} eyebrow={t('phone.officialData')} />
          <div className="spec-grid">
            {specs.map(([label, value]) => (
              <div className="spec-cell" key={label}><small>{label}</small><strong>{value || '—'}</strong></div>
            ))}
          </div>
          {(phone.softwareNotes || phone.repairNotes) && (
            <div className="detail-notes">
              {phone.softwareNotes && <div><HardDriveDownload size={17} /><div><strong>{t('phone.softwareNotes')}</strong><p>{phone.softwareNotes}</p></div></div>}
              {phone.repairNotes && <div><Wrench size={17} /><div><strong>{t('phone.repairNotes')}</strong><p>{phone.repairNotes}</p></div></div>}
            </div>
          )}
        </section>

        <section className="detail-section">
          <SectionHeader
            title={t('phone.screenPrices')}
            eyebrow={t('phone.verifiedOnly')}
            lead={lang === 'ar' ? 'تظهر الأسعار الموثّقة فقط. عدم وجود سعر لا يعني عدم توفر القطعة.' : 'Only verified prices are shown. A missing price does not mean the part is unavailable.'}
            actions={<Link to={`/screens?q=${encodeURIComponent(phoneShortName(phone))}`} className="btn btn-outline btn-sm">{t('screens.title')} <ArrowLeft size={14} /></Link>}
          />
          {verifiedPrices.length > 0 ? (
            <div className="price-cards">
              {verifiedPrices.map(pr => (
                <Card key={pr.id} className="price-card">
                  <div className="price-card-top">
                    <Badge tone="lime">{qualityLabel(pr.quality, lang)}</Badge>
                    <Badge tone="muted">{availabilityLabel(pr.availability, lang)}</Badge>
                  </div>
                  <div className="price-card-value">{formatPrice(pr.price, pr.currency, lang) || t('common.onRequest')}</div>
                  {pr.installPrice ? <div className="price-card-install">{t('screens.installFrom')} {formatPrice(pr.installPrice, pr.currency, lang)}</div> : <div className="price-card-install muted">{t('screens.installOnRequest')}</div>}
                  <div className="price-card-meta">
                    <span>{pr.city} · {pr.supplier}</span>
                    <span>{t('common.updated')}: {pr.updatedAt}</span>
                  </div>
                  <Link to={`/requests?phone=${phone.id}&service=screen&price=${pr.id}`} className="btn btn-outline btn-sm">{t('screens.book')}</Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="price-request-card">
              <span className="prc-icon"><ScanSearch size={24} /></span>
              <div><h3>{t('screens.noVerified')}</h3><p>{lang === 'ar' ? 'أرسل الطراز والجودة المطلوبة؛ سنؤكد التوفر والسعر عبر واتساب قبل أي دفع.' : 'Send the model and required quality; we confirm availability and price on WhatsApp before any payment.'}</p></div>
              <Link to={`/requests?phone=${phone.id}&service=screen`} className="btn btn-primary btn-md">{t('screens.onRequestBody')}</Link>
            </div>
          )}
          {prices.length > 0 && <p className="fineprint">{t('screens.verifiedNote')}</p>}
        </section>

        {firmware.length > 0 && (
          <section className="detail-section">
            <SectionHeader title={t('phone.firmware')} eyebrow={t('firmware.officialOnly')} actions={<Link to={`/firmware?q=${encodeURIComponent(phone.brand)}`} className="btn btn-outline btn-sm">{t('common.viewAll')} <ArrowLeft size={14} /></Link>} />
            <div className="fw-list compact">
              {firmware.map(f => (
                <div className="fw-row" key={f.id}>
                  <span className="fw-row-icon"><HardDriveDownload size={18} /></span>
                  <div className="fw-row-main"><strong>{f.version}</strong><small>{f.region} · {f.size} · {f.sourceName}</small></div>
                  <Badge tone={f.status === 'verified' ? 'ok' : 'info'} dot>{f.status === 'verified' ? t('common.verified') : t('firmware.portal')}</Badge>
                  {f.downloadUrl && <a className="btn btn-outline btn-sm" href={f.downloadUrl} target="_blank" rel="noopener noreferrer">{t('firmware.openPortal')} <ExternalLink size={13} /></a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {parts.length > 0 && (
          <section className="detail-section">
            <SectionHeader title={t('phone.parts')} eyebrow={t('phone.compatibility')} actions={<Link to={`/parts?brand=${encodeURIComponent(phone.brand)}`} className="btn btn-outline btn-sm">{t('common.viewAll')} <ArrowLeft size={14} /></Link>} />
            <div className="part-grid">{parts.map(p => <PartCard key={p.id} part={p} />)}</div>
          </section>
        )}

        {faults.length > 0 && (
          <section className="detail-section">
            <SectionHeader title={t('phone.commonFaults')} eyebrow={t('faults.safeCheck')} actions={<Link to="/faults" className="btn btn-outline btn-sm">{t('common.viewAll')} <ArrowLeft size={14} /></Link>} />
            <div className="fault-grid">{faults.map(f => <FaultCard key={f.id} fault={f} />)}</div>
          </section>
        )}

        <section className="detail-section">
          <SectionHeader title={t('phone.sources')} eyebrow={t('phone.transparency')} />
          <div className="source-panel">
            <div className="source-panel-head"><ShieldCheck size={18} /><div><strong>{t('phone.sourceNoteTitle')}</strong><p>{t('phone.sourceNote')}</p></div></div>
            <div className="source-list">
              {phone.sources.length ? phone.sources.map(src => {
                let host = src
                try { host = new URL(src).hostname.replace('www.', '') } catch { /* noop */ }
                return <a key={src} href={src} target="_blank" rel="noopener noreferrer"><span>{host}</span><ExternalLink size={13} /></a>
              }) : <span className="muted">{t('phone.noSources')}</span>}
            </div>
            <div className="source-meta">
              <span>{t('common.updated')}: {phone.updatedAt}</span>
              <span>{t('phone.dataset')}: {phone.sourceBrand}</span>
              {phone.verification === 'auto' && <span className="warn-text"><FileWarning size={13} />{t('common.autoVerified')} — {t('phone.autoNote')}</span>}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="detail-section">
            <SectionHeader title={t('phone.related')} eyebrow={phone.brand} actions={<Link to={`/phones?brand=${encodeURIComponent(phone.brand)}`} className="btn btn-outline btn-sm">{t('common.viewAll')} <ArrowLeft size={14} /></Link>} />
            <div className="phone-grid four">{related.map((p, i) => <PhoneCard key={p.id} phone={p} index={i} />)}</div>
          </section>
        )}

        <div className="detail-cta">
          <div><Smartphone size={22} /><div><strong>{t('phone.ctaTitle')}</strong><p>{t('phone.ctaLead')}</p></div></div>
          <div className="inline-actions">
            <Link to={`/requests?phone=${phone.id}`} className="btn btn-primary btn-md">{t('nav.requests')} <ArrowLeft size={15} /></Link>
            <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-md"><MessageCircle size={16} />{t('common.whatsapp')}</a>
          </div>
        </div>
      </div>
    </div>
  )
}
