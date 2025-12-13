import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { usePolicyService } from '@/services/policy-services/policy-services'
import { toast } from 'sonner'

export const policyQueryKeys = {
  all: ['policies'] as const,
  byId: (id: string) => ['policies', id] as const,
}

export const usePolicies = (
  chapterId: string,
  page: number = 0,
  size: number = 10,
  enabled: boolean = true
) => {
  const { getAll } = usePolicyService()

  return useQuery({
    queryKey: [...policyQueryKeys.byId(chapterId), { page, size }],
    queryFn: () => getAll(chapterId, page, size),
    enabled: !!chapterId && enabled,
    placeholderData: keepPreviousData,
  })
}

export const usePolicy = (id: string) => {
  const { getById } = usePolicyService()

  return useQuery({
    queryKey: policyQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useCreatePolicy = () => {
  const { create } = usePolicyService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Policy created successfully!')
      queryClient.invalidateQueries({ queryKey: policyQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create policy.')
    },
  })
}

export const useUpdatePolicy = () => {
  const { update } = usePolicyService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Policy updated successfully!')
      queryClient.invalidateQueries({
        queryKey: policyQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: policyQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update policy.')
    },
  })
}

export const useDeletePolicy = () => {
  const { remove } = usePolicyService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Policy deleted successfully!')
      queryClient.invalidateQueries({ queryKey: policyQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete policy.')
    },
  })
}
