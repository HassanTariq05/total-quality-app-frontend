import { createContext, useContext, useState, ReactNode } from 'react'

type UIContextType = {
  isCreatAccreditationModalOpen: boolean
  openAccreditationModal: () => void
  closeAccreditationModal: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isCreatAccreditationModalOpen, setIsAccreditationModalOpen] =
    useState(false)

  const openAccreditationModal = () => setIsAccreditationModalOpen(true)
  const closeAccreditationModal = () => setIsAccreditationModalOpen(false)

  return (
    <UIContext.Provider
      value={{
        isCreatAccreditationModalOpen,
        openAccreditationModal,
        closeAccreditationModal,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (!context) throw new Error('useUI must be used within a UIProvider')
  return context
}
