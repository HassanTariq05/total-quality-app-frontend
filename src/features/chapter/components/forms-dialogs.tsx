import { Chapter } from '@/services/chapter-services/types'
import { useDeleteForm } from '@/hooks/use-forms'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useChapters } from './chapters-provider'
import { FormsMutateDrawer } from './forms-mutate-drawer'

type FormsDialogsProps = {
  chapter?: Chapter
}

export function FormsDialogs({ chapter }: FormsDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useChapters()

  const deleteChapter = useDeleteForm()

  const handleDeleteForm = (id: string) => {
    deleteChapter.mutate(id)
  }

  return (
    <>
      <FormsMutateDrawer
        key='create-form'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        chapterId={chapter?.id}
      />

      {currentRow && (
        <>
          <FormsMutateDrawer
            key={`form-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            chapterId={chapter?.id}
          />

          <ConfirmDialog
            key='form-delete'
            destructive
            open={open === 'delete-form'}
            onOpenChange={() => {
              setOpen('delete-form')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              handleDeleteForm(currentRow?.id)
            }}
            className='max-w-md'
            title={`Delete this Form: ${currentRow.title} ?`}
            desc={
              <>
                You are about to delete a chapter{' '}
                <strong>{currentRow.title}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
