import { useApiClient } from '@/lib/axios'

export interface FormFormat {
  id: string
  format: string
  formId: string
}

export type CreateFormFormatPayload = Omit<FormFormat, 'id'>
export type UpdateFormFormatPayload = Partial<CreateFormFormatPayload>

export const useFormFormatService = () => {
  const apiClient = useApiClient()

  const getAll = async (chapterId: string): Promise<FormFormat[]> => {
    const { data } = await apiClient.get(
      `/formFormats/getAllByChapterId/${chapterId}`
    )
    return data
  }

  const getByFormId = async (formId: string): Promise<FormFormat> => {
    const { data } = await apiClient.get(
      `/formFormats/getFormFormatByFormId/${formId}`
    )
    return data
  }

  const getById = async (id: string): Promise<FormFormat> => {
    const { data } = await apiClient.get(`/formFormats/${id}`)
    return data
  }

  const create = async (
    payload: CreateFormFormatPayload
  ): Promise<FormFormat> => {
    const { data } = await apiClient.post('/formFormats', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateFormFormatPayload
  ): Promise<FormFormat> => {
    const { data } = await apiClient.put(`/formFormats/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/formFormats/${id}`)
  }

  return { getAll, getByFormId, getById, create, update, remove }
}
