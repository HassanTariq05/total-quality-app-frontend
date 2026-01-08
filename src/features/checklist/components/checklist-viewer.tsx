import React, { useEffect, useState } from 'react'
import {
  ChecklistSubmission,
  UpdateChecklistSubmissionPayload,
} from '@/services/checklist-submission-services/checklist-submission-services'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { cn } from '@/lib/utils'
import { useHasPermission } from '@/utils/permissions'
import { useUpdateChecklistSubmission } from '@/hooks/use-checklist-submissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { PERMISSIONS } from '@/features/manage-role/types/permissions'
import { SignatureField } from './signature-field'

type ChecklistViewerProps = {
  checklistId: string
  checklistSubmissionData: ChecklistSubmission | undefined
  isFetchingSubmissionData: boolean
}

export const ChecklistViewer: React.FC<ChecklistViewerProps> = ({
  checklistId,
  checklistSubmissionData,
  isFetchingSubmissionData,
}) => {
  const { form } = useFormBuilderStore()
  const { auth } = useAuthStore()

  const canUpdateChecklist = useHasPermission(
    PERMISSIONS.EDIT_CHECKLIST_SUBMISSION
  )

  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const updateChecklistSubmissionMutation = useUpdateChecklistSubmission()

  useEffect(() => {
    if (checklistSubmissionData?.data) {
      const parsed = JSON.parse(checklistSubmissionData.data || '[]')

      if (Array.isArray(parsed)) {
        const mapped: Record<string, any> = {}
        parsed.forEach((item: any) => {
          mapped[item.id] = item.value
        })
        setFormData(mapped)
      } else {
        setFormData(parsed)
      }
    }
  }, [checklistSubmissionData])

  const buildSubmissionData = () => {
    const result: any[] = []

    const collectIdentifiers = (items: any[]) => {
      items.forEach((item) => {
        if (item.id) {
          result.push({
            id: item.id,
            identifier: item.identifier,
            value: formData[item.id] ?? null,
          })
        }

        if (item.rows) {
          item.rows.forEach((row: any[]) =>
            row.forEach((cell: any) => {
              if (cell.id) {
                result.push({
                  id: cell.id,
                  identifier: cell.identifier,
                  value: formData[cell.id] ?? null,
                })
              }

              if (cell.children) {
                cell.children.forEach((child: any) => {
                  result.push({
                    id: child.id,
                    identifier: child.identifier,
                    value: formData[child.id] ?? null,
                  })
                })
              }
            })
          )
        }
      })
    }

    collectIdentifiers(form.fields)

    return result
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const structuredData = buildSubmissionData()

    if (checklistSubmissionData?.id) {
      const data: UpdateChecklistSubmissionPayload = {
        data: JSON.stringify(structuredData),
        checklistId: checklistId,
        organisationId: auth?.user?.organisation?.id || '',
        name: checklistSubmissionData?.name,
        description: checklistSubmissionData?.description,
      }
      updateChecklistSubmissionMutation.mutate({
        id: checklistSubmissionData?.id || '',
        payload: data,
      })
    }
  }

  if (isFetchingSubmissionData) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='bg-background text-foreground'>
      <div className='space-y-4'>
        {form.fields.map((field: any) => (
          <Card key={field.id} className='bg-card border-border shadow-sm'>
            <CardHeader>
              <h3 className='text-lg font-semibold'>{field.label}</h3>
            </CardHeader>

            <CardContent>
              {field.type === 'text' && (
                <Input
                  placeholder='Enter text...'
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              {field.type === 'number' && (
                <Input
                  type='number'
                  placeholder='Enter number...'
                  value={formData[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              {field.type === 'checkbox' && (
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    checked={!!formData[field.id]}
                    onCheckedChange={(checked) =>
                      handleChange(field.id, checked)
                    }
                  />
                  <label>{field.label}</label>
                </div>
              )}

              {field.type === 'table' && (
                <div className='overflow-visible rounded'>
                  <Table className='w-full overflow-visible'>
                    <TableBody>
                      {field.rows.map((row: any, rIdx: number) => (
                        <TableRow
                          key={rIdx}
                          className='flex items-center justify-center'
                          style={{
                            width: form?.formWidth
                              ? `${form?.formWidth}px`
                              : '100%',
                            maxWidth: form?.formWidth
                              ? `${form?.formWidth}px`
                              : '100%',
                          }}
                        >
                          {row.map((cell: any) => (
                            <TableCell
                              key={cell.id}
                              className={cn('h-full p-0', cell.bg)}
                              style={{ flex: cell.cellFlex ?? 1 }}
                            >
                              <div
                                className={cn(
                                  'flex h-full min-h-[52px] w-full flex-col justify-center gap-2 p-2'
                                )}
                              >
                                <div
                                  className={cn('flex items-center gap-2', {
                                    'justify-start text-left':
                                      cell.alignment === 'left' ||
                                      cell.alignment == 'Field',
                                    'justify-center text-center':
                                      cell.alignment === 'center',
                                    'justify-end text-right':
                                      cell.alignment === 'right',
                                  })}
                                >
                                  {cell.type === 'label' && (
                                    <div
                                      className={cn(
                                        'w-full break-words whitespace-normal',
                                        '[&>h1]:text-2xl [&>h1]:font-semibold [&>h2]:text-xl [&>h3]:text-lg'
                                      )}
                                      dangerouslySetInnerHTML={{
                                        __html: String(cell.value),
                                      }}
                                    />
                                  )}

                                  {cell.type === 'link' && (
                                    <button
                                      type='button'
                                      onClick={() => {
                                        if (cell.linkUrl) {
                                          const url =
                                            cell.linkUrl.startsWith(
                                              'http://'
                                            ) ||
                                            cell.linkUrl.startsWith('https://')
                                              ? cell.linkUrl
                                              : `https://${cell.linkUrl}`

                                          window.open(
                                            url,
                                            '_blank',
                                            'noopener,noreferrer'
                                          )
                                        }
                                      }}
                                      className='cursor-pointer text-left text-sm break-words whitespace-normal text-blue-600 underline'
                                    >
                                      {cell.linkText || 'Open link'}
                                    </button>
                                  )}

                                  {cell.type === 'field' && (
                                    <Input
                                      className='bg-muted text-sm'
                                      placeholder={cell.placeholder}
                                      value={formData[cell.id] || ''}
                                      onChange={(e) =>
                                        handleChange(cell.id, e.target.value)
                                      }
                                    />
                                  )}

                                  {cell.type === 'checkbox' && (
                                    <div className='flex items-center gap-2'>
                                      <Checkbox
                                        checked={!!formData[cell.id]}
                                        onCheckedChange={(checked) =>
                                          handleChange(cell.id, checked)
                                        }
                                      />
                                      <span className='text-sm break-words whitespace-normal'>
                                        {cell.value}
                                      </span>
                                    </div>
                                  )}

                                  {cell.type === 'date' && (
                                    <Input
                                      type='date'
                                      className='bg-muted text-sm'
                                      value={formData[cell.id] || ''}
                                      onChange={(e) =>
                                        handleChange(cell.id, e.target.value)
                                      }
                                    />
                                  )}

                                  {cell.type === 'signature' && (
                                    <SignatureField
                                      value={formData[cell.id]}
                                      onChange={(val) =>
                                        handleChange(cell.id, val)
                                      }
                                    />
                                  )}
                                </div>

                                {cell.children?.map((child: any) => (
                                  <div
                                    key={child.id}
                                    className='border-border flex w-full flex-col border-t pt-2'
                                  >
                                    <div
                                      className={cn(
                                        'flex w-full items-center gap-2',
                                        {
                                          'justify-start text-left':
                                            child.alignment === 'left',
                                          'justify-center text-center':
                                            child.alignment === 'center',
                                          'justify-end text-right':
                                            child.alignment === 'right',
                                        }
                                      )}
                                    >
                                      {child.type === 'label' && (
                                        <span className='text-sm break-words whitespace-normal'>
                                          {child.value}
                                        </span>
                                      )}

                                      {child.type === 'field' && (
                                        <Input
                                          className='bg-muted text-sm'
                                          placeholder={child.placeholder}
                                          value={formData[child.id] || ''}
                                          onChange={(e) =>
                                            handleChange(
                                              child.id,
                                              e.target.value
                                            )
                                          }
                                        />
                                      )}

                                      {child.type === 'checkbox' && (
                                        <div className='flex items-center gap-2'>
                                          <Checkbox
                                            checked={!!formData[child.id]}
                                            onCheckedChange={(checked) =>
                                              handleChange(child.id, checked)
                                            }
                                          />
                                          <span className='text-sm'>
                                            {child.value}
                                          </span>
                                        </div>
                                      )}

                                      {child.type === 'date' && (
                                        <Input
                                          type='date'
                                          className='bg-muted text-sm'
                                          value={formData[child.id] || ''}
                                          onChange={(e) =>
                                            handleChange(
                                              child.id,
                                              e.target.value
                                            )
                                          }
                                        />
                                      )}

                                      {child.type === 'signature' && (
                                        <SignatureField
                                          value={formData[child.id]}
                                          onChange={(val) =>
                                            handleChange(child.id, val)
                                          }
                                        />
                                      )}

                                      {child.type === 'link' && (
                                        <button
                                          type='button'
                                          onClick={() => {
                                            if (child.linkUrl) {
                                              const raw = child.linkUrl.trim()
                                              const url =
                                                raw.startsWith('http://') ||
                                                raw.startsWith('https://')
                                                  ? raw
                                                  : `https://${raw}`

                                              window.open(
                                                url,
                                                '_blank',
                                                'noopener,noreferrer'
                                              )
                                            }
                                          }}
                                          className='cursor-pointer text-left text-sm break-words whitespace-normal text-blue-600 underline'
                                        >
                                          {child.linkText || 'Open link'}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {form.fields?.length !== 0 && canUpdateChecklist && (
        <div className='flex justify-end pt-4'>
          <Button
            type='submit'
            disabled={updateChecklistSubmissionMutation.isPending}
          >
            {updateChecklistSubmissionMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Update Checklist
          </Button>
        </div>
      )}

      {form.fields?.length === 0 && (
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
            No Layout Found
          </h2>
          <p className='text-muted-foreground mt-2 max-w-sm text-sm'>
            It looks like this checklist hasn’t been created or submitted yet.
          </p>
        </div>
      )}

      {/* <div className='mt-6'>
        <h3 className='mb-2 font-medium'>Filled Values</h3>
        <pre className='rounded bg-gray-900 p-3 text-sm text-gray-100'>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div> */}
    </form>
  )
}
