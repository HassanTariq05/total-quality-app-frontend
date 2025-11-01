import apiClient from '@/lib/axios'

export interface ChecklistFormat {
  id: string
  format: string
  checklistId: string
}

export type CreateChecklistFormatPayload = Omit<ChecklistFormat, 'id'>
export type UpdateChecklistFormatPayload = Partial<CreateChecklistFormatPayload>

export const ChecklistFormatService = {
  getAll: async (id: string): Promise<ChecklistFormat[]> => {
    const { data } = await apiClient.get(
      `/checklistFormats/getAllByChapterId/${id}`
    )
    return data
  },

  getChecklistFormatChecklistId: async (
    id: string
  ): Promise<ChecklistFormat> => {
    const { data } = await apiClient.get(
      `/checklistFormats/getChecklistFormatByChecklistId/${id}`
    )
    return data
  },

  getById: async (id: string): Promise<ChecklistFormat> => {
    const { data } = await apiClient.get(
      `/checklistFormats/getChecklistFormatByChecklistId/${id}`
    )
    return data
  },

  create: async (
    payload: CreateChecklistFormatPayload
  ): Promise<ChecklistFormat> => {
    const { data } = await apiClient.post('/checklistFormats', payload)
    return data
  },

  update: async (
    id: string,
    payload: UpdateChecklistFormatPayload
  ): Promise<ChecklistFormat> => {
    const { data } = await apiClient.put(`/checklistFormats/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/checklistFormats/${id}`)
  },
}
