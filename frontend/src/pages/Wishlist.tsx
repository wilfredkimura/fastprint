import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { assetUrl } from '../lib/api'

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useStore()
  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-4">Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-slate-600">Your saved items will appear here.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist
            .slice()
            .sort((a,b)=> b.addedAt - a.addedAt)
            .map(({ product }) => (
            <div key={product._id} className="card p-4 relative">
              <button
                onClick={()=>removeFromWishlist(product._id)}
                className="absolute top-3 right-3 h-8 px-3 rounded-md border text-sm bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700"
              >Remove</button>
              <Link to={`/products/${product._id}`} className="block">
                <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
                  {product.images?.[0] ? <img src={assetUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover"/> : null}
                </div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-slate-600">KSh {product.basePrice}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
