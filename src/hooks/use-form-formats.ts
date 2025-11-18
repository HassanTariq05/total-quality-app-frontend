import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormFormatService } from '@/services/form-format-services/form-format-services'
import { toast } from 'sonner'

export const formFormatQueryKeys = {
  all: ['formFormats'] as const,
  byId: (id: string) => ['formFormats', id] as const,
}

export const useFormFormats = (chapterId: string) => {
  const { getAll } = useFormFormatService()

  return useQuery({
    queryKey: formFormatQueryKeys.byId(chapterId),
    queryFn: () => getAll(chapterId),
    enabled: !!chapterId,
  })
}

export const useFormFormat = (id?: string) => {
  const { getByFormId } = useFormFormatService()

  return useQuery({
    queryKey: formFormatQueryKeys.byId(id ?? ''),
    queryFn: () => getByFormId(id!),
    enabled: !!id,
  })
}

export const useCreateFormFormat = () => {
  const { create } = useFormFormatService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Form Format created successfully!')
      queryClient.invalidateQueries({ queryKey: formFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create form format.')
    },
  })
}

export const useUpdateFormFormat = () => {
  const { update } = useFormFormatService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Form Format updated successfully!')
      queryClient.invalidateQueries({
        queryKey: formFormatQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: formFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update form format.')
    },
  })
}

export const useDeleteFormFormat = () => {
  const { remove } = useFormFormatService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Form Format deleted successfully!')
      queryClient.invalidateQueries({ queryKey: formFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete form format.')
    },
  })
}
