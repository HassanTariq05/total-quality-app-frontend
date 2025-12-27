import { OrganizationsActionDialog } from './organizations-action-dialog'
import { OrganizationsDeleteDialog } from './organizations-delete-dialog'
import { useOrganizations } from './organizations-provider'

export function OrganizationsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useOrganizations()
  return (
    <>
      <OrganizationsActionDialog
        key='organization-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <OrganizationsActionDialog
            key={`organization-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <OrganizationsDeleteDialog
            key={`organization-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
