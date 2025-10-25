import { useEffect, useState } from 'react'
import { fetchUsers, deleteUser, register, updateUser } from '../../lib/api'
import { useToast } from '../../lib/toast'

export default function AdminUsers() {
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { push } = useToast()

  async function refresh(){
    const d = await fetchUsers()
    setItems(d)
  }

  useEffect(() => { refresh().catch(()=>{}) }, [])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await register({ name, email, password })
      setName(''); setEmail(''); setPassword('')
      await refresh()
      push('User created', 'success')
    } catch {
      push('Failed to create user', 'error')
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this user?')) return
    try {
      await deleteUser(id)
      await refresh()
      push('User deleted', 'success')
    } catch {
      push('Failed to delete user', 'error')
    }
  }
  return (
    <section className="container py-12">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <form onSubmit={onCreate} className="card p-4 mb-6 grid md:grid-cols-4 gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Temp Password" type="password" className="h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" />
        <div className="flex items-center md:justify-end">
          <button className="h-10 px-4 rounded-md bg-primary text-white">Add User</button>
        </div>
      </form>
      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted dark:bg-slate-800 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(u => (
              <tr key={u._id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <button
                    onClick={async ()=>{
                      const to = u.role === 'admin' ? 'customer' : 'admin'
                      try {
                        await updateUser(u._id, { role: to })
                        push(to === 'admin' ? 'User promoted to admin' : 'User demoted to customer', 'success')
                        await refresh()
                      } catch { push('Failed to change role', 'error') }
                    }}
                    className="text-sm underline mr-3 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  >{u.role === 'admin' ? 'Demote' : 'Promote'}</button>
                  <button onClick={()=>onDelete(u._id)} className="text-sm underline text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
