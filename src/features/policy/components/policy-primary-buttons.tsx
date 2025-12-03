import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PolicyPrimaryButtons({
  handleExport,
}: {
  handleExport: () => void
}) {
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => handleExport()}>
        <span>Download</span> <Download size={18} />
      </Button>
    </div>
  )
}
