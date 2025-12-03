import React from 'react'
import { FormFormat } from '@/services/form-format-services/types'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { Button } from '@/components/ui/button'
import { FieldEditor } from './field-editor'

export const FormBuilder: React.FC<{
  formId: string
  formData: FormFormat | undefined
}> = ({ formId, formData }) => {
  const { form, addField } = useFormBuilderStore()

  return (
    <div className='p-0'>
      <div className='space-y-4'>
        {form.fields.map((f: any) => (
          <FieldEditor
            formType={formData ? 'update' : 'create'}
            formId={formId}
            formFormatId={formData?.id}
            editorMode={'builder'}
            key={f.id}
            field={f}
          />
        ))}
      </div>

      {form.fields?.length === 0 && (
        <div className='border-muted-foreground/30 bg-muted/30 flex h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center'>
          <div className='bg-primary/10 mb-4 rounded-full p-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='text-primary h-10 w-10'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 4v16m8-8H4'
              />
            </svg>
          </div>

          <h2 className='text-foreground text-xl font-semibold'>Let’s Build</h2>
          <p className='text-muted-foreground mt-2 max-w-sm text-sm'>
            Click the button below to start building.
          </p>
          <Button
            size='sm'
            className='bg-primary hover:bg-primary/90 text-primary-foreground mt-6 transition-all'
            onClick={() => addField('table')}
          >
            + Create Form Layout
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
