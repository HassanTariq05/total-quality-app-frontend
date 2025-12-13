import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PolicyPrimaryButtons({
  handleExport,
}: {
  handleExport: () => void
}) {
  return (
    <div className='flex'>
      <Button variant='ghost' className='h-7 w-7 p-0' onClick={handleExport}>
        <Download size={14} />
      </Button>
    </div>
  )
}
