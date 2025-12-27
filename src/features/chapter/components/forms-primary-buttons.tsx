import { Plus } from 'lucide-react'
import { useHasPermission } from '@/utils/permissions'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/features/manage-role/types/permissions'
import { useChapters } from './chapters-provider'

export function FormsPrimaryButtons({ selectedTab }: { selectedTab: string }) {
  const { setOpen } = useChapters()

  const canCreateForm = useHasPermission(PERMISSIONS.CREATE_FORM)
  const canCreateChecklist = useHasPermission(PERMISSIONS.CREATE_CHECKLIST)
  const canCreatePolicy = useHasPermission(PERMISSIONS.CREATE_POLICY)

  return (
    <div className='flex gap-2'>
      {selectedTab === 'forms' && canCreateForm && (
        <Button className='space-x-1' onClick={() => setOpen('create')}>
          <span>Create Form</span> <Plus size={18} />
        </Button>
      )}
      {selectedTab === 'checklists' && canCreateChecklist && (
        <Button
          className='space-x-1'
          onClick={() => setOpen('create-checklist')}
        >
          <span>Create Checklist</span> <Plus size={18} />
        </Button>
      )}

      {selectedTab === 'policies' && canCreatePolicy && (
        <Button className='space-x-1' onClick={() => setOpen('create-policy')}>
          <span>Initiate Policy</span> <Plus size={18} />
        </Button>
      )}
    </div>
  )
}
