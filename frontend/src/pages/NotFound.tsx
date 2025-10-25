import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container py-24 text-center">
      <h1 className="text-5xl font-extrabold mb-4">404</h1>
      <p className="text-slate-600 mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="inline-flex h-11 px-5 rounded-md bg-primary text-white">Go Home</Link>
    </section>
  )
}
