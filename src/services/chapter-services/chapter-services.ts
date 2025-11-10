import { useApiClient } from '@/lib/axios'

export interface Chapter {
  id: string
  title: string
  description?: string
  status: 'Active' | 'Inactive'
  accreditationId: string
  accreditation: {
    id: string
    name: string
  }
}

export type CreateChapterPayload = Omit<Chapter, 'id' | 'accreditation'>
export type UpdateChapterPayload = Partial<CreateChapterPayload>

export const useChapterService = () => {
  const apiClient = useApiClient()

  const getAll = async (id: string): Promise<Chapter[]> => {
    const { data } = await apiClient.get(
      `/chapters/getAllByAccreditationId/${id}`
    )
    return data
  }

  const getById = async (id: string): Promise<Chapter> => {
    const { data } = await apiClient.get(`/chapters/${id}`)
    return data
  }

  const create = async (payload: CreateChapterPayload): Promise<Chapter> => {
    const { data } = await apiClient.post('/chapters', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateChapterPayload
  ): Promise<Chapter> => {
    const { data } = await apiClient.put(`/chapters/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/chapters/${id}`)
  }

  return { getAll, getById, create, update, remove }
}
