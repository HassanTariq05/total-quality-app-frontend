import { useApiClient } from '@/lib/axios'

export interface FormSubmission {
  id: string
  data: string
  //   description?: string
  //   status: 'Active' | 'Inactive'
}

export type CreateFormSubmissionPayload = {
  formId: string
  organisationId: string
  data: string
}
export type UpdateFormSubmissionPayload = Partial<CreateFormSubmissionPayload>

export const useFormSubmissionService = () => {
  const apiClient = useApiClient()

  const getAll = async (): Promise<FormSubmission[]> => {
    const { data } = await apiClient.get('/formSubmissions')
    return data
  }

  const getById = async (id: string): Promise<FormSubmission> => {
    const { data } = await apiClient.get(`/formSubmissions/${id}`)
    return data
  }

  const getByOrganisationIdAndFormId = async (
    organisationId: string,
    formId: string
  ): Promise<FormSubmission> => {
    const { data } = await apiClient.get(
      `/formSubmissions/organisationId/${organisationId}/formId/${formId}`
    )
    return data
  }

  const create = async (
    payload: CreateFormSubmissionPayload
  ): Promise<FormSubmission> => {
    const { data } = await apiClient.post('/formSubmissions', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateFormSubmissionPayload
  ): Promise<FormSubmission> => {
    const { data } = await apiClient.put(`/formSubmissions/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/formSubmissions/${id}`)
  }

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    getByOrganisationIdAndFormId,
  }
}
