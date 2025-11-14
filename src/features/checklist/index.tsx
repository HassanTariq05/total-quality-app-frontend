import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { cn } from '@/lib/utils'
import { useChecklistFormatByChecklistId } from '@/hooks/use-checklist-formats'
import { useGetChecklistSubmissionByOrgIdAndChecklistId } from '@/hooks/use-checklist-submissions'
import { useChecklist } from '@/hooks/use-checklists'
import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
// import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { badgeTypes } from '../users/data/data'
import { ChecklistBreadcrumb } from './components/breadcrumb'
import { ChecklistBuilder } from './components/checklist-builder'
import { ChecklistsProvider } from './components/checklist-provider'
import { ChecklistViewer } from './components/checklist-viewer'

export function ChecklistView() {
  const params = useParams({
    from: '/_authenticated/checklist/$checklistId',
  })

  const [checklistType, setChecklistType] = useState<'create' | 'update'>(
    'create'
  )
  const { setForm } = useFormBuilderStore()
  const { auth } = useAuthStore()
  const { checklistId } = params

  const { data: form, isLoading } = useChecklist(checklistId)

  const { data: formData } = useChecklistFormatByChecklistId(checklistId)
  useEffect(() => {
    if (!formData) return

    console.log('Checklist Data:', formData)
    console.log('form', form)
    setForm(JSON.parse(formData.format || '{}'))
    setChecklistType('update')
  }, [formData])

  const { data: checklistSubmissionData, isLoading: isFetchingSubmissionData } =
    useGetChecklistSubmissionByOrgIdAndChecklistId(
      auth?.user?.organisation?.id || '',
      checklistId,
      {
        enabled: !!formData?.format,
      }
    )

  const badgeColor = badgeTypes.get(form?.status?.toLowerCase())

  const [mode, setMode] = useState<'builder' | 'viewer'>('viewer')

  const handleCheckChange = () => {
    if (mode === 'builder') {
      setMode('viewer')
    } else {
      setMode('builder')
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
      </div>
    )
  }

  // const handlePrintClick = () => {}
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
        <ChecklistBreadcrumb
          chapterId={form?.chapter?.id || ''}
          chapterName={form?.chapter?.title || ''}
          accreditationId={form?.chapter?.accreditation?.id || ''}
          accreditationName={form?.chapter?.accreditation?.name || ''}
          checklistId={form?.id || ''}
          checklistName={form?.title || ''}
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
            {/* <Button
              variant='ghost'
              size='icon'
              onClick={() => handlePrintClick()}
              className='text-muted-foreground hover:text-foreground h-6 w-6 self-center rounded-full p-0 hover:bg-transparent'
              title='Print'
            >
              <Printer className='h-3 w-3' />
            </Button>
            <Separator orientation='vertical' className='h-6' /> */}
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
            <ChecklistBuilder
              formData={formData}
              checklistType={checklistType}
              checklistId={checklistId}
              mode={mode}
              setMode={setMode}
            />
          ) : (
            <ChecklistViewer
              checklistSubmissionData={checklistSubmissionData}
              isFetchingSubmissionData={isFetchingSubmissionData}
              checklistId={checklistId}
            />
          )}
        </div>
      </Main>
    </ChecklistsProvider>
  )
}
