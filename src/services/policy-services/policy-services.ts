// services/policy-services/usePolicyService.ts
import { useApiClient } from '@/lib/axios'

export interface Policy {
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
  document: any
  documentName: string
}

export interface PolicyPaginatedResponse {
  content: Policy[]
  totalPages: number
  size: number
  number: number
  totalElements: number
}

export interface PolicyFormat {
  id: string
  format: string
}

export type CreatePolicyPayload = FormData
export type UpdatePolicyPayload = Partial<CreatePolicyPayload>

export const usePolicyService = () => {
  const apiClient = useApiClient()

  const getAll = async (
    chapterId: string,
    page = 0,
    size = 10
  ): Promise<PolicyPaginatedResponse> => {
    const { data } = await apiClient.get(
      `/policies/getAllByChapterId/${chapterId}`,
      {
        params: {
          page,
          size,
        },
      }
    )
    return data
  }

  const getById = async (id: string): Promise<Policy> => {
    const { data } = await apiClient.get(`/policies/${id}`)
    return data
  }

  const getPolicyFormatByFormId = async (
    policyId: string
  ): Promise<PolicyFormat> => {
    const { data } = await apiClient.get(
      `/policies/getPolicyFormatByPolicyId/${policyId}`
    )
    return data
  }

  const create = async (
    payload: FormData | CreatePolicyPayload
  ): Promise<Policy> => {
    const headers =
      payload instanceof FormData ? {} : { 'Content-Type': 'application/json' }
    const { data } = await apiClient.post('/policies', payload, { headers })
    return data
  }

  const update = async (
    id: string,
    payload: FormData | UpdatePolicyPayload
  ): Promise<Policy> => {
    const { data } = await apiClient.put(`/policies/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  }

  const remove = async (id: string): Promise<void> => {
    await apiClient.delete(`/policies/${id}`)
  }

  return { getAll, getById, getPolicyFormatByFormId, create, update, remove }
}
