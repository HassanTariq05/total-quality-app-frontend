import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useRouter } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { Pen, Settings2, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Role } from '../data/schema'
import { useRoles } from './roles-provider'

type DataTableRowActionsProps = {
  row: Row<Role>
}

const RESERVED_ROLE_NAMES = ['Administrator', 'Super Admin'] as const

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useRoles()
  const navigate = useRouter()

  const user = useAuthStore()
  const isSuperAdmin = user?.auth?.user?.role?.name === 'Super Admin'

  const currentRoleName = row.original.name?.trim() as any

  const isReservedRole = RESERVED_ROLE_NAMES.includes(currentRoleName)

  const canEdit = isSuperAdmin || !isReservedRole
  const canDelete = isSuperAdmin || !isReservedRole

  const handleManageRole = (id: string) => {
    navigate.navigate({ to: `/manage-role/${id}` })
  }

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
        <DropdownMenuItem onClick={() => handleManageRole(row.original.id)}>
          Manage
          <DropdownMenuShortcut>
            <Settings2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {canEdit && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('edit')
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <Pen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}

        {canEdit && <DropdownMenuSeparator />}

        {canDelete && (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('delete')
            }}
            className='text-red-600 focus:text-red-600'
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
