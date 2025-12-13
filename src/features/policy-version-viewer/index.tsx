'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { SuperDoc } from '@harbour-enterprises/superdoc'
import '@harbour-enterprises/superdoc/style.css'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import {
  usePolicyVersionByVersionId,
  useUpdatePolicyVersion,
} from '@/hooks/use-policy-versions'
import { Badge } from '@/components/ui/badge'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { PolicyEditorSkeleton } from '@/components/ui/policy-editor-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { FullScreenButton } from '../policy/components/full-screen-button'
import { getStatus } from '../policy/components/helper'
import { PolicyPrimaryButtons } from '../policy/components/policy-primary-buttons'
import { PoliciesProvider } from '../policy/components/policy-provider'
import { badgeTypes } from '../users/data/data'
import Footer, { PolicyAction } from './components/footer'
import NoDocumentPlaceholder from './components/no-document-placeholder'

export function PolicyVersionViewer() {
  const params = useParams({
    from: '/_authenticated/policy-version/$policyVersionId',
  })

  const { policyVersionId } = params

  const editorRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const superdocRef = useRef<any>(null)
  const editorRootRef = useRef<HTMLDivElement>(null)
  const [localFullScreen, setLocalFullScreen] = useState(false)

  const { data: policyVersionData, isLoading: isFetchingPolicyData } =
    usePolicyVersionByVersionId(policyVersionId)

  const updatePolicyVersionDocument = useUpdatePolicyVersion()

  const badgeColor = badgeTypes.get(policyVersionData?.status)

  const { auth } = useAuthStore()

  useEffect(() => {
    if (
      !editorRef.current ||
      !toolbarRef.current ||
      !policyVersionData ||
      !policyVersionData.document
    ) {
      return
    }

    const byteCharacters = atob(policyVersionData.document)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    const docUrl = URL.createObjectURL(blob)

    const viewing =
      policyVersionData?.status === 'APPROVED' ||
      policyVersionData?.status === 'SENT_FOR_APPROVAL' ||
      policyVersionData?.status === 'REJECTED'

    const approved = policyVersionData?.status === 'APPROVED'

    const rejected = policyVersionData?.status === 'REJECTED'

    const superdoc = new SuperDoc({
      selector: editorRef.current,
      toolbar: viewing ? undefined : '#superdoc-toolbar',
      role: viewing ? 'suggester' : 'editor',
      document: docUrl,
      documentMode: viewing ? 'viewing' : 'editing',
      pagination: true,
      rulers: false,
      user: {
        id: auth?.user?.id,
        name: auth?.user?.name,
        email: auth?.user?.email,
      } as any,
      modules: {
        comments:
          approved || rejected
            ? ({
                enabled: false,
                readOnly: true,
                allowResolve: false,
                element: null,
              } as any)
            : {
                enabled: true,
                readOnly: false,
                allowResolve: !viewing,
                element: '#comments',
              },
      },
      onCommentsUpdate: ({ type }) => {
        console.log('Comment event:', type)
      },
    })

    superdocRef.current = superdoc

    if (viewing) {
      console.log('Viewing : ', viewing)
      try {
        ;(superdoc as any).setMode?.(viewing ? 'viewing' : 'editing')
        ;(superdoc as any).editor?.setReadOnly?.(viewing)
        ;(superdoc as any).setReadOnly?.(viewing)
        ;(superdoc as any).modules?.comments?.setReadOnly?.(false)
      } catch {}

      const getEditableNode = (): HTMLElement | null => {
        try {
          const container = editorRef.current as HTMLElement | null
          if (!container) return null
          return (
            (container.querySelector(
              '[contenteditable="true"]'
            ) as HTMLElement) ||
            (container.querySelector('[contenteditable]') as HTMLElement) ||
            container
          )
        } catch {
          return null
        }
      }

      const COMMENT_WHITELIST_SELECTORS = ['.super-input']

      const isNodeInsideWhitelisted = (node: Node | null) => {
        try {
          if (!node || !(node instanceof Element)) return false
          return COMMENT_WHITELIST_SELECTORS.some(
            (sel) => (node as Element).closest(sel) !== null
          )
        } catch {
          return false
        }
      }

      const isCommentActive = () => {
        try {
          const active = document.activeElement as HTMLElement | null
          if (!active) return false
          if (isNodeInsideWhitelisted(active)) return true
          try {
            const commentsContainer = document.querySelector('#comments') as
              | HTMLIFrameElement
              | HTMLElement
              | null
            if (commentsContainer) {
              const iframe = (commentsContainer as Element).querySelector(
                'iframe'
              ) as HTMLIFrameElement | null
              if (iframe && document.activeElement === iframe) {
                const doc =
                  iframe.contentDocument || iframe.contentWindow?.document
                if (
                  doc &&
                  doc.activeElement &&
                  isNodeInsideWhitelisted(doc.activeElement as Node)
                )
                  return true
              }
            }
          } catch {}
          return false
        } catch {
          return false
        }
      }

      const attachBlockers = () => {
        const editableNode = getEditableNode()
        if (!editableNode) return null

        const onBeforeInput = (ev: InputEvent) => {
          try {
            if (isCommentActive()) return
            const t = ev.inputType || ''
            const blockedPrefixes = [
              'insert',
              'delete',
              'replace',
              'format',
              'historyUndo',
              'historyRedo',
            ]
            for (const p of blockedPrefixes) {
              if (t.startsWith(p)) {
                ev.preventDefault()
                ev.stopImmediatePropagation()
                return
              }
            }
            if (!t && (ev.data || ev.data === '')) {
              ev.preventDefault()
              ev.stopImmediatePropagation()
            }
          } catch {}
        }

        const onKeyDown = (ev: KeyboardEvent) => {
          try {
            if (isCommentActive()) return
            const key = ev.key
            const isModifier = ev.ctrlKey || ev.metaKey || ev.altKey

            const navigationKeys = new Set([
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              'Home',
              'End',
              'PageUp',
              'PageDown',
              'Tab',
              'Shift',
              'Control',
              'Alt',
              'Meta',
              'CapsLock',
              'Escape',
            ])
            if (/^F\d{1,2}$/.test(key)) return
            if (navigationKeys.has(key)) return

            if ((ev.ctrlKey || ev.metaKey) && key.toLowerCase() === 'v') {
              ev.preventDefault()
              ev.stopImmediatePropagation()
              return
            }

            if (key === 'Backspace' || key === 'Delete' || key === 'Enter') {
              ev.preventDefault()
              ev.stopImmediatePropagation()
              return
            }

            if (key.length === 1 && !isModifier) {
              ev.preventDefault()
              ev.stopImmediatePropagation()
              return
            }
          } catch {}
        }

        const onPaste = (ev: ClipboardEvent) => {
          try {
            if (isCommentActive()) return
            ev.preventDefault()
            ev.stopImmediatePropagation()
          } catch {}
        }

        const onDrop = (ev: DragEvent) => {
          try {
            if (isCommentActive()) return
            ev.preventDefault()
            ev.stopImmediatePropagation()
          } catch {}
        }

        const onCompositionEnd = (ev: CompositionEvent) => {
          try {
            if (isCommentActive()) return
            ev.preventDefault()
            ev.stopImmediatePropagation()
          } catch {}
        }

        editableNode.addEventListener(
          'beforeinput',
          onBeforeInput as EventListener,
          { capture: true }
        )
        editableNode.addEventListener('keydown', onKeyDown as EventListener, {
          capture: true,
        })
        editableNode.addEventListener('paste', onPaste as EventListener, {
          capture: true,
        })
        editableNode.addEventListener('drop', onDrop as EventListener, {
          capture: true,
        })
        editableNode.addEventListener(
          'compositionend',
          onCompositionEnd as EventListener,
          { capture: true }
        )
        ;(editableNode as any).__sd_blockHandlers = {
          onBeforeInput,
          onKeyDown,
          onPaste,
          onDrop,
          onCompositionEnd,
        }

        return editableNode
      }

      let attachedNode: HTMLElement | null = attachBlockers()
      let retryCount = 0
      const retryInterval = 250
      const maxRetries = 12
      let retryTimer: number | undefined
      if (!attachedNode) {
        retryTimer = window.setInterval(() => {
          retryCount++
          attachedNode = attachBlockers()
          if (attachedNode || retryCount >= maxRetries) {
            if (retryTimer) {
              clearInterval(retryTimer)
              retryTimer = undefined
            }
          }
        }, retryInterval)
      }

      const cleanup = () => {
        try {
          if (retryTimer) clearInterval(retryTimer)
        } catch {}

        try {
          const nodesToCheck: Array<HTMLElement | null> = []
          const cur = getEditableNode()
          nodesToCheck.push(cur)
          if (attachedNode && attachedNode !== cur)
            nodesToCheck.push(attachedNode)

          for (const node of nodesToCheck) {
            if (!node) continue
            const h = (node as any).__sd_blockHandlers
            if (h) {
              node.removeEventListener('beforeinput', h.onBeforeInput, {
                capture: true,
              })
              node.removeEventListener('keydown', h.onKeyDown, {
                capture: true,
              })
              node.removeEventListener('paste', h.onPaste, { capture: true })
              node.removeEventListener('drop', h.onDrop, { capture: true })
              node.removeEventListener('compositionend', h.onCompositionEnd, {
                capture: true,
              })
              delete (node as any).__sd_blockHandlers
            }
          }
        } catch {}

        try {
          superdoc?.destroy?.()
        } catch {}
        try {
          URL.revokeObjectURL(docUrl)
        } catch {}
      }

      return () => {
        cleanup()
      }
    }
  }, [policyVersionData])

  const handleExport = async () => {
    const superdoc = superdocRef.current
    if (!superdoc) return console.error('SuperDoc not initialized')

    const editor = superdoc.activeEditor
    if (!editor) return console.error('SuperDoc editor not ready yet')

    try {
      const blob = await superdoc.export({
        commentsType: 'external',
        isFinalDoc: false,
      })

      const comments = editor.getComments?.() ?? []
      console.log('Comments to export:', comments)

      const fileName = policyVersionData?.documentName ?? 'updated.docx'
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

  function disableDownloadTemporarily(fn: () => Promise<any>) {
    const originalClick = HTMLAnchorElement.prototype.click

    HTMLAnchorElement.prototype.click = function () {
      console.warn('Download prevented by override')
    }

    return fn().finally(() => {
      HTMLAnchorElement.prototype.click = originalClick
    })
  }

  const resetEditor = (options?: {
    keepToolbar?: boolean
    reinitWith?: any
  }) => {
    try {
      const sd = superdocRef.current
      sd?.destroy?.()
      superdocRef.current = null

      if (editorRef.current) {
        editorRef.current.innerHTML = ''
        editorRef.current.style.position = ''
      }

      if (toolbarRef.current && !options?.keepToolbar) {
        toolbarRef.current.innerHTML = ''
      }
    } catch (e) {
      console.error('resetEditor failed', e)
    }
  }

  const [activeAction, setActiveAction] = useState<PolicyAction | null>(null)

  const handlePolicyAction = async (action: PolicyAction) => {
    const superdoc = superdocRef.current
    if (!superdoc) {
      console.error('SuperDoc not initialized')
      return
    }

    const editor = (superdoc as any).activeEditor
    if (!editor) {
      console.error('Editor not ready')
      return
    }

    setActiveAction(action)

    try {
      let nextStatus: string = policyVersionData?.status ?? 'DRAFT'
      let includeDocument = false

      switch (action) {
        case 'SAVE_DRAFT':
          nextStatus = 'DRAFT'
          includeDocument = true
          break
        case 'SEND_FOR_APPROVAL':
          nextStatus = 'SENT_FOR_APPROVAL'
          includeDocument = true
          break
        case 'REJECT':
          nextStatus = 'REJECTED'
          break
        case 'SEND_FOR_REVISION':
          nextStatus = 'SENT_FOR_REVISION'
          includeDocument = true
          break
        case 'APPROVE':
          nextStatus = 'APPROVED'
          break
      }

      const formData = new FormData()

      if (includeDocument) {
        const blob = await disableDownloadTemporarily(() =>
          superdoc.export({
            commentsType: 'external',
            isFinalDoc: false,
          })
        )
        const fileName =
          policyVersionData?.documentName ?? 'policy-version.docx'
        const file = new File([blob], fileName, {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
        formData.append('document', file)
      }

      formData.append('title', policyVersionData?.title ?? '')
      formData.append('description', policyVersionData?.description ?? '')
      formData.append('status', nextStatus)

      updatePolicyVersionDocument.mutate(
        {
          versionId: policyVersionId,
          payload: formData,
        },
        {
          onSuccess: (data) => {
            resetEditor({ keepToolbar: false, reinitWith: data })
            console.log(`Action performed: ${action} — success`)
            setActiveAction(null)
          },
          onError: (err) => {
            console.error('Policy action failed:', err)
            setActiveAction(null)
          },
        }
      )
    } catch (err) {
      console.error('Policy action failed (sync):', err)
      setActiveAction(null)
    }
  }

  useEffect(() => {
    const onFsChange = () => {
      const fsElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement

      setLocalFullScreen(!!fsElement)
    }

    document.addEventListener('fullscreenchange', onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    document.addEventListener('mozfullscreenchange', onFsChange)
    document.addEventListener('MSFullscreenChange', onFsChange)

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
      document.removeEventListener('mozfullscreenchange', onFsChange)
      document.removeEventListener('MSFullscreenChange', onFsChange)
    }
  }, [])

  return (
    <PoliciesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <div className='flex h-screen flex-col'>
        <Main
          ref={editorRootRef}
          className={`relative flex-1 py-0 transition-all ${
            localFullScreen ? 'h-screen w-screen' : 'min-h-screen'
          }`}
          style={localFullScreen ? { zIndex: 9999 } : undefined}
        >
          <div className='flex h-full flex-col'>
            {isFetchingPolicyData ? (
              <InfoSkeleton />
            ) : (
              <div className='bg-background relative z-50 flex items-center justify-between border-b px-6'>
                <div>
                  <h2 className='text-lg font-bold tracking-tight'>
                    {`${policyVersionData?.policy?.title} - v${policyVersionData?.number}`}
                  </h2>
                  <p className='text-muted-foreground'>
                    {policyVersionData?.description}
                  </p>
                </div>

                <div className='flex items-center gap-3'>
                  <Badge
                    variant='outline'
                    className={cn('h-5 px-2 text-xs capitalize', badgeColor)}
                  >
                    {getStatus(policyVersionData?.status)}
                  </Badge>

                  {policyVersionData?.document && (
                    <PolicyPrimaryButtons handleExport={handleExport} />
                  )}

                  <FullScreenButton
                    rootRef={editorRootRef}
                    setLocalFullScreen={setLocalFullScreen}
                  />
                </div>
              </div>
            )}

            <div className='bg-muted/5 flex-1 overflow-y-auto'>
              {isFetchingPolicyData ? (
                <PolicyEditorSkeleton />
              ) : policyVersionData?.document ? (
                <>
                  <div
                    ref={toolbarRef}
                    id='superdoc-toolbar'
                    className='scrollbar-thin scrollbar-thumb-gray-400 sticky top-0 z-30 flex flex-nowrap items-center justify-center overflow-x-auto overflow-y-hidden border-b bg-gray-100 whitespace-nowrap shadow-sm'
                  />
                  <div
                    ref={editorRef}
                    id='superdoc'
                    className='flex min-h-screen justify-center self-center border-x-0 border-t border-b-0 bg-white'
                  />
                </>
              ) : (
                <NoDocumentPlaceholder />
              )}
            </div>
          </div>
        </Main>

        <Footer
          onAction={handlePolicyAction}
          status={policyVersionData?.status ?? 'DRAFT'}
          isLoading={updatePolicyVersionDocument.isPending}
          activeAction={activeAction}
        />
      </div>
    </PoliciesProvider>
  )
}
