import { useAuthApiClient } from '@/lib/axios'
import { Organization } from '../organization-services/types'
import { Role } from './types'

export interface User {
  id: string
  name: string
  email?: string
  phoneNumber?: string
  role?: Role
  roleId?: string
  status?: string
  organization?: Organization
  organizationId?: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
}

export type UpdateUserPayload = {
  name: string
  email?: string
  phoneNumber?: string
  role?: Role
  roleId?: string
  organization?: Organization
  organizationId?: string
  status: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
}

export type CreateUserPayload = Omit<User, 'id'>

export const useUserService = () => {
  const apiClient = useAuthApiClient()

  const getAll = async (): Promise<User[]> => {
    const { data } = await apiClient.get(`/users`)
    return data?.users
  }

  const getByOrgId = async (orgId: string): Promise<User[]> => {
    const { data } = await apiClient.get(`/users/org/${orgId}`)
    return data?.users || []
  }

  const create = async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await apiClient.post('/register', payload)
    return data
  }

  const update = async (
    id: string,
    payload: UpdateUserPayload
  ): Promise<any> => {
    const { data } = await apiClient.put(`/users/${id}`, payload)
    return data
  }

  return { getAll, getByOrgId, create, update }
}
