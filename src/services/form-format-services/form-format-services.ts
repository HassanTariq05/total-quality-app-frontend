import { useApiClient } from '@/lib/axios'
import { Accreditation } from '../accreditation-services/accreditation-services'

export interface FormFormat {
  id: string
  format: string
  formId: string
  number: number
  form: Form
}

export interface FormFormat1 {
  id: string
  format: string
  formId: string
}

interface Form {
  id: string
  number: string
  status: string
  title: string
  description: string
  chapter: Chapter
}

interface Chapter {
  accreditation: Accreditation
  description: string
  id: string
  status: string
  title: string
}

export type CreateFormFormatPayload = Omit<FormFormat1, 'id'>
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
