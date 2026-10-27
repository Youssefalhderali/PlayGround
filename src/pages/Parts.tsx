import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BatteryCharging, CircleHelp, PackageSearch, Search, Wrench } from 'lucide-react'
import { useStore } from '../lib/store'
import { brands } from '../data/brands'
import { useSeo } from '../lib/hooks'
import { Badge, EmptyState, PageHero, Select } from '../components/ui'
import { PartCard } from '../components/cards'

export default function Parts() {
  const { data, t, lang } = useStore()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState(params.get('brand') || '')
  const [availability, setAvailability] = useState('')
  useSeo(t('parts.title'), t('parts.lead'))

  useEffect(() => { setBrand(params.get('brand') || '') }, [params])

  const published = useMemo(() => data.spareParts.filter(p => p.publishStatus === 'published'), [data.spareParts])
  const categories = Array.from(new Set(published.map(p => p.category)))
  const brandOptions = brands.filter(b => published.some(p => p.brands.includes(b.name)))

  const filtered = useMemo(() => published.filter(p => {
    if (category && p.category !== category) return false
    if (brand && !p.brands.includes(brand)) return false
    if (availability && p.availability !== availability) return false
    if (query) {
      const q = query.toLowerCase()
      if (!`${p.name} ${p.nameEn} ${p.category} ${p.brands.join(' ')} ${p.supplier}`.toLowerCase().includes(q)) return false
    }
    return true
  }), [published, category, brand, availability, query])

  const active = [query, category, brand, availability].filter(Boolean).length

  return (
    <>
      <PageHero
        eyebrow={lang === 'ar' ? 'مكوّنات أصلية وبدائل' : 'Genuine and alternative parts'}
        title={t('parts.title')}
        lead={t('parts.lead')}
        icon={<BatteryCharging size={26} />}
        meta={<><Badge tone="lime">{published.length} {t('common.items')}</Badge><Badge tone="muted">{categories.length} {t('parts.categories')}</Badge></>}
      />
      <div className="container page-body">
        <div className="parts-intro">
          <div className="parts-intro-icon"><PackageSearch size={22} /></div>
          <div><strong>{t('parts.introTitle')}</strong><p>{t('parts.intro')}</p></div>
          <Link to="/requests?type=part" className="btn btn-primary btn-md">{t('parts.request')} <ArrowLeft size={15} /></Link>
        </div>

        <div className="catalogue-toolbar">
          <div className="catalogue-search">
            <Search size={18} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('parts.searchPlaceholder')} />
          </div>
          <div className="catalogue-controls">
            <Select value={category} onChange={e => setCategory(e.target.value)} aria-label={t('parts.category')}>
              <option value="">{t('parts.allCategories')}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select value={brand} onChange={e => setBrand(e.target.value)} aria-label={t('common.brand')}>
              <option value="">{t('screens.allBrands')}</option>
              {brandOptions.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </Select>
            <Select value={availability} onChange={e => setAvailability(e.target.value)} aria-label={t('common.availability')}>
              <option value="">{t('common.all')}</option>
              <option value="in-stock">{lang === 'ar' ? 'متوفر' : 'In stock'}</option>
              <option value="limited">{lang === 'ar' ? 'كمية محدودة' : 'Limited'}</option>
              <option value="on-request">{lang === 'ar' ? 'عند الطلب' : 'On request'}</option>
            </Select>
          </div>
        </div>

        <div className="results-line"><span>{filtered.length} {t('common.items')}</span>{active > 0 && <button className="text-link" onClick={() => { setQuery(''); setCategory(''); setBrand(''); setAvailability('') }}>{t('common.clearFilters')}</button>}</div>

        {filtered.length === 0 ? (
          <EmptyState icon={<PackageSearch size={26} />} title={t('parts.noResults')} text={t('parts.noResultsText')} action={<Link to="/requests?type=part" className="btn btn-primary btn-sm">{t('parts.request')}</Link>} />
        ) : (
          <div className="part-grid">{filtered.map(p => <PartCard key={p.id} part={p} />)}</div>
        )}

        <div className="parts-categories">
          <div className="section-mini-head"><span>{t('parts.browseCategory')}</span><Link to="/parts" className="text-link">{t('common.viewAll')} <ArrowLeft size={13} /></Link></div>
          <div className="category-grid">
            {categories.map(c => (
              <button key={c} className={`category-tile ${category === c ? 'active' : ''}`} onClick={() => setCategory(category === c ? '' : c)}>
                <span><Wrench size={16} /></span>
                <strong>{c}</strong>
                <small>{published.filter(p => p.category === c).length} {t('common.items')}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="page-note">
          <strong><CircleHelp size={15} /> {t('parts.priceNoteTitle')}</strong>
          <p>{t('parts.priceNote')}</p>
        </div>
      </div>
    </>
  )
}
