import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import {
  UpdateRolePayload,
  useRoleService,
} from '@/services/role-services/role-services'
import { toast } from 'sonner'

export const roleQueryKeys = {
  all: ['roles'] as const,
  byOrg: (orgId?: string) => ['roles', 'org', orgId] as const,
  byId: (id: string) => ['roles', id] as const,
}

export const useRoles = (isSuperAdmin: boolean, orgId?: string) => {
  const { getAll, getByOrgId } = useRoleService()

  return useQuery({
    queryKey: isSuperAdmin ? roleQueryKeys.all : roleQueryKeys.byOrg(orgId!),
    queryFn: () => (isSuperAdmin ? getAll() : getByOrgId(orgId!)),
    enabled: isSuperAdmin || !!orgId,
  })
}

export const useRolesByOrg = (
  orgId?: string,
  options?: Pick<
    UseQueryOptions<any, Error>,
    'enabled' | 'staleTime' | 'select'
  >
) => {
  const { getByOrgId } = useRoleService()

  return useQuery({
    queryKey: roleQueryKeys.byOrg(orgId),
    queryFn: () => getByOrgId(orgId!),
    enabled: !!orgId && (options?.enabled ?? true),
    ...options,
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
      queryClient.invalidateQueries({ queryKey: ['roles', 'org'] })
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
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.byId(id) })
      queryClient.invalidateQueries({ queryKey: roleQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ['roles', 'org'] })
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
      queryClient.invalidateQueries({ queryKey: ['roles', 'org'] })
    },
  })
}
