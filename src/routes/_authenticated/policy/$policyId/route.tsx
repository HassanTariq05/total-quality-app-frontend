import { createFileRoute } from '@tanstack/react-router'
import { PolicyVersionsView } from '@/features/policy'

export const Route = createFileRoute('/_authenticated/policy/$policyId')({
  component: PolicyVersionsView,
})
