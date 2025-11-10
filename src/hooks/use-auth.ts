import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthService } from '@/services/auth-services/auth-services'
import { toast } from 'sonner'

export const authQueryKeys = {
  all: ['authentications'] as const,
  byId: (id: string) => ['authentications', id] as const,
}

export const useAuthLogin = () => {
  const { login } = useAuthService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success('Logged in successfully!')
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to login.')
    },
  })
}

export const useAuthRegister = () => {
  const { register } = useAuthService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('User registered successfully!')
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to register user.')
    },
  })
}
