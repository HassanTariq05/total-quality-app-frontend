import { Chapter } from '@/services/chapter-services/types'
import { useDeleteChecklist } from '@/hooks/use-checklists'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useChapters } from './chapters-provider'
import { ChecklistsMutateDrawer } from './checklists-mutate-drawer'

type ChecklistsDialogsProps = {
  chapter?: Chapter
}

export function ChecklistsDialogs({ chapter }: ChecklistsDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useChapters()

  const deleteChecklist = useDeleteChecklist()

  const handleDeleteChecklist = (id: string) => {
    deleteChecklist.mutate(id)
  }

  return (
    <>
      <ChecklistsMutateDrawer
        key='create-checklist'
        open={open === 'create-checklist'}
        onOpenChange={() => setOpen('create-checklist')}
        chapterId={chapter?.id}
      />

      {currentRow && (
        <>
          <ChecklistsMutateDrawer
            key={`checklist-update-${currentRow.id}`}
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
            key='checklist-delete'
            destructive
            open={open === 'delete-checklist'}
            onOpenChange={() => {
              setOpen('delete-checklist')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              handleDeleteChecklist(currentRow?.id)
            }}
            className='max-w-md'
            title={`Delete this Checklist: ${currentRow.title} ?`}
            desc={
              <>
                You are about to delete a checklist{' '}
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
