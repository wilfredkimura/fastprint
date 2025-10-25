import { useEffect, useState } from 'react'
import { fetchOrders } from '../../lib/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  useEffect(() => { fetchOrders().then(setOrders).catch(()=>{}) }, [])
  return (
    <section className="container py-12">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <div className="card overflow-auto">
        <table className="min-w-full min-w-[700px] text-sm">
          <thead className="bg-muted dark:bg-slate-800 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ordered</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3 font-mono text-xs">{o._id}</td>
                <td className="p-3">{o.customerName || '-'}</td>
                <td className="p-3">KSh {o.totalAmount}</td>
                <td className="p-3">{o.orderStatus}</td>
                <td className="p-3">{new Date(o.orderedAt || o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
