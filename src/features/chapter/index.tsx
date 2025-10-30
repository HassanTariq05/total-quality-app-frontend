import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useChapter } from '@/hooks/use-chapters'
import { useForms } from '@/hooks/use-forms'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from '../dashboard/components/analytics'
import { badgeTypes } from '../users/data/data'
import { ChapterBreadcrumb } from './components/breadcrumb'
import { ChaptersProvider } from './components/chapters-provider'
import { Forms } from './components/forms'
import { FormsDialogs } from './components/forms-dialogs'
import { FormsPrimaryButtons } from './components/forms-primary-buttons'

export function ChapterView() {
  const params = useParams({
    from: '/_authenticated/chapter/$chapterId',
  })

  const { chapterId } = params

  const { data: chapter } = useChapter(chapterId)
  const { data: chapters = [] } = useForms(chapterId)

  const badgeColor = badgeTypes.get(chapter?.status?.toLowerCase())

  const [selectedTab, setSelectedTab] = useState<string>('forms')
  return (
    <ChaptersProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <ChapterBreadcrumb
          chapterId={chapterId}
          chapterName={chapter?.title || ''}
          accreditationId={chapter?.accreditation?.id || ''}
          accreditationName={chapter?.accreditation?.name || ''}
        />
        <div className='mb-0 flex items-center justify-between space-y-2'>
          <div className='m-0'>
            <div className='flex items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>
                {chapter?.title}
              </h2>
              <Badge
                variant='outline'
                className={cn(
                  'h-6 min-h-0 px-2 py-0.5 text-sm capitalize',
                  badgeColor
                )}
              >
                {chapter?.status}
              </Badge>
            </div>

            <p className='text-muted-foreground'>{chapter?.description}</p>
          </div>
          <div className='flex items-center space-x-2'>
            <FormsPrimaryButtons selectedTab={selectedTab} />
          </div>
        </div>
        <Tabs
          orientation='vertical'
          value={selectedTab}
          onValueChange={(val) => setSelectedTab(val)} // track tab changes
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='forms'>Forms</TabsTrigger>
              <TabsTrigger value='checklists'>Checklists</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='forms' className='space-y-4'>
            <Forms data={chapters} />
          </TabsContent>

          <TabsContent value='checklists' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
        {/* <TasksTable data={tasks} /> */}
        {/* <Chapters data={chaptersData} /> */}
      </Main>

      <FormsDialogs chapter={chapter} />
    </ChaptersProvider>
  )
}
