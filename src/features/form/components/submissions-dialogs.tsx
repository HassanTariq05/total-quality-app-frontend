import { useDeleteFormSubmission } from '@/hooks/use-form-submissions'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { FormsMutateDrawer } from './submissions-mutate-drawer'
import { useSubmissions } from './submissions-provider'

type FormsDialogsProps = {
  formId?: string
}

export function SubmissionsDialogs({ formId }: FormsDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useSubmissions()

  const deleteFormSubmission = useDeleteFormSubmission()

  const handleDeleteForm = (id: string) => {
    deleteFormSubmission.mutate(id)
  }

  return (
    <>
      <FormsMutateDrawer
        key='create-form'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        formId={formId}
      />

      {currentRow && (
        <>
          <FormsMutateDrawer
            key={`form-update-${currentRow.id}`}
            open={open === 'update-form'}
            onOpenChange={() => {
              setOpen('update-form')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            formId={formId}
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
            title={`Delete this Submission: ${currentRow.name} ?`}
            desc={
              <>
                You are about to delete a form submission{' '}
                <strong>{currentRow.name}</strong>. <br />
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
