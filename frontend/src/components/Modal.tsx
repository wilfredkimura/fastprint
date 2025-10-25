import { useEffect } from 'react'

export default function Modal({ open, title, onClose, children }: { open: boolean; title?: string; onClose: ()=>void; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-4 md:mx-auto md:max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
