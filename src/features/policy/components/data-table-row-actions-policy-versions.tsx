import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { Trash2, Eye } from 'lucide-react'
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
import { PolicyVersionsSchema } from '../data/schema'
import { usePolicyVersions } from './policy-versions-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const form = PolicyVersionsSchema.parse(row.original)

  const { setOpen, setCurrentRow } = usePolicyVersions()

  const navigate = useNavigate()

  const handleViewForm = (id: string) => {
    navigate({ to: `/policy-version/${id}` })
  }

  const canDeletePolicyVersion = useHasPermission(
    PERMISSIONS.DELETE_POLICY_VERSION
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
        {/* <DropdownMenuItem
          onClick={() => {
            setCurrentRow(form)
            setOpen('update')
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <Pencil size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem> */}
        {canDeletePolicyVersion && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(form)
                setOpen('delete')
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
