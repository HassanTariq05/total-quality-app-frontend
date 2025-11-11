import { useApiClient } from '@/lib/axios'

export interface ChecklistSubmission {
  id: string
  data: string
  //   description?: string
  //   status: 'Active' | 'Inactive'
}

export type CreateChecklistSubmissionPayload = {
  checklistId: string
  organisationId: string
  data: string
}
export type UpdateChecklistSubmissionPayload =
  Partial<CreateChecklistSubmissionPayload>

export const useChecklistSubmissionService = () => {
  const apiClient = useApiClient()

  const getAll = async (): Promise<ChecklistSubmission[]> => {
    const { data } = await apiClient.get('/checklistSubmissions')
    return data
  }

  const getById = async (id: string): Promise<ChecklistSubmission> => {
    const { data } = await apiClient.get(`/checklistSubmissions/${id}`)
    return data
  }

  const getByOrganisationIdAndChecklistId = async (
    organisationId: string,
    checklistId: string
  ): Promise<ChecklistSubmission> => {
    const { data } = await apiClient.get(
      `/checklistSubmissions/organisationId/${organisationId}/checklistId/${checklistId}`
    )
    return data
  }

  const create = async (
    payload: CreateChecklistSubmissionPayload
  ): Promise<ChecklistSubmission> => {
    const { data } = await apiClient.post('/checklistSubmissions', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateChecklistSubmissionPayload
  ): Promise<ChecklistSubmission> => {
    const { data } = await apiClient.put(`/checklistSubmissions/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/checklistSubmissions/${id}`)
  }

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    getByOrganisationIdAndChecklistId,
  }
}
