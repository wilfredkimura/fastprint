import { useState } from 'react'
import { api } from '../lib/api'

export default function QuoteForm({ context }: { context?: string }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  function openWhatsApp(e: React.FormEvent) {
    e.preventDefault()
    const base = 'https://wa.me/254721248369'
    const page = typeof window !== 'undefined' ? window.location.href : ''
    const msg = `Hello FASTPRINT!%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AContext: ${encodeURIComponent(context || 'General')}%0APage: ${encodeURIComponent(page)}%0ADetails: ${encodeURIComponent(details)}${imageUrl ? `%0AImage: ${encodeURIComponent(imageUrl)}` : ''}`
    window.open(`${base}?text=${msg}`, '_blank')
  }

  async function onFileChange(file?: File) {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    setUploading(true)
    try {
      const { data } = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setImageUrl(data.url)
    } finally { setUploading(false) }
  }

  return (
    <form onSubmit={openWhatsApp} className="card p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
      <input
        className="h-10 md:h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
        placeholder="Your Name"
        value={name}
        onChange={e=>setName(e.target.value)}
        required
      />
      <input
        className="h-10 md:h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
        placeholder="Your Phone"
        value={phone}
        onChange={e=>setPhone(e.target.value)}
        required
      />
      <div className="sm:col-span-2 md:col-span-3 grid md:grid-cols-[1fr_auto] gap-3">
        <textarea
          className="min-h-[84px] md:min-h-[96px] px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
          placeholder="Describe your custom quote (e.g., item, size, quantity, deadline)"
          value={details}
          onChange={e=>setDetails(e.target.value)}
          required
        />
        <button className="h-10 md:h-11 px-4 rounded-md bg-primary text-white self-start w-full md:w-auto">Send via WhatsApp</button>
        <div className="md:col-span-2 flex items-center gap-3 flex-wrap">
          <input type="file" accept="image/*" onChange={(e)=>onFileChange(e.target.files?.[0] || undefined)} />
          {uploading && <span className="text-sm">Uploading...</span>}
          {imageUrl && <a className="text-sm underline" href={imageUrl} target="_blank" rel="noreferrer">View image</a>}
        </div>
      </div>
    </form>
  )
}
