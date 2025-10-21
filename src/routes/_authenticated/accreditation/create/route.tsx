import { createFileRoute } from '@tanstack/react-router'
import { CreateAccreditations } from '@/features/accreditation/create'

export const Route = createFileRoute('/_authenticated/accreditation/create')({
  component: CreateAccreditations,
})
