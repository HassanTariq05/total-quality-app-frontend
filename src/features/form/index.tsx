import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { cn } from '@/lib/utils'
import { useFormFormat } from '@/hooks/use-form-formats'
import { useGetFormSubmissionByOrgIdAndFormId } from '@/hooks/use-form-submissions'
import { useForm } from '@/hooks/use-forms'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { badgeTypes } from '../users/data/data'
import { FormBreadcrumb } from './components/breadcrumb'
import { FormBuilder } from './components/form-builder'
import { FormsProvider } from './components/form-provider'
import { FormViewer } from './components/form-viewer'

export function FormView() {
  const params = useParams({
    from: '/_authenticated/form/$formId',
  })

  const [formType, setFormType] = useState<'create' | 'update'>('create')
  const { setForm } = useFormBuilderStore()
  const { auth } = useAuthStore()

  const { formId } = params
  const { data: form, isLoading } = useForm(formId)
  const badgeColor = badgeTypes.get(form?.status?.toLowerCase())

  const { data: formData } = useFormFormat(formId)

  useEffect(() => {
    if (!formData) return

    console.log('Form Data:', formData)
    console.log('form', form)
    setForm(JSON.parse(formData.format || '{}'))
    setFormType('update')
  }, [formData])

  const { data: formSubmissionData, isLoading: isFetchingFormSubmission } =
    useGetFormSubmissionByOrgIdAndFormId(
      auth?.user?.organisation?.id || '',
      formId,
      {
        enabled: !!formData?.format,
      }
    )

  const [mode, setMode] = useState<'builder' | 'viewer'>('viewer')

  const handleCheckChange = () => {
    setMode(mode === 'builder' ? 'viewer' : 'builder')
  }

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
      </div>
    )
  }

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
        <FormBreadcrumb
          chapterId={form?.chapter?.id || ''}
          chapterName={form?.chapter?.title || ''}
          accreditationId={form?.chapter?.accreditation?.id || ''}
          accreditationName={form?.chapter?.accreditation?.name || ''}
          formId={form?.id || ''}
          formName={form?.title || ''}
        />

        <div className='mb-0 flex items-center justify-between space-y-2'>
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
            <Switch
              checked={mode === 'builder'}
              onCheckedChange={handleCheckChange}
              id='mode'
            />
            <Label htmlFor='mode'>Editor Mode</Label>
          </div>
        </div>

        <div className='relative'>
          {mode === 'builder' ? (
            <FormBuilder
              formData={formData}
              formType={formType}
              formId={formId}
              mode={mode}
              setMode={setMode}
            />
          ) : (
            <FormViewer
              formSubmissionData={formSubmissionData}
              isFetchingSubmissionData={isFetchingFormSubmission}
              formId={formId}
            />
          )}
        </div>
      </Main>
    </FormsProvider>
  )
}
