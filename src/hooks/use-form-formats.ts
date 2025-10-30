import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FormFormatService } from '@/services/form-format-services/form-format-services'
import { toast } from 'sonner'

export const formFormatQueryKeys = {
  all: ['formFormats'] as const,
  byId: (id: string) => ['formFormats', id] as const,
}

export const useFormFormats = (id: string) =>
  useQuery({
    queryKey: formFormatQueryKeys.byId(id),
    queryFn: () => FormFormatService.getAll(id),
  })

export const useFormFormat = (id: string) =>
  useQuery({
    queryKey: formFormatQueryKeys.byId(id),
    queryFn: () => FormFormatService.getById(id),
    enabled: !!id,
  })

export const useCreateFormFormat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: FormFormatService.create,
    onSuccess: () => {
      toast.success('Form Format created successfully!')
      queryClient.invalidateQueries({ queryKey: formFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create formFormat.')
    },
  })
}

export const useUpdateFormFormat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      FormFormatService.update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Form Format updated successfully!')
      queryClient.invalidateQueries({
        queryKey: formFormatQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: formFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update formFormat.')
    },
  })
}

export const useDeleteFormFormat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: FormFormatService.delete,
    onSuccess: () => {
      toast.success('Form Format deleted successfully!')
      queryClient.invalidateQueries({ queryKey: formFormatQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete formFormat.')
    },
  })
}
