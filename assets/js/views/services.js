import { t, getLang, nf, df } from '../i18n.js'
import { store, content, serviceTitle, serviceDesc, firmwareNote, brandDisplay } from '../data.js'
import { icon, esc, pageHeader, breadcrumb, emptyState, toast, copyText, safeUrl } from '../ui.js'
import { serviceIcons, hashFor } from '../shared.js'

const SERVICE_DETAILS = {
  repair: {
    ar: { included: ['تشخيص أولي للشاشة والبطارية والشحن والصوت واللمس', 'إصلاح على مستوى القطع أو اللوحة حسب الحالة', 'اختبار وظيفي بعد الإصلاح وتقرير بما تم'], process: ['أرسل وصفاً دقيقاً وأي صور غير حساسة', 'نحدد مسار الفحص والقطع المحتملة', 'نعطيك تقديراً قبل البدء ثم نختبر بعد الإصلاح'], notes: ['لا نبدأ أي عمل دون موافقة على التقدير.', 'القطع تُطلب بعد تأكيد التوافق ورقم الموديل.'] },
    en: { included: ['Initial diagnosis for display, battery, charging, audio and touch', 'Part-level or board-level repair depending on condition', 'Post-repair functional testing and a clear report'], process: ['Send a precise description and non-sensitive photos', 'We define the inspection path and likely parts', 'You approve an estimate, then we test after repair'], notes: ['No work starts without estimate approval.', 'Parts are ordered after model and compatibility confirmation.'] }
  },
  software: {
    ar: { included: ['تحديث أو استعادة عبر مسار رسمي', 'معالجة bootloop بعد التحديث عندما يكون المسار آمناً', 'تأكيد الإصدار والمنطقة قبل التفليش'], process: ['نتحقق من الموديل والـCSC/الاسم الرمزي', 'نأخذ نسخة احتياطية متاحة قبل الإجراء', 'ننفذ ونختبر الإقلاع والشبكة والحساب'], notes: ['قد تُمسح البيانات أثناء الاستعادة.', 'لا نستخدم ملفات مجهولة المصدر.'] },
    en: { included: ['Official update or recovery path', 'Bootloop recovery after an update when a safe path exists', 'Version and region verification before flashing'], process: ['Verify model and CSC/codename', 'Take an available backup before the procedure', 'Run, then test boot, network and account'], notes: ['Data may be erased during restore.', 'We do not use anonymous-source files.'] }
  },
  programming: {
    ar: { included: ['أدوات داخلية للفنيين ولوحات متابعة', 'أتمتة مهام متكررة ونماذج طلبات', 'واجهات API وتكاملات خفيفة'], process: ['نحدد المشكلة والنتيجة المطلوبة', 'نبني نسخة صغيرة قابلة للاختبار', 'نحسّن ونوثق طريقة التشغيل'], notes: ['نعمل ضمن نطاق تقني واضح ونتجنب جمع بيانات غير ضرورية.'] },
    en: { included: ['Internal technician tools and tracking dashboards', 'Automation for repetitive tasks and request forms', 'APIs and lightweight integrations'], process: ['Define the problem and the required outcome', 'Build a small testable version', 'Refine and document how to run it'], notes: ['We work within a clear technical scope and avoid unnecessary data collection.'] }
  },
  cybersecurity: {
    ar: { included: ['مراجعة إعدادات حماية Android وiOS', 'تفعيل 2FA وPasskeys وإدارة الجلسات', 'تحليل تطبيق مشبوه وشرح مؤشرات الخطر'], process: ['نحدد الجهاز أو الحساب أو الشبكة', 'نراجع الإعدادات والأذونات والسجلات', 'نطبق خطوات دفاعية قابلة للتحقق'], notes: ['محتوى دفاعي فقط. لا اختراق أو تجسس أو تجاوز ملكية.'] },
    en: { included: ['Android and iOS hardening review', '2FA, passkeys and session management', 'Suspicious-app analysis and risk indicators'], process: ['Identify the device, account or network', 'Review settings, permissions and logs', 'Apply verifiable defensive steps'], notes: ['Defensive only. No intrusion, surveillance or ownership bypass.'] }
  },
  tools: {
    ar: { included: ['اختيار الأدوات المناسبة للمهمة', 'شرح المخاطر والبدائل الآمنة', 'إعداد أساسي وتجنب أخطاء التفليش'], process: ['نحدد نوع الجهاز والمهمة', 'نرشح أدوات من مصادر رسمية', 'نشرح خطوات التحقق والنسخ الاحتياطي'], notes: ['الأدوات القوية قد تتلف الجهاز أو تمسح البيانات.'] },
    en: { included: ['Choosing the right tool for the job', 'Risk explanation and safer alternatives', 'Basic setup and flashing mistake prevention'], process: ['Identify device type and task', 'Recommend tools from official sources', 'Explain verification and backup steps'], notes: ['Powerful tools can damage devices or erase data.'] }
  },
  firmware: {
    ar: { included: ['تحديد البوابة الرسمية أو الموثوقة', 'مطابقة الموديل والمنطقة والإصدار', 'فحص ملفات iOS الموقعة عبر ipsw.me'], process: ['نبدأ من رقم الموديل الكامل', 'نقارن الإصدار والمنطقة', 'نراجع الخطوات قبل التحميل'], notes: ['لا نستضيف ملفات مجهولة. التحميل مسؤولية المستخدم.'] },
    en: { included: ['Finding the official or trusted portal', 'Model, region and version matching', 'Signed iOS checks through ipsw.me'], process: ['Start from the full model number', 'Compare version and region', 'Review steps before download'], notes: ['We do not host anonymous files. Downloading is the user’s responsibility.'] }
  },
  models: {
    ar: { included: ['بحث في أكثر من 2147 موديل', 'مواصفات أساسية وروابط مصدر', 'أرقام موديلات وأسماء رمزية عند توفرها'], process: ['ابحث بالاسم أو الرقم', 'قارن بين الموديلات', 'افتح المصدر للتحقق الإضافي'], notes: ['بعض السجلات جزئية، ويظهر ذلك بوضوح.'] },
    en: { included: ['Search 2,147+ models', 'Core specifications and source links', 'Model numbers and codenames when available'], process: ['Search by name or number', 'Compare models', 'Open the source for further verification'], notes: ['Some records are partial, and are marked as such.'] }
  },
  screens: {
    ar: { included: ['أسعار من موردين معتمدين فقط', 'توضيح نوعية الشاشة والضمان', 'مقارنة العرض حسب المدينة'], process: ['حدد الموديل ونوع الشاشة', 'نراجع توفر العرض والمورد', 'نؤكد السعر قبل الطلب'], notes: ['لا نعرض سعراً تقديرياً. السعر النهائي بعد تأكيد المورد.'] },
    en: { included: ['Verified supplier prices only', 'Panel grade and warranty clarity', 'City-based offer comparison'], process: ['Identify model and panel type', 'Check offer and supplier availability', 'Confirm price before ordering'], notes: ['No estimates. Final price is confirmed by the supplier.'] }
  },
  parts: {
    ar: { included: ['التحقق من توافق القطعة', 'بدائل بدرجات جودة مختلفة', 'تنبيهات الضمان والتركيب'], process: ['أرسل رقم الموديل الكامل', 'نحدد القطعة والبديل', 'نؤكد التوافق قبل التوريد'], notes: ['اسم الموديل التجاري وحده لا يكفي لضمان التوافق.'] },
    en: { included: ['Part compatibility checks', 'Alternatives across quality grades', 'Warranty and installation warnings'], process: ['Send the full model number', 'Identify part and alternative', 'Confirm compatibility before sourcing'], notes: ['The marketing name alone is not enough to guarantee compatibility.'] }
  },
  faults: {
    ar: { included: ['أدلة تشخيص خطوة بخطوة', 'أسباب شائعة وطرق عزل العطل', 'تحذيرات السلامة ومتى تتوقف'], process: ['ابدأ بالأسهل', 'اعزل السبب قبل استبدال القطع', 'توقف عند أي خطر على البطارية أو السلامة'], notes: ['لا تفتح جهازاً منتفخ البطارية أو ساخناً بشكل غير طبيعي.'] },
    en: { included: ['Step-by-step diagnosis guides', 'Common causes and isolation methods', 'Safety warnings and stop conditions'], process: ['Start with the simplest checks', 'Isolate the cause before replacing parts', 'Stop at any battery or safety risk'], notes: ['Do not open a device with a swollen battery or abnormal heat.'] }
  },
  guides: {
    ar: { included: ['شروحات عملية للمستخدم والفني', 'قوائم أدوات ومسارات آمنة', 'نسخ احتياطي واستعادة'], process: ['اختر الدليل المناسب', 'جهز الأدوات والنسخة الاحتياطية', 'نفذ ببطء وتحقق بعد كل خطوة'], notes: ['المحتوى تعليمي ولا يغني عن الفحص المتخصص عند الخطر.'] },
    en: { included: ['Practical guides for users and technicians', 'Tool lists and safe paths', 'Backup and restore'], process: ['Choose the right guide', 'Prepare tools and backup', 'Proceed slowly and verify each step'], notes: ['Content is educational and does not replace expert inspection when risk is present.'] }
  },
  requests: {
    ar: { included: ['تذكرة محلية برقم مرجعي', 'مراجعة أولية للعطل', 'تنسيق الفحص والتقدير عبر واتساب'], process: ['املأ النموذج بدقة', 'أنشئ التذكرة', 'أرسلها عبر واتساب لتأكيد الاستلام'], notes: ['الموقع ساكن: التذكرة لا تُرسل تلقائياً. واتساب هو قناة التأكيد.'] },
    en: { included: ['Local ticket with a reference number', 'Initial fault review', 'Inspection and estimate coordination on WhatsApp'], process: ['Complete the form carefully', 'Create the ticket', 'Send it on WhatsApp to confirm receipt'], notes: ['Static site: tickets are not sent automatically. WhatsApp is the confirmation channel.'] }
  },
  contact: {
    ar: { included: ['استشارة فنية مباشرة', 'حجز صيانة أو طلب قطعة', 'تنسيق عبر واتساب أو هاتف'], process: ['اختر القناة المناسبة', 'أرسل الموديل ووصف المشكلة', 'انتظر تأكيداً قبل أي دفع أو إرسال جهاز'], notes: ['لا نطلب كلمات مرور أو رموز OTP أو دفعاً عبر روابط مجهولة.'] },
    en: { included: ['Direct technical advice', 'Repair booking or part request', 'WhatsApp or phone coordination'], process: ['Choose the right channel', 'Send model and fault description', 'Wait for confirmation before any payment or device shipment'], notes: ['We never ask for passwords, OTP codes or payment through unknown links.'] }
  }
}

