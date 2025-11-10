import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccreditationService } from '@/services/accreditation-services/accreditation-services'
import { toast } from 'sonner'

export const accreditationQueryKeys = {
  all: ['accreditations'] as const,
  byId: (id: string) => ['accreditations', id] as const,
}

export const useAccreditations = () => {
  const { getAll } = useAccreditationService()

  return useQuery({
    queryKey: accreditationQueryKeys.all,
    queryFn: getAll,
  })
}

export const useAccreditation = (id: string) => {
  const { getById } = useAccreditationService()

  return useQuery({
    queryKey: accreditationQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useCreateAccreditation = () => {
  const { create } = useAccreditationService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Accreditation created successfully!')
      queryClient.invalidateQueries({ queryKey: accreditationQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create accreditation.')
    },
  })
}

export const useUpdateAccreditation = () => {
  const { update } = useAccreditationService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Accreditation updated successfully!')
      queryClient.invalidateQueries({
        queryKey: accreditationQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: accreditationQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update accreditation.')
    },
  })
}

export const useDeleteAccreditation = () => {
  const { remove } = useAccreditationService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Accreditation deleted successfully!')
      queryClient.invalidateQueries({ queryKey: accreditationQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete accreditation.')
    },
  })
}
