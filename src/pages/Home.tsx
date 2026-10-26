import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowUpLeft, BatteryCharging, BookOpen, CheckCircle2, ClipboardList,
  Cpu, FileWarning, HardDriveDownload, LockKeyhole, MessageCircle, ScanSearch,
  Search, ShieldCheck, Smartphone, Terminal, Wrench, Zap, Database, BadgeCheck,
  Layers, Radio, Fingerprint, Gauge, CircleDot,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { brands } from '../data/brands'
import { faultGuides, tools } from '../data/seed'
import { useSeo } from '../lib/hooks'
import { phoneDisplayName, phoneShortName } from '../lib/phone'
import { Badge, BrandMark, Button, Card, DeviceVisual, SectionHeader, Stat } from '../components/ui'
import { ArticleCard, PhoneCard } from '../components/cards'
import { cn, formatPrice, whatsappLink } from '../lib/utils'
import type { Currency } from '../types'

const heroChips = ['Galaxy S24 Ultra', 'SM-S928B', 'Redmi Note 13 Pro', 'Pixel 8 Pro', 'Odin', 'بطارية']

function HeroDevice({ name, brand, accent }: { name: string; brand: string; accent?: string }) {
  return (
    <div className="hero-stage" aria-hidden>
      <div className="hero-orbit hero-orbit-1" />
      <div className="hero-orbit hero-orbit-2" />
      <div className="hero-stage-label top"><span className="live-dot" /> diagnostics online</div>
      <div className="hero-stage-label bottom"><ShieldCheck size={13} /> verified sources</div>
      <DeviceVisual name={name} brandName={brand} accent={accent} />
      <div className="hero-float hero-float-a">
        <span className="hf-icon"><BatteryCharging size={17} /></span>
        <span><small>battery health</small><strong>Service check</strong></span>
      </div>
      <div className="hero-float hero-float-b">
        <span className="hf-icon"><HardDriveDownload size={17} /></span>
        <span><small>firmware</small><strong>Official portal</strong></span>
      </div>
      <div className="hero-float hero-float-c">
        <span className="hf-icon"><ScanSearch size={17} /></span>
        <span><small>display price</small><strong>On request</strong></span>
      </div>
      <div className="hero-code">BRX/WHITE-BLACK<br />YEMEN · 2026</div>
    </div>
  )
}