export function servicesView() {
  const services = content().services || []
  return `<div class="page">
    ${pageHeader({ kicker: t('services.kicker'), title: t('services.title'), lead: t('services.lead'), side: `<p>${esc(t('security.defensiveText'))}</p>` })}
    <div class="shell"><div class="section" style="padding-block-start:38px"><div class="grid grid-3">${services.map((service, index) => `<a class="card card-link service-card" href="${hashFor(`/services/${service.slug}`)}"><span class="card-num">${String(index + 1).padStart(2, '0')}</span><span class="card-icon">${icon(serviceIcons[service.slug] || 'spark')}</span><h3>${esc(serviceTitle(service))}</h3><p>${esc(serviceDesc(service))}</p><div class="card-meta"><span class="mono-label">${esc(service.slug)}</span><span class="card-arrow">${icon('arrow-up-right')}</span></div></a>`).join('')}</div></div></div>
  </div>`
}

export function serviceView(slug) {
  const service = (content().services || []).find((item) => item.slug === slug)
  if (!service) return ''
  const details = SERVICE_DETAILS[slug]?.[getLang()] || SERVICE_DETAILS[slug]?.ar || { included: [], process: [], notes: [] }
  return `<div class="page">
    ${pageHeader({
      kicker: 'SERVICE / DETAIL',
      title: serviceTitle(service),
      lead: serviceDesc(service),
      side: `<p>${esc(details.notes[0] || '')}</p>`,
      breadcrumb: breadcrumb([{ label: t('home'), href: '#/' }, { label: t('services.all'), href: '#/services' }, { label: serviceTitle(service) }])
    })}
    <div class="shell"><div class="section" style="padding-block-start:38px">
      <div class="grid grid-3">
        <div class="card"><span class="card-icon">${icon(serviceIcons[slug] || 'spark')}</span><h3>${esc(t('services.included'))}</h3><div class="source-list">${details.included.map((item) => `<div class="source-item"><span>${esc(item)}</span>${icon('check')}</div>`).join('')}</div></div>
        <div class="card"><span class="card-icon">${icon('layers')}</span><h3>${esc(t('services.process'))}</h3><div class="source-list">${details.process.map((item, index) => `<div class="source-item"><span><b class="mono">${String(index + 1).padStart(2, '0')}</b> ${esc(item)}</span></div>`).join('')}</div></div>
        <div class="card"><span class="card-icon">${icon('info')}</span><h3>${esc(t('services.notes'))}</h3><div class="source-list">${details.notes.map((item) => `<div class="source-item"><span>${esc(item)}</span></div>`).join('')}</div><div class="card-meta"><a class="btn btn-primary btn-sm" href="${slug === 'contact' ? '#/contact' : slug === 'requests' ? '#/requests' : hashFor('/requests', { service: slug })}">${icon(slug === 'contact' ? 'message' : 'clipboard')}${esc(slug === 'contact' ? t('contact.title') : t('services.request'))}</a></div></div>
      </div>
    </div></div>
  </div>`
}

