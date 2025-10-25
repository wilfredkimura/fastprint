import { useEffect, useState } from 'react'
import { api, createProduct, fetchCategories, fetchProducts, updateProduct, deleteProduct, seedProducts, type Product } from '../../lib/api'
import Select from '../../components/Select'
import { useToast } from '../../lib/toast'
import Modal from '../../components/Modal'

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([])
  const [cats, setCats] = useState<{_id:string; name:string}[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [options, setOptions] = useState<any[]>([])
  const [drag, setDrag] = useState(false)
  const { push } = useToast()

  // edit modal state
  const [editing, setEditing] = useState<Product | null>(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState<number>(0)
  const [editCategory, setEditCategory] = useState('')
  const [editImage, setEditImage] = useState('')
  const [editOptions, setEditOptions] = useState<any[]>([])

  async function refresh() {
    const d = await fetchProducts({ limit: 100 })
    setItems(d.items)
  }
  function beginEdit(p: Product) {
    setEditing(p)
    setEditName(p.name)
    setEditPrice(p.basePrice)
    setEditCategory((p as any).category || '')
    setEditImage((p.images && p.images[0]) || '')
    setEditOptions((p as any).customizationOptions || [])
  }
  async function saveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    try {
      const body: any = {
        name: editName,
        basePrice: editPrice,
        category: editCategory,
        images: editImage ? [editImage] : [],
        customizationOptions: editOptions,
      }
      await updateProduct(editing._id, body)
      push('Product updated', 'success')
      setEditing(null)
      await refresh()
    } catch { push('Failed to update', 'error') }
  }

  useEffect(() => { refresh().catch(()=>{}); fetchCategories().then(setCats).catch(()=>{}) }, [])

  function addOption() {
    setOptions(arr => [...arr, { key: `opt${arr.length+1}`, label: '', type: 'text', priceImpact: 0, options: [] }])
  }
  function updateOption(idx: number, patch: any) {
    setOptions(arr => arr.map((o,i)=> i===idx ? { ...o, ...patch } : o))
  }
  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createProduct({ name, basePrice: price, category, images: image ? [image] : [], customizationOptions: options })
      setName(''); setPrice(0); setCategory(''); setImage(''); setOptions([])
      await refresh()
      push('Product created', 'success')
    } catch (e: any) {
      push('Failed to create product', 'error')
    }
  }
  async function onToggleFeatured(id: string, current: boolean) {
    try {
      await updateProduct(id, { isFeatured: !current })
      push(!current ? 'Marked as featured' : 'Unfeatured', 'success')
      await refresh()
    } catch {
      push('Failed to update featured flag', 'error')
    }
  }
  async function handleFiles(files: FileList | null) {
    const f = files?.[0]
    if (!f) return
    const form = new FormData()
    form.append('file', f)
    try {
      const { data } = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setImage(data.url)
      push('Image uploaded', 'success')
    } catch {
      push('Upload failed', 'error')
    }
  }
  return (
    <section className="container py-12">
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <div className="flex items-center justify-between mb-3">
        <div />
        <button
          onClick={async ()=>{ try { const r = await seedProducts(); push(`Seeded ${r.created} products`, 'success') } catch { push('Seed failed','error') } finally { await refresh() } }}
          className="h-9 px-3 rounded-md bg-primary text-white text-sm"
        >Seed Example Products</button>
      </div>
      <form onSubmit={onCreate} className="card p-4 mb-6 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 min-w-0" />
        <input value={price} onChange={e=>setPrice(Number(e.target.value)||0)} placeholder="Base Price" type="number" className="h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 min-w-0" />
        <Select
          value={category}
          onChange={setCategory}
          options={[{ label: 'Select Category', value: '' }, ...cats.map(c=>({ label: c.name, value: c._id }))]}
          className="min-w-0"
        />
        <div className="md:col-span-1">
          <input value={image} onChange={e=>setImage(e.target.value)} placeholder="Image URL" className="h-11 w-full px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent mb-2 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 min-w-0" />
          <div
            className={`border-2 border-dashed rounded-md p-4 text-sm text-slate-600 dark:text-slate-300 ${drag ? 'border-primary/60 bg-primary/5' : 'border-slate-300 dark:border-slate-700'}`}
            onDragOver={(e)=>{e.preventDefault(); setDrag(true)}}
            onDragLeave={()=>setDrag(false)}
            onDrop={(e)=>{e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files)}}
          >
            <p className="mb-2">Drag & drop image, or click to select</p>
            <input type="file" accept="image/*" onChange={(e)=>handleFiles(e.target.files)} />
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Customization Options</p>
            <button type="button" onClick={addOption} className="text-sm underline">Add Option</button>
          </div>
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={idx} className="grid sm:grid-cols-2 md:grid-cols-5 gap-2">
                <input value={opt.key} onChange={e=>updateOption(idx,{ key: e.target.value })} placeholder="Key" className="h-9 px-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent min-w-0" />
                <input value={opt.label} onChange={e=>updateOption(idx,{ label: e.target.value })} placeholder="Label" className="h-9 px-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent min-w-0" />
                <Select
                  value={opt.type}
                  onChange={(v)=>updateOption(idx,{ type: v })}
                  options={[
                    { label: 'Text', value: 'text' },
                    { label: 'Image Upload', value: 'imageUpload' },
                    { label: 'Select', value: 'select' },
                  ]}
                  className="h-9 min-w-0"
                />
                <input value={opt.priceImpact ?? 0} onChange={e=>updateOption(idx,{ priceImpact: Number(e.target.value)||0 })} placeholder="Price Impact" className="h-9 px-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent min-w-0" />
                {opt.type === 'select' ? (
                  <input value={(opt.options||[]).join(',')} onChange={e=>updateOption(idx,{ options: e.target.value.split(',').map((s:string)=>s.trim()) })} placeholder="Options comma-separated" className="h-9 px-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent min-w-0" />
                ) : <div />}
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-4 flex justify-end">
          <button className="h-10 px-4 rounded-md bg-primary text-white">Create</button>
        </div>
      </form>
      <div className="card overflow-auto">
        <table className="min-w-full min-w-[800px] text-sm">
          <thead className="bg-muted dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Featured</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3">{p.name}</td>
                <td className="p-3">KSh {p.basePrice}</td>
                <td className="p-3">{(p as any).stockQuantity ?? '-'}</td>
                <td className="p-3">{(p as any).isFeatured ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  <button onClick={()=>onToggleFeatured(p._id, (p as any).isFeatured)} className="text-sm underline mr-3 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">{(p as any).isFeatured ? 'Unfeature' : 'Feature'}</button>
                  <button
                    onClick={()=>beginEdit(p)}
                    className="text-sm underline mr-3 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  >Edit</button>
                  <button
                    onClick={async ()=>{
                      if (!confirm('Delete this product?')) return
                      try { await deleteProduct(p._id); push('Product deleted','success'); await refresh() } catch { push('Failed to delete','error') }
                    }}
                    className="text-sm underline text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Edit Modal */}
      <Modal open={!!editing} title="Edit Product" onClose={()=>setEditing(null)}>
        <form onSubmit={saveEdit} className="grid md:grid-cols-2 gap-3">
          <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Name" className="h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent" />
          <input value={editPrice} onChange={e=>setEditPrice(Number(e.target.value)||0)} placeholder="Base Price" type="number" className="h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent" />
          <Select value={editCategory} onChange={setEditCategory} options={[{ label: 'Select Category', value: '' }, ...cats.map(c=>({ label: c.name, value: c._id }))]} />
          <div>
            <input value={editImage} onChange={e=>setEditImage(e.target.value)} placeholder="Image URL" className="h-11 w-full px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent mb-2" />
            <input type="file" accept="image/*" onChange={async (e)=>{ const f=e.target.files?.[0]; if(!f) return; const form=new FormData(); form.append('file', f); const { data } = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }); setEditImage(data.url) }} />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Customization Options</p>
              <button type="button" onClick={()=>setEditOptions(a=>[...a,{ key:`opt${a.length+1}`, label:'', type:'text', priceImpact:0, options:[] }])} className="text-sm underline">Add Option</button>
            </div>
            <div className="space-y-2">
              {editOptions.map((opt:any, idx:number)=> (
                <div key={idx} className="grid sm:grid-cols-2 md:grid-cols-5 gap-2">
                  <input value={opt.key} onChange={e=>setEditOptions(arr=>arr.map((o,i)=>i===idx?{...o,key:e.target.value}:o))} placeholder="Key" className="h-9 px-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent min-w-0" />
                  <input value={opt.label} onChange={e=>setEditOptions(arr=>arr.map((o,i)=>i===idx?{...o,label:e.target.value}:o))} placeholder="Label" className="h-9 px-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent min-w-0" />
                  <Select value={opt.type} onChange={(v)=>setEditOptions(arr=>arr.map((o,i)=>i===idx?{...o,type:v}:o))} options={[{label:'Text',value:'text'},{label:'Image Upload',value:'imageUpload'},{label:'Select',value:'select'}]} className="min-w-0" />
                  <input value={opt.priceImpact ?? 0} onChange={e=>setEditOptions(arr=>arr.map((o,i)=>i===idx?{...o,priceImpact:Number(e.target.value)||0}:o))} placeholder="Price Impact" className="h-9 px-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent min-w-0" />
                  {opt.type==='select'? (
                    <input value={(opt.options||[]).join(',')} onChange={e=>setEditOptions(arr=>arr.map((o,i)=>i===idx?{...o,options:e.target.value.split(',').map((s:string)=>s.trim())}:o))} placeholder="Options comma-separated" className="h-9 px-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent min-w-0" />
                  ) : <div />}
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={()=>setEditing(null)} className="h-10 px-4 rounded-md border border-slate-300 dark:border-slate-700">Cancel</button>
            <button className="h-10 px-4 rounded-md bg-primary text-white">Save</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
