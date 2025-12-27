import { useParams } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useHasPermission } from '@/utils/permissions'
import { useGetChecklistSubmissionByOrgIdAndChecklistId } from '@/hooks/use-checklist-submissions'
import { useChecklist } from '@/hooks/use-checklists'
import { Badge } from '@/components/ui/badge'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { PERMISSIONS } from '../manage-role/types/permissions'
import { badgeTypes } from '../users/data/data'
import { ChecklistBreadcrumb } from './components/breadcrumb'
import { ChecklistSubmissions } from './components/checklist-submissions'
import { SubmissionsPrimaryButtons } from './components/forms-primary-buttons'
import { SubmissionsDialogs } from './components/submissions-dialogs'
import { SubmissionsProvider } from './components/submissions-provider'

export function ChecklistView() {
  const params = useParams({
    from: '/_authenticated/checklist/$checklistId',
  })

  const { auth } = useAuthStore()
  const { checklistId } = params

  const { data: form, isLoading: isLoadingForm } = useChecklist(checklistId)

  const badgeColor = badgeTypes.get(form?.status?.toLowerCase())

  const { data: submissions = [], isLoading: isLoadingSubmissions } =
    useGetChecklistSubmissionByOrgIdAndChecklistId(
      auth?.user?.organisation?.id || '',
      checklistId,
      { enabled: true }
    )

  const canViewChecklist = useHasPermission(PERMISSIONS.VIEW_CHECKLIST)
  const canViewCheclistSubmissions = useHasPermission(
    PERMISSIONS.VIEW_CHECKLIST_SUBMISSION
  )

  return (
    <SubmissionsProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isLoadingForm ? (
          <InfoSkeleton />
        ) : (
          <>
            {canViewChecklist && (
              <>
                <ChecklistBreadcrumb
                  chapterId={form?.chapter?.id || ''}
                  chapterName={form?.chapter?.title || ''}
                  accreditationId={form?.chapter?.accreditation?.id || ''}
                  accreditationName={form?.chapter?.accreditation?.name || ''}
                  checklistId={form?.id || ''}
                  checklistName={form?.title || ''}
                />

                <div className='flex items-center justify-between'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-2xl font-bold tracking-tight'>
                        {form?.title}
                      </h2>
                      <Badge
                        variant='outline'
                        className={cn(
                          'h-6 min-h-0 px-2 py-0.5 text-sm capitalize',
                          badgeColor
                        )}
                      >
                        {form?.status}
                      </Badge>
                    </div>

                    <p className='text-muted-foreground'>{form?.description}</p>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <SubmissionsPrimaryButtons checklistId={form?.id || ''} />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {isLoadingSubmissions ? (
          <DataTableSkeleton />
        ) : (
          <>
            {canViewCheclistSubmissions && (
              <ChecklistSubmissions data={submissions} />
            )}
          </>
        )}
      </Main>

      <SubmissionsDialogs formId={checklistId} />
    </SubmissionsProvider>
  )
}
