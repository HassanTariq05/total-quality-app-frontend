import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'

type ManageRolesDialogType = 'invite' | 'add' | 'edit' | 'delete'

type ManageRolesContextType = {
  open: ManageRolesDialogType | null
  setOpen: (str: ManageRolesDialogType | null) => void
}

const ManageRolesContext = React.createContext<ManageRolesContextType | null>(
  null
)

export function ManageRolesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<ManageRolesDialogType>(null)

  return (
    <ManageRolesContext value={{ open, setOpen }}>
      {children}
    </ManageRolesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useManageRoles = () => {
  const ranageRolesContext = React.useContext(ManageRolesContext)

  if (!ranageRolesContext) {
    throw new Error('useManageRoles has to be used within <ManageRolesContext>')
  }

  return ranageRolesContext
}
