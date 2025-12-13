import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useFormService } from '@/services/form-services/form-services'
import { toast } from 'sonner'

export const formQueryKeys = {
  all: ['forms'] as const,
  byId: (id: string) => ['forms', id] as const,
}

export const useForms = (
  chapterId: string,
  page: number = 0,
  size: number = 10,
  enabled: boolean = true
) => {
  const { getAll } = useFormService()

  return useQuery({
    queryKey: [...formQueryKeys.byId(chapterId), { page, size }],
    queryFn: () => getAll(chapterId, page, size),
    enabled: !!chapterId && enabled,
    placeholderData: keepPreviousData,
  })
}

export const useForm = (id: string) => {
  const { getById } = useFormService()

  return useQuery({
    queryKey: formQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useCreateForm = () => {
  const { create } = useFormService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Form created successfully!')
      queryClient.invalidateQueries({ queryKey: formQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create form.')
    },
  })
}

export const useUpdateForm = () => {
  const { update } = useFormService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Form updated successfully!')
      queryClient.invalidateQueries({ queryKey: formQueryKeys.byId(id) })
      queryClient.invalidateQueries({ queryKey: formQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update form.')
    },
  })
}

export const useDeleteForm = () => {
  const { remove } = useFormService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Form deleted successfully!')
      queryClient.invalidateQueries({ queryKey: formQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete form.')
    },
  })
}
