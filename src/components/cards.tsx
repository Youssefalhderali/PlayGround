import { Link } from 'react-router-dom'
import { ArrowUpLeft, BatteryCharging, BookOpen, CheckCircle2, Cpu, HardDriveDownload, ShieldAlert, Smartphone, Wrench } from 'lucide-react'
import type { Article, FaultGuide, FirmwareRecord, Phone, SparePart, ToolItem } from '../types'
import { useStore } from '../lib/store'
import { brandOf, batteryLabel, phoneDisplayName, phoneShortName, sizeLabel, storageLabel } from '../lib/phone'
import { Badge, BrandMark, DeviceVisual } from './ui'
import { availabilityLabel, cn, formatDate } from '../lib/utils'
import { articleCategories } from '../data/seed'

export function PhoneCard({ phone, index }: { phone: Phone; index?: number }) {
  const { lang, t } = useStore()
  const brand = brandOf(phone.brand)
  return (
    <Link to={`/phones/${phone.id}`} className="phone-card reveal" style={{ transitionDelay: index !== undefined ? `${Math.min(index, 8) * 45}ms` : undefined }}>
      <div className="phone-card-media">
        <DeviceVisual name={phoneShortName(phone)} brandName={brand?.name || phone.brand} image={phone.image} accent={brand?.accent} compact />
        <div className="phone-card-brand"><BrandMark brand={brand || phone.brand} size={34} /></div>
        <div className="phone-card-year">{phone.year || '—'}</div>
        {phone.verification === 'auto' && <span className="phone-card-review" title={t('common.autoVerified')}>{t('common.autoVerified')}</span>}
      </div>
      <div className="phone-card-body">
        <div className="phone-card-title">
          <div>
            <span className="phone-card-brandname">{brand?.name || phone.brand}</span>
            <h3>{phoneShortName(phone)}</h3>
          </div>
          <ArrowUpLeft size={17} className="phone-card-arrow" />
        </div>
        <div className="phone-card-model">{phone.modelNumber || phone.codename || phone.series}</div>
        <div className="phone-mini-specs">
          <span><Smartphone size={13} />{sizeLabel(phone)}</span>
          <span><BatteryCharging size={13} />{phone.battery ? `${phone.battery} mAh` : '—'}</span>
          <span><HardDriveDownload size={13} />{storageLabel(phone)}</span>
        </div>
        <div className="phone-card-soc"><Cpu size={13} /><span>{phone.soc || '—'}</span></div>
      </div>
    </Link>
  )
}

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const { lang, t } = useStore()
  return (
    <Link to={`/articles/${article.slug}`} className={cn('article-card', featured && 'featured', 'reveal')}>
      <div className="article-card-top">
        <Badge tone={article.category === 'security' ? 'ok' : article.category === 'fault' ? 'warn' : 'info'}>
          {articleCategories[article.category][lang]}
        </Badge>
        <span className="article-meta"><BookOpen size={13} />{article.readMinutes} {t('common.minutes')}</span>
      </div>
      <h3>{lang === 'ar' ? article.titleAr : article.titleEn}</h3>
      <p>{lang === 'ar' ? article.excerptAr : article.excerptEn}</p>
      <div className="article-card-foot">
        <span>{formatDate(article.date, lang)}</span>
        <span className="text-link">{t('common.readMore')} <ArrowUpLeft size={14} /></span>
      </div>
    </Link>
  )
}

export function FaultCard({ fault }: { fault: FaultGuide }) {
  const { lang, t } = useStore()
  const diff = fault.difficulty === 'beginner' ? t('faults.beginner') : fault.difficulty === 'intermediate' ? t('faults.intermediate') : t('faults.advanced')
  return (
    <Link to={`/faults#${fault.id}`} className="fault-card reveal">
      <div className="fault-card-head">
        <span className={cn('fault-risk', `risk-${fault.risk}`)}>
          <ShieldAlert size={15} />{lang === 'ar' ? `خطورة ${fault.risk === 'low' ? 'منخفضة' : fault.risk === 'medium' ? 'متوسطة' : 'عالية'}` : `${fault.risk} risk`}
        </span>
        <span className="fault-diff">{diff}</span>
      </div>
      <h3>{lang === 'ar' ? fault.titleAr : fault.titleEn}</h3>
      <p>{fault.symptoms.slice(0, 2).join(' • ')}</p>
      <div className="fault-card-foot">
        <span>{fault.deviceType}</span>
        <ArrowUpLeft size={15} />
      </div>
    </Link>
  )
}

