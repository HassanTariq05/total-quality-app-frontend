import { createFileRoute } from '@tanstack/react-router'
import { FormEditorView } from '@/features/form/form-editor'

export const Route = createFileRoute('/_authenticated/form-editor/$formId')({
  component: FormEditorView,
})
