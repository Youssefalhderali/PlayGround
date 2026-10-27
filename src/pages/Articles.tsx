import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Search } from 'lucide-react'
import { useStore } from '../lib/store'
import { articleCategories } from '../data/seed'
import { useSeo } from '../lib/hooks'
import { Badge, EmptyState, PageHero } from '../components/ui'
import { ArticleCard } from '../components/cards'
import type { ArticleCategory } from '../types'

export default function Articles() {
  const { data, t, lang } = useStore()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''
  const [query, setQuery] = useState('')
  useSeo(t('articles.title'), t('articles.lead'))

  const published = useMemo(() => data.articles.filter(a => a.publishStatus === 'published'), [data.articles])
  const filtered = useMemo(() => published.filter(a => {
    if (category && a.category !== category) return false
    if (query) {
      const q = query.toLowerCase()
      if (!`${a.titleAr} ${a.titleEn} ${a.excerptAr} ${a.excerptEn} ${a.tags.join(' ')}`.toLowerCase().includes(q)) return false
    }
    return true
  }), [published, category, query])
  const featured = published.find(a => a.featured) || published[0]
  const list = category || query ? filtered : filtered.filter(a => a.id !== featured?.id)

  const setCategory = (id: string) => {
    const next = new URLSearchParams(params)
    if (id) next.set('category', id); else next.delete('category')
    setParams(next, { replace: true })
  }

  return (
    <>
      <PageHero
        eyebrow={lang === 'ar' ? 'مرجع معرفي' : 'Knowledge base'}
        title={t('articles.title')}
        lead={t('articles.lead')}
        icon={<BookOpen size={26} />}
        meta={<><Badge tone="lime">{published.length} {lang === 'ar' ? 'دليل' : 'guides'}</Badge><Badge tone="muted">{lang === 'ar' ? 'عربي أولًا' : 'Arabic first'}</Badge></>}
      />
      <div className="container page-body">
        {!category && !query && featured && (
          <Link to={`/articles/${featured.slug}`} className="feature-article">
            <div className="feature-article-bg" aria-hidden />
            <div className="feature-article-copy">
              <Badge tone="lime">{articleCategories[featured.category][lang]}</Badge>
              <h2>{lang === 'ar' ? featured.titleAr : featured.titleEn}</h2>
              <p>{lang === 'ar' ? featured.excerptAr : featured.excerptEn}</p>
              <div className="feature-article-meta">
                <span>{featured.date}</span><span>{featured.readMinutes} {t('common.minutes')}</span>
                <span className="text-link">{t('common.readMore')} <ArrowLeft size={14} /></span>
              </div>
            </div>
            <div className="feature-article-mark" aria-hidden><BookOpen size={52} /></div>
          </Link>
        )}

        <div className="article-toolbar">
          <div className="segmented">
            <button className={!category ? 'active' : ''} onClick={() => setCategory('')}>{t('common.all')}</button>
            {(Object.keys(articleCategories) as ArticleCategory[]).map(c => (
              <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{articleCategories[c][lang]}</button>
            ))}
          </div>
          <div className="catalogue-search compact">
            <Search size={17} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('articles.searchPlaceholder')} />
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState icon={<BookOpen size={26} />} title={t('articles.noResults')} text={t('articles.noResultsText')} />
        ) : (
          <div className="article-grid">{list.map(a => <ArticleCard key={a.id} article={a} />)}</div>
        )}
      </div>
    </>
  )
}
