import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormSubmissionService } from '@/services/form-submission-services/form-submission-service'
import { toast } from 'sonner'

export const formSubmissionQueryKeys = {
  all: ['formSubmissions'] as const,
  byId: (id: string) => ['formSubmissions', id] as const,
  byOrganisationIdAndFormId: (organisationId: string, formId: string) =>
    [
      'formSubmissionsOrgId',
      organisationId,
      'formSubmissionsFormId',
      formId,
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
  formId: string
) => {
  const { getByOrganisationIdAndFormId } = useFormSubmissionService()

  return useQuery({
    queryKey: formSubmissionQueryKeys.byOrganisationIdAndFormId(
      organisationId,
      formId
    ),
    queryFn: () => getByOrganisationIdAndFormId(organisationId, formId),
    enabled: !!formId || !!organisationId,
  })
}

export const useCreateFormSubmission = () => {
  const { create } = useFormSubmissionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: (_, variables) => {
      toast.success('Form submitted successfully!')

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
    onSuccess: (_, { id }) => {
      toast.success('Form updated successfully!')
      queryClient.invalidateQueries({
        queryKey: formSubmissionQueryKeys.byId(id),
      })
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
    mutationFn: remove,
    onSuccess: () => {
      toast.success('FormSubmission deleted successfully!')
      queryClient.invalidateQueries({ queryKey: formSubmissionQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete formSubmission.')
    },
  })
}
