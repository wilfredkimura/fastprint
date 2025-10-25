import { NavLink, Outlet } from 'react-router-dom'

export default function Admin() {
  return (
    <section className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="rounded-md border border-slate-200 dark:border-slate-800 p-3">
          <nav className="flex md:flex-col gap-3 text-sm">
            <NavLink to="/admin/orders" className={({isActive})=>isActive? 'font-semibold' : ''}>Orders</NavLink>
            <NavLink to="/admin/products" className={({isActive})=>isActive? 'font-semibold' : ''}>Products</NavLink>
            <NavLink to="/admin/categories" className={({isActive})=>isActive? 'font-semibold' : ''}>Categories</NavLink>
            <NavLink to="/admin/users" className={({isActive})=>isActive? 'font-semibold' : ''}>Users</NavLink>
          </nav>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </section>
  )
}
