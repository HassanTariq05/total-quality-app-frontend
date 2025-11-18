import { createFileRoute } from '@tanstack/react-router'
import { FormSubmissionView } from '@/features/form/form-submission'

export const Route = createFileRoute(
  '/_authenticated/form-submission/$formSubmissionId'
)({
  component: FormSubmissionView,
})
