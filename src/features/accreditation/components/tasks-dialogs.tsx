import { useNavigate } from '@tanstack/react-router'
import { Accreditation } from '@/services/accreditation-services/types'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { useDeleteAccreditation } from '@/hooks/use-accreditations'
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

  const navigate = useNavigate()

  const handleDeleteAccreditation = () => {
    if (!accreditation?.id) return
    deleteAccreditation.mutate(accreditation.id)
    navigate({ to: '/' })
  }

  return (
    <>
      <TasksMutateDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
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
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following task has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
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
