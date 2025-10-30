import { createFileRoute } from '@tanstack/react-router'
import { FormView } from '@/features/form'

export const Route = createFileRoute('/_authenticated/form/$formId')({
  component: FormView,
})
