import { useApiClient } from '@/lib/axios'
import { Policy } from '../policy-services/policy-services'

export interface PolicyVersionDto {
  id: string
  number: number
  title: string
  description?: string | null
  status:
    | 'DRAFT'
    | 'SENT_FOR_APPROVAL'
    | 'REJECTED'
    | 'SENT_FOR_REVISION'
    | 'APPROVED'
    | 'ARCHIVED'
  policyId: string
  documentName: string | null
  document: any
  createdAt?: string
  updatedAt?: string
  policy: Policy
}

export type CreatePolicyVersionPayload = FormData
export type UpdatePolicyVersionPayload = FormData

export const usePolicyVersionService = () => {
  const apiClient = useApiClient()

  const getAllByPolicyId = async (
    policyId: string
  ): Promise<PolicyVersionDto[]> => {
    const { data } = await apiClient.get(`/policyVersions?policyId=${policyId}`)
    return data
  }

  const getLatest = async (
    policyId: string
  ): Promise<PolicyVersionDto | null> => {
    try {
      const { data } = await apiClient.get(
        `/policyVersions/latest?policyId=${policyId}`
      )
      return data
    } catch (err: any) {
      if (err.response?.status === 404) return null
      throw err
    }
  }

  const getByNumber = async (
    policyId: string,
    versionNumber: number
  ): Promise<PolicyVersionDto | null> => {
    try {
      const { data } = await apiClient.get(
        `/policyVersions/${versionNumber}?policyId=${policyId}`
      )
      return data
    } catch (err: any) {
      if (err.response?.status === 404) return null
      throw err
    }
  }

  const getByVersionId = async (
    policyVersionId: string
  ): Promise<PolicyVersionDto | null> => {
    try {
      const { data } = await apiClient.get(`/policyVersions/${policyVersionId}`)
      return data
    } catch (err: any) {
      if (err.response?.status === 404) return null
      throw err
    }
  }

  const create = async (
    policyId: string,
    payload: CreatePolicyVersionPayload
  ): Promise<PolicyVersionDto> => {
    const { data } = await apiClient.post(
      `/policyVersions?policyId=${policyId}`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return data
  }

  const cloneLatestVersion = async (
    policyId: string
  ): Promise<PolicyVersionDto> => {
    const { data } = await apiClient.post(
      `/policyVersions/cloneLastest?policyId=${policyId}`
    )
    return data
  }

  const update = async (
    versionId: string,
    payload: UpdatePolicyVersionPayload
  ): Promise<PolicyVersionDto> => {
    const { data } = await apiClient.put(
      `/policyVersions/${versionId}`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return data
  }

  const downloadDocument = async (versionId: string): Promise<Blob> => {
    const { data } = await apiClient.get(
      `/policyVersions/${versionId}/document`,
      {
        responseType: 'blob',
      }
    )
    return data
  }

  const remove = async (versionId: string): Promise<void> => {
    await apiClient.delete(`/policyVersions/${versionId}`)
  }

  const sendForApproval = async (
    versionId: string
  ): Promise<PolicyVersionDto> => {
    const { data } = await apiClient.post(
      `/policyVersions/${versionId}/send-for-approval`
    )
    return data
  }

  const approve = async (versionId: string): Promise<PolicyVersionDto> => {
    const { data } = await apiClient.post(
      `/policyVersions/${versionId}/approve`
    )
    return data
  }

  const reject = async (versionId: string): Promise<PolicyVersionDto> => {
    const { data } = await apiClient.post(`/policyVersions/${versionId}/reject`)
    return data
  }

  const sendForRevision = async (
    versionId: string
  ): Promise<PolicyVersionDto> => {
    const { data } = await apiClient.post(
      `/policyVersions/${versionId}/send-for-revision`
    )
    return data
  }

  return {
    getAllByPolicyId,
    getLatest,
    getByNumber,
    getByVersionId,
    create,
    cloneLatestVersion,
    update,
    downloadDocument,
    remove,

    sendForApproval,
    approve,
    reject,
    sendForRevision,
  }
}