export default function Home() {
  const { data, t, lang } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [currency] = useState<Currency>('YER')
  useSeo(
    lang === 'ar' ? 'منصة صيانة وبرمجة الهواتف' : 'Phone repair and software platform',
    lang === 'ar' ? 'مرجعك التقني لكل هاتف: صيانة، برمجة، موديلات، رومات، أسعار شاشات، قطع غيار، وأمن سيبراني.' : 'Your technical reference for every phone: repair, software, models, firmware, display prices, parts, and cybersecurity.',
  )

  const publishedPhones = useMemo(() => data.phones.filter(p => p.publishStatus === 'published'), [data.phones])
  const featured = useMemo(() => {
    const wanted = ['samsung-galaxy-s24-ultra', 'apple-iphone-15-pro-max', 'redmi-redmi-note-13-pro', 'google-google-pixel-8-pro', 'xiaomi-xiaomi-14-ultra', 'samsung-galaxy-a54']
    const hit = wanted.map(id => publishedPhones.find(p => p.id === id)).filter(Boolean)
    return [...hit, ...publishedPhones].filter((p, i, arr) => p && arr.findIndex(x => x?.id === p.id) === i).slice(0, 6)
  }, [publishedPhones])
  const sourceHosts = useMemo(() => new Set(data.phones.flatMap(p => p.sources).map(u => { try { return new URL(u).hostname } catch { return u } })).size, [data.phones])
  const guideCount = data.articles.filter(a => a.publishStatus === 'published').length + faultGuides.length
  const heroPhone = featured[0]
  const verifiedPrices = useMemo(() => data.screenPrices.filter(p => p.publishStatus === 'published' && p.status === 'verified' && p.price), [data.screenPrices])
  const priceRows = useMemo(() => {
    const rows = verifiedPrices.slice(0, 5).map(pr => ({ pr, phone: publishedPhones.find(p => p.id === pr.phoneId) }))
    if (rows.length >= 5) return rows
    const used = new Set(rows.map(r => r.phone?.id))
    for (const p of publishedPhones) {
      if (rows.length >= 5) break
      if (!used.has(p.id)) { rows.push({ pr: null, phone: p }); used.add(p.id) }
    }
    return rows
  }, [verifiedPrices, publishedPhones])
  const homeArticles = data.articles.filter(a => a.publishStatus === 'published').slice(0, 3)
  const topBrands = brands.filter(b => publishedPhones.some(p => p.brand === b.name))

  const sections = [
    { to: '/maintenance', icon: Wrench, title: t('nav.maintenance'), descAr: 'تشخيص، شاشات، بطاريات، ولوحات — بمسار واضح.', descEn: 'Diagnostics, displays, batteries, and boards with a clear workflow.', stat: `${data.spareParts.length} ${t('common.items')}` },
    { to: '/firmware', icon: Terminal, title: t('nav.firmware'), descAr: 'رومات رسمية وأدوات تفليش مع تحذيرات دقيقة.', descEn: 'Official firmware and flashing tools with precise warnings.', stat: `${data.firmware.length}`, anchor: '#records' },
    { to: '/programming', icon: Cpu, title: t('nav.programming'), descAr: 'إصلاح النظام، التحديث، والنسخ الاحتياطي.', descEn: 'System repair, updates, and backups.', stat: 'whitelisted' },
    { to: '/cybersecurity', icon: ShieldCheck, title: t('nav.cyber'), descAr: 'حماية الجهاز والحساب والشبكة — دفاعيًا.', descEn: 'Device, account, and network defence.', stat: 'lab safe' },
    { to: '/tools', icon: Wrench, title: t('nav.tools'), descAr: 'مفكات، محطات، Odin، SP Flash، ADB.', descEn: 'Drivers, stations, Odin, SP Flash, ADB.', stat: `${tools.length}` },
    { to: '/firmware', icon: HardDriveDownload, title: t('nav.firmware'), descAr: 'بوابات الشركات وسجلات متحقق منها فقط.', descEn: 'Manufacturer portals and verified records only.', stat: 'official', anchor: '#records' },
    { to: '/phones', icon: Smartphone, title: t('nav.phones'), descAr: 'رقم الموديل، الاسم الرمزي، والمواصفات.', descEn: 'Model number, codename, and specifications.', stat: `${publishedPhones.length}` },
    { to: '/screens', icon: ScanSearch, title: t('nav.screens'), descAr: 'سعر موثّق أو «عند الطلب» بلا ادعاءات.', descEn: 'Verified price or “on request” with no false claims.', stat: `${verifiedPrices.length}` },
    { to: '/parts', icon: BatteryCharging, title: t('nav.parts'), descAr: 'شاشات، بطاريات، فليكسات، وكاميرات.', descEn: 'Screens, batteries, flex cables, and cameras.', stat: `${data.spareParts.length}` },
    { to: '/faults', icon: FileWarning, title: t('nav.faults'), descAr: 'أعراض وأسباب وخطوات فحص آمنة.', descEn: 'Symptoms, causes, and safe diagnostic steps.', stat: `${faultGuides.length}` },
    { to: '/articles', icon: BookOpen, title: t('nav.articles'), descAr: 'شروحات للفني والمستخدم، بلغة واضحة.', descEn: 'Guides for technicians and users, in clear language.', stat: `${data.articles.length}` },
    { to: '/requests', icon: ClipboardList, title: t('nav.requests'), descAr: 'أرسل الطلب وتابع الحالة برقم تذكرة.', descEn: 'Send a request and track it by ticket number.', stat: '24/7' },
    { to: '/contact', icon: MessageCircle, title: t('nav.contact'), descAr: 'واتساب مباشر، اتصال، ورسالة سريعة.', descEn: 'Direct WhatsApp, call, and quick message.', stat: '+967' },
  ]

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden />
        <div className="hero-noise" aria-hidden />
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" />{t('home.eyebrow')}</div>
            <h1 className="hero-title">
              <span>{t('home.title1')}</span>
              <span className="grad">{t('home.title2')}</span>
            </h1>
            <p className="hero-lead">{t('home.lead')}</p>
            <form className="hero-search" onSubmit={submitSearch} role="search">
              <Search size={20} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('common.searchPlaceholder')} aria-label={t('common.searchPlaceholder')} />
              <Button type="submit" size="md">{t('common.search')}</Button>
            </form>
            <div className="hero-chips">
              <span className="chips-label">{lang === 'ar' ? 'شائع:' : 'Popular:'}</span>
              {heroChips.map(chip => (
                <button key={chip} className="chip" onClick={() => navigate(`/search?q=${encodeURIComponent(chip)}`)}>{chip}</button>
              ))}
            </div>
            <div className="hero-actions">
              <Link to="/requests" className="btn btn-primary btn-lg"><Wrench size={18} />{t('home.ctaRequest')}</Link>
              <Link to="/phones" className="btn btn-outline btn-lg">{t('home.ctaExplore')}<ArrowLeft size={17} /></Link>
            </div>
            <div className="hero-trust">
              <span><CheckCircle2 size={15} />{lang === 'ar' ? 'مصادر ظاهرة' : 'Visible sources'}</span>
              <span><CheckCircle2 size={15} />{lang === 'ar' ? 'لا أسعار وهمية' : 'No fake prices'}</span>
              <span><CheckCircle2 size={15} />{lang === 'ar' ? 'دعم عربي RTL' : 'Arabic RTL'}</span>
            </div>
          </div>
          <HeroDevice name={heroPhone ? phoneShortName(heroPhone) : 'Galaxy S24 Ultra'} brand="WHITE BLACK" accent={heroPhone ? brands.find(b => b.name === heroPhone.brand)?.accent : '#c9ff37'} />
        </div>
        <div className="container hero-stats">
          <Stat value={publishedPhones.length} label={t('home.statModels')} accent />
          <Stat value={topBrands.length || 20} label={t('home.statBrands')} />
          <Stat value={guideCount} label={lang === 'ar' ? 'دليل معرفي منشور' : 'published knowledge guides'} />
          <Stat value={`${sourceHosts}+`} label={t('home.statSources')} />
        </div>
      </section>

      <section className="brand-strip">
        <div className="container">
          <div className="brand-strip-head"><span>{t('home.brandsTitle')}</span><Link to="/phones" className="text-link">{t('common.viewAll')} <ArrowLeft size={14} /></Link></div>
          <div className="brand-strip-row">
            {topBrands.map(b => (
              <Link key={b.id} to={`/phones?brand=${encodeURIComponent(b.name)}`} className="brand-pill">
                <BrandMark brand={b} size={34} />
                <span><strong>{b.name}</strong><small>{publishedPhones.filter(p => p.brand === b.name).length} {t('home.brandModels')}</small></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-sections">
        <div className="container">
          <SectionHeader eyebrow={lang === 'ar' ? 'المنصة' : 'The platform'} title={t('home.sectionsTitle')} lead={t('home.sectionsLead')} />
          <div className="sections-grid">
            {sections.map((s, i) => (
              <Link key={`${s.title}-${i}`} to={`${s.to}${s.anchor || ''}`} className="section-card reveal">
                <div className="section-card-top">
                  <span className="section-card-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="section-card-icon"><s.icon size={21} /></span>
                </div>
                <h3>{s.title}</h3>
                <p>{lang === 'ar' ? s.descAr : s.descEn}</p>
                <div className="section-card-foot">
                  <span>{s.stat}</span>
                  <ArrowUpLeft size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <SectionHeader eyebrow={lang === 'ar' ? 'المكتبة' : 'Library'} title={t('home.featuredTitle')} lead={t('home.featuredLead')} actions={<Link to="/phones" className="btn btn-outline btn-sm">{t('common.viewAll')} <ArrowLeft size={15} /></Link>} />
          <div className="phone-grid">
            {featured.map((p, i) => p && <PhoneCard key={p.id} phone={p} index={i} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-feature">
          <div className="split-copy">
            <div className="eyebrow">{lang === 'ar' ? 'الشفافية' : 'Transparency'}</div>
            <h2 className="section-title">{t('home.pricesTitle')}</h2>
            <p className="section-lead">{t('home.pricesLead')}</p>
            <div className="trust-points">
              <div><span className="tp-icon"><BadgeCheck size={18} /></span><div><strong>{lang === 'ar' ? 'سعر موثّق فقط' : 'Verified prices only'}</strong><small>{lang === 'ar' ? 'يظهر مع المدينة والمورد وتاريخ التحديث.' : 'Shown with city, supplier, and update date.'}</small></div></div>
              <div><span className="tp-icon"><Database size={18} /></span><div><strong>{lang === 'ar' ? 'كتالوج يغطي كل الموديلات' : 'Catalogue for every model'}</strong><small>{lang === 'ar' ? 'غير المسعّر يبقى «عند الطلب» بدل رقم وهمي.' : 'Unpriced items stay “on request” instead of a fake number.'}</small></div></div>
              <div><span className="tp-icon"><Layers size={18} /></span><div><strong>{lang === 'ar' ? 'أصلية / خدمة / تجارية / مجددة' : 'Original / service / commercial / refurbished'}</strong><small>{lang === 'ar' ? 'قارن الجودة لا السعر وحده.' : 'Compare quality, not only price.'}</small></div></div>
            </div>
            <div className="inline-actions">
              <Link to="/screens" className="btn btn-primary btn-md">{t('screens.title')} <ArrowLeft size={16} /></Link>
              <Link to="/requests" className="btn btn-ghost btn-md">{t('screens.onRequestBody')}</Link>
            </div>
          </div>
          <Card className="price-preview">
            <div className="price-preview-head">
              <span className="pp-live"><span className="live-dot" />{lang === 'ar' ? 'كتالوج تشغيلي' : 'Operational catalogue'}</span>
              <Badge tone="muted">{currency}</Badge>
            </div>
            <div className="price-preview-table">
              <div className="ppt-head"><span>{t('screens.phone')}</span><span>{t('common.quality')}</span><span>{t('common.price')}</span></div>
              {priceRows.map(({ pr, phone }) => phone && (
                <div className="ppt-row" key={phone.id}>
                  <span className="ppt-phone"><strong>{phoneShortName(phone)}</strong><small>{phone.modelNumber || phone.series}</small></span>
                  <span>{pr ? (pr.quality === 'original' ? t('screens.original') : pr.quality === 'service-pack' ? t('screens.servicePack') : pr.quality === 'commercial' ? t('screens.commercial') : pr.quality === 'refurbished' ? t('screens.refurbished') : t('screens.used')) : '—'}</span>
                  <span className={pr ? 'ppt-price' : 'ppt-price muted'}>{pr ? (formatPrice(pr.price, pr.currency, lang, data.settings.rates, currency) || t('common.onRequest')) : t('common.onRequest')}</span>
                </div>
              ))}
            </div>
            <div className="price-preview-foot">
              <span><CircleDot size={13} />{lang === 'ar' ? 'يتحدث من لوحة التحكم' : 'Updated from the dashboard'}</span>
              <Link to="/screens" className="text-link">{t('common.viewDetails')} <ArrowUpLeft size={14} /></Link>
            </div>
          </Card>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container split-feature reverse">
          <div className="split-copy">
            <div className="eyebrow">{lang === 'ar' ? 'السوفت وير' : 'Software'}</div>
            <h2 className="section-title">{t('home.firmwareTitle')}</h2>
            <p className="section-lead">{t('home.firmwareLead')}</p>
            <div className="risk-callout">
              <FileWarning size={20} />
              <div>
                <strong>{lang === 'ar' ? 'التفليش ليس خطوة عادية' : 'Flashing is not a routine step'}</strong>
                <p>{t('firmware.warning')}</p>
              </div>
            </div>
            <div className="inline-actions">
              <Link to="/firmware" className="btn btn-primary btn-md">{t('firmware.title')} <ArrowLeft size={16} /></Link>
              <Link to="/tools" className="btn btn-ghost btn-md">{t('nav.tools')}</Link>
            </div>
          </div>
          <div className="fw-preview-stack">
            {data.firmware.filter(f => f.publishStatus === 'published').slice(0, 3).map((f, i) => (
              <div className="fw-preview-card" key={f.id}>
                <span className="fw-preview-icon"><HardDriveDownload size={20} /></span>
                <div>
                  <strong>{f.brand} — {f.modelName}</strong>
                  <small>{f.version} • {f.region} • {f.sourceName}</small>
                </div>
                <Badge tone={f.status === 'portal' ? 'info' : 'ok'} dot>{f.status === 'portal' ? t('firmware.portal') : t('common.verified')}</Badge>
              </div>
            ))}
            <div className="fw-preview-note"><LockKeyhole size={14} />{lang === 'ar' ? 'لا روابط مباشرة غير متحقق منها. المصدر ظاهر دائمًا.' : 'No unverified direct links. The source is always visible.'}</div>
          </div>
        </div>
      </section>

      <section className="section security-band">
        <div className="security-band-grid" aria-hidden />
        <div className="container">
          <div className="security-band-inner">
            <div className="security-copy">
              <div className="eyebrow"><span className="eyebrow-dot" />{lang === 'ar' ? 'دفاع لا هجوم' : 'Defence, not offence'}</div>
              <h2 className="section-title">{t('home.securityTitle')}</h2>
              <p className="section-lead">{t('home.securityLead')}</p>
              <div className="inline-actions">
                <Link to="/cybersecurity" className="btn btn-primary btn-md">{t('cyber.title')} <ArrowLeft size={16} /></Link>
                <Link to="/articles?category=security" className="btn btn-outline btn-md">{t('cyber.articles')}</Link>
              </div>
            </div>
            <div className="security-rules">
              {[
                { icon: Fingerprint, title: t('cyber.rule1'), text: t('cyber.rule1d') },
                { icon: Database, title: t('cyber.rule2'), text: t('cyber.rule2d') },
                { icon: Radio, title: t('cyber.rule3'), text: t('cyber.rule3d') },
                { icon: Gauge, title: t('cyber.rule4'), text: t('cyber.rule4d') },
              ].map((r, i) => (
                <div className="security-rule" key={i}>
                  <span className="sr-icon"><r.icon size={19} /></span>
                  <div><strong>{r.title}</strong><small>{r.text}</small></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow={lang === 'ar' ? 'الطريقة' : 'The method'} title={t('home.processTitle')} lead={t('home.processLead')} />
          <div className="process-grid">
            {[1, 2, 3, 4].map(n => (
              <div className="process-step reveal" key={n}>
                <span className="process-num">0{n}</span>
                <h3>{t(`home.step${n}t` as never)}</h3>
                <p>{t(`home.step${n}d` as never)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <SectionHeader eyebrow={lang === 'ar' ? 'المعرفة' : 'Knowledge'} title={t('home.guidesTitle')} lead={t('home.guidesLead')} actions={<Link to="/articles" className="btn btn-outline btn-sm">{t('common.viewAll')} <ArrowLeft size={15} /></Link>} />
          <div className="article-grid">
            {homeArticles.map((a, i) => <ArticleCard key={a.id} article={a} featured={i === 0} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-panel">
            <div className="cta-panel-grid" aria-hidden />
            <div className="cta-copy">
              <div className="eyebrow"><Zap size={13} />{lang === 'ar' ? 'رد قبل الدفع' : 'Clarity before payment'}</div>
              <h2>{t('home.ctaTitle')}</h2>
              <p>{t('home.ctaLead')}</p>
              <div className="inline-actions">
                <a className="btn btn-wa btn-lg" href={whatsappLink(lang === 'ar' ? 'مرحبًا brxvih، جهازي يحتاج صيانة. الطراز: ... المشكلة: ...' : 'Hello brxvih, my device needs repair. Model: ... Issue: ...')} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />{t('common.whatsapp')}</a>
                <Link to="/requests" className="btn btn-outline btn-lg">{t('nav.requests')} <ArrowLeft size={17} /></Link>
              </div>
            </div>
            <div className="cta-contact-card">
              <div className="cta-contact-head"><span className="cta-avatar">B</span><div><strong>brxvih</strong><small>{t('contact.ownerName')}</small></div></div>
              <div className="cta-contact-row"><span>{t('contact.location')}</span><strong>{t('contact.locationValue')}</strong></div>
              <div className="cta-contact-row"><span>{t('common.call')}</span><a href="tel:+967777066424">+967 777 066 424</a></div>
              <div className="cta-contact-row"><span>{t('footer.made')}</span><strong>WHITE BLACK</strong></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
