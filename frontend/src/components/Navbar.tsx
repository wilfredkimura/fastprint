import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Phone, Sun, Moon, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import { logout as apiLogout } from '../lib/api'

export default function Navbar() {
  const [dark, setDark] = useState(false)
  const { user, setUser, cart } = useStore()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(prefers)
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-screen backdrop-blur bg-white/70 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800">
      <div className="w-full px-4 md:px-6 lg:px-8 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-extrabold tracking-tight text-lg">FASTPRINT</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-700 dark:text-slate-300">
            <NavLink to="/" className={({isActive}) => isActive ? 'font-semibold' : ''}>Home</NavLink>
            <NavLink to="/products" className={({isActive}) => isActive ? 'font-semibold' : ''}>Products</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'font-semibold' : ''}>About</NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? 'font-semibold' : ''}>Contact</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={({isActive}) => isActive ? 'font-semibold' : ''}>Admin Dashboard</NavLink>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a href="tel:0721248369" className="hidden md:flex items-center gap-2 text-sm"><Phone size={18}/> 0721248369</a>
          <Link to="/cart" className="relative"><ShoppingCart />
            <span className="absolute -top-1 -right-2 bg-primary text-white rounded-full h-5 min-w-[20px] px-1 text-[11px] flex items-center justify-center">{cart.length}</span>
          </Link>
          <button aria-label="Toggle theme" onClick={() => setDark(v=>!v)} className="p-2 rounded-md border border-slate-300 dark:border-slate-700">
            {dark ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
          <button className="md:hidden p-2" aria-label="Toggle menu" onClick={()=>setOpen(o=>!o)}>
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
          {user ? (
            <div className="flex items-center gap-2 text-sm">
              {user.role === 'admin' && <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">Admin</span>}
              <span className="hidden md:inline">Hi, {user.name?.split(' ')[0] || 'User'}</span>
              <button onClick={async ()=>{ try { await apiLogout() } finally { setUser(null) } }} className="underline">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/auth" className="text-sm">Login</NavLink>
              <NavLink to="/auth?provider=email" className="text-sm">Login (DB)</NavLink>
              <NavLink to="/auth?provider=email&mode=register" className="text-sm">Register (DB)</NavLink>
            </div>
          )}
        </div>
      </div>
      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur">
          <nav className="w-full px-4 md:px-6 lg:px-8 py-3 flex flex-col gap-2 text-sm">
            <NavLink onClick={()=>setOpen(false)} to="/" className={({isActive}) => isActive ? 'font-semibold' : ''}>Home</NavLink>
            <NavLink onClick={()=>setOpen(false)} to="/products" className={({isActive}) => isActive ? 'font-semibold' : ''}>Products</NavLink>
            <NavLink onClick={()=>setOpen(false)} to="/about" className={({isActive}) => isActive ? 'font-semibold' : ''}>About</NavLink>
            <NavLink onClick={()=>setOpen(false)} to="/contact" className={({isActive}) => isActive ? 'font-semibold' : ''}>Contact</NavLink>
            {user?.role === 'admin' && (
              <NavLink onClick={()=>setOpen(false)} to="/admin" className={({isActive}) => isActive ? 'font-semibold' : ''}>Admin Dashboard</NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
