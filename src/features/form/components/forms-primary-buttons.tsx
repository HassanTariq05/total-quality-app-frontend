import { useNavigate } from '@tanstack/react-router'
import { Eye, Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { useSubmissions } from './submissions-provider'

type Props = {
  formId: string
}

export function SubmissionsPrimaryButtons({ formId }: Props) {
  const navigate = useNavigate()
  const { setOpen } = useSubmissions()
  const { auth } = useAuthStore()

  const handleViewEditor = () => {
    navigate({ to: `/form-editor/${formId}` })
  }

  return (
    <div className='flex gap-2'>
      {auth?.user?.email !== 'demo.user@pilotorg.com' && (
        <Button
          variant={'outline'}
          className='space-x-1'
          onClick={handleViewEditor}
        >
          <span>View Editor</span> <Eye size={18} />
        </Button>
      )}

      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create Submission</span> <Plus size={18} />
      </Button>
    </div>
  )
}
