import { createFileRoute } from '@tanstack/react-router'
import { PolicyView } from '@/features/policy'

export const Route = createFileRoute('/_authenticated/policy/$policyId')({
  component: PolicyView,
})
