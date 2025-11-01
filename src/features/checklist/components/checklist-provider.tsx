import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Checklist } from '../data/schema'

type ChecklistsDialogType =
  | 'create'
  | 'update'
  | 'delete'
  | 'import'
  | 'edit'
  | 'delete'
  | 'delete-chapter'

type ChecklistsContextType = {
  open: ChecklistsDialogType | null
  setOpen: (str: ChecklistsDialogType | null) => void
  currentRow: Checklist | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Checklist | null>>
}

const ChecklistsContext = React.createContext<ChecklistsContextType | null>(
  null
)

export function ChecklistsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<ChecklistsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Checklist | null>(null)

  return (
    <ChecklistsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ChecklistsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useChecklists = () => {
  const checklistsContext = React.useContext(ChecklistsContext)

  if (!checklistsContext) {
    throw new Error('useChecklists has to be used within <ChecklistsContext>')
  }

  return checklistsContext
}
