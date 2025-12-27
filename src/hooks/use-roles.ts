import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UpdateRolePayload,
  useRoleService,
} from '@/services/role-services/role-services'
import { toast } from 'sonner'

export const roleQueryKeys = {
  all: ['roles'] as const,
  byId: (id: string) => ['roles', id] as const,
}

export const useRoles = () => {
  const { getAll } = useRoleService()
  return useQuery({
    queryKey: roleQueryKeys.all,
    queryFn: () => getAll(),
  })
}

export const useRole = (id: string) => {
  const { getById } = useRoleService()
  return useQuery({
    queryKey: roleQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useCreateRole = () => {
  const { create } = useRoleService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Role created successfully!')
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create role.')
    },
  })
}

export const useUpdateRole = () => {
  const { update } = useRoleService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Role updated successfully!')
      queryClient.invalidateQueries({
        queryKey: roleQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update role.')
    },
  })
}

export const useDeleteRole = () => {
  const { remove } = useRoleService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Role deleted successfully!')
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete role.')
    },
  })
}
