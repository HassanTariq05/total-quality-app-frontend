import { useAuthStore } from '@/stores/auth-store'
import { PermissionValue } from '@/features/manage-role/types/permissions'

export const hasPermission = (
  user: { id?: string; name?: string; permissions?: string[] } | null,
  permission: PermissionValue
): boolean => {
  if (!user || !user.permissions) {
    console.log(
      `[Permission Check] User: ${user?.name ?? 'Unknown'} has no permissions`
    )
    return false
  }

  const hasPerm = user.permissions.includes(permission)

  console.log(
    `[Permission Check] User: ${user.name} | Permission: ${permission} | Granted: ${hasPerm}`,
    'User Permissions:',
    user.permissions
  )

  return hasPerm
}

export const useHasPermission = (permission: PermissionValue): boolean => {
  const user = useAuthStore((state) => state.auth.user)
  return hasPermission(user as any, permission)
}
