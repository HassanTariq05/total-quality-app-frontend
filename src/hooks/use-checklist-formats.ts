import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useChecklistFormatService } from '@/services/checklist-format-services/checklist-format-services'
import { toast } from 'sonner'

export const checklistFormatQueryKeys = {
  all: ['checklistFormats'] as const,
  byId: (id: string) => ['checklistFormats', id] as const,
}

export const useChecklistFormats = (chapterId: string) => {
  const { getAll } = useChecklistFormatService()

  return useQuery({
    queryKey: checklistFormatQueryKeys.byId(chapterId),
    queryFn: () => getAll(chapterId),
    enabled: !!chapterId,
  })
}

export const useChecklistFormat = (id: string) => {
  const { getById } = useChecklistFormatService()

  return useQuery({
    queryKey: checklistFormatQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useCreateChecklistFormat = () => {
  const { create } = useChecklistFormatService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Form Format created successfully!')
      queryClient.invalidateQueries({ queryKey: checklistFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create checklist format.')
    },
  })
}

export const useUpdateChecklistFormat = () => {
  const { update } = useChecklistFormatService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Form Format updated successfully!')
      queryClient.invalidateQueries({
        queryKey: checklistFormatQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: checklistFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update checklist format.')
    },
  })
}

export const useDeleteChecklistFormat = () => {
  const { remove } = useChecklistFormatService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Form Format deleted successfully!')
      queryClient.invalidateQueries({ queryKey: checklistFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete checklist format.')
    },
  })
}
