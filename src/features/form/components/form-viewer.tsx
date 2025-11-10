import React, { useEffect, useState } from 'react'
import { UpdateFormSubmissionPayload } from '@/services/form-submission-services/form-submission-service'
import { useAuthStore } from '@/stores/auth-store'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { cn } from '@/lib/utils'
import {
  useCreateFormSubmission,
  useGetFormSubmissionByOrgIdAndFormId,
  useUpdateFormSubmission,
} from '@/hooks/use-form-submissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { SignatureField } from './signature-field'

type FormViewerProps = {
  formId: string
}

export const FormViewer: React.FC<FormViewerProps> = ({ formId }) => {
  const { form } = useFormBuilderStore()
  const { auth } = useAuthStore()

  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const createFormSubmissionMutation = useCreateFormSubmission()
  const updateFormSubmissionMutation = useUpdateFormSubmission()
  const { data: formSubmissionData } = useGetFormSubmissionByOrgIdAndFormId(
    auth?.user?.organisation?.id || '',
    formId
  )

  useEffect(() => {
    if (formSubmissionData?.data) {
      setFormData(JSON.parse(formSubmissionData?.data || '{}'))
    }
  }, [formSubmissionData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formSubmissionData?.data) {
      const data: UpdateFormSubmissionPayload = {
        data: JSON.stringify(formData),
      }
      updateFormSubmissionMutation.mutate({
        id: formSubmissionData?.id || '',
        payload: data,
      })
    } else {
      createFormSubmissionMutation.mutate({
        formId: formId,
        data: JSON.stringify(formData),
        organisationId: auth?.user?.organisation?.id || '',
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-background text-foreground space-y-6'
    >
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
                <div className='overflow-x-auto rounded'>
                  <Table className='w-full table-fixed'>
                    <TableBody>
                      {field.rows.map((row: any, rIdx: number) => (
                        <TableRow key={rIdx} className='flex w-full'>
                          {row.map((cell: any) => (
                            <TableCell
                              key={cell.id}
                              className={cn('h-full p-0', cell.bg)}
                              style={{ flex: cell.cellFlex ?? 1 }}
                            >
                              <div
                                className={cn(
                                  'group flex h-full min-h-[52px] w-full items-center gap-2 p-2',
                                  {
                                    'justify-start': cell.alignment === 'left',
                                    'justify-center':
                                      cell.alignment === 'center',
                                    'justify-end': cell.alignment === 'right',
                                  }
                                )}
                              >
                                {cell.type === 'label' && (
                                  <span className='text-sm'>{cell.value}</span>
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
                                    <span className='text-sm'>
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

      <div className='flex justify-end pt-4'>
        <Button type='submit'>
          {formSubmissionData?.data ? 'Update Form' : 'Submit Form'}
        </Button>
      </div>

      <div className='mt-6'>
        <h3 className='mb-2 font-medium'>Filled Values</h3>
        <pre className='rounded bg-gray-900 p-3 text-sm text-gray-100'>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </form>
  )
}
