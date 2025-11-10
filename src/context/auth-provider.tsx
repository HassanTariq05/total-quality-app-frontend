import { ReactNode, useEffect, useState } from 'react'
import axios from 'axios'
// import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuthStore()
  //   const navigate = useNavigate()
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

  if (loading) return <div>Loading...</div>

  return <>{children}</>
}
