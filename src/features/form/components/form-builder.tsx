import React, { useEffect, useState } from 'react'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { useFormFormat } from '@/hooks/use-form-formats'
import { Button } from '@/components/ui/button'
import { FieldEditor } from './field-editor'

export const FormBuilder: React.FC<{
  mode: any
  setMode: any
  formId: string
}> = ({ mode, formId }) => {
  const { form, addField, setForm } = useFormBuilderStore()

  const [formType, setFormType] = useState<'create' | 'update'>('create')

  const { data: formData } = useFormFormat(formId)
  useEffect(() => {
    if (!formData) return

    console.log('Form Data:', formData)
    console.log('form', form)
    setForm(JSON.parse(formData.format || '{}'))
    setFormType('update')
  }, [formData])

  return (
    <div className='p-0'>
      <div className='space-y-4'>
        {form.fields.map((f: any) => (
          <FieldEditor
            formType={formType}
            formId={formId}
            formFormatId={formData?.id}
            editorMode={mode}
            key={f.id}
            field={f}
          />
        ))}
      </div>

      {form.fields.length === 0 && (
        <div className='mt-2 flex gap-2'>
          <Button
            size='sm'
            className='bg-primary hover:bg-primary/90 text-primary-foreground'
            onClick={() => addField('table')}
          >
            + Add Form
          </Button>
        </div>
      )}

      {/* <div className='mt-6'>
        <h3 className='mb-2 font-medium'>Generated JSON</h3>
        <pre className='text-primary-foreground overflow-auto rounded bg-gray-800 p-3 text-sm'>
          {JSON.stringify(form, null, 2)}
        </pre>
      </div> */}
    </div>
  )
}
