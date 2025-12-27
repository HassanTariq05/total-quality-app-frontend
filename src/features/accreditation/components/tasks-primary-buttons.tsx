import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Plus } from 'lucide-react'
import { useHasPermission } from '@/utils/permissions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PERMISSIONS } from '@/features/manage-role/types/permissions'
import { useTasks } from './tasks-provider'

export function TasksPrimaryButtons() {
  const { setOpen } = useTasks()

  const canEditAccreditation = useHasPermission(PERMISSIONS.EDIT_ACCREDITATION)
  const canDeleteAccreditation = useHasPermission(
    PERMISSIONS.DELETE_ACCREDITATION
  )

  const canCreateChapter = useHasPermission(PERMISSIONS.CREATE_CHAPTER)

  const handleEdit = () => {
    setOpen('edit')
  }

  const handleDelete = () => {
    setOpen('delete')
  }

  return (
    <div className='flex gap-2'>
      {/* Other buttons */}
      {/* <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <MixerHorizontalIcon className='size-4' />
      </Button> */}

      {/* Dropdown Menu for View */}
      {(canEditAccreditation || canDeleteAccreditation) && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='h-9 space-x-1'>
              <MixerHorizontalIcon className='size-4' />
              Accreditation
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[150px]'>
            {canEditAccreditation && (
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            )}
            {canDeleteAccreditation && (
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Create Button */}

      {canCreateChapter && (
        <Button className='space-x-1' onClick={() => setOpen('create')}>
          <span>Create Chapter</span> <Plus size={18} />
        </Button>
      )}
    </div>
  )
}
