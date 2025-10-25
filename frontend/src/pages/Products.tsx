import { useEffect, useMemo, useState } from 'react'
import { fetchCategories, fetchProducts, type Product, assetUrl } from '../lib/api'
import { Link } from 'react-router-dom'
import QuoteForm from '../components/QuoteForm'
import Select from '../components/Select'
import { useStore } from '../lib/store'

export default function Products() {
  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [cats, setCats] = useState<{_id:string; name:string}[]>([])
  const { addToWishlist, removeFromWishlist, isWishlisted } = useStore()
  const limit = 12

  useEffect(() => {
    fetchCategories().then(setCats).catch(()=>{})
  }, [])

  const params = useMemo(()=>({ q: q || undefined, category: category || undefined, sort, page, limit }),[q,category,sort,page])

  useEffect(() => {
    let cancelled = false
    fetchProducts(params).then(data => { if (!cancelled) { setItems(data.items); setTotal(data.total); setPages(data.pages) } })
    return () => { cancelled = true }
  }, [params])

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <div className="mb-4 grid gap-3 md:grid-cols-4 sticky top-16 z-30 bg-white/80 dark:bg-slate-950/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur border border-slate-200 dark:border-slate-800 p-3 rounded-md">
        <input value={q} onChange={e=>{setQ(e.target.value); setPage(1)}} placeholder="Search" className="h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 min-w-0" />
        <Select
          value={category}
          onChange={(v)=>{ setCategory(v); setPage(1) }}
          options={[{ label: 'All categories', value: '' }, ...cats.map(c=>({ label: c.name, value: c._id }))]}
          className="min-w-0"
        />
        <Select
          value={sort}
          onChange={setSort}
          options={[
            { label: 'Newest', value: 'newest' },
            { label: 'Price: Low to High', value: 'price_asc' },
            { label: 'Price: High to Low', value: 'price_desc' },
          ]}
          className="min-w-0"
        />
        <div className="h-11 flex items-center justify-end text-sm text-slate-600">{total} items</div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Request a Custom Quote</h2>
        <QuoteForm context="Products page" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <div key={p._id} className="card p-4 hover:translate-y-0.5 transition-transform relative">
            <button
              aria-label="Toggle wishlist"
              onClick={()=> isWishlisted(p._id) ? removeFromWishlist(p._id) : addToWishlist(p)}
              className={`absolute top-3 right-3 h-8 px-3 rounded-md border text-sm ${isWishlisted(p._id) ? 'bg-rose-600 text-white border-rose-600' : 'bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700'}`}
            >{isWishlisted(p._id) ? 'Wishlisted' : 'Wishlist'}</button>
            <Link to={`/products/${p._id}`} className="block">
              <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
                {p.images?.[0] ? <img src={assetUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover"/> : null}
              </div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-slate-600">KSh {p.basePrice}</p>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 justify-center mt-6">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="h-9 px-3 rounded-md border border-slate-300 disabled:opacity-50">Prev</button>
        <span className="text-sm">Page {page} / {pages}</span>
        <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)} className="h-9 px-3 rounded-md border border-slate-300 disabled:opacity-50">Next</button>
      </div>
    </section>
  )
}
