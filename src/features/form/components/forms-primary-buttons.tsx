import { useNavigate } from '@tanstack/react-router'
import { Eye, Plus } from 'lucide-react'
import { useHasPermission } from '@/utils/permissions'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/features/manage-role/types/permissions'
import { useSubmissions } from './submissions-provider'

type Props = {
  formId: string
}

export function SubmissionsPrimaryButtons({ formId }: Props) {
  const navigate = useNavigate()
  const { setOpen } = useSubmissions()

  const handleViewEditor = () => {
    navigate({ to: `/form-editor/${formId}` })
  }

  const canEditForm = useHasPermission(PERMISSIONS.EDIT_FORM)

  const canCreateFormSubmissions = useHasPermission(
    PERMISSIONS.CREATE_FORM_SUBMISSION
  )

  return (
    <div className='flex gap-2'>
      {canEditForm && (
        <Button
          variant={'outline'}
          className='space-x-1'
          onClick={handleViewEditor}
        >
          <span>View Editor</span> <Eye size={18} />
        </Button>
      )}

      {canCreateFormSubmissions && (
        <Button className='space-x-1' onClick={() => setOpen('create')}>
          <span>Create Submission</span> <Plus size={18} />
        </Button>
      )}
    </div>
  )
}
