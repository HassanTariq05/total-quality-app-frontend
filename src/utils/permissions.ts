import { useAuthStore } from '@/stores/auth-store'
import { PermissionValue } from '@/features/manage-role/types/permissions'

export const hasPermission = (
  user: { id?: string; name?: string; permissions?: string[] } | null,
  permission: PermissionValue
): boolean => {
  if (!user || !user.permissions) {
    return false
  }

  const hasPerm = user.permissions.includes(permission)

  return hasPerm
}

export const useHasPermission = (permission: PermissionValue): boolean => {
  const user = useAuthStore((state) => state.auth.user)
  return hasPermission(user as any, permission)
}
