import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useEffect, useState } from 'react'
import { fetchProducts, type Product, assetUrl } from '../lib/api'
import { useStore } from '../lib/store'
import QuoteForm from '../components/QuoteForm'

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const { user } = useStore()
  useEffect(() => {
    fetchProducts({ featured: true, limit: 6, sort: 'newest' }).then(d=>setFeatured(d.items)).catch(()=>{})
  }, [])
  return (
    <div>
      <section className="relative overflow-hidden section">
        <div className="absolute inset-0 -z-10 opacity-70 pointer-events-none" aria-hidden>
          <div className="h-[480px] bg-gradient-to-b from-primary/10 to-transparent" />
        </div>
        <div className="container grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Hero and info */}
          <div className="text-left order-1">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">FASTPRINT</h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mb-3">Premium custom printing, decor frames, branded gifts, apparel, mugs & tumblers, and Christian-inspired designs. Crafted with care in Nairobi.</p>
            <p className="text-slate-500 dark:text-slate-400 italic mb-8">“Whatever you do, work at it with all your heart, as working for the Lord.” — Colossians 3:23</p>
            <div className="flex items-center gap-3">
              <Link to="/products"><Button>Shop Products <ArrowRight className="ml-2" size={16} /></Button></Link>
              <Link to="/contact"><Button variant="outline">Get a Quote</Button></Link>
            </div>
            {!user && (
              <>
                <p className="mt-6 text-slate-600 dark:text-slate-300">New here? Create an account or sign in to track orders and faster checkout.</p>
                <div className="mt-3 flex items-center gap-3">
                  <Link to="/auth?mode=register"><Button variant="outline">Sign Up</Button></Link>
                  <Link to="/auth?mode=login"><Button>Login</Button></Link>
                </div>
              </>
            )}

            {/* Location map (expanded) */}
            <div className="mt-10">
              <div className="card p-2 overflow-hidden">
                <iframe
                  title="FASTPRINT Location"
                  className="w-full h-72 md:h-96 rounded-md"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Kimathi%20Street%2C%20Nairobi%20CBD&output=embed"
                />
              </div>
            </div>
          </div>

          {/* Right: Featured products (sticky on large screens) */}
          <div className="order-2 lg:sticky lg:top-20 lg:max-h-[calc(100vh-120px)] lg:overflow-auto">
            <h2 className="text-2xl font-semibold mb-4">Featured</h2>
            {featured.length === 0 ? (
              <p className="text-slate-600">No featured products yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featured.map(p => (
                  <Link to={`/products/${p._id}`} key={p._id} className="card p-4 hover:translate-y-0.5 transition-transform">
                    <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
                      {p.images?.[0] ? <img src={assetUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover"/> : null}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-slate-600">KSh {p.basePrice}</p>
                      </div>
                      <Button size="sm">View</Button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="container py-8">
        <h2 className="text-2xl font-semibold mb-4">Request a Custom Quote</h2>
        <QuoteForm context="Homepage" />
      </section>
      
    </div>
  )
}
