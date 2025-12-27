import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { Trash2, Pencil, Eye } from 'lucide-react'
import { useHasPermission } from '@/utils/permissions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PERMISSIONS } from '@/features/manage-role/types/permissions'
import { chapterSchema } from '../data/schema'
import { useTasks } from './tasks-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = chapterSchema.parse(row.original)
  const { setOpen, setCurrentRow } = useTasks()

  const navigate = useNavigate()

  const handleViewChapter = (id: string) => {
    navigate({ to: `/chapter/${id}` })
  }

  const canViewChapters = useHasPermission(PERMISSIONS.VIEW_CHAPTER)
  const canEditChapter = useHasPermission(PERMISSIONS.EDIT_CHAPTER)
  const canDeleteChapter = useHasPermission(PERMISSIONS.DELETE_CHAPTER)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {canViewChapters && (
          <DropdownMenuItem
            onClick={() => {
              handleViewChapter(task?.id)
            }}
          >
            View
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {canEditChapter && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(task)
              setOpen('update')
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <Pencil size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}

        {canDeleteChapter && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(task)
                setOpen('delete-chapter')
              }}
            >
              Delete
              <DropdownMenuShortcut>
                <Trash2 size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
