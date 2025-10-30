import apiClient from '@/lib/axios'

export interface FormFormat {
  id: string
  format: string
  formId: string
}

export type CreateFormFormatPayload = Omit<FormFormat, 'id'>
export type UpdateFormFormatPayload = Partial<CreateFormFormatPayload>

export const FormFormatService = {
  getAll: async (id: string): Promise<FormFormat[]> => {
    const { data } = await apiClient.get(`/formFormats/getAllByChapterId/${id}`)
    return data
  },

  getFormFormatFormId: async (id: string): Promise<FormFormat> => {
    const { data } = await apiClient.get(
      `/formFormats/getFormFormatByFormId/${id}`
    )
    return data
  },

  getById: async (id: string): Promise<FormFormat> => {
    const { data } = await apiClient.get(
      `/formFormats/getFormFormatByFormId/${id}`
    )
    return data
  },

  create: async (payload: CreateFormFormatPayload): Promise<FormFormat> => {
    const { data } = await apiClient.post('/formFormats', payload)
    return data
  },

  update: async (
    id: string,
    payload: UpdateFormFormatPayload
  ): Promise<FormFormat> => {
    const { data } = await apiClient.put(`/formFormats/${id}`, payload)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/formFormats/${id}`)
  },
}
