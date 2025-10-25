import { NavLink } from 'react-router-dom'
import { useStore } from '../lib/store'

export default function Footer() {
  const { user } = useStore()
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-sm">
      <div className="container grid gap-6 md:grid-cols-3 items-start">
        <div className="text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} FASTPRINTKE</div>
        <nav className="flex items-center justify-center gap-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="md:justify-end flex flex-col md:items-end gap-1 text-slate-700 dark:text-slate-300">
          <div><span className="font-medium">Address:</span> Kimathi Street, Nairobi CBD</div>
          <div><span className="font-medium">Hours:</span> Mon–Sat 9:00am–6:00pm</div>
          <div><span className="font-medium">Phone:</span> <a className="underline" href="tel:0721248369">0721248369</a></div>
          <div><span className="font-medium">Email:</span> <a className="underline" href="mailto:info@fastprintke.com">info@fastprintke.com</a></div>
          <div className="mt-2 flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/254721248369" target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