export function firmwareView(params) {
  const type = params.get('type') === 'android' ? 'android' : 'ios'
  const fw = content().firmwareSources || []
  const brands = [...new Set(fw.map((source) => source.brand))]
  const brand = params.get('brand') || ''
  const devices = store.iphones || []
  const requested = params.get('device') || 'iPhone16,2'
  const selected = devices.find((device) => device.identifier === requested) || devices[0]
  const androidSources = brand ? fw.filter((source) => source.brand === brand) : fw
  return `<div class="page">
    ${pageHeader({
      kicker: t('firmware.kicker'),
      title: t('firmware.title'),
      lead: t('firmware.lead'),
      meta: `<span class="pill signal">${esc(t('firmware.sourceOfficial'))}</span><span class="pill">${esc(t('firmware.tabIos'))}</span><span class="pill">${nf(fw.length)} ${esc(t('home.statSources'))}</span>`
    })}
    <div class="shell"><div class="section" style="padding-block-start:34px">
      <div class="tabs" role="tablist">
        <a class="tab-btn ${type === 'ios' ? 'active' : ''}" href="${hashFor('/firmware', { type: 'ios', device: selected?.identifier || 'iPhone16,2' })}" role="tab" aria-selected="${type === 'ios'}">${esc(t('firmware.tabIos'))}</a>
        <a class="tab-btn ${type === 'android' ? 'active' : ''}" href="${hashFor('/firmware', { type: 'android' })}" role="tab" aria-selected="${type === 'android'}">${esc(t('firmware.tabAndroid'))}</a>
      </div>
      ${type === 'ios' ? `<div class="tab-panel">
        <div class="fw-layout">
          <aside class="fw-picker">
            <h3>${esc(t('firmware.device'))}</h3>
            <label class="field"><span class="field-label">${esc(t('firmware.selectDevice'))}</span>
              <select class="select" id="ipsw-device">${devices.map((device) => `<option value="${esc(device.identifier)}" ${device.identifier === selected?.identifier ? 'selected' : ''}>${esc(device.name)} · ${esc(device.identifier)}</option>`).join('')}</select>
            </label>
            <p class="hint">${esc(t('firmware.iphoneHint'))}</p>
            <p class="hint">${esc(t('firmware.sourceNote'))}</p>
            <div class="notice mt-2">${icon('shield')}<span>${esc(t('firmware.signedOnly'))}</span></div>
          </aside>
          <div class="fw-output" id="ipsw-output"><div class="fw-loading"><span class="loader-ring"></span><span>${esc(t('loading'))} ipsw.me…</span></div></div>
        </div>
      </div>` : `<div class="tab-panel">
        <div class="filters" style="border-block-start:0;padding-block-start:0">
          <label class="field"><span class="field-label">${esc(t('phones.brand'))}</span><select class="select" id="fw-brand"><option value="">${esc(t('firmware.allBrands'))}</option>${brands.map((name) => `<option value="${esc(name)}" ${name === brand ? 'selected' : ''}>${esc(brandDisplay(name))}</option>`).join('')}</select></label>
          <span class="pill">${nf(androidSources.length)} ${esc(t('home.statSources'))}</span>
        </div>
        <div class="source-card-grid">${androidSources.length ? androidSources.map((source) => `<a class="source-card" href="${esc(safeUrl(source.url))}" target="_blank" rel="noopener"><div class="source-card-top"><h4>${esc(source.name)}</h4><span class="pill ${source.type === 'official' ? 'signal' : ''}">${esc(source.type === 'official' ? t('firmware.sourceOfficial') : t('firmware.sourceTrusted'))}</span></div><p>${esc(firmwareNote(source))}</p><span class="source-brand">${esc(brandDisplay(source.brand))} · ${icon('external')}</span></a>`).join('') : emptyState('download', t('firmware.noSources'), '')}</div>
        <div class="notice warn mt-3">${icon('alert')}<span>${esc(t('firmware.disclaimer'))}</span></div>
        <div class="card mt-3"><span class="card-icon">${icon('check')}</span><h3>${esc(t('firmware.verifyTitle'))}</h3><div class="source-list">${[1, 2, 3, 4].map((index) => `<div class="source-item"><span>${esc(t(`firmware.verify${index}`))}</span>${icon('check')}</div>`).join('')}</div></div>
      </div>`}
    </div></div>
  </div>`
}

