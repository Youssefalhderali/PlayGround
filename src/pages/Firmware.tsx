import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle, ArrowLeft, ArrowUpLeft, CheckCircle2, ExternalLink, FileWarning,
  HardDriveDownload, ListChecks, Search, ShieldCheck, Terminal,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { brands } from '../data/brands'
import { useSeo } from '../lib/hooks'
import { Badge, BrandMark, EmptyState, PageHero, Select } from '../components/ui'
import { FirmwareCard } from '../components/cards'

export default function Firmware() {
  const { data, t, lang } = useStore()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [brand, setBrand] = useState(params.get('brand') || '')
  const [status, setStatus] = useState('')
  useSeo(t('firmware.title'), t('firmware.lead'))

  const published = useMemo(() => data.firmware.filter(f => f.publishStatus === 'published'), [data.firmware])
  const brandOptions = brands.filter(b => published.some(f => f.brand === b.name))
  const filtered = useMemo(() => published.filter(f => {
    if (brand && f.brand !== brand) return false
    if (status && f.status !== status) return false
    if (query) {
      const q = query.toLowerCase()
      if (!`${f.brand} ${f.modelName} ${f.modelNumber} ${f.version} ${f.region} ${f.sourceName}`.toLowerCase().includes(q)) return false
    }
    return true
  }), [published, brand, status, query])

  const officialPortals = useMemo(() => {
    const map = new Map<string, { source: string; url: string; brands: string[] }>()
    published.forEach(f => {
      if (f.status === 'portal' && f.downloadUrl) {
        const existing = map.get(f.sourceName)
        if (existing) existing.brands.push(f.brand)
        else map.set(f.sourceName, { source: f.sourceName, url: f.downloadUrl, brands: [f.brand] })
      }
    })
    return Array.from(map.values())
  }, [published])

  const steps = [1, 2, 3, 4, 5, 6].map(n => ({ t: t(`firmware.step${n}t` as never), d: t(`firmware.step${n}d` as never) }))
  const counts = { verified: published.filter(f => f.status === 'verified').length, portal: published.filter(f => f.status === 'portal').length }

  return (
    <>
      <PageHero
        eyebrow={lang === 'ar' ? 'سوفت وير مسؤول' : 'Responsible software'}
        title={t('firmware.title')}
        lead={t('firmware.lead')}
        icon={<Terminal size={26} />}
        meta={<><Badge tone="lime" dot>{counts.verified} {t('common.verified')}</Badge><Badge tone="info">{counts.portal} {t('firmware.portal')}</Badge><Badge tone="muted">Android / Windows</Badge></>}
      />

      <div className="container page-body">
        <div className="fw-alert">
          <span className="fw-alert-icon"><AlertTriangle size={22} /></span>
          <div>
            <strong>{t('firmware.warningTitle')}</strong>
            <p>{t('firmware.warning')}</p>
          </div>
          <Link to="/articles/phone-flashing-without-losing-data" className="btn btn-outline btn-sm">{t('firmware.readGuide')} <ArrowLeft size={14} /></Link>
        </div>

        <div className="fw-section" id="records">
          <div className="section-mini-head">
            <span><HardDriveDownload size={17} />{t('firmware.records')}</span>
            <span className="muted">{published.length} {t('firmware.entries')}</span>
          </div>
          <div className="catalogue-toolbar">
            <div className="catalogue-search">
              <Search size={18} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('firmware.searchPlaceholder')} />
            </div>
            <div className="catalogue-controls">
              <Select value={brand} onChange={e => setBrand(e.target.value)} aria-label={t('common.brand')}>
                <option value="">{t('screens.allBrands')}</option>
                {brandOptions.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </Select>
              <Select value={status} onChange={e => setStatus(e.target.value)} aria-label={t('common.status')}>
                <option value="">{t('common.all')}</option>
                <option value="portal">{t('firmware.portal')}</option>
                <option value="verified">{t('common.verified')}</option>
              </Select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={<HardDriveDownload size={26} />} title={t('firmware.noResults')} text={t('firmware.noResultsText')} />
          ) : (
            <div className="fw-grid">{filtered.map(f => <FirmwareCard key={f.id} row={f} />)}</div>
          )}
          <p className="fineprint">{t('firmware.recordsNote')}</p>
        </div>

        <div className="fw-section">
          <div className="section-mini-head"><span><ShieldCheck size={17} />{t('firmware.officialPortals')}</span></div>
          <div className="portal-grid">
            {officialPortals.map(p => (
              <a key={p.source} className="portal-card" href={p.url} target="_blank" rel="noopener noreferrer">
                <span className="portal-mark"><BrandMark brand={p.brands[0]} size={34} /></span>
                <div className="portal-main">
                  <strong>{p.source}</strong>
                  <small>{Array.from(new Set(p.brands)).join(' · ')}</small>
                </div>
                <ExternalLink size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="fw-section">
          <div className="section-mini-head"><span><ListChecks size={17} />{t('firmware.checklistTitle')}</span></div>
          <div className="checklist">
            {steps.map((s, i) => (
              <div className="checklist-item" key={i}>
                <span className="check-num">{String(i + 1).padStart(2, '0')}</span>
                <div><strong>{s.t}</strong><p>{s.d}</p></div>
                <CheckCircle2 size={17} />
              </div>
            ))}
          </div>
          <div className="fw-caution">
            <FileWarning size={18} />
            <p>{t('firmware.caution')}</p>
          </div>
        </div>

        <div className="fw-cta">
          <div><Terminal size={22} /><div><strong>{t('firmware.ctaTitle')}</strong><p>{t('firmware.ctaLead')}</p></div></div>
          <div className="inline-actions">
            <Link to="/requests?service=firmware" className="btn btn-primary btn-md">{t('nav.requests')} <ArrowLeft size={15} /></Link>
            <Link to="/tools" className="btn btn-outline btn-md">{t('nav.tools')} <ArrowUpLeft size={15} /></Link>
          </div>
        </div>
      </div>
    </>
  )
}
