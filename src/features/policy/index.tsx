'use client'

import { useEffect, useRef } from 'react'
import { useParams } from '@tanstack/react-router'
import { SuperDoc } from 'superdoc'
import 'superdoc/style.css'
import { cn } from '@/lib/utils'
import { usePolicy } from '@/hooks/use-policies'
import { Badge } from '@/components/ui/badge'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { PolicyEditorSkeleton } from '@/components/ui/policy-editor-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { badgeTypes } from '../users/data/data'
import { PolicyBreadcrumb } from './components/breadcrumb'
import { PolicyPrimaryButtons } from './components/policy-primary-buttons'
import { PoliciesProvider } from './components/policy-provider'

export function PolicyView() {
  const params = useParams({
    from: '/_authenticated/policy/$policyId',
  })

  const { policyId } = params

  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const superdocRef = useRef<any>(null)

  const { data: policyData, isLoading: isFetchingPolicyData } =
    usePolicy(policyId)

  const badgeColor = badgeTypes.get(policyData?.status?.toLowerCase())

  useEffect(() => {
    if (
      !editorRef.current ||
      !toolbarRef.current ||
      !policyData ||
      !policyData.document
    )
      return

    const byteCharacters = atob(policyData.document)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })

    const docUrl = URL.createObjectURL(blob)

    const superdoc = new SuperDoc({
      selector: editorRef.current,
      toolbar: '#superdoc-toolbar',
      document: docUrl,
      documentMode: 'editing',
      pagination: true,
      rulers: true,
      modules: {
        comments: {
          readOnly: false,
          allowResolve: true,
          element: '#comments',
        } as any,
      },
      onCommentsUpdate: ({ type, comment }: any) => {
        console.log('Comment event:', type)
        console.log('Comments:', comment)
        console.log('Superdoc:', superdoc)
      },
    })

    superdocRef.current = superdoc

    superdoc.on('documentLoaded', async () => {
      console.log('SuperDoc loaded successfully')

      const editor = superdoc.activeEditor as any

      if (!editor) return

      setTimeout(() => {
        const comments = editor.getComments?.() ?? []
        console.log('Comments after load:', comments)
      }, 100)
    })

    return () => {
      superdoc?.destroy?.()
      URL.revokeObjectURL(docUrl)
    }
  }, [policyData])

  const handleExport = async () => {
    const superdoc = superdocRef.current
    if (!superdoc) return console.error('SuperDoc not initialized')

    const editor = superdoc.activeEditor
    if (!editor) return console.error('SuperDoc editor not ready yet')

    try {
      const blob = await editor.exportDocx()

      // Safely get comments
      const comments = editor.getComments?.() ?? []
      console.log('Comments to export:', comments)

      const fileName = policyData?.documentName ?? 'updated.docx'
      const file = new File([blob], fileName, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      console.log('File object:', file)

      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log(`Document downloaded locally as ${fileName}`)
    } catch (e) {
      console.error('Export failed:', e)
    }
  }

  return (
    <PoliciesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isFetchingPolicyData ? (
          <InfoSkeleton />
        ) : (
          <>
            <PolicyBreadcrumb
              chapterId={policyData?.chapter?.id || ''}
              chapterName={policyData?.chapter?.title || ''}
              accreditationId={policyData?.chapter?.accreditation?.id || ''}
              accreditationName={policyData?.chapter?.accreditation?.name || ''}
              policyId={policyData?.id || ''}
              policyName={policyData?.title || ''}
            />
            <div className='mb-0 flex items-center justify-between space-y-2'>
              <div className='m-0'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-2xl font-bold tracking-tight'>
                    {policyData?.title}
                  </h2>
                  <Badge
                    variant='outline'
                    className={cn(
                      'h-6 min-h-0 px-2 py-0.5 text-sm capitalize',
                      badgeColor
                    )}
                  >
                    {policyData?.status}
                  </Badge>
                </div>

                <p className='text-muted-foreground'>
                  {policyData?.description}
                </p>
              </div>
              {policyData?.document && (
                <div className='flex items-center space-x-2'>
                  <PolicyPrimaryButtons handleExport={handleExport} />
                </div>
              )}
            </div>
          </>
        )}

        {isFetchingPolicyData ? (
          <PolicyEditorSkeleton />
        ) : policyData?.document ? (
          <>
            <div
              ref={toolbarRef}
              id='superdoc-toolbar'
              className='superdoc-toolbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 w-full overflow-x-auto border bg-gray-100 p-2 whitespace-nowrap'
            ></div>

            <div
              ref={editorRef}
              id='superdoc'
              className='min-h-[600px] flex-1 border'
            />
          </>
        ) : (
          <div className='border-muted-foreground/30 bg-muted/30 flex h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center'>
            <div className='bg-primary/10 mb-4 rounded-full p-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='text-muted-foreground h-10 w-10'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v10a2 2 0 01-2 2z'
                />
              </svg>
            </div>

            <h2 className='text-foreground text-xl font-semibold'>
              No Document Found
            </h2>
            <p className='text-muted-foreground mt-2 max-w-sm text-sm'>
              Please upload a policy document.
            </p>
          </div>
        )}
      </Main>
    </PoliciesProvider>
  )
}
