import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTasks } from './tasks-provider'

export function TasksPrimaryButtons() {
  const { setOpen } = useTasks()

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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='h-9 space-x-1'>
            <MixerHorizontalIcon className='size-4' />
            Accreditation
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[150px]'>
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Button */}
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Department</span> <Plus size={18} />
      </Button>
    </div>
  )
}
