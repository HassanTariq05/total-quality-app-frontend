import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useChecklistService } from '@/services/checklist-services/checklist-services'
import { toast } from 'sonner'

export const checklistQueryKeys = {
  all: ['checklists'] as const,
  byId: (id: string) => ['checklists', id] as const,
}

export const useChecklists = (
  chapterId: string,
  page: number = 0,
  size: number = 10,
  keyword: string = '',
  enabled: boolean = true
) => {
  const { getAll } = useChecklistService()

  return useQuery({
    queryKey: [...checklistQueryKeys.byId(chapterId), { page, size, keyword }],
    queryFn: () => getAll(chapterId, page, size, keyword),
    enabled: !!chapterId && enabled,
    placeholderData: keepPreviousData,
  })
}

export const useChecklist = (id: string) => {
  const { getById } = useChecklistService()

  return useQuery({
    queryKey: checklistQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useCreateChecklist = () => {
  const { create } = useChecklistService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
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
  const { update } = useChecklistService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
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
  const { remove } = useChecklistService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Checklist deleted successfully!')
      queryClient.invalidateQueries({ queryKey: checklistQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete checklist.')
    },
  })
}
