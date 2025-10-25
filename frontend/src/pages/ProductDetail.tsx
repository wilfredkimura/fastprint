import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, fetchProduct, type Product, assetUrl } from '../lib/api'
import { Button } from '../components/ui/button'
import { useStore } from '../lib/store'
import Select from '../components/Select'

type CustomState = Record<string, any>

export default function ProductDetail() {
  const { id = '' } = useParams()
  const [p, setP] = useState<Product | null>(null)
  const [qty, setQty] = useState(1)
  const [custom, setCustom] = useState<CustomState>({})
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const { addToCart } = useStore()

  useEffect(() => {
    if (!id) return
    fetchProduct(id).then(setP).catch(()=>{})
  }, [id])

  const price = useMemo(() => {
    if (!p) return 0
    let extra = 0
    for (const opt of p.customizationOptions || []) {
      const val = custom[opt.key]
      if (opt.type === 'text' || opt.type === 'imageUpload') {
        if (val && typeof opt.priceImpact === 'number') extra += opt.priceImpact
      } else if (opt.type === 'select') {
        const impacts = opt.priceImpact as Record<string, number> | undefined
        if (impacts && val && impacts[val] ) extra += impacts[val]
      }
    }
    return (p.basePrice + extra) * qty
  }, [p, custom, qty])

  function openWhatsAppQuote() {
    if (!p) return
    const base = 'https://wa.me/254721248369'
    const lines: string[] = []
    const productUrl = `${window.location.origin}/products/${p._id}`
    const mainImage = p.images?.[0] ? assetUrl(p.images[0]) : ''
    lines.push(`Product: ${p.name}`)
    lines.push(`Link: ${productUrl}`)
    if (mainImage) lines.push(`Image: ${mainImage}`)
    lines.push(`Qty: ${qty}`)
    for (const opt of p.customizationOptions || []) {
      const val = custom[opt.key]
      if (!val) continue
      const label = opt.label
      if (opt.type === 'imageUpload') {
        lines.push(`${label}: ${assetUrl(String(val))}`)
      } else {
        lines.push(`${label}: ${val}`)
      }
    }
    lines.push(`Total: KSh ${price}`)
    const msg = encodeURIComponent(`Hello FASTPRINT!\n${lines.join('\n')}`)
    window.open(`${base}?text=${msg}`, '_blank')
  }

  async function handleUpload(file: File, key: string) {
    const form = new FormData()
    form.append('file', file)
    setUploadingKey(key)
    try {
      const { data } = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setCustom(c => ({ ...c, [key]: data.url }))
    } finally {
      setUploadingKey(null)
    }
  }

  if (!p) return <section className="container py-12">Loading...</section>

  return (
    <section className="container py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {p.images?.[0] ? <img src={assetUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover"/> : null}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{p.name}</h1>
          <p className="text-slate-600 mb-4">{p.description}</p>

          <div className="space-y-4 mb-6">
            {(p.customizationOptions || []).map((opt) => (
              <div key={opt.key}>
                <label className="block text-sm mb-1">{opt.label}</label>
                {opt.type === 'text' && (
                  <input
                    className="w-full h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
                    value={custom[opt.key] || ''}
                    onChange={(e)=>setCustom(c=>({...c, [opt.key]: e.target.value}))}
                  />
                )}
                {opt.type === 'select' && (
                  <Select
                    value={custom[opt.key] || ''}
                    onChange={(v)=>setCustom(c=>({...c, [opt.key]: v}))}
                    options={[{ label: 'Select...', value: '' }, ...((opt as any).options||[]).map((o: string)=>({ label: o, value: o }))]}
                  />
                )}
                {opt.type === 'imageUpload' && (
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) handleUpload(f, opt.key) }} />
                    {uploadingKey===opt.key && <span className="text-sm">Uploading...</span>}
                    {custom[opt.key] && <a href={assetUrl(custom[opt.key])} target="_blank" rel="noreferrer" className="text-sm underline">View</a>}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button className="h-9 w-9 border rounded" onClick={()=>setQty(q=>Math.max(1,q-1))}>-</button>
              <span>{qty}</span>
              <button className="h-9 w-9 border rounded" onClick={()=>setQty(q=>q+1)}>+</button>
            </div>
            <div className="text-xl font-semibold">KSh {price}</div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={()=> p && addToCart({ product: p, quantity: qty, customization: custom })}>Add to Cart</Button>
            <Button variant="outline">Add to Wishlist</Button>
            <Button variant="outline" onClick={openWhatsAppQuote}>WhatsApp Quote</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
