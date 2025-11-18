import { createFileRoute } from '@tanstack/react-router'
import { ChecklistSubmissionView } from '@/features/checklist/checklist-submission'

export const Route = createFileRoute(
  '/_authenticated/checklist-submission/$checklistSubmissionId'
)({
  component: ChecklistSubmissionView,
})
