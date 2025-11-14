import { ReactNode, useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (!auth.accessToken) {
        setLoading(false)
        return
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_AUTH_BASE_URL}/me`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        )
        auth.setUser(data.user)
      } catch (err) {
        // auth.reset()
        // navigate({ to: '/clerk/sign-in' })
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  if (loading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
      </div>
    )
  }

  return <>{children}</>
}
