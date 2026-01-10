import { useApiClient } from '@/lib/axios'

export interface Organization {
  id: string
  name: string
  email: string
  phoneNumber: string
  description?: string
  status: 'active' | 'inactive'
  createdAt?: Date
  updatedAt?: Date
  accreditations?: string[] | undefined
  accreditationIds?: string[] | undefined
}

export type CreateOrganizationPayload = Omit<Organization, 'id'>
export type UpdateOrganizationPayload = Partial<CreateOrganizationPayload>

export const useOrganizationService = () => {
  const apiClient = useApiClient()

  const getAll = async (): Promise<Organization[]> => {
    const { data } = await apiClient.get(`/organizations`)
    return data
  }

  const getById = async (id: string): Promise<Organization> => {
    const { data } = await apiClient.get(`/organizations/${id}`)
    return data
  }

  const create = async (
    payload: CreateOrganizationPayload
  ): Promise<Organization> => {
    const { data } = await apiClient.post('/organizations', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateOrganizationPayload
  ): Promise<Organization> => {
    const { data } = await apiClient.put(`/organizations/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/organizations/${id}`)
  }

  return { getAll, getById, create, update, remove }
}
