import { useApiClient } from '@/lib/axios'

export interface Role {
  id: string
  name: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
  permissions?: string[]
  organisationId?: string
}

export type UpdateRolePayload = {
  name?: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
  permissions?: string[]
  organisationId?: string
}

export type CreateRolePayload = Omit<Role, 'id'>

export const useRoleService = () => {
  const apiClient = useApiClient()

  const getAll = async (): Promise<Role[]> => {
    const { data } = await apiClient.get(`/roles`)
    return data
  }

  const getById = async (id: string): Promise<Role> => {
    const { data } = await apiClient.get(`/roles/${id}`)
    return data
  }

  const getByOrgId = async (orgId: string): Promise<Role[]> => {
    const { data } = await apiClient.get(`/roles/org/${orgId}`)
    return data
  }

  const create = async (payload: CreateRolePayload): Promise<Role> => {
    const { data } = await apiClient.post('/roles', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateRolePayload
  ): Promise<any> => {
    const { data } = await apiClient.put(`/roles/${id}`, payload)
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`)
  }

  return { getAll, getById, getByOrgId, create, update, remove }
}
