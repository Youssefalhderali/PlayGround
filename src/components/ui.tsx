import React from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'
import type { Brand } from '../types'
import { Link } from 'react-router-dom'

export function Button({
  children, variant = 'primary', size = 'md', className, loading, icon, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'subtle'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  icon?: React.ReactNode
}) {
  return (
    <button
      className={cn('btn', `btn-${variant}`, `btn-${size}`, className)}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={17} className="spin" /> : icon}
      {children}
    </button>
  )
}

export function Badge({ children, tone = 'default', dot = false, className }: {
  children: React.ReactNode
  tone?: 'default' | 'info' | 'ok' | 'warn' | 'danger' | 'accent' | 'muted' | 'lime'
  dot?: boolean
  className?: string
}) {
  return <span className={cn('badge', `badge-${tone}`, className)}>{dot && <span className="badge-dot" />}{children}</span>
}

export function Card({ children, className, hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return <div className={cn('card', hover && 'card-hover', className)}>{children}</div>
}

export function SectionHeader({ eyebrow, title, lead, actions, align = 'start' }: {
  eyebrow?: string
  title: React.ReactNode
  lead?: string
  actions?: React.ReactNode
  align?: 'start' | 'center'
}) {
  return (
    <div className={cn('section-head', align === 'center' && 'section-head-center')}>
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 className="section-title">{title}</h2>
        {lead && <p className="section-lead">{lead}</p>}
      </div>
      {actions && <div className="section-actions">{actions}</div>}
    </div>
  )
}

export function EmptyState({ icon, title, note, text, action }: { icon?: React.ReactNode; title: string; note?: string; text?: string; action?: React.ReactNode }) {
  const body = note || text
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action}
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer, size = 'md', wide = false }: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  wide?: boolean
}) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={cn('modal', `modal-${wide ? 'xl' : size}`)} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>, document.body,
  )
}

export function Field({ label, hint, required, children, className, error }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode; className?: string; error?: string
}) {
  return (
    <label className={cn('field', className, error && 'has-error')}>
      <span className="field-label">{label}{required && <em>*</em>}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn('input', className)} {...props} />
  },
)

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={cn('select-wrap', className)}>
      <select className="select" {...props}>{children}</select>
      <ChevronDown size={15} className="select-icon" />
    </span>
  )
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('input textarea', className)} {...props} />
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={cn('toggle', checked && 'on')} onClick={() => onChange(!checked)} aria-label={label}>
      <span className="toggle-thumb" />
    </button>
  )
}

export function BrandMark({ brand, size = 42, showName = false }: { brand: Brand | string; size?: number; showName?: boolean }) {
  const b = typeof brand === 'string'
    ? { name: brand, accent: '#9aa0a6', nameAr: brand } as Brand
    : brand
  const initials = b.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase()
  return (
    <span className="brand-mark-wrap">
      <span className="brand-mark" style={{ width: size, height: size, background: `linear-gradient(145deg, ${b.accent}33, ${b.accent}0d)`, borderColor: `${b.accent}55`, color: b.accent }} aria-hidden>
        {initials}
      </span>
      {showName && <span className="brand-mark-name">{b.name}</span>}
    </span>
  )
}

export function DeviceVisual({ name, brandName, image, accent, compact = false }: {
  name: string; brandName: string; image?: string; accent?: string; compact?: boolean
}) {
  const [imgOk, setImgOk] = React.useState(Boolean(image))
  React.useEffect(() => setImgOk(Boolean(image)), [image])
  return (
    <div className={cn('device-visual', compact && 'compact')} style={{ '--device-accent': accent || 'var(--accent)' } as React.CSSProperties}>
      <div className="device-glow" />
      {imgOk && image ? (
        <img src={image} alt={name} loading="lazy" referrerPolicy="no-referrer" onError={() => setImgOk(false)} className="device-photo" />
      ) : (
        <div className="device-frame" aria-hidden>
          <span className="device-camera" />
          <div className="device-screen">
            <div className="device-grid" />
            <div className="device-brand">{brandName.slice(0, 12).toUpperCase()}</div>
            <div className="device-name">{name}</div>
            <div className="device-chip">WHITE BLACK</div>
            <div className="scan-line" />
          </div>
        </div>
      )}
    </div>
  )
}

export function Stat({ value, label, accent }: { value: React.ReactNode; label: string; accent?: boolean }) {
  return (
    <div className={cn('stat', accent && 'stat-accent')}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

export function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cn('external-link', className)}>{children}</a>
}

export function TextLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return <Link to={to} className={cn('text-link', className)}>{children}</Link>
}

export function Skeleton({ className }: { className?: string }) {
  return <span className={cn('skeleton', className)} aria-hidden />
}

export function PageHero({ eyebrow, title, lead, actions, aside, icon, meta }: {
  eyebrow?: string; title: React.ReactNode; lead?: string; actions?: React.ReactNode; aside?: React.ReactNode; icon?: React.ReactNode; meta?: React.ReactNode
}) {
  return (
    <header className="page-hero">
      <div className="page-hero-grid" aria-hidden />
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          <div className="page-hero-kicker">
            {icon && <span className="page-hero-icon">{icon}</span>}
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          </div>
          <h1>{title}</h1>
          {lead && <p>{lead}</p>}
          {meta && <div className="page-hero-meta">{meta}</div>}
          {actions && <div className="page-hero-actions">{actions}</div>}
        </div>
        {aside && <div className="page-hero-aside">{aside}</div>}
      </div>
    </header>
  )
}
