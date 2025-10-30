import apiClient from '@/lib/axios'

export interface Form {
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

export interface FormFormat {
  id: string
  format: string
}

export type CreateFormPayload = Omit<Form, 'id' | 'chapter' | 'accreditation'>
export type UpdateFormPayload = Partial<CreateFormPayload>

export const FormService = {
  getAll: async (id: string): Promise<Form[]> => {
    const { data } = await apiClient.get(`/forms/getAllByChapterId/${id}`)
    return data
  },

  getFormFormatByFormId: async (id: string): Promise<FormFormat> => {
    const { data } = await apiClient.get(`/forms/getFormFormatByFormId/${id}`)
    return data
  },

  getById: async (id: string): Promise<Form> => {
    const { data } = await apiClient.get(`/forms/${id}`)
    return data
  },

  create: async (payload: CreateFormPayload): Promise<Form> => {
    const { data } = await apiClient.post('/forms', payload)
    return data
  },

  update: async (id: string, payload: UpdateFormPayload): Promise<Form> => {
    const { data } = await apiClient.put(`/forms/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/forms/${id}`)
  },
}
