import React, { useState } from 'react'
import { UpdateChecklistFormatPayload } from '@/services/checklist-format-services/checklist-format-services'
import { X, Plus, Pencil, Trash } from 'lucide-react'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { cn } from '@/lib/utils'
import {
  useCreateChecklistFormat,
  useUpdateChecklistFormat,
} from '@/hooks/use-checklist-formats'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { CellEditorModal } from './table-cell-editor-modal'

export const FieldEditor: React.FC<{
  field: any
  editorMode: string
  checklistId: string
  formType: string
  formFormatId: string | undefined
}> = ({ field, editorMode, checklistId, formType, formFormatId }) => {
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
    type: 'label' | 'field' | 'checkbox' | 'date' | 'signature',
    value: string,
    bg?: string,
    placeholder?: string,
    alignment?: string,
    cellFlex?: number
  ) => {
    if (!editingCell) return
    const { row, col } = editingCell

    const newRows = field.rows.map((r: any, rIdx: any) =>
      rIdx === row
        ? r.map((c: any, cIdx: any) =>
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
    const newRows = field.rows.map((r: any, idx: any) =>
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
    updateField(field.id, {
      rows: field.rows.filter((_: any, i: any) => i !== rowIdx),
    })
  }

  const handleDeleteCell = (rowIdx: number, colIdx: number) => {
    const newRows = field.rows.map((r: any, rIdx: any) =>
      rIdx === rowIdx ? r.filter((_: any, cIdx: any) => cIdx !== colIdx) : r
    )
    updateField(field.id, { rows: newRows })
  }

  const createChecklistFormatMutation = useCreateChecklistFormat()
  const updateChecklistFormatMutation = useUpdateChecklistFormat()

  // const handleSubmit = () => {
  //   console.log('Submitted Structure: ', JSON.stringify(form, null, 2))
  // }

  const handleSubmit = () => {
    if (formType === 'update') {
      const data: UpdateChecklistFormatPayload = {
        format: JSON.stringify(form, null, 2),
        checklistId: checklistId,
      }
      updateChecklistFormatMutation.mutate({
        id: formFormatId || '',
        payload: data,
      })
    } else {
      createChecklistFormatMutation.mutate({
        format: JSON.stringify(form, null, 2),
        checklistId: checklistId,
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
              {field.rows.map((row: any, rIdx: any) => (
                <TableRow
                  key={rIdx}
                  className='flex w-full items-center justify-center'
                >
                  {row.map((cell: any, cIdx: any) => (
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
                          'group flex h-full min-h-[52px] w-full items-center gap-2 p-2',
                          {
                            'justify-start': cell.alignment === 'left',
                            'justify-center': cell.alignment === 'center',
                            'justify-end': cell.alignment === 'right',
                          }
                        )}
                      >
                        {cell.type === 'label' && (
                          <span className='text-foreground text-sm break-words whitespace-normal'>
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

                        {cell.type === 'signature' && (
                          <div className='border-muted-foreground/50 flex h-[36px] w-full flex-col justify-end border-b border-dashed p-2 text-center'>
                            <span className='text-muted-foreground text-xs'>
                              Signature
                            </span>
                          </div>
                        )}

                        {/* Edit/Delete buttons — inline and only visible on hover */}
                        {editorMode === 'builder' && (
                          <div className='ml-0 hidden items-center gap-1 transition-all duration-150 group-hover:flex'>
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
                              className='text-muted-foreground h-5 w-5 p-0'
                              title='Delete cell'
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </div>
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
