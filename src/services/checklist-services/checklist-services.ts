// services/checklist-services/useChecklistService.ts
import { useApiClient } from '@/lib/axios'

export interface Checklist {
  id: string
  title: string
  description?: string
  status: 'Active' | 'Inactive'
  chapterId: string
  chapter: {
    accreditation: {
      id: string
      name: string
    }
    id: string
    title: string
  }
}

export interface ChecklistFormat {
  id: string
  format: string
}

export type CreateChecklistPayload = Omit<
  Checklist,
  'id' | 'chapter' | 'accreditation'
>
export type UpdateChecklistPayload = Partial<CreateChecklistPayload>

export const useChecklistService = () => {
  const apiClient = useApiClient()

  const getAll = async (chapterId: string): Promise<Checklist[]> => {
    const { data } = await apiClient.get(
      `/checklists/getAllByChapterId/${chapterId}`
    )
    return data
  }

  const getById = async (id: string): Promise<Checklist> => {
    const { data } = await apiClient.get(`/checklists/${id}`)
    return data
  }

  const getFormFormatByFormId = async (
    checklistId: string
  ): Promise<ChecklistFormat> => {
    const { data } = await apiClient.get(
      `/checklists/getChecklistFormatByChecklistId/${checklistId}`
    )
    return data
  }

  const create = async (
    payload: CreateChecklistPayload
  ): Promise<Checklist> => {
    const { data } = await apiClient.post('/checklists', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateChecklistPayload
  ): Promise<Checklist> => {
    const { data } = await apiClient.put(`/checklists/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/checklists/${id}`)
  }

  return { getAll, getById, getFormFormatByFormId, create, update, remove }
}
