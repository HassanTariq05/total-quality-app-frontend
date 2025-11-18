import { createFileRoute } from '@tanstack/react-router'
import { ChecklistEditorView } from '@/features/checklist/checklist-editor'

export const Route = createFileRoute(
  '/_authenticated/checklist-editor/$checklistId'
)({
  component: ChecklistEditorView,
})
