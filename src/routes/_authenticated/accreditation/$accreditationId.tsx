import { createFileRoute } from '@tanstack/react-router'
import { AccreditationView } from '@/features/accreditation'

export const Route = createFileRoute(
  '/_authenticated/accreditation/$accreditationId'
)({
  component: AccreditationView,
})
