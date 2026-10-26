import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    const [key, val] = selector.replace(/^meta\[|\]$/g, '').split('=')
    el.setAttribute(key, val.replace(/["']/g, ''))
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

export function useSeo(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | brxvih — WHITE BLACK`
    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
    }
    setMeta('meta[property="og:title"]', 'content', `${title} | brxvih`)
  }, [title, description])
}

export function useReveal(deps: unknown[] = []) {
  const location = useLocation()
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'))
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          io.unobserve(entry.target)
        }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [location.pathname, ...deps])
}

export function useScrollTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname, location.search])
}

export function useKeyboardShortcut(onTrigger: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onTrigger()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onTrigger])
}
