import { Copy } from 'lucide-react'
import { useCloneLatestPolicyVersion } from '@/hooks/use-policy-versions'
import { Button } from '@/components/ui/button'

type VersionsPrimaryButtonsProps = {
  policyId: string
}

export function VersionsPrimaryButtons({
  policyId,
}: VersionsPrimaryButtonsProps) {
  const cloneLatestVersion = useCloneLatestPolicyVersion()

  const handleCloneLatestVersion = () => {
    cloneLatestVersion.mutate({ policyId })
  }

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={handleCloneLatestVersion}>
        <span>Clone Latest Version</span>
        <Copy size={18} />
      </Button>
    </div>
  )
}
