import React, { createContext, useState, type ReactNode } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type VersionsSchema } from '../data/schema'

type PolicyVersionsDialogType = 'create' | 'update' | 'delete' | 'edit' | null

type PolicyVersionsContextType = {
  open: PolicyVersionsDialogType
  setOpen: (type: PolicyVersionsDialogType) => void
  currentRow: VersionsSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<VersionsSchema | null>>
}

const PolicyVersionsContext = createContext<
  PolicyVersionsContextType | undefined
>(undefined)

export function PolicyVersionsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useDialogState<any>(null)
  const [currentRow, setCurrentRow] = useState<VersionsSchema | null>(null)

  const value: PolicyVersionsContextType = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
  }

  return (
    <PolicyVersionsContext.Provider value={value}>
      {children}
    </PolicyVersionsContext.Provider>
  )
}

// Step 2: Custom hook with proper error message
export const usePolicyVersions = (): PolicyVersionsContextType => {
  const context = React.useContext(PolicyVersionsContext)

  if (!context) {
    throw new Error(
      'usePolicyVersions must be used within PolicyVersionsProvider'
    )
  }

  return context
}
