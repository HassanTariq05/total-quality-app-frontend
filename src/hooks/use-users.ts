import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UpdateUserPayload,
  useUserService,
} from '@/services/user-services/user-services'
import { toast } from 'sonner'

export const userQueryKeys = {
  all: ['users'] as const,
  byOrg: (orgId: string) => ['users', 'org', orgId] as const,
  byId: (id: string) => ['users', id] as const,
}

export const useUsers = (isSuperAdmin: boolean, orgId?: string) => {
  const { getAll, getByOrgId } = useUserService()

  return useQuery({
    queryKey: isSuperAdmin ? userQueryKeys.all : userQueryKeys.byOrg(orgId!),
    queryFn: () => (isSuperAdmin ? getAll() : getByOrgId(orgId!)),
    enabled: isSuperAdmin || !!orgId,
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
      queryClient.invalidateQueries({ queryKey: ['users', 'org'] })
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
      queryClient.invalidateQueries({ queryKey: userQueryKeys.byId(id) })
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ['users', 'org'] })
    },
    onError: () => {
      toast.error('Failed to update user.')
    },
  })
}
