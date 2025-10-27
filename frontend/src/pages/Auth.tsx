import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, SignUp, useUser } from '@clerk/clerk-react'
import { login, register } from '../lib/api'
import { useStore } from '../lib/store'
import { useToast } from '../lib/toast'

export default function Auth() {
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [provider, setProvider] = useState<'clerk'|'email'>('clerk')
  const navigate = useNavigate()
  const location = useLocation()
  const { isSignedIn } = useUser()
  const { setUser } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  useEffect(() => {
    if (isSignedIn) navigate('/')
  }, [isSignedIn, navigate])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const m = params.get('mode')
    if (m === 'login' || m === 'register') setMode(m)
    const p = params.get('provider')
    if (p === 'clerk' || p === 'email') setProvider(p)
  }, [location.search])

  return (
    <section className="container py-16 max-w-md">
      <SignedOut>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            className={`h-10 rounded-md border ${provider==='clerk' ? 'bg-primary text-white border-primary' : 'border-slate-300 dark:border-slate-700'}`}
            onClick={()=>setProvider('clerk')}
          >Use Clerk</button>
          <button
            className={`h-10 rounded-md border ${provider==='email' ? 'bg-primary text-white border-primary' : 'border-slate-300 dark:border-slate-700'}`}
            onClick={()=>setProvider('email')}
          >Email & Password</button>
        </div>

        {provider === 'clerk' ? (
          mode === 'login' ? (
            <SignIn routing="path" path="/auth" signUpUrl="/auth?mode=register" />
          ) : (
            <SignUp routing="path" path="/auth" signInUrl="/auth?mode=login" />
          )
        ) : (
          <form
            onSubmit={async (e)=>{
              e.preventDefault()
              setError('')
              setLoading(true)
              try {
                if (mode === 'register') {
                  if (password.length < 6) {
                    setError('Password must be at least 6 characters')
                    return
                  }
                  if (password !== confirm) {
                    setError('Passwords do not match')
                    return
                  }
                }
                if (mode === 'register') {
                  const u = await register({ name, email, password })
                  setUser(u)
                } else {
                  const u = await login({ email, password })
                  setUser(u)
                }
                navigate('/')
              } catch (err: any) {
                setError('Authentication failed')
              } finally {
                setLoading(false)
              }
            }}
            className="card p-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={()=>setMode('login')} className={`h-9 rounded-md border text-sm ${mode==='login' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100' : 'border-slate-300 dark:border-slate-700'}`}>Login</button>
              <button type="button" onClick={()=>setMode('register')} className={`h-9 rounded-md border text-sm ${mode==='register' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100' : 'border-slate-300 dark:border-slate-700'}`}>Register</button>
            </div>
            {mode === 'register' && (
              <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="Your Name"
                className="h-11 w-full px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
                required
              />
            )}
            <input
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="h-11 w-full px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
              required
              autoComplete="email"
            />
            <input
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="h-11 w-full px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
              required
              autoComplete={mode==='login' ? 'current-password' : 'new-password'}
            />
            {mode === 'register' && (
              <input
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                placeholder="Confirm Password"
                type="password"
                className="h-11 w-full px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
                required
                autoComplete="new-password"
              />
            )}
            {mode === 'login' && (
              <div className="text-right text-sm">
                <button type="button" className="underline" onClick={()=>toast.push('Password reset is not available yet. Please contact support.', 'error')}>Forgot password?</button>
              </div>
            )}
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button disabled={loading} className="h-11 w-full rounded-md bg-primary text-white">
              {loading ? 'Please wait…' : (mode === 'register' ? 'Create Account' : 'Login')}
            </button>
          </form>
        )}
        <div className="text-center mt-4 text-sm">
          {mode === 'login' ? (
            <button className="underline" onClick={()=>setMode('register')}>Need an account? Register</button>
          ) : (
            <button className="underline" onClick={()=>setMode('login')}>Already have an account? Login</button>
          )}
        </div>
      </SignedOut>
      <SignedIn>
        <p className="text-center">You are already signed in. Redirecting...</p>
      </SignedIn>
    </section>
  )
}
