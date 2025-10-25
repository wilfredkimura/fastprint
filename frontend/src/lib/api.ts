import axios from 'axios'

const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api'
export const api = axios.create({
  baseURL: base,
  withCredentials: true,
})

// resolve relative upload paths to absolute backend URL for <img src>
export function assetUrl(u?: string) {
  if (!u) return ''
  try {
    const origin = new URL(api.defaults.baseURL || '').origin
    if (u.startsWith('/uploads/')) return origin + u
    return u
  } catch {
    return u
  }
} // closing brace moved here

// Attach Clerk session token if present (no-ops if Clerk is not set up)
api.interceptors.request.use(async (config) => {
  try {
    const w = globalThis as any
    const clerk = w?.Clerk
    if (clerk?.session?.getToken) {
      const token = await clerk.session.getToken()
      if (token) {
        config.headers = config.headers || {}
        ;(config.headers as any)['Authorization'] = `Bearer ${token}`
      }
    }
  } catch {}
  return config
})

export type Product = {
  _id: string
  name: string
  description?: string
  basePrice: number
  images: string[]
  category: string
  customizationOptions?: Array<any>
  isFeatured?: boolean
  stockQuantity?: number
}

export async function fetchProducts(params: { q?: string; category?: string; sort?: string; page?: number; limit?: number; featured?: boolean } = {}) {
  const { data } = await api.get('/products', { params })
  return data as { items: Product[]; total: number; page: number; pages: number }
}

export async function fetchProduct(id: string) {
  const { data } = await api.get(`/products/${id}`)
  return data as Product
}

export async function fetchCategories() {
  const { data } = await api.get('/categories')
  return data as { _id: string; name: string; slug?: string }[]
}

export async function seedCategories() {
  const { data } = await api.post('/categories/seed')
  return data as { ok: boolean; created: number }
}

export async function fetchOrders() {
  const { data } = await api.get('/orders')
  return data as any[]
}

export async function fetchUsers() {
  const { data } = await api.get('/users')
  return data as any[]
}

export async function deleteUser(id: string) {
  const { data } = await api.delete(`/users/${id}`)
  return data as { ok: boolean }
}

export async function updateUser(id: string, body: { name?: string; email?: string; role?: 'customer'|'admin' }) {
  const { data } = await api.put(`/users/${id}`, body)
  return data as any
}

// auth
export async function register(body: { name: string; email: string; password: string }) {
  const { data } = await api.post('/auth/register', body)
  return data as { id: string; name: string; email: string; role: string }
}

export async function login(body: { email: string; password: string }) {
  const { data } = await api.post('/auth/login', body)
  return data as { id: string; name: string; email: string; role: string }
}

export async function me() {
  const { data } = await api.get('/auth/me')
  return data as { id: string; name: string; email: string; role: string }
}

export async function logout() {
  await api.post('/auth/logout')
}

// products crud
export async function createProduct(body: Partial<Product>) {
  const { data } = await api.post('/products', body)
  return data as Product
}

export async function updateProduct(id: string, body: Partial<Product>) {
  const { data } = await api.put(`/products/${id}`, body)
  return data as Product
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`)
}

export async function seedProducts() {
  const { data } = await api.post('/products/seed')
  return data as { ok: boolean; created: number }
}

// categories crud
export async function createCategory(body: { name: string; slug?: string; description?: string }) {
  const { data } = await api.post('/categories', body)
  return data as { _id: string; name: string; slug?: string }
}

export async function updateCategory(id: string, body: { name?: string; slug?: string; description?: string }) {
  const { data } = await api.put(`/categories/${id}`, body)
  return data as { _id: string; name: string; slug?: string }
}

export async function deleteCategory(id: string) {
  await api.delete(`/categories/${id}`)
}

// orders
export async function createOrder(body: any) {
  const { data } = await api.post('/orders', body)
  return data as any
}
