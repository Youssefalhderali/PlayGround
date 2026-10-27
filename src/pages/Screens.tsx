import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpLeft, CheckCircle2, Info, ScanSearch, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useStore } from '../lib/store'
import { brands } from '../data/brands'
import { useSeo } from '../lib/hooks'
import { availabilityLabel, formatPrice, qualityLabel } from '../lib/utils'
import { Badge, Button, EmptyState, PageHero, Select } from '../components/ui'
import type { Currency, ScreenQuality } from '../types'

const PAGE = 20
const currencies: Currency[] = ['YER', 'SAR', 'USD']
const qualities: ScreenQuality[] = ['original', 'service-pack', 'commercial', 'refurbished', 'used']

export default function Screens() {
  const { data, t, lang } = useStore()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [brand, setBrand] = useState(params.get('brand') || '')
  const [quality, setQuality] = useState('')
  const [city, setCity] = useState('')
  const [currency, setCurrency] = useState<Currency>('YER')
  const [onlyPriced, setOnlyPriced] = useState(false)
  const [page, setPage] = useState(1)
  useSeo(t('screens.title'), t('screens.seoLead'))

  useEffect(() => { setPage(1) }, [query, brand, quality, city, onlyPriced])

  const publishedPhones = useMemo(() => data.phones.filter(p => p.publishStatus === 'published'), [data.phones])
  const publishedPrices = useMemo(() => data.screenPrices.filter(p => p.publishStatus === 'published'), [data.screenPrices])
  const verified = publishedPrices.filter(p => p.status === 'verified' && p.price)
  const brandOptions = brands.filter(b => publishedPhones.some(p => p.brand === b.name))
  const cities = Array.from(new Set(publishedPrices.map(p => p.city).filter(Boolean)))

  const rows = useMemo(() => {
    const list = publishedPhones.map(phone => {
      const rec = publishedPrices.find(pr => pr.phoneId === phone.id && pr.status === 'verified' && pr.price)
      return { phone, rec }
    }).filter(r => {
      if (onlyPriced && !r.rec) return false
      if (brand && r.phone.brand !== brand) return false
      if (quality && (!r.rec || r.rec.quality !== quality)) return false
      if (city && (!r.rec || r.rec.city !== city)) return false
      if (query) {
        const q = query.toLowerCase()
        const hay = `${r.phone.brand} ${r.phone.name} ${r.phone.modelNumber} ${r.rec?.supplier || ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    return list.sort((a, b) => {
      if (a.rec && !b.rec) return -1
      if (!a.rec && b.rec) return 1
      return a.phone.brand.localeCompare(b.phone.brand) || a.phone.name.localeCompare(b.phone.name)
    })
  }, [publishedPhones, publishedPrices, onlyPriced, brand, quality, city, query])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE))
  const current = rows.slice((page - 1) * PAGE, page * PAGE)
  const rates = data.settings.rates

  const setUrl = (nextBrand: string) => {
    setBrand(nextBrand)
    const next = new URLSearchParams(params)
    if (nextBrand) next.set('brand', nextBrand); else next.delete('brand')
    setParams(next, { replace: true })
  }

  return (
    <>
      <PageHero
        eyebrow={lang === 'ar' ? 'شفافية الأسعار' : 'Price transparency'}
        title={t('screens.title')}
        lead={t('screens.lead')}
        icon={<ScanSearch size={26} />}
        meta={<><Badge tone="lime" dot>{verified.length} {t('screens.verifiedPrices')}</Badge><Badge tone="muted">{t('screens.updated')}: {data.settings.ratesUpdatedAt}</Badge></>}
      />

      <div className="container page-body">
        <div className="quality-guide">
          {[
            { q: 'original', d: t('screens.originalDesc') },
            { q: 'service-pack', d: t('screens.serviceDesc') },
            { q: 'commercial', d: t('screens.commercialDesc') },
            { q: 'refurbished', d: t('screens.refurbishedDesc') },
          ].map(({ q, d }) => (
            <div className="qg-card" key={q}>
              <span className="qg-dot" data-q={q} />
              <div><strong>{qualityLabel(q as ScreenQuality, lang)}</strong><p>{d}</p></div>
            </div>
          ))}
        </div>

        <div className="catalogue-toolbar screens-toolbar">
          <div className="catalogue-search">
            <ScanSearch size={18} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('screens.searchPlaceholder')} />
          </div>
          <div className="catalogue-controls">
            <Select value={brand} onChange={e => setUrl(e.target.value)} aria-label={t('common.brand')}>
              <option value="">{t('screens.allBrands')}</option>
              {brandOptions.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </Select>
            <Select value={quality} onChange={e => setQuality(e.target.value)} aria-label={t('common.quality')}>
              <option value="">{t('screens.allQualities')}</option>
              {qualities.map(q => <option key={q} value={q}>{qualityLabel(q, lang)}</option>)}
            </Select>
            <Select value={city} onChange={e => setCity(e.target.value)} aria-label={t('common.city')}>
              <option value="">{t('screens.allCities')}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <div className="currency-switch" role="group" aria-label={t('common.currency')}>
              {currencies.map(c => <button key={c} className={currency === c ? 'active' : ''} onClick={() => setCurrency(c)}>{c}</button>)}
            </div>
            <Button variant={onlyPriced ? 'primary' : 'outline'} size="sm" onClick={() => setOnlyPriced(v => !v)}>
              <SlidersHorizontal size={14} />{t('screens.onlyVerified')}
            </Button>
          </div>
        </div>

        <div className="rate-note"><Info size={14} />{t('screens.ratesNote')} <span dir="ltr">1 USD = {rates.SAR} SAR = {rates.YER} YER</span></div>

        {current.length === 0 ? (
          <EmptyState icon={<ScanSearch size={26} />} title={t('screens.noResults')} text={t('screens.noResultsText')} action={<Link to="/requests" className="btn btn-primary btn-sm">{t('screens.onRequestBody')}</Link>} />
        ) : (
          <div className="price-table-wrap">
            <div className="price-table">
              <div className="pt-head">
                <span>{t('screens.phone')}</span>
                <span>{t('common.quality')}</span>
                <span>{t('common.price')}</span>
                <span>{t('common.install')}</span>
                <span>{t('common.city')}</span>
                <span>{t('common.updated')}</span>
                <span />
              </div>
              {current.map(({ phone, rec }) => (
                <div className="pt-row" key={phone.id}>
                  <div className="pt-phone">
                    <Link to={`/phones/${phone.id}`}><strong>{phone.brand} {phone.name.replace(new RegExp(`^${phone.brand}\\s*`, 'i'), '')}</strong><small dir="ltr">{phone.modelNumber || phone.codename || phone.series}</small></Link>
                  </div>
                  <span>{rec ? <Badge tone="muted">{qualityLabel(rec.quality, lang)}</Badge> : <span className="muted">—</span>}</span>
                  <span className={rec ? 'pt-price' : 'pt-price muted'}>{rec ? formatPrice(rec.price, rec.currency, lang, rates, currency) : t('common.onRequest')}</span>
                  <span className={rec?.installPrice ? '' : 'muted'}>{rec?.installPrice ? formatPrice(rec.installPrice, rec.currency, lang, rates, currency) : '—'}</span>
                  <span>{rec ? rec.city : '—'}</span>
                  <span className="pt-updated">{rec ? rec.updatedAt : '—'}</span>
                  <span className="pt-action">
                    <Link to={rec ? `/requests?phone=${phone.id}&service=screen&price=${rec.id}` : `/requests?phone=${phone.id}&service=screen`} className="btn btn-outline btn-sm">
                      {rec ? t('screens.book') : t('screens.request')} <ArrowUpLeft size={13} />
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>{t('common.prev')}</Button>
            <span className="page-status">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>{t('common.next')}</Button>
          </div>
        )}

        <div className="verified-policy">
          <div className="vp-head"><ShieldCheck size={20} /><div><strong>{t('screens.policyTitle')}</strong><p>{t('screens.verifiedNote')}</p></div></div>
          <div className="vp-grid">
            <div><CheckCircle2 size={16} /><span>{t('screens.policy1')}</span></div>
            <div><CheckCircle2 size={16} /><span>{t('screens.policy2')}</span></div>
            <div><CheckCircle2 size={16} /><span>{t('screens.policy3')}</span></div>
            <div><Sparkles size={16} /><span>{t('screens.policy4')}</span></div>
          </div>
          <Link to="/requests" className="btn btn-primary btn-md">{t('screens.onRequestBody')} <ArrowLeft size={15} /></Link>
        </div>
      </div>
    </>
  )
}
