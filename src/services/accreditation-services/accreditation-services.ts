import { useApiClient } from '@/lib/axios'

export interface Accreditation {
  id: string
  name: string
  description?: string
  status: 'Active' | 'Inactive'
}

export type CreateAccreditationPayload = Omit<Accreditation, 'id'>
export type UpdateAccreditationPayload = Partial<CreateAccreditationPayload>

export const useAccreditationService = () => {
  const apiClient = useApiClient()

  const getAccreditations = async (
    isSuperAdmin: boolean,
    orgId?: string
  ): Promise<Accreditation[]> => {
    if (isSuperAdmin) {
      const { data } = await apiClient.get('/accreditations')
      return data
    }

    // Non-super admin → get accreditations for specific organization
    if (!orgId) {
      throw new Error('Organization ID is required for non-super admin users')
    }

    const { data } = await apiClient.get(
      `/organizations/${orgId}/accreditations`
    )
    return data
  }

  const getAll = async (): Promise<Accreditation[]> => {
    const { data } = await apiClient.get('/accreditations')
    return data
  }

  const getById = async (id: string): Promise<Accreditation> => {
    const { data } = await apiClient.get(`/accreditations/${id}`)
    return data
  }

  const create = async (
    payload: CreateAccreditationPayload
  ): Promise<Accreditation> => {
    const { data } = await apiClient.post('/accreditations', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateAccreditationPayload
  ): Promise<Accreditation> => {
    const { data } = await apiClient.put(`/accreditations/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/accreditations/${id}`)
  }

  return { getAll, getAccreditations, getById, create, update, remove }
}
