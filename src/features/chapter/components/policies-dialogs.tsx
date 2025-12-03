import { Chapter } from '@/services/chapter-services/types'
import { useDeletePolicy } from '@/hooks/use-policies'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useChapters } from './chapters-provider'
import { PoliciesMutateDrawer } from './policies-mutate-drawer'

type PoliciesDialogsProps = {
  chapter?: Chapter
}

export function PoliciesDialogs({ chapter }: PoliciesDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useChapters()

  const deletePolicy = useDeletePolicy()

  const handleDeletePolicy = (id: string) => {
    deletePolicy.mutate(id)
  }

  return (
    <>
      <PoliciesMutateDrawer
        key='create-policy'
        open={open === 'create-policy'}
        onOpenChange={() => setOpen('create-policy')}
        chapterId={chapter?.id}
      />

      {currentRow && (
        <>
          <PoliciesMutateDrawer
            key={`policy-update-${currentRow.id}`}
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
            key='policy-delete'
            destructive
            open={open === 'delete-policy'}
            onOpenChange={() => {
              setOpen('delete-policy')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              handleDeletePolicy(currentRow?.id)
            }}
            className='max-w-md'
            title={`Delete this Policy: ${currentRow.title} ?`}
            desc={
              <>
                You are about to delete a policy{' '}
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
