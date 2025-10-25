import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../lib/store'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/auth', { replace: true })
    }
  }, [user, navigate])

  if (!user || user.role !== 'admin') return null
  return <>{children}</>
}
