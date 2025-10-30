import { useNavigate } from '@tanstack/react-router'
import { Accreditation } from '@/services/accreditation-services/types'
import { useDeleteAccreditation } from '@/hooks/use-accreditations'
import { useDeleteChapter } from '@/hooks/use-chapters'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DeleteDialog } from './delete-dialog'
import { EditAccreditationDialog } from './edit-accreditation-dialog'
import { TasksMutateDrawer } from './tasks-mutate-drawer'
import { useTasks } from './tasks-provider'

type TasksDialogsProps = {
  accreditation?: Accreditation
}

export function TasksDialogs({ accreditation }: TasksDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()

  const deleteAccreditation = useDeleteAccreditation()
  const deleteChapter = useDeleteChapter()

  const navigate = useNavigate()

  const handleDeleteAccreditation = () => {
    if (!accreditation?.id) return
    deleteAccreditation.mutate(accreditation.id)
    navigate({ to: '/' })
  }

  const handleDeleteChapter = (id: string) => {
    deleteChapter.mutate(id)
  }

  return (
    <>
      <TasksMutateDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        accreditationId={accreditation?.id}
      />

      <EditAccreditationDialog
        key='edit-accreditation'
        open={open === 'edit'}
        onOpenChange={() => setOpen('edit')}
        accreditation={accreditation}
      />

      <DeleteDialog
        key='delete-accreditation'
        open={open === 'delete'}
        onOpenChange={() => setOpen('delete')}
        title='Confirm'
        description='Are you sure to delete this accreditation?'
        onConfirm={handleDeleteAccreditation}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            accreditationId={accreditation?.id}
          />

          <ConfirmDialog
            key='chapter-delete'
            destructive
            open={open === 'delete-chapter'}
            onOpenChange={() => {
              setOpen('delete-chapter')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              handleDeleteChapter(currentRow?.id)
            }}
            className='max-w-md'
            title={`Delete this Chapter: ${currentRow.title} ?`}
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
