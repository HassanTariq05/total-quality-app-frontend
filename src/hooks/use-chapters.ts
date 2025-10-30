import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChapterService } from '@/services/chapter-services/chapter-services'
import { toast } from 'sonner'

export const chapterQueryKeys = {
  all: ['chapters'] as const,
  byId: (id: string) => ['chapters', id] as const,
}

export const useChapters = (id: string) =>
  useQuery({
    queryKey: chapterQueryKeys.byId(id),
    queryFn: () => ChapterService.getAll(id),
  })

export const useChapter = (id: string) =>
  useQuery({
    queryKey: chapterQueryKeys.byId(id),
    queryFn: () => ChapterService.getById(id),
    enabled: !!id,
  })

export const useCreateChapter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ChapterService.create,
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      ChapterService.update(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Chapter updated successfully!')
      queryClient.invalidateQueries({
        queryKey: chapterQueryKeys.byId(id),
      })
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update chapter.')
    },
  })
}

export const useDeleteChapter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ChapterService.delete,
    onSuccess: () => {
      toast.success('Chapter deleted successfully!')
      queryClient.invalidateQueries({ queryKey: chapterQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete chapter.')
    },
  })
}
