import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOrganizations } from './organizations-provider'

export function OrganizationsPrimaryButtons() {
  const { setOpen } = useOrganizations()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Organization</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