function ipswSignedView(identifier, data) {
  const signed = (data.firmwares || []).filter((row) => row.signed).sort((a, b) => String(b.releasedate || '').localeCompare(String(a.releasedate || '')))
  const latest = signed[0]
  if (!latest) return `<div class="fw-head"><div><h3>${esc(data.name || identifier)}</h3><p>${esc(identifier)}</p></div><span class="pill warn">${esc(t('firmware.noSigned'))}</span></div>`
  return `<div class="fw-head"><div><h3>${esc(data.name || identifier)}</h3><p>${esc(identifier)} · ${esc(data.platform || '')}</p></div><span class="pill signal">${nf(signed.length)} ${esc(t('firmware.signedCount'))}</span></div>
    <div class="fw-latest">
      <div class="fw-latest-top"><div><p class="mono-label">${esc(t('firmware.latest'))}</p><div class="fw-version">iOS ${esc(latest.version)}</div><div class="fw-build">${esc(latest.buildid)} · ${esc(latest.identifier)}</div></div><span class="pill signal">${icon('check')}${esc(t('firmware.signed'))}</span></div>
      <div class="fw-facts">
        <div class="fw-fact"><span>${esc(t('firmware.build'))}</span><b>${esc(latest.buildid)}</b></div>
        <div class="fw-fact"><span>${esc(t('firmware.released'))}</span><b>${esc(df(latest.releasedate))}</b></div>
        <div class="fw-fact"><span>${esc(t('firmware.size'))}</span><b>${esc(humanSize(latest.filesize))}</b></div>
        <div class="fw-fact"><span>SHA-256</span><b>${esc(String(latest.sha256sum || '').slice(0, 16))}…</b></div>
      </div>
      <div class="fw-actions">
        <a class="btn btn-primary btn-sm" href="${esc(safeUrl(latest.url))}" target="_blank" rel="noopener">${icon('download')}${esc(t('firmware.download'))}</a>
        <button class="btn btn-sm" type="button" data-copy-text="${esc(latest.sha256sum || '')}">${icon('copy')}${esc(t('firmware.copySha'))}</button>
      </div>
      <p class="admin-note mt-2">${esc(t('firmware.sourceNote'))}</p>
    </div>
    ${signed.length > 1 ? `<div class="fw-list"><p class="mono-label" style="padding-block:10px">${esc(t('firmware.otherVersions'))}</p>${signed.slice(1, 9).map((row) => `<div class="fw-row"><span>${esc(row.version)}</span><span>${esc(row.buildid)}<small> · ${esc(df(row.releasedate))} · ${esc(humanSize(row.filesize))}</small></span><a href="${esc(safeUrl(row.url))}" target="_blank" rel="noopener" aria-label="${esc(t('firmware.download'))}">${icon('download')}</a></div>`).join('')}</div>` : ''}`
}

