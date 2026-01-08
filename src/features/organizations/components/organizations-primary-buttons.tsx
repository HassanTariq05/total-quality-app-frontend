import { UserPlus } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { useOrganizations } from './organizations-provider'

export function OrganizationsPrimaryButtons() {
  const { setOpen } = useOrganizations()

  const user = useAuthStore()

  const isSuperAdmin = user?.auth?.user?.role?.name === 'Super Admin'

  return (
    <div className='flex gap-2'>
      {isSuperAdmin && (
        <Button className='space-x-1' onClick={() => setOpen('add')}>
          <span>Add Organization</span> <UserPlus size={18} />
        </Button>
      )}
    </div>
  )
}
