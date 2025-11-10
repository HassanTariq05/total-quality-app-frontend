import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
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

  const { formId } = params

  const { data: form } = useForm(formId)

  const badgeColor = badgeTypes.get(form?.status?.toLowerCase())

  const [mode, setMode] = useState<'builder' | 'viewer'>('builder')

  const handleCheckChange = () => {
    if (mode === 'builder') {
      setMode('viewer')
    } else {
      setMode('builder')
    }
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

      <Main className='sm:gap- flex flex-1 flex-col gap-4'>
        <FormBreadcrumb
          chapterId={form?.chapter?.id || ''}
          chapterName={form?.chapter?.title || ''}
          accreditationId={form?.chapter?.accreditation?.id || ''}
          accreditationName={form?.chapter?.accreditation?.name || ''}
          formId={form?.id || ''}
          formName={form?.title || ''}
        />

        <div className='mb-0 flex items-center justify-between space-y-2'>
          <div className='m-0'>
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
              checked={mode === 'builder' ? true : false}
              onCheckedChange={handleCheckChange}
              id='mode'
            />
            <Label htmlFor='mode'>Editor Mode</Label>
          </div>
        </div>

        {/* {mode === 'builder' ? (
          <FormBuilder formId={formId} mode={mode} setMode={setMode} />
        ) : (
          <FormViewer />
        )} */}

        <div className='relative'>
          <div className={mode === 'builder' ? 'block' : 'hidden'}>
            <FormBuilder formId={formId} mode={mode} setMode={setMode} />
          </div>
          <div className={mode === 'viewer' ? 'block' : 'hidden'}>
            <FormViewer formId={formId} />
          </div>
        </div>
      </Main>
    </FormsProvider>
  )
}
