import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, Home, Search } from 'lucide-react'
import { useStore } from '../lib/store'
import { useSeo } from '../lib/hooks'

export function NotFound() {
  const { t, lang } = useStore()
  useSeo(t('common.notFound'), t('notfound.lead'))
  return (
    <div className="notfound container">
      <div className="notfound-code" aria-hidden>404</div>
      <span className="notfound-icon"><Compass size={26} /></span>
      <h1>{t('common.notFound')}</h1>
      <p>{t('notfound.lead')}</p>
      <div className="inline-actions center">
        <Link to="/" className="btn btn-primary btn-lg"><Home size={18} />{t('notfound.home')}</Link>
        <Link to="/search" className="btn btn-outline btn-lg"><Search size={17} />{t('common.search')}</Link>
      </div>
      <div className="notfound-links">
        <Link to="/phones">{t('nav.phones')} <ArrowLeft size={13} /></Link>
        <Link to="/firmware">{t('nav.firmware')} <ArrowLeft size={13} /></Link>
        <Link to="/requests">{t('nav.requests')} <ArrowLeft size={13} /></Link>
        <Link to="/contact">{t('nav.contact')} <ArrowLeft size={13} /></Link>
      </div>
    </div>
  )
}

export default NotFound
