import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { useFormFormat } from '@/hooks/use-form-formats'
import { FormFormatSkeleton } from '@/components/ui/form-format-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FormBuilder } from '../components/form-builder'
import { FormsProvider } from '../components/form-provider'

export function FormEditorView() {
  const params = useParams({
    from: '/_authenticated/form-editor/$formId',
  })

  const { form, setForm } = useFormBuilderStore()

  const { formId } = params

  const { data: formData, isLoading: isFormLoading } = useFormFormat(formId)

  useEffect(() => {
    if (!formData) return

    console.log('Form Data:', formData)
    console.log('form', form)
    setForm(JSON.parse(formData.format || '{}'))
  }, [formData])

  // const { data: formSubmissionData, isLoading: isFetchingFormSubmission } =
  //   useGetFormSubmissionByOrgIdAndFormId(
  //     auth?.user?.organisation?.id || '',
  //     formId,
  //     {
  //       enabled: !!formData?.format,
  //     }
  //   )

  // if (isFormLoading) {
  //   return (
  //     <div className='flex h-screen w-full items-center justify-center'>
  //       <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
  //     </div>
  //   )
  // }

  return (
    <FormsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        {isFormLoading ? (
          <FormFormatSkeleton />
        ) : (
          <>
            <div className='mb-0 flex flex-col space-y-4'>
              <div className='flex items-start justify-between'>
                <div>
                  <div className='flex items-center gap-2'>
                    <h2 className='text-2xl font-bold tracking-tight'></h2>
                  </div>
                </div>
              </div>
            </div>
            <FormBuilder formData={formData} formId={formId} />
          </>
        )}
        {/* <SubmissionsBreadcrumb
          chapterId={formData?.form?.chapter?.id || ''}
          chapterName={formData?.form?.chapter?.title || ''}
          accreditationId={formData?.form?.chapter?.accreditation?.id || ''}
          accreditationName={formData?.form?.chapter?.accreditation?.name || ''}
          formId={formData?.form?.id || ''}
          formName={formData?.form?.title || ''}
          submissionId={formSubmissionId || ''}
          submissionName={formSubmission?.name || ''}
        /> */}
      </Main>
    </FormsProvider>
  )
}
