import apiClient from '@/lib/axios'

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

export const ChecklistService = {
  getAll: async (id: string): Promise<Checklist[]> => {
    const { data } = await apiClient.get(`/checklists/getAllByChapterId/${id}`)
    return data
  },

  getFormFormatByFormId: async (id: string): Promise<ChecklistFormat> => {
    const { data } = await apiClient.get(
      `/checklists/getChecklistFormatByChecklistId/${id}`
    )
    return data
  },

  getById: async (id: string): Promise<Checklist> => {
    const { data } = await apiClient.get(`/checklists/${id}`)
    return data
  },

  create: async (payload: CreateChecklistPayload): Promise<Checklist> => {
    const { data } = await apiClient.post('/checklists', payload)
    return data
  },

  update: async (
    id: string,
    payload: UpdateChecklistPayload
  ): Promise<Checklist> => {
    const { data } = await apiClient.put(`/checklists/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/checklists/${id}`)
  },
}
