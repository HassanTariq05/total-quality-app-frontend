import apiClient from '@/lib/axios'

export interface Chapter {
  id: string
  name: string
  description?: string
  status: 'Active' | 'Inactive' | 'Pending'
}

export type CreateChapterPayload = Omit<Chapter, 'id'>
export type UpdateChapterPayload = Partial<CreateChapterPayload>

export const ChapterService = {
  getAll: async (): Promise<Chapter[]> => {
    const { data } = await apiClient.get('/chapters')
    return data
  },

  getById: async (id: string): Promise<Chapter> => {
    const { data } = await apiClient.get(`/chapters/${id}`)
    return data
  },

  create: async (payload: CreateChapterPayload): Promise<Chapter> => {
    const { data } = await apiClient.post('/chapters', payload)
    return data
  },

  update: async (
    id: string,
    payload: UpdateChapterPayload
  ): Promise<Chapter> => {
    const { data } = await apiClient.put(`/chapters/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/chapters/${id}`)
  },
}
