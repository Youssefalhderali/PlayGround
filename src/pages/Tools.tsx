import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShieldAlert, ShieldCheck, Search, Wrench, XCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import { tools } from '../data/seed'
import { useSeo } from '../lib/hooks'
import { Badge, EmptyState, PageHero } from '../components/ui'
import { ToolCard } from '../components/cards'

export default function Tools() {
  const { t, lang } = useStore()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  useSeo(t('tools.title'), t('tools.lead'))

  const tabs = [
    { id: 'all', label: t('common.all') },
    { id: 'software', label: t('tools.software') },
    { id: 'hardware', label: t('tools.hardware') },
    { id: 'diagnostic', label: t('tools.diagnostic') },
  ]

  const filtered = useMemo(() => tools.filter(tool => {
    if (category !== 'all' && tool.category !== category) return false
    if (query && !`${tool.name} ${tool.descAr} ${tool.descEn} ${tool.platform}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }), [category, query])

  return (
    <>
      <PageHero
        eyebrow={lang === 'ar' ? 'العدة الصحيحة' : 'The right tool'}
        title={t('tools.title')}
        lead={t('tools.lead')}
        icon={<Wrench size={26} />}
        meta={<><Badge tone="lime">{tools.length} {t('common.items')}</Badge><Badge tone="muted">{t('tools.authorizedOnly')}</Badge></>}
      />
      <div className="container page-body">
        <div className="tools-warning">
          <ShieldAlert size={21} />
          <div><strong>{t('tools.warningTitle')}</strong><p>{t('tools.warning')}</p></div>
        </div>

        <div className="tools-toolbar">
          <div className="segmented">
            {tabs.map(tab => <button key={tab.id} className={category === tab.id ? 'active' : ''} onClick={() => setCategory(tab.id)}>{tab.label}</button>)}
          </div>
          <div className="catalogue-search compact">
            <Search size={17} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('tools.searchPlaceholder')} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Wrench size={26} />} title={t('tools.noResults')} text={t('tools.noResultsText')} />
        ) : (
          <div className="tool-grid">{filtered.map(tool => <ToolCard key={tool.id} tool={tool} />)}</div>
        )}

        <div className="tool-safety">
          <div className="tool-safety-copy">
            <Badge tone="muted">{t('tools.boundaries')}</Badge>
            <h2>{t('tools.safeTitle')}</h2>
            <p>{t('tools.safeLead')}</p>
            <Link to="/cybersecurity" className="btn btn-outline btn-md">{t('cyber.title')} <ArrowLeft size={15} /></Link>
          </div>
          <div className="safety-columns">
            <div className="safety-col ok">
              <strong><ShieldCheck size={16} />{t('tools.allowed')}</strong>
              {[1, 2, 3, 4].map(n => <p key={n}><CheckCircle2 size={14} />{t(`tools.allowed${n}` as never)}</p>)}
            </div>
            <div className="safety-col no">
              <strong><ShieldAlert size={16} />{t('tools.notAllowed')}</strong>
              {[1, 2, 3, 4].map(n => <p key={n}><XCircle size={14} />{t(`tools.denied${n}` as never)}</p>)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
