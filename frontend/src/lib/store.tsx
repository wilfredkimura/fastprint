import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from './api'
import { api, me } from './api'

export type User = { id: string; name: string; email: string; role: string } | null
export type CartItem = { product: Product; quantity: number; customization?: Record<string, any> }
export type WishlistItem = { product: Product; addedAt: number }

type Store = {
  user: User
  setUser: (u: User) => void
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  wishlist: WishlistItem[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

const Ctx = createContext<Store | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  // hydrate
  useEffect(() => {
    try {
      const u = localStorage.getItem('fp_user')
      if (u) setUser(JSON.parse(u))
      const c = localStorage.getItem('fp_cart')
      if (c) setCart(JSON.parse(c))
      const w = localStorage.getItem('fp_wishlist')
      if (w) setWishlist(JSON.parse(w))
    } catch {}
  }, [])

  // verify session: try Clerk-authenticated endpoint, then legacy cookie endpoint
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get('/auth/clerk/me')
        if (!cancelled) setUser(data)
      } catch {
        try {
          const legacy = await me()
          if (!cancelled) setUser(legacy)
        } catch {
          if (!cancelled) setUser(prev => (prev ? null : prev))
        }
      }
    })()
    return () => { cancelled = true }
  }, [])

  // persist
  useEffect(() => {
    try { localStorage.setItem('fp_user', JSON.stringify(user)) } catch {}
  }, [user])
  useEffect(() => {
    try { localStorage.setItem('fp_cart', JSON.stringify(cart)) } catch {}
  }, [cart])
  useEffect(() => {
    try { localStorage.setItem('fp_wishlist', JSON.stringify(wishlist)) } catch {}
  }, [wishlist])

  const value = useMemo<Store>(()=>({
    user,
    setUser,
    cart,
    addToCart: (item) => setCart(arr => {
      const idx = arr.findIndex(i => i.product._id === item.product._id)
      if (idx >= 0) {
        const copy = [...arr]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity }
        return copy
      }
      return [...arr, item]
    }),
    removeFromCart: (id) => setCart(arr => arr.filter(i => i.product._id !== id)),
    clearCart: () => setCart([]),
    wishlist,
    addToWishlist: (product) => setWishlist(arr => {
      if (arr.some(w => w.product._id === product._id)) return arr
      return [...arr, { product, addedAt: Date.now() }]
    }),
    removeFromWishlist: (id) => setWishlist(arr => arr.filter(w => w.product._id !== id)),
    isWishlisted: (id) => wishlist.some(w => w.product._id === id),
  }), [user, cart, wishlist])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('StoreProvider missing')
  return ctx
}
