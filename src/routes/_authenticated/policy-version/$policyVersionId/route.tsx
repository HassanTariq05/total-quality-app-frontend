import { createFileRoute } from '@tanstack/react-router'
import { PolicyVersionViewer } from '@/features/policy-version-viewer'

export const Route = createFileRoute(
  '/_authenticated/policy-version/$policyVersionId'
)({
  component: PolicyVersionViewer,
})
