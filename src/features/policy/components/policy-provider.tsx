import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { SubmissionsSchema } from '../data/policy-schema'

type PoliciesDialogType =
  | 'create'
  | 'update'
  | 'delete'
  | 'import'
  | 'edit'
  | 'delete'
  | 'delete-chapter'

type PoliciesContextType = {
  open: PoliciesDialogType | null
  setOpen: (str: PoliciesDialogType | null) => void
  currentRow: SubmissionsSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<SubmissionsSchema | null>>
}

const PoliciesContext = React.createContext<PoliciesContextType | null>(null)

export function PoliciesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<PoliciesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<SubmissionsSchema | null>(null)

  return (
    <PoliciesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PoliciesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePolicies = () => {
  const policiesContext = React.useContext(PoliciesContext)

  if (!policiesContext) {
    throw new Error('usePolicies has to be used within <PoliciesContext>')
  }

  return policiesContext
}
