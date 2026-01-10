import { useApiClient } from '@/lib/axios'

export interface ChecklistSubmission {
  id: string
  data: string
  checklistId: string
  name: string
  description: string
}

export type CreateChecklistSubmissionPayload = {
  checklistId: string
  organisationId: string
  name: string
  description: string
}
export type UpdateChecklistSubmissionPayload = {
  checklistId: string
  organisationId: string
  name: string
  description: string
  data: string
}

export const useChecklistSubmissionService = () => {
  const apiClient = useApiClient()

  const getAll = async (): Promise<ChecklistSubmission[]> => {
    const { data } = await apiClient.get('/checklistSubmissions')
    return data
  }

  const getById = async (
    submissionId: string
  ): Promise<ChecklistSubmission> => {
    const { data } = await apiClient.get(
      `/checklistSubmissions/getBySubmissionId/${submissionId}`
    )
    return data
  }

  const getByOrganisationIdAndChecklistId = async (
    organisationId: string,
    checklistId: string,
    keyword: string
  ): Promise<ChecklistSubmission> => {
    const { data } = await apiClient.get(
      `/checklistSubmissions/organisationId/${organisationId}/checklistId/${checklistId}`,
      {
        params: {
          keyword: keyword.trim() || undefined,
        },
      }
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
