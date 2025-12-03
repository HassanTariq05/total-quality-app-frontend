import { MoreVertical, Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderDropdownProps {
  fieldId: string | number
  onOpenSettings?: () => void
  onOpenDelete: (id: string | number) => void
}

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  fieldId,
  onOpenSettings,
  onOpenDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <MoreVertical className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={onOpenSettings}>
          <Settings className='mr-2 h-4 w-4' />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className='text-destructive focus:bg-destructive/10 focus:text-destructive'
          onClick={() => onOpenDelete(fieldId)}
        >
          <Trash2 className='text-destructive mr-2 h-4 w-4' />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
