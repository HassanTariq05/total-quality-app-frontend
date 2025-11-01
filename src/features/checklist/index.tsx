import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useChecklist } from '@/hooks/use-checklists'
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
import { ChecklistBreadcrumb } from './components/breadcrumb'
import { ChecklistBuilder } from './components/checklist-builder'
import { ChecklistsProvider } from './components/checklist-provider'
import { ChecklistViewer } from './components/checklist-viewer'

export function ChecklistView() {
  const params = useParams({
    from: '/_authenticated/checklist/$checklistId',
  })

  const { checklistId } = params

  const { data: form } = useChecklist(checklistId)

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
    <ChecklistsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='sm:gap- flex flex-1 flex-col gap-4'>
        <ChecklistBreadcrumb
          chapterId={form?.chapter?.id || ''}
          chapterName={form?.chapter?.title || ''}
          accreditationId={form?.chapter?.accreditation?.id || ''}
          accreditationName={form?.chapter?.accreditation?.name || ''}
          checklistId={form?.id || ''}
          checklistName={form?.title || ''}
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
            <ChecklistBuilder
              checklistId={checklistId}
              mode={mode}
              setMode={setMode}
            />
          </div>
          <div className={mode === 'viewer' ? 'block' : 'hidden'}>
            <ChecklistViewer />
          </div>
        </div>
      </Main>
    </ChecklistsProvider>
  )
}
