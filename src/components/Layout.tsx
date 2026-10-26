import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowUpLeft, BatteryCharging, BookOpen, ChevronDown, ClipboardList,
  Clock, Cpu, FileWarning, Home, Languages, MapPin, Menu, MessageCircle, Moon,
  Phone, Search, ShieldCheck, Smartphone, Sun, Terminal, Wrench, X, HardDriveDownload,
  CircleHelp, LockKeyhole, ScanSearch, Send, ExternalLink,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { cn, whatsappLink, phoneHref, PHONE } from '../lib/utils'
import { globalSearch } from '../lib/search'
import { useKeyboardShortcut, useReveal, useScrollTop } from '../lib/hooks'
import type { SearchHit } from '../types'
import { Badge } from './ui'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="logo" aria-label="brxvih — WHITE BLACK">
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden>
        <rect x="3.5" y="3.5" width="57" height="57" rx="17" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 17h13c7.5 0 12 4 12 10.5 0 4.3-2.1 7.2-5.7 8.8 4.5 1.3 7.2 4.5 7.2 9.2C46.5 53 41 57 32.5 57H20V17Zm8 7v9h4.8c3.2 0 5-1.7 5-4.5S36 24 32.8 24H28Zm0 16v10h5.6c3.6 0 5.6-1.9 5.6-5.1 0-3.2-2-4.9-5.7-4.9H28Z" fill="currentColor" />
        <path d="M12 51 52 13" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className="logo-text">
          <strong>brxvih<span className="logo-dot">.</span></strong>
          <small>WHITE BLACK</small>
        </span>
      )}
    </Link>
  )
}

const navGroups = [
  {
    key: 'devices', labelKey: 'nav.devices' as const, to: '/phones',
    items: [
      { to: '/phones', key: 'nav.phones' as const, icon: Smartphone, desc: 'مكتبة الموديلات والمواصفات' },
      { to: '/screens', key: 'nav.screens' as const, icon: ScanSearch, desc: 'أسعار موثقة حسب المدينة' },
      { to: '/parts', key: 'nav.parts' as const, icon: BatteryCharging, desc: 'شاشات، بطاريات، فليكسات' },
    ],
  },
  {
    key: 'software', labelKey: 'nav.software' as const, to: '/firmware',
    items: [
      { to: '/firmware', key: 'nav.firmware' as const, icon: HardDriveDownload, desc: 'بوابات رسمية وسجلات متحقق منها' },
      { to: '/tools', key: 'nav.tools' as const, icon: Terminal, desc: 'Odin, SP Flash, ADB وأدوات ورشة' },
      { to: '/programming', key: 'nav.programming' as const, icon: Cpu, desc: 'إصلاح النظام والرومات' },
    ],
  },
  {
    key: 'knowledge', labelKey: 'nav.knowledge' as const, to: '/articles',
    items: [
      { to: '/cybersecurity', key: 'nav.cyber' as const, icon: ShieldCheck, desc: 'حماية الجهاز والحسابات' },
      { to: '/faults', key: 'nav.faults' as const, icon: FileWarning, desc: 'أعراض وحلول آمنة' },
      { to: '/articles', key: 'nav.articles' as const, icon: BookOpen, desc: 'شروحات تقنية قابلة للتطبيق' },
    ],
  },
  {
    key: 'support', labelKey: 'nav.support' as const, to: '/maintenance',
    items: [
      { to: '/maintenance', key: 'nav.maintenance' as const, icon: Wrench, desc: 'خدمات صيانة وتشخيص' },
      { to: '/requests', key: 'nav.requests' as const, icon: ClipboardList, desc: 'طلب جديد ومتابعة الحالة' },
      { to: '/contact', key: 'nav.contact' as const, icon: MessageCircle, desc: 'واتساب واتصال مباشر' },
    ],
  },
]

