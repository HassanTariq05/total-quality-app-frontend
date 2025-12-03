import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { FormSchema } from '@/types/form'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { cn } from '@/lib/utils'
import { useChapter } from '@/hooks/use-chapters'
import { useChecklists } from '@/hooks/use-checklists'
import { useForms } from '@/hooks/use-forms'
import { usePolicies } from '@/hooks/use-policies'
import { Badge } from '@/components/ui/badge'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { badgeTypes } from '../users/data/data'
import { ChapterBreadcrumb } from './components/breadcrumb'
import { ChaptersProvider } from './components/chapters-provider'
import { Checklists } from './components/checklists'
import { ChecklistsDialogs } from './components/checklists-dialogs'
import { Forms } from './components/forms'
import { FormsDialogs } from './components/forms-dialogs'
import { FormsPrimaryButtons } from './components/forms-primary-buttons'
import { Policies } from './components/policies'
import { PoliciesDialogs } from './components/policies-dialogs'

export function ChapterView() {
  const params = useParams({
    from: '/_authenticated/chapter/$chapterId',
  })

  const { chapterId } = params

  const [formPage, setFormPage] = useState(0)
  const [formPageSize, setFormPageSize] = useState(10)

  const [checklistPage, setChecklistPage] = useState(0)
  const [checklistPageSize, setChecklistPageSize] = useState(10)

  const [policyPage, setPolicyPage] = useState(0)
  const [policyPageSize, setPolicyPageSize] = useState(10)

  const { data: chapter, isLoading: isFetchingChapters } = useChapter(chapterId)
  const { data: formsData = null, isLoading: isFetchingForms } = useForms(
    chapterId,
    formPage,
    formPageSize
  )

  const forms = formsData?.content || []
  const totalFormPages = formsData?.totalPages || 0

  const { data: checklistsData = null, isLoading: isFetchingChecklists } =
    useChecklists(chapterId, checklistPage, checklistPageSize)

  const checklists = checklistsData?.content || []
  const totalChecklistPages = checklistsData?.totalPages || 0

  const { data: policiesData = null, isLoading: isFetchingPolicies } =
    usePolicies(chapterId, policyPage, policyPageSize)

  const policies = policiesData?.content || []
  const totalPolicyPages = policiesData?.totalPages || 0

  const { setForm } = useFormBuilderStore()

  useEffect(() => {
    const emptyForm: FormSchema = {
      id: '',
      title: '',
      fields: [],
      rows: [],
      elements: [],
    }
    setForm(emptyForm)
  }, [])

  const badgeColor = badgeTypes.get(chapter?.status?.toLowerCase())

  const [selectedTab, setSelectedTab] = useState<string>('forms')
  return (
    <ChaptersProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isFetchingChapters ? (
          <InfoSkeleton />
        ) : (
          <>
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
          </>
        )}

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
              {/* <TabsTrigger value='policies'>Policies</TabsTrigger> */}
            </TabsList>
          </div>

          <TabsContent value='forms' className='space-y-4'>
            {isFetchingForms ? (
              <DataTableSkeleton />
            ) : (
              <Forms
                data={forms}
                page={formPage}
                pageSize={formPageSize}
                totalPages={totalFormPages}
                onPageChange={setFormPage}
                onPageSizeChange={setFormPageSize}
              />
            )}
          </TabsContent>

          <TabsContent value='checklists' className='space-y-4'>
            {isFetchingChecklists ? (
              <DataTableSkeleton />
            ) : (
              <Checklists
                data={checklists}
                page={checklistPage}
                pageSize={checklistPageSize}
                totalPages={totalChecklistPages}
                onPageChange={setChecklistPage}
                onPageSizeChange={setChecklistPageSize}
              />
            )}
          </TabsContent>

          <TabsContent value='policies' className='space-y-4'>
            {isFetchingPolicies ? (
              <DataTableSkeleton />
            ) : (
              <Policies
                data={policies}
                page={policyPage}
                pageSize={policyPageSize}
                totalPages={totalPolicyPages}
                onPageChange={setPolicyPage}
                onPageSizeChange={setPolicyPageSize}
              />
            )}
          </TabsContent>
        </Tabs>
      </Main>

      <FormsDialogs chapter={chapter} />
      <ChecklistsDialogs chapter={chapter} />
      <PoliciesDialogs chapter={chapter} />
    </ChaptersProvider>
  )
}
