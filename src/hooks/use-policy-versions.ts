import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { usePolicyVersionService } from '@/services/policy-version-services/policy-version-services'
import { toast } from 'sonner'

export const policyVersionQueryKeys = {
  all: ['policyVersions'] as const,
  byPolicyId: (policyId: string) => ['policyVersions', policyId] as const,
  latest: (policyId: string) => ['policyVersions', policyId, 'latest'] as const,
  byNumber: (policyId: string, versionNumber: number) =>
    ['policyVersions', policyId, versionNumber] as const,
  byPolicyVersionId: (policyVersionId: string) => [
    'policyVersions',
    policyVersionId,
  ],
  details: (versionId: string) => ['policyVersion', versionId] as const,
}

export const usePolicyVersions = (policyId: string | undefined) => {
  const { getAllByPolicyId } = usePolicyVersionService()

  return useQuery({
    queryKey: policyVersionQueryKeys.byPolicyId(policyId ?? ''),
    queryFn: () => getAllByPolicyId(policyId!),
    enabled: !!policyId,
    placeholderData: keepPreviousData,
  })
}

export const useLatestPolicyVersion = (policyId: string | undefined) => {
  const { getLatest } = usePolicyVersionService()

  return useQuery({
    queryKey: policyVersionQueryKeys.latest(policyId ?? ''),
    queryFn: () => getLatest(policyId!),
    enabled: !!policyId,
  })
}

export const usePolicyVersionByNumber = (
  policyId: string | undefined,
  versionNumber: number
) => {
  const { getByNumber } = usePolicyVersionService()

  return useQuery({
    queryKey: policyVersionQueryKeys.byNumber(policyId ?? '', versionNumber),
    queryFn: () => getByNumber(policyId!, versionNumber),
    enabled: !!policyId && versionNumber > 0,
  })
}

export const usePolicyVersionByVersionId = (
  policyVersionId: string | undefined
) => {
  const { getByVersionId } = usePolicyVersionService()

  return useQuery({
    queryKey: policyVersionQueryKeys.byPolicyVersionId(policyVersionId ?? ''),
    queryFn: () => getByVersionId(policyVersionId!),
    enabled: !!policyVersionId,
  })
}

export const useCreatePolicyVersion = () => {
  const { create } = usePolicyVersionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      policyId,
      payload,
    }: {
      policyId: string
      payload: FormData
    }) => create(policyId, payload),
    onSuccess: (newVersion, { policyId }) => {
      toast.success(`Version ${newVersion.number} created successfully!`)
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.byPolicyId(policyId),
      })
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.latest(policyId),
      })
    },
    onError: () => {
      toast.error('Failed to create new version.')
    },
  })
}

export const useCloneLatestPolicyVersion = () => {
  const { cloneLatestVersion } = usePolicyVersionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ policyId }: { policyId: string }) =>
      cloneLatestVersion(policyId),
    onSuccess: ({ policyId }) => {
      toast.success(`Version cloned successfully!`)
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.byPolicyId(policyId),
      })
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.latest(policyId),
      })
    },
    onError: () => {
      toast.error('Failed to clone latest version.')
    },
  })
}

export const useUpdatePolicyVersion = () => {
  const { update } = usePolicyVersionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      versionId,
      payload,
    }: {
      versionId: string
      payload: FormData
    }) => update(versionId, payload),
    onSuccess: (updatedVersion) => {
      toast.success(`Version ${updatedVersion.number} updated successfully!`)
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.byPolicyVersionId(updatedVersion.id),
      })
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.byPolicyId(updatedVersion.policyId),
      })
    },
    onError: () => {
      toast.error('Failed to update version.')
    },
  })
}

export const useDeletePolicyVersion = () => {
  const { remove } = usePolicyVersionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (versionId: string) => remove(versionId),
    onSuccess: (_) => {
      toast.success('Version deleted successfully!')
      queryClient.invalidateQueries({ queryKey: policyVersionQueryKeys.all })
    },
    onError: () => {
      toast.error('Failed to delete version.')
    },
  })
}

export const useSendForApproval = () => {
  const { sendForApproval } = usePolicyVersionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendForApproval,
    onSuccess: (version) => {
      toast.success('Version sent for approval')
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.byPolicyId(version.policyId),
      })
    },
    onError: () => toast.error('Failed to send for approval'),
  })
}

export const useApprovePolicyVersion = () => {
  const { approve } = usePolicyVersionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approve,
    onSuccess: (version) => {
      toast.success(`Version ${version.number} approved and published!`)
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.byPolicyId(version.policyId),
      })
      queryClient.invalidateQueries({
        queryKey: ['policies', version.policyId],
      })
    },
    onError: () => toast.error('Failed to approve version'),
  })
}

export const useRejectPolicyVersion = () => {
  const { reject } = usePolicyVersionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reject,
    onSuccess: (version) => {
      toast.success('Version rejected')
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.byPolicyId(version.policyId),
      })
    },
    onError: () => toast.error('Failed to reject version'),
  })
}

export const useSendForRevision = () => {
  const { sendForRevision } = usePolicyVersionService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendForRevision,
    onSuccess: (version) => {
      toast.success('Version sent back for revision')
      queryClient.invalidateQueries({
        queryKey: policyVersionQueryKeys.byPolicyId(version.policyId),
      })
    },
    onError: () => toast.error('Failed to send for revision'),
  })
}