const searchGroupLabel: Record<SearchHit['type'], string> = {
  phone: 'search.typePhone', price: 'search.typePrice', part: 'search.typePart',
  firmware: 'search.typeFirmware', article: 'search.typeArticle', fault: 'search.typeFault',
}

function ThemeLangControls() {
  const { theme, toggleTheme, lang, toggleLang, t } = useStore()
  return (
    <div className="util-controls">
      <button className="icon-btn" onClick={toggleTheme} aria-label={t('theme.toggle')} title={theme === 'dark' ? t('theme.light') : t('theme.dark')}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button className="lang-btn" onClick={toggleLang} aria-label={t('lang.label')}>
        <Languages size={16} />
        <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
      </button>
    </div>
  )
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, t, lang } = useStore()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const hits = useMemo(() => globalSearch(data, query, 4), [data, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      const id = window.setTimeout(() => inputRef.current?.focus(), 40)
      return () => window.clearTimeout(id)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  const go = useCallback((hit: SearchHit) => {
    onClose()
    navigate(hit.path)
  }, [navigate, onClose])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose() }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(v => Math.min(v + 1, hits.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(v => Math.max(v - 1, 0)) }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (hits[active]) go(hits[active])
      else if (query.trim()) { onClose(); navigate(`/search?q=${encodeURIComponent(query.trim())}`) }
    }
  }

  if (!open) return null
  return (
    <div className="search-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label={t('search.title')} onKeyDown={onKey}>
        <div className="search-panel-input">
          <Search size={20} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setActive(0) }}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
          />
          <kbd>ESC</kbd>
        </div>
        <div className="search-panel-body">
          {!query.trim() && (
            <div className="search-empty">
              <div className="search-empty-mark"><Search size={24} /></div>
              <p>{t('common.searchPlaceholder')}</p>
              <div className="search-suggestions">
                {['Galaxy S24 Ultra', 'Redmi Note 13', 'SM-S928B', 'Pixel 8 Pro', 'بطارية', 'Odin'].map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="chip">{s}</button>
                ))}
              </div>
            </div>
          )}
          {query.trim() && hits.length === 0 && (
            <div className="search-empty"><p>{t('search.noHits')}</p></div>
          )}
          {hits.length > 0 && (
            <div className="search-results-list">
              {hits.map((h, i) => (
                <React.Fragment key={`${h.type}-${h.id}`}>
                  {(i === 0 || hits[i - 1].type !== h.type) && (
                    <div className="search-group-label">{t(searchGroupLabel[h.type] as never)}</div>
                  )}
                  <button
                    className={cn('search-result', i === active && 'active')}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(h)}
                  >
                    <span className="search-result-icon">
                      {h.type === 'phone' && <Smartphone size={16} />}
                      {h.type === 'price' && <ScanSearch size={16} />}
                      {h.type === 'part' && <BatteryCharging size={16} />}
                      {h.type === 'firmware' && <HardDriveDownload size={16} />}
                      {h.type === 'article' && <BookOpen size={16} />}
                      {h.type === 'fault' && <FileWarning size={16} />}
                    </span>
                    <span className="search-result-copy">
                      <strong>{h.title}</strong>
                      <small>{h.subtitle}</small>
                    </span>
                    {h.badge && <Badge tone="muted">{h.badge}</Badge>}
                    <ArrowUpLeft size={15} className="search-result-arrow" />
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        <div className="search-panel-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> {lang === 'ar' ? 'تنقل' : 'navigate'}</span>
          <span><kbd>↵</kbd> {lang === 'ar' ? 'فتح' : 'open'}</span>
          <button onClick={() => { onClose(); navigate(`/search?q=${encodeURIComponent(query)}`) }} className="text-link">
            {t('search.viewAll')} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function MobileDrawer({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const { t } = useStore()
  const location = useLocation()
  useEffect(() => { onClose() }, [location.pathname, location.search]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!open) return null
  return (
    <div className="mobile-drawer-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <aside className="mobile-drawer" aria-label="Menu">
        <div className="drawer-head">
          <Logo />
          <button className="icon-btn" onClick={onClose} aria-label={t('common.close')}><X size={21} /></button>
        </div>
        <button className="drawer-search" onClick={() => { onClose(); onSearch() }}>
          <Search size={18} /> <span>{t('search.placeholder')}</span>
        </button>
        <nav className="drawer-nav">
          <NavLink to="/" end className="drawer-link"><Home size={18} />{t('nav.home')}</NavLink>
          {navGroups.map(group => (
            <div key={group.key} className="drawer-group">
              <div className="drawer-group-title">{t(group.labelKey)}</div>
              {group.items.map(item => (
                <NavLink key={item.to} to={item.to} className="drawer-link">
                  <item.icon size={18} />
                  <span>{t(item.key)}</span>
                  <small>{item.desc}</small>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="drawer-foot">
          <Link to="/requests" className="btn btn-primary btn-md" onClick={onClose}><Wrench size={17} />{t('nav.requests')}</Link>
          <a href={whatsappLink('مرحبًا brxvih، أحتاج مساعدة تقنية.')} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-md">
            <MessageCircle size={17} />{t('contact.whatsapp')}
          </a>
          <Link to="/admin" className="drawer-admin"><LockKeyhole size={14} />{t('nav.admin')}</Link>
        </div>
      </aside>
    </div>
  )
}

function Header({ onSearch }: { onSearch: () => void }) {
  const { t, lang } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <span className="topbar-live"><span className="live-dot" />{lang === 'ar' ? 'اليمن — خدمة تقنية' : 'Yemen — technical service'}</span>
            <a href={phoneHref()} className="topbar-link"><Phone size={12} />{PHONE}</a>
          </div>
          <div className="topbar-right">
            <span className="topbar-brand">WHITE BLACK</span>
            <span className="topbar-sep" />
            <Link to="/admin" className="topbar-link"><LockKeyhole size={12} />{t('nav.admin')}</Link>
          </div>
        </div>
      </div>
      <header className={cn('site-header', scrolled && 'scrolled')}>
        <div className="container header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            <NavLink to="/" end className={({ isActive }) => cn('nav-link', isActive && 'active')}>{t('nav.home')}</NavLink>
            {navGroups.map(group => (
              <div className="nav-group" key={group.key}>
                <NavLink to={group.to} className={({ isActive }) => cn('nav-link', isActive && 'active')}>
                  {t(group.labelKey)}
                  <ChevronDown size={13} className="nav-caret" />
                </NavLink>
                <div className="nav-dropdown">
                  <div className="nav-dropdown-head">{t(group.labelKey)}</div>
                  {group.items.map(item => (
                    <Link key={item.to} to={item.to} className="nav-dropdown-item">
                      <span className="nav-dropdown-icon"><item.icon size={18} /></span>
                      <span>
                        <strong>{t(item.key)}</strong>
                        <small>{item.desc}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="header-actions">
            <button className="search-trigger" onClick={onSearch} aria-label={t('common.search')}>
              <Search size={17} />
              <span>{t('common.search')}</span>
              <kbd>⌘K</kbd>
            </button>
            <ThemeLangControls />
            <Link to="/requests" className="btn btn-primary btn-sm header-cta">
              <Wrench size={15} />{t('nav.requests')}
            </Link>
            <button className="icon-btn menu-btn" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} onSearch={onSearch} />
    </>
  )
}

function WhatsAppFloat() {
  const { lang } = useStore()
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) return null
  return (
    <a
      className="wa-float"
      href={whatsappLink(lang === 'ar' ? 'مرحبًا brxvih، أود الاستفسار عن خدمة صيانة/قطعة غيار.' : 'Hello brxvih, I would like to ask about a repair or spare part.')}
      target="_blank" rel="noopener noreferrer"
      aria-label="WhatsApp"
    >
      <MessageCircle size={23} />
      <span>{lang === 'ar' ? 'تواصل واتساب' : 'WhatsApp'}</span>
    </a>
  )
}

function MobileNav({ onSearch }: { onSearch: () => void }) {
  const { t } = useStore()
  const location = useLocation()
  if (location.pathname.startsWith('/admin')) return null
  const items = [
    { to: '/', icon: Home, label: t('nav.home') },
    { to: '/phones', icon: Smartphone, label: t('nav.phones') },
    { to: '/screens', icon: ScanSearch, label: t('nav.screens') },
    { to: '/requests', icon: Wrench, label: t('nav.requests') },
  ]
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {items.map(item => (
        <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => cn('mobile-nav-link', isActive && 'active')}>
          <item.icon size={19} /><span>{item.label}</span>
        </NavLink>
      ))}
      <button className="mobile-nav-link" onClick={onSearch}>
        <Search size={19} /><span>{t('common.search')}</span>
      </button>
    </nav>
  )
}

function Footer() {
  const { t } = useStore()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>{t('footer.about')}</p>
            <div className="footer-contact">
              <a href={whatsappLink('مرحبًا brxvih')} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />+967 777 066 424</a>
              <span><MapPin size={16} />{t('contact.locationValue')}</span>
            </div>
            <div className="footer-badges">
              <Badge tone="accent" dot>WHITE BLACK</Badge>
              <Badge tone="muted">{t('footer.made')}</Badge>
            </div>
          </div>
          <div className="footer-col">
            <h3>{t('footer.explore')}</h3>
            <Link to="/phones">{t('nav.phones')}</Link>
            <Link to="/screens">{t('nav.screens')}</Link>
            <Link to="/parts">{t('nav.parts')}</Link>
            <Link to="/firmware">{t('nav.firmware')}</Link>
            <Link to="/tools">{t('nav.tools')}</Link>
            <Link to="/search">{t('search.title')}</Link>
          </div>
          <div className="footer-col">
            <h3>{t('footer.services')}</h3>
            <Link to="/maintenance">{t('nav.maintenance')}</Link>
            <Link to="/programming">{t('nav.programming')}</Link>
            <Link to="/cybersecurity">{t('nav.cyber')}</Link>
            <Link to="/faults">{t('nav.faults')}</Link>
            <Link to="/articles">{t('nav.articles')}</Link>
            <Link to="/requests">{t('nav.requests')}</Link>
          </div>
          <div className="footer-col">
            <h3>{t('footer.trust')}</h3>
            <Link to="/sources">{t('footer.sources')}</Link>
            <Link to="/privacy">{t('footer.privacy')}</Link>
            <Link to="/terms">{t('footer.terms')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
            <Link to="/admin">{t('nav.admin')}</Link>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">sitemap.xml <ExternalLink size={12} /></a>
          </div>
        </div>
        <div className="footer-data-note">
          <ShieldCheck size={16} />
          <p>{t('footer.dataPolicy')}</p>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} brxvih | يوسف الهدار. {t('footer.rights')}</span>
          <span className="footer-bottom-links">
            <Link to="/privacy">{t('footer.privacy')}</Link>
            <Link to="/terms">{t('footer.terms')}</Link>
            <Link to="/sources">{t('footer.sources')}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}

function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div className="toast-host" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map(t => (
        <div key={t.id} className={cn('toast', `toast-${t.kind}`)}>
          <span className="toast-dot" />
          <p>{t.message}</p>
          <button onClick={() => dismissToast(t.id)} aria-label="Dismiss"><X size={15} /></button>
        </div>
      ))}
    </div>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const openSearch = useCallback(() => setSearchOpen(true), [])
  useKeyboardShortcut(openSearch)
  useScrollTop()
  useReveal()
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">تجاوز إلى المحتوى</a>
      <Header onSearch={openSearch} />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <MobileNav onSearch={openSearch} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toasts />
    </div>
  )
}
