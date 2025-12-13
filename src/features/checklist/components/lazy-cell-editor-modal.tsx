import React, { lazy, Suspense } from 'react'
import { CellEditorModalProps } from './table-cell-editor-modal'

const CellEditorModalContent = lazy(() => import('./table-cell-editor-modal'))

const ModalSkeleton = () => (
  <div className='animate-pulse space-y-4 p-6'>
    <div className='bg-muted h-8 w-48 rounded' />
    <div className='space-y-3'>
      {[...Array(6)].map((_, i) => (
        <div key={i} className='bg-muted h-10 rounded' />
      ))}
    </div>
    <div className='flex justify-end gap-3 pt-4'>
      <div className='bg-muted h-10 w-24 rounded' />
      <div className='bg-primary h-10 w-24 rounded opacity-70' />
    </div>
  </div>
)

export const LazyCellEditorModal: React.FC<CellEditorModalProps> = (props) => {
  return (
    <Suspense fallback={<ModalSkeleton />}>
      <CellEditorModalContent {...props} />
    </Suspense>
  )
}
