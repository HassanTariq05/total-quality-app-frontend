import React, { useState } from 'react'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table'

export const FormViewer: React.FC = () => {
  const { form } = useFormBuilderStore()

  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted Form Data:', formData)
    alert('Form submitted! Check console for output.')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-background text-foreground space-y-6'
    >
      {/* Render each field */}
      <div className='space-y-4'>
        {form.fields.map((field) => (
          <Card
            key={field.id}
            className='bg-card text-card-foreground border-border shadow-sm'
          >
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

              {/* Table-type fields */}
              {field.type === 'table' && (
                <div className='overflow-x-auto rounded'>
                  <Table className='w-full table-fixed'>
                    <TableBody>
                      {field.rows.map((row, rIdx) => (
                        <TableRow
                          key={rIdx}
                          className='flex w-full items-center'
                        >
                          {row.map((cell, cIdx) => (
                            <TableCell
                              key={cIdx}
                              className={cn(
                                'h-full p-0',
                                cell.bg || 'bg-muted'
                              )}
                              style={{ flex: cell.cellFlex ?? 1 }}
                            >
                              <div
                                className={cn(
                                  'flex h-full min-h-[52px] w-full items-center p-2',
                                  cell.alignment
                                    ? `justify-${cell.alignment}`
                                    : 'justify-center'
                                )}
                              >
                                {cell.type === 'label' && (
                                  <span className='text-foreground text-sm'>
                                    {cell.value}
                                  </span>
                                )}

                                {cell.type === 'field' && (
                                  <Input
                                    className='bg-muted text-foreground w-full text-sm'
                                    placeholder={cell.placeholder || ''}
                                    value={
                                      formData[`${field.id}-${rIdx}-${cIdx}`] ||
                                      ''
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        `${field.id}-${rIdx}-${cIdx}`,
                                        e.target.value
                                      )
                                    }
                                  />
                                )}

                                {cell.type === 'checkbox' && (
                                  <div className='flex items-center gap-2'>
                                    <Checkbox
                                      checked={
                                        !!formData[
                                          `${field.id}-${rIdx}-${cIdx}`
                                        ]
                                      }
                                      onCheckedChange={(checked) =>
                                        handleChange(
                                          `${field.id}-${rIdx}-${cIdx}`,
                                          checked
                                        )
                                      }
                                    />
                                    <span className='text-foreground text-sm'>
                                      {cell.value}
                                    </span>
                                  </div>
                                )}

                                {cell.type === 'date' && (
                                  <Input
                                    type='date'
                                    className='bg-muted text-foreground w-full text-sm'
                                    value={
                                      formData[`${field.id}-${rIdx}-${cIdx}`] ||
                                      ''
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        `${field.id}-${rIdx}-${cIdx}`,
                                        e.target.value
                                      )
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

      {/* Submit button */}
      <div className='flex justify-center pt-4'>
        <Button type='submit' className='px-6 py-2 text-lg'>
          Submit Form
        </Button>
      </div>

      {/* Debug: Show live JSON values */}
      <div className='mt-6'>
        <h3 className='mb-2 font-medium'>Filled Values</h3>
        <pre className='overflow-auto rounded bg-gray-900 p-3 text-sm text-gray-100'>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </form>
  )
}
