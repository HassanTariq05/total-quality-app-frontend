import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UpdateChapterPayload,
  useChapterService,
} from '@/services/chapter-services/chapter-services'
import { toast } from 'sonner'

export const chapterQueryKeys = {
  all: ['chapters'] as const,
  byId: (id: string) => ['chapters', id] as const,
}

export const useChapters = (id: string) => {
  const { getAll } = useChapterService()
  return useQuery({
    queryKey: chapterQueryKeys.byId(id),
    queryFn: () => getAll(id),
  })
}

export const useChapter = (id: string) => {
  const { getById } = useChapterService()
  return useQuery({
    queryKey: chapterQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useCreateChapter = () => {
  const { create } = useChapterService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Chapter created successfully!')
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to create chapter.')
    },
  })
}

export const useUpdateChapter = () => {
  const { update } = useChapterService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateChapterPayload
    }) => update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Chapter updated successfully!')
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.byId(id) })
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update chapter.')
    },
  })
}

export const useDeleteChapter = () => {
  const { remove } = useChapterService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Chapter deleted successfully!')
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete chapter.')
    },
  })
}
