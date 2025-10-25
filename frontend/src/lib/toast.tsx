import React, { createContext, useContext, useMemo, useState } from 'react'

type Toast = { id: number; message: string; type?: 'success'|'error' }

type ToastCtx = { push: (message: string, type?: 'success'|'error') => void }

const Ctx = createContext<ToastCtx | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const ctx = useMemo<ToastCtx>(()=>({
    push: (message, type) => {
      const t: Toast = { id: Date.now() + Math.random(), message, type }
      setToasts(arr => [...arr, t])
      setTimeout(() => setToasts(arr => arr.filter(x => x.id !== t.id)), 3000)
    }
  }),[])
  return (
    <Ctx.Provider value={ctx}>
      {children}
      <div className="fixed right-4 top-4 space-y-2 z-50 max-w-sm">
        {toasts.map(t => {
          const base = 'px-4 py-2 rounded-md shadow-lg text-sm'
          const cls = t.type === 'error'
            ? 'bg-red-600 text-white dark:bg-red-600'
            : t.type === 'success'
            ? 'bg-green-600 text-white dark:bg-green-600'
            : 'bg-slate-900 text-white'
          return (
            <div key={t.id} className={`${base} ${cls}`}>{t.message}</div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const c = useContext(Ctx)
  if (!c) throw new Error('ToastProvider missing')
  return c
}
