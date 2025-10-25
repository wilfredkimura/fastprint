import { useEffect, useRef, useState } from 'react'

type Option = { label: string; value: string }

type SelectProps = {
  value: string
  onChange: (val: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export default function Select({ value, onChange, options, placeholder = 'Select...', className = '' }: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={()=>setOpen(o=>!o)}
        className="w-full h-11 px-3 rounded-md border text-left flex items-center justify-between
        border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
      >
        <span className={selected ? '' : 'text-slate-500 dark:text-slate-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="opacity-70">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
        </svg>
      </button>
      {open && (
        <div role="listbox" className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border
          border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
          {options.map(o => (
            <button
              key={o.value}
              role="option"
              aria-selected={o.value===value}
              onClick={()=>{ onChange(o.value); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700
                ${o.value===value ? 'bg-slate-100 dark:bg-slate-700' : ''}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