export function ToolCard({ tool }: { tool: ToolItem }) {
  const { lang, t } = useStore()
  return (
    <div className="tool-card reveal">
      <div className="tool-card-head">
        <span className="tool-icon"><Wrench size={18} /></span>
        <div>
          <h3>{tool.name}</h3>
          <span className="tool-platform">{tool.platform}</span>
        </div>
        <Badge tone={tool.risk === 'high' ? 'danger' : tool.risk === 'medium' ? 'warn' : 'ok'}>
          {t('firmware.toolRisk')}: {tool.risk === 'high' ? t('tools.riskHigh') : tool.risk === 'medium' ? t('tools.riskMedium') : t('tools.riskLow')}
        </Badge>
      </div>
      <p>{lang === 'ar' ? tool.descAr : tool.descEn}</p>
      <div className="tool-card-foot">
        <span className="tool-source"><CheckCircle2 size={13} />{tool.sourceName}</span>
        {tool.url && <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">{t('tools.open')} <ArrowUpLeft size={14} /></a>}
      </div>
    </div>
  )
}

export function FirmwareCard({ row }: { row: FirmwareRecord }) {
  const { lang, t } = useStore()
  return (
    <div className="fw-card reveal">
      <div className="fw-card-head">
        <BrandMark brand={brandOf(row.brand) || row.brand} size={38} />
        <div>
          <h3>{row.brand} — {row.modelName}</h3>
          <span>{row.modelNumber || '—'}</span>
        </div>
        <Badge tone={row.status === 'verified' ? 'ok' : row.status === 'portal' ? 'info' : 'warn'} dot>
          {row.status === 'verified' ? t('common.verified') : row.status === 'portal' ? t('firmware.portal') : t('common.underReview')}
        </Badge>
      </div>
      <div className="fw-meta">
        <span><small>{t('firmware.version')}</small>{row.version}</span>
        <span><small>{t('firmware.region')}</small>{row.region}</span>
        <span><small>{t('firmware.size')}</small>{row.size}</span>
      </div>
      <div className="fw-card-foot">
        <span className="fw-source">{row.sourceName}</span>
        {row.downloadUrl && <a href={row.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">{t('firmware.openPortal')} <ArrowUpLeft size={14} /></a>}
      </div>
    </div>
  )
}

export function PartCard({ part }: { part: SparePart }) {
  const { lang, t } = useStore()
  return (
    <div className="part-card reveal">
      <div className="part-card-head">
        <span className="part-icon"><Wrench size={17} /></span>
        <div>
          <h3>{lang === 'ar' ? part.name : part.nameEn}</h3>
          <span>{part.category} • {part.quality}</span>
        </div>
        <Badge tone={part.availability === 'in-stock' ? 'ok' : part.availability === 'on-request' ? 'info' : 'muted'}>
          {availabilityLabel(part.availability, lang)}
        </Badge>
      </div>
      <div className="part-brands">
        {part.brands.slice(0, 6).map(b => <span key={b}>{b}</span>)}
      </div>
      <div className="part-card-foot">
        <span className="part-price">{part.price ? `${part.price} ${part.currency}` : t('common.onRequest')}</span>
        <Link to={`/requests?part=${encodeURIComponent(part.name)}&brand=${encodeURIComponent(part.brands[0] || '')}`} className="btn btn-outline btn-sm">{t('parts.request')}</Link>
      </div>
    </div>
  )
}
