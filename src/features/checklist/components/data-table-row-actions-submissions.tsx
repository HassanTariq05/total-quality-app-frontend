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
import { FormSubmissionsSchema } from '../data/schema'
import { useSubmissions } from './submissions-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const form = FormSubmissionsSchema.parse(row.original)

  const { setOpen, setCurrentRow } = useSubmissions()

  const navigate = useNavigate()

  const handleViewForm = (id: string) => {
    navigate({ to: `/checklist-submission/${id}` })
  }

  const canEditChecklistSubmission = useHasPermission(
    PERMISSIONS.EDIT_CHECKLIST_SUBMISSION
  )
  const canDeleteChecklistSubmission = useHasPermission(
    PERMISSIONS.DELETE_CHECKLIST_SUBMISSION
  )

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
        <DropdownMenuItem
          onClick={() => {
            handleViewForm(form?.id)
          }}
        >
          View
          <DropdownMenuShortcut>
            <Eye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {canEditChecklistSubmission && (
          <>
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(form)
                setOpen('update-form')
              }}
            >
              Edit
              <DropdownMenuShortcut>
                <Pencil size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {canDeleteChecklistSubmission && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(form)
              setOpen('delete-form')
            }}
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
