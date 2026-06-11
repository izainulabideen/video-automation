'use client'
import { createContext, useContext, useState, useCallback } from 'react'

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info' }
interface ToastCtx { toast: (message: string, type?: Toast['type']) => void }

const Ctx = createContext<ToastCtx>({ toast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl backdrop-blur-md ${
              t.type === 'error'
                ? 'bg-red-500/15 border-red-500/30 text-red-300'
                : t.type === 'info'
                ? 'bg-white/[0.08] border-white/[0.12] text-white/80'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}>
            <span>{t.type === 'error' ? '✕' : t.type === 'info' ? 'ℹ' : '✓'}</span>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() { return useContext(Ctx) }
