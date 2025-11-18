import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useChecklistSubmissionService } from '@/services/checklist-submission-services/checklist-submission-services'
import { toast } from 'sonner'

export const checklistSubmissionQueryKeys = {
  all: ['checklistSubmissions'] as const,
  byId: (id: string) => ['checklistSubmissions', id] as const,
  byOrganisationIdAndChecklistId: (
    organisationId: string,
    checklistId: string
  ) =>
    [
      'checklistSubmissionsOrgId',
      organisationId,
      'checklistSubmissionsChecklistId',
      checklistId,
    ] as const,
}

export const useChecklistSubmissions = () => {
  const { getAll } = useChecklistSubmissionService()

  return useQuery({
    queryKey: checklistSubmissionQueryKeys.all,
    queryFn: getAll,
  })
}

export const useChecklistSubmission = (id: string) => {
  const { getById } = useChecklistSubmissionService()

  return useQuery({
    queryKey: checklistSubmissionQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useGetChecklistSubmissionByOrgIdAndChecklistId = (
  organisationId: string,
  checklistId: string,
  options?: { enabled?: boolean }
) => {
  const { getByOrganisationIdAndChecklistId } = useChecklistSubmissionService()

  return useQuery({
    queryKey: checklistSubmissionQueryKeys.byOrganisationIdAndChecklistId(
      organisationId,
      checklistId
    ),
    queryFn: () =>
      getByOrganisationIdAndChecklistId(organisationId, checklistId),
    enabled: !!checklistId && !!organisationId && (options?.enabled ?? true),
  })
}

export const useCreateChecklistSubmission = () => {
  const { create } = useChecklistSubmissionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: (_, variables) => {
      toast.success('Checklist Submission submitted successfully!')

      queryClient.invalidateQueries({
        queryKey: checklistSubmissionQueryKeys.byOrganisationIdAndChecklistId(
          variables.organisationId,
          variables.checklistId
        ),
      })
    },
    onError: () => {
      toast.error('Failed to submit checklist.')
    },
  })
}

export const useUpdateChecklistSubmission = () => {
  const { update } = useChecklistSubmissionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { payload }) => {
      toast.success('Checklist Submission updated successfully!')

      if (payload.organisationId && payload.checklistId) {
        queryClient.invalidateQueries({
          queryKey: checklistSubmissionQueryKeys.byOrganisationIdAndChecklistId(
            payload.organisationId,
            payload.checklistId
          ),
        })
      }

      queryClient.invalidateQueries({
        queryKey: checklistSubmissionQueryKeys.all,
      })
    },
    onError: () => {
      toast.error('Failed to update checklist submission.')
    },
  })
}

export const useDeleteChecklistSubmission = () => {
  const { remove } = useChecklistSubmissionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Checklist Submission deleted successfully!')
      queryClient.invalidateQueries({
        queryKey: ['checklistSubmissionsOrgId'],
        exact: false,
      })
    },
    onError: () => {
      toast.error('Failed to delete checklist Submission.')
    },
  })
}
