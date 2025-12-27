import { useNavigate } from '@tanstack/react-router'
import { Eye, Plus } from 'lucide-react'
import { useHasPermission } from '@/utils/permissions'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/features/manage-role/types/permissions'
import { useSubmissions } from './submissions-provider'

type Props = {
  checklistId: string
}

export function SubmissionsPrimaryButtons({ checklistId }: Props) {
  const navigate = useNavigate()
  const { setOpen } = useSubmissions()

  const handleViewEditor = () => {
    navigate({ to: `/checklist-editor/${checklistId}` })
  }

  const canEditChecklistSubmission = useHasPermission(
    PERMISSIONS.EDIT_CHECKLIST_SUBMISSION
  )
  const canCreateChecklistEditor = useHasPermission(
    PERMISSIONS.CREATE_CHECKLIST_SUBMISSION
  )

  return (
    <div className='flex gap-2'>
      {canEditChecklistSubmission && (
        <Button
          variant={'outline'}
          className='space-x-1'
          onClick={handleViewEditor}
        >
          <span>View Editor</span> <Eye size={18} />
        </Button>
      )}

      {canCreateChecklistEditor && (
        <Button className='space-x-1' onClick={() => setOpen('create')}>
          <span>Create Submission</span> <Plus size={18} />
        </Button>
      )}
    </div>
  )
}
