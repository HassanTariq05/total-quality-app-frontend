import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UpdateUserPayload,
  useUserService,
} from '@/services/user-services/user-services'
import { toast } from 'sonner'

export const userQueryKeys = {
  all: ['users'] as const,
  byId: (id: string) => ['users', id] as const,
}

export const useUsers = () => {
  const { getAll } = useUserService()
  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: () => getAll(),
  })
}

export const useCreateUser = () => {
  const { create } = useUserService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('User created successfully!')
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create user.')
    },
  })
}

export const useUpdateUser = () => {
  const { update } = useUserService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('User updated successfully!')
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update user.')
    },
  })
}
