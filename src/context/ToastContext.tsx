import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react'

type ToastKind = 'success' | 'error' | 'info'
interface Toast {
  id: number
  kind: ToastKind
  message: string
}

interface ToastValue {
  toast: (message: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, kind, message }])
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4200)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {items.map((item) => (
          <div key={item.id} className={`toast toast-${item.kind}`}>
            {item.kind === 'success' ? <CheckCircle2 size={18} /> : item.kind === 'error' ? <AlertTriangle size={18} /> : <Info size={18} />}
            <span>{item.message}</span>
            <button type="button" onClick={() => setItems((prev) => prev.filter((t) => t.id !== item.id))} aria-label="close">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
