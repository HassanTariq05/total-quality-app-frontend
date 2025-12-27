import { createFileRoute } from '@tanstack/react-router'
import { ManageRoles } from '@/features/manage-role'

export const Route = createFileRoute('/_authenticated/manage-role/$roleId')({
  component: ManageRoles,
})
