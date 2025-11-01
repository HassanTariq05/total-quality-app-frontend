import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChecklistFormatService } from '@/services/checklist-format-services/checklist-format-services'
import { toast } from 'sonner'

export const checklistFormatQueryKeys = {
  all: ['checklistFormats'] as const,
  byId: (id: string) => ['checklistFormats', id] as const,
}

export const useChecklistFormats = (id: string) =>
  useQuery({
    queryKey: checklistFormatQueryKeys.byId(id),
    queryFn: () => ChecklistFormatService.getAll(id),
  })

export const useChecklistFormat = (id: string) =>
  useQuery({
    queryKey: checklistFormatQueryKeys.byId(id),
    queryFn: () => ChecklistFormatService.getById(id),
    enabled: !!id,
  })

export const useCreateChecklistFormat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ChecklistFormatService.create,
    onSuccess: () => {
      toast.success('Form Format created successfully!')
      queryClient.invalidateQueries({ queryKey: checklistFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create checklistFormat.')
    },
  })
}

export const useUpdateChecklistFormat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      ChecklistFormatService.update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Form Format updated successfully!')
      queryClient.invalidateQueries({
        queryKey: checklistFormatQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: checklistFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update checklistFormat.')
    },
  })
}

export const useDeleteChecklistFormat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ChecklistFormatService.delete,
    onSuccess: () => {
      toast.success('Form Format deleted successfully!')
      queryClient.invalidateQueries({ queryKey: checklistFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete checklistFormat.')
    },
  })
}
