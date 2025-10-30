import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChapters } from './chapters-provider'

export function FormsPrimaryButtons({ selectedTab }: { selectedTab: string }) {
  const { setOpen } = useChapters()

  return (
    <div className='flex gap-2'>
      {selectedTab === 'forms' && (
        <Button className='space-x-1' onClick={() => setOpen('create')}>
          <span>Create Form</span> <Plus size={18} />
        </Button>
      )}
      {selectedTab === 'checklists' && (
        <Button
          className='space-x-1'
          onClick={() => setOpen('create-checklist')}
        >
          <span>Create Checklist</span> <Plus size={18} />
        </Button>
      )}
    </div>
  )
}
