import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Chapter } from '../data/schema'

type ChaptersDialogType =
  | 'create'
  | 'create-checklist'
  | 'update'
  | 'delete'
  | 'import'
  | 'edit'
  | 'delete'
  | 'delete-form'
  | 'delete-checklist'

type ChaptersContextType = {
  open: ChaptersDialogType | null
  setOpen: (str: ChaptersDialogType | null) => void
  currentRow: Chapter | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Chapter | null>>
}

const ChaptersContext = React.createContext<ChaptersContextType | null>(null)

export function ChaptersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ChaptersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Chapter | null>(null)

  return (
    <ChaptersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ChaptersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useChapters = () => {
  const chaptersContext = React.useContext(ChaptersContext)

  if (!chaptersContext) {
    throw new Error('useChapters has to be used within <ChaptersContext>')
  }

  return chaptersContext
}
