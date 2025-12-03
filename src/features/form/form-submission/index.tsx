import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { useFormFormat } from '@/hooks/use-form-formats'
import { useFormSubmission } from '@/hooks/use-form-submissions'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { FormsProvider } from '../components/form-provider'
import { FormViewer } from '../components/form-viewer'
import { SubmissionsBreadcrumb } from '../components/submission-breadcrumb'

export function FormSubmissionView() {
  const params = useParams({
    from: '/_authenticated/form-submission/$formSubmissionId',
  })

  const { form, setForm } = useFormBuilderStore()

  const { formSubmissionId } = params
  const { data: formSubmission, isLoading: isSubmissionLoading } =
    useFormSubmission(formSubmissionId)

  const formId = formSubmission?.formId

  const { data: formData, isLoading: isFormLoading } = useFormFormat(formId)

  useEffect(() => {
    if (!formData) return

    console.log('Form Data:', formData)
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
    <FormsProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <SubmissionsBreadcrumb
          chapterId={formData?.form?.chapter?.id || ''}
          chapterName={formData?.form?.chapter?.title || ''}
          accreditationId={formData?.form?.chapter?.accreditation?.id || ''}
          accreditationName={formData?.form?.chapter?.accreditation?.name || ''}
          formId={formData?.form?.id || ''}
          formName={formData?.form?.title || ''}
          submissionId={formSubmissionId || ''}
          submissionName={formSubmission?.name || ''}
        />

        <div className='mb-0 flex flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-2xl font-bold tracking-tight'>
                  {formSubmission?.name}
                </h2>
              </div>
              <p className='text-muted-foreground'>
                {formSubmission?.description}
              </p>
            </div>
          </div>
        </div>

        <FormViewer
          formSubmissionData={formSubmission}
          isFetchingSubmissionData={isSubmissionLoading}
          formId={formId || ''}
        />
      </Main>
    </FormsProvider>
  )
}
