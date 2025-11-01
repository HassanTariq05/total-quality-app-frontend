import { createFileRoute } from '@tanstack/react-router'
import { ChecklistView } from '@/features/checklist'

export const Route = createFileRoute('/_authenticated/checklist/$checklistId')({
  component: ChecklistView,
})
