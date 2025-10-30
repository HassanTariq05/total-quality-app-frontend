import React, { useState } from 'react'
import { UpdateFormFormatPayload } from '@/services/form-format-services/form-format-services'
import { FormField } from '@/types/form'
import { X, Plus, Pencil, Trash } from 'lucide-react'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { cn } from '@/lib/utils'
import {
  useCreateFormFormat,
  useUpdateFormFormat,
} from '@/hooks/use-form-formats'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { CellEditorModal } from './table-cell-editor-modal'

export const FieldEditor: React.FC<{
  field: FormField
  editorMode: string
  formId: string
  formType: string
  formFormatId: string | undefined
}> = ({ field, editorMode, formId, formType, formFormatId }) => {
  const { updateField, removeField, form } = useFormBuilderStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCell, setEditingCell] = useState<{
    row: number
    col: number
    type: 'label' | 'field' | 'checkbox'
    value: string
    placeholder: string
    bg?: string
    alignment?: string
    cellFlex?: number
  } | null>(null)

  const openModal = (rowIdx: number, colIdx: number, cell: any) => {
    setEditingCell({
      row: rowIdx,
      col: colIdx,
      type: cell.type,
      placeholder: cell.placeholder,
      value: cell.value || (cell.type === 'label' ? 'Label' : ''),
      bg: cell.bg || '#1f1f1f',
      alignment: cell?.alignment || 'Field',
      cellFlex: cell?.cellFlex || 1,
    })
    setModalOpen(true)
  }

  const handleSaveCell = (
    type: 'label' | 'field' | 'checkbox' | 'date',
    value: string,
    bg?: string,
    placeholder?: string,
    alignment?: string,
    cellFlex?: number
  ) => {
    if (!editingCell) return
    const { row, col } = editingCell

    console.log('alignment: ', alignment)

    const newRows = field.rows.map((r, rIdx) =>
      rIdx === row
        ? r.map((c, cIdx) =>
            cIdx === col
              ? {
                  type,
                  value: value || (type === 'label' ? 'Label' : ''),
                  bg: bg || c.bg,
                  placeholder: placeholder ?? c.placeholder,
                  alignment: alignment ?? c.alignment,
                  cellFlex: cellFlex ?? c.cellFlex,
                }
              : c
          )
        : r
    )

    updateField(field.id, { rows: newRows })
  }

  const handleAddRow = () => {
    const newRow = [
      { type: 'field', value: '', bg: 'bg-card/40', placeholder: 'Field' },
    ]
    updateField(field.id, { rows: [...field.rows, newRow] })
  }

  const handleAddCell = (rowIdx: number) => {
    const newRows = field.rows.map((r, idx) =>
      idx === rowIdx
        ? [
            ...r,
            {
              type: 'field',
              value: '',
              bg: 'bg-card/40',
              placeholder: 'Field',
              alignment: 'left',
              flex: 1,
            },
          ]
        : r
    )
    updateField(field.id, { rows: newRows })
  }

  const handleDeleteRow = (rowIdx: number) => {
    updateField(field.id, { rows: field.rows.filter((_, i) => i !== rowIdx) })
  }

  const handleDeleteCell = (rowIdx: number, colIdx: number) => {
    const newRows = field.rows.map((r, rIdx) =>
      rIdx === rowIdx ? r.filter((_, cIdx) => cIdx !== colIdx) : r
    )
    updateField(field.id, { rows: newRows })
  }

  const createFormFormatMutation = useCreateFormFormat()
  const updateFormFormatMutation = useUpdateFormFormat()

  // const handleSubmit = () => {
  //   console.log('Submitted Structure: ', JSON.stringify(form, null, 2))
  // }

  const handleSubmit = () => {
    if (formType === 'update') {
      const data: UpdateFormFormatPayload = {
        format: JSON.stringify(form, null, 2),
        formId: formId,
      }
      updateFormFormatMutation.mutate({ id: formFormatId || '', payload: data })
    } else {
      createFormFormatMutation.mutate({
        format: JSON.stringify(form, null, 2),
        formId: formId,
      })
    }
  }

  return (
    <Card className='bg-card text-card-foreground border-border shadow-sm'>
      <CardHeader className='flex items-center justify-between'>
        <Input
          className='border-none bg-transparent text-lg font-semibold focus:outline-none focus-visible:ring-0'
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
        />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => removeField(field.id)}
          className='text-destructive hover:text-destructive/80'
        >
          <X className='h-4 w-4' />
        </Button>
      </CardHeader>

      <CardContent>
        <div className='max-h-none overflow-visible rounded'>
          <Table className='w-full table-fixed overflow-visible'>
            <TableBody>
              {field.rows.map((row, rIdx) => (
                <TableRow
                  key={rIdx}
                  className='flex w-full items-center justify-center'
                >
                  {row.map((cell, cIdx) => (
                    <TableCell
                      key={cIdx}
                      className={cn(
                        'h-full p-0', // no flex-1 here
                        cell.bg || 'bg-muted'
                      )}
                      style={{ flex: cell.cellFlex ?? 1 }}
                    >
                      <div
                        className={cn(
                          'flex h-full min-h-[52px] w-full items-center gap-2 p-2', // move padding here
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
                            disabled
                            className='bg-muted text-muted-foreground w-full text-sm'
                            placeholder={cell?.placeholder}
                          />
                        )}

                        {cell.type === 'checkbox' && (
                          <div className='flex items-center gap-1'>
                            <input type='checkbox' disabled />
                            <span className='text-foreground text-sm'>
                              {cell.value}
                            </span>
                          </div>
                        )}

                        {cell.type === 'date' && (
                          <Input
                            type='date'
                            disabled
                            className='bg-muted text-muted-foreground w-full text-sm'
                          />
                        )}

                        {/* Edit/Delete buttons */}

                        {editorMode === 'builder' && (
                          <>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => openModal(rIdx, cIdx, cell)}
                              className='text-muted-foreground h-5 w-5 p-0'
                              title='Edit cell'
                            >
                              <Pencil className='h-3 w-3' />
                            </Button>

                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleDeleteCell(rIdx, cIdx)}
                              className='text-destructive h-5 w-5 p-0'
                              title='Delete cell'
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  ))}

                  {editorMode === 'builder' && (
                    <>
                      <TableCell className='bg-muted flex w-10 flex-shrink-0 text-center'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleAddCell(rIdx)}
                          className='text-muted-foreground hover:text-foreground h-6 w-6 self-center rounded-full p-0 hover:bg-transparent'
                          title='Add cell'
                        >
                          <Plus className='h-3 w-3' />
                        </Button>
                      </TableCell>

                      {/* Delete row button */}
                      <TableCell className='bg-muted flex w-10 flex-shrink-0 text-center'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDeleteRow(rIdx)}
                          className='text-muted-foreground hover:text-destructive h-6 w-6 self-center rounded-full p-0 hover:bg-transparent'
                          title='Delete row'
                        >
                          <Trash className='h-3 w-3' />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='mt-3 flex justify-between'>
          <Button
            size='sm'
            className='bg-primary hover:bg-primary/90 text-primary-foreground'
            onClick={handleAddRow}
          >
            + Add Row
          </Button>

          <Button
            size='sm'
            className='bg-primary hover:bg-primary/90 text-primary-foreground'
            onClick={handleSubmit}
          >
            {formType === 'create' ? 'Create' : 'Update'}
          </Button>
        </div>
      </CardContent>

      {modalOpen && editingCell && (
        <CellEditorModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          cellType={editingCell.type}
          value={editingCell.value}
          bg={editingCell.bg}
          alignment={editingCell.alignment}
          placeholder={editingCell.placeholder}
          cellFlex={editingCell.cellFlex}
          onSave={handleSaveCell}
        />
      )}
    </Card>
  )
}
