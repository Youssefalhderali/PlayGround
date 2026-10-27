import { useState } from 'react'
import { CheckCircle2, Download, Monitor, Smartphone } from 'lucide-react'
import { useStore } from '../lib/store'
import { usePwaInstall } from '../lib/pwa'
import { Button, Modal } from './ui'

export function InstallButton({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  const { t, lang } = useStore()
  const { canInstall, installed, install, platform } = usePwaInstall()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  if (installed) return null

  const handle = async () => {
    if (canInstall) {
      const ok = await install()
      if (ok) setDone(true)
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <button className={`install-btn ${compact ? 'compact' : ''} ${className}`} onClick={handle} title={t('pwa.install')}>
        {compact ? <Download size={17} /> : <><Download size={16} />{t('pwa.install')}</>}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={t('pwa.title')}>
        <p className="modal-lead">{t('pwa.lead')}</p>
        <div className="install-steps">
          <div className={platform === 'android' ? 'active' : ''}>
            <span className="install-step-icon"><Smartphone size={19} /></span>
            <div><strong>{t('pwa.android')}</strong><p>{t('pwa.androidStep')}</p></div>
          </div>
          <div className={platform === 'windows' ? 'active' : ''}>
            <span className="install-step-icon"><Monitor size={19} /></span>
            <div><strong>{t('pwa.windows')}</strong><p>{t('pwa.windowsStep')}</p></div>
          </div>
          {platform === 'ios' && (
            <div className="active">
              <span className="install-step-icon"><Smartphone size={19} /></span>
              <div><strong>iPhone / iPad</strong><p>{t('pwa.iosStep')}</p></div>
            </div>
          )}
        </div>
        <div className="install-note"><CheckCircle2 size={15} />{t('pwa.note')}</div>
        <div className="modal-actions"><Button variant="outline" onClick={() => setOpen(false)}>{t('common.close')}</Button></div>
      </Modal>
      {done && <span className="sr-only">{t('pwa.installed')}</span>}
    </>
  )
}
