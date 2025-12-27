import { useParams } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useHasPermission } from '@/utils/permissions'
import { useGetFormSubmissionByOrgIdAndFormId } from '@/hooks/use-form-submissions'
import { useForm } from '@/hooks/use-forms'
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
import { FormBreadcrumb } from './components/breadcrumb'
import { FormSubmissions } from './components/form-submissions'
import { SubmissionsPrimaryButtons } from './components/forms-primary-buttons'
import { SubmissionsDialogs } from './components/submissions-dialogs'
import { SubmissionsProvider } from './components/submissions-provider'

export function FormView() {
  const params = useParams({ from: '/_authenticated/form/$formId' })
  const { auth } = useAuthStore()
  const { formId } = params

  const { data: form, isLoading: isLoadingForm } = useForm(formId)
  const badgeColor = badgeTypes.get(form?.status?.toLowerCase())

  const { data: submissions = [], isLoading: isLoadingSubmissions } =
    useGetFormSubmissionByOrgIdAndFormId(
      auth?.user?.organisation?.id || '',
      formId,
      { enabled: true }
    )

  const canViewForm = useHasPermission(PERMISSIONS.VIEW_FORM)
  const canViewFormSubmissions = useHasPermission(
    PERMISSIONS.VIEW_FORM_SUBMISSION
  )

  return (
    <SubmissionsProvider>
      <Header fixed>
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        {/* ======= TOP INFO SKELETON ======= */}
        {isLoadingForm ? (
          <InfoSkeleton />
        ) : (
          <>
            {canViewForm && (
              <>
                <FormBreadcrumb
                  chapterId={form?.chapter?.id || ''}
                  chapterName={form?.chapter?.title || ''}
                  accreditationId={form?.chapter?.accreditation?.id || ''}
                  accreditationName={form?.chapter?.accreditation?.name || ''}
                  formId={form?.id || ''}
                  formName={form?.title || ''}
                />

                <div className='flex flex-col justify-between gap-4 md:flex-row md:items-start'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-2xl font-semibold'>{form?.title}</h2>
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
                    <p className='text-muted-foreground text-sm'>
                      {form?.description}
                    </p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <SubmissionsPrimaryButtons formId={form?.id || ''} />
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
            {canViewFormSubmissions && <FormSubmissions data={submissions} />}
          </>
        )}
      </Main>

      <SubmissionsDialogs formId={formId} />
    </SubmissionsProvider>
  )
}
