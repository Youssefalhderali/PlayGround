import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ChevronDown, FileWarning, Search, ShieldAlert, Wrench } from 'lucide-react'
import { useStore } from '../lib/store'
import { faultGuides } from '../data/seed'
import { useSeo } from '../lib/hooks'
import { Badge, EmptyState, PageHero, Select } from '../components/ui'

export default function Faults() {
  const { t, lang } = useStore()
  const location = useLocation()
  const [open, setOpen] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [risk, setRisk] = useState('')
  useSeo(t('faults.title'), t('faults.lead'))
  const ar = lang === 'ar'

  useEffect(() => {
    if (location.hash) setOpen(location.hash.slice(1))
  }, [location.hash])

  const filtered = useMemo(() => faultGuides.filter(f => {
    if (risk && f.risk !== risk) return false
    if (query && !`${f.titleAr} ${f.titleEn} ${f.symptoms.join(' ')} ${f.causes.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }), [query, risk])

  return (
    <>
      <PageHero
        eyebrow={ar ? 'أعطال شائعة' : 'Common faults'}
        title={t('faults.title')}
        lead={t('faults.lead')}
        icon={<FileWarning size={26} />}
        meta={<><Badge tone="lime">{faultGuides.length} {ar ? 'دليل عطل' : 'fault guides'}</Badge><Badge tone="muted">{ar ? 'فحص آمن أولًا' : 'Safe checks first'}</Badge></>}
      />
      <div className="container page-body">
        <div className="faults-warning">
          <ShieldAlert size={20} />
          <p>{t('faults.disclaimer')}</p>
        </div>
        <div className="catalogue-toolbar">
          <div className="catalogue-search">
            <Search size={18} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('faults.searchPlaceholder')} />
          </div>
          <div className="catalogue-controls">
            <Select value={risk} onChange={e => setRisk(e.target.value)}>
              <option value="">{ar ? 'كل مستويات الخطورة' : 'All risk levels'}</option>
              <option value="low">{ar ? 'منخفضة' : 'Low'}</option>
              <option value="medium">{ar ? 'متوسطة' : 'Medium'}</option>
              <option value="high">{ar ? 'عالية' : 'High'}</option>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<FileWarning size={26} />} title={t('faults.noResults')} text={t('faults.noResultsText')} />
        ) : (
          <div className="fault-accordion">
            {filtered.map(f => {
              const isOpen = open === f.id
              return (
                <div className={`fault-item ${isOpen ? 'open' : ''}`} id={f.id} key={f.id}>
                  <button className="fault-item-head" onClick={() => setOpen(isOpen ? null : f.id)} aria-expanded={isOpen}>
                    <span className={`fault-risk-badge risk-${f.risk}`}><AlertTriangle size={14} />{f.risk === 'low' ? (ar ? 'منخفض' : 'Low') : f.risk === 'medium' ? (ar ? 'متوسط' : 'Medium') : (ar ? 'عالي' : 'High')}</span>
                    <span className="fault-item-title">{ar ? f.titleAr : f.titleEn}</span>
                    <span className="fault-device">{f.deviceType}</span>
                    <ChevronDown size={18} className="fault-chev" />
                  </button>
                  {isOpen && (
                    <div className="fault-item-body">
                      <div className="fault-columns">
                        <div>
                          <h4>{ar ? 'الأعراض' : 'Symptoms'}</h4>
                          <ul>{f.symptoms.map(s => <li key={s}>{s}</li>)}</ul>
                          <h4>{ar ? 'الأسباب المحتملة' : 'Likely causes'}</h4>
                          <ul>{f.causes.map(c => <li key={c}>{c}</li>)}</ul>
                          <h4>{t('faults.toolsNeeded')}</h4>
                          <div className="fault-tools">{f.tools.map(tool => <span key={tool}><Wrench size={12} />{tool}</span>)}</div>
                        </div>
                        <div>
                          <h4>{t('faults.safeSteps')}</h4>
                          <ol>{f.steps.map(s => <li key={s}>{s}</li>)}</ol>
                        </div>
                      </div>
                      <div className="fault-item-foot">
                        <span>{t('faults.difficulty')}: {f.difficulty === 'beginner' ? t('faults.beginner') : f.difficulty === 'intermediate' ? t('faults.intermediate') : t('faults.advanced')}</span>
                        <Link to={`/requests?service=diagnostic&issue=${encodeURIComponent(ar ? f.titleAr : f.titleEn)}`} className="btn btn-primary btn-sm">{t('faults.requestHelp')} <ArrowLeft size={14} /></Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="fault-cta">
          <FileWarning size={21} />
          <div><strong>{ar ? 'العطل ليس في القائمة؟' : 'Fault not listed?'}</strong><p>{ar ? 'أرسل وصفًا دقيقًا للأعراض، ومتى بدأت، وما جربته. التشخيص يبدأ بالاستماع.' : 'Send precise symptoms, when they began, and what you have tried. Diagnosis starts with listening.'}</p></div>
          <Link to="/requests" className="btn btn-outline btn-md">{t('nav.requests')} <ArrowLeft size={15} /></Link>
        </div>
      </div>
    </>
  )
}
