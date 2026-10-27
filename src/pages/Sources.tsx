import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpLeft, BookOpen, Database, ExternalLink, FileText, Image, ShieldCheck } from 'lucide-react'
import { useStore } from '../lib/store'
import { useSeo } from '../lib/hooks'
import { Badge, PageHero } from '../components/ui'

export default function Sources() {
  const { data, t, lang } = useStore()
  useSeo(t('sources.title'), t('sources.lead'))
  const ar = lang === 'ar'

  const hosts = useMemo(() => {
    const map = new Map<string, { count: number; sample: string }>()
    data.phones.forEach(p => p.sources.forEach(src => {
      let host = src
      try { host = new URL(src).hostname.replace('www.', '') } catch { /* noop */ }
      const entry = map.get(host)
      if (entry) entry.count++
      else map.set(host, { count: 1, sample: src })
    }))
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count)
  }, [data.phones])

  const datasets = [
    'https://www.kaggle.com/datasets/rajibdab/global-smartphone-database-2025',
    'https://www.kaggle.com/datasets/madajaswanth/phone-dataset-8461-phones',
    'https://www.kaggle.com/datasets/jakubkhalponiak/phones-2024',
    'https://www.kaggle.com/datasets/sady36/mobile-phones-specs',
    'https://www.kaggle.com/datasets/mayankkumarpoddar/smartprix-mobiles-dataset',
    'https://www.kaggle.com/datasets/lileejass/mobile-phone-dataset-prices-and-trend-analysis',
    'https://www.kaggle.com/datasets/abdulmalik1518/mobiles-dataset-2025',
  ]

  return (
    <>
      <PageHero
        eyebrow={ar ? 'الشفافية والمصادر' : 'Transparency and sources'}
        title={t('sources.title')}
        lead={t('sources.lead')}
        icon={<BookOpen size={26} />}
        meta={<><Badge tone="lime">{hosts.length} {ar ? 'مصدرًا ظاهرًا' : 'visible sources'}</Badge><Badge tone="muted">{ar ? 'تراخيص متعددة' : 'Mixed licenses'}</Badge></>}
      />
      <div className="container page-body">
        <div className="sources-intro">
          <div className="sources-icon"><ShieldCheck size={22} /></div>
          <div><strong>{t('sources.introTitle')}</strong><p>{t('sources.intro')}</p></div>
        </div>

        <section className="sources-section">
          <div className="section-mini-head"><span><Database size={16} />{t('sources.datasets')}</span></div>
          <p className="section-lead">{t('sources.datasetsLead')}</p>
          <div className="dataset-list">
            {datasets.map(url => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="dataset-link">
                <span>{url.replace('https://www.kaggle.com/datasets/', '').replace(/\//g, ' / ')}</span>
                <ExternalLink size={14} />
              </a>
            ))}
          </div>
          <div className="license-note">
            <FileText size={16} />
            <p>{t('sources.licenseNote')}</p>
          </div>
        </section>

        <section className="sources-section">
          <div className="section-mini-head"><span><Image size={16} />{t('sources.images')}</span></div>
          <p className="section-lead">{t('sources.imagesLead')}</p>
          <div className="two-col-note">
            <div><strong>Wikimedia Commons</strong><p>{t('sources.wikimedia')}</p></div>
            <div><strong>{ar ? 'صور الشركات' : 'Manufacturer images'}</strong><p>{t('sources.manufacturerImages')}</p></div>
          </div>
        </section>

        <section className="sources-section">
          <div className="section-mini-head"><span><Database size={16} />{t('sources.hosts')}</span><span className="muted">{hosts.length}</span></div>
          <div className="hosts-table">
            <div className="hosts-head"><span>{t('sources.host')}</span><span>{t('sources.records')}</span><span /></div>
            {hosts.slice(0, 25).map(([host, info]) => (
              <div className="hosts-row" key={host}>
                <span>{host}</span><span>{info.count}</span>
                <a href={info.sample} target="_blank" rel="noopener noreferrer" aria-label={host}><ArrowUpLeft size={14} /></a>
              </div>
            ))}
          </div>
        </section>

        <section className="sources-section">
          <div className="section-mini-head"><span><ShieldCheck size={16} />{t('sources.review')}</span></div>
          <div className="review-grid">
            {[1, 2, 3].map(n => (
              <div className="review-card" key={n}>
                <span>{String(n).padStart(2, '0')}</span>
                <strong>{t(`sources.review${n}t` as never)}</strong>
                <p>{t(`sources.review${n}d` as never)}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="source-correct">
          <div><strong>{t('sources.correctTitle')}</strong><p>{t('sources.correctLead')}</p></div>
          <Link to="/requests?type=correction" className="btn btn-primary btn-md">{t('sources.correctButton')} <ArrowLeft size={15} /></Link>
        </div>

        <div className="page-note">
          <strong>{t('sources.attributionTitle')}</strong>
          <p>{t('sources.attribution')}</p>
        </div>
      </div>
    </>
  )
}
