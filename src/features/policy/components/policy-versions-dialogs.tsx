import { useDeletePolicyVersion } from '@/hooks/use-policy-versions'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PolicyVersionsMutateDrawer } from './policy-versions-mutate-drawer'
import { usePolicyVersions } from './policy-versions-provider'

type FormsDialogsProps = {
  policyId?: string
}

export function PolicyVersionsDialogs({ policyId }: FormsDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = usePolicyVersions()

  const deletePolicyVersion = useDeletePolicyVersion()

  const handleDeleteForm = (id: string) => {
    deletePolicyVersion.mutate(id)
  }

  return (
    <>
      <PolicyVersionsMutateDrawer
        key='create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        policyId={policyId}
      />

      {currentRow && (
        <>
          <PolicyVersionsMutateDrawer
            key={`update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            policyId={policyId}
          />

          <ConfirmDialog
            key='delete'
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
              handleDeleteForm(currentRow?.id)
            }}
            className='max-w-md'
            title={`Delete this Version?`}
            desc={
              <>
                You are about to delete a policy version. <br />
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
