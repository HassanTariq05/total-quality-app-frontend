import { useApiClient } from '@/lib/axios'

export interface ChecklistFormat {
  id: string
  format: string
  checklistId: string
}

export type CreateChecklistFormatPayload = Omit<ChecklistFormat, 'id'>
export type UpdateChecklistFormatPayload = Partial<CreateChecklistFormatPayload>

export const useChecklistFormatService = () => {
  const apiClient = useApiClient()

  const getAll = async (chapterId: string): Promise<ChecklistFormat[]> => {
    const { data } = await apiClient.get(
      `/checklistFormats/getAllByChapterId/${chapterId}`
    )
    return data
  }

  const getByChecklistId = async (
    checklistId: string
  ): Promise<ChecklistFormat> => {
    const { data } = await apiClient.get(
      `/checklistFormats/getChecklistFormatByChecklistId/${checklistId}`
    )
    return data
  }

  const getById = async (id: string): Promise<ChecklistFormat> => {
    const { data } = await apiClient.get(`/checklistFormats/${id}`)
    return data
  }

  const create = async (
    payload: CreateChecklistFormatPayload
  ): Promise<ChecklistFormat> => {
    const { data } = await apiClient.post('/checklistFormats', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateChecklistFormatPayload
  ): Promise<ChecklistFormat> => {
    const { data } = await apiClient.put(`/checklistFormats/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/checklistFormats/${id}`)
  }

  return { getAll, getByChecklistId, getById, create, update, remove }
}
