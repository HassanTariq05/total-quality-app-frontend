import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormSubmissionService } from '@/services/form-submission-services/form-submission-service'
import { toast } from 'sonner'

export const formSubmissionQueryKeys = {
  all: ['formSubmissions'] as const,
  byId: (id: string) => ['formSubmissions', id] as const,
  byOrganisationIdAndFormId: (
    organisationId: string,
    formId: string,
    keyword: string = ''
  ) =>
    [
      'formSubmissions',
      'byOrgAndForm',
      organisationId,
      formId,
      'search',
      keyword.trim().toLowerCase(),
    ] as const,
}

export const useFormSubmissions = () => {
  const { getAll } = useFormSubmissionService()

  return useQuery({
    queryKey: formSubmissionQueryKeys.all,
    queryFn: getAll,
  })
}

export const useFormSubmission = (id: string) => {
  const { getById } = useFormSubmissionService()

  return useQuery({
    queryKey: formSubmissionQueryKeys.byId(id),
    queryFn: () => getById(id),
    enabled: !!id,
  })
}

export const useGetFormSubmissionByOrgIdAndFormId = (
  organisationId: string,
  formId: string,
  keyword: string,
  options?: { enabled?: boolean }
) => {
  const { getByOrganisationIdAndFormId } = useFormSubmissionService()

  return useQuery({
    queryKey: formSubmissionQueryKeys.byOrganisationIdAndFormId(
      organisationId,
      formId,
      keyword ?? ''
    ),
    enabled: !!formId && !!organisationId && (options?.enabled ?? true),

    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false
      return failureCount < 3
    },

    queryFn: async () => {
      try {
        return await getByOrganisationIdAndFormId(
          organisationId,
          formId,
          keyword
        )
      } catch (error: any) {
        // if (error?.response?.status === 404) {
        //   return null
        // }
        // throw error
      }
    },
  })
}

export const useCreateFormSubmission = () => {
  const { create } = useFormSubmissionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: (_, variables) => {
      toast.success('Form submission created successfully!')

      queryClient.invalidateQueries({
        queryKey: formSubmissionQueryKeys.byOrganisationIdAndFormId(
          variables.organisationId,
          variables.formId
        ),
      })
    },
    onError: () => {
      toast.error('Failed to submit form.')
    },
  })
}

export const useUpdateFormSubmission = () => {
  const { update } = useFormSubmissionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      update(id, payload),
    onSuccess: (_, { payload }) => {
      toast.success('Form Submission updated successfully!')

      if (payload.organisationId && payload.formId) {
        queryClient.invalidateQueries({
          queryKey: formSubmissionQueryKeys.byOrganisationIdAndFormId(
            payload.organisationId,
            payload.formId
          ),
        })
      }

      queryClient.invalidateQueries({ queryKey: formSubmissionQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to update form.')
    },
  })
}

export const useDeleteFormSubmission = () => {
  const { remove } = useFormSubmissionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => remove(id),
    onSuccess: () => {
      toast.success('Form Submission deleted successfully!')

      queryClient.invalidateQueries({
        queryKey: ['formSubmissionsOrgId'],
        exact: false,
      })
    },
    onError: () => {
      toast.error('Failed to delete formSubmission.')
    },
  })
}
