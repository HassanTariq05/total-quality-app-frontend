import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { useChecklistFormat } from '@/hooks/use-checklist-formats'
import { useChecklistSubmission } from '@/hooks/use-checklist-submissions'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ChecklistsProvider } from '../components/checklist-provider'
import { ChecklistViewer } from '../components/checklist-viewer'
import { SubmissionsBreadcrumb } from '../components/submission-breadcrumb'

export function ChecklistSubmissionView() {
  const params = useParams({
    from: '/_authenticated/checklist-submission/$checklistSubmissionId',
  })

  const { form, setForm } = useFormBuilderStore()

  const { checklistSubmissionId } = params
  const { data: checklistSubmissionData, isLoading: isSubmissionLoading } =
    useChecklistSubmission(checklistSubmissionId)

  const formId = checklistSubmissionData?.checklistId

  const { data: formData, isLoading: isFormLoading } =
    useChecklistFormat(formId)

  useEffect(() => {
    if (!formData) return

    console.log('Checklist Data:', formData)
    console.log('form', form)
    setForm(JSON.parse(formData.format || '{}'))
  }, [formData])

  if (isSubmissionLoading || isFormLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
      </div>
    )
  }

  return (
    <ChecklistsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <SubmissionsBreadcrumb
          chapterId={formData?.checklist?.chapter?.id || ''}
          chapterName={formData?.checklist?.chapter?.title || ''}
          accreditationId={
            formData?.checklist?.chapter?.accreditation?.id || ''
          }
          accreditationName={
            formData?.checklist?.chapter?.accreditation?.name || ''
          }
          formId={formData?.checklist?.id || ''}
          formName={formData?.checklist?.title || ''}
          submissionId={checklistSubmissionId || ''}
          submissionName={checklistSubmissionData?.name || ''}
        />

        <div className='mb-0 flex flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-2xl font-bold tracking-tight'>
                  {checklistSubmissionData?.name}
                </h2>
              </div>
              <p className='text-muted-foreground'>
                {checklistSubmissionData?.description}
              </p>
            </div>
          </div>
        </div>

        <ChecklistViewer
          checklistSubmissionData={checklistSubmissionData}
          isFetchingSubmissionData={isSubmissionLoading}
          checklistId={formId || ''}
        />
      </Main>
    </ChecklistsProvider>
  )
}