async function fetchIpsw(identifier) {
  const key = `brxvih.ipsw.${identifier}`
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || 'null')
    if (cached && Date.now() - cached.at < 3600000 && cached.data) return cached.data
  } catch {}
  const response = await fetch(`https://api.ipsw.me/v4/device/${encodeURIComponent(identifier)}?type=ipsw`, { headers: { accept: 'application/json' } })
  if (!response.ok) throw new Error(`ipsw.me ${response.status}`)
  const data = await response.json()
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })) } catch {}
  return data
}

function bindCopyButtons(root) {
  root.querySelectorAll('[data-copy-text]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => copyText(button.dataset.copyText || ''))
  })
}

export async function bindFirmware(root) {
  const deviceSelect = root.querySelector('#ipsw-device')
  if (deviceSelect) {
    const output = root.querySelector('#ipsw-output')
    const identifier = deviceSelect.value
    const selected = store.iphones.find((device) => device.identifier === identifier)
    deviceSelect.addEventListener('change', () => {
      location.hash = hashFor('/firmware', { type: 'ios', device: deviceSelect.value })
    })
    const load = async () => {
      if (!output) return
      output.innerHTML = `<div class="fw-loading"><span class="loader-ring"></span><span>${esc(t('loading'))} ipsw.me…</span></div>`
      try {
        const data = await fetchIpsw(identifier)
        if (!output.isConnected) return
        output.innerHTML = ipswSignedView(identifier, data)
        bindCopyButtons(output)
      } catch {
        if (!output.isConnected) return
        output.innerHTML = `<div class="fw-head"><div><h3>${esc(selected?.name || identifier)}</h3><p>${esc(identifier)}</p></div><span class="pill danger">${esc(t('error'))}</span></div><div class="empty mt-2"><span class="empty-icon">${icon('wifi')}</span><h3>${esc(t('firmware.fetchError'))}</h3><button class="btn btn-sm" type="button" id="ipsw-retry">${esc(t('retry'))}</button></div>`
        output.querySelector('#ipsw-retry')?.addEventListener('click', load)
      }
    }
    await load()
  }
  const brandSelect = root.querySelector('#fw-brand')
  brandSelect?.addEventListener('change', () => {
    location.hash = brandSelect.value
      ? hashFor('/firmware', { type: 'android', brand: brandSelect.value })
      : hashFor('/firmware', { type: 'android' })
  })
}
