import apiClient from '@/lib/axios'

export interface Accreditation {
  id: string
  name: string
  description?: string
  status: 'Active' | 'Inactive'
}

export type CreateAccreditationPayload = Omit<Accreditation, 'id'>
export type UpdateAccreditationPayload = Partial<CreateAccreditationPayload>

export const AccreditationService = {
  getAll: async (): Promise<Accreditation[]> => {
    const { data } = await apiClient.get('/accreditations')
    return data
  },

  getById: async (id: string): Promise<Accreditation> => {
    const { data } = await apiClient.get(`/accreditations/${id}`)
    return data
  },

  create: async (
    payload: CreateAccreditationPayload
  ): Promise<Accreditation> => {
    const { data } = await apiClient.post('/accreditations', payload)
    return data
  },

  update: async (
    id: string,
    payload: UpdateAccreditationPayload
  ): Promise<Accreditation> => {
    const { data } = await apiClient.put(`/accreditations/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/accreditations/${id}`)
  },
}
