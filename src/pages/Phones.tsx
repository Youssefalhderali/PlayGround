import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Filter, Plus, Search, SlidersHorizontal, Smartphone, X } from 'lucide-react'
import { useStore } from '../lib/store'
import { brands } from '../data/brands'
import { phoneDisplayName, phoneSearchFields, phoneShortName } from '../lib/phone'
import { normalize } from '../lib/utils'
import { useSeo } from '../lib/hooks'
import { Badge, BrandMark, Button, EmptyState, PageHero, Select } from '../components/ui'
import { PhoneCard } from '../components/cards'

const PAGE = 24

export default function Phones() {
  const { data, t, lang } = useStore()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [brand, setBrand] = useState(params.get('brand') || '')
  const [series, setSeries] = useState(params.get('series') || '')
  const [year, setYear] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useSeo(t('phones.title'), lang === 'ar' ? 'كتالوج موديلات الهواتف مع رقم الموديل والاسم الرمزي والمواصفات ومصادر البيانات.' : 'Phone model catalogue with model numbers, codenames, specifications, and data sources.')

  useEffect(() => { setPage(1) }, [query, brand, series, year, sort])
  useEffect(() => {
    const next = new URLSearchParams()
    if (query) next.set('q', query)
    if (brand) next.set('brand', brand)
    if (series) next.set('series', series)
    setParams(next, { replace: true })
  }, [query, brand, series, setParams])

  const published = useMemo(() => data.phones.filter(p => p.publishStatus === 'published'), [data.phones])
  const brandOptions = useMemo(() => brands.filter(b => published.some(p => p.brand === b.name)), [published])
  const seriesOptions = useMemo(() => {
    const list = published.filter(p => !brand || p.brand === brand).map(p => p.series).filter(Boolean)
    return Array.from(new Set(list)).sort()
  }, [published, brand])
  const years = useMemo(() => Array.from(new Set(published.map(p => p.year).filter((y): y is number => typeof y === 'number'))).sort((a, b) => b - a), [published])

  const filtered = useMemo(() => {
    const q = normalize(query)
    const list = published.filter(p => {
      if (brand && p.brand !== brand) return false
      if (series && p.series !== series) return false
      if (year && String(p.year) !== year) return false
      if (q && !normalize(phoneSearchFields(p)).includes(q)) return false
      return true
    })
    return list.sort((a, b) => {
      if (sort === 'az') return phoneShortName(a).localeCompare(phoneShortName(b))
      if (sort === 'za') return phoneShortName(b).localeCompare(phoneShortName(a))
      if (sort === 'oldest') return (a.year || 0) - (b.year || 0)
      if (sort === 'brand') return a.brand.localeCompare(b.brand) || phoneShortName(a).localeCompare(phoneShortName(b))
      return (b.year || 0) - (a.year || 0) || phoneShortName(a).localeCompare(phoneShortName(b))
    })
  }, [published, brand, series, year, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const current = filtered.slice((page - 1) * PAGE, page * PAGE)
  const activeCount = [query, brand, series, year].filter(Boolean).length

  const clearAll = () => { setQuery(''); setBrand(''); setSeries(''); setYear(''); setSort('newest') }

  return (
    <>
      <PageHero
        eyebrow={lang === 'ar' ? 'المكتبة التقنية' : 'Technical library'}
        title={t('phones.title')}
        lead={lang === 'ar' ? 'ابحث بالاسم، رقم الموديل، أو الاسم الرمزي. كل بطاقة تعرض مصدرها بوضوح، وما لم يُراجع يدويًا يبقى موسومًا.' : 'Search by name, model number, or codename. Every card shows its source, and unreviewed records stay clearly labelled.'}
        icon={<Smartphone size={26} />}
        meta={<><Badge tone="lime">{published.length} {t('common.model')}</Badge><Badge tone="muted">{brandOptions.length} {t('common.brand')}</Badge></>}
      />
      <div className="container page-body">
        <div className="catalogue-toolbar">
          <div className="catalogue-search">
            <Search size={18} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={lang === 'ar' ? 'مثال: SM-S928B أو Redmi Note 13 أو Odin' : 'e.g. SM-S928B, Redmi Note 13, Odin'} />
            {query && <button onClick={() => setQuery('')} aria-label="clear"><X size={15} /></button>}
          </div>
          <div className="catalogue-controls">
            <Select value={sort} onChange={e => setSort(e.target.value)} aria-label={t('common.sort')}>
              <option value="newest">{lang === 'ar' ? 'الأحدث أولًا' : 'Newest first'}</option>
              <option value="oldest">{lang === 'ar' ? 'الأقدم أولًا' : 'Oldest first'}</option>
              <option value="az">{lang === 'ar' ? 'الاسم أ – ي' : 'Name A–Z'}</option>
              <option value="za">{lang === 'ar' ? 'الاسم ي – أ' : 'Name Z–A'}</option>
              <option value="brand">{lang === 'ar' ? 'حسب العلامة' : 'By brand'}</option>
            </Select>
            <Button variant="outline" size="md" className="filter-toggle" onClick={() => setShowFilters(v => !v)}>
              <SlidersHorizontal size={16} />{t('common.filter')}{activeCount > 0 && <span className="filter-dot">{activeCount}</span>}
            </Button>
          </div>
        </div>

        <div className="catalogue-layout">
          <aside className={`catalogue-side ${showFilters ? 'open' : ''}`}>
            <div className="side-panel">
              <div className="side-head"><span><Filter size={15} />{t('common.filter')}</span>{activeCount > 0 && <button onClick={clearAll} className="text-link">{t('common.clear')}</button>}</div>
              <div className="side-group">
                <label>{t('common.brand')}</label>
                <div className="side-brands">
                  <button className={!brand ? 'active' : ''} onClick={() => { setBrand(''); setSeries('') }}>{t('common.all')}</button>
                  {brandOptions.map(b => (
                    <button key={b.id} className={brand === b.name ? 'active' : ''} onClick={() => { setBrand(b.name === brand ? '' : b.name); setSeries('') }}>
                      <BrandMark brand={b} size={22} />{b.name}
                      <span>{published.filter(p => p.brand === b.name).length}</span>
                    </button>
                  ))}
                </div>
              </div>
              {seriesOptions.length > 0 && (
                <div className="side-group">
                  <label>{t('common.series')}</label>
                  <div className="side-series">
                    <button className={!series ? 'active' : ''} onClick={() => setSeries('')}>{t('common.all')}</button>
                    {seriesOptions.slice(0, 40).map(s => <button key={s} className={series === s ? 'active' : ''} onClick={() => setSeries(s === series ? '' : s)}>{s}</button>)}
                  </div>
                </div>
              )}
              <div className="side-group">
                <label>{t('common.year')}</label>
                <Select value={year} onChange={e => setYear(e.target.value)}>
                  <option value="">{t('common.all')}</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </Select>
              </div>
              <div className="side-note">
                <strong>{lang === 'ar' ? 'ألا تجد هاتفك؟' : 'Phone not listed?'}</strong>
                <p>{lang === 'ar' ? 'أرسل الطراز أو رقم الموديل وسنضيفه بعد المراجعة.' : 'Send the model or model number and we will add it after review.'}</p>
                <Link to="/requests?type=model" className="btn btn-outline btn-sm"><Plus size={14} />{t('phones.addModel')}</Link>
              </div>
            </div>
          </aside>

          <div className="catalogue-main">
            <div className="results-line">
              <span>{filtered.length} {lang === 'ar' ? 'نتيجة' : 'results'}{brand ? ` · ${brand}` : ''}{series ? ` · ${series}` : ''}</span>
              {activeCount > 0 && <button onClick={clearAll} className="text-link"><X size={13} />{t('common.clearFilters')}</button>}
            </div>
            {current.length === 0 ? (
              <EmptyState icon={<Smartphone size={26} />} title={lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching models'} text={lang === 'ar' ? 'جرّب اسمًا أقصر أو رقم موديل، أو أرسل طلب إضافة.' : 'Try a shorter name or a model number, or request an addition.'} action={<Button onClick={clearAll} variant="outline">{t('common.clearFilters')}</Button>} />
            ) : (
              <div className="phone-grid three">
                {current.map((p, i) => <PhoneCard key={p.id} phone={p} index={i} />)}
              </div>
            )}
            {totalPages > 1 && (
              <div className="pagination">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>{t('common.prev')}</Button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1
                    if (totalPages > 9 && Math.abs(n - page) > 2 && n !== 1 && n !== totalPages) return null
                    return <button key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
                  })}
                </div>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>{t('common.next')}</Button>
              </div>
            )}
          </div>
        </div>

        <div className="page-note">
          <strong>{t('common.dataNoteTitle')}</strong>
          <p>{t('common.dataNote')} <Link to="/sources" className="text-link">{t('nav.sources')} <ArrowLeft size={13} /></Link></p>
        </div>
      </div>
    </>
  )
}
