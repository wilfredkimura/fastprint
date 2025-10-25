import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, SignUp, useUser } from '@clerk/clerk-react'

export default function Auth() {
  const [mode, setMode] = useState<'login'|'register'>('login')
  const navigate = useNavigate()
  const location = useLocation()
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn) navigate('/')
  }, [isSignedIn, navigate])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const m = params.get('mode')
    if (m === 'login' || m === 'register') setMode(m)
  }, [location.search])

  return (
    <section className="container py-16 max-w-md">
      <SignedOut>
        {mode === 'login' ? (
          <SignIn routing="path" path="/auth" signUpUrl="/auth?mode=register" />
        ) : (
          <SignUp routing="path" path="/auth" signInUrl="/auth?mode=login" />
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
