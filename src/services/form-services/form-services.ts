import { Page } from '@/types/generic/types'
import { useApiClient } from '@/lib/axios'

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

export const useFormService = () => {
  const apiClient = useApiClient()

  const getAll = async (
    chapterId: string,
    page = 0,
    size = 10
  ): Promise<Page<Form>> => {
    const { data } = await apiClient.get(
      `/forms/getAllByChapterId/${chapterId}`,
      {
        params: {
          page,
          size,
        },
      }
    )
    return data
  }

  const getById = async (id: string): Promise<Form> => {
    const { data } = await apiClient.get(`/forms/${id}`)
    return data
  }

  const getFormFormatByFormId = async (formId: string): Promise<FormFormat> => {
    const { data } = await apiClient.get(
      `/forms/getFormFormatByFormId/${formId}`
    )
    return data
  }

  const create = async (payload: CreateFormPayload): Promise<Form> => {
    const { data } = await apiClient.post('/forms', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateFormPayload
  ): Promise<Form> => {
    const { data } = await apiClient.put(`/forms/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/forms/${id}`)
  }

  return { getAll, getById, getFormFormatByFormId, create, update, remove }
}
