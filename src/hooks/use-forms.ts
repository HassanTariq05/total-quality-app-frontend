import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FormService } from '@/services/form-services/form-services'
import { toast } from 'sonner'

export const formQueryKeys = {
  all: ['forms'] as const,
  byId: (id: string) => ['forms', id] as const,
}

export const useForms = (id: string) =>
  useQuery({
    queryKey: formQueryKeys.byId(id),
    queryFn: () => FormService.getAll(id),
  })

export const useForm = (id: string) =>
  useQuery({
    queryKey: formQueryKeys.byId(id),
    queryFn: () => FormService.getById(id),
    enabled: !!id,
  })

export const useCreateForm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: FormService.create,
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      FormService.update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Form updated successfully!')
      queryClient.invalidateQueries({
        queryKey: formQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: formQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update form.')
    },
  })
}

export const useDeleteForm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: FormService.delete,
    onSuccess: () => {
      toast.success('Form deleted successfully!')
      queryClient.invalidateQueries({ queryKey: formQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete form.')
    },
  })
}
