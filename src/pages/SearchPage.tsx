import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronLeft, Cpu, FileWarning, HardDriveDownload, ScanSearch, Search, Smartphone, Wrench } from 'lucide-react'
import { useStore } from '../lib/store'
import { globalSearch } from '../lib/search'
import { useSeo } from '../lib/hooks'
import { Badge, EmptyState, PageHero } from '../components/ui'
import { brands } from '../data/brands'
import type { SearchHit } from '../types'

const typeMeta: Record<SearchHit['type'], { icon: typeof Search; ar: string; en: string }> = {
  phone: { icon: Smartphone, ar: 'هواتف', en: 'Phones' },
  firmware: { icon: HardDriveDownload, ar: 'فيرموير', en: 'Firmware' },
  article: { icon: BookOpen, ar: 'شروحات', en: 'Guides' },
  fault: { icon: FileWarning, ar: 'أعطال', en: 'Faults' },
  part: { icon: Wrench, ar: 'قطع غيار', en: 'Parts' },
  price: { icon: ScanSearch, ar: 'أسعار شاشات', en: 'Screen prices' },
}

export default function SearchPage() {
  const { data, t, lang } = useStore()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [type, setType] = useState('all')
  useSeo(t('search.title'), t('search.lead'))
  const ar = lang === 'ar'

  useEffect(() => { setQuery(params.get('q') || '') }, [params])

  const hits = useMemo(() => globalSearch(data, query, 50), [data, query])
  const filtered = type === 'all' ? hits : hits.filter(h => h.type === type)
  const counts = useMemo(() => hits.reduce<Record<string, number>>((acc, h) => { acc[h.type] = (acc[h.type] || 0) + 1; return acc }, {}), [hits])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = new URLSearchParams()
    if (query.trim()) next.set('q', query.trim())
    setParams(next, { replace: true })
  }

  return (
    <>
      <PageHero eyebrow={ar ? 'بحث شامل' : 'Global search'} title={t('search.title')} lead={t('search.lead')} icon={<Search size={26} />} />
      <div className="container page-body">
        <form className="search-page-form" onSubmit={submit}>
          <Search size={20} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('common.searchPlaceholder')} autoFocus />
          <button type="submit" className="btn btn-primary btn-md">{t('common.search')}</button>
        </form>

        {!query.trim() ? (
          <div className="search-empty">
            <div className="search-suggest">
              <h3>{t('search.popularBrands')}</h3>
              <div className="search-chips">{brands.slice(0, 12).map(b => <button key={b.id} onClick={() => setQuery(b.name)}>{b.name}</button>)}</div>
            </div>
            <div className="search-suggest">
              <h3>{t('search.popularModels')}</h3>
              <div className="search-chips">{['Galaxy S24 Ultra', 'iPhone 15 Pro', 'Redmi Note 13', 'Pixel 8', 'SM-A546B', 'Odin', 'FRP'].map(q => <button key={q} onClick={() => setQuery(q)}>{q}</button>)}</div>
            </div>
            <div className="search-illustration"><Search size={34} /><p>{t('search.startTyping')}</p></div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Search size={26} />} title={t('search.noResults')} text={t('search.noResultsText')} action={<Link to="/requests" className="btn btn-primary btn-sm">{t('search.requestAddition')}</Link>} />
        ) : (
          <div className="search-results">
            <div className="search-tabs">
              <button className={type === 'all' ? 'active' : ''} onClick={() => setType('all')}>{t('common.all')}<span>{hits.length}</span></button>
              {(Object.keys(typeMeta) as SearchHit['type'][]).filter(k => counts[k]).map(k => {
                const M = typeMeta[k]
                return <button key={k} className={type === k ? 'active' : ''} onClick={() => setType(k)}><M.icon size={14} />{ar ? M.ar : M.en}<span>{counts[k]}</span></button>
              })}
            </div>
            <div className="search-result-list">
              {filtered.map(hit => {
                const M = typeMeta[hit.type]
                return (
                  <Link key={`${hit.type}-${hit.id}`} to={hit.path} className="search-result">
                    <span className="sr-type-icon"><M.icon size={19} /></span>
                    <div className="sr-main">
                      <div className="sr-title"><span>{hit.title}</span>{hit.badge && <Badge tone="muted">{hit.badge}</Badge>}</div>
                      <small>{hit.subtitle}</small>
                    </div>
                    <span className="sr-type">{ar ? M.ar : M.en}</span>
                    <ChevronLeft size={16} />
                  </Link>
                )
              })}
            </div>
            <p className="fineprint">{ar ? 'النتائج من البيانات المنشورة فقط. بعض السجلات قد تكون مراجعة آليًا.' : 'Results come from published data only. Some records may be auto-reviewed.'}</p>
          </div>
        )}

        <div className="search-help">
          <Cpu size={18} />
          <p>{t('search.tip')}</p>
          <Link to="/phones" className="text-link">{t('nav.phones')} <ArrowLeft size={13} /></Link>
        </div>
      </div>
    </>
  )
}
