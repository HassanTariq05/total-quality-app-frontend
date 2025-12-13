import { useParams } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { usePolicy } from '@/hooks/use-policies'
import { usePolicyVersions } from '@/hooks/use-policy-versions'
import { Badge } from '@/components/ui/badge'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { badgeTypes } from '../users/data/data'
import { PolicyBreadcrumb } from './components/breadcrumb'
// import { SubmissionsPrimaryButtons } from './components/forms-primary-buttons'
import { PolicyVersions } from './components/policy-versions'
import { PolicyVersionsDialogs } from './components/policy-versions-dialogs'
import { PolicyVersionsProvider } from './components/policy-versions-provider'
import { VersionsPrimaryButtons } from './components/versions-primary-buttons'

export function PolicyVersionsView() {
  const params = useParams({ from: '/_authenticated/policy/$policyId' })
  const { policyId } = params

  const { data: policy, isLoading: isPolicyLoading } = usePolicy(policyId)
  const badgeColor = badgeTypes.get(policy?.status?.toLowerCase())

  const { data: versions = [], isLoading: isLoadingVersions } =
    usePolicyVersions(policyId)

  return (
    <PolicyVersionsProvider>
      <Header fixed>
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        {isPolicyLoading ? (
          <InfoSkeleton />
        ) : (
          <>
            <PolicyBreadcrumb
              chapterId={policy?.chapter?.id || ''}
              chapterName={policy?.chapter?.title || ''}
              accreditationId={policy?.chapter?.accreditation?.id || ''}
              accreditationName={policy?.chapter?.accreditation?.name || ''}
              policyId={policy?.id || ''}
              policyName={policy?.title || ''}
            />

            <div className='flex flex-col justify-between gap-4 md:flex-row md:items-start'>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-2xl font-semibold'>{policy?.title}</h2>
                  <Badge
                    variant='outline'
                    className={cn(
                      'h-6 min-h-0 px-2 py-0.5 text-sm capitalize',
                      badgeColor
                    )}
                  >
                    {policy?.status}
                  </Badge>
                </div>
                <p className='text-muted-foreground text-sm'>
                  {policy?.description}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                <VersionsPrimaryButtons policyId={policyId} />
              </div>
            </div>
          </>
        )}

        {isLoadingVersions ? (
          <DataTableSkeleton />
        ) : (
          <PolicyVersions data={versions} />
        )}
      </Main>

      <PolicyVersionsDialogs policyId={policyId} />
    </PolicyVersionsProvider>
  )
}
