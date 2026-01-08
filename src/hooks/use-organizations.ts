import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UpdateOrganizationPayload,
  useOrganizationService,
} from '@/services/organization-services/organization-services'
import { toast } from 'sonner'

export const organizationQueryKeys = {
  all: ['organizations'] as const,
  byId: (id: string) => ['organizations', id] as const,
}

export const useOrganizations = (isSuperAdmin: boolean, orgId?: string) => {
  const { getAll, getById } = useOrganizationService()

  return useQuery({
    queryKey: isSuperAdmin
      ? organizationQueryKeys.all
      : organizationQueryKeys.byId(orgId!),

    queryFn: async () => {
      if (isSuperAdmin) {
        return getAll()
      }
      const org = await getById(orgId!)
      return [org]
    },

    enabled: isSuperAdmin || !!orgId,
  })
}

export const useOrganization = (id: string) => {
  const { getById } = useOrganizationService()
  return useQuery({
    queryKey: organizationQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useCreateOrganization = () => {
  const { create } = useOrganizationService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Organization created successfully!')
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create organization.')
    },
  })
}

export const useUpdateOrganization = () => {
  const { update } = useOrganizationService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateOrganizationPayload
    }) => update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Organization updated successfully!')
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update organization.')
    },
  })
}

export const useDeleteOrganization = () => {
  const { remove } = useOrganizationService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Organization deleted successfully!')
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete organization.')
    },
  })
}
