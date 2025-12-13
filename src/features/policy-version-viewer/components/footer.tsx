import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type PolicyAction =
  | 'SAVE_DRAFT'
  | 'SEND_FOR_APPROVAL'
  | 'REJECT'
  | 'SEND_FOR_REVISION'
  | 'APPROVE'

type FooterProps = {
  status:
    | 'DRAFT'
    | 'SENT_FOR_APPROVAL'
    | 'REJECTED'
    | 'SENT_FOR_REVISION'
    | 'APPROVED'
    | 'ARCHIVED'

  onAction: (action: PolicyAction) => void
  isLoading: boolean
  activeAction: PolicyAction | null
}

export const Footer: React.FC<FooterProps> = ({
  status,
  onAction,
  isLoading,
  activeAction,
}) => {
  return (
    <footer className='bg-background/25 supports-[backdrop-filter]:bg-background/60 sticky right-0 bottom-0 left-0 z-40 border-t backdrop-blur'>
      {(status === 'DRAFT' || status === 'SENT_FOR_REVISION') && (
        <div className='container flex h-12 max-w-screen-2xl items-center justify-end gap-2 px-4 sm:px-6 lg:px-8'>
          <Button
            disabled={isLoading}
            variant='outline'
            onClick={() => onAction('SAVE_DRAFT')}
          >
            {isLoading && activeAction === 'SAVE_DRAFT' && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save Draft
          </Button>

          <Button
            disabled={isLoading}
            onClick={() => onAction('SEND_FOR_APPROVAL')}
          >
            {isLoading && activeAction === 'SEND_FOR_APPROVAL' && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Send for Approval
          </Button>
        </div>
      )}

      {status === 'SENT_FOR_APPROVAL' && (
        <div className='container flex h-12 max-w-screen-2xl items-center justify-end gap-2 px-4 sm:px-6 lg:px-8'>
          <Button
            disabled={isLoading}
            variant='destructive'
            onClick={() => onAction('REJECT')}
          >
            {isLoading && activeAction === 'REJECT' && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Reject
          </Button>

          <Button
            disabled={isLoading}
            variant='outline'
            onClick={() => onAction('SEND_FOR_REVISION')}
          >
            {isLoading && activeAction === 'SEND_FOR_REVISION' && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Send for Revision
          </Button>

          <Button disabled={isLoading} onClick={() => onAction('APPROVE')}>
            {isLoading && activeAction === 'APPROVE' && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Approve
          </Button>
        </div>
      )}
    </footer>
  )
}

export default Footer
