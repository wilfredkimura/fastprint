import { useEffect, useState } from 'react'
import { createCategory, fetchCategories, updateCategory, deleteCategory, seedCategories } from '../../lib/api'
import Modal from '../../components/Modal'

export default function AdminCategories() {
  const [items, setItems] = useState<{_id:string; name:string; slug?:string}[]>([])
  const [editing, setEditing] = useState<{_id:string; name:string; slug?:string} | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  async function refresh(){
    const d = await fetchCategories()
    setItems(d)
  }
  useEffect(() => { refresh().catch(()=>{}) }, [])
  return (
    <section className="container py-12">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="flex items-center justify-between mb-3">
        <div />
        <button
          onClick={async ()=>{ await seedCategories(); await refresh() }}
          className="h-9 px-3 rounded-md bg-primary text-white text-sm"
        >Seed Preset Categories</button>
      </div>
      <CategoryCreate onCreated={(c)=>setItems(arr=>[c, ...arr])} />
      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-muted dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c._id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.slug || '-'}</td>
                <td className="p-3">
                  <button
                    className="text-sm underline mr-3"
                    onClick={()=>{ setEditing(c); setEditName(c.name); setEditSlug(c.slug || '') }}
                  >Edit</button>
                  <button
                    className="text-sm underline text-red-600"
                    onClick={async ()=>{
                      if (!confirm('Delete this category?')) return
                      await deleteCategory(c._id)
                      await refresh()
                    }}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!editing} title="Edit Category" onClose={()=>setEditing(null)}>
        <form onSubmit={async (e)=>{ e.preventDefault(); if(!editing) return; await updateCategory(editing._id, { name: editName, slug: editSlug || undefined }); setEditing(null); await refresh(); }} className="grid md:grid-cols-2 gap-3">
          <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Name" className="h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent" />
          <input value={editSlug} onChange={e=>setEditSlug(e.target.value)} placeholder="Slug (optional)" className="h-11 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent" />
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={()=>setEditing(null)} className="h-10 px-4 rounded-md border border-slate-300 dark:border-slate-700">Cancel</button>
            <button className="h-10 px-4 rounded-md bg-primary text-white">Save</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

function CategoryCreate({ onCreated }: { onCreated: (c: {_id:string; name:string; slug?:string}) => void }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const c = await createCategory({ name, slug })
    setName(''); setSlug('')
    onCreated(c)
  }
  return (
    <form onSubmit={submit} className="card p-4 mb-4 grid md:grid-cols-3 gap-3">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" />
      <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="Slug" className="h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" />
      <button className="h-10 px-4 rounded-md bg-primary text-white">Add Category</button>
    </form>
  )
}
