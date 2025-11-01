import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChecklistService } from '@/services/checklist-services/checklist-services'
import { toast } from 'sonner'

export const checklistQueryKeys = {
  all: ['checklists'] as const,
  byId: (id: string) => ['checklists', id] as const,
}

export const useChecklists = (id: string) =>
  useQuery({
    queryKey: checklistQueryKeys.byId(id),
    queryFn: () => ChecklistService.getAll(id),
  })

export const useChecklist = (id: string) =>
  useQuery({
    queryKey: checklistQueryKeys.byId(id),
    queryFn: () => ChecklistService.getById(id),
    enabled: !!id,
  })

export const useCreateChecklist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ChecklistService.create,
    onSuccess: () => {
      toast.success('Checklist created successfully!')
      queryClient.invalidateQueries({ queryKey: checklistQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create checklist.')
    },
  })
}

export const useUpdateChecklist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      ChecklistService.update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Checklist updated successfully!')
      queryClient.invalidateQueries({
        queryKey: checklistQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: checklistQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update checklist.')
    },
  })
}

export const useDeleteChecklist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ChecklistService.delete,
    onSuccess: () => {
      toast.success('Checklist deleted successfully!')
      queryClient.invalidateQueries({ queryKey: checklistQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete checklist.')
    },
  })
}
