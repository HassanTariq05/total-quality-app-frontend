import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AccreditationService } from '@/services/accreditation-services/accreditation-services'
import { toast } from 'sonner'

export const accreditationQueryKeys = {
  all: ['accreditations'] as const,
  byId: (id: string) => ['accreditations', id] as const,
}

export const useAccreditations = () =>
  useQuery({
    queryKey: accreditationQueryKeys.all,
    queryFn: AccreditationService.getAll,
  })

export const useAccreditation = (id: string) =>
  useQuery({
    queryKey: accreditationQueryKeys.byId(id),
    queryFn: () => AccreditationService.getById(id),
    enabled: !!id,
  })

export const useCreateAccreditation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AccreditationService.create,
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      AccreditationService.update(id, payload),
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AccreditationService.delete,
    onSuccess: () => {
      toast.success('Accreditation deleted successfully!')
      queryClient.invalidateQueries({ queryKey: accreditationQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete accreditation.')
    },
  })
}
