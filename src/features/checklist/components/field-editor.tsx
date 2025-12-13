import React, { useState } from 'react'
import { UpdateChecklistFormatPayload } from '@/services/checklist-format-services/checklist-format-services'
import {
  X,
  Plus,
  Pencil,
  Trash,
  Copy,
  ClipboardPaste,
  PlusSquare,
  Loader2,
} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useFormBuilderStore } from '@/stores/useFormBuilderStore'
import { cn } from '@/lib/utils'
import {
  useCreateChecklistFormat,
  useDeleteChecklistFormat,
  useUpdateChecklistFormat,
} from '@/hooks/use-checklist-formats'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableRow, TableCell, TableBody } from '@/components/ui/table'
import { DeleteDialog } from '@/features/accreditation/components/delete-dialog'
import { HeaderDropdown } from './HeaderDropdown'
import { CellContent } from './cell-content'
import { useChecklists } from './checklist-provider'
import { SettingsModal } from './settings-modal'
import CellEditorModal from './table-cell-editor-modal'

export const FieldEditor: React.FC<{
  field: any
  editorMode: string
  checklistId: string
  formType: string
  formFormatId: string | undefined
}> = ({ field, editorMode, checklistId, formType, formFormatId }) => {
  const { updateField, removeField, form, updateFormWidth } =
    useFormBuilderStore()

  const { open, setOpen } = useChecklists()

  const [modalOpen, setModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [copiedRow, setCopiedRow] = useState<any[] | null>(null)
  const [deleteFormId, setDeleteFormId] = useState('')
  const [editingCell, setEditingCell] = useState<{
    row: number
    col: number
    childIdx?: string
    type: 'label' | 'field' | 'checkbox'
    value: string
    identifier?: string
    placeholder: string
    bg?: string
    alignment?: string
    cellFlex?: number
    linkTextValue?: string
    linkUrlValue?: string
  } | null>(null)

  const openModal = (
    rowIdx: number,
    colIdx: number,
    cell: any,
    childIdx?: string
  ) => {
    setEditingCell({
      row: rowIdx,
      col: colIdx,
      childIdx,
      type: cell.type,
      placeholder: cell.placeholder,
      value: cell.value || (cell.type === 'label' ? 'Label' : ''),
      identifier: cell.identifier,
      bg: cell.bg || '#1f1f1f',
      alignment: cell.alignment || 'left',
      cellFlex: cell.cellFlex || 1,
      linkTextValue: cell.linkText,
      linkUrlValue: cell.linkUrl,
    })

    setModalOpen(true)
  }

  const handleSaveSettings = (inputWidth: number | undefined) => {
    const width = inputWidth && inputWidth > 0 ? inputWidth : null
    updateFormWidth(width)
  }

  const handleSaveCell = (
    type: 'label' | 'field' | 'checkbox' | 'date' | 'signature' | 'link',
    value: string,
    identifier: string,
    bg?: string,
    placeholder?: string,
    alignment?: string,
    cellFlex?: number,
    linkText?: string,
    linkUrl?: string
  ) => {
    if (!editingCell) return
    const { row, col, childIdx } = editingCell

    const isLink = type === 'link'

    const newRows = field.rows.map((r: any, rIdx: any) => {
      if (rIdx !== row) return r

      return r.map((c: any, cIdx: any) => {
        if (cIdx !== col) return c

        const baseUpdate = {
          type,
          value: !isLink ? value || (type === 'label' ? 'Label' : '') : '',
          identifier,
          bg: bg || c.bg,
          placeholder: placeholder ?? c.placeholder,
          alignment: alignment ?? c.alignment,
          cellFlex: cellFlex ?? c.cellFlex,
          ...(isLink && {
            linkText: linkText || value,
            linkUrl: linkUrl || '',
          }),
        }

        if (typeof childIdx === 'number') {
          const updatedChildren = c.children.map((child: any, i: number) =>
            i === childIdx
              ? {
                  ...child,
                  id: child.id || uuidv4(),
                  ...baseUpdate,
                }
              : child
          )
          return { ...c, children: updatedChildren }
        }

        return {
          ...c,
          id: c.id || uuidv4(),
          ...baseUpdate,
        }
      })
    })

    updateField(field.id, { rows: newRows })
  }

  const handleDeleteChildCell = (
    rowIdx: string,
    colIdx: string,
    childIdx: string
  ) => {
    const newRows = field.rows.map((r: any, rIdx: string) => {
      if (rIdx !== rowIdx) return r
      return r.map((c: any, cIdx: string) => {
        if (cIdx !== colIdx) return c
        return {
          ...c,
          children:
            c.children?.filter((_: any, i: string) => i !== childIdx) || [],
        }
      })
    })

    updateField(field.id, { rows: newRows })
  }

  const handleAddRow = () => {
    const newRow = [
      {
        id: uuidv4(),
        type: 'field',
        value: '',
        identifier: '',
        bg: 'bg-card/40',
        placeholder: 'Field',
      },
    ]
    updateField(field.id, { rows: [...field.rows, newRow] })
  }

  const handleAddCell = (rowIdx: number) => {
    const newRows = field.rows.map((r: any, idx: any) =>
      idx === rowIdx
        ? [
            ...r,
            {
              id: uuidv4(),
              type: 'field',
              value: '',
              identifier: '',
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

  const handleCopyRow = (rowIdx: number) => {
    const rowToCopy = field.rows[rowIdx]
    // Store a deep copy to avoid reference mutation
    const clonedCopy = rowToCopy.map((cell: any) => ({ ...cell }))
    setCopiedRow(clonedCopy)
  }

  const handlePasteRow = (rowIdx: number) => {
    if (!copiedRow) return

    // Create a new row with fresh UUIDs
    const newRow = copiedRow.map((cell: any) => ({
      ...cell,
      id: uuidv4(),
    }))

    const newRows = [
      ...field.rows.slice(0, rowIdx + 1),
      newRow,
      ...field.rows.slice(rowIdx + 1),
    ]

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
  const deleteChecklistFormatMutation = useDeleteChecklistFormat()

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

  const handleDeleteForm = () => {
    removeField(deleteFormId)
    deleteChecklistFormatMutation.mutate(formFormatId || '')
  }

  const handleAddVerticalCell = (rowIdx: number, colIdx: number) => {
    const newRows = field.rows.map((r: any, rIdx: number) => {
      if (rIdx !== rowIdx) return r
      return r.map((c: any, cIdx: number) => {
        if (cIdx !== colIdx) return c
        const newChild = {
          id: uuidv4(),
          type: 'field',
          value: '',
          identifier: '',
          placeholder: 'Field',
        }
        return {
          ...c,
          children: [...(c.children || []), newChild],
        }
      })
    })

    updateField(field.id, { rows: newRows })
  }

  const effectiveWidth =
    form.formWidth && form.formWidth > 0 ? form.formWidth : null

  return (
    <Card className='bg-card text-card-foreground border-border shadow-sm'>
      <CardHeader className='flex items-center justify-between'>
        <Input
          className='border-none bg-transparent text-lg font-semibold focus:outline-none focus-visible:ring-0'
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
        />
        <HeaderDropdown
          fieldId={field.id}
          onOpenDelete={() => {
            setOpen('delete')
            setDeleteFormId(field.id)
          }}
          onOpenSettings={() => {
            setSettingsModalOpen(true)
          }}
        />
      </CardHeader>

      <CardContent>
        <div className='max-h-none overflow-visible rounded'>
          <Table className='w-full overflow-visible'>
            <TableBody>
              {field.rows.map((row: any, rIdx: any) => (
                <TableRow
                  key={rIdx}
                  className='flex items-center justify-center'
                  style={{
                    width: effectiveWidth ? `${effectiveWidth}px` : '100%',
                    maxWidth: effectiveWidth ? `${effectiveWidth}px` : '100%',
                  }}
                >
                  {row.map((cell: any, cIdx: any) => (
                    <TableCell
                      key={cIdx}
                      className={cn(
                        'h-full flex-shrink-0 p-0',
                        cell.bg || 'bg-muted'
                      )}
                      style={{
                        flex: cell.cellFlex ?? 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        className={cn(
                          'group relative flex h-full min-h-[52px] w-full flex-col gap-2 p-2',
                          {
                            'justify-center text-left':
                              cell.alignment === 'left',
                            'justify-center text-center':
                              cell.alignment === 'center',
                            'justify-center text-right':
                              cell.alignment === 'right',
                          }
                        )}
                      >
                        <div className='flex w-full items-center justify-between gap-2'>
                          <CellContent cell={cell} rIdx={rIdx} cIdx={cIdx} />

                          {editorMode === 'builder' && (
                            <div className='bg-background/90 ring-border absolute top-0 -right-6 z-20 hidden items-center gap-1 rounded-md p-1 shadow-sm ring-1 group-hover:flex'>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => openModal(rIdx, cIdx, cell)}
                                className='text-muted-foreground hover:text-foreground h-5 w-5 p-0'
                                title='Edit cell'
                              >
                                <Pencil className='h-3 w-3' />
                              </Button>

                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() =>
                                  handleAddVerticalCell(rIdx, cIdx)
                                }
                                className='text-muted-foreground hover:text-foreground h-5 w-5 p-0'
                                title='Add vertical cell'
                              >
                                <PlusSquare className='h-3 w-3' />
                              </Button>

                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleDeleteCell(rIdx, cIdx)}
                                className='text-muted-foreground hover:text-destructive h-5 w-5 p-0'
                                title='Delete cell'
                              >
                                <X className='h-3 w-3' />
                              </Button>
                            </div>
                          )}
                        </div>

                        {cell.children?.map((child: any, childIdx: string) => (
                          <div
                            key={child.id}
                            className='border-border flex w-full flex-col border-t pt-2'
                          >
                            <div className='group flex w-full items-center justify-between'>
                              <CellContent
                                cell={child}
                                rIdx={rIdx}
                                cIdx={cIdx}
                                childIdx={childIdx}
                              />

                              {editorMode === 'builder' && (
                                <div className='hidden items-center gap-1 group-hover:flex'>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() =>
                                      openModal(rIdx, cIdx, child, childIdx)
                                    }
                                    className='text-muted-foreground h-5 w-5 p-0'
                                    title='Edit child cell'
                                  >
                                    <Pencil className='h-3 w-3' />
                                  </Button>

                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() =>
                                      handleAddVerticalCell(rIdx, cIdx)
                                    }
                                    className='text-muted-foreground hover:text-foreground h-5 w-5 p-0'
                                    title='Add vertical cell'
                                  >
                                    <PlusSquare className='h-3 w-3' />
                                  </Button>

                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() =>
                                      handleDeleteChildCell(
                                        rIdx,
                                        cIdx,
                                        childIdx
                                      )
                                    }
                                    className='text-muted-foreground h-5 w-5 p-0'
                                    title='Delete child cell'
                                  >
                                    <X className='h-3 w-3' />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
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

                      <TableCell className='bg-muted flex w-10 flex-shrink-0 text-center'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleCopyRow(rIdx)}
                          className='text-muted-foreground hover:text-foreground h-6 w-6 self-center rounded-full p-0 hover:bg-transparent'
                          title='Copy row'
                        >
                          <Copy className='h-3 w-3' />
                        </Button>
                      </TableCell>

                      {copiedRow && (
                        <TableCell className='bg-muted flex w-10 flex-shrink-0 text-center'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handlePasteRow(rIdx)}
                            className='text-muted-foreground hover:text-foreground h-6 w-6 self-center rounded-full p-0 hover:bg-transparent'
                            title='Paste copied row below'
                          >
                            <ClipboardPaste className='h-3 w-3' />
                          </Button>
                        </TableCell>
                      )}

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
            disabled={
              createChecklistFormatMutation.isPending ||
              updateChecklistFormatMutation.isPending
            }
          >
            {(createChecklistFormatMutation.isPending ||
              updateChecklistFormatMutation.isPending) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </div>
      </CardContent>

      {modalOpen && editingCell && (
        <CellEditorModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          cellType={editingCell.type}
          value={editingCell.value}
          identifier={editingCell.identifier}
          bg={editingCell.bg}
          alignment={editingCell.alignment}
          placeholder={editingCell.placeholder}
          cellFlex={editingCell.cellFlex}
          linkTextValue={editingCell.linkTextValue}
          linkUrlValue={editingCell.linkUrlValue}
          onSave={handleSaveCell}
        />
      )}

      {settingsModalOpen && (
        <SettingsModal
          open={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          formWidthValue={effectiveWidth}
          onSave={handleSaveSettings}
        />
      )}

      <DeleteDialog
        open={open === 'delete'}
        title='Confirm'
        description='Are you sure to delete this checklist format?'
        onOpenChange={() => setOpen('delete')}
        onConfirm={() => handleDeleteForm()}
      />
    </Card>
  )
}
