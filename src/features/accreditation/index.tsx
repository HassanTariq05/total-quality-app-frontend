import { useParams } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useAccreditation } from '@/hooks/use-accreditations'
import { useChapters } from '@/hooks/use-chapters'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { badgeTypes } from '../users/data/data'
import { AccreditaionBreadcrumb } from './components/breadcrumb'
import { Chapters } from './components/chapters'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider } from './components/tasks-provider'

export function AccreditationView() {
  const params = useParams({
    from: '/_authenticated/accreditation/$accreditationId',
  })

  const { accreditationId } = params

  const { data: accreditation } = useAccreditation(accreditationId)

  const { data: chaptersData = [] } = useChapters(accreditationId)

  const badgeColor = badgeTypes.get(accreditation?.status?.toLowerCase())
  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <AccreditaionBreadcrumb
          accreditationId={accreditationId}
          accreditationName={accreditation?.name || ''}
        />
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>
                {accreditation?.name}
              </h2>
              <Badge
                variant='outline'
                className={cn(
                  'h-6 min-h-0 px-2 py-0.5 text-sm capitalize',
                  badgeColor
                )}
              >
                {accreditation?.status}
              </Badge>
            </div>

            <p className='text-muted-foreground'>
              {accreditation?.description}
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <Separator />
        <Chapters data={chaptersData} />
      </Main>

      <TasksDialogs accreditation={accreditation} />
    </TasksProvider>
  )
}
