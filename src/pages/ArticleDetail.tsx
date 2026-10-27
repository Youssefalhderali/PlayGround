import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpLeft, BookOpen, CalendarDays, CheckCircle2, Clock, Link2, MessageCircle, ShieldAlert } from 'lucide-react'
import { useStore } from '../lib/store'
import { articleCategories } from '../data/seed'
import { useSeo } from '../lib/hooks'
import { Badge, Button } from '../components/ui'
import { ArticleCard } from '../components/cards'
import { formatDate, whatsappLink } from '../lib/utils'
import { NotFound } from './NotFound'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { data, t, lang, toast } = useStore()
  const article = data.articles.find(a => a.slug === slug && a.publishStatus === 'published')
  useSeo(article ? (lang === 'ar' ? article.titleAr : article.titleEn) : t('common.notFound'), article ? (lang === 'ar' ? article.excerptAr : article.excerptEn) : undefined)

  const related = useMemo(() => article ? data.articles.filter(a => a.publishStatus === 'published' && a.id !== article.id && a.category === article.category).slice(0, 3) : [], [data.articles, article])

  if (!article) return <NotFound />
  const ar = lang === 'ar'
  const title = ar ? article.titleAr : article.titleEn
  const hasEnglish = article.body.some(s => s.paragraphsEn?.length)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast(t('common.copied'), 'success')
    } catch { toast(t('common.copyFailed'), 'error') }
  }

  return (
    <div className="article-page">
      <div className="container">
        <nav className="breadcrumbs">
          <Link to="/">{t('nav.home')}</Link><ArrowLeft size={12} />
          <Link to="/articles">{t('nav.articles')}</Link><ArrowLeft size={12} />
          <span>{articleCategories[article.category][lang]}</span>
        </nav>
        <article className="article-shell">
          <header className="article-head">
            <div className="article-head-meta">
              <Badge tone="lime">{articleCategories[article.category][lang]}</Badge>
              <span><CalendarDays size={13} />{formatDate(article.date, lang)}</span>
              <span><Clock size={13} />{article.readMinutes} {t('common.minutes')}</span>
            </div>
            <h1>{title}</h1>
            <p className="article-deck">{ar ? article.excerptAr : article.excerptEn}</p>
            <div className="article-tags">{article.tags.map(tag => <span key={tag}>#{tag}</span>)}</div>
            <div className="article-share">
              <a className="btn btn-wa btn-sm" href={whatsappLink(`${title}\n${window.location.href}`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} />{t('articles.share')}</a>
              <Button variant="outline" size="sm" onClick={copyLink}><Link2 size={14} />{t('articles.copyLink')}</Button>
            </div>
          </header>

          <div className="article-layout">
            <div className="article-body">
              {!ar && !hasEnglish && (
                <div className="article-lang-note"><ShieldAlert size={16} />{t('articles.arabicOnly')}</div>
              )}
              {article.body.map((section, i) => (
                <section key={i} id={`sec-${i}`}>
                  <h2>{ar ? section.heading : (section.headingEn || section.heading)}</h2>
                  {(ar ? section.paragraphs : (section.paragraphsEn || section.paragraphs)).map((p, j) => <p key={j}>{p}</p>)}
                  {section.list && <ul>{section.list.map(item => <li key={item}><CheckCircle2 size={15} />{item}</li>)}</ul>}
                </section>
              ))}
              {article.sources && article.sources.length > 0 && (
                <div className="article-sources">
                  <strong>{t('common.sources')}</strong>
                  {article.sources.map(src => <a key={src} href={src} target="_blank" rel="noopener noreferrer">{src} <ArrowUpLeft size={12} /></a>)}
                </div>
              )}
              <div className="article-disclaimer"><ShieldAlert size={16} /><p>{t('articles.disclaimer')}</p></div>
            </div>
            <aside className="article-side">
              <div className="article-toc">
                <strong><BookOpen size={15} />{t('articles.contents')}</strong>
                {article.body.map((s, i) => <a key={i} href={`#sec-${i}`}>{ar ? s.heading : (s.headingEn || s.heading)}</a>)}
              </div>
              <div className="article-side-cta">
                <strong>{t('articles.needHelp')}</strong>
                <p>{t('articles.needHelpLead')}</p>
                <Link to="/requests" className="btn btn-primary btn-sm">{t('nav.requests')} <ArrowLeft size={13} /></Link>
              </div>
            </aside>
          </div>
        </article>

        {related.length > 0 && (
          <section className="related-articles">
            <div className="section-mini-head"><span>{t('articles.related')}</span><Link to="/articles" className="text-link">{t('common.viewAll')} <ArrowLeft size={13} /></Link></div>
            <div className="article-grid">{related.map(a => <ArticleCard key={a.id} article={a} />)}</div>
          </section>
        )}
      </div>
    </div>
  )
}
